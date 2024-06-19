import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates, startScene } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';
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



class DeckIDManager {
    constructor() {
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
            console.log("Não é possível adicionar mais IDs. Limite total de 30 IDs alcançado.");
            return false;
        }



        // Verificar se o ID específico não excede o limite máximo de 3
        if (this.idCount[id] >= this.maxCountPerID) {
            console.log(`O ID '${id}' não pode ser adicionado mais de ${this.maxCountPerID} vezes.`);
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
        this.deckManager = new DeckIDManager();



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
        this.a =


            this.compressedDeckContainer = new WrapperContainer(this, 204, centerY, 400, true)


        this.saveDeckButton = new Button(this, 202, 660, 'save_deck', () => {
            var data = {
                id: this.deckData.id,
                name: this.deckname.node.value,
                cards: this.deckManager.getIDList(),
            }
            console.log(data)
        })
        this.saveDeckButton.setScale(0.8)



        if (Object.keys(this.deckData).length > 1) {
            this.deckManager.addList(this.deckData.cards)
            this.deckname.node.value = this.deckData.name
            var deck = compressedDeck(this, this.deckData.cards)
            console.log(this.deckData.cards)

            for (const [key, item] of Object.entries(deck)) {
                this.compressedDeckContainer.addItem(item)
            }
            this.compressedDeckContainer.updateLayout(1, 150, 20, 10, 1)
        }

        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, true)
        this.cards = instantiateCards(this, player.cards)
        for (let id in this.cards) {
            this.cards[id].off('pointerup')
            this.cards[id].deckEdit()

            this.mainContainer.addItem(this.cards[id]);
        }
        this.mainContainer.updateLayout(0.55, 80, 80, 60, 4);

        this.events.on('shutdown', this.shutdown, this);
        this.events.on('addToDeck', this.addToDeck, this)

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
            //TODO: quando mudar o numero subir o container pra onde foi alterado
            this.compressedDict[cardID].setQuantity(quantity);


        }





    }
    shutdown() {

        this.events.off('addToDeck')
        console.log('Scene shutdown, deckData cleared');
    }

}


