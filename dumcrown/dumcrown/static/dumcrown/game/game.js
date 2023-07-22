const { Phaser } = window;
import sendDataToDjango from './partials/django.js'

var caminho = 'static/dumcrown/game'
// Inicialização do Phaser
var config = {
    type: Phaser.AUTO,
    backgroundColor: '#550000',
    width: 800,
    height: 500,
    dom: {
        createContainer: true // Essa propriedade é importante para usar this.add.dom()
    },
    scale: {
        parent: 'game-display',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

// Conectando ao websocket
var socket = new WebSocket('ws://' + window.location.host + '/game/');

// Quando a conexão é aberta
socket.onopen = function (event) {
    console.log('Conexão com websocket estabelecida.');
};

// Quando uma mensagem é recebida do servidor Django
socket.onmessage = function (event) {
    var data = JSON.parse(event.data);
    // Faça o que quiser com os dados recebidos
    console.log('Dados recebidos do servidor Django:', data);
};

// Quando ocorre algum erro
socket.onerror = function (event) {
    console.error('Erro no websocket:', event);
};

// Quando a conexão é fechada
socket.onclose = function (event) {
    console.log('Conexão com websocket fechada.');
};


function preload() {
    // Carregando a imagem
    this.load.image('khras', caminho + '/images/khras_angry.png');
    this.load.image('background', caminho + '/images/wallnick.jpeg');

}

function create() {

    const larguraCanvas = this.game.config.width;
    const alturaCanvas = this.game.config.height;

    // Adicione sua imagem ao meio do canvas
    const wallpaper = this.add.sprite(larguraCanvas / 2, alturaCanvas / 2, 'background');


}




