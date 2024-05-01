import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sleep } from '../functions/functions.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';

import { Botao } from '../functions/functions.js';

export class EmailsScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'EmailsScreen' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'emails_background');
        const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'EmailsScreen')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)
        x_close.depth = 150


    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
