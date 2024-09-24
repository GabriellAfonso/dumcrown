export const PATH = 'static/dumcrown/game-V0.1.4';
//teste

export var config = {
    type: Phaser.AUTO,
    parent: 'container',
    backgroundColor: '#000000',
    dom: {
        createContainer: true // Essa propriedade é importante para usar this.add.dom()
    },
    scale: {
        parent: 'game-display',
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1500,
        interpolation: {
            antialias: true, // ou false, dependendo da sua escolha
            quality: 'nearest' // ou 'nearest'
        }

    },
    render: {
        pixelArt: false,
        antialias: true,
    },

    texture: {
        linear: true,
    },
    roundPixels: true

};
export const GAME = new Phaser.Game(config);

export const centerX = GAME.config.width / 2; //750 - 1500
export const centerY = GAME.config.height / 2; // 384 - 768