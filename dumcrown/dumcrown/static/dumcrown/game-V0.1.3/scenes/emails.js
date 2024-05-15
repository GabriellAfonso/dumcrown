import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sleep } from '../functions/functions.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';
import { Button, close_button } from '../functions/buttons.js';
import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { createAllCards } from '../cards/base.js';
import { WrapperContainer } from '../objects/WrapperContainer.js'


export class EmailsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EmailsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'decks_background');
        // showCoordinates(this)
        const close = close_button(this, 1460, 35, 'HomeScene', 'EmailsScene', 0.4)
        close.setDepth(4)

        this.title = add_text(this, 954, 35, '', '30px', 0.5)
        this.title.setStyle({ fontStyle: 'bold' })
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, false)
        this.myDecks()


        this.decksButton = new Button(this, 204, 155, 'decks_select_button', () => {
            this.myDecks()
        })
        this.decksButtonText = add_text(this, 204, 155, 'MEUS DECKS', '25px', 0.5)
        this.decksButtonText.setStyle({ fontStyle: 'bold' })


        this.cardsButton = new Button(this, 204, 255, 'decks_select_button', () => {
            this.myCards()
        })
        this.cardsButtonText = add_text(this, 204, 255, 'MINHAS CARTAS', '25px', 0.5)
        this.cardsButtonText.setStyle({ fontStyle: 'bold' })





    }
    myCards() {
        this.title.text = 'CARTAS'
        this.mainContainer.destroy()
        this.mainContainer = new WrapperContainer(this, 954, centerY, 670, true)
        this.cards = createAllCards(this, true)

        // this.cards[10].setVisible(true)
        for (let id in this.cards) {
            if (this.cards.hasOwnProperty(id)) {
                this.mainContainer.addItem(this.cards[id]);
            }
        }
        this.mainContainer.updateLayout(0.55, 80, 80, 60, 4);
    }
    myDecks() {
        this.title.text = 'DECKS'
        this.mainContainer.destroy()
    }


    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
