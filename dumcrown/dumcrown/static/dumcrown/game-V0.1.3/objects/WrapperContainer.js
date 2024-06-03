import { showCoordinates } from "../functions/functions.js";


export class WrapperContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, maskHeight, scrollable = false) {
        super(scene, x, y);
        this.maskHeight = maskHeight
        this.scrollable = scrollable
        this.width = 1;
        this.height = 1;
        this.items = [];

        scene.add.existing(this);
    }

    addItem(item) {
        this.add(item);
        this.items.push(item)
    }

    updateLayout(scale, initialY, xGap, yGap, itemsPerRow) {
        const maxItemsPerRow = itemsPerRow;
        const totalItems = this.items.length;
        const numRows = Math.ceil(totalItems / maxItemsPerRow);

        let xPos, yPos;
        this.width = maxItemsPerRow * (this.items[0].width * scale + xGap);
        this.height = numRows * (this.items[0].height * scale + yGap);
        this.y = this.height / 2 + initialY;

        for (let i = 0; i < totalItems; i++) {
            const item = this.items[i];
            const itemWidth = item.width * scale
            const itemHeight = item.height * scale

            xPos = (i % maxItemsPerRow) * (itemWidth + xGap) - (maxItemsPerRow - 1) * (itemWidth + xGap) / 2;
            yPos = Math.floor(i / maxItemsPerRow) * (itemHeight + yGap);

            item.x = xPos;
            item.y = yPos - this.displayOriginY + itemHeight / 2 + 10;
            item.setVisible(true);
            item.setScale(scale);

        }



        this.createMask()

        if (this.scrollable) {
            this.createScrollbar()
            this.setLimits()
        }

        this.setupEventListeners()
        this.setInteractive({ draggable: true });


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

    setLimits() {
        this.containerUpperLimit = this.displayOriginY + this.initialMaskY;
        this.containerLowerLimit = (-this.height / 2) + this.maskHeight + this.initialMaskY;

        this.thumbUpperLimit = this.initialMaskY + this.scrollThumbHeight / 2;
        this.thumbLowerLimit = this.initialMaskY + this.maskHeight - this.scrollThumbHeight / 2;
    }

    setupEventListeners() {
        this.on('pointerdown', this.checkClick);

        if (this.scrollable) {
            this.on('drag', this.drag);
            this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                this.onMouseWheel(deltaY);
            });
        }
    }

    onMouseWheel(deltaY) {
        const scrollSpeed = deltaY / 3;

        this.containerPosition = this.getPercentagePosition();

        this.y = Phaser.Math.Clamp(this.y - scrollSpeed, this.containerLowerLimit, this.containerUpperLimit);
        this.setScrollThumbPosition(this.containerPosition)

        console.log(this.containerPosition);
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

    drag(pointer, dragX, dragY) {
        if (this.input.dragStartY !== undefined) {
            const verticalDragDelta = this.input.dragStartY - dragY;

            this.y = Phaser.Math.Clamp(this.y - verticalDragDelta, this.containerLowerLimit, this.containerUpperLimit);

            this.containerPosition = this.getPercentagePosition()
            this.setScrollThumbPosition(this.containerPosition)
            this.input.dragStartY = dragY;
        }
    }

    getPercentagePosition() {
        const normalizedPosition = (this.y - this.containerUpperLimit) / (this.containerLowerLimit - this.containerUpperLimit);

        const positionPercentage = normalizedPosition * 100;
        return Phaser.Math.Clamp(positionPercentage, 0, 100);
    }


    containerDisplay() {
        this.containerRect = this.scene.add.rectangle(
            0, 0,
            this.width, this.height, 0xCCC44C, 0.4);
        this.containerRect.setStrokeStyle(2, 0x000000);
        this.containerRect.setOrigin(0.5);
        this.add(this.containerRect);
    }
    //TODO
    createScrollbar() {
        const scrollbarWidth = 10; // largura da barra de rolagem
        this.scrollThumbHeight = 40; // altura igual à altura da máscara
        this.scrollRange = this.maskHeight - this.scrollThumbHeight;
        const scrollbarColor = 0x666666; // cor d console.log('Y:', this.thumbLowerLimit)a barra de rolagem

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
                const verticalDragDelta = dragY;
                this.scrollThumb.y = Phaser.Math.Clamp(verticalDragDelta, this.thumbUpperLimit, this.thumbLowerLimit);

                // Calcula a posição normalizada da scrollThumb dentro do scrollRange

                const normalizedPosition = (this.scrollThumb.y - this.thumbUpperLimit) / this.scrollRange;

                // Calcula a porcentagem multiplicando pela escala de 100
                const thumbPositionPercentage = normalizedPosition * 100;

                // Ajusta o valor para garantir que esteja dentro do intervalo [0, 100]
                this.scrollThumbPosition = Phaser.Math.Clamp(thumbPositionPercentage, 0, 100);

                this.moveContent();
                console.log(this.scrollThumbPosition);

                this.scrollThumb.dragStartY = dragY;
            }
        });
        this.scrollThumb.on('dragend', () => {
            this.scrollThumb.dragStartY = undefined; // Limpa a posição inicial do arrastar
        });
    }
    moveContent() {
        const scrollableHeight = this.height - this.maskHeight;
        const contentOffset = this.scrollThumbPosition * (scrollableHeight / 100);
        this.y = this.displayOriginY + this.initialMaskY - contentOffset;
    }

    setScrollThumbPosition(percentage) {

        const normalizedPosition = Phaser.Math.Clamp(percentage, 0, 100) / 100;

        const thumbY = this.thumbUpperLimit + normalizedPosition * this.scrollRange;

        this.scrollThumb.y = Phaser.Math.Clamp(thumbY, this.thumbUpperLimit, this.thumbLowerLimit);

        this.scrollThumbPosition = percentage;
    }

    destroy() {
        if (this.scrollable) {
            this.scene.input.off('wheel');
            this.scrollBar.destroy();
            this.scrollThumb.destroy();
        }
        if (this.maskGraphics) {
            this.maskGraphics.destroy();
        }
        super.destroy();
    }

}