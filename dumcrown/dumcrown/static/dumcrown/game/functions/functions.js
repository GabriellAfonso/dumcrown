import { GAME, centerX } from '../config/gameConfig.js';
import { socket } from '../main.js';
import { sfx } from '../soundfx/sounds.js';


export function sendSocket(code, data = '') {
    var message = {
        code: code,
        data: data,
    };
    socket.send(JSON.stringify(message));
}


export function toggleFullscreen() {
    if (GAME.scale.isFullscreen) {
        // Se o jogo já estiver em tela cheia, saia do modo de tela cheia
        GAME.scale.stopFullscreen();
    } else {
        // Se o jogo não estiver em tela cheia, entre no modo de tela cheia
        GAME.scale.startFullscreen();
    }
}

export function switchScenes(sceneToStart, sceneToStop = '') {
    var scene = GAME.scene.getScene(sceneToStop);
    scene.events.emit('stop');
    GAME.scene.stop(sceneToStop);
    GAME.scene.stop(sceneToStart);
    GAME.scene.run(sceneToStart, { null: null });
}

export function startScene(scene) {
    var sceneIsActive = GAME.scene.isActive(scene)
    if (sceneIsActive) {
        return
    }
    GAME.scene.start(scene);
}

export function listActiveScenes() {
    const activeScenes = GAME.scene.getScenes(true); // Obtém todas as cenas ativas
    activeScenes.forEach(scene => {
        console.log(`Cena ativa: ${scene.scene.key}`, scene);
    });
}

export function sleep(scene, delay, callback) {
    scene.time.addEvent({
        delay: delay,
        callback: callback,
        callbackScope: scene,
        loop: false,
    });
}


export function showCoordinates(scene) {
    scene.mouseText = scene.add.text(centerX, 30, '', { fontSize: '20px', fill: '#ffffff' },);
    scene.mouseText.setOrigin(0.5)
    scene.input.on('pointermove', (pointer) => {
        scene.mouseText.setText('X: ' + pointer.x + ' Y: ' + pointer.y);
    });
}

export function removeFromList(list, target) {
    const indice = list.indexOf(target);
    console.log('o indice é', indice)
    if (indice !== -1) {
        list.splice(indice, 1);

    } else {
        console.log("Elemento não encontrado na lista");
    }
    return list
}

export function logoutAjax() {
    $.ajax({
        type: 'GET',
        url: '/logout/',  // Substitua pela URL correta do seu endpoint de logout
        success: function (data) {
            window.location.href = "/logout/";
            console.log('Logout successful');
            // Implemente qualquer lógica adicional após o logout, como redirecionamento
        },
        error: function () {
            console.log('Logout failed');
        }
    });
}


