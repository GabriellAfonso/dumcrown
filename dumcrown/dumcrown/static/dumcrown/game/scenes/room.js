import {
    room, updateRoom, setUpdateRoom,
} from '../client/room.js';

import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { switchScenes, logoutAjax, sleep } from '../functions/functions.js';
import { cardsShow, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';

import { sfx } from '../soundfx/sounds.js';
import { Button, close_button } from '../functions/buttons.js';


export class RoomScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'RoomScreen' });
    }

    create() {

        const lobby = this.scene.get('GameLobby')
        lobby.events.emit('disableAll')


        const background = this.add.image(centerX, centerY, 'room_screen');
        this.add.image(centerX, centerY, 'vs');

        const close = new Button(this, 1340, 105, 'x_close', () => {
            sendSocket('leave_room')
        }, { clickSound: sfx.closeSound })
        close.setScale(0.4)





        this.player1Icon = this.add.image(363, centerY - 1, room.player_x.icon);
        this.player1Icon.setScale(0.55)

        this.player1Border = this.add.image(363, centerY - 1, room.player_x.border)
        this.player1Border.setScale(0.55)

        this.player1Nick = this.add.text(363, 490, room.player_x.nickname, {
            fontSize: '32px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });
        this.player1Nick.setOrigin(0.5, 0.5)


        this.player2Icon = this.add.image(1137, centerY - 1, room.player_y.icon);
        this.player2Icon.setScale(0.55)

        this.player2Border = this.add.image(1137, centerY - 1, room.player_y.border)
        this.player2Border.setScale(0.55)



        this.player2Nick = this.add.text(1137, 490, room.player_y.nickname, {
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

            this.player1Icon.setTexture(room.player_x.icon)
            this.player1Border.setTexture(room.player_x.border)
            this.player1Nick.text = room.player_x.nickname;

            this.player2Icon.setTexture(room.player_y.icon)
            this.player2Border.setTexture(room.player_y.border)
            this.player2Nick.text = room.player_y.nickname;

            setUpdateRoom(false)
        }

        if (!this.start && player.nickname === room.player_x.nickname && room.player_y.nickname) {
            this.start = new Button(this, centerX, 600, 'start_button', () => {
                var data = {
                    id: room.id,
                    player_x: room.player_x.id,
                    player_y: room.player_y.id,
                }
                sendSocket('start_match', data)
                this.start.disableInteractive()
            });
            this.start.setScale(0.5)
            this.start.setTint(0xdddddd)
        }

        if (this.start && room.player_y.nickname == false) {
            this.start.destroy()
            this.start = null
        }


    }
}
