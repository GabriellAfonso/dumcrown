import { unitsClasses } from "./units.js";
import { spellsClasses } from "./spells.js";

const allCards = unitsClasses.concat(spellsClasses)

export function createAllCards(scene, showCase = false) {

    var cards = {};

    allCards.forEach(CardClass => {
        var card = new CardClass(scene);
        var id = card.getID()
        if (showCase) {
            card.showCase()
        }
        cards[id] = card
    });

    return cards;
}