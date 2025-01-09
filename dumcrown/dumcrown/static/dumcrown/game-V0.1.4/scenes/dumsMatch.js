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
        //server events
        this.events.on('initialDraw', () => {
            this.match.initialDrawn()
        });
        this.events.on('swapCards', () => {
            this.match.swapCards(cardsToSwap)
        });
        this.events.on('updateData', () => {
            this.match.updateData()
        });
        this.events.on('round1', () => {
            this.match.firstRound()
        });
        this.events.on('newRound', () => {
            this.match.newRound()
        });
        this.events.on('defenseMode', () => {
            this.match.defenseMode()
        });
        this.events.on('clashLine', (data) => {
            this.match.clashLine(data)
        });

        this.events.on('invalidMove', (msg) => {
            this.match.invalidMoveMsg(msg)
        });
        this.events.on('message', (msg) => {
            this.match.msg(msg)
        });

        this.events.on('animateCardToBench', (data) => {
            this.match.cardToBench(data)
        });
        this.events.on('animateCardToAttack', (data) => {
            this.match.cardToAttack(data)
        });
        this.events.on('animateCardToDefense', (data) => {
            this.match.cardToDefense(data)
        });



        //client events
        this.events.on('cardDropped', (cardObj) => {
            this.match.cardDropped(cardObj)
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