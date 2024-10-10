
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { add_text } from '../functions/texts.js';

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchHand {
    constructor(scene, player) {
        this.scene = scene
        this.hand = [] // lista de cartas na mao



    }

    addCard(card) {
        this.hand.push(card);
    }

    removeCard(card) {
        const index = this.hand.indexOf(card);
        if (index > -1) {
            this.hand.splice(index, 1);
        }
    }

    getCardCount() {
        return this.hand.length;
    }
}
