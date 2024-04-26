import {
    room, updateRoom, setUpdateRoom,
} from '../client/room.js';

import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { switchScenes, logoutAjax, sleep } from '../functions/functions.js';
import { cardsShow, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';

import { Botao } from '../functions/functions.js';


export class RoomScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomScreen' });
    }

    create() {
        const soundfx = this.scene.get('Loading');
        const lobby = this.scene.get('GameLobby')

        lobby.gameLobbyContainer.list.forEach(element => {
            element.disableInteractive();
        });

        lobby.inputRoom.disabled = true;


        const background = this.add.image(centerX, centerY, 'room_screen');
        this.add.image(centerX, centerY, 'vs');

        const x_close = new Botao(this, 1340, 105, 'x_close', () => {
            sendSocket('leave_room')

        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.4)





        this.player1Icon = this.add.image(363, centerY - 1, room.player1.icon);
        this.player1Icon.setScale(0.55)

        this.player1Border = this.add.image(363, centerY - 1, room.player1.border)
        this.player1Border.setScale(0.55)

        this.player1Nick = this.add.text(363, 490, room.player1.nickname, {
            fontSize: '32px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });
        this.player1Nick.setOrigin(0.5, 0.5)


        this.player2Icon = this.add.image(1137, centerY - 1, room.player2.icon);
        this.player2Icon.setScale(0.55)

        this.player2Border = this.add.image(1137, centerY - 1, room.player2.border)
        this.player2Border.setScale(0.55)



        this.player2Nick = this.add.text(1137, 490, room.player2.nickname, {
            fontSize: '32px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });
        this.player2Nick.setOrigin(0.5, 0.5)


        this.sala = this.add.text(130, 660, 'Sala: ' + room.id, {
            fontSize: '30px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });
        this.sala.setOrigin(0, 0)


    }

    update() {
        if (updateRoom) {
            this.sala.text = 'Sala: ' + room.id

            this.player1Icon.setTexture(room.player1.icon)
            this.player1Border.setTexture(room.player1.border)
            this.player1Nick.text = room.player1.nickname;

            this.player2Icon.setTexture(room.player2.icon)
            this.player2Border.setTexture(room.player2.border)
            this.player2Nick.text = room.player2.nickname;

            setUpdateRoom(false)
        }

        if (!this.start && player.nickname === room.player1.nickname && room.player2.nickname) {
            this.start = new Botao(this, centerX, 600, 'start_button', () => {
                sendSocket('start_match', room)
                this.start.disableInteractive()
                console.log('cliquei no start')
            }, 0xffff00,);
            this.start.setScale(0.5)
            this.start.setTint(0xdddddd)
        }

        if (this.start && room.player2.nickname == false) {
            this.start.destroy()
            this.start = null
        }


    }
}
