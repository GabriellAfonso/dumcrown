import { CardObject } from "./base.js"
import { cardsDATA } from "../client/client.js"

export class JhonCopper extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[1])
    }
}

export class CarolArlet extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[2])
    }
}

export class mortem extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[3])
    }
}

export class kronos extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[4])
    }
}

export class DarkAge extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[5])
    }
}

export class Khras extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[6])
    }
}

export class Skillet extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[7])
    }
}

export class CDC extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[8])
    }
}

export class Okada extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[9])
    }
}

export class SmoothCriminal extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[10])
    }
}

export class Boogie extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[11])
    }
}

export class Spring extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[12])
    }
}

export class Polaroid extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(cardsDATA[13])
    }
}

export class Maniac extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[14])
    }
}

export class Crazy extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(cardsDATA[15])
    }
}

export class Ojays extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[16])
    }
}

export class NeonB extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[17])
    }
}

export class Ballhan extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(cardsDATA[18])
    }
}

export class DarkNecessites extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[19])
    }
}

export class Anomaly extends CardObject {
    constructor(scene) {
        super(scene)


        this.createCard(cardsDATA[20])
    }
}

export class RhiorosGhost extends CardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA[21])
    }
}

export const unitsClasses = [
    JhonCopper, CarolArlet, mortem, kronos, DarkAge, Khras, Skillet,
    CDC, Okada, SmoothCriminal, Boogie, Spring, Polaroid, Maniac, Crazy,
    Ojays, NeonB, Ballhan, DarkNecessites, Anomaly, RhiorosGhost
];