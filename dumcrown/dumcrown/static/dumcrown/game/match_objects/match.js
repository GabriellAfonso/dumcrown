
import { createPlayerCards, idCleaner } from '../cards/functions.js';
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
import { gameLoss, gameWin } from '../animations/scripts/gameover.js';
import Logger from '../objects/logger.js';
import { sfx } from '../soundfx/sounds.js';
const log = new Logger()
log.enableGroup('all')
export class MatchManager {
    constructor(scene) {
        this.scene = scene
        this.button = new MatchButton(scene)
        this.history = [];
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
    get_adversary(player) {
        if (player.im == this.player.im) {
            return this.enemy
        }
        return this.player

    }

    get_offensive_player() {
        if (this.match.offensive_player == this.player.im) {
            return this.player
        }
        return this.enemy
    }

    get_defensive_player() {
        if (this.match.offensive_player != this.player.im) {
            return this.player
        }
        return this.enemy
    }

    start() {
        this.create_scene()
        log.info('Criação', 'iniciando a partda')

    }
    create_scene() {
        this.createBoard()
        this.button.createButton()
        this.createIcons()
        this.createDecks()
        this.createHp()
        this.createEnergy()
        this.createPlayerHand()
        this.instantiateCards()
    }


    createBoard() {
        //player
        log.info('Criação', 'Criando player board com key: ' + this.player.board)
        this.playerBoard = this.scene.add.image(centerX, centerY, this.player.board);
        this.playerBench = []
        this.playerAttackZone = []
        this.playerDefenseZone = {}
        this.defensiveHitbox = []
        //enemy
        log.info('Criação', 'Criando enemy board com key: ' + this.enemy.board)
        this.enemyBoard = this.scene.add.image(centerX, centerY, this.enemy.board);
        this.enemyBoard.setScale(1, -1);
        this.enemyBench = []

        this.enemyAttackZone = []
        this.enemyDefenseZone = {}

        log.info('Criação', 'Criando colisor central do tabuleiro')
        this.boardCollider = this.scene.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 0);
        this.boardCollider.setInteractive();


    }

    createIcons() {
        log.info('Criação', 'Criando informaçoes visuais dos jogadores')
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
        log.info('Criação', 'Criando o visual do deck sobre o tabuleiro')
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
        log.info('Criação', 'Criando barra de vida dos jogadores')
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
        log.info('Criação', 'Criando barra de energia dos jogadores')
        //player
        this.playerEnergyHolder = this.scene.add.image(1396, centerY + 175, 'default_board_energy_holder');
        this.playerEnergyValue = this.scene.add.image(1396, centerY + 175, 'default_energy_' + this.player.energy);
        //enemy
        this.enemyEnergyHolder = this.scene.add.image(1396, centerY - 175, 'default_board_energy_holder');
        this.enemyEnergyValue = this.scene.add.image(1396, centerY - 175, 'default_energy_' + this.enemy.energy);
    }

    createPlayerHand() {
        this.playerHand = new MatchHand(this.scene)
    }

    instantiateCards() {
        log.info('Criação', 'Instanciando o objeto de cada carta dos jogadores')
        //player
        this.playerCards = createPlayerCards(this.scene, this.player.deck, this.player.im)
        //enemy
        this.enemyCards = createPlayerCards(this.scene, this.enemy.deck, this.enemy.im)

        //isso é pra as cartas do inimigo sair de tras do deck inimigo
        Object.keys(this.enemyCards).forEach((key) => {
            const card = this.enemyCards[key];
            card.setPosition(340, 100);
            card.scale = 0.32
        });
    }

    initialDrawn() {
        log.info('action', 'Chamando initialDraw')
        var cardsObj = []
        for (let card of this.player.hand) {
            log.detail('initialDraw', 'pegando id ' + card + ' da mao do jogador')
            var c = this.playerCards[card]
            log.detail('initialDraw', 'transformando em objeto ', c)
            cardsObj.push(c)
        }
        this.initialDrawManager = new InitialDrawManager(this.scene)
        this.initialDrawManager.drawCards(cardsObj)
        sleep(this.scene, 2500, () => {
            this.button.update()
        })
    }

    swapCards(oldCards) {
        log.info('initialDrawn', 'trocando cartas ' + oldCards)
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
        log.info('action', 'Chamou o Primeiro Round')

        for (const id of this.player.hand.slice(0, -1)) {
            const card = this.getPlayerCardObj(id);
            this.playerHand.addCard(card);
        }

        this.initialDrawManager.finish(this.playerHand.hand)
        this.playerHand.closedHandAnimation()
        sleep(this.scene, 400, () => {
            this.round(this.match.round)
        })


    }

