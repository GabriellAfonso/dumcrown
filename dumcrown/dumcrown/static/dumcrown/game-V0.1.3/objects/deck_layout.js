import { cardsDATA } from "../client/client.js";
import { GAME, centerX, centerY } from "../config/gameConfig.js";

export class DeckLayout extends Phaser.GameObjects.Container {
    constructor(scene, data = {}) {
        super(scene);

        this.setSize(324, 483);
        this.scene = scene;
        this.deckDATA = data
        this.shape = this.scene.make.graphics()

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

        this.on('scaleChange', this.updateMask, this);

        this.add([this.deckImage, this.deckBorder, this.name]);
        this.setInteractive({ cursor: 'pointer' })
        this.scene.add.existing(this);

        this.addEvents()
    }

    updateMask(x = this.x, y = this.y) {
        const Xcentered = x - this.width * this.scale / 2
        const Ycentered = y - this.height * this.scale / 2
        const width = this.width * this.scale
        const height = this.height * this.scale
        const radius = 30 * this.scale
        this.shape.clear()
        this.shape.fillStyle(0xffffff);
        this.shape.fillRoundedRect(Xcentered, Ycentered, width, height, radius);

        const mask = this.shape.createGeometryMask();
        this.deckImage.setMask(mask);
    }

    //clicar faz abrir a cena deck editor com o deck selecionado
    editDeck(data) {
        GAME.scene.run('DeckEditorScene', data)

    }

    addEvents() {
        this.on('pointerup', () => {
            this.editDeck(this.deckDATA)
        })
    }

}


export function instantiateDecks(scene, data) {
    const decks = {};

    data.forEach(deck => {
        const firstCardID = deck.cards[9]
        const deckImage = cardsDATA[firstCardID].image
        const deckData = { id: deck.id, image: deckImage, name: deck.name, cards: deck.cards }
        const deckInstance = new DeckLayout(scene, deckData);

        decks[deck.name] = deckInstance;
    });
    console.log('data', decks)
    return decks;

}
