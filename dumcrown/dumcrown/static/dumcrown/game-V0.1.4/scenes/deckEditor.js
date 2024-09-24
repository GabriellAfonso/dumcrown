import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates, startScene, sendSocket } from '../functions/functions.js';
import { simpleTextTweens, simpleTweens } from '../animations/scripts/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sleep } from '../functions/functions.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';
import { Button, close_button } from '../functions/buttons.js';
import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { compressCard, compressedDeck, createAllCards, instantiateCards } from '../cards/functions.js';
import { WrapperContainer } from '../objects/WrapperContainer.js'
import { cardsDATA, player } from '../client/client.js';
import { instantiateDecks } from '../objects/deck_layout.js';
import { compressedCardObject } from '../cards/base.js';
import { Warning } from '../objects/warning.js';



class DeckIDManager {
    constructor(scene) {
        this.scene = scene
        this.idList = [];
        this.idCount = {};
        this.maxCountPerID = 3;
        this.maxTotalIDs = 30;
    }
    addList(list) {
        list.forEach(id => {
            this.addID(id)
        })
    }

    addID(id) {
        var id = id.toString()
        // Verificar se o total de IDs não excede o limite máximo
        if (this.idList.length >= this.maxTotalIDs) {

            var msg = "Não é possível adicionar mais de 30 cartas"
            this.scene.invalidDeck(msg)
            return false;
        }



        // Verificar se o ID específico não excede o limite máximo de 3
        if (this.idCount[id] >= this.maxCountPerID) {
            console.log(`O ID '${id}' não pode ser adicionado mais de ${this.maxCountPerID} vezes.`);
            this.scene.maxCardMessage()
            return false;
        }

        // Adicionar o ID à lista e atualizar a contagem
        this.idList.push(id);
        if (this.idCount[id]) {
            this.idCount[id]++;
        } else {
            this.idCount[id] = 1;
        }


        console.log(`ID '${id}' adicionado. Contagem atual: ${this.idCount[id]}`);
        return true;
    }

    getIDList() {
        return this.idList;
    }

    getIDCount(id) {
        // Retorna a contagem do ID especificado, ou 0 se o ID não estiver na lista
        return this.idCount[id] || 0;
    }

    removeCard(target) {
        target = target.toString();
        const index = this.idList.indexOf(target);

        if (index !== -1) {
            // Remove a string da lista
            this.idList.splice(index, 1);
            this.idCount[target]--;
            if (this.idCount[target] === 0) {
                delete this.idCount[target];
            }
            console.log(`ID '${target}' removido. Contagem atual: ${this.idCount[target] || 0}`);
            return true;
        } else {
            console.log(`ID '${target}' não encontrado na lista.`);
            return false;
        }
    }
}



