import { GAME, centerX, centerY } from "../config/gameConfig.js";
import { add_text } from "../functions/texts.js";
import { cardData } from "./data.js";
export class CardObject extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        //Só alterar o texto nas calsses que extender dessa com this.name.text = 'nome'
        this.x = centerX + 200
        this.y = centerY
        this.setSize(328, 489);
        this.scene = scene;

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
        // this.scene.add.existing(this);
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
}

export class JhonCopper extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 1,
            image: 'jhon_card',
            name: 'JHON COPPER',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class CarolArlet extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 2,
            image: 'carol_card',
            name: 'CAROL ARLET',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class mortem extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 3,
            image: 'mortem_card',
            name: 'MORTEM',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class kronos extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 4,
            image: 'kronos_card',
            name: 'KRONOS',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class DarkAge extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 5,
            image: 'darkage1_card',
            name: 'DARK AGE',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Khras extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 6,
            image: 'khras_card',
            name: 'KHRAS',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Skillet extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 7,
            image: 'skillet_card',
            name: 'SKILLET',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class CDC extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 8,
            image: 'cdc_card',
            name: 'CDC',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Okada extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 9,
            image: 'okada_card',
            name: 'OKADA',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class SmoothCriminal extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 10,
            image: 'smoothcriminal_card',
            name: 'SMOOTH CRIMINAL',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Boogie extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 11,
            image: 'boogie_card',
            name: 'BOOGIE',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Spring extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 12,
            image: 'spring_card',
            name: 'SPRING',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Polaroid extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 13,
            image: 'polaroid_card',
            name: 'POLAROID',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Maniac extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 14,
            image: 'maniac_card',
            name: 'MANIAC',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Crazy extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 15,
            image: 'crazy_card',
            name: 'CRAZY',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Ojays extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 16,
            image: 'theojays_card',
            name: "THE O'JAYS",
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class NeonB extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 17,
            image: 'neonb_card',
            name: 'NEON B.',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Ballhan extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 18,
            image: 'ballhan_card',
            name: 'BALLHAN',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class DarkNecessites extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 19,
            image: 'darknecessites_card',
            name: 'DARK NECESSITES',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class Anomaly extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 20,
            image: 'anomaly_card',
            name: 'ANOMALY',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}

export class RhiorosGhost extends CardObject {
    constructor(scene) {
        super(scene)

        this.card = {
            id: 21,
            image: 'rhioros_ghost_card',
            name: 'RHIOROS GHOST',
            description: '...',
            energy: 4,
            attack: 8,
            defense: 6,
        }

        this.createCard(this.card)
    }
}