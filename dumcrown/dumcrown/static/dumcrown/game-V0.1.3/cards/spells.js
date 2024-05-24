import { SpellCardObject } from "./base.js"
import { cardsDATA } from "../client/client.js"

export class ShieldSpell extends SpellCardObject {
    constructor(scene) {
        super(scene)

        this.createCard(cardsDATA['s1'])
    }
}
export const spellsClasses = [
    ShieldSpell
];