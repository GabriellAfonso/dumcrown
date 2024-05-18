import { GAME, centerX, centerY } from "../config/gameConfig.js";
import { add_text } from "../functions/texts.js";
import { unitsData } from "../client/client.js";
export class CardObject extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);

        this.x = centerX + 200
        this.y = centerY
        this.setSize(328, 489);
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
    // visible(bolean) {
    //     this.setVisible(bolean)
    // }

    getID() {
        return this.id
    }

    showCase() {
        this.on('pointerup', () => {
            console.log('clicou na carta')
            // Inicia a cena 'CardDetailScene' e passa os detalhes da carta

        });
    }
}

export class JhonCopper extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[1])
    }
}

export class CarolArlet extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[2])
    }
}

export class mortem extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[3])
    }
}

export class kronos extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[4])
    }
}

export class DarkAge extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[5])
    }
}

export class Khras extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[6])
    }
}

export class Skillet extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[7])
    }
}

export class CDC extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[8])
    }
}

export class Okada extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[9])
    }
}

export class SmoothCriminal extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[10])
    }
}

export class Boogie extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[11])
    }
}

export class Spring extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[12])
    }
}

export class Polaroid extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(unitsData[13])
    }
}

export class Maniac extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[14])
    }
}

export class Crazy extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(unitsData[15])
    }
}

export class Ojays extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[16])
    }
}

export class NeonB extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[17])
    }
}

export class Ballhan extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(unitsData[18])
    }
}

export class DarkNecessites extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[19])
    }
}

export class Anomaly extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(unitsData[20])
    }
}

export class RhiorosGhost extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(unitsData[21])
    }
}

export function createAllCards(scene, showCase = false) {
    const cardClasses = [
        JhonCopper, CarolArlet, mortem, kronos, DarkAge, Khras, Skillet,
        CDC, Okada, SmoothCriminal, Boogie, Spring, Polaroid, Maniac, Crazy,
        Ojays, NeonB, Ballhan, DarkNecessites, Anomaly, RhiorosGhost
    ];

    var cards = {};

    cardClasses.forEach(CardClass => {
        var card = new CardClass(scene);
        var id = card.getID()
        if (showCase) {
            card.showCase()
        }
        cards[id] = card
    });

    return cards;
}