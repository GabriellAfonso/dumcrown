
import { simpleTextTweens, simpleTweens } from '../animations/scripts/functions.js';
import { createPlayerCards, instantiateCards } from '../cards/functions.js';
import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates, sleep } from '../functions/functions.js';

import { Botao } from '../functions/functions.js';
import { MatchHand } from '../match_objects/hand.js';
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
        const background2 = this.add.image(centerX, centerY, 'default_board');
        background2.setScale(1, -1);
        // const background2 = this.add.image(centerX, centerY, 'arena01');
        // background2.alpha = 0.4
        // background2.setScale(0.5)
        this.battleField = this.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 0.3);
        this.battleField.setInteractive()


        // this.battlefield.on('pointerup', () => {

        // });
        this.events.on('cardDropped', (cardObj) => {

            const pointer = this.input.activePointer;
            const bounds = this.battleField.getBounds();
            //TODO: verificar tambem o state da carta, se tiver onHand ou onbench serao atitudes diferentes
            if (pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
                pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height) {
                console.log('O mouse está sobre o retângulo!');
                // cardObj.stopTween()
                cardObj.onbenchMode()
                this.mao.openHandAnimation()
                cardObj.setPosition(centerX, centerY)
            } else {
                console.log('O mouse não está sobre o retângulo.');
            }
        });



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
            this.cards['2'],
            this.cards['s7'],
            this.cards['s1'],
            this.cards['s2'],

        ]

        for (var card of this.hand) {
            card.setVisible(true)
        }
        this.mao = new MatchHand(this, this.hand)

        this.mao.closedHandAnimation()
        // this.initial_draw()
        showCoordinates(this)
        var blackground = this.add.rectangle(centerX, centerY, 2000, 2000, 0x000000, 1);
        blackground.alpha = 0
        simpleTweens(this, blackground, centerX, centerY, 1, 89, 0, 600, () => {
            sleep(this, 2000, () => {
                simpleTweens(this, blackground, centerX, centerY, 1, 89, 0, 600, () => {
                    blackground.destroy()
                }, 0)
            })

        }, 0.7)

        this.roundText = this.add.text(centerX, centerY, 'RODADA ' + 1,
            {
                fontSize: '100px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#ffd700'
            })
        this.roundText.setOrigin(0.5, 0.5)
        this.roundText.alpha = 0;
        this.roundText.setShadow(2, 2, '#000', 2, false, true);
        simpleTextTweens(this, this.roundText, centerX, centerY, 90, 0, 500, 1, () => {
            simpleTextTweens(this, this.roundText, centerX, centerY, 90, 0, 500, 0, () => {
                sleep(this, 1500, () => {
                    //Comprar carta
                })
            }, 2000)
        })


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
