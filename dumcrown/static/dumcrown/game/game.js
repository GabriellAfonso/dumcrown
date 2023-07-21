const { Phaser } = window;
import sendDataToDjango from './partials/django.js'
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
    this.load.image('khras', 'static/dumcrown/game/images/khras_eyebrown_talk.png');
    this.load.html('nickname', 'static/dumcrown/game/name.html');

}

function create() {
    // Criar um elemento DOM usando o conteúdo carregado do arquivo HTML
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
                this.add.dom(400, 300, 'h1', 'color: white; font-size: 15px; white-space: pre-line;',
                    'Seu nickname deve conter mais de 3\n e menos de 25 caracteres');
                console.log('Nickname must have at least 3 characters and no more than 25 characters.'); // Exibir mensagem de erro no console
            }
        } else {
            console.log('Please enter a valid nickname.'); // Exibir mensagem de erro no console
        }
    });
}




