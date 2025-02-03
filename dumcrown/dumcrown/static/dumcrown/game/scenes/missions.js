
import { simpleTextTweens, simpleTweens } from '../animations/scripts/functions.js';
import { createPlayerCards, instantiateCards } from '../cards/functions.js';
import { player } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { Button } from '../functions/buttons.js';

import { switchScenes, logoutAjax, showCoordinates, sleep } from '../functions/functions.js';


import { add_text } from '../functions/texts.js';
import { MatchHand } from '../match_objects/hand.js';
import { InitialDrawManager } from '../match_objects/initialDrawManager.js';
import { MatchManager } from '../match_objects/match.js';
import { sfx } from '../soundfx/sounds.js';

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
        this.battleField = this.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 0);
        this.battleField.setInteractive()

        this.showdaxuxa = this.add.rectangle(1393, centerY, 40, 40, 0xff0000, 1);
        this.showdaxuxa.setInteractive()



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



        const x_close = new Button(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'MissionsScene')
        }, { color: 0xffff00, clickSound: sfx.closeSound });
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
        this.createHp()
        // var blackground = this.add.rectangle(centerX, centerY, 2000, 2000, 0x000000, 1);
        // blackground.alpha = 0
        // simpleTweens(this, blackground, centerX, centerY, 1, 89, 0, 600, () => {
        //     sleep(this, 2000, () => {
        //         simpleTweens(this, blackground, centerX, centerY, 1, 89, 0, 600, () => {
        //             blackground.destroy()
        //         }, 0)
        //     })

        // }, 0.7)

        // this.roundText = this.add.text(centerX, centerY, 'RODADA ' + 1,
        //     {
        //         fontSize: '100px', fontFamily: 'Lexend Deca, sans-serif',
        //         fontStyle: 'bold', fill: '#ffd700'
        //     })
        // this.roundText.setOrigin(0.5, 0.5)
        // this.roundText.alpha = 0;
        // this.roundText.setShadow(2, 2, '#000', 2, false, true);
        // simpleTextTweens(this, this.roundText, centerX, centerY, 90, 0, 500, 1, () => {
        //     simpleTextTweens(this, this.roundText, centerX, centerY, 90, 0, 500, 0, () => {
        //         sleep(this, 1500, () => {
        //             //Comprar carta
        //         })
        //     }, 2000)
        // })

        const card1 = this.cards['2']
        card1.setVisible(true)
        card1.setPosition(centerX, 490)
        card1.setScale(0.38)



        const card2 = this.cards['9']
        card2.setVisible(true)
        card2.setPosition(centerX, 280)
        card2.setScale(0.38)


        this.showdaxuxa.on('pointerup', () => {
            simpleTweens(this, card1, centerX, 560, 0.38, 1, 0, 200, () => {
                simpleTweens(this, card1, centerX, 475, 0.38, 1, 0, 100, () => {
                    card2.playDamageAnimation(-2)
                    simpleTweens(this, card1, centerX, 490, 0.38, 1, 0, 300, () => {
                        this.playerDamageTaken(-2)
                        // card2.death()
                    })
                })
            })

            simpleTweens(this, card2, centerX, 210, 0.38, 1, 0, 200, () => {
                simpleTweens(this, card2, centerX, 295, 0.38, 1, 0, 100, () => {
                    card1.playDamageAnimation(-3)
                    simpleTweens(this, card2, centerX, 280, 0.38, 1, 0, 300, () => {

                    })
                })
            })
        })
        this.cameras.main.setPostPipeline(Phaser.Renderer.WebGL.Pipelines.BlurFilter);
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


    playerDamageTaken(value) {
        var damage = this.add.text(200, centerY + 100, value,
            { fontSize: '40px', fill: '#FF0000', fontStyle: 'bold', fontFamily: 'sans-serif', });
        damage.setOrigin(0.5, 0.5);
        damage.setAlpha(0)

        this.tweens.add({
            targets: damage,
            alpha: 1,
            duration: 100,
            ease: 'linear',
            onComplete: () => {
                this.tweens.add({
                    targets: damage,
                    delay: 500,
                    alpha: 0,
                    duration: 200,
                    ease: 'linear',
                    onComplete: () => {

                    }
                });
            }
        });
    }
    createHp() {
        //player
        this.playerHpBar = this.add.image(110, centerY + 100, 'hpbar');
        this.playerHpBar.setScale(0.35)
        this.playerHpIcon = this.add.image(80, centerY + 100, 'yourcrown');
        this.playerHpIcon.setScale(0.35)
        this.playerHp = add_text(this, 140, centerY + 100, 30, '30px', 0.5)
        //enemy
        this.enemyHpBar = this.add.image(110, centerY - 100, 'hpbar');
        this.enemyHpBar.setScale(0.35)
        this.enemyHpIcon = this.add.image(80, centerY - 100, 'enemycrown');
        this.enemyHpIcon.setScale(0.35)
        this.enemyHp = add_text(this, 140, centerY - 100, 30, '30px', 0.5)
    }
    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
