import { GAME } from "../config/gameConfig.js";
import { sendSocket, switchScenes } from '../functions/functions.js';
export var room = {
    id: '',

    'player1': {
        channel: '',
        icon: '',
        nickname: '',
        arena: '',
        border: '',
        level: null,
        crown_points: null,
    },
    'player2': {
        channel: '',
        icon: 'empty',
        nickname: '',
        arena: '',
        border: 'empty',
        level: null,
        crown_points: null,
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
    // GAME.scene.stop('DumArena')
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
//     switchScenes('RoomScreen', 'HomeScreen')
// }

export function roomUpdate(data) {
    clearRoom()
    const message = data;
    room.id = message.room_id
    room.player1.channel = message.player1.channel
    room.player1.icon = message.player1.icon
    room.player1.nickname = message.player1.nickname
    room.player1.arena = message.player1.arena
    room.player1.border = message.player1.border
    room.player1.level = message.player1.level
    room.player1.crown_points = message.player1.crown_points

    if (message.player2) {
        room.player2.channel = message.player2.channel;
        room.player2.icon = message.player2.icon;
        room.player2.nickname = message.player2.nickname;
        room.player2.arena = message.player2.arena;
        room.player2.border = message.player2.border;
        room.player2.level = message.player2.level;
        room.player2.crown_points = message.player2.crown_points;
    }

    updateRoom = true
}
export function clearRoom(data = '') {
    room.id = ''
    room.player1.icon = 'empty'
    room.player1.nickname = ''
    room.player1.border = 'empty'

    room.player2.icon = 'empty'
    room.player2.nickname = ''
    room.player2.border = 'empty'
}

