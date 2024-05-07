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


//TODO: CRIAR AREAS VISUAIS OCUPADAS POR ITEMS
//TODO: CRIAR AQUELA BARRINHA DE SCROLL LATERAL
//TODO: BASEAR A LOGICA NO BAU DO MINECRAFT

class WrapperContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, maskHeight) {
        super(scene, x, y);
        this.maskHeight = maskHeight
        this.width = 1;
        this.height = 1;
        this.items = [];

        scene.add.existing(this);
    }

    addItem(item) {
        this.add(item);
        this.items.push(item);
    }

    updateLayout(scale, initialY, xGap, yGap) {
        const maxItemsPerRow = 4;
        const totalItems = this.items.length;
        const numRows = Math.ceil(totalItems / maxItemsPerRow);

        let xPos, yPos;
        this.width = maxItemsPerRow * (this.items[0].width * scale + xGap);
        this.height = numRows * (this.items[0].height * scale + yGap);
        this.y = this.height / 2 + initialY;

        for (let i = 0; i < totalItems; i++) {
            const item = this.items[i];
            item.width = item.width * scale
            item.height = item.height * scale

            xPos = (i % maxItemsPerRow) * (item.width + xGap) - (maxItemsPerRow - 1) * (item.width + xGap) / 2;
            yPos = Math.floor(i / maxItemsPerRow) * (item.height + yGap);


            item.x = xPos;
            item.y = yPos - this.displayOriginY + item.height / 2 + 10;
            item.setVisible(true);
            item.setScale(scale);

        }



        this.createMask()
        this.createScrollbar()
        // this.containerDisplay()
        this.setInteractive({ draggable: true, cursor: 'pointer' });

        this.on('drag', this.onDrag);
        this.on('pointerdown', this.checkClick);
        console.log('terminou')
    }

    checkClick(pointer) {
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

            const upperLimit = this.displayOriginY + this.initialMaskY
            const lowerLimit = (-this.height / 2) + this.maskHeight + this.initialMaskY
            this.y = Phaser.Math.Clamp(this.y - dy, lowerLimit, upperLimit);



            // Calcula a posição normalizada do objeto dentro do contêiner
            const normalizedPosition = (this.y - upperLimit) / (lowerLimit - upperLimit);

            // Calcula a porcentagem multiplicando pela escala de 100
            const positionPercentage = normalizedPosition * 100;

            // Ajusta o valor para garantir que esteja dentro do intervalo [0, 100]
            this.containerPosition = Phaser.Math.Clamp(positionPercentage, 0, 100);
            console.log(this.containerPosition);
            this.setScrollThumbPosition(this.containerPosition)
            // this.updateScrollThumb()
            this.input.dragStartY = dragY;
        }
    }

    createMask() {
        this.initialMaskY = this.y - this.height / 2
        this.maskGraphics = this.scene.make.graphics();
        this.maskGraphics.fillStyle(0xffffff);
        //foi o unico jeito de centralizar a mascara no container
        this.maskGraphics.fillRect(this.x - this.width / 2, this.initialMaskY, this.width, this.maskHeight);
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
    createScrollbar() {
        const scrollbarWidth = 10; // largura da barra de rolagem
        this.scrollThumbHeight = 40; // altura igual à altura da máscara
        this.scrollRange = this.maskHeight - this.scrollThumbHeight;
        const scrollbarColor = 0x666666; // cor d console.log('Y:', lowerLimit)a barra de rolagem

        this.scrollBar = this.scene.add.rectangle(
            this.x + this.width / 2 + scrollbarWidth / 2, // posição à direita do contêiner
            this.initialMaskY, // mesma posição vertical do contêiner
            scrollbarWidth,
            this.maskHeight,
            0x000000,
        );
        this.scrollBar.setOrigin(0.5, 0)
        this.scrollThumb = this.scene.add.rectangle(
            this.x + this.width / 2 + scrollbarWidth / 2, // posição à direita do contêiner
            this.initialMaskY + this.scrollThumbHeight / 2, // mesma posição vertical do contêiner
            scrollbarWidth,
            this.scrollThumbHeight,
            scrollbarColor
        );
        this.scrollThumb.setOrigin(0.5); // define a origem no topo do retângulo
        this.scrollThumb.setInteractive({ draggable: true, cursor: 'pointer' });
        this.scrollThumbPosition = 0
        this.scrollThumb.on('dragstart', (pointer, dragX, dragY) => {
            this.scrollThumb.dragStartY = this.scrollThumb.y; // Registra a posição inicial do arrastar
        });
        this.scrollThumb.on('drag', (pointer, dragX, dragY) => {


            if (this.scrollThumb.dragStartY !== undefined) {
                const dy = dragY;
                const upperLimit = this.initialMaskY + this.scrollThumbHeight / 2;
                const lowerLimit = this.initialMaskY + this.maskHeight - this.scrollThumbHeight / 2;
                this.scrollThumb.y = Phaser.Math.Clamp(dy, upperLimit, lowerLimit);

                // Calcula a posição normalizada da scrollThumb dentro do scrollRange

                const normalizedPosition = (this.scrollThumb.y - upperLimit) / this.scrollRange;

                // Calcula a porcentagem multiplicando pela escala de 100
                const thumbPositionPercentage = normalizedPosition * 100;

                // Ajusta o valor para garantir que esteja dentro do intervalo [0, 100]
                this.scrollThumbPosition = Phaser.Math.Clamp(thumbPositionPercentage, 0, 100);

                this.moveContent(); // Move o conteúdo conforme a posição da scrollThumb
                console.log(this.scrollThumbPosition);

                this.scrollThumb.dragStartY = dragY;
            }
        });
        this.scrollThumb.on('dragend', () => {
            this.scrollThumb.dragStartY = undefined; // Limpa a posição inicial do arrastar
        });
    }
    moveContent() {
        const scrollableHeight = this.height - this.maskHeight; // A quantidade de conteúdo que pode ser rolada
        const contentOffset = this.scrollThumbPosition * (scrollableHeight / 100); // O deslocamento do conteúdo baseado na porcentagem da scrollThumb
        this.y = this.displayOriginY + this.initialMaskY - contentOffset;
    }

    setScrollThumbPosition(percentage) {
        // Converte a porcentagem em uma posição normalizada
        const upperLimit = this.initialMaskY + this.scrollThumbHeight / 2;
        const lowerLimit = this.initialMaskY + this.maskHeight - this.scrollThumbHeight / 2;
        const normalizedPosition = Phaser.Math.Clamp(percentage, 0, 100) / 100;

        // Calcula a posição real do scrollThumb.y dentro dos limites superior e inferior
        const thumbY = upperLimit + normalizedPosition * this.scrollRange;

        // Define a posição do scrollThumb.y garantindo que esteja dentro dos limites superior e inferior
        this.scrollThumb.y = Phaser.Math.Clamp(thumbY, upperLimit, lowerLimit);

        // Atualiza a posição normalizada do scrollThumb
        this.scrollThumbPosition = percentage;
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




        this.container = new WrapperContainer(this, 954, centerY, 670)
        this.cards = createAllCards(this, true)

        // this.cards[10].setVisible(true)
        for (let id in this.cards) {
            if (this.cards.hasOwnProperty(id)) {
                this.container.addItem(this.cards[id]);

            }
        }
        this.container.updateLayout(0.55, 80, 80, 60);
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
