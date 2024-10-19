
import { createPlayerCards, instantiateCards } from '../cards/functions.js';
import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates } from '../functions/functions.js';

import { Botao } from '../functions/functions.js';
import { InitialDrawManager } from '../match_objects/initialDrawManager.js';
import { MatchManager } from '../match_objects/match.js';
import { data } from './data.js';

export class MissionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MissionsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');
        // this.match = new MatchManager(this)

        // const background = this.add.image(centerX, centerY, 'missions_background');
        // const building = this.add.image(centerX, centerY, 'building');
        const background = this.add.image(centerX, centerY, 'default_board');
        const background2 = this.add.image(centerX, centerY, 'arena01');
        background2.alpha = 0.4
        background2.setScale(0.5)
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'MissionsScene')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)

        // console.log(player.decks[0].cards)
        var deck = player.decks[0].cards
        console.log(deck)
        this.cards = createPlayerCards(this, deck)
        console.log(this.cards)

        console.log(this.cards['s1'])
        this.cards['s1'].setVisible(true)
        this.cards['s1'].setPosition(centerX, centerY)
        this.hand = [
            deck[0],
            deck[1],
            deck[2],
            deck[3],

        ]
        // this.initial_draw()

    }
    initial_draw() {
        var list = []
        for (let card of this.hand) {
            var c = this.getCardObj(card)
            list.push(c)
        }
        var initialDraw = new InitialDrawManager(this, list)
        initialDraw.drawCards()
    }

    getCardObj(id) {
        return this.cards[id]

    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
