import { matchData } from "../client/match.js";
import { sendSocket, showCoordinates, sleep } from "../functions/functions.js";
import { MatchManager } from "../match_objects/match.js";
import { cardsToSwap } from "../match_objects/swapButton.js";

export class DumMatch extends Phaser.Scene {
    constructor() {
        super({ key: 'DumMatch' });
    }


    create() {
        sendSocket('get_cards') // atualiza as cartas antes da partida começar
        this.startAnimation()
        this.match = new MatchManager(this, matchData)
        this.addEvents()
        // showCoordinates(this)
        // fase das 4 cartas iniciais

    }



    update() {

    }
    addEvents() {
        this.events.on('initialDraw', () => {
            this.match.initialDrawn()
        });
        this.events.on('swapCards', () => {
            this.match.swapCards(cardsToSwap)
        });
    }
    startAnimation() {
        const camera = this.cameras.main;
        camera.setZoom(2);
        camera.setAlpha(0)

        this.tweens.add({
            targets: camera,
            alpha: 1,
            duration: 1300,
            ease: 'Power2',
        });
        this.tweens.add({
            targets: camera,
            zoom: 1,
            duration: 3000,
            ease: 'Power2',
        });
    }

}