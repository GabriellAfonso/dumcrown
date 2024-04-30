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

export class GameLobby extends Phaser.Scene {
    constructor() {
        super({ key: 'GameLobby' });
    }

    create() {
        const soundfx = this.scene.get('Loading');


        const background = this.add.image(centerX, centerY, 'play_background');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScreen', 'GameLobby')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)
        this.gameLobbyContainer = this.add.container(0, 0);


        const randomMatch = new Botao(this, 375, centerY, 'find_match_button', () => {

            this.queue('QueueTimer')

        });

        const createRoom = new Botao(this, 1125, centerY, 'Create_room_button', () => {

            this.createRoom('RoomScreen')

        }, null, null, null, true);

        this.inputRoom = document.createElement("input");
        this.inputRoom.type = "text";
        this.inputRoom.id = "inputRoom";
        this.inputRoom.style.width = "80px";
        this.inputRoom.style.height = "30px";
        this.inputRoom.style.fontSize = "20px";
        this.inputRoom.style.outline = "none";
        this.inputRoom.style.borderRadius = "10px";
        this.inputRoom.style.backgroundColor = "#555555";
        this.inputRoom.style.border = "2px solid #555555";
        this.inputRoom.style.textAlign = "center"
        this.inputRoom.placeholder = "Sala";




        const inputRoom = this.add.dom(1100, 50, this.inputRoom);
        this.joinButton = new Botao(this, 1220, 52, 'enter_room', () => {
            if (this.inputRoom.value) {
                sendSocket('join_room', this.inputRoom.value.trim())
            }


        });

        this.inputRoom.addEventListener("keyup", (event) => {
            // Verificar se a tecla pressionada é "Enter"
            if (event.key === "Enter") {
                if (this.inputRoom.value) {
                    sendSocket('join_room', this.inputRoom.value.trim())
                }
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

}
