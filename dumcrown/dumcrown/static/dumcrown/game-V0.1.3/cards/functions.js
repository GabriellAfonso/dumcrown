import { unitsClasses } from "./units.js";
import { spellsClasses } from "./spells.js";
import { CardObject, SpellCardObject } from "./base.js";
import { cardsDATA } from "../client/client.js";

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

export function instantiateCards(scene, data) {
    const cards = {};

    data.forEach(cardID => {
        const cardData = cardsDATA[cardID];
        const cardInstance = createCardInstance(scene, cardID, cardData);
        cardInstance.showCase()
        cards[cardData.id] = cardInstance;
    });

    return cards;
}

function createCardInstance(scene, cardID, cardData) {
    if (isSpellCard(cardID)) {
        return new SpellCardObject(scene, cardData);
    } else {
        return new CardObject(scene, cardData);
    }
}

function isSpellCard(cardID) {
    return cardID.charAt(0) === 's';
}

export function compressedDeck(data) {
    const unitGroups = {};

    data.forEach(id => {
        const baseId = id.split('(')[0]; // Obtém apenas o número base do ID
        if (!unitGroups[baseId]) {
            unitGroups[baseId] = [];
        }
        unitGroups[baseId].push(id);
    });

    for (const baseId in unitGroups) {
        console.log(`Grupo para o ID ${baseId}:`, unitGroups[baseId]);
    }
}