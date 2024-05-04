import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax } from '../functions/functions.js';
import { simpleTweens } from '../animations/scripts/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sleep } from '../functions/functions.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';
import { Button, close_button } from '../functions/buttons.js';
import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { createAllCards } from '../cards/base.js';


class WrapperContainer {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initialize(scene, x, y)
    }

    initialize(scene, x, y) {
        this.ping = scene.add.image(x, y, 'signal01');
        // this.ping.setScale(0.06)
        this.ms = add_text(scene, x + 35, y, latency_ms, '16px', 0.5)
        this.update()
    }

}
//TODO: CRIAR AREAS VISUAIS OCUPADAS POR ITEMS
//TODO: CRIAR AQUELA BARRINHA DE SCROLL LATERAL
//TODO: BASEAR A LOGICA NO BAU DO MINECRAFT

class VerticalScrollContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height) {
        super(scene, x, y);
        this.width = width;
        this.height = height;
        this.items = [];

        // Criar uma máscara retangular
        const maskGraphics = this.scene.make.graphics();
        maskGraphics.fillStyle(0xffffff);
        //foi o unico jeito de centralizar a mascara no container
        maskGraphics.fillRect(x - width / 2, y - height / 2, width, height);
        const maskShape = maskGraphics.createGeometryMask();
        this.setMask(maskShape);

        // Habilitar interatividade para permitir a rolagem
        this.setInteractive({ draggable: true, cursor: 'pointer' });
        this.on('drag', this.onDrag);

        scene.add.existing(this);

        var containerRect = scene.add.rectangle(
            0, 0,
            this.width, this.height, 0xCCCCCC, 0.4);
        containerRect.setStrokeStyle(2, 0x000000);
        containerRect.setOrigin(0.5);
        this.add(containerRect);
    }

    addItem(item) {
        this.items.push(item);
        this.add(item);
        this.updateLayout();
    }

    updateLayout() {
        let offsetY = 0;
        this.items.forEach(item => {
            item.y = offsetY;
            offsetY += item.height;
        });
    }

    onDrag(pointer, dragX, dragY) {
        if (this.input.dragStartY !== undefined) {
            const dy = this.input.dragStartY - dragY;
            this.items.forEach(item => {
                item.y -= dy;
            });
            this.input.dragStartY = dragY;
        }
    }
}
export class EmailsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EmailsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'decks_background');
        const close = close_button(this, 1460, 35, 'HomeScene', 'EmailsScene', 0.4)
        close.setDepth(4)

        this.title = add_text(this, 954, 35, 'DECKS', '30px', 0.5)
        this.title.setStyle({ fontStyle: 'bold' })

        this.mouseText = this.add.text(centerX, 10, '', { fontSize: '20px', fill: '#ffffff' },);
        this.input.on('pointermove', (pointer) => {
            // Atualize o texto com as coordenadas do mouse
            this.mouseText.setText('X: ' + pointer.x + ' Y: ' + pointer.y);
        });

        this.decksButton = new Button(this, 204, 155, 'decks_select_button', () => {

        })
        this.decksButtonText = add_text(this, 204, 155, 'MEUS DECKS', '25px', 0.5)
        this.decksButtonText.setStyle({ fontStyle: 'bold' })

        this.cardsButton = new Button(this, 204, 255, 'decks_select_button', () => {

        })
        this.cardsButtonText = add_text(this, 204, 255, 'MINHAS CARTAS', '25px', 0.5)
        this.cardsButtonText.setStyle({ fontStyle: 'bold' })




        this.container = new VerticalScrollContainer(this, centerX, centerY, 400, 400)
        this.cards = createAllCards(this)
        this.cards[10].setVisible(true)
        this.container.addItem(this.cards[10])
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
