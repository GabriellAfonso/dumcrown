import { GAME, centerX, centerY } from "../config/gameConfig.js";
import { add_text } from "../functions/texts.js";

export class CardObject extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        //Só alterar o texto nas calsses que extender dessa com this.name.text = 'nome'
        this.x = centerX + 200
        this.y = centerY
        this.setSize(328, 489);

        this.cardMonster = scene.add.image(0, 0, 'smoothcriminal_card');

        this.cardLayout = scene.add.image(0, 0, 'cardlayout-neutro');

        // this.nameText = add_text(scene, 0, 60, 'AS PRESAS', '25px', 0.5)
        this.nameText = scene.add.text(0, 70, 'SMOOTH CRIMINAL',
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.nameText.setOrigin(0.5, 0.5);

        var texto = 'quando esta carta esta em campo \nTodas as cartas recebem X efeito \npor 17 segundos'
        this.effect = scene.add.text(0, 140, texto,
            { fontSize: '17px', fill: '#ffffff', align: 'center', fontFamily: 'sans-serif', });
        this.effect.setOrigin(0.5, 0.5);

        this.energyText = scene.add.text(-117, -180, 5,
            { fontSize: '50px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.energyText.setOrigin(0.5, 0.5);

        this.attackText = scene.add.text(-117, 215, 10,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.attackText.setOrigin(0.5, 0.5);

        this.defenseText = scene.add.text(117, 215, 8,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'sans-serif', stroke: '#000000', strokeThickness: 2 });
        this.defenseText.setOrigin(0.5, 0.5);


        this.add([this.cardMonster, this.cardLayout, this.effect, this.nameText, this.energyText, this.attackText, this.defenseText]);
        this.scene.add.existing(this);
    }
}
