import {
    room, updateRoom, setUpdateRoom,
} from '../game_clientside/room.js';

import { player } from '../game_clientside/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { switchScenes, logoutAjax, sleep } from '../functions/functions.js';
import { cardsShow, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';

import socket from '../main.js';

import { Botao } from '../functions/functions.js';

export class QueueTimer extends Phaser.Scene {
    constructor() {
        super({ key: 'QueueTimer' });
        this.timerTimeout = null
    }

    create() {
        const soundfx = this.scene.get('Loading');
        const lobby = this.scene.get('GameLobby')


        lobby.inputRoom.disabled = true;
        lobby.joinButton.disableInteractive()


        const Timer = this.add.image(centerX, 30, 'timer');
        Timer.setScale(0.3)
        Timer.scaleX = 0.2
        Timer.alpha = 0

        this.tweens.add({
            targets: Timer,
            alpha: 0.95,
            scaleX: 0.3,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                const x_close = new Botao(this, 855, 45, 'x_close', () => {
                    this.game.scene.stop('QueueTimer')
                    this.game.scene.stop('GameLobby')
                    this.game.scene.run('GameLobby')
                    sendSocket('quit_queue')
                    clearTimeout(this.timerTimeout);
                }, 0xffffff, soundfx.closeSound);
                x_close.setScale(0.3)
                x_close.alpha = 0.4
            }
        });





        this.timerText = this.add.text(centerX, 45, '0:00', { fontSize: '40px', fill: '#fff' });
        this.timerText.setOrigin(0.5)
        this.timerText.alpha = 1


        var time = 0;


        function pad(value) {
            return value < 10 ? '0' + value : value;
        }

        function updateTimer() {
            time += 1;
            var minutes = Math.floor(time / 60);
            var seconds = Math.floor(time % 60);
            this.timerText.text = minutes + ':' + pad(seconds);

            // Configura o próximo setTimeout
            this.timerTimeout = setTimeout(updateTimer.bind(this), 1000);
        }

        // Inicia o primeiro setTimeout
        this.timerTimeout = setTimeout(updateTimer.bind(this), 1000);

        this.events.on('stopTimer', () => {
            clearTimeout(this.timerTimeout);
        });

    }

    update() {

    }

}
