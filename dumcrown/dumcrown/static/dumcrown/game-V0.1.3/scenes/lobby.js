import {
    room, updateRoom, setUpdateRoom, reciveMessage, setReciveMessage, RoomMessage,
} from '../client/room.js';

import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { switchScenes, logoutAjax, sleep } from '../functions/functions.js';
import { cardsShow, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';


import { Botao } from '../functions/functions.js';
import { simpleTextTweens } from '../animations/scripts/functions.js';
import { Button } from '../functions/buttons.js';

export class GameLobby extends Phaser.Scene {
    constructor() {
        super({ key: 'GameLobby' });
    }

    create() {
        const soundfx = this.scene.get('Loading');
        const background = this.add.image(centerX, centerY, 'play_background');

        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'GameLobby')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)
        this.gameLobbyContainer = this.add.container(0, 0);


        const randomMatch = new Botao(this, 375, centerY, 'find_match_button', () => {

            this.queue('QueueTimer')

        });

        const createRoom = new Botao(this, 1125, centerY, 'Create_room_button', () => {

            this.createRoom('RoomScreen')

        }, null, null, null, true);


        this.inputRoom = this.add.dom(1100, 50, 'input', {
            type: 'text', id: 'inputRoom',
            width: '80px', height: '30px',
            fontSize: '20px', outline: 'none', borderRadius: '10px',
            backgroundColor: '#555555', border: '2px solid #555555',
            textAlign: 'center',
        });
        this.inputRoom.node.placeholder = "Room";
        this.input.on('pointerdown', () => {

            this.inputRoom.node.blur();
        });
        this.joinButton = new Botao(this, 1220, 52, 'enter_room', () => {
            if (this.inputRoom.node.value) {
                sendSocket('join_room', this.inputRoom.node.value.trim())
            }
        });


        this.input.keyboard.on('keydown-ENTER', (event) => {
            if (document.activeElement === this.inputRoom.node && this.inputRoom.node.value) {
                sendSocket('join_room', this.inputRoom.node.value.trim());
            }
        });



        this.gameLobbyContainer.add(x_close)
        this.gameLobbyContainer.add(randomMatch)
        this.gameLobbyContainer.add(createRoom)
        this.gameLobbyContainer.add(this.joinButton)

        if (this.game.scene.isActive('QueueTimer')) {
            this.inputRoom.disabled = true;
            this.joinButton.disableInteractive()
        }
        this.completeAnimation = true


        this.addEvents()
    }

    update() {
        if (reciveMessage && this.completeAnimation) {
            setReciveMessage(false)
            this.completeAnimation = false

            this.message = this.add.text(centerX, 60, RoomMessage,
                {
                    fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#FFD700'
                })
            this.message.alpha = 0
            this.message.setOrigin(0.5)
            this.messageAnimation = simpleTextTweens(this, this.message, centerX, 60, 10, 0, 200, 1, () => {
                simpleTextTweens(this, this.message, centerX, 60, 10, 0, 500, 0, () => {
                    this.completeAnimation = true
                }, 1400)
            })
        }
    }

    queue(sceneKey) {
        if (!this.game.scene.isActive(sceneKey) && !this.game.scene.isActive('RoomScreen')) {
            this.game.scene.run(sceneKey);
            sendSocket('match_making', '')
        }
    }
    createRoom(sceneKey) {
        if (!this.game.scene.isActive(sceneKey) && !this.game.scene.isActive('QueueTimer')) {
            this.game.scene.run(sceneKey);
            sendSocket('create_room')
        }
    }

    addEvents() {
        this.events.on('disableAll', () => {
            this.disableAllInteractive()
        });
    }

    disableAllInteractive() {
        this.gameLobbyContainer.list.forEach(element => {
            element.disableInteractive();
        });

        this.inputRoom.node.disabled = true;
    }

}
