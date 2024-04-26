import { GAME, centerX, centerY } from "../config/gameConfig.js";
import { add_text } from "../functions/texts.js";

export class CardObject extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        //Só alterar o texto nas calsses que extender dessa com this.name.text = 'nome'
        this.x = centerX + 200
        this.y = centerY
        this.setSize(328, 489);


        this.id = 0

        this.cardMonster = scene.add.image(0, 0, 'darkage1_card');
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


        this.add([this.cardMonster, this.cardLayout, this.description, this.name, this.energy, this.attack, this.defense]);
        this.scene.add.existing(this);
    }

    createCard(data) {
        this.id = data.id
        this.cardMonster.setTexture(data.monster)
        this.name.text = data.name
        this.description.text = data.description
        this.energy.text = data.energy
        this.attack.text = data.attack
        this.defense.text = data.defense
    }
}

export class JhonCopper extends CardObject {
    constructor(scene) {
        super(scene)

        var card = {
            id: 1,
            monster: 'jhon_card',
            name: 'JHON COPPER',
            description: 'descriçao aqui',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(card)
    }
}