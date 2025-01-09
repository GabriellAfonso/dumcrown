
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
import { removeFromList, sendSocket, sleep } from '../functions/functions.js';
import { crashSwords } from '../animations/scripts/attackingSwords.js';

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
        // this.offensiveTurn = match.offensive_turn; // Indica de quem é o turno ofensivo do round
        this.history = [];
        this.energyNumbers = []
        this.defensiveCardsPosition = {}
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
        this.playerAttackZone = []
        this.playerDefenseZone = {}
        //enemy
        this.enemyBoard = this.scene.add.image(centerX, centerY - 2, this.enemy.board);
        this.enemyBoard.setScale(1, -1);
        this.enemyBench = []

        this.enemyAttackZone = []
        this.enemyDefenseZone = {}

        this.boardCollider = this.scene.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 0);
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
        this.playerDeck = this.scene.add.image(326, 669, 'cards_deck');
        this.playerDeck.setScale(0.7)
        this.playerFirsDeckCard = this.scene.add.image(326 - 10, 669 - 7, 'verse_card');
        this.playerFirsDeckCard.setScale(0.4)
        this.playerFirsDeckCard.setDepth(1)
        //enemy
        this.enemyDeck = this.scene.add.image(326, 100, 'cards_deck');
        this.enemyDeck.setScale(0.7, -0.7)
        this.enemyFirsDeckCard = this.scene.add.image(326 + 10, 100 + 7, 'verse_card');
        this.enemyFirsDeckCard.setScale(0.4, -0.4)
        this.enemyFirsDeckCard.setDepth(1)
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

        Object.keys(this.enemyCards).forEach((key) => {
            const card = this.enemyCards[key];
            card.setPosition(340, 100);
            card.scale = 0.32
        });
    }

    initialDrawn() {


        var cardsObj = []
        for (let card of this.player.hand) {
            var c = this.playerCards[card]
            cardsObj.push(c)
        }
        this.initialDrawManager = new InitialDrawManager(this.scene)
        this.initialDrawManager.drawCards(cardsObj)
        sleep(this.scene, 2500, () => {
            this.button.update()
        })
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


    }

    newRound() {
        console.log('chamou new round')
        this.playerHand.closedHandAnimation()
        this.round(this.match.round)
    }

    round(number) {
        this.playerHand.off()
        this.button.waiting()

        var blackground = this.scene.add.rectangle(centerX, centerY, 2000, 2000, 0x000000, 1);
        blackground.alpha = 0
        blackground.setInteractive()
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
                if (this.player.hand.length <= 7) {
                    sleep(this.scene, 1500, () => {
                        this.draw()
                        this.button.update()
                        this.updateOfensiveIcon()
                    })
                } else {
                    this.playerHand.on()
                    this.button.update()
                    this.updateOfensiveIcon()
                }


            }, 2000)
        })

    }

    updateOfensiveIcon() {
        if (this.match.offensive_player == this.player.im) {
            crashSwords(this.scene, 300, 100, 0.25)
            return
        }
        crashSwords(this.scene, 100, -100, 0.25)
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

        console.log(this.match)
        console.log(this.defensiveHitbox)
        if (this.match.combat_mode && this.defensiveHitbox) {
            this.defensiveDropped(cardObj)
            return
        }
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
        }
        if (cardObj.state == 'onBench') {
            var data = {
                match_id: this.id,
                card_id: cardObj.getID(),
            }
            sendSocket('offensive_card', data)
        }


    }

    defensiveDropped(cardObj) {
        const pointer = this.scene.input.activePointer;
        const card = cardObj.getID()
        this.defensiveHitbox.forEach((hitbox, index) => {
            var bounds = hitbox.getBounds();
            if (this.isOver(pointer, bounds)) {

                var data = {
                    match_id: this.id,
                    card_id: card,
                    position: index,
                }
                console.log('a carta ' + card + ' foi colocada no ' + index)
                sendSocket('defensive_card', data)
            }

        })

    }

    defenseMode() {
        this.createDefenseHitbox()
        console.log('ativou modo defesa')
    }

    createDefenseHitbox() {
        this.defensiveHitbox = []
        const numCards = this.enemy.attack_zone.length;
        const spacing = 140;
        const offsetX = (numCards - 1) * spacing / 2;

        this.enemyAttackZone.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;

            var hitbox = this.scene.add.rectangle(posX, 490, 124, 183, 0xff0ff0, 0.1);
            this.defensiveHitbox.push(hitbox)

        });
    }

    //TODO:
    //Botao indisponivel antes do initial draw terminar ---------X
    //botao de passar a vez (passar o mouse em cima muda de "sua VEZ" pra "passar") ---------X
    //passar a vez automaticamente quando jogar a carta ---------X
    //resolver o depht do bench interferindo na mao ---------X
    //gastar energia ao usar carta ---------X
    //nao permitir colocar cartas magicas no banco ---------X
    //se os dois passar a vez muda de round ---------X
    //trocar card layout no bench ---------X
    //indicaçao visual de quem esta no modo ofensivo ---------X
    //ao apertar pronto sumir ou desativar botao de swap

    cardToBench(data) {
        if (data.who == this.player.im) {
            // this.updateBenchObj()
            this.addCardToBench(data.who, data.card_id)
            this.benchPlayerAnimation()
            return
        }

        this.addCardToBench(data.who, data.card_id)
        this.benchEnemyAnimation()
    }
    addCardToBench(who, cardID) {
        if (who == this.player.im) {
            var card = this.getPlayerCardObj(cardID)
            this.playerHand.removeCard(card)
            this.playerBench.push(card)
            this.playerHand.action()
            return
        }
        var card = this.getEnemyCardObj(cardID)
        card.setSmallLayout()
        this.enemyBench.push(card)
    }


    benchPlayerAnimation() {

        const numCards = this.player.bench.length;
        const spacing = 115;
        const offsetX = (numCards - 1) * spacing / 2;

        this.playerBench.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;

            this.scene.tweens.add({
                targets: card,
                scale: 0.28,
                depth: 0,
                angle: 0,
                x: posX,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    card.onBenchMode()
                    card.setSmallLayout()
                },
            });
        });
    }
    benchEnemyAnimation() {
        const numCards = this.enemy.bench.length;
        const spacing = 115;
        const offsetX = (numCards - 1) * spacing / 2;


        this.enemyBench.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;
            card.setVisible(true)
            this.scene.tweens.add({
                targets: card,
                scale: 0.28,
                depth: 0,
                angle: 0,
                x: posX,
                y: 100,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {

                },
            });
        });
    }


    cardToAttack(data) {
        //remover do bench
        //adicionar ao playerAttackZone
        if (data.who == this.player.im) {
            this.addCardToAttack(data.who, data.card_id)
            this.attackPlayerAnimation()
            return
        }

        this.addCardToAttack(data.who, data.card_id)
        this.attackEnemyAnimation()
    }
    addCardToAttack(who, cardID) {
        if (who == this.player.im) {
            var card = this.getPlayerCardObj(cardID)
            this.playerBench = removeFromList(this.playerBench, card)
            this.playerAttackZone.push(card)
            return
        }
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench = removeFromList(this.enemyBench, card)
        this.enemyAttackZone.push(card)
        // card.setSmallLayout()
    }

    cardToDefense(data) {
        console.log('entro no defense')
        if (data.who == this.player.im) {
            this.addCardToDefense(data.who, data.card_id, data.pos)
            this.defensePlayerAnimation(data.card_id, data.pos)
            return
        }

        this.addCardToDefense(data.who, data.card_id, data.pos)
        this.defenseEnemyAnimation(data.card_id, data.pos)
    }
    addCardToDefense(who, cardID, pos) {
        if (who == this.player.im) {
            var card = this.getPlayerCardObj(cardID)
            this.playerBench = removeFromList(this.playerBench, card)
            this.playerDefenseZone[pos] = card
            return
        }
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench = removeFromList(this.enemyBench, card)
        this.enemyDefenseZone[pos] = card
        console.log(pos)
        console.log(this.enemyDefenseZone)
        // card.setSmallLayout()
    }
    attackPlayerAnimation() {

        const numCards = this.player.attack_zone.length;
        const spacing = 140;
        const offsetX = (numCards - 1) * spacing / 2;

        this.playerAttackZone.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;

            this.scene.tweens.add({
                targets: card,
                scale: 0.38,
                depth: 0,
                angle: 0,
                x: posX,
                y: 490,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    card.onAttackMode()
                    this.benchPlayerAnimation()
                },
            });
        });
    }
    attackEnemyAnimation() {

        const numCards = this.enemy.attack_zone.length;
        const spacing = 140;
        const offsetX = (numCards - 1) * spacing / 2;

        this.enemyAttackZone.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;

            this.scene.tweens.add({
                targets: card,
                scale: 0.38,
                depth: 0,
                angle: 0,
                x: posX,
                y: 280,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.benchEnemyAnimation()
                },
            });
        });
    }


    defensePlayerAnimation(cardId, position) {
        const cardObj = this.getPlayerCardObj(cardId)
        const pos = this.defensiveHitbox[position]
        // 0 - x: 470
        // 1 - x: 610
        // 2 - x: 750
        // 3 - x: 890
        // 4 - x: 1030

        this.scene.tweens.add({
            targets: cardObj,
            scale: 0.38,
            depth: 0,
            angle: 0,
            x: pos.x,
            y: pos.y,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                cardObj.onDefenseMode()
                this.benchPlayerAnimation()
            },
        });

    }
    defenseEnemyAnimation(cardId, position) {
        const cardObj = this.getEnemyCardObj(cardId)
        const pos = this.playerAttackZone[position].x


        this.scene.tweens.add({
            targets: cardObj,
            scale: 0.38,
            depth: 0,
            angle: 0,
            x: pos,
            y: 280,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                this.benchEnemyAnimation()
            },
        });

    }

    clashLine(data) {
        console.log('entrou no clashline')
        if (this.player.im == this.match.offensive_player) {
            this.playerAnimationAtk(data.line, data.diff)
            return
        }
        this.enemyAnimationAtk(data.line, data.diff)
    }
    playerAnimationAtk(line, diff) {
        console.log('entrou no aniamtion atk')
        const playerCard = this.playerAttackZone[line]
        console.log(this.enemyDefenseZone)
        const enemyCard = this.enemyDefenseZone[line]



        simpleTweens(this.scene, playerCard, playerCard.x, 560, 0.38, 1, 0, 200, () => {
            simpleTweens(this.scene, playerCard, playerCard.x, 460, 0.38, 1, 0, 100, () => {
                enemyCard.playDamageAnimation(-playerCard.attack.text)
                simpleTweens(this.scene, playerCard, playerCard.x, 490, 0.38, 1, 0, 300, () => {
                    this.updateCardData(enemyCard, this.enemy)
                })
            })
        })

    }
    enemyAnimationAtk(line, diff) {
        // console.log('entrou no aniamtion atk')
        const enemyCard = this.enemyAttackZone[line]
        const playerCard = this.playerDefenseZone[line]



        simpleTweens(this.scene, enemyCard, enemyCard.x, 210, 0.38, 1, 0, 200, () => {
            simpleTweens(this.scene, enemyCard, enemyCard.x, 310, 0.38, 1, 0, 100, () => {
                playerCard.playDamageAnimation(-enemyCard.attack.text)
                simpleTweens(this.scene, enemyCard, enemyCard.x, 280, 0.38, 1, 0, 300, () => {
                    this.updateCardData(playerCard, this.player)
                })
            })
        })


    }

    updateCardData(card, owner) {
        var data = owner.deck_obj[card.id]
        card.update(data)
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
        this.updateEnergy()
        if (this.match.combat_mode && this.player.im != this.match.offensive_player && this.match.turn == this.player.im) {

        }
    }

    updateEnergy() {
        this.playerEnergyValue.setTexture('default_energy_' + this.player.energy)
        this.enemyEnergyValue.setTexture('default_energy_' + this.enemy.energy)
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

    msg(msg) {
        console.log(msg)
        var message = this.scene.add.text(centerX, 140, msg,
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            })

        message.setShadow(2, 2, '#000', 2, false, true);
        message.alpha = 0;
        message.setOrigin(0.5, 0.5)



        this.messageAnimationText = this.scene.tweens.add({
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
