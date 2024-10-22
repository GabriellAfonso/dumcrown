import {
    matchDB, updatedHp, updateRound, pass, updatedEnergy, adversaryCard, adversaryFieldUpdate, adversaryCardsAttack,
    adversaryCardsAttackUpdate, adversaryCardsDefese, adversaryCardsDefeseUpdate,
    resolveData, resolveUpdate, autopass,
} from '../client/match.js';
import {
    setUpdateHp, setUpdateRound, setPassValue, setAutoPassValue, setUpdatedEnergy, setAdversaryFieldUpdate, setAdversaryCardsAttackUpdate,
    setAdversaryCardsDefeseUpdate, setResolveUpdate
} from '../client/match.js';


import { player, areYouInGame, setAreYouInGame } from '../client/client.js';

import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { disabledHandAnimation } from '../animations/scripts/disabledHand.js'
import { activeHandAnimation } from '../animations/scripts/activeHand.js'
import { attackCardsCrashAnimation } from '../animations/scripts/yourAttackCards.js';
import { adversaryAttackCardsCrashAnimation } from '../animations/scripts/adversaryAttackCards.js';
import { textAnimation } from '../animations/scripts/textAnimations.js';
import { simpleTweens } from '../animations/scripts/functions.js';
import { simpleTextTweens } from '../animations/scripts/functions.js';
import { crashSwords } from '../animations/scripts/attackingSwords.js';
import { cardsOnfield, adversaryCardsOnField } from '../animations/scripts/cardsOnfield.js';
import { gameWin, gameLoss } from '../animations/scripts/gameover.js';

import { sleep } from '../functions/functions.js';
import { switchScenes, logoutAjax } from '../functions/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';



import { Botao, MasterButton } from '../functions/functions.js';
import { adversaryAttackCards, attackCardsOnArena } from '../animations/scripts/attackCards.js';
import { adversaryDefenseCards, yourDefenseCards } from '../animations/scripts/defenseCards.js';
import { adversaryDefenseCrash, yourDefenseCrash } from '../animations/scripts/crashCards.js';


export class DumArena extends Phaser.Scene {
    constructor() {
        super({ key: 'DumArena' });
    }


