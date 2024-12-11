
import { createPlayerCards } from '../cards/functions.js';
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';

import { add_text } from '../functions/texts.js';
import { MatchButton } from './button.js';
import { InitialDrawManager } from './initialDrawManager.js';
import { matchData as match } from '../client/match.js';
import { clearCardsToSwap } from './swapButton.js';
import { MatchHand } from './hand.js';
import { simpleTextTweens, simpleTweens } from '../animations/scripts/functions.js';
import { sendSocket, sleep } from '../functions/functions.js';

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchManager {
    constructor(scene) {
        this.scene = scene
        this.id = match.id;
        // this.round = match.round;
        // this.player1 = match.player1;
        // this.player2 = match.player2;
        this.button = new MatchButton(scene)
        this.turn = match.turn; // Indica de quem é a vez (pode ser 1 ou 2)
        this.offensiveTurn = match.offensive_turn; // Indica de quem é o turno ofensivo do round
        this.history = [];
        this.energyNumbers = []
        // this.player = this.get_player();
        // this.enemy = this.get_enemy();
        this.start()
    }

    // Getter
    get player() {
        return this.get_player();
    }


    get enemy() {
        return this.get_enemy();
    }
    get match() {
        return match
    }

    get_player() {
        if (match.player1.id === player.id) {
            return match.player1;
        }
        return match.player2;
    }

    get_enemy() {
        if (match.player1.id === player.id) {
            return match.player2;
        }
        return match.player1;
    }

    start() {
        this.create_scene()
        //fazer animaçao de zoom da cena inteira ao começar
        //talvez fazer um alpha tbm e embaçar sla

    }
    create_scene() {
        this.createBoard()
        this.button.createButton()
        this.createIcons()
        this.createDecks()
        this.createHp()
        this.createEnergy()
        this.instantiateCards()
        this.createPlayerHand()
    }


    createBoard() {
        //player
        this.playerBoard = this.scene.add.image(centerX, centerY, this.player.board);
        this.playerBench = []
        //enemy
        this.enemyBoard = this.scene.add.image(centerX, centerY - 2, this.enemy.board);
        this.enemyBoard.setScale(1, -1);
        this.enemyBench = []

        this.boardCollider = this.scene.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 0.3);
        this.boardCollider.setInteractive();
    }

    createIcons() {
        //player
        this.playerNickname = add_text(this.scene, 110, centerY + 200, this.player.nickname, '30px', 0.5)
        this.playerIcon = this.scene.add.image(110, 678, this.player.icon);
        this.playerIcon.setScale(0.4)
        this.playerBorder = this.scene.add.image(110, 678, this.player.border);
        this.playerBorder.setScale(0.4)
        //enemy
        this.enemyNickname = add_text(this.scene, 110, centerY - 200, this.enemy.nickname, '30px', 0.5)
        this.enemyIcon = this.scene.add.image(110, 90, this.enemy.icon);
        this.enemyIcon.setScale(0.4)
        this.enemyBorder = this.scene.add.image(110, 90, this.enemy.border);
        this.enemyBorder.setScale(0.4)
    }

    createDecks() {
        //player
        this.playerDeck = this.scene.add.image(346, 669, 'cards_deck');
        this.playerDeck.setScale(0.7)
        this.playerFirsDeckCard = this.scene.add.image(346 - 10, 669 - 7, 'verse_card');
        this.playerFirsDeckCard.setScale(0.4)
        this.playerFirsDeckCard.setDepth(1)
        //enemy
        this.enemyDeck = this.scene.add.image(346, 100, 'cards_deck');
        this.enemyDeck.setScale(0.7, -0.7)
        this.enemyFirsDeckCard = this.scene.add.image(346 + 10, 100 + 7, 'verse_card');
        this.enemyFirsDeckCard.setScale(0.4, -0.4)
    }

    createHp() {
        //player
        this.playerHpBar = this.scene.add.image(110, centerY + 100, 'hpbar');
        this.playerHpBar.setScale(0.35)
        this.playerHpIcon = this.scene.add.image(80, centerY + 100, 'yourcrown');
        this.playerHpIcon.setScale(0.35)
        this.playerHp = add_text(this.scene, 140, centerY + 100, this.player.hp, '30px', 0.5)
        //enemy
        this.enemyHpBar = this.scene.add.image(110, centerY - 100, 'hpbar');
        this.enemyHpBar.setScale(0.35)
        this.enemyHpIcon = this.scene.add.image(80, centerY - 100, 'enemycrown');
        this.enemyHpIcon.setScale(0.35)
        this.enemyHp = add_text(this.scene, 140, centerY - 100, this.enemy.hp, '30px', 0.5)
    }

    createEnergy() {
        //player
        this.playerEnergyHolder = this.scene.add.image(1396, centerY + 175, 'default_board_energy_holder');
        this.playerEnergyValue = this.scene.add.image(1396, centerY + 175, 'default_energy_' + this.player.energy);
        //enemy
        this.enemyEnergyHolder = this.scene.add.image(1396, centerY - 175, 'default_board_energy_holder');
        this.enemyEnergyValue = this.scene.add.image(1396, centerY - 175, 'default_energy_' + this.enemy.energy);
    }

    createPlayerHand() {

        // var handObj = []
        // for (var id of this.player.hand) {
        //     var card = this.getCardObj(id)
        //     handObj.push(card)
        // }
        this.playerHand = new MatchHand(this.scene)
    }

    instantiateCards() {
        //player
        this.playerCards = createPlayerCards(this.scene, this.player.deck)
        //enemy
        this.enemyCards = createPlayerCards(this.scene, this.enemy.deck)
    }

    initialDrawn() {
        this.button.update()

        var cardsObj = []
        for (let card of this.player.hand) {
            var c = this.playerCards[card]
            cardsObj.push(c)
        }
        this.initialDrawManager = new InitialDrawManager(this.scene)
        this.initialDrawManager.drawCards(cardsObj)
    }

    swapCards(oldCards) {
        if (!oldCards) {
            return
        }

        var old = Object.values(oldCards)

        var oldCardsObj = []
        var newCardsObj = []

        for (let id of old) {
            var card = this.getPlayerCardObj(id)
            oldCardsObj.push(card)
        }

        for (let card of this.player.hand) {
            var cardObj = this.playerCards[card]
            if (!cardObj.visible) {
                newCardsObj.push(cardObj)
            }
        }
        this.initialDrawManager.swapCards(oldCardsObj, newCardsObj)

    }
    firstRound() {
        console.log('first round')

        for (const id of this.player.hand.slice(0, -1)) {
            const card = this.getPlayerCardObj(id);
            this.playerHand.addCard(card);
        } // pega todos menos o ultimo

        this.initialDrawManager.finish(this.playerHand.hand)
        this.playerHand.closedHandAnimation()
        sleep(this.scene, 400, () => {
            this.round(this.match.round)
        })




        //update button
    }

    round(number) {
        this.playerHand.off()


        var blackground = this.scene.add.rectangle(centerX, centerY, 2000, 2000, 0x000000, 1);
        blackground.alpha = 0
        simpleTweens(this.scene, blackground, centerX, centerY, 1, 89, 0, 600, () => {
            sleep(this.scene, 2000, () => {
                simpleTweens(this.scene, blackground, centerX, centerY, 1, 89, 0, 600, () => {
                    blackground.destroy()
                }, 0)
            })

        }, 0.7)

        this.roundText = this.scene.add.text(centerX, centerY, 'RODADA ' + number,
            {
                fontSize: '100px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#ffd700'
            })
        this.roundText.setOrigin(0.5, 0.5)
        this.roundText.alpha = 0;
        this.roundText.setShadow(2, 2, '#000', 2, false, true);
        simpleTextTweens(this.scene, this.roundText, centerX, centerY, 90, 0, 500, 1, () => {
            simpleTextTweens(this.scene, this.roundText, centerX, centerY, 90, 0, 500, 0, () => {
                sleep(this.scene, 1500, () => {
                    this.draw()
                    this.button.update()
                })
            }, 2000)
        })

    }
    draw() {
        var id = this.player.hand.at(-1)
        console.log(id)
        var card = this.getPlayerCardObj(id)

        this.playerHand.drawCard(card)
    }
    cardDropped(cardObj) {
        const pointer = this.scene.input.activePointer;
        const bounds = this.boardCollider.getBounds();



        //isOver boardCollider
        if (!this.isOver(pointer, bounds)) {
            console.log('O mouse não está sobre o retângulo.');
            return
        }

        console.log('O mouse está sobre o retângulo!');
        if (cardObj.state == 'onHand') {
            var data = {
                match_id: this.id,
                card_id: cardObj.getID(),
            }
            sendSocket('play_card', data)
            //verificar no servidor se a pessoa pode fazer essa Açao


            //esse resto o servidor que vai chamar em outra funçao
            // cardObj.onBenchMode()
            // retirar carta da mao
            // openHandAnimation pra ajustar a posiçao das que ainda estao na mao
            // cardObj.setPosition(centerX, centerY)
        }





    }
    animateCardToBench(data) {

        if (data.who == this.player.im) {
            // this.updateBenchObj()
            this.addCardToBench(data.who, data.card_id)
            this.benchAnimation(this.scene, data.who)
            return
        }

        this.addCardToBench(data.who, data.card_id)
        this.benchAnimation(this.scene, data.who)
    }
    addCardToBench(who, cardID) {
        if (who == this.player.im) {
            var card = this.getPlayerCardObj(cardID)
            this.playerHand.removeCard(card)
            this.playerBench.push(card)
            card.onBenchMode()
            return
        }
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench.push(card)
    }
    // updateBenchObj() {
    //     //player
    //     this.playerBench = []
    //     this.player.bench.forEach((cardID) => {
    //         var card = this.getPlayerCardObj(cardID)
    //         this.playerBench.push(card)

    //     })
    //     //enemy
    //     this.enemyBench = []
    //     this.enemy.bench.forEach((cardID) => {
    //         var card = this.getEnemyCardObj(cardID)
    //         this.enemyBench.push(card)
    //     })
    // }

    benchAnimation(scene, who) {
        // Destrói cartas existentes no campo
        for (let i = 1; i <= 5; i++) {
            if (scene[`fieldCard${i}`]) {
                scene[`fieldCard${i}`].destroy();
            }
        }
        if (who == this.player.im) {
            var Ypos = 668
            var bench = this.playerBench
        } else {
            var Ypos = 100
            var bench = this.enemyBench
        }
        // Determina a quantidade de cartas no campo
        const numCards = this.player.bench.length;

        // Calcula o espaçamento entre as cartas com base no número
        const spacing = 115; // Distância entre as cartas
        const offsetX = (numCards - 1) * spacing / 2; // Deslocamento para centralizar

        //vai adicionar o bench em objetos
        // this.player.bench.forEach((card, index) => { })
        // this.playerBench = ''

        // Cria a animação para cada carta
        bench.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;
            card.setVisible(true)
            scene.tweens.add({
                targets: card,
                scale: 0.28,
                depth: 0,
                x: posX,
                y: Ypos,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    // Cria um campo para cada carta
                    const fieldCard = scene.add.rectangle(posX, Ypos, 328, 483, 0x000080);
                    fieldCard.alpha = 0.2;
                    fieldCard.angle = 0;
                    fieldCard.setDepth(card.depth + 1);
                    fieldCard.setScale(0.28);
                    fieldCard.setInteractive();

                    // adiciona as funcionalidades da carta no bench
                    // scene.fieldCardAnimation(card, fieldCard);

                    // Armazena a referência da carta no campo
                    scene[`fieldCard${index + 1}`] = fieldCard;
                },
            });
        });
    }
    isOver(pointer, bounds) {
        var is = pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
            pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height
        return is
    }
    getPlayerCardObj(id) {
        var card = this.playerCards[id]
        return card
    }
    getEnemyCardObj(id) {
        var card = this.enemyCards[id]
        return card
    }

    updateData() {
        this.button.update()
    }

    invalidMoveMsg(msg) {
        console.log(msg)
        var message = this.scene.add.text(centerX, 140, msg,
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            })

        message.setShadow(2, 2, '#000', 2, false, true);
        message.alpha = 0;
        message.setOrigin(0.5, 0.5)



        this.invalidMoveAnimationText = this.scene.tweens.add({
            targets: message,
            depth: 90,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: message,
                    delay: 1000,
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',
                })
            },
        })
    }

    updateRound() {

    }

    colectInitialDraw() {

    }

    deleteMatch() {
        clearCardsToSwap()
    }
}
