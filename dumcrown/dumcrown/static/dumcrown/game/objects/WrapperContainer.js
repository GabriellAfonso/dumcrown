import { showCoordinates, sleep } from "../functions/functions.js";


export class WrapperContainer extends Phaser.GameObjects.Container {
    constructor(scene, x, y, maskHeight, scrollable = false) {
        super(scene, x, y);
        this.maskHeight = maskHeight
        this.scrollable = scrollable
        this.width = 1;
        this.height = 1;
        this.items = [];
        this.scrollThumbPosition = 0
        this.teste = true

        scene.add.existing(this);
    }

    addItem(item) {
        this.add(item);
        this.items.push(item)
        // console.log('item ', item)
    }

    removeItem(item, delay = 0) {
        // Remove o item do container do Phaser

        // console.log(item)

        // Encontra o índice do item no array items
        const index = this.items.findIndex(i => i === item);

        if (index !== -1) {

            // console.log('item encontrado')
            sleep(this.scene, delay, () => {
                this.items.splice(index, 1);
                this.remove(item);
                item.destroy()
            })
            return
        }
        // console.log('item nao encontrado')

    }

    updateLayout(scale, initialY, xGap, yGap, itemsPerRow, initGap = 10) {
        this.resetContainer();

        const maxItemsPerRow = itemsPerRow;
        const totalItems = this.items.length;
        const numRows = Math.max(1, Math.ceil(totalItems / maxItemsPerRow));

        let xPos, yPos;
        if (totalItems > 0) {
            this.width = maxItemsPerRow * (this.items[0].width * scale + xGap);
            this.height = numRows * (this.items[0].height * scale + yGap);
        } else {
            this.width = maxItemsPerRow * (1 * scale + xGap);
            this.height = numRows * (1 * scale + yGap);
        }

        this.y = this.height / 2 + initialY;


        for (let i = 0; i < totalItems; i++) {
            const item = this.items[i];
            const itemWidth = item.width * scale;
            const itemHeight = item.height * scale;

            xPos = (i % maxItemsPerRow) * (itemWidth + xGap) - (maxItemsPerRow - 1) * (itemWidth + xGap) / 2;
            yPos = Math.floor(i / maxItemsPerRow) * (itemHeight + yGap);

            item.x = xPos;
            item.y = yPos - this.displayOriginY + itemHeight / 2 + initGap;
            item.setVisible(true);
            item.setScale(scale);
            const p = this.getGlobalPosition(item);
            item.emit('scaleChange', p.x, p.y);
        }

        this.createMask();

        if (this.scrollValidator()) {
            this.moveContent()
            this.createScrollbar();
            this.setLimits();
        }

        this.addEventListeners();
        this.setInteractive({ draggable: true });
        this.input.hitArea.setSize(this.width, this.height);
    }


    resetContainer() {

        this.removeAllListeners()
        if (this.scrollable) {
            this.scene.input.off('wheel');
            if (this.scrollBar) {
                this.scrollBar.destroy();
                this.scrollThumb.destroy();
            }

        }
        if (this.maskGraphics) {
            this.maskGraphics.destroy();
        }
    }
    // removeInteractive() {
    //     this.disableInteractive(); // Desabilita a interatividade

    //     // Limpa completamente a interatividade
    //     this.input.hitArea = null;
    //     this.input.enabled = false;
    //     this.input.stopPropagation = false;
    // }
    createMask() {
        this.initialMaskY = this.y - this.height / 2
        this.maskGraphics = this.scene.make.graphics();
        this.maskGraphics.fillStyle(0xffffff);
        //foi o unico jeito de centralizar a mascara no container
        this.maskGraphics.fillRect(this.x - this.width / 2, this.initialMaskY, this.width, this.maskHeight);
        this.maskShape = this.maskGraphics.createGeometryMask();
        this.setMask(this.maskShape);
        this.maskBounds = new Phaser.Geom.Rectangle(
            this.x - this.width / 2,
            this.initialMaskY,
            this.width,
            this.maskHeight
        );

    }
    isPointerInMask(pointer) {
        return this.maskBounds.contains(pointer.x, pointer.y);
    }

    setLimits() {
        this.containerUpperLimit = this.displayOriginY + this.initialMaskY;
        this.containerLowerLimit = (-this.height / 2) + this.maskHeight + this.initialMaskY;

        this.thumbUpperLimit = this.initialMaskY + this.scrollThumbHeight / 2;
        this.thumbLowerLimit = this.initialMaskY + this.maskHeight - this.scrollThumbHeight / 2;
    }

    addEventListeners() {
        this.on('pointerdown', this.checkClick);

        if (this.scrollable && this.height > this.maskHeight) {
            this.on('drag', this.drag);
            this.on('pointerover', () => {
                // console.log('ta em cima')
                this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
                    this.onMouseWheel(deltaY);
                });
            })
            this.on('pointerout', () => {
                this.scene.input.off('wheel');
            })
        }
    }
    scrollValidator() {
        if (this.scrollable && this.height > this.maskHeight) {
            return true
        }
        return false
    }

    onMouseWheel(deltaY) {
        const scrollSpeed = deltaY / 3;

        this.containerPosition = this.getPercentagePosition();

        this.y = Phaser.Math.Clamp(this.y - scrollSpeed, this.containerLowerLimit, this.containerUpperLimit);
        this.setScrollThumbPosition(this.containerPosition)

        // console.log(this.containerPosition);
    }



    checkClick(pointer) {
        if (this.isPointerInMask(pointer)) {
            this.items.forEach(item => {
                item.setInteractive()
            });
            setTimeout(() => {
                if (this.scene) {
                    this.items.forEach(item => {
                        item.disableInteractive()
                    });
                }


            }, 200)
        } else {
            // console.log('ta fora')
        }

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

    getGlobalPosition(item) {
        let matrix = this.getWorldTransformMatrix();

        let localX = item.x;
        let localY = item.y;

        let localPoint = new Phaser.Math.Vector2(localX, localY);

        let globalPoint = matrix.transformPoint(localPoint.x, localPoint.y);
        return globalPoint
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
        const scrollbarWidth = 6; // largura da barra de rolagem
        this.scrollThumbHeight = 40; // altura igual à altura da máscara
        this.scrollRange = this.maskHeight - this.scrollThumbHeight;
        const scrollbarColor = 0x07735d; // cor d console.log('Y:', this.thumbLowerLimit)a barra de rolagem

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
                // console.log(this.scrollThumbPosition);

                this.scrollThumb.dragStartY = dragY;
            }
        });
        this.scrollThumb.on('dragend', () => {
            this.scrollThumb.dragStartY = undefined; // Limpa a posição inicial do arrastar
        });
        if (this.scrollThumbPosition !== 0) {

            this.setScrollThumbPosition(this.scrollThumbPosition)
        }

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
    scrollToLowerLimit() {
        if (this.scrollValidator()) {
            this.y = this.containerLowerLimit;
            this.setScrollThumbPosition(100);
        }
    }
    destroy() {
        if (this.scrollable) {
            this.scene.input.off('wheel');
            if (this.scrollBar) {
                this.scrollBar.destroy();
                this.scrollThumb.destroy();
            }

        }
        if (this.maskGraphics) {
            this.maskGraphics.destroy();
        }
        super.destroy();
    }

}