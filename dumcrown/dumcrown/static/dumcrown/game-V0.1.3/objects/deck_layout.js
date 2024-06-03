import { cardsDATA } from "../client/client.js";
import { centerX, centerY } from "../config/gameConfig.js";

export class DeckLayout extends Phaser.GameObjects.Container {
    constructor(scene, data = {}) {
        super(scene);

        this.setSize(324, 483);
        this.scene = scene;
        this.x = centerX;
        this.y = centerY;
        this.id = 0;
        this.shape = this.scene.make.graphics()
        this.shape.fillStyle(0xffffff); // A cor não importa, mas é necessário definir
        this.shape.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width * this.scale, this.height * this.scale);
        // this.scene.add.existing(this.shape)
        this.deckImage = scene.add.image(0, -60, data.image);
        this.deckImage.setScale((this.scale * 1.1))
        this.deckBorder = scene.add.image(0, 0, 'deck_border');

        this.name = scene.add.text(0, 185, data.name, {
            fontSize: '30px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'sans-serif',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.name.setOrigin(0.5, 0.5);

        // Função para atualizar a máscara
        this.updateMask = function () {

            this.shape.clear()
            this.shape.fillStyle(0xffffff); // A cor não importa, mas é necessário definir
            this.shape.fillRect(this.x - this.width * this.scale / 2, this.y - this.height * this.scale / 2, this.width * this.scale, this.height * this.scale);
            console.log(this.x - this.width * this.scale / 2)
            this.mask2 = this.shape.createGeometryMask();

            // Aplica a nova máscara à imagem
            this.setMask(this.mask2);
        }

        // Adiciona um evento para atualizar a máscara sempre que a escala do contêiner for alterada
        this.on('scaleChange', this.updateMask, this);
        // this.on('scaleChangeContainer', this.updateMaskContainer, this);

        // this.updateMask()
        this.add([this.deckImage, this.deckBorder, this.name]);
        this.scene.add.existing(this);
    }

    updateMaskContainer(xp, yp) {
        // Limpa a máscara existente
        this.deckImage.clearMask();

        // Cria um novo objeto gráfico para desenhar a máscara
        // this.shape = this.scene.make.graphics({ x: 478, y: 90 })

        console.log('n deu error?');
        console.log(this.width, this.height, this.scale)

        // Desenha um retângulo com cantos arredondados
        // x, y, width, height, cornerRadius
        // Cria a máscara a partir do gráfico
        this.add(this.shape);
        this.mask2 = this.shape.createGeometryMask();

        // Aplica a nova máscara à imagem
        this.deckImage.setMask(this.mask2);
        console.log(this.shape.x)
    }
}


export function instantiateDecks(scene, data) {
    const decks = {};

    data.forEach(deck => {
        const firstCardID = deck.cards[0]
        const deckImage = cardsDATA[firstCardID].image
        const deckData = { image: deckImage, name: deck.name, cards: deck.cards }
        const deckInstance = new DeckLayout(scene, deckData);

        decks[deck.name] = deckInstance;
    });
    console.log('data', decks)
    return decks;

}
