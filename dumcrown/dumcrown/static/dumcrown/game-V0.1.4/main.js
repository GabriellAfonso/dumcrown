import { GAME } from './config/gameConfig.js';

import { Preloader, Loading } from './scenes/loading.js';
import { Nickname } from './scenes/nickname.js';
import { HomeScene } from './scenes/home.js';
import { PerfilScene } from './scenes/perfil.js';
import { IconPage } from './scenes/iconPage.js';
import { ConfigScreen } from './scenes/settings.js';
import { StoreScreen } from './scenes/store.js';
import { MissionsScene } from './scenes/missions.js';
import { DecksScene, CardDetailScene, } from './scenes/decks.js';
import { DeckEditorScene } from './scenes/deckEditor.js';
import { FriendsScene } from './scenes/friends.js';
import { EmailsScene } from './scenes/emails.js';
import { RankingScreen } from './scenes/ranking.js';
import { GameLobby } from './scenes/lobby.js';
import { RoomScreen } from './scenes/room.js';
import { QueueTimer } from './scenes/queue.js';
import { DumArena } from './scenes/dumarena.js';
import { StartAnimation } from './animations/scenes/startAnimation.js';
import { Tutorial } from './scenes/tutorial.js';
import { ReconnectingScreen } from './scenes/reconnecting.js';

import { clientReciver } from './client/reciver.js';
import { sendSocket, startScene, switchScenes } from './functions/functions.js';
import { disconnected } from './client/client.js';


export let socket;


connectWebSocket()
function connectWebSocket() {
    const host = window.location.hostname;
    socket = new WebSocket(`ws://${host}/ws/game/`);

    socket.onopen = (event) => {
        console.log('Conexão com WebSocket estabelecida.');
        sendSocket('get_cards')
        sendSocket('get_player_data')
        sendSocket('ping')
        startScene('Preloader')
        GAME.scene.stop('ReconnectingScreen');
    };

    socket.onerror = (error) => {
        // console.error('Erro na conexão WebSocket:', error);
        // Evite que os erros de reconexão sejam exibidos no console
        if (error.code !== 'ECONNREFUSED') {
            startScene('ReconnectingScreen')
        }
    };

    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        // console.log(messageData)

        const messageType = messageData.code;
        const handler = clientReciver[messageType];

        if (handler) {
            handler(messageData.data);
        }
    };

    socket.onclose = (event) => {
        console.log('Conexão com WebSocket fechada.');
        disconnected()
        reconnectWebSocket();
        startScene('ReconnectingScreen')
    };
}

function reconnectWebSocket() {
    console.log('Tentando se reconectar');
    setTimeout(connectWebSocket, 3000);
}


GAME.scene.add('Preloader', Preloader);
GAME.scene.add('Loading', Loading);
GAME.scene.add('Nickname', Nickname);
GAME.scene.add('HomeScene', HomeScene);
GAME.scene.add('PerfilScene', PerfilScene);
GAME.scene.add('IconPage', IconPage);
GAME.scene.add('StoreScreen', StoreScreen);
GAME.scene.add('MissionsScene', MissionsScene);
GAME.scene.add('DecksScene', DecksScene);
GAME.scene.add('DeckEditorScene', DeckEditorScene);
GAME.scene.add('CardDetailScene', CardDetailScene);
GAME.scene.add('FriendsScene', FriendsScene);
GAME.scene.add('EmailsScene', EmailsScene);
GAME.scene.add('RankingScreen', RankingScreen);
GAME.scene.add('GameLobby', GameLobby);
GAME.scene.add('RoomScreen', RoomScreen);
GAME.scene.add('QueueTimer', QueueTimer);
GAME.scene.add('StartAnimation', StartAnimation);
GAME.scene.add('DumArena', DumArena);
GAME.scene.add('ConfigScreen', ConfigScreen);
GAME.scene.add('Tutorial', Tutorial);



GAME.scene.add('ReconnectingScreen', ReconnectingScreen);

// GAME.scene.start('Preloader');
