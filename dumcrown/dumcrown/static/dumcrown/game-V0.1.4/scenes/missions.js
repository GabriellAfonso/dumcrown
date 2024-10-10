import { initialDraw } from '../animations/match/initialDraw.js';
import { createPlayerCards, instantiateCards } from '../cards/functions.js';
import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates } from '../functions/functions.js';

import { Botao } from '../functions/functions.js';
import { MatchManager } from '../match_objects/match.js';
import { data } from './data.js';

export class MissionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MissionsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');
        this.match = new MatchManager(this, data)

        // const background = this.add.image(centerX, centerY, 'missions_background');
        // const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'MissionsScene')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)

        // console.log(player.decks[0].cards)
        var deck = player.decks[0].cards
        this.cards = createPlayerCards(this, deck)

        console.log(this.cards['1(A)'])
        this.hand = [
            deck[0],
            deck[1],
            deck[2],
            deck[3],
        ]
        this.initial_draw()

    }
    initial_draw() {
        var list = []
        for (let card of this.hand) {
            var c = this.getCardObj(card)
            list.push(c)
        }
        initialDraw(this, list)
    }

    getCardObj(id) {
        return this.cards[id]

    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
