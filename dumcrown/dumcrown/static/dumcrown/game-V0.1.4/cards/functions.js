import { unitsClasses } from "./units.js";
import { spellsClasses } from "./spells.js";
import { CardObject, SpellCardObject, compressedCardObject } from "./base.js";
import { cardsDATA } from "../client/client.js";
import { DeckLayout } from "../objects/deck_layout.js";

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
        return new SpellCardObject(scene, cardID, cardData);
    } else {
        return new CardObject(scene, cardID, cardData);
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
        const object = new compressedCardObject(scene, cardsDATA[baseId], quantity);
        unitGroups[baseId] = object;
    });

    console.log(unitGroups);
    return unitGroups;
}

//alguem usa essa funçao??
export function compressCard(scene, cardID) {
    var id = idCleaner(cardID)
    console.log(id)
    const object = new compressedCardObject(scene, cardsDATA[id]);
    return object
}

export function createPlayerCards(scene, data) {
    const cards = {};

    data.forEach(cardID => {
        const id = idCleaner(cardID)
        const cardData = cardsDATA[id];
        const cardInstance = createCardInstance(scene, cardID, cardData);
        cards[cardID] = cardInstance;
    });

    return cards;
}
function idCleaner(cardID) {
    return cardID.replace(/\([A-Z]\)/g, '');
}

export function instantiateDecks(scene, data) {
    const decks = {};

    data.forEach(deck => {
        const firstCardID = idCleaner(deck.cards[9])
        const deckImage = cardsDATA[firstCardID].image
        const deckData = { id: deck.id, image: deckImage, name: deck.name, cards: deck.cards }
        const deckInstance = new DeckLayout(scene, deckData);

        decks[deck.name] = deckInstance;
    });
    console.log('data', decks)
    return decks;

}

