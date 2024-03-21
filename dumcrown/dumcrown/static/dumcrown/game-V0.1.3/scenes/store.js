import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax } from '../functions/functions.js';

import socket from '../main.js';

import { Botao } from '../functions/functions.js';

export class StoreScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScreen' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'store_background');
        const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScreen', 'StoreScreen')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)

    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