    newRound() {
        log.info('action', 'Chamou o new Round')
        this.playerHand.closedHandAnimation()
        this.round(this.match.round)
    }

    round(number) {
        log.info('action', 'animação de round')
        this.playerHand.off()
        this.button.waiting()
        this.clearCombatZone()

        var blackground = this.scene.add.rectangle(centerX, centerY, 2000, 2000, 0x000000, 1);
        blackground.depth = 99
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
        this.roundText.depth = 100
        this.roundText.alpha = 0;
        this.roundText.setShadow(2, 2, '#000', 2, false, true);
        simpleTextTweens(this.scene, this.roundText, centerX, centerY, 90, 0, 500, 1, () => {
            simpleTextTweens(this.scene, this.roundText, centerX, centerY, 90, 0, 500, 0, () => {
                if (this.player.hand.length <= 7) {
                    sleep(this.scene, 1500, () => {
                        this.draw()
                        this.button.update()
                        sleep(this.scene, 1300, () => {
                            this.updateOfensiveIcon()
                        })
                    })
                } else {
                    this.playerHand.on()
                    this.button.update()
                    this.updateOfensiveIcon()
                }

                this.updateEnergy()
            }, 2000)
        })

    }

    updateOfensiveIcon() {
        log.info('update', 'atualizando icone de ofensividade')
        if (this.match.offensive_player == this.player.im) {
            crashSwords(this.scene, 300, 100, 0.25)
            return
        }
        crashSwords(this.scene, 100, -100, 0.25)
    }
    draw() {
        log.info('action', 'Comprando carta')
        var id = this.player.hand.at(-1)
        var card = this.getPlayerCardObj(id)

        this.playerHand.drawCard(card)
    }
    getTargetSpell(spell, pointer) {
        // Defina as zonas com seus nomes
        const zones = [
            { cards: this.playerBench, zoneName: 'bench' },
            { cards: this.playerAttackZone, zoneName: 'attack' },
            { cards: Object.values(this.playerDefenseZone), zoneName: 'defense' },
            { cards: this.enemyBench, zoneName: 'bench' },
            { cards: this.enemyAttackZone, zoneName: 'attack' },
            { cards: Object.values(this.enemyDefenseZone), zoneName: 'defense' },
        ];

        // Itere sobre as zonas e verifique os alvos
        for (const zone of zones) {
            for (const card of zone.cards) {
                const bounds = card.getBounds();
                if (this.isOver(pointer, bounds)) {
                    const data = {
                        match_id: this.match.id,
                        spell: spell.getID(),
                        target: {
                            id: card.getID(),
                            owner: card.owner, // Identifica o dono
                            zone: zone.zoneName, // Nome da zona
                        },
                    };
                    sendSocket('play_spell', data);
                    return; // Sai do loop assim que encontrar um alvo
                }
            }
        }

        log.info('action', 'Spell card jogada sem alvo específico');
        const data = {
            match_id: this.match.id,
            spell: spell.getID(),
            target: null,
        };
        sendSocket('play_spell', data);
    }
    cardDropped(cardObj) {
        log.info('action', 'carta dropada')

        const pointer = this.scene.input.activePointer;
        const bounds = this.boardCollider.getBounds();


        if (cardObj.isSpell()) {
            var id = idCleaner(cardObj.id)
            if (id == 's7' || id == 's5') {
                //gambiarra
                if (!this.isOver(pointer, bounds)) {
                    return
                }
            }
            this.getTargetSpell(cardObj, pointer)
            return
            //manda pro servidor e ele que se lasque pra gerenciar
        }

        if (!this.isOver(pointer, bounds)) {
            return
        }

        if (this.match.combat_mode && this.defensiveHitbox.length > 0) {
            log.info('cardDropped', 'Carta dropada para defesa')
            this.defensiveDropped(cardObj)
            return
        }



        if (!this.match.combat_mode && cardObj.state == 'onHand') {
            log.info('cardDropped', 'Carta dropada para o banco')

            var data = {
                match_id: this.match.id,
                card_id: cardObj.getID(),
            }
            sendSocket('play_card', data)
            return
        }
        if (cardObj.state == 'onBench') {
            log.info('cardDropped', 'Carta dropada para o ataque')
            var data = {
                match_id: this.match.id,
                card_id: cardObj.getID(),
            }
            sendSocket('offensive_card', data)
            return
        }

        log.info('action', 'Carta dropada no nada')
    }

