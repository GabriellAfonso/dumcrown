export const PATH = `static/${gameversion}/dumcrown/game/`;

export var config = {
    type: Phaser.AUTO,
    parent: 'container',
    backgroundColor: '#000000',
    transparent: true,
    dom: {
        createContainer: true
    },
    scale: {
        parent: 'game-display',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1500,
        height: 768, // você pode definir isso se quiser proporção fixa
    },
    texture: {
        linear: true,
    },
    render: {
        pixelArt: false,
        antialias: true,
    },
    antialias: true,
    resolution: window.devicePixelRatio,
    autoFocus: true,
    autoPause: false,
    fps: {
        min: 10,
        target: 60,
        forceSetTimeOut: true,
    },
};

export const GAME = new Phaser.Game(config);

export const centerX = GAME.config.width / 2; //750 - 1500
export const centerY = GAME.config.height / 2; // 384 - 768