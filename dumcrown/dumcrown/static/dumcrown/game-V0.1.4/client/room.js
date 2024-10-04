import { GAME } from "../config/gameConfig.js";
import { sendSocket, switchScenes } from '../functions/functions.js';
export var room = {
    id: '',

    'player_x': {
        id: '',
        channel: '',
        icon: '',
        nickname: '',
        board: '',
        border: '',

    },
    'player_y': {
        id: '',
        channel: '',
        icon: 'empty',
        nickname: '',
        board: '',
        border: 'empty',

    },


};


export var RoomMessage = ''
export var reciveMessage = false

export var updateRoom = false


export function setUpdateRoom(value) {
    updateRoom = value;
}
export function setReciveMessage(value) {
    reciveMessage = value
}


export function roomOpen(data) {
    GAME.scene.run('RoomScreen')
}
export function roomClose(data) {
    clearRoom()
    switchScenes('GameLobby', 'RoomScreen')
    // GAME.scene.stop('Dumboard')
}
export function roomErrorMsg(data) {
    const message = data
    RoomMessage = message
    reciveMessage = true
}

export function callStart() {
    setTimeout(() => {
        sendSocket('start_match', room);
    }, 500)

}

// export function joinRoom(data) {
//     const message = data.join_room;
//     room.id = message.room_id
//     room.player1_icon = message.player1.icon
//     room.player2_icon = message.player2.icon
//     room.player1Nickname = message.player1.nickname
//     room.player2Nickname = message.player2.nickname
//     switchScenes('RoomScreen', 'HomeScene')
// }

export function roomUpdate(data) {
    clearRoom()
    const message = data;
    room.id = message.room_id
    room.player_x.id = message.player1.id
    room.player_x.channel = message.player1.channel
    room.player_x.icon = message.player1.icon
    room.player_x.nickname = message.player1.nickname
    room.player_x.board = message.player1.board
    room.player_x.border = message.player1.border

    if (message.player2) {
        room.player_y.id = message.player2.id
        room.player_y.channel = message.player2.channel;
        room.player_y.icon = message.player2.icon;
        room.player_y.nickname = message.player2.nickname;
        room.player_y.board = message.player2.board;
        room.player_y.border = message.player2.border;
    }

    updateRoom = true
}
export function clearRoom(data = '') {
    room.id = ''
    room.player_x.icon = 'empty'
    room.player_x.nickname = ''
    room.player_x.border = 'empty'

    room.player_y.icon = 'empty'
    room.player_y.nickname = ''
    room.player_y.border = 'empty'
}

