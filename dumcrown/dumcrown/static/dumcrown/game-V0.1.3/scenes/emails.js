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
    constructor(scene, x, y) {
        super(scene, x, y);
        this.width = 1;
        this.height = 1;
        this.items = [];

        scene.add.existing(this);

    }

    addItem(item) {
        this.add(item);
        this.items.push(item);

    }

    updateLayout(scale, xGap, yGap) {
        // this.setScale(0.4)
        const maxItemsPerRow = 4;
        const totalItems = this.items.length;
        const numRows = Math.ceil(totalItems / maxItemsPerRow); // Calcular o número de linhas necessárias

        let xPos, yPos;
        this.width = maxItemsPerRow * (this.items[0].width * scale + xGap);
        this.height = numRows * (this.items[0].height * scale + yGap);
        this.y = this.height / 2 + 70;

        for (let i = 0; i < totalItems; i++) {
            const item = this.items[i];
            item.width = item.width * scale
            item.height = item.height * scale

            // Calcular a posição x e y com base no índice do item e no número máximo de itens por linha
            xPos = (i % maxItemsPerRow) * (item.width + xGap) - (maxItemsPerRow - 1) * (item.width + xGap) / 2;
            yPos = Math.floor(i / maxItemsPerRow) * (item.height + yGap);


            item.x = xPos;
            item.y = yPos - this.displayOriginY + item.height / 2 + 10;
            // var a = item.getID()
            // console.log(item.y)
            // console.log(a)
            item.setVisible(true);
            item.setScale(scale);

        }



        this.createMask()

        this.containerDisplay()
        this.setInteractive({ draggable: true, cursor: 'pointer' });

        this.on('drag', this.onDrag);
        this.on('pointerdown', this.checkClick);
        console.log('terminou')
    }

    checkClick(pointer) {
        console.log(this.y)
        this.items.forEach(item => {
            item.setInteractive()
        });
        setTimeout(() => {
            this.items.forEach(item => {
                item.disableInteractive()
            });
        }, 200)
    }

    onDrag(pointer, dragX, dragY) {

        if (this.input.dragStartY !== undefined) {
            const dy = this.input.dragStartY - dragY;

            // Calcular o limite superior com base na altura do contêiner

            const upperLimit = this.displayOriginY + this.initialMaskY// Ajuste conforme necessário
            const lowerLimit = -this.height / 2 + 660
            console.log(lowerLimit)

            // Limitar o arraste para o intervalo [0, upperLimit]
            this.y = Phaser.Math.Clamp(this.y - dy, lowerLimit, upperLimit);

            // Atualizar a posição inicial de arrastar para o próximo movimento
            this.input.dragStartY = dragY;
        }
    }

    createMask() {
        this.initialMaskY = this.y - this.height / 2
        this.maskGraphics = this.scene.make.graphics();
        this.maskGraphics.fillStyle(0xffffff);
        //foi o unico jeito de centralizar a mascara no container
        this.maskGraphics.fillRect(this.x - this.width / 2, this.initialMaskY, this.width, 670);
        this.maskShape = this.maskGraphics.createGeometryMask();
        this.setMask(this.maskShape);
    }

    containerDisplay() {
        this.containerRect = this.scene.add.rectangle(
            0, 0,
            this.width, this.height, 0xCCC44C, 0.4);
        this.containerRect.setStrokeStyle(2, 0x000000);
        this.containerRect.setOrigin(0.5);
        this.add(this.containerRect);
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




        this.container = new VerticalScrollContainer(this, 954, centerY)
        this.cards = createAllCards(this, true)

        // this.cards[10].setVisible(true)
        for (let id in this.cards) {
            if (this.cards.hasOwnProperty(id)) {
                this.container.addItem(this.cards[id]);

            }
        }
        this.container.updateLayout(0.6, 60, 40);
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