    defensiveDropped(cardObj) {
        log.info('defensiveDropped', 'posicionando carta')
        const pointer = this.scene.input.activePointer;
        const card = cardObj.getID()

        if (cardObj.state !== 'onBench') {
            return
        }
        this.defensiveHitbox.forEach((hitbox, index) => {
            var bounds = hitbox.getBounds();
            if (this.isOver(pointer, bounds)) {

                var data = {
                    match_id: this.match.id,
                    card_id: card,
                    position: index,
                }
                log.detail('defensiveDropped', 'a carta ' + card + ' foi colocada na posição ' + index)
                sendSocket('defensive_card', data)
            }

        })

    }

    defenseMode() {
        log.info('action', 'Chamou o defenseMode')
        this.createDefenseHitbox()
    }

    createDefenseHitbox() {
        log.info('action', 'Criando hitbox de defesa')
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

    destroyDefenseHitbox() {
        log.info('action', 'Destruindo hitbox de defesa')
        this.defensiveHitbox.forEach((hitbox) => {
            hitbox.destroy()
        })
        this.defensiveHitbox = []
    }


    cardToBench(data) {
        log.info('action', 'chamou cardToBench')
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
            log.info('action', 'adicionando carta ao banco do jogador')
            var card = this.getPlayerCardObj(cardID)
            this.playerHand.removeCard(card)
            this.playerBench.push(card)
            this.playerHand.closeHand()
            return
        }
        log.info('action', 'adicionando carta ao banco do inimigo')
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench.push(card)
    }

    returnCardToBench(who, cardID) {
        log.info('action', 'voltando carta ' + cardID + ' do combate pro banco')
        if (who == this.player.im) {
            var card = this.getPlayerCardObj(cardID)

            this.playerBench.push(card)

            this.benchPlayerAnimation()
            return
        }
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench.push(card)
        this.benchEnemyAnimation()
    }

