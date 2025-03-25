import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sleep } from '../functions/functions.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';
import { Button, close_button } from '../functions/buttons.js';

import { add_text } from '../functions/texts.js';
import { WrapperContainer } from '../objects/WrapperContainer.js'
import { player } from '../client/client.js';


export class EmailsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EmailsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'building');
        // showCoordinates(this)
        const close = close_button(this, 1460, 35, 'HomeScene', 'EmailsScene', 0.4)
        close.setDepth(4)
        this.input.topOnly = false;
        var newDeckButton = new Button(this, centerX + 200, centerY, 'add_new_deck', () => {
            console.log('p1')
        })
        var newDeckButton2 = new Button(this, centerX, centerY, 'add_new_deck', () => {
            console.log('p2')
        })
    }
    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
