import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, sendSocket } from '../functions/functions.js';


import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';

export class FriendsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FriendsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'friends_background');
        const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'FriendsScene')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)
        this.textA = add_text(this, centerX - 100, centerY + 100, 'Resize', '20px', 0.5)
        this.textB = add_text(this, centerX + 100, centerY + 100, 'Resize', '200px', 0.5)
        this.textB.setScale(0.1)
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
