import { GAME, centerX, centerY } from "../config/gameConfig.js";
import { add_text } from "../functions/texts.js";
import { cardsDATA } from "../client/client.js";
import { Button } from "../functions/buttons.js";
import { sendSocket } from "../functions/functions.js";
export class BaseCardObject extends Phaser.GameObjects.Container {
    constructor(scene, id, data = {}, config = {}) {
        super(scene);

        this.setSize(328, 483);
        this.scene = scene;
        this.handModeActive = false
        this.sample = false;
        this.id = id;
        this.state = 'onDeck'
        this.constEnergyFontSize = 50

        // Configuração básica da carta
        this.cardImage = scene.add.image(0, 0, config.imageKey || 'default_image');
        this.cardImage.setScale(config.imageScale || 1);

        this.cardLayout = scene.add.image(0, 0, config.layoutKey || 'default_layout');


        this.name = scene.add.text(0, 70, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.name.setOrigin(0.5, 0.5);

        this.description = scene.add.text(0, 140, '',
            { fontSize: '22px', fill: '#ffffff', align: 'center', fontFamily: 'sans-serif', wordWrap: { width: 300, useAdvancedWrap: true } });
        this.description.setOrigin(0.5, 0.5);

        this.energy = scene.add.text(-117, -192, '',
            { fontSize: '50px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.energy.setOrigin(0.5, 0.5);

        this.add([this.cardImage, this.cardLayout, this.description, this.name, this.energy,]);

        this.scene.add.existing(this);
        this.setVisible(false);

        // if (data) {
        //     this.createCard(id, data);
        // }
        this.smooth = false;
    }
    set textScale(value) {
        this.energy.setScale(1 / value)
        var nfsEnergy = this.constEnergyFontSize * value
        var energyFontSize = nfsEnergy + 'px'
        console.log(energyFontSize)
        this.energy.setFontSize(energyFontSize);
    }

    get textScale() {
        return null
    }
    createCard(id, data) {
        this.id = id;
        this.cardImage.setTexture(data.image);
        this.name.text = data.name;
        this.description.text = data.description;
        this.energy.text = data.energy;
    }

    clone() {
        let clone = new this.constructor(this.scene);
        clone.createCard(this.id, {
            image: this.cardImage.texture.key,
            name: this.name.text,
            description: this.description.text,
            energy: this.energy.text
        });
        return clone;
    }

    getID() {
        return this.id;
    }

    showCase() {
        this.on('pointerup', () => {
            GAME.scene.run('CardDetailScene', this);
        });
    }

    deckEdit() {
        this.on('pointerup', () => {
            const cardID = this.getID();
            this.scene.events.emit('addToDeck', cardID);
        });

        this.on('lockCard', () => {
            this.cardPoster.destroy();
            this.cardPoster = this.scene.add.image(0, 0, 'locked_card');
            this.add(this.cardPoster);
        });

        this.on('unlockCard', () => {
            this.cardPoster.destroy();
            this.cardPoster = this.scene.add.image(0, 0, 'add_to_deck');
            this.add(this.cardPoster);
        });

        this.cardPoster = this.scene.add.image(0, 0, 'add_to_deck');
        this.add(this.cardPoster);
    }

    swapMode(data = 'swap') {
        if (data === 'undo') {
            if (this.disabledCard) {
                this.disabledCard.destroy();
                this.scaleX /= 0.95;
                this.scaleY /= 0.95;
            }
            return;
        }
        this.scaleX *= 0.95;
        this.scaleY *= 0.95;
        this.disabledCard = this.scene.add.image(0, 0, 'disabled_card');
        this.add(this.disabledCard);
    }
    openHandMode() {
        this.state = 'onHand'
        let startX = null
        let startY = null
        this.cardIsDragging = false

        this.restPosition = {
            x: this.x,
            y: this.y,
            angle: this.angle,
            depth: this.depth,
        }

        if (this.handModeActive) {
            return
        }

        this.handModeActive = true
        this.collider = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 328, 483, 0x000080, 0.3);
        this.add(this.collider)
        this.collider.setInteractive();

        this.activeTween = null;

        this.collider.on('pointerdown', (pointer) => {
            if (this.activeTween) {
                this.activeTween.stop();
            }
            this.cardIsDragging = true
            startX = pointer.x;
            startY = pointer.y;

            this.collider.scale = 30

            this.activeTween = this.scene.tweens.add({
                targets: this,
                y: 517, // Move a carta para cima
                angle: 0,
                depth: 10,
                scale: 0.65,
                duration: 400,
                ease: 'Power2',
            });
        });


        this.collider.on('pointerup', () => {
            if (this.activeTween) {
                this.activeTween.stop();
            }
            this.cardIsDragging = false
            this.collider.scale = 1

            this.scene.events.emit('cardDropped', this)
            console.log(this.state)
            if (this.state == 'onHand') {
                this.activeTween = this.scene.tweens.add({
                    targets: this,
                    x: this.restPosition.x,
                    y: this.restPosition.y,
                    angle: this.restPosition.angle,
                    depth: this.restPosition.depth,
                    scale: 0.5,
                    duration: 200,
                    ease: 'Power2',
                });
            }



        });

        this.collider.on('pointermove', (pointer) => {


            if (this.cardIsDragging) {
                const deltaX = pointer.x - startX;
                const deltaY = pointer.y - startY;
                if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
                    this.activeTween.stop()
                    this.angle = 0
                    this.scale = 0.28 // 0.32
                    this.depth = 50
                    this.x = pointer.x
                    this.y = pointer.y


                }


            }
        });
    }
    onBenchMode() {
        this.state = 'onBench'
        this.destroyCollider()

    }

    closedHandMode() {
        if (!this.handModeActive) {
            return;
        }

        // Define `handModeActive` como falso, indicando que o modo fechado está ativo agora
        this.handModeActive = false;

        this.destroyCollider()

    }
    destroyCollider() {
        if (this.collider) {
            this.collider.removeInteractive();
            this.collider.destroy();  // Remove o objeto da cena
            this.collider = null;
        }
    }

    stopTween() {
        if (this.activeTween) {
            this.activeTween.stop();
        }
    }
}

export class CardObject extends BaseCardObject {
    constructor(scene, id, data = {}) {
        super(scene, id, data, { imageKey: 'darkage1_card', layoutKey: 'cardlayout-neutro' });

        // Elementos específicos do CardObject
        this.attack = scene.add.text(-117, 212, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.attack.setOrigin(0.5, 0.5);
        this.defense = scene.add.text(117, 212, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.defense.setOrigin(0.5, 0.5);

        this.add([this.attack, this.defense]);

        if (data) {
            this.createCard(id, data);
        }
    }

    createCard(id, data) {
        super.createCard(id, data);
        this.attack.text = data.attack;
        this.defense.text = data.defense;
    }

    clone() {
        let clone = new CardObject(this.scene);
        clone.createCard(this.id, {
            image: this.cardImage.texture.key,
            name: this.name.text,
            description: this.description.text,
            energy: this.energy.text,
            attack: this.attack.text,
            defense: this.defense.text
        });
        return clone;
    }
}

export class SpellCardObject extends BaseCardObject {
    constructor(scene, id, data = {}) {
        super(scene, id, data, { imageKey: 'empty', layoutKey: 'spellcardlayout', imageScale: 0.3 });

        this.cardImage.y = -80
        // SpellCardObject não tem ataque/defesa, apenas a configuração básica
        if (data) {
            super.createCard(id, data);
        }
    }

    clone() {
        let clone = new SpellCardObject(this.scene);
        clone.createCard(this.id, {
            image: this.cardImage.texture.key,
            name: this.name.text,
            description: this.description.text,
            energy: this.energy.text
        });
        return clone;
    }
}

export class compressedCardObject extends Phaser.GameObjects.Container {
    constructor(scene, data = {}, quantity = 1) {
        super(scene);
        this.scene = scene;

        this.id = data.id
        this.setSize(297, 57);
        this.cardLayout = scene.add.image(0, 0, '');
        // this.setScale(0.3)

        if (data.type == 'unit') {
            this.cardLayout.setTexture('compressed_unit_layout')
        } else {
            this.cardLayout.setTexture('compressed_spell_layout')
        }

        this.name = scene.add.text(0, 0, data.name,
            { fontSize: '18px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.name.setOrigin(0.5, 0.5);

        this.quantity = scene.add.text(127, 0, quantity,
            { fontSize: '29px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.quantity.setOrigin(0.5, 0.5);

        this.energy = scene.add.text(-123, 0, data.energy,
            { fontSize: '29px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.energy.setOrigin(0.5, 0.5);


        this.add([this.cardLayout, this.name, this.energy, this.quantity]);
        this.scene.add.existing(this);
        this.setVisible(true)
        this.addEventListeners()
    }

    setQuantity(number) {
        this.postFX.clear()
        let color

        if (number < this.quantity.text) {
            color = 0xFF0000 //red
        } else if (number > this.quantity.text) {
            color = 0x32CD32 // green
        }

        this.fx = this.postFX.addGlow(color, 0, 0, false, 0.1, 12);
        this.scene.tweens.add({
            targets: this.fx,
            outerStrength: 1,
            yoyo: true,
            duration: 200,
            ease: 'linear',
            onComplete: () => {

            }
        });
        this.quantity.text = number
    }

    addEventListeners() {
        this.on('pointerup', this.remove)
    }

    remove() {
        this.scene.events.emit('remove_from_deck', this)
    }

}


