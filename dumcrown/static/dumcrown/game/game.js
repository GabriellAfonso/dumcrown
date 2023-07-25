const { Phaser } = window;
import sendDataToDjango from './partials/django.js'

var caminho = 'static/dumcrown/game'
// Inicialização do Phaser


// Conectando ao websocket
const socket = new WebSocket('ws://192.168.1.105:8000/ws/game/');




// Quando a conexão é aberta
socket.onopen = function (event) {
    console.log('Conexão com websocket estabelecida.');

    var config = {
        type: Phaser.AUTO,
        parent: 'container',
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

    function toggleFullscreen() {
        if (game.scale.isFullscreen) {
            // Se o jogo já estiver em tela cheia, saia do modo de tela cheia
            game.scale.stopFullscreen();
        } else {
            // Se o jogo não estiver em tela cheia, entre no modo de tela cheia
            game.scale.startFullscreen();
        }
    }


    function preload() {

        this.load.image('khras', caminho + '/images/khras_angry.png');
        this.load.image('background', caminho + '/images/wallpaper.jpg');
        this.load.html('chat', caminho + '/doms/chat.html');
        this.load.html('chat_screen', caminho + '/doms/chat_screen.html');

    }

    function create() {

        const larguraCanvas = this.game.config.width;
        const alturaCanvas = this.game.config.height;

        // Adicione sua imagem ao meio do canvas
        const wallpaper = this.add.sprite(larguraCanvas / 2, alturaCanvas / 2, 'background');

        // Adicione o botão de tela cheia e atribua o evento de clique
        const fullscreenButton = document.getElementById('fullscreen-button');
        fullscreenButton.addEventListener('click', toggleFullscreen);



        // Enviar mensagem para o servidor

        const chatdiv = this.add.dom(400, 470).createFromCache('chat');
        const chatscreen = this.add.dom(400, 200).createFromCache('chat_screen');
        chatdiv.setScale(2);

        // Configurar ações para o botão do formulário

        const chat = chatscreen.node.querySelector('#chat');
        const nameField = chatdiv.getChildByID('textField');
        const submitButton = chatdiv.getChildByID('submitButton');

        // Obter referência ao elemento de chat pelo ID
        const chatText = chatdiv.getChildByID('chat');

        // Definir altura máxima da div "chat" para caber na tela
        chat.style.maxHeight = '400px'; // Defina o valor desejado

        // Definir overflow-y como "auto" para permitir a rolagem vertical
        chat.style.overflowY = 'auto';
        chat.style.backgroundColor = 'rgba(14, 169, 230, 0.356)';
        chat.style.border = '2px solid #000'; // Borda de 2 pixels, cor preta (#000)
        chat.style.boxShadow = '3px 3px 5px rgba(0, 0, 0, 0.5)'; // Sombra de 3 pixels de deslocamento horizontal e vertical, 5 pixels de desfoque, cor preta com 50% de transparência
        chat.style.zIndex = '1';
        chat.style.position = 'fixed';


        submitButton.addEventListener('click', mandar_menssagem);
        nameField.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                mandar_menssagem();
            }
        });

        function mandar_menssagem() {
            const usermessage = nameField.value.trim(); // Remover espaços em branco no início e no finalS
            const usermessageJSON = JSON.stringify({ message: nickname + ':' + ' ' + usermessage });
            socket.send(usermessageJSON);
            nameField.value = '';
        };

        let messageRecebida;


        // Quando uma mensagem é recebida do servidor Django
        socket.onmessage = function (event) {
            const messageData = JSON.parse(event.data);
            const message = messageData.message;
            messageRecebida = message

            const newMessage = document.createElement('li');
            newMessage.textContent = messageRecebida;
            chat.appendChild(newMessage);

            chat.scrollTop = chat.scrollHeight;


        };




    }



};



// Quando ocorre algum erro
socket.onerror = function (event) {
    console.error('Erro no websocket:', event);
};

// Quando a conexão é fechada
socket.onclose = function (event) {
    console.log('Conexão com websocket fechada.');
};






