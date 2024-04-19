import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax } from '../functions/functions.js';


import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';

export class ReconnectingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ReconnectingScreen' });
    }

    create() {
        const background = this.add.image(centerX, centerY, 'blackground');
        background.setInteractive()
        background.alpha = 0.7

        const loadingImg = this.add.image(centerX, centerY, 'loading_circle')
        this.tweens.add({
            targets: loadingImg,
            angle: { value: '+=360', ease: 'Linear' },
            duration: 1000,
            repeat: -1,
        });
        this.text = add_text(this, centerX, centerY + 130, 'Reconectando...', '30px', 0.5)

    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
