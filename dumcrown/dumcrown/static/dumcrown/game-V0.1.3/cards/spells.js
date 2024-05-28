import { SpellCardObject } from "./base.js"
import { cardsDATA } from "../client/client.js"

export class SomeonesShield extends SpellCardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA['s1'])
    }
}

class MagicBarrier extends SpellCardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA['s2'])
    }
}

class SacrificialFire extends SpellCardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA['s5'])
    }
}

class LifePotion extends SpellCardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA['s7'])
    }
}
class SummonedAx extends SpellCardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA['s8'])
    }
}



export const spellsClasses = [
    SomeonesShield, MagicBarrier, SacrificialFire, LifePotion,
    SummonedAx
];