import { removeCard, removeSwapButtons, showCard, showSwap } from "../animations/match/initialDraw.js";
import { centerX, centerY } from "../config/gameConfig.js";
import { sleep } from "../functions/functions.js";
import Logger from "../objects/logger.js";
const log = new Logger()
log.enableGroup('all')

export class InitialDrawManager {
    constructor(scene) {
        this.scene = scene

    }

    drawCards(cards) {
        log.info('initialDrawn', 'animaçao da compra das 4 primeiras cartas no initialDraw')
        showCard(this.scene, cards[0], centerX - 300)

        sleep(this.scene, 300, () => {
            showCard(this.scene, cards[1], centerX - 100)
        })
        sleep(this.scene, 600, () => {
            showCard(this.scene, cards[2], centerX + 100)
        })
        sleep(this.scene, 900, () => {
            showCard(this.scene, cards[3], centerX + 300)
        })



        sleep(this.scene, 2000, () => {
            log.info('initialDrawn', 'Criando Botoes de swap')
            showSwap(this.scene, cards[0], centerX - 300)
            showSwap(this.scene, cards[1], centerX - 100)
            showSwap(this.scene, cards[2], centerX + 100)
            showSwap(this.scene, cards[3], centerX + 300)
        })
    }

    swapCards(oldCards, newCards) {
        log.info('initialDrawn', 'Trocando as cartas')
        let cardPositionX = [];
        removeSwapButtons();

        for (let i = 0; i < oldCards.length; i++) {
            cardPositionX.push(oldCards[i].x);

            setTimeout(() => {
                removeCard(this.scene, oldCards[i]);
            }, i * 50);
        }

        cardPositionX.sort((a, b) => a - b);

        sleep(this.scene, 1300, () => {
            for (let i = 0; i < newCards.length; i++) {
                setTimeout(() => {
                    showCard(this.scene, newCards[i], cardPositionX[i]);
                }, i * 300);
            }
        })

    }

    finish(cards) {
        log.info('initialDraw', 'finalizando initial drawn')
        for (var card of cards) {
            card.swapMode('undo')
        }
        removeSwapButtons()
    }

}