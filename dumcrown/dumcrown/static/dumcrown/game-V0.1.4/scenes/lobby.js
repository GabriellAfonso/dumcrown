import {
    room, updateRoom, setUpdateRoom, reciveMessage, setReciveMessage, RoomMessage,
} from '../client/room.js';

import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { switchScenes, logoutAjax, sleep, showCoordinates } from '../functions/functions.js';
import { cardsShow, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';


import { Botao } from '../functions/functions.js';
import { simpleTextTweens } from '../animations/scripts/functions.js';
import { Button, close_button } from '../functions/buttons.js';
import { add_text } from '../functions/texts.js';

export class GameLobby extends Phaser.Scene {
    constructor() {
        super({ key: 'GameLobby' });
    }

    create() {
        const soundfx = this.scene.get('Loading');
        const background = this.add.image(centerX, centerY, 'lobby_background');
        const close = close_button(this, 1440, 40, 'HomeScene', 'GameLobby')

        this.gameLobbyContainer = this.add.container(0, 0);

        const findMatch = new Button(this, 375, centerY, 'find_match_button', () => {
            this.queue('QueueTimer')
        }, { useHoverEffect: true })

        const personalized = new Button(this, 1125, centerY, 'personalized_button', () => {
            this.createRoom('RoomScreen')
        }, { useHoverEffect: true })


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



        this.gameLobbyContainer.add(close)
        this.gameLobbyContainer.add(findMatch)
        this.gameLobbyContainer.add(personalized)
        this.gameLobbyContainer.add(this.joinButton)

        if (this.game.scene.isActive('QueueTimer')) {
            this.inputRoom.disabled = true;
            this.joinButton.disableInteractive()
        }
        this.completeAnimation = true


        this.addEvents()
    }

    choiceDeck(callback) {
        //background preto interativo
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

    addQueueButton() {
        var back = this.add.graphics();
        back.fillStyle(0xff0000, 1.0);
        back.fillRect(375 - 200, centerY - 250, 400, 500);


        add_text(this, 375, centerY - 40, 'Encontrar', '60px', 0.5)
        add_text(this, 375, centerY + 40, 'Partida', '60px', 0.5)


    }

}
