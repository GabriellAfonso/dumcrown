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
        create: create
    }
};

var game = new Phaser.Game(config);

function create() {
    // Conteúdo da sua cena, caso queira adicionar algo além da tela preta
}

