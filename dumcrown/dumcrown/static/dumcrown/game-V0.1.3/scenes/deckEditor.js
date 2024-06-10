import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates, startScene } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sleep } from '../functions/functions.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';
import { Button, close_button } from '../functions/buttons.js';
import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { compressedDeck, createAllCards, instantiateCards } from '../cards/functions.js';
import { WrapperContainer } from '../objects/WrapperContainer.js'
import { cardsDATA, player } from '../client/client.js';
import { instantiateDecks } from '../objects/deck_layout.js';
import { compressedCardObject } from '../cards/base.js';


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

        this.saveDeckButton = new Button(this, 202, 660, 'save_deck', () => {

        })
        this.saveDeckButton.setScale(0.8)

        this.compressedDeckContainer = new WrapperContainer(this, 204, centerY, 400, true)


        if (Object.keys(this.deckData).length >= 2) {
            console.log(this.deckData)
            this.deckname.node.value = this.deckData.name
            var deck = compressedDeck(this, this.deckData.cards)

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
    }

    shutdown() {
        // Limpar dados ao parar a cena
        this.deckData = null;
        console.log('Scene shutdown, deckData cleared');
    }

}