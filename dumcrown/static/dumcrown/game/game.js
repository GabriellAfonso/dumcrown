const { Phaser } = window;


// Inicialização do Phaser
var config = {
    backgroundColor: '#000000',
    width: 800,
    height: 500,
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

}

function create() {
    // Conteúdo da sua cena, caso queira adicionar algo além da tela preta
    var imagem = this.add.sprite(400, 300, 'khras');
    imagem.setScale(0.1);
}

