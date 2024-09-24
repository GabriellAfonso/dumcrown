import { GAME, centerX, centerY } from "../config/gameConfig.js";
import { add_text } from "../functions/texts.js";
import { cardsDATA } from "../client/client.js";
import { Button } from "../functions/buttons.js";
export class CardObject extends Phaser.GameObjects.Container {
    constructor(scene, data = {}) {
        super(scene);

        this.setSize(328, 483);
        this.scene = scene;

        this.inGame = false
        this.sample = false

        this.id = 0

        this.cardImage = scene.add.image(0, 0, 'darkage1_card');
        this.cardLayout = scene.add.image(0, 0, 'cardlayout-neutro');

        this.name = scene.add.text(0, 70, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.name.setOrigin(0.5, 0.5);

        this.description = scene.add.text(0, 140, '',
            { fontSize: '17px', fill: '#ffffff', align: 'center', fontFamily: 'sans-serif', });
        this.description.setOrigin(0.5, 0.5);

        this.energy = scene.add.text(-117, -192, '',
            { fontSize: '50px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.energy.setOrigin(0.5, 0.5);

        this.attack = scene.add.text(-117, 215, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.attack.setOrigin(0.5, 0.5);

        this.defense = scene.add.text(117, 215, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.defense.setOrigin(0.5, 0.5);


        this.add([this.cardImage, this.cardLayout, this.description, this.name, this.energy, this.attack, this.defense]);
        this.scene.add.existing(this);
        this.setVisible(false)

        if (data) {
            this.createCard(data)
        }
    }

    createCard(data) {
        this.id = data.id
        this.cardImage.setTexture(data.image)
        this.name.text = data.name
        this.description.text = data.description
        this.energy.text = data.energy
        this.attack.text = data.attack
        this.defense.text = data.defense
    }

    clone() {
        let clone = new CardObject(this.scene);
        clone.createCard({
            id: this.id,
            image: this.cardImage.texture.key,
            name: this.name.text,
            description: this.description.text,
            energy: this.energy.text,
            attack: this.attack.text,
            defense: this.defense.text,
        });
        return clone;
    }

    getID() {
        return this.id
    }

    showCase() {
        this.on('pointerup', () => {
            GAME.scene.run('CardDetailScene', this);
            // Inicia a cena 'CardDetailScene' e passa os detalhes da carta

        });

    }
    deckEdit() {
        this.on('pointerup', () => {

            console.log('soltou')
            const cardID = this.getID()
            this.scene.events.emit('addToDeck', cardID)
        });
        this.on('lockCard', () => {
            this.cardPoster.destroy()
            this.cardPoster = this.scene.add.image(0, 0, 'locked_card');
            this.add(this.cardPoster)
            console.log('max card aqui')
        })
        this.on('unlockCard', () => {
            this.cardPoster.destroy()
            this.cardPoster = this.scene.add.image(0, 0, 'add_to_deck');
            this.add(this.cardPoster)
            console.log('max card aqui')
        })

        this.cardPoster = this.scene.add.image(0, 0, 'add_to_deck');
        this.add(this.cardPoster)

    }

}

export class SpellCardObject extends Phaser.GameObjects.Container {
    constructor(scene, data = {}) {
        super(scene);



        this.setSize(328, 483);
        this.scene = scene;

        this.inGame = false
        this.sample = false
        this.isDrag = false

        this.id = 's0'

        this.cardImage = scene.add.image(0, -80, 'empty');
        this.cardImage.setScale(0.3)

        this.cardLayout = scene.add.image(0, 0, 'spellcardlayout');

        this.name = scene.add.text(0, 80, '',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.name.setOrigin(0.5, 0.5);

        this.description = scene.add.text(0, 140, '',
            { fontSize: '18px', fill: '#ffffff', align: 'center', fontFamily: 'sans-serif', wordWrap: { width: 300, useAdvancedWrap: true } });
        this.description.setOrigin(0.5, 0.5);

        this.energy = scene.add.text(-117, -192, '',
            { fontSize: '50px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.energy.setOrigin(0.5, 0.5);


        this.add([this.cardImage, this.cardLayout, this.description, this.name, this.energy,]);
        this.scene.add.existing(this);
        this.setVisible(false)

        if (data) {
            this.createCard(data)
        }
    }

    createCard(data) {
        this.id = data.id
        this.cardImage.setTexture(data.image)
        this.name.text = data.name
        this.description.text = data.description
        this.energy.text = data.energy
    }

    clone() {
        let clone = new SpellCardObject(this.scene);
        clone.createCard({
            id: this.id,
            image: this.cardImage.texture.key,
            name: this.name.text,
            description: this.description.text,
            energy: this.energy.text
        });
        return clone;
    }

    getID() {
        return this.id
    }

    showCase() {
        this.on('pointerup', () => {
            GAME.scene.run('CardDetailScene', this);
        });
        this.on('pointermove', function (pointer) {


        });
    }
    deckEdit() {
        this.on('pointerup', () => {
            console.log('soltou')
            const cardID = this.getID()
            this.scene.events.emit('addToDeck', cardID)
        });
        this.on('lockCard', () => {
            this.cardPoster.destroy()
            this.cardPoster = this.scene.add.image(0, 0, 'locked_card');
            this.add(this.cardPoster)
            console.log('max card aqui')
        })
        this.on('unlockCard', () => {
            this.cardPoster.destroy()
            this.cardPoster = this.scene.add.image(0, 0, 'add_to_deck');
            this.add(this.cardPoster)
            console.log('max card aqui')
        })

        this.cardPoster = this.scene.add.image(0, 0, 'add_to_deck');
        this.add(this.cardPoster)

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


