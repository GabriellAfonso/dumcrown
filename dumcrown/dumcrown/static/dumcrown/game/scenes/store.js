import { simpleTextTweens } from '../animations/scripts/functions.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { Button } from '../functions/buttons.js';

import { switchScenes, logoutAjax, showCoordinates, sendSocket } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { sfx } from '../soundfx/sounds.js';
export class StoreScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScreen' });
    }

    create() {
        const background = this.add.image(centerX, centerY, 'store_background');
        this.completeErrorStoreMessage = true
        this.title = add_text(this, centerX, 35, 'Loja', '50px', 0.5)
        this.title.setStyle({ fontStyle: 'bold' })
        const x_close = new Button(this, 1460, 35, 'x_close', () => {
            switchScenes('HomeScene', 'StoreScreen')
        }, { color: 0xffff00, clickSound: sfx.closeSound, });
        x_close.setScale(0.4)
        // showCoordinates(this)
        const cardsItemText = add_text(this, centerX, 200, 'Carta\nAleatória', '50px', 0.5)
        cardsItemText.setOrigin(0.5)
        cardsItemText.setStyle({ fontStyle: 'bold', align: 'center' })
        const cardsItem = this.add.image(centerX, centerY, 'cards_item')
        cardsItem.setScale(0.8)

        const cardsItemPrice = add_text(this, centerX + 20, centerY + 150, '1000', '40px', 0.5)
        cardsItemPrice.setOrigin(0.5)
        const crystalIcon = this.add.image(centerX - 60, centerY + 150, 'crystals')
        const cardItemBuyButton = new Button(this, centerX, centerY + 230, 'cancel_button', () => {
            sendSocket('buy_random_card')
        })
        const buyText = add_text(this, centerX, centerY + 230, 'Comprar', '40px', 0.5)

        this.events.on('errorMessageStore', this.errorMessage, this)
    }
    errorMessage(message) {
        if (this.completeErrorStoreMessage) {
            this.completeErrorStoreMessage = false

            this.message = this.add.text(centerX, centerY - 350, message,
                {
                    fontSize: '60px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#DC143C'
                })
            this.message.alpha = 0
            this.message.setOrigin(0.5)
            this.messageAnimation = simpleTextTweens(this, this.message, centerX, centerY - 280, 10, 0, 200, 1, () => {
                simpleTextTweens(this, this.message, centerX, centerY - 280, 10, 0, 500, 0, () => {
                    this.completeErrorStoreMessage = true
                }, 1400)
            })
        }
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