    clearCombatZone() {
        log.info('action', 'Limpando dados da zona de combate')
        this.playerAttackZone = []
        this.playerDefenseZone = {}

        this.enemyAttackZone = []
        this.enemyDefenseZone = {}

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
                    // sfx.impactWood.play()
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
                    // sfx.impactWood.play()
                    card.setSmallLayout()
                },
            });
        });
    }


    cardToAttack(data) {
        log.info('action', 'chamou cardToAttack')
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
            log.info('action', 'adicionando carta do jogador ao ataque')
            var card = this.getPlayerCardObj(cardID)
            this.playerBench = removeFromList(this.playerBench, card)
            this.playerAttackZone.push(card)
            return
        }
        log.info('action', 'adicionando carta do inimigo ao ataque')
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench = removeFromList(this.enemyBench, card)
        this.enemyAttackZone.push(card)
    }

    cardToDefense(data) {
        log.info('action', 'chamou cardToDefense')
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
            log.info('action', 'adicionando carta do jogador á defesa')
            var card = this.getPlayerCardObj(cardID)
            this.playerBench = removeFromList(this.playerBench, card)
            this.playerDefenseZone[pos] = card
            return
        }
        log.info('action', 'adicionando carta do inimigo á defesa')
        var card = this.getEnemyCardObj(cardID)
        this.enemyBench = removeFromList(this.enemyBench, card)
        this.enemyDefenseZone[pos] = card
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
                    sfx.impactWood.play()
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
                    sfx.impactWood.play()
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
                sfx.impactWood.play()
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
                sfx.impactWood.play()
                this.benchEnemyAnimation()
            },
        });

    }



    clashLine(data) {
        log.info('action', 'chamou o clashLine');
        this.destroyDefenseHitbox();
        const isPlayerOffensive = this.player.im === this.match.offensive_player;

        this.executeAnimationAtk(
            data.line,
            data.diff,
            isPlayerOffensive ? this.playerAttackZone : this.enemyAttackZone,
            isPlayerOffensive ? this.enemyDefenseZone : this.playerDefenseZone,
            isPlayerOffensive ? this.enemy : this.player,
            isPlayerOffensive ? 560 : 210, // Coordenada Y para o atacante
            isPlayerOffensive ? 460 : 310, // Coordenada Y do ataque
            isPlayerOffensive ? 490 : 280, // Coordenada Y para o retorno do atacante
            isPlayerOffensive ? 210 : 560, // Coordenada Y para o defensor antes da animação
            isPlayerOffensive ? 310 : 460, // Coordenada Y do defensor no momento do impacto
            isPlayerOffensive ? 280 : 490  // Coordenada Y para o retorno do defensor
        );
    }

    async executeAnimationAtk(line, diff, attackZone, defenseZone, targetPlayer, attackY, clashY, returnY, defStartY, defClashY, defReturnY) {
        log.info('action', 'chamou o executeAnimationAtk');

        const attackerCard = attackZone[line];
        const defenderCard = defenseZone[line];

        try {
            // Movimento inicial do ataque
            await Promise.all([
                this.animateCard(attackerCard, attackerCard.x, attackY, 200),
                defenderCard ? this.animateCard(defenderCard, defenderCard.x, defStartY, 200) : undefined
            ]);

            // Movimento para atacar
            await Promise.all([
                this.animateCard(attackerCard, attackerCard.x, clashY, 100),
                defenderCard ? this.animateCard(defenderCard, defenderCard.x, defClashY, 100) : undefined
            ]);
            sfx.cardDamage01.play()
            sfx.cardDamage01.play()
            // Animação de dano para ambas as cartas
            if (defenderCard) {
                defenderCard.playDamageAnimation(-attackerCard.attack.text);
                attackerCard.playDamageAnimation(-defenderCard.attack.text);
            }


            // Retorno após o ataque
            await Promise.all([
                this.animateCard(attackerCard, attackerCard.x, returnY, 300),
                defenderCard ? this.animateCard(defenderCard, defenderCard.x, defReturnY, 300) : undefined
            ]);

            // Atualizar os dados da carta defensora se ela existir
            if (defenderCard) {
                var other = this.get_adversary(targetPlayer)
                this.updateCardData(attackerCard, other);
                this.updateCardData(defenderCard, targetPlayer);
            }

            if (diff <= 0) {
                this.damageTakenAnimation(diff, targetPlayer);
            }
        } catch (error) {
            console.error('Erro durante a animação de ataque:', error);
        }
    }

    // Função corrigida para animar as cartas
    animateCard(card, x, y, duration) {
        return new Promise((resolve) => {
            simpleTweens(this.scene, card, x, y, 0.38, 1, 0, duration, resolve);
        });
    }
    damageTakenAnimation(value, owner) {
        log.info('action', 'chamou o damageTakenAnimation')
        if (this.damageText) {
            this.damageText.destroy()
        }

        var height = centerY + 100
        if (owner.im != this.player.im) {
            height = centerY - 100
        }

        this.damageText = this.scene.add.text(200, height, value ? value : '',
            { fontSize: '40px', fill: '#FF0000', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.damageText.setOrigin(0.5, 0.5);
        this.damageText.setAlpha(0)

        this.scene.tweens.add({
            targets: this.damageText,
            alpha: 1,
            duration: 100,
            ease: 'linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: this.damageText,
                    delay: 500,
                    alpha: 0,
                    duration: 200,
                    ease: 'linear',
                    onComplete: () => {
                        this.updateHp()
                    }
                });
            }
        });
    }

    updateCardData(card, owner) {
        log.info('update', 'atualizando status da carta ', card.id)
        var data = owner.deck_obj[card.id]
        card.update(data)
    }

    isOver(pointer, bounds) {
        var is = pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
            pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height
        return is
    }
    getPlayerCardObj(id) {
        log.info('action', 'pegou objeto da carta do player de id ' + id)
        var card = this.playerCards[id]
        return card
    }
    getEnemyCardObj(id) {
        log.info('action', 'pegou objeto da carta do inimigo de id ' + id)
        var card = this.enemyCards[id]
        return card
    }
    updateHp() {
        log.info('update', 'atualizou valores de hp dos jogadores')
        this.playerHp.text = this.player.hp
        this.enemyHp.text = this.enemy.hp
    }
    updateData() {
        log.info('update', 'updateData')
        this.button.update()
        this.updateEnergy()
    }

    updateEnergy() {
        log.info('update', 'atualizou valores de energia dos jogadores')
        this.playerEnergyValue.setTexture('default_energy_' + this.player.energy)
        this.enemyEnergyValue.setTexture('default_energy_' + this.enemy.energy)
    }
    invalidMoveMsg(msg) {
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


    winnerFinish(crystals, points, exp) {
        log.info('action', 'chamou o winnerFinish')
        gameWin(this.scene, crystals, points)
        sendSocket('add_experience', exp)
    }
    defeatedFinish(crystals, points, exp) {
        log.info('action', 'chamou o defeatedFinish')
        gameLoss(this.scene, crystals, points)
        sendSocket('add_experience', exp)
    }
    updateRound() {

    }
    spellS1Animation(player, spellID, target) {
        var owner
        var target_card
        var spell
        if (player.im === this.player.im) {
            owner = this.player
            spell = this.getPlayerCardObj(spellID)
            target_card = this.getPlayerCardObj(target.id);
            this.playerHand.removeCard(spell)
            this.playerHand.closeHand()

        } else {
            owner = this.enemy
            spell = this.getEnemyCardObj(spellID)
            spell.setVisible(true)
            target_card = this.getEnemyCardObj(target.id);
        }
        //TODO melhorar animaçao e adicionar um brilho na carta que recebeu o buff
        this.scene.tweens.add({
            targets: spell,
            scale: 0.60,
            depth: 10,
            angle: 0,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: spell,
                    delay: 400,
                    scale: 0.10,
                    depth: 10,
                    alpha: 1,
                    x: target_card.x,
                    y: target_card.y,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        spell.death()
                        this.updateEnergy()
                        this.updateCardData(target_card, owner)
                    },
                });
            },
        });

    }
    spellS2Animation(player, spellID, target) {
        var owner
        var target_card
        var spell
        if (player.im === this.player.im) {
            owner = this.player
            spell = this.getPlayerCardObj(spellID)
            target_card = this.getPlayerCardObj(target.id);
            this.playerHand.removeCard(spell)
            this.playerHand.closeHand()

        } else {
            owner = this.enemy
            spell = this.getEnemyCardObj(spellID)
            spell.setVisible(true)
            target_card = this.getEnemyCardObj(target.id);
        }
        //TODO melhorar animaçao e adicionar um brilho na carta que recebeu o buff
        this.scene.tweens.add({
            targets: spell,
            scale: 0.60,
            depth: 10,
            angle: 0,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: spell,
                    delay: 400,
                    scale: 0.10,
                    depth: 10,
                    alpha: 1,
                    x: target_card.x,
                    y: target_card.y,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        spell.death()
                        this.updateEnergy()
                        this.updateCardData(target_card, owner)
                    },
                });
            },
        });

    }
    spellS5Animation(player, spellID, updatedCards) {
        let spell;
        if (player.im === this.player.im) {
            spell = this.getPlayerCardObj(spellID);
            this.playerHand.removeCard(spell)
            this.playerHand.closeHand()

        } else {
            spell = this.getEnemyCardObj(spellID);
            spell.setVisible(true)
        }
        //TODO animaçao 
        this.scene.tweens.add({
            targets: spell,
            scale: 0.60,
            depth: 10,
            angle: 0,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.updateHp()
                this.updateEnergy()
                sleep(this.scene, 800, () => {
                    spell.death()
                    if (player.im === this.player.im) {
                        updatedCards.forEach((id) => {
                            var card = this.getPlayerCardObj(id)
                            this.updateCardData(card, this.player)
                        })

                    } else {
                        updatedCards.forEach((id) => {
                            var card = this.getEnemyCardObj(id)
                            this.updateCardData(card, this.enemy)
                        })
                    }
                })
            },
        });
    }
    spellS7Animation(player, spellID) {
        let spell;
        if (player.im === this.player.im) {
            spell = this.getPlayerCardObj(spellID);
            this.playerHand.removeCard(spell)
            this.playerHand.closeHand()

        } else {
            spell = this.getEnemyCardObj(spellID);
            spell.setVisible(true)
        }
        //TODO animaçao brilho verde de cura
        this.scene.tweens.add({
            targets: spell,
            scale: 0.60,
            depth: 0,
            angle: 0,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.updateHp()
                this.updateEnergy()
                sleep(this.scene, 800, () => {
                    spell.death()
                })
            },
        });
    }
    spellS8Animation(player, spellID, target) {
        var owner
        var enemy
        var target_card
        var spell
        if (player.im === this.player.im) {
            owner = this.player
            enemy = this.enemy
            spell = this.getPlayerCardObj(spellID)
            target_card = this.getEnemyCardObj(target.id);
            this.playerHand.removeCard(spell)
            this.playerHand.closeHand()

        } else {
            owner = this.enemy
            enemy = this.player
            spell = this.getEnemyCardObj(spellID)
            spell.setVisible(true)
            target_card = this.getPlayerCardObj(target.id);
        }

        this.scene.tweens.add({
            targets: spell,
            scale: 0.60,
            depth: 10,
            angle: 0,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: spell,
                    delay: 400,
                    scale: 0.10,
                    depth: 10,
                    alpha: 1,
                    x: target_card.x,
                    y: target_card.y,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        spell.death()
                        this.updateEnergy()
                        this.updateCardData(target_card, enemy)
                    },
                });
            },
        });
    }
    hideHand(mainCard) {
        this.playerHand.hand.forEach((card) => {
            card.alpha = 0
        })
        mainCard.alpha = 1
    }
    showHand(mainCard) {
        this.playerHand.hand.forEach((card) => {
            card.alpha = 1
        })
    }

    deleteMatch() {
        clearCardsToSwap()
    }
}
