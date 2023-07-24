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

function preload() {
    // Carregando a imagem
    this.load.image('khras', caminho + '/images/khras_angry.png');
    this.load.image('background', caminho + '/images/wallnick.jpeg');
    this.load.html('nickname', caminho + '/name.html');

}

function create() {
    // Criar um elemento DOM usando o conteúdo carregado do arquivo HTML
    const larguraCanvas = this.game.config.width;
    const alturaCanvas = this.game.config.height;

    // Adicione sua imagem ao meio do canvas
    const wallpaper = this.add.sprite(larguraCanvas / 2, alturaCanvas / 2, 'background');

    const element = this.add.dom(400, 200).createFromCache('nickname');


    // Configurar ações para o botão do formulário
    const submitButton = element.getChildByID('submitButton');
    submitButton.addEventListener('click', () => {
        const nameField = element.getChildByID('nameField');
        const name = nameField.value.trim(); // Remover espaços em branco no início e no final

        // Verificar se o campo de entrada (input) do nickname não está vazio
        // Verificar se o campo de entrada (input) do nickname não está vazio
        if (name !== '') {
            // Verificar o tamanho do nickname
            if (name.length >= 3 && name.length <= 25) {
                console.log('Name entered:', name); // Exibir o nome no console

                // Enviar o nickname para o Django usando AJAX
                sendDataToDjango(name);
            } else {
                this.add.dom(450, 300, 'h1', 'color: grey; font-weight: bold; padding: 10px; text-align: center; background-color: white; font-size: 15px; white-space: pre-line;',
                    'O comédia, \nseu nickname deve conter mais de 3\n e menos de 25 caracteres');
                const khras = this.add.image(700, 355, 'khras');
                khras.setScale(0.7)
                console.log('Nickname must have at least 3 characters and no more than 25 characters.'); // Exibir mensagem de erro no console
            }
        } else {
            console.log('Please enter a valid nickname.'); // Exibir mensagem de erro no console
        }
    });
}




