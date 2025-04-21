import { matchData } from "../client/match.js";
import { clearRoom } from "../client/room.js";
import { centerX, GAME } from "../config/gameConfig.js";
import { Button } from "../functions/buttons.js";
import { sendSocket, showCoordinates, sleep, switchScenes, toggleFullscreen } from "../functions/functions.js";
import { MatchManager } from "../match_objects/match.js";
import { cardsToSwap } from "../match_objects/swapButton.js";
import { Fullscreen } from "../objects/fullscreen.js";

export class DumMatch extends Phaser.Scene {
    constructor() {
        super({ key: 'DumMatch' });
        this.eventsAdded = false;
    }


    create() {
        clearRoom()
        // this.events.removeAllListeners()
        sendSocket('get_cards') // atualiza as cartas antes da partida começar
        this.startAnimation()
        this.match = new MatchManager(this, matchData)
        const ConfigButton = new Button(this, 25, 35, 'config_button', () => {
            this.scene.get('ConfigScreen').setPreviousScene('DumMatch');
            GAME.scene.run('ConfigScreen');

        });
        ConfigButton.setScale(0.8)

        const fullscreen_button = new Fullscreen(this, 1475, 35);

        // ConfigButton.depth = 1000
        // ConfigButton.scale = 10

        this.addEvents();
        // if (!this.eventsAdded) {

        //     this.eventsAdded = true; // Marca que os eventos foram adicionados
        // }
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
        this.events.on('spell_s1', (data) => {
            this.match.spellS1Animation(data.player, data.spell_id, data.target)
        });
        this.events.on('spell_s2', (data) => {
            this.match.spellS2Animation(data.player, data.spell_id, data.target)
        });
        this.events.on('spell_s5', (data) => {
            this.match.spellS5Animation(data.player, data.spell_id, data.updated_cards)
        });
        this.events.on('spell_s7', (data) => {
            this.match.spellS7Animation(data.player, data.spell_id)
        });
        this.events.on('spell_s8', (data) => {
            this.match.spellS8Animation(data.player, data.spell_id, data.target)
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
        this.events.on('returnCardToBench', (data) => {
            this.match.returnCardToBench(data.who, data.card_id)
        });
        this.events.on('animateCardToAttack', (data) => {
            this.match.cardToAttack(data)
        });
        this.events.on('animateCardToDefense', (data) => {
            this.match.cardToDefense(data)
        });

        this.events.on('victoryMatch', (data) => {
            this.match.winnerFinish(data.crystals, data.points, data.exp)
            this.finishMatch()
        });
        this.events.on('defeatMatch', (data) => {
            this.match.defeatedFinish(data.crystals, data.points, data.exp)
            this.finishMatch()
        });



        //client events
        this.events.on('cardDropped', (cardObj) => {
            this.match.cardDropped(cardObj)
        });

        this.events.on('hideHand', (cardObj) => {
            this.match.hideHand(cardObj)
        });
        this.events.on('showHand', (cardObj) => {
            this.match.showHand(cardObj)
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

    finishMatch() {


    }

}