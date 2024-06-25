import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates, startScene, sendSocket } from '../functions/functions.js';
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
            switchScenes('DeckEditorScene', 'DecksScene')
        })
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, false)

        this.decks = instantiateDecks(this, player.decks)

        for (let deck in this.decks) {
            this.mainContainer.addItem(this.decks[deck]);
        }
        this.mainContainer.addItem(newDeckButton)

        this.mainContainer.updateLayout(0.55, 110, 80, 60, 4);
        this.mainContainer.disableInteractive()

    }

    editDeck() {
        this.mainContainer.destroy()

    }

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


