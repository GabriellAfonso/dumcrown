import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { Button } from '../functions/buttons.js';

import { switchScenes, logoutAjax } from '../functions/functions.js';
import { sfx } from '../soundfx/sounds.js';
export class StoreScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScreen' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'store_background');
        const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Button(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'StoreScreen')
        }, { color: 0xffff00, clickSound: sfx.closeSound, });
        x_close.setScale(0.5)

        const invisibleObject = this.add.rectangle(400, 300, 100, 100, 0xffffff, 1); // 0 na opacidade torna-o invisível
        invisibleObject.setInteractive();
        invisibleObject.alpha = 0
        invisibleObject.input.alwaysEnabled = true;
        // Adicionar evento de clique
        invisibleObject.on('pointerdown', function () {
            console.log('Objeto invisível clicado!');
        });

    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
