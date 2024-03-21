import {
    matchDB, adversaryReady,
    setAdversaryReady, adversaryCardsOnField, setAdversaryCardsOnField,
    updateMatch, updateMatchValue, updatePhase, adversaryCardsAttack,
    roundUpdate, setRound, clearAdversaryCards,
    setCardOnField, setCardAttackMode, cardOnField, cardAtackkMode, damage,
    damageUpdateF, damageUpdate
} from '../game_clientside/match.js';


import { player } from '../game_clientside/client.js';

import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { disabledHandAnimation } from '../animations/scripts/disabledHand.js'


import { switchScenes, logoutAjax } from '../functions/functions.js';
import { cards, Card } from '../functions/cards.js';
import { sendSocket } from '../functions/functions.js';



import { Botao, MasterButton } from '../functions/functions.js';

export class DumArena extends Phaser.Scene {
    constructor() {
        super({ key: 'DumArecna' });
    }


    create() {
        const soundfx = this.scene.get('Loading');


        //main view dicide
        if (player.nickname === matchDB.player1.nickname) {
            this.you = matchDB.player1
            this.adversary = matchDB.player2
        } else if (player.nickname === matchDB.player2.nickname) {
            this.you = matchDB.player2
            this.adversary = matchDB.player1
        }

        this.card = cards(this);
        this.adversaryCards = cards(this)

        this.gameover = true

        this.phase = '1'
        this.roundNumber = 1
        this.invisible = 0.3
        this.activeCards = []
        this.attackFieldCards = []
        this.youAttackCards = {}
        this.adversaryAttackCards = adversaryCardsAttack
        this.adversaryAttackCardsList = []
        this.adversaryActiveCards = []

        const config = new Botao(this, 50, 60, 'config', () => {
            sendSocket('disconnect_room', matchDB.id)

        }, 0xffff00, soundfx.closeSound);
        config.setScale(0.8)
        config.setDepth(50)




        this.myDeck = []
        for (let i = 0; i < this.you.deck.length; i++) {
            this.myDeck.push(this.card[this.you.deck[i]])
        }


        this.yourArena = this.add.image(centerX, centerY, this.you.arena);
        this.yourArena.setScale(0.5)


        this.yourIcon = this.add.image(110, 678, this.you.icon);
        this.yourIcon.setScale(0.4)
        this.yourNickname = this.add.text(110, 748, this.you.nickname,
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
        yourFirsDeckCard.setScale(0.2)




        this.adversaryArena = this.add.image(centerX, centerY, this.adversary.arena);
        this.adversaryArena.setScale(0.5)
        this.adversaryArena.angle = 180

        this.adversaryIcon = this.add.image(1390, 90, this.adversary.icon);
        this.adversaryIcon.setScale(0.4)

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
        enemyFirsDeckCard.setScale(0.2)
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







        var text = this.add.text(centerX, 50, 'Coordenadas: X: 0 Y: 0', { fontSize: '20px', fill: '#fff' });
        text.setOrigin(0.5, 0.5)

        this.input.on('pointermove', function (pointer) {
            text.setText('Coordenadas: X: ' + pointer.x + ' Y: ' + pointer.y);
        });




        //Apresentaçao das suas 4 cartas 
        this.myHand = [
            this.myDeck[0],
            this.myDeck[1],
            this.myDeck[2],
            this.myDeck[3],
        ]

        this.myDeck.splice(0, 4)

        this.startHand()

        this.rightHandHitBox = this.add.rectangle(1280, 685, 420, 180, 0x000080)
        this.rightHandHitBox.alpha = this.invisible
        this.rightHandHitBox.depth = 13

        this.rightHandHitBox.on('pointerdown', (pointer, localx, localy, event) => {
            this.HandOrganization()
            this.rightHandHitBox.disableInteractive()
            this.cancelHand.setInteractive()
        }
        )

        this.cancelHand = this.add.rectangle(centerX, centerY, 1500, 768, 0x8B0000)
        this.cancelHand.alpha = this.invisible
        this.cancelHand.depth = 1

        this.cancelHand.on('pointerdown', (pointer, localx, localy, event) => {
            this.rightHandOrganization()
        }
        )


        this.arenaHitBox = this.add.rectangle(centerX, centerY, 900, 380, 0x8B0000)
        this.arenaHitBox.alpha = this.invisible
        this.arenaHitBox.depth = 91


    }



    update() {
        if (this.masterButton.im === 'ready' && adversaryReady) {
            console.log('os dois tao prontos')
            this.masterButton.im = ''
            setAdversaryReady('')
            this.waitingAdversary.text = ''
            this.afterReady()



            this.time.addEvent({
                delay: 600,
                callback: () => {
                    this.round(this.roundNumber)

                },
                callbackScope: this,
                loop: false,
            });


            this.time.addEvent({
                delay: 6500,
                callback: () => {
                    this.rightHandHitBox.setInteractive({ cursor: 'pointer' })
                },
                callbackScope: this,

            });

        }
        if (this.masterButton.im === 'ready' && adversaryReady === '') {
            this.waitingAdversary.text = 'Aguardando adversário...'
        }

        if (updateMatch) {
            updateMatchValue(false)
            if (matchDB.phase != 4) {

                this.turnMessages()
                if (this.you.turn) {
                    this.masterButton.setMode('pass')
                } else {
                    this.masterButton.setMode('wait')
                }

            }
            if (matchDB.phase == 3) {
                this.blockMode = true
            }

            if (matchDB.phase == 4) {


                let youResolve = this.youAttackCards
                let adversaryResolve = adversaryCardsAttack
                this.masterButton.powerOFF()
                this.masterButton.write = ''


                this.adversaryAttackCards = adversaryCardsAttack

                console.log(youResolve, this.youAttackCards)
                console.log(adversaryResolve, adversaryCardsAttack)


                updatePhase(0)




                if (player.nickname === matchDB.player1.nickname) {
                    sendSocket('resolve', {
                        'match': matchDB,
                        'player1': youResolve,
                        'player2': adversaryResolve
                    })

                } else if (player.nickname === matchDB.player2.nickname) {
                    sendSocket('resolve', {
                        'match': matchDB,
                        'player2': youResolve,
                        'player1': adversaryResolve
                    })



                }






            }


        }
        if (roundUpdate) {
            setRound(false)
            this.youAttackCards = {}

            this.cardAttackfieldAnimation(true)


            this.attackFieldCards = []

            this.adversaryCardAttackfieldAnimation(true)
            this.adversaryAttackCardsList = []



            if (this.you.hp <= 0) {
                this.yourHP.text = 0

                this.gameover = false

                this.time.addEvent({
                    delay: 1500,
                    callback: () => {

                        this.gameOver(false)
                    },
                    callbackScope: this,
                    loop: false,
                });

            } else if (this.adversary.hp <= 0) {
                this.adversaryHP.text = 0

                this.gameover = false

                this.time.addEvent({
                    delay: 1500,
                    callback: () => {

                        this.gameOver(true)
                    },
                    callbackScope: this,
                    loop: false,
                });
            }



            if (this.gameover) {
                this.roundNumber = this.roundNumber + 1
                this.time.addEvent({
                    delay: 4000,
                    callback: () => {

                        this.round(this.roundNumber)

                    },
                    callbackScope: this,
                    loop: false,
                });
            }



        }



        this.buttonText.text = this.masterButton.write

        if (player.nickname === matchDB.player1.nickname) {
            this.you = matchDB.player1
            this.adversary = matchDB.player2
        } else if (player.nickname === matchDB.player2.nickname) {
            this.you = matchDB.player2
            this.adversary = matchDB.player1
        }

        this.yourHP.text = this.you.hp
        this.adversaryHP.text = this.adversary.hp

        this.yourEnergy.text = this.you.energy
        this.adversaryEnergy.text = this.adversary.energy



        //lida quando o adversario coloca uma carta em campo
        if (cardOnField) {

            setCardOnField(false)

            // this.adversaryActiveCards = [] // achei o problema
            //talvez tenha que ferificar se a carta ja esta dentro pra fazer o for
            for (let i = 0; i < adversaryCardsOnField.length; i++) {
                if (this.adversaryActiveCards.includes(this.adversaryCards[adversaryCardsOnField[i]]) == false) {

                    this.adversaryActiveCards.push(this.adversaryCards[adversaryCardsOnField[i]])
                }
            }
            console.log('as cartas do adversario em campo sao', this.adversaryActiveCards)
            this.cardOnfieldAdversaryAnimation()
        }


        //lida quando o adversario coloca carta em modo de ataque
        if (cardAtackkMode) {
            setCardAttackMode(false)
            this.adversaryAttackCards = adversaryCardsAttack

            //passar por todas as cartas e tranformar elas em adversarycards
            this.adversaryAttackCardsList = []

            for (var chave in this.adversaryAttackCards) {

                if (this.adversaryAttackCards.hasOwnProperty(chave)) {

                    this.adversaryAttackCardsList.push(
                        this.adversaryCards[this.adversaryAttackCards[chave]['ID']]
                    )

                    console.log('adicionei na lista o', this.adversaryAttackCards[chave]['ID'])
                    this.chave = chave

                    const indice = this.adversaryActiveCards.indexOf(
                        this.adversaryCards[this.adversaryAttackCards[this.chave]['ID']]
                    );

                    console.log('indice', indice, this.adversaryActiveCards.includes(
                        this.adversaryCards[this.adversaryAttackCards[this.chave]['ID']]))

                    const indiceCliente = adversaryCardsOnField.indexOf(
                        this.adversaryAttackCards[this.chave]['ID']
                    );
                    console.log('essa Lista', this.adversaryActiveCards)
                    console.log('esse elemento:', this.adversaryAttackCards[this.chave]['ID'])
                    if (indice !== -1) {
                        this.adversaryActiveCards.splice(indice, 1);
                        setAdversaryCardsOnField(indiceCliente)

                    } else {
                        console.log("Elemento não encontrado na lista");
                    }


                }


            }

            this.adversaryCardAttackfieldAnimation()

            this.cardOnfieldAdversaryAnimation()

        }

        if (damageUpdate) {


            damageUpdateF(false)
            if (damage >= 0) {

                this.blockMessage = this.add.text(centerX, centerY + -110, 'Dano Bloqueado!',
                    {
                        fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                        fontStyle: 'bold', fill: '#00bfff'
                    })

                this.blockMessage.setShadow(2, 2, '#000', 2, false, true);
                this.blockMessage.alpha = 0;
                this.blockMessage.setOrigin(0.5, 0.5)



                this.damageAnimation = this.tweens.add({
                    targets: this.blockMessage,
                    depth: 90,
                    alpha: 1,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.blockMessage,
                            delay: 1000,
                            alpha: 0,
                            duration: 500,
                            ease: 'Linear',


                        })
                    },
                })
            }
            else if (this.you.turn) {
                //quando chega nisso aqui ja nao é mais seu turno ent mostra o dano no lugar certo
                this.damageMessage = this.add.text(290, centerY + 85, damage,
                    {
                        fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                        fontStyle: 'bold', fill: '#ff0000'
                    })

                this.damageMessage.setShadow(2, 2, '#000', 2, false, true);
                this.damageMessage.alpha = 0;
                this.damageMessage.setOrigin(0.5, 0.5)



                this.damageAnimation = this.tweens.add({
                    targets: this.damageMessage,
                    depth: 90,
                    alpha: 1,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.damageMessage,
                            delay: 1000,
                            alpha: 0,
                            duration: 500,
                            ease: 'Linear',


                        })
                    },
                })
            }
            else {

                this.damageMessage2 = this.add.text(290, centerY - 85, damage,
                    {
                        fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                        fontStyle: 'bold', fill: '#ff0000'
                    })

                this.damageMessage2.setShadow(2, 2, '#000', 2, false, true);
                this.damageMessage2.alpha = 0;
                this.damageMessage2.setOrigin(0.5, 0.5)



                this.damageAnimation2 = this.tweens.add({
                    targets: this.damageMessage2,
                    depth: 90,
                    alpha: 1,
                    duration: 200,
                    ease: 'Linear',
                    onComplete: () => {
                        this.tweens.add({
                            targets: this.damageMessage2,
                            delay: 1000,
                            alpha: 0,
                            duration: 500,
                            ease: 'Linear',


                        })
                    },
                })

            }

        }






    }


    gameOver(victory) {
        if (victory) {
            //envia pro servidor que voce venceu
            sendSocket('gameWinner')
            sendSocket('add_experience', 100 + 50 * parseInt(player.level))
            //começa animaçao da tela de vitoria
            const victory_screen = this.add.image(centerX, centerY, 'victory_background')
            victory_screen.alpha = 0
            victory_screen.scale = 2
            victory_screen.setInteractive()

            const victory_text = this.add.image(centerX, centerY - 80, 'victory_text')
            victory_text.alpha = 0
            victory_text.scale = 0

            this.gameOverAnimation = this.tweens.add({
                targets: victory_screen,
                depth: 90,
                alpha: 1,
                duration: 1500,
                scale: 1,
                ease: 'Linear',
                onComplete: () => {
                    this.tweens.add({
                        targets: victory_text,
                        depth: 91,
                        alpha: 1,
                        duration: 500,
                        scale: 0.3,
                        ease: 'Linear',
                        onComplete: () => {
                            sendSocket('update_data')

                            const crystals = this.add.image(centerX - 120, centerY + 80, 'crystals')
                            const crownPoints = this.add.image(centerX + 80, centerY + 78, 'crown_points')
                            crystals.alpha = 0
                            crownPoints.alpha = 0

                            const continue_button = new Botao(this, centerX, 600, 'start_button', () => {

                                switchScenes('HomeScreen', 'DumArena');
                            }, 0xffff00,);
                            continue_button.alpha = 0

                            crystals.scale = 0.8
                            crownPoints.scale = 0.8
                            continue_button.scale = 0.5


                            this.crystals_text = this.add.text(centerX - 80, centerY + 80, '+50',
                                {
                                    fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                                    fontStyle: 'bold', fill: '#fff'
                                })

                            this.crystals_text.setShadow(2, 2, '#000', 2, false, true);
                            this.crystals_text.alpha = 0;
                            this.crystals_text.setOrigin(0.5, 0.5)

                            this.crownP_text = this.add.text(centerX + 125, centerY + 80, '+1',
                                {
                                    fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                                    fontStyle: 'bold', fill: '#fff'
                                })

                            this.crownP_text.setShadow(2, 2, '#000', 2, false, true);
                            this.crownP_text.alpha = 0;
                            this.crownP_text.setOrigin(0.5, 0.5)


                            this.tweens.add({
                                targets: [crystals, crownPoints, continue_button, this.crystals_text, this.crownP_text],
                                depth: 91,
                                alpha: 1,
                                duration: 500,
                                ease: 'Linear',
                            })

                        },
                    })
                },
            })



        }
        else {
            //envia pro servidor que voce venceu
            sendSocket('gameLoser')
            sendSocket('add_experience', 45 * parseInt(player.level))
            //começa animaçao da tela de vitoria
            const loss_screen = this.add.image(centerX, centerY, 'loss_background')
            loss_screen.alpha = 0
            loss_screen.scale = 2
            loss_screen.setInteractive()

            const loss_text = this.add.image(centerX, centerY - 80, 'loss_text')
            loss_text.alpha = 0
            loss_text.scale = 0

            this.gameOverAnimation = this.tweens.add({
                targets: loss_screen,
                depth: 90,
                alpha: 1,
                duration: 1500,
                scale: 1,
                ease: 'Linear',
                onComplete: () => {
                    this.tweens.add({
                        targets: loss_text,
                        depth: 91,
                        alpha: 1,
                        duration: 500,
                        scale: 0.3,
                        ease: 'Linear',
                        onComplete: () => {
                            sendSocket('update_data')

                            const crystals = this.add.image(centerX - 120, centerY + 80, 'crystals')
                            const crownPoints = this.add.image(centerX + 80, centerY + 78, 'crown_points')
                            crystals.alpha = 0
                            crownPoints.alpha = 0

                            const continue_button = new Botao(this, centerX, 600, 'start_button', () => {

                                switchScenes('HomeScreen', 'DumArena');
                            }, 0xffff00,);
                            continue_button.alpha = 0

                            crystals.scale = 0.8
                            crownPoints.scale = 0.8
                            continue_button.scale = 0.5


                            this.crystals_text = this.add.text(centerX - 80, centerY + 80, '+15',
                                {
                                    fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                                    fontStyle: 'bold', fill: '#fff'
                                })

                            this.crystals_text.setShadow(2, 2, '#000', 2, false, true);
                            this.crystals_text.alpha = 0;
                            this.crystals_text.setOrigin(0.5, 0.5)

                            this.crownP_text = this.add.text(centerX + 125, centerY + 80, '-1',
                                {
                                    fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                                    fontStyle: 'bold', fill: '#ff0000'
                                })

                            this.crownP_text.setShadow(2, 2, '#000', 2, false, true);
                            this.crownP_text.alpha = 0;
                            this.crownP_text.setOrigin(0.5, 0.5)


                            this.tweens.add({
                                targets: [crystals, crownPoints, continue_button, this.crystals_text, this.crownP_text],
                                depth: 91,
                                alpha: 1,
                                duration: 500,
                                ease: 'Linear',
                            })


                        },
                    })
                },
            })
        }
    }



    startHand() {
        const showCard = (cardID, finalX, finalY = centerY) => {

            const verseCard = this.add.image(346 - 10, 669 - 7, 'verse_card');
            verseCard.setScale(0.2)
            this.tweens.add({
                targets: verseCard,
                x: '-=150',
                y: '-=20',
                angle: 0,
                scale: 0.23,
                depth: 90,
                duration: 300,
                ease: 'Power2',
                onComplete: () => {
                    this.tweens.add({
                        targets: verseCard,
                        x: finalX,
                        y: centerY,
                        scale: 0.27,
                        duration: 300,
                        ease: 'Linear',
                        onComplete: () => {
                            var card = cardID;
                            card.setPosition(finalX, centerY);
                            card.scaleX = 0;
                            card.scaleY = 0.27;
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
                                scaleX: 0.27,
                                delay: 100,
                                duration: 100,
                                ease: 'Linear',
                            });
                        }
                    });
                }
            });
        }

        showCard(this.myHand[0], centerX - 300);


        this.time.addEvent({
            delay: 300,
            callback: () => showCard(this.myHand[1], centerX - 100),
            callbackScope: this,
            loop: false,
        });

        this.time.addEvent({
            delay: 600,
            callback: () => showCard(this.myHand[2], centerX + 100),
            callbackScope: this,
            loop: false,
        });

        this.time.addEvent({
            delay: 900,
            callback: () => showCard(this.myHand[3], centerX + 300),
            callbackScope: this,
            loop: false,
        });

        this.time.addEvent({
            delay: 2200,
            duration: 200,
            callback: () => {
                this.masterButton.powerON();
                this.masterButton.setMode('ready')

            },
            callbackScope: this,
            loop: false,
        });
    }

    //encolhe primeiro dps ajeita, mas talvez de só pra encolher e chamar o righthandorganization
    afterReady() {

        this.tweens.add({
            targets: this.myHand[0],
            depth: 1,
            scale: 0.20,
            duration: 300,
            ease: 'Linear',

        })


        this.tweens.add({
            targets: this.myHand[1],
            depth: 2,
            scale: 0.20,
            duration: 300,
            ease: 'Linear',
        })


        this.tweens.add({
            targets: this.myHand[2],
            depth: 3,
            scale: 0.20,
            duration: 300,
            ease: 'Linear',
        })


        this.tweens.add({
            targets: this.myHand[3],
            depth: 4,
            scale: 0.20,
            duration: 300,
            ease: 'Linear',
        })

        this.rightHandOrganization()

    }

    cardAcquisition() {
        const verseCard = this.add.image(346 - 10, 669 - 7, 'verse_card');
        verseCard.setScale(0.2)

        //temporario pra nao ganhar mais cartas caso acabe
        if (this.myDeck.length < 1) {
            return false
        }
        if (this.myHand.length == 7) {
            return false
        }


        this.tweens.add({
            targets: verseCard,
            x: '-=150',
            y: '-=20',
            angle: 0,
            scale: 0.4,
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
                        card.scaleY = 0.4;
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
                            scaleX: 0.4,
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
                this.rightHandOrganization()
            },
            callbackScope: this,
        });

    }

    rightHandOrganization(delCard = '') {

        this.rightHandHitBox.setInteractive({ cursor: 'pointer' })
        this.cancelHand.disableInteractive()

        if (this.cardAnimation) {
            this.cardAnimation.stop()
        }
        if (this.finishCardAnimation) {

            this.finishCardAnimation.stop()
        }


        if (this.hitFirstCard) {

            this.hitFirstCard.destroy()
        }
        if (this.hitSecondCard) {
            this.hitSecondCard.destroy()
        }
        if (this.hitThirdCard) {
            this.hitThirdCard.destroy()
        }
        if (this.hitFourthCard) {
            this.hitFourthCard.destroy()
        }
        if (this.hitFifthCard) {
            this.hitFifthCard.destroy()
        }

        if (this.hitSixthCard) {
            this.hitSixthCard.destroy()
        }
        if (this.hitSeventhCard) {
            this.hitSeventhCard.destroy()
        }


        if (this.card1) {
            this.card1.stop()
        }
        if (this.card2) {
            this.card2.stop()
        }
        if (this.card3) {
            this.card3.stop()
        }
        if (this.card4) {
            this.card4.stop()
        }
        if (this.card5) {
            this.card5.stop()
        }
        if (this.card6) {
            this.card6.stop()
        }
        if (this.card7) {
            this.card7.stop()
        }

        disabledHandAnimation(this, this.myHand)

    }

    round(number) {
        this.masterButton.setMode('wait')

        this.roundText = this.add.text(centerX, centerY, 'RODADA ' + number,
            {
                fontSize: '100px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#ffd700'
            })
        this.roundText.setOrigin(0.5, 0.5)
        this.roundText.alpha = 0;
        this.roundText.setShadow(2, 2, '#000', 2, false, true);


        this.roundTextAnimation = this.tweens.add({
            targets: this.roundText,
            depth: 90,
            alpha: 1,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                this.tweens.add({
                    targets: this.roundText,
                    delay: 2000,
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',
                    onComplete: () => {
                        this.time.addEvent({
                            delay: 1400,
                            callback: () => {
                                this.turnMessages()
                                if (this.you.turn) {
                                    this.masterButton.setMode('pass')
                                } else {
                                    this.masterButton.setMode('wait')
                                }
                                this.cardAcquisition()

                                matchDB.player1.energy = parseInt(matchDB.player1.energy + this.roundNumber)
                                if (matchDB.player1.energy > 10) {
                                    matchDB.player1.energy = 10
                                }



                                matchDB.player2.energy = parseInt(matchDB.player2.energy + this.roundNumber)
                                if (matchDB.player2.energy > 10) {
                                    matchDB.player2.energy = 10
                                }

                                sendSocket('match_update', matchDB)
                            },
                            callbackScope: this,

                        });

                    }
                })
            },
        })




    }

    turnMessages() {
        this.turnMessage = this.add.text(centerX, 140, '',
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            })
        this.turnMessage.setShadow(2, 2, '#000', 2, false, true);
        this.turnMessage.alpha = 0;
        this.turnMessage.setOrigin(0.5, 0.5)

        if (this.you.turn) {
            this.turnMessage.text = 'Sua vez'
        }
        else {
            this.turnMessage.text = 'vez do oponente'
        }


        this.turnAnimation = this.tweens.add({
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


    HandOrganization() {

        if (this.hitFirstCard) {
            this.hitFirstCard.destroy()
        }

        if (this.hitSecondCard) {
            this.hitSecondCard.destroy()
        }

        if (this.hitThirdCard) {
            this.hitThirdCard.destroy()
        }

        if (this.hitFourthCard) {
            this.hitFourthCard.destroy()
        }

        if (this.hitFifthCard) {
            this.hitFifthCard.destroy()
        }

        if (this.hitSixthCard) {
            this.hitSixthCard.destroy()
        }
        if (this.hitSeventhCard) {
            this.hitSeventhCard.destroy()
        }

        if (this.myHand.length == 1) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: 0,
                x: centerX,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX, 680, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = 0
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })
        }

        if (this.myHand.length == 2) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: -3,
                x: centerX - 60,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX - 60, 680, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = -3
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })

            this.card2 = this.tweens.add({
                targets: this.myHand[1],
                depth: 3,
                angle: 3,
                x: centerX + 60,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSecondCard = this.add.rectangle(centerX + 60, 680, 656, 965, 0x000080);
                    this.hitSecondCard.alpha = this.invisible
                    this.hitSecondCard.angle = 3
                    this.hitSecondCard.setDepth(this.myHand[1].depth + 1)
                    this.hitSecondCard.setScale(0.25)
                    this.hitSecondCard.setInteractive();

                    this.HandCardAnimation(this.myHand[1], this.hitSecondCard)

                }
            })
        }

        if (this.myHand.length == 3) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: -3,
                x: centerX - 120,
                y: 685,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX - 120, 685, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = -3
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })

            this.card2 = this.tweens.add({
                targets: this.myHand[1],
                depth: 3,
                angle: 0,
                x: centerX,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSecondCard = this.add.rectangle(centerX, 680, 656, 965, 0x000080);
                    this.hitSecondCard.alpha = this.invisible
                    this.hitSecondCard.angle = 0
                    this.hitSecondCard.setDepth(this.myHand[1].depth + 1)
                    this.hitSecondCard.setScale(0.25)
                    this.hitSecondCard.setInteractive();

                    this.HandCardAnimation(this.myHand[1], this.hitSecondCard)

                }
            })

            this.card3 = this.tweens.add({
                targets: this.myHand[2],
                depth: 4,
                angle: 3,
                x: centerX + 120,
                y: 685,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitThirdCard = this.add.rectangle(centerX + 120, 685, 656, 965, 0x000080);
                    this.hitThirdCard.alpha = this.invisible
                    this.hitThirdCard.angle = 3
                    this.hitThirdCard.setDepth(this.myHand[2].depth + 1)
                    this.hitThirdCard.setScale(0.25)
                    this.hitThirdCard.setInteractive();
                    this.HandCardAnimation(this.myHand[2], this.hitThirdCard)
                }
            })
        }

        if (this.myHand.length == 4) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: -6,
                x: centerX - 180,
                y: 690,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX - 180, 690, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = -6
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })

            this.card2 = this.tweens.add({
                targets: this.myHand[1],
                depth: 3,
                angle: -3,
                x: centerX - 70,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSecondCard = this.add.rectangle(centerX - 70, 680, 656, 965, 0x000080);
                    this.hitSecondCard.alpha = this.invisible
                    this.hitSecondCard.angle = -3
                    this.hitSecondCard.setDepth(this.myHand[1].depth + 1)
                    this.hitSecondCard.setScale(0.25)
                    this.hitSecondCard.setInteractive();

                    this.HandCardAnimation(this.myHand[1], this.hitSecondCard)

                }
            })

            this.card3 = this.tweens.add({
                targets: this.myHand[2],
                depth: 4,
                angle: 3,
                x: centerX + 70,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitThirdCard = this.add.rectangle(centerX + 70, 680, 656, 965, 0x000080);
                    this.hitThirdCard.alpha = this.invisible
                    this.hitThirdCard.angle = 3
                    this.hitThirdCard.setDepth(this.myHand[2].depth + 1)
                    this.hitThirdCard.setScale(0.25)
                    this.hitThirdCard.setInteractive();
                    this.HandCardAnimation(this.myHand[2], this.hitThirdCard)
                }
            })

            this.card4 = this.tweens.add({
                targets: this.myHand[3],
                depth: 5,
                angle: 6,
                x: centerX + 180,
                y: 690,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFourthCard = this.add.rectangle(centerX + 180, 690, 656, 965, 0x000080);
                    this.hitFourthCard.alpha = this.invisible
                    this.hitFourthCard.angle = 6
                    this.hitFourthCard.setDepth(this.myHand[3].depth + 1)
                    this.hitFourthCard.setScale(0.25)
                    this.hitFourthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[3], this.hitFourthCard)
                }
            })
        }

        if (this.myHand.length == 5) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: -13,
                x: centerX - 280,
                y: 730,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX - 280, 730, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = -13
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })





            this.card2 = this.tweens.add({
                targets: this.myHand[1],
                depth: 3,
                angle: -5,
                x: centerX - 150,
                y: 690,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSecondCard = this.add.rectangle(centerX - 150, 690, 656, 965, 0x000080);
                    this.hitSecondCard.alpha = this.invisible
                    this.hitSecondCard.angle = -5
                    this.hitSecondCard.setDepth(this.myHand[1].depth + 1)
                    this.hitSecondCard.setScale(0.25)
                    this.hitSecondCard.setInteractive();

                    this.HandCardAnimation(this.myHand[1], this.hitSecondCard)

                }

            })

            this.card3 = this.tweens.add({
                targets: this.myHand[2],
                depth: 4,
                angle: 0,
                x: centerX,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitThirdCard = this.add.rectangle(centerX, 680, 656, 965, 0x000080);
                    this.hitThirdCard.alpha = this.invisible
                    this.hitThirdCard.angle = 0
                    this.hitThirdCard.setDepth(this.myHand[2].depth + 1)
                    this.hitThirdCard.setScale(0.25)
                    this.hitThirdCard.setInteractive();
                    this.HandCardAnimation(this.myHand[2], this.hitThirdCard)
                }
            })

            this.card4 = this.tweens.add({
                targets: this.myHand[3],
                depth: 5,
                angle: + 5,
                x: centerX + 150,
                y: 690,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFourthCard = this.add.rectangle(centerX + 150, 690, 656, 965, 0x000080);
                    this.hitFourthCard.alpha = this.invisible
                    this.hitFourthCard.angle = + 5
                    this.hitFourthCard.setDepth(this.myHand[3].depth + 1)
                    this.hitFourthCard.setScale(0.25)
                    this.hitFourthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[3], this.hitFourthCard)
                }
            })

            this.card5 = this.tweens.add({
                targets: this.myHand[4],
                depth: 6,
                angle: +13,
                x: centerX + 280,
                y: 730,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFifthCard = this.add.rectangle(centerX + 280, 730, 656, 965, 0x000080);
                    this.hitFifthCard.alpha = this.invisible
                    this.hitFifthCard.angle = + 13
                    this.hitFifthCard.setDepth(this.myHand[4].depth + 1)
                    this.hitFifthCard.setScale(0.25)
                    this.hitFifthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[4], this.hitFifthCard)
                }
            })
        }


        if (this.myHand.length == 6) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: -9,
                x: centerX - 270,
                y: 705,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX - 270, 705, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = -9
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })


            this.card2 = this.tweens.add({
                targets: this.myHand[1],
                depth: 3,
                angle: -6,
                x: centerX - 180,
                y: 690,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSecondCard = this.add.rectangle(centerX - 180, 690, 656, 965, 0x000080);
                    this.hitSecondCard.alpha = this.invisible
                    this.hitSecondCard.angle = -6
                    this.hitSecondCard.setDepth(this.myHand[1].depth + 1)
                    this.hitSecondCard.setScale(0.25)
                    this.hitSecondCard.setInteractive();

                    this.HandCardAnimation(this.myHand[1], this.hitSecondCard)

                }

            })

            this.card3 = this.tweens.add({
                targets: this.myHand[2],
                depth: 4,
                angle: -3,
                x: centerX - 70,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitThirdCard = this.add.rectangle(centerX - 70, 680, 656, 965, 0x000080);
                    this.hitThirdCard.alpha = this.invisible
                    this.hitThirdCard.angle = -3
                    this.hitThirdCard.setDepth(this.myHand[2].depth + 1)
                    this.hitThirdCard.setScale(0.25)
                    this.hitThirdCard.setInteractive();
                    this.HandCardAnimation(this.myHand[2], this.hitThirdCard)
                }
            })

            this.card4 = this.tweens.add({
                targets: this.myHand[3],
                depth: 5,
                angle: 3,
                x: centerX + 70,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFourthCard = this.add.rectangle(centerX + 70, 680, 656, 965, 0x000080);
                    this.hitFourthCard.alpha = this.invisible
                    this.hitFourthCard.angle = 3
                    this.hitFourthCard.setDepth(this.myHand[3].depth + 1)
                    this.hitFourthCard.setScale(0.25)
                    this.hitFourthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[3], this.hitFourthCard)
                }
            })

            this.card5 = this.tweens.add({
                targets: this.myHand[4],
                depth: 6,
                angle: 6,
                x: centerX + 180,
                y: 690,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFifthCard = this.add.rectangle(centerX + 180, 690, 656, 965, 0x000080);
                    this.hitFifthCard.alpha = this.invisible
                    this.hitFifthCard.angle = 6
                    this.hitFifthCard.setDepth(this.myHand[4].depth + 1)
                    this.hitFifthCard.setScale(0.25)
                    this.hitFifthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[4], this.hitFifthCard)
                }
            })

            this.card6 = this.tweens.add({
                targets: this.myHand[5],
                depth: 7,
                angle: 9,
                x: centerX + 270,
                y: 705,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSixthCard = this.add.rectangle(centerX + 270, 705, 656, 965, 0x000080);
                    this.hitSixthCard.alpha = this.invisible
                    this.hitSixthCard.angle = 9
                    this.hitSixthCard.setDepth(this.myHand[5].depth + 1)
                    this.hitSixthCard.setScale(0.25)
                    this.hitSixthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[5], this.hitSixthCard)
                }
            })
        }

        if (this.myHand.length == 7) {

            this.card1 = this.tweens.add({
                targets: this.myHand[0],
                depth: 2,
                angle: -9,
                x: centerX - 270,
                y: 705,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFirstCard = this.add.rectangle(centerX - 270, 705, 656, 965, 0x000080);
                    this.hitFirstCard.alpha = this.invisible
                    this.hitFirstCard.angle = -9
                    this.hitFirstCard.setDepth(this.myHand[0].depth + 1)
                    this.hitFirstCard.setScale(0.25)
                    this.hitFirstCard.setInteractive();
                    this.HandCardAnimation(this.myHand[0], this.hitFirstCard)

                }
            })


            this.card2 = this.tweens.add({
                targets: this.myHand[1],
                depth: 3,
                angle: -6,
                x: centerX - 180,
                y: 692,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSecondCard = this.add.rectangle(centerX - 180, 692, 656, 965, 0x000080);
                    this.hitSecondCard.alpha = this.invisible
                    this.hitSecondCard.angle = -6
                    this.hitSecondCard.setDepth(this.myHand[1].depth + 1)
                    this.hitSecondCard.setScale(0.25)
                    this.hitSecondCard.setInteractive();

                    this.HandCardAnimation(this.myHand[1], this.hitSecondCard)

                }

            })

            this.card3 = this.tweens.add({
                targets: this.myHand[2],
                depth: 4,
                angle: -3,
                x: centerX - 90,
                y: 683,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitThirdCard = this.add.rectangle(centerX - 90, 683, 656, 965, 0x000080);
                    this.hitThirdCard.alpha = this.invisible
                    this.hitThirdCard.angle = -3
                    this.hitThirdCard.setDepth(this.myHand[2].depth + 1)
                    this.hitThirdCard.setScale(0.25)
                    this.hitThirdCard.setInteractive();
                    this.HandCardAnimation(this.myHand[2], this.hitThirdCard)
                }
            })

            this.card4 = this.tweens.add({
                targets: this.myHand[3],
                depth: 5,
                angle: 0,
                x: centerX,
                y: 680,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFourthCard = this.add.rectangle(centerX, 680, 656, 965, 0x000080);
                    this.hitFourthCard.alpha = this.invisible
                    this.hitFourthCard.angle = 0
                    this.hitFourthCard.setDepth(this.myHand[3].depth + 1)
                    this.hitFourthCard.setScale(0.25)
                    this.hitFourthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[3], this.hitFourthCard)
                }
            })

            this.card5 = this.tweens.add({
                targets: this.myHand[4],
                depth: 6,
                angle: 3,
                x: centerX + 90,
                y: 683,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitFifthCard = this.add.rectangle(centerX + 90, 683, 656, 965, 0x000080);
                    this.hitFifthCard.alpha = this.invisible
                    this.hitFifthCard.angle = 3
                    this.hitFifthCard.setDepth(this.myHand[4].depth + 1)
                    this.hitFifthCard.setScale(0.25)
                    this.hitFifthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[4], this.hitFifthCard)
                }
            })

            this.card6 = this.tweens.add({
                targets: this.myHand[5],
                depth: 7,
                angle: 6,
                x: centerX + 180,
                y: 692,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSixthCard = this.add.rectangle(centerX + 180, 692, 656, 965, 0x000080);
                    this.hitSixthCard.alpha = this.invisible
                    this.hitSixthCard.angle = 6
                    this.hitSixthCard.setDepth(this.myHand[5].depth + 1)
                    this.hitSixthCard.setScale(0.25)
                    this.hitSixthCard.setInteractive();
                    this.HandCardAnimation(this.myHand[5], this.hitSixthCard)
                }
            })

            this.card7 = this.tweens.add({
                targets: this.myHand[6],
                depth: 8,
                angle: 9,
                x: centerX + 270,
                y: 705,
                scale: 0.25,
                duration: 300,
                ease: 'Linear',
                onComplete: () => {
                    this.hitSeventhCard = this.add.rectangle(centerX + 270, 705, 656, 965, 0x000080);
                    this.hitSeventhCard.alpha = this.invisible
                    this.hitSeventhCard.angle = 9
                    this.hitSeventhCard.setDepth(this.myHand[6].depth + 1)
                    this.hitSeventhCard.setScale(0.25)
                    this.hitSeventhCard.setInteractive();
                    this.HandCardAnimation(this.myHand[6], this.hitSeventhCard)
                }
            })
        }




    }
    HandCardAnimation(card, hitbox) {
        let startX = null
        let startY = null
        this.cardIsDragging = false;


        let thisCard = card
        let hitBoxCard = hitbox
        let startHitDepth = hitbox.depth


        hitBoxCard.on('pointerdown', (pointer, localx, localy, event) => {
            hitBoxCard.scale = 5
            hitBoxCard.depth = 90

            startX = pointer.x;
            startY = pointer.y;
            this.cardIsDragging = true;

            this.arenaPhase1(thisCard, hitBoxCard)

            this.cardAnimation = this.tweens.add({
                targets: thisCard,
                y: 458,
                angle: 0,
                scale: 0.4,
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
                scale: 0.25,
                depth: hitBoxCard.depth - 1,
                duration: 500,
                ease: 'Power2',

            })
            hitBoxCard.scale = 0.25
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
                    thisCard.scale = 0.25
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


            if (matchDB.phase >= 2) {
                message = 'Não é possivel adiconar cartas nessa fase'
                this.HandOrganization()
                this.arenaHitBox.removeAllListeners();
                this.cardIsDragging = false
                hitbox.scale = 0.25

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



            if (this.activeCards.length == 3) {


                message = 'Maximo de cartas em campo atingido'
                this.HandOrganization()
                this.arenaHitBox.removeAllListeners();
                this.cardIsDragging = false
                hitbox.scale = 0.25

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

            if (this.you.turn) {


                if (parseInt(this.you.energy) >= cardInfo.energy) {

                    if (player.nickname === matchDB.player1.nickname) {
                        matchDB.player1.energy = this.you.energy - cardInfo.energy

                    } else if (player.nickname === matchDB.player2.nickname) {
                        matchDB.player2.energy = this.you.energy - cardInfo.energy
                    }




                    sendSocket('match_update', matchDB)

                    card.scale = 0.18

                    const indice = this.myHand.indexOf(card);

                    if (indice !== -1) {
                        this.myHand.splice(indice, 1);

                    } else {
                        console.log("Elemento não encontrado na lista");
                    }

                    this.HandOrganization()
                    this.arenaHitBox.disableInteractive()



                    if (this.activeCards.length < 3) {

                        this.activeCards.push(card)
                        sendSocket('arena_update', [matchDB.id, cardInfo.id])

                        this.cardOnfieldAnimation()
                    }



                } else {
                    message = 'Energia Insuficiente!'
                    this.HandOrganization()
                    this.arenaHitBox.removeAllListeners();
                    this.cardIsDragging = false
                    hitbox.scale = 0.25

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
            else {
                message = 'vez do oponente, aguarde!'
                this.HandOrganization()
                this.arenaHitBox.removeAllListeners();
                this.cardIsDragging = false
                hitbox.scale = 0.25

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
            hitBoxCard.scale = 5
            hitBoxCard.depth = 90

            startX = pointer.x;
            startY = pointer.y;
            this.cardIsDragging = true;

            this.arenaPhase2(thisCard, hitBoxCard)

            this.cardAnimation = this.tweens.add({
                targets: thisCard,
                y: 458,
                angle: 0,
                scale: 0.3,
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
                scale: 0.14,
                depth: hitBoxCard.depth - 1,
                duration: 500,
                ease: 'Power2',

            })
            hitBoxCard.scale = 0.14

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
                    thisCard.scale = 0.14
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

            if (matchDB.phase == 2 && this.you.turn) {
                hitbox.destroy()
                this.cardAnimation.stop()
                if (this.attackFieldCards.length < 3) {

                    const indice = this.activeCards.indexOf(card);

                    if (indice !== -1) {
                        this.activeCards.splice(indice, 1);

                    } else {
                        console.log("Elemento não encontrado na lista");
                    }


                    this.cardOnfieldAnimation()

                    this.cardIsDragging = false

                    this.youAttackCards[this.attackFieldCards.length] = {
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }
                    this.attackFieldCards.push(card)

                    sendSocket('arena_updateATK', [matchDB.id, this.youAttackCards])
                    this.cardAttackfieldAnimation()
                    this.arenaHitBox.disableInteractive()

                }

            } else if (matchDB.phase == 3 && this.you.turn) {
                if (this.adversaryAttackCardsList.length == this.attackFieldCards.length) {
                    this.cardOnfieldAnimation()
                    return false
                }
                hitbox.destroy()
                this.cardAnimation.stop()
                if (this.attackFieldCards.length < 3) {

                    const indice = this.activeCards.indexOf(card);

                    if (indice !== -1) {
                        this.activeCards.splice(indice, 1);

                    } else {
                        console.log("Elemento não encontrado na lista");
                    }


                    this.cardOnfieldAnimation()

                    this.cardIsDragging = false
                    this.attackFieldCards.push(card)
                    this.youAttackCards[this.attackFieldCards.length] = {
                        ID: cardInfo.id,
                        ATK: cardInfo.attack,
                        DEF: cardInfo.defense,
                    }

                    sendSocket('arena_updateATK', [matchDB.id, this.youAttackCards])
                    this.cardAttackfieldAnimation()
                    this.arenaHitBox.disableInteractive()

                }

            } else {
                this.cardOnfieldAnimation()
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

    cardOnfieldAnimation() {

        if (this.firstFieldCard) {
            this.firstFieldCard.destroy()
        }
        if (this.secondFieldCard) {
            this.secondFieldCard.destroy()
        }
        if (this.thirdFieldCard) {
            this.thirdFieldCard.destroy()
        }




        if (this.activeCards.length == 1) {

            this.tweens.add({
                targets: this.activeCards[0],
                scale: 0.14,
                depth: 1,
                x: centerX,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.firstFieldCard = this.add.rectangle(centerX, 668, 656, 965, 0x000080);
                    this.firstFieldCard.alpha = this.invisible
                    this.firstFieldCard.angle = 0
                    this.firstFieldCard.setDepth(this.activeCards[0].depth + 1)
                    this.firstFieldCard.setScale(0.14)
                    this.firstFieldCard.setInteractive()
                    this.fieldCardAnimation(this.activeCards[0], this.firstFieldCard)
                },

            })
        }

        if (this.activeCards.length == 2) {

            this.tweens.add({
                targets: this.activeCards[0],
                scale: 0.14,
                depth: 1,
                x: centerX - 55,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.firstFieldCard = this.add.rectangle(centerX - 55, 668, 656, 965, 0x000080);
                    this.firstFieldCard.alpha = this.invisible
                    this.firstFieldCard.angle = 0
                    this.firstFieldCard.setDepth(this.activeCards[0].depth + 1)
                    this.firstFieldCard.setScale(0.14)
                    this.firstFieldCard.setInteractive()
                    this.fieldCardAnimation(this.activeCards[0], this.firstFieldCard)
                },


            })

            this.tweens.add({
                targets: this.activeCards[1],
                scale: 0.14,
                depth: 1,
                x: centerX + 55,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.secondFieldCard = this.add.rectangle(centerX + 55, 668, 656, 965, 0x000080);
                    this.secondFieldCard.alpha = this.invisible
                    this.secondFieldCard.angle = 0
                    this.secondFieldCard.setDepth(this.activeCards[1].depth + 1)
                    this.secondFieldCard.setScale(0.14)
                    this.secondFieldCard.setInteractive()
                    this.fieldCardAnimation(this.activeCards[1], this.secondFieldCard)
                },


            })
        }

        if (this.activeCards.length == 3) {

            this.tweens.add({
                targets: this.activeCards[0],
                scale: 0.14,
                depth: 1,
                x: centerX - 105,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.firstFieldCard = this.add.rectangle(centerX - 105, 668, 656, 965, 0x000080);
                    this.firstFieldCard.alpha = this.invisible
                    this.firstFieldCard.angle = 0
                    this.firstFieldCard.setDepth(this.activeCards[0].depth + 1)
                    this.firstFieldCard.setScale(0.14)
                    this.firstFieldCard.setInteractive()
                    this.fieldCardAnimation(this.activeCards[0], this.firstFieldCard)
                },


            })

            this.tweens.add({
                targets: this.activeCards[1],
                scale: 0.14,
                depth: 1,
                x: centerX,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.secondFieldCard = this.add.rectangle(centerX, 668, 656, 965, 0x000080);
                    this.secondFieldCard.alpha = this.invisible
                    this.secondFieldCard.angle = 0
                    this.secondFieldCard.setDepth(this.activeCards[1].depth + 1)
                    this.secondFieldCard.setScale(0.14)
                    this.secondFieldCard.setInteractive()
                    this.fieldCardAnimation(this.activeCards[1], this.secondFieldCard)
                },

            })

            this.tweens.add({
                targets: this.activeCards[2],
                scale: 0.14,
                depth: 1,
                x: centerX + 105,
                y: 668,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    this.thirdFieldCard = this.add.rectangle(centerX + 105, 668, 656, 965, 0x000080);
                    this.thirdFieldCard.alpha = this.invisible
                    this.thirdFieldCard.angle = 0
                    this.thirdFieldCard.setDepth(this.activeCards[2].depth + 1)
                    this.thirdFieldCard.setScale(0.14)
                    this.thirdFieldCard.setInteractive()
                    this.fieldCardAnimation(this.activeCards[2], this.thirdFieldCard)
                },

            })
        }

    }



    cardOnfieldAdversaryAnimation() {


        console.log('cartas que tao no field adiversario', this.adversaryActiveCards)

        if (this.adversaryActiveCards.length == 1) {
            console.log('entrou no 1')
            this.adversaryActiveCards[0].setPosition(1180, 110)
            this.tweens.add({
                targets: this.adversaryActiveCards[0],
                scale: 0.14,
                depth: 1,
                x: centerX,
                y: 100,
                duration: 500,
                ease: 'Linear',

            })
        }

        if (this.adversaryActiveCards.length == 2) {
            console.log('entrou no 2')
            this.adversaryActiveCards[1].setPosition(1180, 110)
            this.tweens.add({
                targets: this.adversaryActiveCards[0],
                scale: 0.14,
                depth: 1,
                x: centerX - 55,
                y: 100,
                duration: 500,
                ease: 'Linear',

            })

            this.tweens.add({
                targets: this.adversaryActiveCards[1],
                scale: 0.14,
                depth: 1,
                x: centerX + 55,
                y: 100,
                duration: 500,
                ease: 'Linear',

            })
        }

        if (this.adversaryActiveCards.length == 3) {
            console.log('entrou no 3')
            this.adversaryActiveCards[2].setPosition(1180, 110)

            this.tweens.add({
                targets: this.adversaryActiveCards[0],
                scale: 0.14,
                depth: 1,
                x: centerX - 105,
                y: 100,
                duration: 500,
                ease: 'Linear',

            })

            this.tweens.add({
                targets: this.adversaryActiveCards[1],
                scale: 0.14,
                depth: 1,
                x: centerX,
                y: 100,
                duration: 500,
                ease: 'Linear',

            })

            this.tweens.add({
                targets: this.adversaryActiveCards[2],
                scale: 0.14,
                depth: 1,
                x: centerX + 105,
                y: 100,
                duration: 500,
                ease: 'Linear',

            })
        }



    }



    cardAttackfieldAnimation(destroy = false) {

        if (this.firstAttackField) {
            this.firstAttackField.destroy()
        }
        if (this.secondAttackField) {
            this.secondAttackField.destroy()
        }
        if (this.thirdAttackField) {
            this.thirdAttackField.destroy()
        }




        if (this.attackFieldCards.length == 1) {

            this.tweens.add({
                targets: this.attackFieldCards[0],
                scale: 0.19,
                depth: 1,
                x: centerX,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
            if (destroy) {
                this.tweens.add({
                    targets: this.attackFieldCards[0],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })

            }
        }

        if (this.attackFieldCards.length == 2) {

            this.tweens.add({
                targets: this.attackFieldCards[0],
                scale: 0.19,
                depth: 1,
                x: centerX - 70,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },


            })

            this.tweens.add({
                targets: this.attackFieldCards[1],
                scale: 0.19,
                depth: 1,
                x: centerX + 70,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },


            })
            if (destroy) {
                this.tweens.add({
                    targets: this.attackFieldCards[0],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
                this.tweens.add({
                    targets: this.attackFieldCards[1],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })

            }
        }

        if (this.attackFieldCards.length == 3) {

            this.tweens.add({
                targets: this.attackFieldCards[0],
                scale: 0.19,
                depth: 1,
                x: centerX - 135,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },


            })

            this.tweens.add({
                targets: this.attackFieldCards[1],
                scale: 0.19,
                depth: 1,
                x: centerX,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },

            })

            this.tweens.add({
                targets: this.attackFieldCards[2],
                scale: 0.19,
                depth: 1,
                x: centerX + 135,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })

            if (destroy) {
                this.tweens.add({
                    targets: this.attackFieldCards[0],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
                this.tweens.add({
                    targets: this.attackFieldCards[1],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
                this.tweens.add({
                    targets: this.attackFieldCards[2],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
            }
        }

    }

    adversaryCardAttackfieldAnimation(destroy = false) {

        if (this.adversaryAttackCardsList.length == 1) {

            this.tweens.add({
                targets: this.adversaryAttackCardsList[0],
                scale: 0.19,
                depth: 1,
                x: centerX,
                y: 280,
                duration: 500,
                ease: 'Linear',

            })

            if (destroy) {
                this.tweens.add({
                    targets: this.adversaryAttackCardsList[0],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
            }
        }

        if (this.adversaryAttackCardsList.length == 2) {

            this.tweens.add({
                targets: this.adversaryAttackCardsList[0],
                scale: 0.19,
                depth: 1,
                x: centerX - 70,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },


            })

            this.tweens.add({
                targets: this.adversaryAttackCardsList[1],
                scale: 0.19,
                depth: 1,
                x: centerX + 70,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },

            })

            if (destroy) {
                this.tweens.add({
                    targets: this.adversaryAttackCardsList[0],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
                this.tweens.add({
                    targets: this.adversaryAttackCardsList[1],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
            }
        }

        if (this.adversaryAttackCardsList.length == 3) {

            this.tweens.add({
                targets: this.adversaryAttackCardsList[0],
                scale: 0.19,
                depth: 1,
                x: centerX - 135,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },


            })

            this.tweens.add({
                targets: this.adversaryAttackCardsList[1],
                scale: 0.19,
                depth: 1,
                x: centerX,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {


                },

            })

            this.tweens.add({
                targets: this.adversaryAttackCardsList[2],
                scale: 0.19,
                depth: 1,
                x: centerX + 135,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
            if (destroy) {
                this.tweens.add({
                    targets: this.adversaryAttackCardsList[0],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
                this.tweens.add({
                    targets: this.adversaryAttackCardsList[1],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
                this.tweens.add({
                    targets: this.adversaryAttackCardsList[2],
                    alpha: 0,
                    duration: 500,
                    ease: 'Linear',

                })
            }
        }

    }

}