    create() {
        const soundfx = this.scene.get('Loading');

        setAreYouInGame(true)
        //main view dicide
        if (player.nickname === matchDB.player1.nickname) {
            this.iAm = 'player1'
            this.enemyAre = 'player2'
            this.you = matchDB.player1
            this.adversary = matchDB.player2
        } else if (player.nickname === matchDB.player2.nickname) {
            this.iAm = 'player2'
            this.enemyAre = 'player1'
            this.you = matchDB.player2
            this.adversary = matchDB.player1
        }

        this.yourCards = cards(this);
        this.adversaryCards = cards(this)

        this.gameStarting = true
        this.cardsHitBoxGroup = this.add.group();
        this.yourCardsOnField = []
        this.yourCardsOnArena = {}
        this.yourDefeseCards = {}

        this.adversaryCardsOnField = []
        this.adversaryCardsAttack = {}
        this.adversaryCardsDefese = {}

        this.resolveDict = {}

        this.gameover = false

        this.hitBoxVisibility = 0.00000001


        const config = new Botao(this, 50, 60, 'config', () => {
            // abrir cena de config
            this.game.scene.run('ConfigScreen')
            sendSocket('disconnect_room', matchDB.id)

        }, 0xffff00, soundfx.closeSound);
        config.setScale(0.8)
        config.setDepth(50)




        this.myDeck = []
        for (let i = 0; i < this.you.deck.length; i++) {
            this.myDeck.push(this.yourCards[this.you.deck[i]])
        }


        this.yourArena = this.add.image(centerX, centerY, this.you.arena);
        this.yourArena.setScale(0.5)


        this.yourIcon = this.add.image(110, 678, this.you.icon);
        this.yourIcon.setScale(0.4)
        this.yourBorder = this.add.image(110, 678, this.you.border);
        this.yourBorder.setScale(0.4)

        this.yourNickname = this.add.text(110, 752, this.you.nickname,
            {
                fontSize: '20px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            });
        this.yourNickname.setOrigin(0.5, 0.5)
        this.yourNickname.setShadow(2, 2, '#000', 2, false, true);

        this.yourHP = this.add.text(252, centerY + 85, this.you.hp,
            {
                fontSize: '23px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            });
        this.yourHP.setOrigin(0.5, 0.5)
        this.yourHP.setShadow(2, 2, '#000', 2, false, true);
        this.yourHP.depth = 1

        this.yourEnergy = this.add.text(1255, centerY + 80, this.you.energy,
            {
                fontSize: '26px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            });
        this.yourEnergy.setShadow(2, 2, '#000', 2, false, true);
        this.yourEnergy.depth = 1
        this.yourEnergy.setOrigin(0.5, 0.5)

        const yourHpBar = this.add.image(220, centerY + 85, 'hpbar');
        yourHpBar.setScale(0.35)


        const yourHpIcon = this.add.image(190, centerY + 85, 'yourcrown');
        yourHpIcon.setScale(0.35)

        const yourEnergyHolder = this.add.image(1255, centerY + 80, 'energy_holder');
        yourEnergyHolder.setScale(0.35)

        const yourDeck = this.add.image(346, 669, 'cards_deck');
        yourDeck.setScale(0.7)

        const yourFirsDeckCard = this.add.image(346 - 10, 669 - 7, 'verse_card');
        yourFirsDeckCard.setScale(0.4)




        this.adversaryArena = this.add.image(centerX, centerY, this.adversary.arena);
        this.adversaryArena.setScale(0.5)

        this.adversaryArena.angle = 180

        this.adversaryIcon = this.add.image(1390, 90, this.adversary.icon);
        this.adversaryIcon.setScale(0.4)
        this.adversaryBorder = this.add.image(1390, 90, this.adversary.border);
        this.adversaryBorder.setScale(0.4)

        this.adversaryNickname = this.add.text(1390, 15, this.adversary.nickname,
            { fontSize: '20px', fontFamily: 'Lexend Deca, sans-serif', fontStyle: 'bold', fill: '#fff' });
        this.adversaryNickname.setOrigin(0.5, 0.5)
        this.adversaryNickname.setShadow(2, 2, '#000', 2, false, true);

        this.adversaryHP = this.add.text(252, centerY - 85, this.adversary.hp,
            { fontSize: '23px', fontFamily: 'Lexend Deca, sans-serif', fontStyle: 'bold', fill: '#fff' });
        this.adversaryHP.setOrigin(0.5, 0.5)
        this.adversaryHP.setShadow(2, 2, '#000', 2, false, true);
        this.adversaryHP.depth = 1

        this.adversaryEnergy = this.add.text(1255, centerY - 80, this.adversary.energy,
            {
                fontSize: '26px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            });
        this.adversaryEnergy.setShadow(2, 2, '#000', 2, false, true);
        this.adversaryEnergy.depth = 1
        this.adversaryEnergy.setOrigin(0.5, 0.5)

        const adversaryHpBar = this.add.image(220, centerY - 85, 'hpbar');
        adversaryHpBar.setScale(0.35)

        const adversaryHpIcon = this.add.image(190, centerY - 85, 'enemycrown');
        adversaryHpIcon.setScale(0.35)

        const adversaryEnergyHolder = this.add.image(1255, centerY - 80, 'energy_holder');
        adversaryEnergyHolder.setScale(0.35)

        const enemyDeck = this.add.image(1162, 100, 'cards_deck');
        enemyDeck.setScale(0.7)
        enemyDeck.angle = 180

        const enemyFirsDeckCard = this.add.image(1162 + 10, 100 + 7, 'verse_card');
        enemyFirsDeckCard.setScale(0.4)
        enemyFirsDeckCard.angle = 180


        this.waitingAdversary = this.add.text(centerX, 140, '',
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#dddddd'
            })
        this.waitingAdversary.setOrigin(0.5, 0.5)



        this.masterButton = new MasterButton(this, 1370, centerY, () => {

        });
        this.masterButton.setScale(0.35)
        this.masterButton.depth = 10

        this.buttonText = this.add.text(1370, centerY - 5, '',
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            })
        this.buttonText.setOrigin(0.5, 0.5)
        this.buttonText.depth = 11


        //Apresentaçao das suas 4 cartas 
        this.myHand = [
            this.myDeck[0],
            this.myDeck[1],
            this.myDeck[2],
            this.myDeck[3],
        ]

        this.myDeck.splice(0, 4)

        this.startHand()

        this.activeHandHitBox = this.add.rectangle(1280, 685, 420, 180, 0x000080)
        this.activeHandHitBox.alpha = this.hitBoxVisibility
        this.activeHandHitBox.depth = 13

        this.activeHandHitBox.on('pointerdown', (pointer, localx, localy, event) => {
            this.activeHand()
            this.activeHandHitBox.disableInteractive()
            this.disableHandHitBox.setInteractive()
        }
        )

        this.disableHandHitBox = this.add.rectangle(centerX, centerY, 1500, 768, 0x8B0000)
        this.disableHandHitBox.alpha = this.hitBoxVisibility
        this.disableHandHitBox.depth = 1

        this.disableHandHitBox.on('pointerdown', (pointer, localx, localy, event) => {
            this.disabledHand()
        }
        )


        this.arenaHitBox = this.add.rectangle(centerX, centerY, 915, 380, 0x8B0000)
        this.arenaHitBox.alpha = this.hitBoxVisibility
        this.arenaHitBox.depth = 91




    }



    update() {

        if (this.you.hp == 0 && !this.gameover) {
            //you loss
            gameLoss(this)

            sendSocket('gameLoser')
            sendSocket('add_experience', player.level * 3 + 50)
            this.masterButton.powerOFF()
            this.masterButton.buttonText.text = 'FIM'


            this.gameover = true
            setAreYouInGame(false)
        }
        if (this.adversary.hp == 0 && !this.gameover) {
            //you win
            gameWin(this)

            sendSocket('gameWinner', [matchDB.id, this.adversary.nickname])
            sendSocket('add_experience', player.level * 8 + 150)
            sendSocket('delete_room', matchDB.id)
            sendSocket('delete_match', matchDB.id)
            this.masterButton.powerOFF()
            this.masterButton.buttonText.text = 'FIM'


            this.gameover = true
            setAreYouInGame(false)
        }
        if (this.you.ready && this.adversary.ready && this.gameStarting) {
            this.gameStarting = false

            this.waitingAdversary.text = ''

            this.round(matchDB.round)
            setAutoPassValue(true)


        }
        if (this.you.ready && !this.adversary.ready) {
            this.waitingAdversary.text = 'Aguardando adversário...'
        }

        if (this.disabledHandVar) {
            this.cardsHitBoxGroup.clear(true, true);
        }


        if (updatedHp) {
            setUpdateHp(false)
            if (this.iAm == 'player1') {
                this.yourHP.text = matchDB.player1.hp
                this.adversaryHP.text = matchDB.player2.hp
            } else {
                this.yourHP.text = matchDB.player2.hp
                this.adversaryHP.text = matchDB.player1.hp
            }
        }
        if (updateRound) {
            setUpdateRound(false)


            if (!this.gameover) {
                sleep(this, 1000, () => {
                    this.round(matchDB.round)
                })
            }

        }

        if (pass) {
            setPassValue(false)
            this.turnMessages()

            if (this.iAm === matchDB.turn) {
                this.masterButton.setMode('pass')
            } else {
                this.masterButton.setMode('wait')
            }
            if (matchDB.phase == 4 && matchDB.turn == this.iAm) {
                this.defeseHitBox()
            }
        }



        if (updatedEnergy) {
            setUpdatedEnergy(false)

            if (this.iAm === 'player1') {
                this.yourEnergy.text = matchDB.player1.energy
                this.adversaryEnergy.text = matchDB.player2.energy
            }
            if (this.iAm === 'player2') {
                this.yourEnergy.text = matchDB.player2.energy
                this.adversaryEnergy.text = matchDB.player1.energy
            }

        }

        if (adversaryFieldUpdate) {
            setAdversaryFieldUpdate(false)
            this.adversaryCardsOnField.push(this.adversaryCards[adversaryCard])
            this.adversaryCards[adversaryCard].setPosition(1180, 110)
            this.adversaryCards[adversaryCard].updateCardLayout('mini')
            this.adversaryCardOnfieldAnimation()
        }

        if (adversaryCardsAttackUpdate) {
            setAdversaryCardsAttackUpdate(false)
            var indiceDict = Object.keys(this.adversaryCardsAttack).length + 1


            this.adversaryCardsAttack[indiceDict] = adversaryCardsAttack


            var card = this.adversaryCards[adversaryCardsAttack['ID']]

            const indice = this.adversaryCardsOnField.indexOf(card);

            if (indice !== -1) {
                this.adversaryCardsOnField.splice(indice, 1);

            } else {
                // console.log("Elemento não encontrado na lista");
            }


            this.adversaryCardAttackAnimation()
            this.adversaryCardOnfieldAnimation()

        }

        if (adversaryCardsDefeseUpdate) {
            setAdversaryCardsDefeseUpdate(false)
            // var indiceDict = Object.keys(this.adversaryCardsDefese).length


            this.adversaryCardsDefese[adversaryCardsDefese['POSITION']] = adversaryCardsDefese



            var card = this.adversaryCards[adversaryCardsDefese['ID']]

            const indice = this.adversaryCardsOnField.indexOf(card);

            if (indice !== -1) {
                this.adversaryCardsOnField.splice(indice, 1);

            } else {
                // console.log("Elemento não encontrado na lista");
            }

            this.adversaryDefeseCardsAnimation()
            this.adversaryCardOnfieldAnimation()
        }

        if (resolveUpdate) {
            setResolveUpdate(false)

            if (matchDB.attacking == this.iAm) {
                var who_attacking = this.iAm
                var who_defense = this.enemyAre
            } else {
                var who_attacking = this.enemyAre
                var who_defense = this.iAm
            }
            var playerAttacking = resolveData[who_attacking]
            var playerDefense = resolveData[who_defense]

            if (matchDB.attacking == this.iAm) {
                this.attackCardsOnArenaCrash()



                const times = [600, 1450, 2300, 3150, 4000]
                for (const position in playerAttacking) {
                    const time = times[position - 1]

                    setTimeout(() => {
                        if (position in playerDefense) {
                            var id = playerDefense[position]['ID'];
                            var card = this.adversaryCards[id]
                            var atk = playerAttacking[position]['ATK'];
                            var def = playerDefense[position]['DEF'];
                            //fazer aparecer o dano que a carta levou em cima dela
                            card.defenseText.text = def;
                            textAnimation(this, card.x, card.y, -atk, '#9B0000')

                            if (def < 1) {
                                simpleTweens(this, card, card.x, card.y, card.scale, card.depth, card.angle, 400, () => {
                                    card.destroy()
                                }, 0)
                                if (def < 0) {
                                    textAnimation(this, 290, centerY - 85, def, '#9B0000', 23)
                                    sendSocket('damage_Result', [matchDB.id, def])
                                }

                            }
                        }
                        else {
                            var id = playerAttacking[position]['ID'];
                            var card = this.yourCards[id]
                            var atk = playerAttacking[position]['ATK'];
                            textAnimation(this, card.x, 280, -atk, '#9B0000')

                            //true damage
                            textAnimation(this, 290, centerY - 85, -atk, '#9B0000', 23)
                            sendSocket('damage_Result', [matchDB.id, -atk])

                        }
                    }, time);
                }
                var waitfor = Object.keys(playerAttacking).length - 1
                var wait = times[waitfor]
                setTimeout(() => {

                    for (const position in playerAttacking) {
                        var id = playerAttacking[position]['ID'];
                        var card = this.yourCards[id]
                        this.yourCardsOnField.push(card)
                    }
                    for (const position in playerDefense) {
                        var id = playerDefense[position]['ID'];
                        var card = this.adversaryCards[id]
                        var def = playerDefense[position]['DEF'];
                        if (def > 0) {
                            this.adversaryCardsOnField.push(card)
                        }
                    }


                }, wait)

                setTimeout(() => {

                    this.yourCardsOnFieldAnimation()
                    this.adversaryCardOnfieldAnimation()
                    sendSocket('round_update', matchDB.id)

                }, wait + 1000)


            } else {
                this.adversaryAttackCardsOnArenaCrash()


                const times = [600, 1450, 2300, 3150, 4000]
                for (const position in playerAttacking) {
                    const time = times[position - 1]
                    setTimeout(() => {
                        if (position in playerDefense) {
                            var id = playerDefense[position]['ID'];
                            var card = this.yourCards[id]
                            var atk = playerAttacking[position]['ATK'];
                            var def = playerDefense[position]['DEF'];
                            //fazer aparecer o dano que a carta levou em cima dela
                            card.defenseText.text = def;
                            textAnimation(this, card.x, card.y, -atk, '#9B0000')

                            if (def < 1) {
                                simpleTweens(this, card, card.x, card.y, card.scale, card.depth, card.angle, 400, () => {
                                    card.destroy()
                                }, 0)
                                if (def < 0) {
                                    textAnimation(this, 290, centerY + 85, def, '#9B0000', 23)

                                }

                            }
                        }
                        else {
                            var id = playerAttacking[position]['ID'];
                            var card = this.adversaryCards[id]
                            var atk = playerAttacking[position]['ATK'];
                            textAnimation(this, card.x, 490, -atk, '#9B0000')
                            //true damage
                            textAnimation(this, 290, centerY + 85, -atk, '#9B0000', 23)


                        }
                    }, time);
                }


                var waitfor = Object.keys(playerAttacking).length - 1
                var wait = times[waitfor]

                setTimeout(() => {
                    for (const position in playerAttacking) {
                        var id = playerAttacking[position]['ID'];
                        var card = this.adversaryCards[id]
                        this.adversaryCardsOnField.push(card)
                    }

                    for (const position in playerDefense) {
                        var id = playerDefense[position]['ID'];
                        var card = this.yourCards[id]
                        var def = playerDefense[position]['DEF'];
                        if (def > 0) {
                            this.yourCardsOnField.push(card)
                        }
                    }


                }, wait)
                setTimeout(() => {

                    this.yourCardsOnFieldAnimation()
                    this.adversaryCardOnfieldAnimation()


                }, wait + 1000)
            }


        }
    }



    startHand() {
        const showCard = (cardID, finalX, finalY = centerY) => {

            const verseCard = this.add.image(346 - 10, 669 - 7, 'verse_card');
            verseCard.setScale(0.2)
            simpleTweens(this, verseCard, '-=150', '-=20', 0.23, 90, 0, 300, () => {
                simpleTweens(this, verseCard, finalX, centerY, 0.54, 90, 0, 300, () => {
                    var card = cardID;
                    card.setPosition(finalX, centerY);
                    card.scaleX = 0;
                    card.scaleY = 0.54;
                    card.depth = 5

                    this.tweens.add({
                        targets: verseCard,
                        scaleX: 0,
                        duration: 100,
                        ease: 'Linear',
                        onComplete: () => {
                            verseCard.destroy();
                        }
                    });

                    this.tweens.add({
                        targets: card,
                        scaleX: 0.54,
                        delay: 100,
                        duration: 100,
                        ease: 'Linear',
                    });
                })
            })

        }



        showCard(this.myHand[0], centerX - 300);

        sleep(this, 300, () => {
            showCard(this.myHand[1], centerX - 100)
        })
        sleep(this, 600, () => {
            showCard(this.myHand[2], centerX + 100)
        })
        sleep(this, 900, () => {
            showCard(this.myHand[3], centerX + 300)
        })

        sleep(this, 2200, () => {
            this.masterButton.powerON();
            this.masterButton.setMode('ready')
        })

    }

    cardAcquisition() {
        //temporario pra nao ganhar mais cartas caso acabe
        if (this.myDeck.length < 1) {
            return false
        }
        if (this.myHand.length == 7) {
            return false
        }

        const verseCard = this.add.image(346 - 10, 669 - 7, 'verse_card');
        verseCard.setScale(0.2)

        this.tweens.add({
            targets: verseCard,
            x: '-=150',
            y: '-=20',
            angle: 0,
            scale: 0.8,
            depth: 90,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({
                    targets: verseCard,
                    x: centerX,
                    y: centerY + 100,
                    duration: 200,
                    onComplete: () => {
                        var card = this.myDeck[0];
                        card.setPosition(centerX, centerY + 100);
                        card.scaleX = 0;
                        card.scaleY = 0.8;
                        card.depth = 5

                        this.tweens.add({
                            targets: verseCard,
                            scaleX: 0,
                            duration: 100,
                            ease: 'Linear',
                            onComplete: () => {
                                verseCard.destroy();
                            }
                        });

                        this.tweens.add({
                            targets: card,
                            scaleX: 0.8,
                            delay: 100,
                            duration: 100,
                            ease: 'Linear',
                        });
                    }
                })
            }
        })
        this.myHand.push(this.myDeck[0])
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.myDeck.splice(0, 1)
                this.disabledHand()
            },
            callbackScope: this,
        });

    }

    disabledHand() {
        this.disabledHandVar = true
        this.activeHandVar = false

        this.activeHandHitBox.setInteractive({ cursor: 'pointer' })
        this.disableHandHitBox.disableInteractive()

        if (this.cardAnimation) {
            this.cardAnimation.stop()
        }
        if (this.finishCardAnimation) {
            this.finishCardAnimation.stop()
        }

        disabledHandAnimation(this, this.myHand)

    }

    round(number) {
        this.masterButton.setMode('wait')
        this.disabledHand()
        this.activeHandHitBox.disableInteractive()

        this.roundText = this.add.text(centerX, centerY, 'RODADA ' + number,
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
                    this.cardAcquisition()
                    sendSocket('energy_update', [matchDB.id, matchDB.round])
                })
                sleep(this, 2300, () => {
                    if (this.iAm == matchDB.attacking) {
                        crashSwords(this, 200, 50, 0.25)
                    } else if (this.enemyAre == matchDB.attacking) {
                        crashSwords(this, 0, -50, 0.25)
                    }
                })
                sleep(this, 2600, () => {
                    this.turnMessages()
                    if (this.iAm === matchDB.turn) {
                        this.masterButton.setMode('pass')
                    } else {
                        this.masterButton.setMode('wait')
                    }
                })
                sleep(this, 3400, () => {

                    this.adversaryCardsAttack = {}
                    this.adversaryCardsDefese = {}
                    this.yourCardsOnArena = {}
                    this.yourDefeseCards = {}

                    this.activeHandHitBox.setInteractive({ cursor: 'pointer' })
                })

            }, 2000)
        })

    }

    turnMessages() {
        HandCardAnimation

        this.turnMessage = this.add.text(centerX, 275, '',
            {
                fontSize: '80px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#FFD700'
            })
        this.turnMessage.setShadow(0, 0, '#000', 8, false, true);
        this.turnMessage.alpha = 0;
        this.turnMessage.setOrigin(0.5, 0.5)

        if (matchDB.turn == this.iAm) {
            this.turnMessage.text = 'Sua vez'
        }
        else if (matchDB.turn == this.enemyAre) {
            this.turnMessage.text = 'vez do oponente'
        }

        this.tweens.add({
            targets: this.turnMessage,
            depth: 90,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            onComplete: () => {
                this.tweens.add({
                    targets: this.turnMessage,
                    delay: 1400,
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',
                })
            },
        })

    }


    activeHand() {
        this.activeHandVar = true
        this.disabledHandVar = false

        this.cardsHitBoxGroup.clear(true, true);

        activeHandAnimation(this, this.myHand)

    }

    HandCardAnimation(card, hitbox) {
        let startX = null
        let startY = null
        this.cardIsDragging = false;


        let thisCard = card
        let hitBoxCard = hitbox
        let startHitDepth = hitbox.depth


        hitBoxCard.on('pointerdown', (pointer, localx, localy, event) => {
            hitBoxCard.scale = 10
            hitBoxCard.depth = 90

            startX = pointer.x;
            startY = pointer.y;
            this.cardIsDragging = true;

            this.arenaPhase1(thisCard, hitBoxCard)

            this.cardAnimation = this.tweens.add({
                targets: thisCard,
                y: 458,
                angle: 0,
                scale: 0.8,
                depth: 90,
                duration: 400, // Duração da animação em milissegundos
                ease: 'Power2',
            })

        })

        hitBoxCard.on('pointerup', (pointer, localx, localy, event) => {
            this.cardAnimation.stop()
            hitBoxCard.depth = startHitDepth
            this.finishCardAnimation = this.tweens.add({
                targets: thisCard,
                y: hitBoxCard.y,
                x: hitBoxCard.x,
                angle: hitBoxCard.angle,
                scale: 0.50,
                depth: hitBoxCard.depth - 1,
                duration: 500,
                ease: 'Power2',

            })
            hitBoxCard.scale = 0.50
            this.cardIsDragging = false;

            this.arenaHitBox.disableInteractive()


        })

        hitBoxCard.on('pointermove', (pointer) => {


            if (this.cardIsDragging) {
                const deltaX = pointer.x - startX;
                const deltaY = pointer.y - startY;
                if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
                    this.cardAnimation.stop()
                    thisCard.angle = 0
                    thisCard.scale = 0.50
                    thisCard.depth = 50
                    thisCard.x = pointer.x
                    thisCard.y = pointer.y


                }


            }
        });
    }
    arenaPhase1(card, hitbox) {
        this.arenaHitBox.setInteractive()
        this.arenaHitBox.removeAllListeners();

        this.arenaHitBox.on('pointerup', (pointer, localx, localy, event) => {
            let message = ''
            let cardInfo = card.getCardInfo();
            this.cardAnimation.stop()

            if (matchDB.phase > 2 && matchDB.turn == this.iAm) {
                message = 'Não é possivel adiconar cartas nessa fase'
                this.activeHand()
                this.arenaHitBox.removeAllListeners();
                this.cardIsDragging = false
                hitbox.scale = 0.50

                this.maxMessage = this.add.text(centerX, 140, message,
                    {
                        fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                        fontStyle: 'bold', fill: '#fff'
                    })

                this.maxMessage.setShadow(2, 2, '#000', 2, false, true);
                this.maxMessage.alpha = 0;
                this.maxMessage.setOrigin(0.5, 0.5)



                this.maxMessageAnimation = this.tweens.add({
                    targets: this.maxMessage,
                    depth: 90,
                    alpha: 1,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.maxMessage,
                            delay: 1000,
                            alpha: 0,
                            duration: 500,
                            ease: 'Linear',
                        })
                    },
                })

                return false

            }



            if (this.yourCardsOnField.length == 5) {


                message = 'Maximo de cartas em campo atingido'
                this.activeHand()
                this.arenaHitBox.removeAllListeners();
                this.cardIsDragging = false
                hitbox.scale = 0.50

                this.maxMessage = this.add.text(centerX, 140, message,
                    {
                        fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                        fontStyle: 'bold', fill: '#fff'
                    })

                this.maxMessage.setShadow(2, 2, '#000', 2, false, true);
                this.maxMessage.alpha = 0;
                this.maxMessage.setOrigin(0.5, 0.5)



                this.maxMessageAnimation = this.tweens.add({
                    targets: this.maxMessage,
                    depth: 90,
                    alpha: 1,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.maxMessage,
                            delay: 1000,
                            alpha: 0,
                            duration: 500,
                            ease: 'Linear',
                        })
                    },
                })

                return false

            }

            if (matchDB.turn == this.iAm && matchDB.phase == 1 ||
                matchDB.turn == this.iAm && matchDB.phase == 2) {

                if (parseInt(this.you.energy) >= cardInfo.energy) {
                    card.updateCardLayout('mini')

                    sendSocket('energy_update', [matchDB.id, -cardInfo.energy])


                    const indice = this.myHand.indexOf(card);

                    if (indice !== -1) {
                        this.myHand.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }

                    this.activeHand()
                    this.arenaHitBox.disableInteractive()



                    this.yourCardsOnField.push(card)
                    sendSocket('adversary_field', [matchDB.id, cardInfo.id])

                    this.yourCardsOnFieldAnimation()



                } else {
                    message = 'Energia Insuficiente!'
                    this.activeHand()
                    this.arenaHitBox.removeAllListeners();
                    this.cardIsDragging = false
                    hitbox.scale = 0.50

                    this.insufficientEnergyMessage = this.add.text(centerX, 140, message,
                        {
                            fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                            fontStyle: 'bold', fill: '#fff'
                        })

                    this.insufficientEnergyMessage.setShadow(2, 2, '#000', 2, false, true);
                    this.insufficientEnergyMessage.alpha = 0;
                    this.insufficientEnergyMessage.setOrigin(0.5, 0.5)



                    this.insufficientEnergyAnimation = this.tweens.add({
                        targets: this.insufficientEnergyMessage,
                        depth: 90,
                        alpha: 1,
                        duration: 200,
                        ease: 'Linear',
                        onComplete: () => {
                            this.tweens.add({
                                targets: this.insufficientEnergyMessage,
                                delay: 1000,
                                alpha: 0,
                                duration: 500,
                                ease: 'Linear',
                            })
                        },
                    })
                }



            }
            else if (matchDB.turn != this.iAm) {
                message = 'vez do oponente, aguarde!'
                this.activeHand()
                this.arenaHitBox.removeAllListeners();
                this.cardIsDragging = false
                hitbox.scale = 0.50

                this.waitYourTurnMessage = this.add.text(centerX, 140, message,
                    {
                        fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                        fontStyle: 'bold', fill: '#fff'
                    })

                this.waitYourTurnMessage.setShadow(2, 2, '#000', 2, false, true);
                this.waitYourTurnMessage.alpha = 0;
                this.waitYourTurnMessage.setOrigin(0.5, 0.5)



                this.waitYourTurnAnimation = this.tweens.add({
                    targets: this.waitYourTurnMessage,
                    depth: 90,
                    alpha: 1,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.waitYourTurnMessage,
                            delay: 1000,
                            alpha: 0,
                            duration: 500,
                            ease: 'Linear',
                        })
                    },
                })
            }



        })
        this.arenaHitBox.on('pointermove', (pointer) => {
            card.x = pointer.x
            card.y = pointer.y

        })
    }


    fieldCardAnimation(card, hitbox) {
        let startX = null
        let startY = null
        this.cardIsDragging = false;


        let thisCard = card
        let hitBoxCard = hitbox
        let startHitDepth = hitbox.depth


        hitBoxCard.on('pointerdown', (pointer, localx, localy, event) => {
            hitBoxCard.scale = 10
            hitBoxCard.depth = 90

            startX = pointer.x;
            startY = pointer.y;
            this.cardIsDragging = true;

            if (matchDB.phase < 4) {

                this.arenaPhase2(thisCard, hitBoxCard)
            }
            if (matchDB.phase == 4 && matchDB.turn == this.iAm) {

                this.arenaDefesePhase(thisCard, hitBoxCard)
            }

            this.cardAnimation = this.tweens.add({
                targets: thisCard,
                y: 458,
                angle: 0,
                scale: 0.6,
                depth: 90,
                duration: 400,
                ease: 'Power2',
            })

        })

        hitBoxCard.on('pointerup', (pointer, localx, localy, event) => {
            hitBoxCard.depth = startHitDepth
            this.cardAnimation.stop()

            this.finishCardAnimation = this.tweens.add({
                targets: thisCard,
                y: hitBoxCard.y,
                x: hitBoxCard.x,
                angle: hitBoxCard.angle,
                scale: 0.28,
                depth: hitBoxCard.depth - 1,
                duration: 500,
                ease: 'Power2',

            })
            hitBoxCard.scale = 0.28

            this.cardIsDragging = false;

            if (this.firstBlockField) {
                this.firstBlockField.removeAllListeners();
            }
            if (this.secondBlockField) {
                this.secondBlockField.removeAllListeners();
            }
            if (this.thirdBlockField) {
                this.thirdBlockField.removeAllListeners();
            }


            this.arenaHitBox.disableInteractive()


        })

        hitBoxCard.on('pointermove', (pointer) => {


            if (this.cardIsDragging && matchDB.phase >= 2) {
                const deltaX = pointer.x - startX;
                const deltaY = pointer.y - startY;
                if (Math.abs(deltaX) > 20 || Math.abs(deltaY) > 20) {
                    this.cardAnimation.stop()
                    thisCard.angle = 0
                    thisCard.scale = 0.28
                    thisCard.depth = 50
                    thisCard.x = pointer.x
                    thisCard.y = pointer.y


                }


            }
        });
    }



    arenaPhase2(card, hitbox) {
        this.arenaHitBox.setInteractive()
        this.arenaHitBox.removeAllListeners();

        this.arenaHitBox.on('pointerup', (pointer, localx, localy, event) => {
            let cardInfo = card.getCardInfo();
            this.cardAnimation.stop()
            hitbox.destroy()

            if (matchDB.phase == 3 && matchDB.turn == this.iAm) {
                this.cardAnimation.stop()
                var yourCardsOnArenaLenght = Object.keys(this.yourCardsOnArena).length
                if (yourCardsOnArenaLenght < 5) {

                    const indice = this.yourCardsOnField.indexOf(card);

                    if (indice !== -1) {
                        this.yourCardsOnField.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }


                    this.yourCardsOnFieldAnimation()

                    this.cardIsDragging = false

                    this.yourCardsOnArena[yourCardsOnArenaLenght] = {
                        POSITION: yourCardsOnArenaLenght + 1,
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,

                    }

                    sendSocket('adversary_attack',
                        [matchDB.id, this.yourCardsOnArena[yourCardsOnArenaLenght]])
                    this.yourAttackCardsOnArenaAnimation()
                    this.arenaHitBox.disableInteractive()

                }



            } else {
                this.yourCardsOnFieldAnimation()
                this.arenaHitBox.disableInteractive()
            }


        })




        this.arenaHitBox.on('pointermove', (pointer) => {
            if (this.cardIsDragging && matchDB.phase >= 2) {
                card.x = pointer.x
                card.y = pointer.y
            }

        })

    }
    disableAllDefHitBoxs() {
        if (this.firstDefeseHitBox && this.firstDefeseHitBox.input) {
            this.firstDefeseHitBox.disableInteractive()
        }
        if (this.secondDefeseHitBox && this.secondDefeseHitBox.input) {
            this.secondDefeseHitBox.disableInteractive()
        }
        if (this.thirdDefeseHitBox && this.thirdDefeseHitBox.input) {
            this.thirdDefeseHitBox.disableInteractive()
        }
        if (this.fourthDefeseHitBox && this.fourthDefeseHitBox.input) {
            this.fourthDefeseHitBox.disableInteractive()
        }
        if (this.fifthDefeseHitBox && this.fifthDefeseHitBox.input) {
            this.fifthDefeseHitBox.disableInteractive()
        }
    }
    arenaDefesePhase(card, hitbox) {

        var cardInfo = card.getCardInfo();
        this.cardAnimation.stop()

        if (this.firstDefeseHitBox) {
            this.firstDefeseHitBox.removeAllListeners()
            this.firstDefeseHitBox.setInteractive()

            this.firstDefeseHitBox.on('pointerup', (pointer, localx, localy, event) => {
                hitbox.destroy()


                if (matchDB.phase == 4 && matchDB.turn == this.iAm && !this.yourDefeseCards[1]) {
                    this.cardIsDragging = false
                    //tirar carta da lista de cartas on field
                    const indice = this.yourCardsOnField.indexOf(card);

                    if (indice !== -1) {
                        this.yourCardsOnField.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }

                    this.yourDefeseCards[1] = {
                        POSITION: 1,
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }
                    sendSocket('adversary_defese', [matchDB.id, this.yourDefeseCards[1]])
                    this.yourDefeseCardsAnimation()
                    this.yourCardsOnFieldAnimation()

                    this.disableAllDefHitBoxs()

                } else {
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                }
            })
            this.firstDefeseHitBox.on('pointermove', (pointer) => {
                if (this.cardIsDragging && matchDB.phase == 4) {
                    card.x = pointer.x
                    card.y = pointer.y
                }

            })
        }
        if (this.secondDefeseHitBox) {
            this.secondDefeseHitBox.removeAllListeners()
            this.secondDefeseHitBox.setInteractive()

            this.secondDefeseHitBox.on('pointerup', (pointer, localx, localy, event) => {
                hitbox.destroy()

                if (matchDB.phase == 4 && matchDB.turn == this.iAm && !this.yourDefeseCards[2]) {
                    this.cardIsDragging = false

                    const indice = this.yourCardsOnField.indexOf(card);

                    if (indice !== -1) {
                        this.yourCardsOnField.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }

                    this.yourDefeseCards[2] = {
                        POSITION: 2,
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }
                    sendSocket('adversary_defese', [matchDB.id, this.yourDefeseCards[2]])
                    this.yourDefeseCardsAnimation()
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                } else {
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                }
            })

            this.secondDefeseHitBox.on('pointermove', (pointer) => {
                if (this.cardIsDragging && matchDB.phase == 4) {
                    card.x = pointer.x
                    card.y = pointer.y
                }

            })
        }
        if (this.thirdDefeseHitBox) {
            this.thirdDefeseHitBox.removeAllListeners()
            this.thirdDefeseHitBox.setInteractive()

            this.thirdDefeseHitBox.on('pointerup', (pointer, localx, localy, event) => {
                hitbox.destroy()

                if (matchDB.phase == 4 && matchDB.turn == this.iAm && !this.yourDefeseCards[3]) {
                    this.cardIsDragging = false

                    const indice = this.yourCardsOnField.indexOf(card);

                    if (indice !== -1) {
                        this.yourCardsOnField.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }

                    this.yourDefeseCards[3] = {
                        POSITION: 3,
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }
                    sendSocket('adversary_defese', [matchDB.id, this.yourDefeseCards[3]])
                    this.yourDefeseCardsAnimation()
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                } else {
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                }
            })

            this.thirdDefeseHitBox.on('pointermove', (pointer) => {
                if (this.cardIsDragging && matchDB.phase == 4) {
                    card.x = pointer.x
                    card.y = pointer.y
                }

            })
        }
        if (this.fourthDefeseHitBox) {
            this.fourthDefeseHitBox.removeAllListeners()
            this.fourthDefeseHitBox.setInteractive()

            this.fourthDefeseHitBox.on('pointerup', (pointer, localx, localy, event) => {
                hitbox.destroy()

                if (matchDB.phase == 4 && matchDB.turn == this.iAm && !this.yourDefeseCards[4]) {
                    this.cardIsDragging = false

                    const indice = this.yourCardsOnField.indexOf(card);

                    if (indice !== -1) {
                        this.yourCardsOnField.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }

                    this.yourDefeseCards[4] = {
                        POSITION: 4,
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }
                    sendSocket('adversary_defese', [matchDB.id, this.yourDefeseCards[4]])
                    this.yourDefeseCardsAnimation()
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                } else {
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                }
            })

            this.fourthDefeseHitBox.on('pointermove', (pointer) => {
                if (this.cardIsDragging && matchDB.phase == 4) {
                    card.x = pointer.x
                    card.y = pointer.y
                }

            })
        }
        if (this.fifthDefeseHitBox) {
            this.fifthDefeseHitBox.removeAllListeners()
            this.fifthDefeseHitBox.setInteractive()


            this.fifthDefeseHitBox.on('pointerup', (pointer, localx, localy, event) => {
                hitbox.destroy()

                if (matchDB.phase == 4 && matchDB.turn == this.iAm && !this.yourDefeseCards[5]) {
                    this.cardIsDragging = false

                    const indice = this.yourCardsOnField.indexOf(card);

                    if (indice !== -1) {
                        this.yourCardsOnField.splice(indice, 1);

                    } else {
                        // console.log("Elemento não encontrado na lista");
                    }

                    this.yourDefeseCards[5] = {
                        POSITION: 5,
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }
                    sendSocket('adversary_defese', [matchDB.id, this.yourDefeseCards[5]])
                    this.yourDefeseCardsAnimation()
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()
                } else {
                    this.yourCardsOnFieldAnimation()
                    this.disableAllDefHitBoxs()

                }
            })

            this.fifthDefeseHitBox.on('pointermove', (pointer) => {
                if (this.cardIsDragging && matchDB.phase == 4) {
                    card.x = pointer.x
                    card.y = pointer.y
                }

            })
        }

    }

    yourCardsOnFieldAnimation() {
        cardsOnfield(this)
    }



    adversaryCardOnfieldAnimation() {
        adversaryCardsOnField(this)
    }



    yourAttackCardsOnArenaAnimation() {
        attackCardsOnArena(this)
    }

    adversaryCardAttackAnimation() {
        adversaryAttackCards(this)
    }


    defeseHitBox() {
        if (this.firstDefeseHitBox) {
            this.firstDefeseHitBox.destroy()
        }
        if (this.secondDefeseHitBox) {
            this.secondDefeseHitBox.destroy()
        }
        if (this.thirdDefeseHitBox) {
            this.thirdDefeseHitBox.destroy()
        }
        if (this.fourthDefeseHitBox) {
            this.fourthDefeseHitBox.destroy()
        }
        if (this.fifthDefeseHitBox) {
            this.fifthDefeseHitBox.destroy()
        }

        //fazer um if e uma variavel pro Y 
        if (Object.keys(this.adversaryCardsAttack).length == 1) {

            this.firstDefeseHitBox = this.add.rectangle(centerX, 490, 124, 183, 0x8B6060)
            this.firstDefeseHitBox.alpha = this.hitBoxVisibility
            this.firstDefeseHitBox.depth = 92

        }

        if (Object.keys(this.adversaryCardsAttack).length == 2) {

            this.firstDefeseHitBox = this.add.rectangle(centerX - 70, 490, 124, 183, 0x8B6060)
            this.firstDefeseHitBox.alpha = this.hitBoxVisibility
            this.firstDefeseHitBox.depth = 92

            this.secondDefeseHitBox = this.add.rectangle(centerX + 70, 490, 124, 183, 0x8B6060)
            this.secondDefeseHitBox.alpha = this.hitBoxVisibility
            this.secondDefeseHitBox.depth = 92

        }

        if (Object.keys(this.adversaryCardsAttack).length == 3) {

            this.firstDefeseHitBox = this.add.rectangle(centerX - 135, 490, 124, 183, 0x8B6060)
            this.firstDefeseHitBox.alpha = this.hitBoxVisibility
            this.firstDefeseHitBox.depth = 92

            this.secondDefeseHitBox = this.add.rectangle(centerX, 490, 124, 183, 0x8B6060)
            this.secondDefeseHitBox.alpha = this.hitBoxVisibility
            this.secondDefeseHitBox.depth = 92

            this.thirdDefeseHitBox = this.add.rectangle(centerX + 135, 490, 124, 183, 0x8B6060)
            this.thirdDefeseHitBox.alpha = this.hitBoxVisibility
            this.thirdDefeseHitBox.depth = 92

        }

        if (Object.keys(this.adversaryCardsAttack).length == 4) {
            this.firstDefeseHitBox = this.add.rectangle(centerX - 210, 490, 124, 183, 0x8B6060)
            this.firstDefeseHitBox.alpha = this.hitBoxVisibility
            this.firstDefeseHitBox.depth = 92

            this.secondDefeseHitBox = this.add.rectangle(centerX - 70, 490, 124, 183, 0x8B6060)
            this.secondDefeseHitBox.alpha = this.hitBoxVisibility
            this.secondDefeseHitBox.depth = 92

            this.thirdDefeseHitBox = this.add.rectangle(centerX + 70, 490, 124, 183, 0x8B6060)
            this.thirdDefeseHitBox.alpha = this.hitBoxVisibility
            this.thirdDefeseHitBox.depth = 92

            this.fourthDefeseHitBox = this.add.rectangle(centerX + 210, 490, 124, 183, 0x8B6060)
            this.fourthDefeseHitBox.alpha = this.hitBoxVisibility
            this.fourthDefeseHitBox.depth = 92

        }



        if (Object.keys(this.adversaryCardsAttack).length == 5) {
            this.firstDefeseHitBox = this.add.rectangle(centerX - 270, 490, 124, 183, 0x8B6060)
            this.firstDefeseHitBox.alpha = this.hitBoxVisibility
            this.firstDefeseHitBox.depth = 92

            this.secondDefeseHitBox = this.add.rectangle(centerX - 135, 490, 124, 183, 0x8B6060)
            this.secondDefeseHitBox.alpha = this.hitBoxVisibility
            this.secondDefeseHitBox.depth = 92

            this.thirdDefeseHitBox = this.add.rectangle(centerX, 490, 124, 183, 0x8B6060)
            this.thirdDefeseHitBox.alpha = this.hitBoxVisibility
            this.thirdDefeseHitBox.depth = 92

            this.fourthDefeseHitBox = this.add.rectangle(centerX + 135, 490, 124, 183, 0x8B6060)
            this.fourthDefeseHitBox.alpha = this.hitBoxVisibility
            this.fourthDefeseHitBox.depth = 92

            this.fifthDefeseHitBox = this.add.rectangle(centerX + 270, 490, 124, 183, 0x8B6060)
            this.fifthDefeseHitBox.alpha = this.hitBoxVisibility
            this.fifthDefeseHitBox.depth = 92

        }
    }

    yourDefeseCardsAnimation() {
        yourDefenseCards(this)
    }

    adversaryDefeseCardsAnimation() {
        adversaryDefenseCards(this)
    }

    attackCardsOnArenaCrash() {
        attackCardsCrashAnimation(this)
    }

    adversaryAttackCardsOnArenaCrash() {
        adversaryAttackCardsCrashAnimation(this)
    }

    yourDefeseCardsCrash() {
        yourDefenseCrash(this)
    }



    adversaryDefeseCardsCrash() {
        adversaryDefenseCrash(this)
    }

}