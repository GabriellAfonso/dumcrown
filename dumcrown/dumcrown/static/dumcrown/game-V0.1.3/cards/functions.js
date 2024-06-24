import { unitsClasses } from "./units.js";
import { spellsClasses } from "./spells.js";
import { CardObject, SpellCardObject, compressedCardObject } from "./base.js";
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

export function compressedDeck(scene, data) {
    const unitGroups = {};
    const idCounts = {};

    // Primeiro, conte as ocorrências de cada ID base
    data.forEach(baseId => {
        if (idCounts[baseId]) {
            idCounts[baseId]++;
        } else {
            idCounts[baseId] = 1;
        }
    });

    // Agora, crie os objetos com a quantidade correta
    Object.keys(idCounts).forEach(baseId => {
        const quantity = idCounts[baseId];
        const object = new compressedCardObject(scene, cardsDATA[baseId]);
        object.setQuantity(quantity);
        unitGroups[baseId] = object;
    });

    console.log(unitGroups);
    return unitGroups;
}

export function compressCard(scene, cardID) {
    const object = new compressedCardObject(scene, cardsDATA[cardID]);
    return object
}