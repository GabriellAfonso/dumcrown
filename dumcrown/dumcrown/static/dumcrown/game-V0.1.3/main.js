import { GAME } from './config/gameConfig.js';

import { Preloader, Loading } from './scenes/loading.js';
import { Nickname } from './scenes/nickname.js';
import { HomeScreen, Perfil, IconPage } from './scenes/home.js';
import { ConfigScreen } from './scenes/settings.js';
import { StoreScreen } from './scenes/store.js';
import { MissionsScreen } from './scenes/missions.js';
import { DecksScreen, CardDetailScene } from './scenes/decks.js';
import { FriendsScreen } from './scenes/friends.js';
import { EmailsScreen } from './scenes/emails.js';
import { RankingScreen } from './scenes/ranking.js';
import { GameLobby } from './scenes/lobby.js';
import { RoomScreen } from './scenes/room.js';
import { QueueTimer } from './scenes/queue.js';
import { DumArena } from './scenes/dumarena.js';
import { StartAnimation } from './animations/scenes/startAnimation.js';
import { Tutorial } from './scenes/tutorial.js';
import { clientReciver } from './game_clientside/reciver.js';
import { sendSocket } from './functions/functions.js';


export let socket;


connectWebSocket()

function connectWebSocket() {
    const host = window.location.hostname;
    socket = new WebSocket(`ws://${host}/ws/game/`);
    // Quando a conexão é aberta
    socket.onopen = (event) => {
        console.log('Conexão com WebSocket estabelecida.');
        // console.log(socket)
        sendSocket('get_player_data')
    };

    socket.onerror = (error) => {
        console.error('Erro na conexão WebSocket:', error);
        reconnectWebSocket();
    };


    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        console.log(messageData)

        const messageType = messageData.code;
        const handler = clientReciver[messageType];

        if (handler) {
            handler(messageData.data);
        }
    };

    socket.onerror = (event) => {
        console.error('Erro no WebSocket:', event);
    };

    socket.onclose = (event) => {
        console.log('Conexão com WebSocket fechada.');
        reconnectWebSocket();
    };
}

function reconnectWebSocket() {
    console.log('Tentando reconectar ao WebSocket em 3 segundos...');
    setTimeout(connectWebSocket, 3000);
}


GAME.scene.add('Preloader', Preloader);
GAME.scene.add('Loading', Loading);
GAME.scene.add('Nickname', Nickname);
GAME.scene.add('HomeScreen', HomeScreen);
GAME.scene.add('Perfil', Perfil);
GAME.scene.add('IconPage', IconPage);
GAME.scene.add('StoreScreen', StoreScreen);
GAME.scene.add('MissionsScreen', MissionsScreen);
GAME.scene.add('DecksScreen', DecksScreen);
GAME.scene.add('CardDetailScene', CardDetailScene);
GAME.scene.add('FriendsScreen', FriendsScreen);
GAME.scene.add('EmailsScreen', EmailsScreen);
GAME.scene.add('RankingScreen', RankingScreen);
GAME.scene.add('GameLobby', GameLobby);
GAME.scene.add('RoomScreen', RoomScreen);
GAME.scene.add('QueueTimer', QueueTimer);
GAME.scene.add('StartAnimation', StartAnimation);
GAME.scene.add('DumArena', DumArena);
GAME.scene.add('ConfigScreen', ConfigScreen);
GAME.scene.add('Tutorial', Tutorial);




GAME.scene.start('Preloader');
