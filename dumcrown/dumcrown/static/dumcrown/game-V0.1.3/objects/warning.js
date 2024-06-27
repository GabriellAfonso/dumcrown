export class Warning extends Phaser.GameObjects.Container {
    constructor(scene, data = {}) {
        super(scene);
        this.x = this.width / 2
        const {
            background = 'blackground',
            warningBox = 'basic_warning',
            title = '', text = '',
            type = 'warning' } = data;

        this.background = scene.add.image(0, 0, background);
        this.warningBox = scene.add.image(0, 0, warningBox);

        this.title = scene.add.text(0, 70, title,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.title.setOrigin(0.5, 0.5)

        this.text = scene.add.text(0, -70, text,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.title.setOrigin(0.5, 0.5)
    }
}

