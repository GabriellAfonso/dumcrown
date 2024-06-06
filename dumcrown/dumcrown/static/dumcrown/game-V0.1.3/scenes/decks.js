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


export class DecksScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DecksScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'decks_background');
        //showCoordinates(this)
        const close = close_button(this, 1460, 35, 'HomeScene', 'DecksScene', 0.4)
        close.setDepth(4)
        this.input.topOnly = false;
        this.title = add_text(this, 954, 35, '', '30px', 0.5)
        this.title.setStyle({ fontStyle: 'bold' })
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, false)
        this.myDecks()


        this.decksButton = new Button(this, 202, 155, 'decks_select_button', () => {
            this.myDecks()
        })
        this.decksButtonText = add_text(this, 202, 155, 'MEUS DECKS', '25px', 0.5)
        this.decksButtonText.setStyle({ fontStyle: 'bold' })


        this.cardsButton = new Button(this, 202, 255, 'decks_select_button', () => {
            this.myCards()
        })
        this.cardsButtonText = add_text(this, 202, 255, 'MINHAS CARTAS', '25px', 0.5)
        this.cardsButtonText.setStyle({ fontStyle: 'bold' })





    }
    myCards() {
        this.mainContainer.destroy()
        this.title.text = 'CARTAS'
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, true)
        // this.cards = createAllCards(this, true)
        this.cards = instantiateCards(this, player.cards)
        for (let id in this.cards) {
            this.mainContainer.addItem(this.cards[id]);
        }
        this.mainContainer.updateLayout(0.55, 80, 80, 60, 4);
    }
    myDecks() {
        this.mainContainer.destroy()
        this.title.text = 'DECKS'
        var newDeckButton = new Button(this, 0, 0, 'add_new_deck', () => {
            startScene('DeckEditorScene')
        })
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, false)
        this.decks = instantiateDecks(this, player.decks)
        // this.decks2 = instantiateDecks(this, player.decks)
        // this.decks3 = instantiateDecks(this, player.decks)
        // this.decks4 = instantiateDecks(this, player.decks)
        // this.decks5 = instantiateDecks(this, player.decks)
        // this.decks6 = instantiateDecks(this, player.decks)
        // this.decks7 = instantiateDecks(this, player.decks)
        // this.decks8 = instantiateDecks(this, player.decks)
        for (let deck in this.decks) {
            this.mainContainer.addItem(this.decks[deck]);
        }
        // for (let deck in this.decks2) {
        //     this.mainContainer.addItem(this.decks2[deck]);
        // }
        // for (let deck in this.decks3) {
        //     this.mainContainer.addItem(this.decks3[deck]);
        // }
        // for (let deck in this.decks4) {
        //     this.mainContainer.addItem(this.decks4[deck]);
        // }

        // for (let deck in this.decks5) {
        //     this.mainContainer.addItem(this.decks5[deck]);
        // }
        // for (let deck in this.decks6) {
        //     this.mainContainer.addItem(this.decks6[deck]);
        // }
        // for (let deck in this.decks7) {
        //     this.mainContainer.addItem(this.decks7[deck]);
        // }
        // for (let deck in this.decks8) {
        //     this.mainContainer.addItem(this.decks8[deck]);
        // }
        this.mainContainer.addItem(newDeckButton)

        this.mainContainer.updateLayout(0.55, 110, 80, 60, 4);

    }

    editDeck() {
        this.mainContainer.destroy()

    }
    // myDecks() {
    //     this.title.text = 'DECKS'
    //     this.mainContainer.destroy()
    //     this.mainContainer = new WrapperContainer(this, 954, centerY, 670, false)
    //     for (var deck in player.decks) {
    //         var deck_img = this.add.image(0, 0, 'runeterra')
    //         this.mainContainer.addItem(deck_img)
    //     }
    //     this.mainContainer.updateLayout(0.55, 80, 80, 60, 4);

    // }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}

export class CardDetailScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CardDetailScene' });
    }

    // O método init permite receber os parâmetros passados ao iniciar a cena
    init(data) {
        this.cardDetails = data;

    }

    create() {
        // Agora você pode acessar os detalhes da carta usando this.cardDetails
        const card = this.cardDetails;

        const background = this.add.image(centerX, centerY, 'blackground');
        background.setInteractive()
        background.alpha = 0.7



        const showCard = card.clone();
        this.add.existing(showCard);

        showCard.setPosition(centerX, centerY)
        showCard.setScale(1)
        showCard.setVisible(true);

        background.on('pointerup', () => {
            GAME.scene.stop('CardDetailScene')
            // showCard.destroy()
        });
    }
}


export class DeckEditorScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DeckEditorScene' });
    }

    // O método init permite receber os parâmetros passados ao iniciar a cena
    init(data = {}) {
        this.deckData = data;
    }

    create() {
        const background = this.add.image(centerX, centerY, 'decks_background');
        const close = close_button(this, 1460, 35, 'DecksScene', 'DeckEditorScene', 0.4)
        close.setDepth(4)
        showCoordinates(this)

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
        compressedDeck(player.decks[0].cards)
        // var teste = new compressedCardObject(this, cardsDATA['1'])
        var teste2 = new compressedCardObject(this, cardsDATA['s1'])
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, true)
        this.cards = instantiateCards(this, player.cards)
        for (let id in this.cards) {
            this.cards[id].off('pointerup')
            this.cards[id].deckEdit()

            this.mainContainer.addItem(this.cards[id]);
        }
        this.mainContainer.updateLayout(0.55, 80, 80, 60, 4);
    }
}