export class DeckEditorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeckEditorScene' });
    }

    init(data) {
        this.deckData = data;
    }

    create() {
        const background = this.add.image(centerX, centerY, 'decks_background');
        const close = close_button(this, 1460, 35, 'DecksScene', 'DeckEditorScene', 0.4)
        close.setDepth(4)
        this.compressedDict = {}
        this.deckManager = new DeckIDManager(this);
        this.completeMaxCardMessage = true
        this.completeInvalidDeckMessage = true
        this.completeSuccessDeckMessage = true



        this.deckname = this.add.dom(202, 60, 'input', {
            type: 'text', id: 'deckname',
            width: '300px', height: '60px',
            fontSize: '25px', outline: 'none', borderRadius: '10px',
            backgroundColor: '#44334f', border: '2px solid #555555',
            textAlign: 'center',
        });
        this.deckname.node.placeholder = "Nome do Deck";
        this.input.on('pointerdown', () => {
            this.deckname.node.blur();
        });


        this.compressedDeckContainer = new WrapperContainer(this, 204, centerY, 400, true)


        this.saveDeckButton = new Button(this, 202, 660, 'save_deck', () => {
            if (this.deckname.node.value.length < 1) {
                this.invalidDeck('Seu deck precisa de um nome')
                return
            }

            if (this.deckname.node.value.length > 15) {
                this.invalidDeck('Nome pode conter só ate 15 caracteres')
                return
            }

            var data = {
                id: this.deckData.id !== undefined ? this.deckData.id : 0,
                name: this.deckname.node.value,
                cards: this.deckManager.getIDList(),
            }

            //TODO: verificar se tem 30 cartas
            console.log(data)
            sendSocket('save_deck', data)
            sendSocket('get_player_data');
        })
        this.saveDeckButton.setScale(0.8)



        if (Object.keys(this.deckData).length > 1) {
            this.createDeleteButton()
            this.deckManager.addList(this.deckData.cards)
            this.deckname.node.value = this.deckData.name
            var deck = compressedDeck(this, this.deckData.cards)
            console.log(this.deckData.cards)

            for (const [key, item] of Object.entries(deck)) {
                this.compressedDeckContainer.addItem(item)
                this.compressedDict[item.id] = item
            }
            this.compressedDeckContainer.updateLayout(1, 150, 20, 10, 1)
        }

        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, true)
        this.cards = instantiateCards(this, player.cards)
        for (let id in this.cards) {
            this.cards[id].off('pointerup')
            this.cards[id].deckEdit()

            this.mainContainer.addItem(this.cards[id]);

            const quantity = this.deckManager.getIDCount(id)
            if (quantity == 3) {
                this.cards[id].emit('lockCard')
            }
        }
        this.mainContainer.updateLayout(0.55, 80, 80, 60, 4);

        this.events.on('shutdown', this.shutdown, this);
        this.events.on('addToDeck', this.addToDeck, this)
        this.events.on('invalidDeck', this.invalidDeck, this)
        this.events.on('successDeck', this.SuccessMessage, this)
        this.events.on('remove_from_deck', this.RemoveFromDeck, this)

    }
    addToDeck(cardID) {
        console.log('addeu', cardID)

        if (this.deckManager.addID(cardID)) {
            const quantity = this.deckManager.getIDCount(cardID)
            if (quantity == 1) {
                this.compressedDict[cardID] = compressCard(this, cardID)
                this.compressedDeckContainer.addItem(this.compressedDict[cardID])
                this.compressedDeckContainer.updateLayout(1, 150, 20, 10, 1)
                this.compressedDeckContainer.scrollToLowerLimit()
            }
            if (quantity == 3) {
                this.cards[cardID].emit('lockCard')
            }
            //TODO: quando mudar o numero subir o container pra onde foi alterado
            this.compressedDict[cardID].setQuantity(quantity);
        }
    }
    RemoveFromDeck(card) {
        console.log('remove from deck')
        this.cards[card.id].emit('unlockCard')

        this.deckManager.removeCard(card.id)
        const quantity = this.deckManager.getIDCount(card.id)
        this.compressedDict[card.id].setQuantity(quantity);

        if (quantity == 0) {
            this.compressedDeckContainer.removeItem(card, 200)
            sleep(this, 200, () => {
                this.compressedDeckContainer.updateLayout(1, 150, 20, 10, 1)
            })
        }
    }

    createDeleteButton() {
        var data = {
            id: this.deckData.id !== undefined ? this.deckData.id : 0,
            name: this.deckname.node.value,
            cards: this.deckManager.getIDList(),
        }
        this.deleteDeckButton = new Button(this, 1300, 30, 'delete_deck', () => {
            sendSocket('delete_deck', data)
            sendSocket('get_player_data');
            sleep(this, 200, () => {
                switchScenes('DecksScene', 'DeckEditorScene')
            })
        }, { color: 0xff0ff0, })
        this.deleteDeckButton.setScale(0.4)
        this.deleteDeckText = add_text(this, 1300, 30, 'DELETAR DECK', '15px', 0.5)
        this.deleteDeckText.setStyle({ fontStyle: 'bold' })
    }

    maxCardMessage() {
        if (this.completeMaxCardMessage) {
            this.completeMaxCardMessage = false

            this.message = this.add.text(centerX, centerY - 50, 'quantidade máxima da mesma carta',
                {
                    fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#FFD700'
                })
            this.message.alpha = 0
            this.message.setOrigin(0.5)
            this.messageAnimation = simpleTextTweens(this, this.message, centerX, centerY, 10, 0, 200, 1, () => {
                simpleTextTweens(this, this.message, centerX, centerY, 10, 0, 500, 0, () => {
                    this.completeMaxCardMessage = true
                }, 1400)
            })
        }
    }

    SuccessMessage(message) {
        if (this.completeSuccessDeckMessage) {
            this.completeSuccessDeckMessage = false

            this.message2 = this.add.text(centerX, centerY - 50, message,
                {
                    fontSize: '60px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#32CD32'
                })
            this.message2.alpha = 0
            this.message2.setOrigin(0.5)
            this.messageAnimation = simpleTextTweens(this, this.message2, centerX, centerY, 10, 0, 200, 1, () => {
                simpleTextTweens(this, this.message2, centerX, centerY, 10, 0, 500, 0, () => {
                    this.completeSuccessDeckMessage = true
                }, 1400)
            })
        }
    }
    invalidDeck(message) {
        if (this.completeInvalidDeckMessage) {
            this.completeInvalidDeckMessage = false

            this.message2 = this.add.text(centerX, centerY - 50, message,
                {
                    fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#FFD700'
                })
            this.message2.alpha = 0
            this.message2.setOrigin(0.5)
            this.messageAnimation = simpleTextTweens(this, this.message2, centerX, centerY, 10, 0, 200, 1, () => {
                simpleTextTweens(this, this.message2, centerX, centerY, 10, 0, 500, 0, () => {
                    this.completeInvalidDeckMessage = true
                }, 1400)
            })
        }
    }
    shutdown() {

        this.events.off('addToDeck')
        this.events.off('remove_from_deck')
        this.events.off('invalidDeck')
        this.events.off('successDeck')
        console.log('Scene shutdown, deckData cleared');
    }

}


