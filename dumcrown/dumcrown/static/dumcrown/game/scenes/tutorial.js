
import { crashSwords } from '../animations/scripts/attackingSwords.js';
import { simpleTextTweens, simpleTweens } from '../animations/scripts/functions.js';
import { unitCardObject } from '../cards/base.js';
import { createPlayerCards, idCleaner } from '../cards/functions.js';
import { player, nicknameDenied, setNicknameDenied, nickServerMsg, cardsDATA } from '../client/client.js';
import { GAME, PATH, centerX, centerY } from '../config/gameConfig.js';
import { Button } from '../functions/buttons.js';
import { showCoordinates, sleep } from '../functions/functions.js';
import { sendSocket } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { MatchButton } from '../match_objects/button.js';
import { MatchHand } from '../match_objects/hand.js';
import { InitialDrawManager } from '../match_objects/initialDrawManager.js';
import { clearCardsToSwap } from '../match_objects/swapButton.js';
import { sfx } from '../soundfx/sounds.js';



export class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    create() {
        this.activeDialogue = false
        this.offensivePlayer = 1
        this.createScene()
        this.getPhrases()
        this.speedMultiplier = 1; // Muda esse valor para alterar a velocidade global

    }
    get speedMultiplier() {
        return this.speedMultiplier
    }

    set speedMultiplier(value) {
        this.SPEED_MULTIPLIER = value;
        this.DM = value;
        this.time.timeScale = value;
        this.sound.rate = value;
        this.anims.globalTimeScale = value;
    }
    getPhrases() {
        fetch(PATH + 'lang/tutorial.json')
            .then(response => response.json())
            .then(data => {
                this.pIndex = 1
                this.tutorialPhrases = data

            })
            .catch(error => console.error('Erro ao carregar JSON:', error));

    }
    createScene() {
        this.createBoard()
        this.createButton()
        this.createIcons()
        this.createDecks()
        this.createHp()
        this.createEnergy()
        this.instantiateCards()
        this.createPlayerHand()
        this.startAnimation()
        this.events.on('cardDropped', (cardObj) => {
            this.cardDropped(cardObj)
        });
        this.events.on('hideHand', (cardObj) => {
            this.hideHand(cardObj)
        });
        this.events.on('showHand', (cardObj) => {
            this.showHand(cardObj)
        });
    }
    startAnimation() {
        const camera = this.cameras.main;
        camera.setZoom(2);
        camera.setAlpha(0)

        this.tweens.add({
            targets: camera,
            alpha: 1,
            duration: 10, //1300
            ease: 'Power2',
        });
        this.tweens.add({
            targets: camera,
            zoom: 1,
            duration: 10,//3000
            ease: 'Power2',
            onComplete: () => {
                GAME.scene.stop('HomeScene')
                this.createBlur(true)
            }
        });
    }
    createBlur(initial = false) {

        this.blackBlur = this.make.graphics({ x: 0, y: 0, add: true });
        this.blackBlur.fillStyle(0x000000, 0.7);
        this.blackBlur.fillRect(0, 0, centerX * 2, centerY * 2);
        this.blackBlur.depth = 100
        this.blackBlur.alpha = 0


        this.tweens.add({
            targets: this.blackBlur,
            alpha: 1,
            duration: 10,//1300
            ease: 'Power2',
            onComplete: () => {
                if (initial) {
                    this.startDialogue()
                }
            }
        });
    }
    startDialogue() {
        // Criar a câmera separada para UI
        if (!this.uiCamera) {
            this.uiCamera = this.cameras.add(0, 0, this.scale.width, this.scale.height).setScroll(0, 0);
        }

        // Criar a caixa de diálogo
        this.dialogueBox = this.add.rectangle(centerX, centerY * 2, 1500, 250, 0x000000)
            .setOrigin(0.5, 1)
            .setAlpha(0.8);
        this.dialogueBox.depth = 200;

        this.dialogueText = this.add.text(60, 550, '', {
            fontSize: '35px',
            color: '#ffffff',
            wordWrap: { width: 900 }
        });
        this.dialogueText.depth = 201;

        // Criar o sprite do personagem falando
        this.character = this.add.image(1230, 500, 'khras_talk')
            .setScale(0.3)
            .setOrigin(0.5)
            .setVisible(true);
        this.character.depth = 202;

        this.uiElements = this.add.group([this.dialogueBox, this.dialogueText, this.character,]);
        this.uiElements.getChildren().forEach(child => {
            child.originalAlpha = child.alpha;
        });

        // Dizer para a câmera principal ignorar a UI
        this.cameras.main.ignore(this.uiElements);

        // Dizer para a câmera da UI renderizar apenas a UI
        this.uiCamera.ignore(this.children.list.filter(obj => !this.uiElements.contains(obj)));

        // Agora o zoom só afeta a câmera principal, e a UI fica intacta
        // this.cameras.main.setZoom(1.2);
        // this.cameras.main.pan(500, 300, 1000, 'Sine.easeInOut');
        this.activeDialogue = true
        this.playNextDialogue();
    }

    playNextDialogue() {
        if (!this.activeDialogue) {
            return
        }

        let currentText = this.tutorialPhrases[this.pIndex].replace(/{nickname}/g, player.nickname);
        this.dialogueAction(this.pIndex);

        // Criar um texto invisível para calcular wordWrap antes de exibir
        let hiddenText = this.add.text(0, 0, currentText, {
            fontSize: '35px',
            color: '#ffffff',
            wordWrap: { width: 900 }
        }).setVisible(false);

        // Pegar o texto já quebrado corretamente
        let formattedText = hiddenText.getWrappedText().join("\n");
        hiddenText.destroy(); // Remover o texto invisível

        let currentCharIndex = 0; // Índice para a letra atual

        this.actualDialogueAudio = this.sound.add('text_' + this.pIndex);
        this.actualDialogueAudio.play();

        this.actualDialogueText = this.time.addEvent({
            delay: 40,
            loop: true,
            callback: () => {
                if (currentCharIndex < formattedText.length) {
                    this.dialogueText.setText(formattedText.slice(0, currentCharIndex + 1));
                    currentCharIndex++;
                }
            }
        });

        this.actualDialogueAudio.on('complete', () => {
            this.dialogueTimer = this.time.delayedCall(200 / this.DM, () => {
                this.pIndex++;
                this.playNextDialogue();
            });
        });
    }

    dialogueAction(index) {
        if (index == 4) {
            this.showDialogueUI(false)

            this.focusMask = this.make.graphics();

            this.focusMask.fillStyle(0xffffff);
            this.focusMask.fillRect(0, centerY, 250, 384);

            const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
            mask.invertAlpha = true;
            this.blackBlur.setMask(mask);

            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                scaleX: 6,
                duration: 2000,
                ease: 'Power2',
                onComplete: () => {
                    this.maskTween = this.tweens.add({
                        targets: this.focusMask,
                        y: -384,
                        duration: 800,
                        ease: 'Power2',
                    });
                }
            });
        }
        else if (index == 5) {
            this.clearFocusMask()
            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1.3,
                scrollX: -170,
                scrollY: 80,
                duration: 1000,
                ease: 'Power2',
                repeat: 0,
                yoyo: false
            });
            this.focusMask = this.make.graphics();

            this.focusMask.fillStyle(0xffffff);
            this.focusMask.fillRect(35, centerY + 30, 150, 150);

            const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
            mask.invertAlpha = true;

            this.blackBlur.setMask(mask);

            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                delay: 1500,
                y: -200,
                duration: 800,
                ease: 'Power2',
            });

            this.showDialogueUI()
        } else if (index == 6) {
            this.cameras.main.scrollY = 0
            //TODO caso focus mask nao tiver sido criada(a pessoa pulou), fazer algo pra criar ela
            if (!this.focusMask) {
                this.focusMask = this.make.graphics();
                this.focusMask.fillStyle(0xffffff);
                this.focusMask.fillRect(35, centerY + 30, 150, 150);
                const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
                mask.invertAlpha = true;
                this.blackBlur.setMask(mask);
            }

            this.showDialogueUI(false)

            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                scaleX: 1.3,
                x: 1250,
                y: 75,
                duration: 800,
                ease: 'Power2',
            });

            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1.3,
                scrollX: 170,
                duration: 1000,
                ease: 'Power2',
                repeat: 0,
                yoyo: false
            });
        } else if (index == 7) {
            this.clearFocusMask()
            //garante que a cena sempre esteja no padrao da anterior, mesmo se pular a anterior
            this.cameras.main.scrollX = 170
            this.cameras.main.zoom = 1.3

            this.focusMask = this.make.graphics();
            this.focusMask.fillStyle(0xffffff);
            this.focusMask.fillRect(1350, 520, 80, 80);
            const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
            mask.invertAlpha = true;
            this.blackBlur.setMask(mask);

            this.showExempleCard()
            this.showDialogueUI()

            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                x: -605,
                y: -365,
                duration: 600,
                ease: 'Power2',
            });
        } else if (index == 8) {
            this.cameras.main.scrollY = 0
            this.cameras.main.scrollX = 170
            this.cameras.main.zoom = 1.3
            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1.5,
                scrollY: 120,
                duration: 600,
                ease: 'Power2',
                repeat: 0,
                yoyo: false
            });
            const card = this.playerCards[8]
            this.tweens.add({
                targets: card,
                y: '-=40',
                duration: 600,
                ease: 'Power2',
            });
            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                x: -605,
                y: -10,
                duration: 600,
                ease: 'Power2',
            });
            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                delay: 2900,
                x: -375,
                y: -10,
                duration: 300,
                ease: 'Power2',
            });
        } else if (index == 9) {
            this.cameras.main.scrollY = 120
            this.cameras.main.scrollX = 170
            this.cameras.main.zoom = 1.5
            this.clearFocusMask()
            this.cameras.main.scrollY = 120
            this.cameras.main.zoom = 1.5

            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1.3,
                scrollY: '-=120',
                duration: 600,
                ease: 'Power2',
                repeat: 0,
                yoyo: false
            });

            const card = this.playerCards[8]
            this.tweens.add({
                targets: card,
                delay: 1400,
                alpha: 0,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    card.setPosition(310, 705)
                    card.setAlpha(1)
                    card.setVisible(false)
                }
            });

        } else if (index == 10) {

            this.cameras.main.scrollY = 0
            this.cameras.main.scrollX = 170
            this.cameras.main.zoom = 1.3

            this.focusMask = this.make.graphics();
            this.focusMask.fillStyle(0xffffff);
            this.focusMask.fillRect(1295, 285, 200, 200);
            const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
            mask.invertAlpha = true;
            this.blackBlur.setMask(mask);

            this.showDialogueUI(false)
            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1.5,
                scrollX: '+=75',
                duration: 600,
                ease: 'Power2',
                repeat: 0,
                yoyo: false
            });
            this.time.delayedCall(2000 / this.DM, () => {
                this.button.setTexture(this.buttonTexture[1])
                this.buttonText.text = 'PRONTO'
            });
            this.time.delayedCall(3100 / this.DM, () => {
                this.buttonText.text = 'PASSAR'
            });
            this.time.delayedCall(4000 / this.DM, () => {
                this.buttonText.text = 'ATACAR'
            });
            this.time.delayedCall(4800 / this.DM, () => {
                this.buttonText.text = 'DEFENDER'
            });

        } else if (index == 11) {
            this.clearFocusMask()
            this.activeDialogue = false
            this.showDialogueUI()
            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1,
                scrollX: 0,
                duration: 1500,
                ease: 'Power2',
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    this.time.delayedCall(2200 / this.DM, () => {
                        this.showDialogueUI(false)
                        this.initialDrawn()
                        this.fadeOutBlackBlur()

                    });

                }
            });
        } else if (index == 12) {
            this.tweens.add({
                targets: this.blackBlur,
                alpha: 1,
                duration: 600,
                ease: 'Power2',
            })
            this.showDialogueUI()
        } else if (index == 14) {

            this.time.delayedCall(1000 / this.DM, () => {
                this.focusMask = this.make.graphics();
                this.focusMask.fillStyle(0xffffff);
                this.focusMask.fillRect(751, 247, 200, 275);
                const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
                mask.invertAlpha = true;
                this.blackBlur.setMask(mask);
            });


        } else if (index == 15) {

            this.activeDialogue = false
            this.time.delayedCall(2800 / this.DM, () => {
                this.swapTutorial()
            });
        } else if (index == 17) {

        } else if (index == 18) {
            this.playerHand.off()

            sleep(this, 600, () => {
                this.showDialogueUI(false)
                this.fadeOutBlackBlur()

            })
            this.tweens.add({
                targets: this.cameras.main,
                delay: 800,
                zoom: 1.4,
                scrollX: '+=200',
                duration: 1200,
                ease: 'Power2',
                repeat: 0,
                yoyo: false,
                onComplete: () => {
                    this.tweens.add({
                        targets: this.cameras.main,
                        delay: 1400,
                        zoom: 1,
                        scrollX: 0,
                        duration: 1000,
                        ease: 'Power2',
                        repeat: 0,
                        yoyo: false,

                    });
                }
            });
        } else if (index == 19) {
            this.playerHand.off()

            var hand = ['8', '5', 's1', '21', '15']

            this.fadeInBlackBlur()
            this.showDialogueUI()
            sleep(this, 2800, () => {
                this.activeDialogue = false
                this.showDialogueUI(false)
                // this.playerHand.on()

                this.focusMask = this.make.graphics();
                this.focusMask.fillStyle(0xffffff);
                this.focusMask.fillRect(1060, 590, 400, 275);
                const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
                mask.invertAlpha = true;
                this.blackBlur.setMask(mask);


                const focusArea = this.add.rectangle(1260, 727, 400, 275, 0x000000, 0);
                focusArea.setInteractive({ cursor: 'pointer' });

                focusArea.on('pointerup', () => {
                    focusArea.disableInteractive();
                    focusArea.destroy()
                    this.playerHand.openHandAnimation()

                    this.actualDialogueAudio.stop()
                    this.actualDialogueText.remove();
                    this.pIndex = 20
                    this.activeDialogue = true
                    if (this.dialogueTimer) {
                        this.dialogueTimer.remove();
                    }
                    this.playNextDialogue()

                    sleep(this, 400, () => {
                        for (const id of hand) {
                            const card = this.getPlayerCardObj(id);
                            card.collider.disableInteractive()
                        }
                    })
                });

            })
        } else if (index == 20) {
            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                scaleX: 2.1,
                scaleY: 1.7,
                x: -1890,
                y: -700,
                duration: 600,
                ease: 'Power2',
            });


            sleep(this, 1500, () => {
                this.activeTween = this.tweens.add({
                    targets: this.playerCards['s1'],
                    y: 517, // Move a carta para cima
                    angle: 0,
                    depth: 10,
                    scale: 0.65,
                    duration: 400,
                    ease: 'Power2',
                });

            })
        } else if (index == 21) {
            //provisorio
            // this.updateOfensiveIcon(1)
            // this.playerEnergy = 1
            // this.playerEnergyValue.setTexture('default_energy_' + this.playerEnergy)
            // this.enemyEnergy = 1
            // this.enemyEnergyValue.setTexture('default_energy_' + this.enemyEnergy)
            // this.showDialogueUI(false)
            // var hand = ['8', '5', 's1', '21', '15']
            // for (const id of hand) {
            //     const card = this.getPlayerCardObj(id);
            //     card.setVisible(true)
            //     card.disableInteractive()
            //     this.playerHand.addCard(card);
            // }
            // sleep(this, 400, () => {
            //     for (const id of hand) {
            //         const card = this.getPlayerCardObj(id);
            //         card.collider.disableInteractive()
            //     }
            // })


            //--------------------
            this.fadeOutBlackBlur()
            this.clearFocusMask()
            this.playerHand.openHandAnimation()
            this.playerHand.off()

            this.activeDialogue = false

            sleep(this, 7000, () => {
                const dark_age = this.getPlayerCardObj('5');
                dark_age.collider.setInteractive({ cursor: 'pointer' })
                this.boardCollider.setAlpha(0.2)

            })
        } else if (index == 23) {
            // jogada do adversario
            this.activeDialogue = false
            this.boardCollider.setAlpha(0)
            sleep(this, 7000, () => {
                const ghost = this.getEnemyCardObj('21');
                ghost.setPosition(325, 106)
                ghost.setVisible(true)
                this.enemyBench.push(ghost)
                this.benchEnemyAnimation()
                this.enemyEnergy += -1
                this.enemyEnergyValue.setTexture('default_energy_' + this.enemyEnergy)
                this.updateButton(1, 'SUA VEZ')
            })
            sleep(this, 7500, () => {
                this.activeDialogue = true
                this.playNextDialogue()

            })
        } else if (index == 24) {
            this.fadeInBlackBlur()
            this.showDialogueUI()
            sleep(this, 3000, () => {
                this.focusMask = this.make.graphics();
                this.focusMask.fillStyle(0xffffff);
                this.focusMask.fillRect(182, 448, 72, 72);
                const mask = new Phaser.Display.Masks.BitmapMask(this, this.focusMask);
                mask.invertAlpha = true;
                this.blackBlur.setMask(mask);
                this.tweens.add({
                    targets: this.cameras.main,
                    zoom: 1.4,
                    scrollX: -200,
                    scrollY: 70,
                    duration: 1000,
                    ease: 'Power2',
                    repeat: 0,
                    yoyo: false,

                });
            })

        } else if (index == 26) {

            this.fadeOutBlackBlur()
            this.clearFocusMask()
            this.showDialogueUI(false)
            this.tweens.add({
                targets: this.cameras.main,
                zoom: 1,
                scrollX: 0,
                scrollY: 0,
                duration: 300,
                ease: 'Power2',
                repeat: 0,
                yoyo: false,

            });
            this.activeDialogue = false
            const dark_age = this.getPlayerCardObj('5');
            dark_age.collider.setInteractive({ cursor: 'pointer' })
            this.boardCollider.setAlpha(0.2)

        } else if (index == 27) {
            this.boardCollider.setAlpha(0)
            sleep(this, 5500, () => {
                this.defenseEnemyAnimation('21', 0)
            })
        } else if (index == 29) {
            this.activeDialogue = false
            sleep(this, 9500, () => {
                //crashing cards
                const dark_age = this.getPlayerCardObj('5');
                const ghost = this.getEnemyCardObj('21');
                simpleTweens(this, dark_age, centerX, 560, 0.38, 1, 0, 200, () => {
                    simpleTweens(this, dark_age, centerX, 475, 0.38, 1, 0, 100, () => {
                        ghost.playDamageAnimation(-3)
                        simpleTweens(this, dark_age, centerX, 490, 0.38, 1, 0, 300, () => {
                            this.damageTakenAnimation(-2, 2)
                            sfx.cardDamage01.play()
                            var data1 = {
                                attack: 3,
                                defense: 1,
                                vulnerable: true,
                            }
                            dark_age.update(data1)
                        })
                    })
                })

                simpleTweens(this, ghost, centerX, 210, 0.38, 1, 0, 200, () => {
                    simpleTweens(this, ghost, centerX, 295, 0.38, 1, 0, 100, () => {
                        dark_age.playDamageAnimation(-1)
                        simpleTweens(this, ghost, centerX, 280, 0.38, 1, 0, 300, () => {
                            sfx.cardDamage01.play()
                            var data2 = {
                                attack: 1,
                                defense: 0,
                                vulnerable: true,
                            }
                            ghost.update(data2)
                            sleep(this, 800, () => {
                                this.activeDialogue = true
                                this.playNextDialogue()
                            })

                        })
                    })
                })
            })
        } else if (index == 30) {
            this.activeDialogue = false
            sleep(this, 6500, () => {
                this.benchPlayerAnimation()
                this.offensivePlayer = 2
                this.round(2)

            })
        } else if (index == 33) {

            this.activeDialogue = false
            this.fadeOutBlackBlur()
            this.showDialogueUI(false)
            this.playerHand.openHandAnimation()
            var hand = ['8', '11', 's1', '21', '15']
            sleep(this, 400, () => {
                for (const id of hand) {
                    const card = this.getPlayerCardObj(id);
                    card.collider.disableInteractive()
                }
                const shild = this.getPlayerCardObj('s1');
                shild.collider.setInteractive()
            })

        } else if (index == 34) {
            //provisorio
            // this.updateOfensiveIcon(2)
            // this.updateButton(1, 'SUA VEZ')
            // this.playerEnergy = 0
            // this.playerEnergyValue.setTexture('default_energy_' + this.playerEnergy)
            // this.enemyEnergy = 2
            // this.enemyEnergyValue.setTexture('default_energy_' + this.enemyEnergy)
            // this.fadeOutBlackBlur()
            // this.showDialogueUI(false)
            // const cardOnBench = this.getPlayerCardObj('5')
            // cardOnBench.setVisible(true)
            // this.playerBench.push(cardOnBench)
            // this.benchPlayerAnimation()

            // var hand = ['8', '21', '15', '11']

            // for (const id of hand) {
            //     const card = this.getPlayerCardObj(id);
            //     console.log(card)
            //     card.setVisible(true)
            //     card.disableInteractive()
            //     this.playerHand.addCard(card);
            // }
            // sleep(this, 400, () => {
            //     for (const id of hand) {
            //         const card = this.getPlayerCardObj(id);
            //         // console.log(card)
            //         // card.collider.disableInteractive()
            //     }
            // })


            //--------------------
            // this.playerHand.closedHandAnimation()
            // this.playerHand.off()
            //-------------
            this.activeDialogue = false
            sleep(this, 1000, () => {
                this.button.on('pointerup', () => {
                    this.button.off('pointerup')
                    this.updateButton(0, 'TURNO DO OPONENTE')

                    this.actualDialogueAudio.stop()
                    this.actualDialogueText.remove();
                    this.pIndex = 35
                    this.activeDialogue = true
                    if (this.dialogueTimer) {
                        this.dialogueTimer.remove();
                    }
                    this.playNextDialogue()
                })
            })

        } else if (index == 35) {
            const c1 = this.getEnemyCardObj('15')
            const c2 = this.getEnemyCardObj('18')
            c1.setVisible(true)
            c2.setVisible(true)
            this.enemyAttackZone.push(c1, c2)
            this.attackEnemyAnimation(2)
        } else if (index == 36) {
            //fazer retangulos roxos
            this.createDefenseHitbox()
        } else if (index == 38) {
            this.updateButton(1, 'DEFENDER')
            const dark_age = this.getPlayerCardObj('5')
            dark_age.onBenchMode()


        } else if (index == 39) {
            this.fadeInBlackBlur()
            this.showDialogueUI()

        } else if (index == 43) {
            this.activeDialogue = false
            sleep(this, 5500, () => {
                GAME.scene.stop('Tutorial')
                GAME.scene.run('HomeScene')
            })
        }
    }
    createDefenseHitbox() {
        this.defensiveHitbox = []
        const numCards = 2
        const spacing = 140;
        const offsetX = (numCards - 1) * spacing / 2;

        this.enemyAttackZone.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;

            var hitbox = this.add.rectangle(posX, 490, 124, 183, 0xff0ff0, 0.1);
            this.defensiveHitbox.push(hitbox)

        });
    }
    showDialogueUI(bool = true) {
        if (bool == false) {
            this.tweens.add({
                targets: this.uiElements.getChildren(),
                alpha: 0,
                duration: 300,
                ease: 'Power2',
            });
            this.dialogueText.text = ''
            return
        }
        this.tweens.add({
            targets: this.uiElements.getChildren(),
            alpha: (child) => child.originalAlpha,
            duration: 300,
            ease: 'Power2',
        });

    }
    showExempleCard() {
        const card = this.playerCards[8]
        card.setAlpha(0)
        card.setVisible(true)
        card.setPosition(900, centerY)

        this.tweens.add({
            targets: card,
            alpha: 1,
            duration: 400,
            ease: 'Power2',
        });

    }
    createBoard() {
        //player
        this.playerBoard = this.add.image(centerX, centerY, 'default_board');
        this.playerBench = []
        this.playerAttackZone = []
        this.playerDefenseZone = {}
        this.defensiveHitbox = []
        //enemy

        this.enemyBoard = this.add.image(centerX, centerY, 'default_board');
        this.enemyBoard.setScale(1, -1);
        this.enemyBench = []

        this.enemyAttackZone = []
        this.enemyDefenseZone = {}

        this.boardCollider = this.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 1);
        this.boardCollider.setAlpha(0);
        this.boardCollider.setInteractive();
    }
    createButton() {
        this.buttonTexture = ['default_board_button', 'default_board_button_active']
        this.button = this.add.image(1396, centerY, this.buttonTexture[0]);

        this.button.depth = 90
        this.buttonText = add_text(this, 1396, centerY, '', '25px', 0.5)
        this.buttonText.setAlign('center');
        this.buttonText.setWordWrapWidth(180, true);
        this.buttonText.setStyle({ fontStyle: 'bold' });
        this.buttonText.depth = 91
        this.actualButtonText = this.buttonText.text


        this.button.on('pointerover', () => {
            if (this.actualButtonText == 'SUA VEZ') {
                sfx.hoverButton.play()
                this.buttonText.text = 'PASSAR'
            }
        });
        this.button.on('pointerout', () => {
            if (this.actualButtonText == 'SUA VEZ') {
                sfx.hoverButton.play()
                this.buttonText.text = this.actualButtonText
            }
        });
    }
    updateButton(state, text) {
        this.button.setTexture(this.buttonTexture[state])
        this.buttonText.text = text
        this.actualButtonText = this.buttonText.text
        if (state != 1) {
            this.button.disableInteractive()
            return
        }
        this.button.setInteractive({ cursor: 'pointer' })
    }

    createIcons() {
        //player
        this.playerNickname = add_text(this, 110, centerY + 200, player.nickname, '30px', 0.5)
        this.playerIcon = this.add.image(110, 678, 'chibi_khras');
        this.playerIcon.setScale(0.4)
        this.playerBorder = this.add.image(110, 678, 'border01');
        this.playerBorder.setScale(0.4)

        //enemy
        this.enemyNickname = add_text(this, 110, centerY - 200, 'Kronos', '30px', 0.5)
        this.enemyIcon = this.add.image(110, 90, 'chibi_kronos');
        this.enemyIcon.setScale(0.4)
        this.enemyBorder = this.add.image(110, 90, 'border01');
        this.enemyBorder.setScale(0.4)

    }

    createDecks() {
        //player
        this.playerDeck = this.add.image(326, 669, 'cards_deck');
        this.playerDeck.setScale(0.7)
        this.playerFirsDeckCard = this.add.image(326 - 10, 669 - 7, 'verse_card');
        this.playerFirsDeckCard.setScale(0.4)
        this.playerFirsDeckCard.setDepth(1)
        //enemy
        this.enemyDeck = this.add.image(326, 100, 'cards_deck');
        this.enemyDeck.setScale(0.7, -0.7)
        this.enemyFirsDeckCard = this.add.image(326 + 10, 100 + 7, 'verse_card');
        this.enemyFirsDeckCard.setScale(0.4, -0.4)
        this.enemyFirsDeckCard.setDepth(1)
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

    createEnergy() {
        //player
        this.playerEnergy = 0
        this.playerEnergyHolder = this.add.image(1396, centerY + 175, 'default_board_energy_holder');
        this.playerEnergyValue = this.add.image(1396, centerY + 175, 'default_energy_' + 0);
        //enemy
        this.enemyEnergyHolder = this.add.image(1396, centerY - 175, 'default_board_energy_holder');
        this.enemyEnergyValue = this.add.image(1396, centerY - 175, 'default_energy_' + 0);
        this.enemyEnergy = 0
    }

    createPlayerHand() {
        this.player = {
            hand: [],
        }
        this.playerHand = new MatchHand(this)
    }
    instantiateCards() {
        //player
        this.playerCards = createPlayerCards(this, player.decks[0].cards, 1)
        //enemy
        this.enemyCards = createPlayerCards(this, player.decks[0].cards, 2)

        //isso é pra as cartas do inimigo sair de tras do deck inimigo
        Object.keys(this.enemyCards).forEach((key) => {
            const card = this.enemyCards[key];
            card.setPosition(340, 100);
            card.scale = 0.32
        });
    }
    initialDrawn() {
        this.player.hand = ['8', '5', '9', '21']
        var cardsObj = []
        for (let card of this.player.hand) {
            var c = this.playerCards[card]
            cardsObj.push(c)
        }
        this.initialDrawManager = new InitialDrawManager(this)
        this.initialDrawManager.drawCards(cardsObj)
        sleep(this, 2000, () => {
            this.initialDrawManager.disableAllSwap()
            this.updateCameras()
        })
        sleep(this, 2500, () => {
            this.updateButton(1, 'PRONTO')
        })
        sleep(this, 2800, () => {
            this.activeDialogue = true
            this.playNextDialogue()
        })
    }
    swapTutorial() {
        this.showDialogueUI(false)
        const targetSwap = this.initialDrawManager.swapButtons[2]
        targetSwap.setInteractive()
        targetSwap.on('pointerup', () => {
            targetSwap.disableInteractive()
            clearCardsToSwap()
            this.removeMaskTween()
            this.maskTween = this.tweens.add({
                targets: this.focusMask,
                scaleX: 1,
                scaleY: 0.7,
                x: 545,
                y: 115,
                duration: 600,
                ease: 'Power2',
            });

            this.button.on('pointerup', () => {
                this.button.off('pointerup')
                this.button.disableInteractive()
                this.updateButton(0, 'AGUARDE')
                this.clearFocusMask()
                this.fadeOutBlackBlur()
                const oldCard = [this.playerCards[9]]
                const newCard = [this.playerCards['s1']]
                this.initialDrawManager.swapCards(oldCard, newCard)
                this.player.hand[2] = 's1'

                sleep(this, 2600, () => {
                    this.fadeInBlackBlur()
                    this.showDialogueUI()
                    this.activeDialogue = true
                    this.playNextDialogue()
                    this.activeDialogue = false

                    sleep(this, 1500, () => {
                        for (const id of this.player.hand) {
                            const card = this.getPlayerCardObj(id);
                            this.playerHand.addCard(card);
                        }

                        // this.initialDrawManager.finish(this.player.hand)
                        sleep(this, 7700, () => {
                            this.fadeOutBlackBlur()
                            this.showDialogueUI(false)
                            this.playerHand.closedHandAnimation()
                        })
                        sleep(this, 8400, () => {

                            this.round(1)
                        })
                    })
                })
            })

        })
        this.maskTween = this.tweens.add({
            targets: this.focusMask,
            scaleX: 0.8,
            scaleY: 0.2,
            x: 170,
            y: 467,
            duration: 600,
            ease: 'Power2',
        });
    }
    damageTakenAnimation(value, owner) {
        if (this.damageText) {
            this.damageText.destroy()
        }

        var height = centerY + 100
        if (owner != 1) {
            height = centerY - 100
        }

        this.damageText = this.add.text(200, height, value ? value : '',
            { fontSize: '40px', fill: '#FF0000', fontStyle: 'bold', fontFamily: 'sans-serif', });
        this.damageText.setOrigin(0.5, 0.5);
        this.damageText.setAlpha(0)

        this.tweens.add({
            targets: this.damageText,
            alpha: 1,
            duration: 100,
            ease: 'linear',
            onComplete: () => {
                this.tweens.add({
                    targets: this.damageText,
                    delay: 500,
                    alpha: 0,
                    duration: 200,
                    ease: 'linear',
                    onComplete: () => {
                        this.updateHp(owner, value)
                    }
                });
            }
        });
    }
    updateHp(owner, value) {
        if (owner == 1) {
            this.playerHp.text = parseInt(this.playerHp.text) + value
            return
        }
        this.enemyHp.text = parseInt(this.enemyHp.text) + value
    }
    round(number) {
        this.playerHand.off()

        // this.button.waiting()
        // this.clearCombatZone()

        var blackground = this.add.rectangle(centerX, centerY, 2000, 2000, 0x000000, 1);
        blackground.depth = 99
        blackground.alpha = 0
        blackground.setInteractive()
        this.updateCameras()

        simpleTweens(this, blackground, centerX, centerY, 1, 89, 0, 600, () => {
            sleep(this, 2000, () => {
                simpleTweens(this, blackground, centerX, centerY, 1, 89, 0, 600, () => {
                    blackground.destroy()
                }, 0)
            })

        }, 0.7)

        this.roundText = this.add.text(centerX, centerY, 'RODADA ' + number,
            {
                fontSize: '100px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#ffd700'
            })
        this.roundText.setOrigin(0.5, 0.5)
        this.roundText.depth = 100
        this.roundText.alpha = 0;
        this.roundText.setShadow(2, 2, '#000', 2, false, true);
        simpleTextTweens(this, this.roundText, centerX, centerY, 90, 0, 500, 1, () => {
            simpleTextTweens(this, this.roundText, centerX, centerY, 90, 0, 500, 0, () => {
                sleep(this, 1500, () => {
                    this.updateButton(1, 'SUA VEZ') //TODO mudar isso pra quando tiver na vez do bot
                    sleep(this, 1300, () => {
                        this.updateOfensiveIcon(this.offensivePlayer)
                    })
                    var draws = [0, 15, 11, 12, 13]
                    this.draw(draws[number]) //TODO fazer uma lista com as cartas q vao ser compradas e remover a q comprou
                    if (number == 1) {
                        sleep(this, 1800, () => {
                            this.activeDialogue = true
                            this.showDialogueUI()
                            this.fadeInBlackBlur()
                            this.playNextDialogue()

                        })
                    }
                    if (number == 2) {
                        sleep(this, 1800, () => {
                            this.activeDialogue = true
                            this.showDialogueUI()
                            this.fadeInBlackBlur()
                            this.playNextDialogue()
                            this.playerHand.off()

                        })
                    }
                })


                this.RefillEnergy(number)
            }, 2000)
        })

    }

    RefillEnergy(value) {
        this.playerEnergy += value
        this.playerEnergyValue.setTexture('default_energy_' + this.playerEnergy)
        this.enemyEnergy += value
        this.enemyEnergyValue.setTexture('default_energy_' + this.enemyEnergy)
    }
    cardDropped(cardObj) {

        const pointer = this.input.activePointer;
        const bounds = this.boardCollider.getBounds();


        if (cardObj.isSpell()) {
            var id = idCleaner(cardObj.id)
            if (id == 's7' || id == 's5') {
                //gambiarra
                if (!this.isOver(pointer, bounds)) {
                    return
                }
            }

            const card = this.getPlayerCardObj('5')
            var cardBounds = card.getBounds()
            if (this.isOver(pointer, cardBounds)) {
                this.spellS1Animation('s1', card)
                this.playerEnergy -= 2
                this.playerEnergyValue.setTexture('default_energy_' + this.playerEnergy)
                sleep(this, 400, () => {
                    this.actualDialogueAudio.stop()
                    this.actualDialogueText.remove();
                    this.pIndex = 34
                    this.activeDialogue = true
                    if (this.dialogueTimer) {
                        this.dialogueTimer.remove();
                    }
                    this.playNextDialogue()
                })

            }
            return
            //manda pro servidor e ele que se lasque pra gerenciar
        }


        if (!this.isOver(pointer, bounds)) {
            return
        }
        if (this.defensiveHitbox.length > 0) {

            this.defensiveHitbox.forEach((hitbox, index) => {
                var bounds = hitbox.getBounds();
                if (this.isOver(pointer, bounds)) {
                    this.defensePlayerAnimation('5', index)
                    this.button.on('pointerup', () => {
                        this.button.off('pointerup')

                        this.actualDialogueAudio.stop()
                        this.actualDialogueText.remove();
                        if (this.dialogueTimer) {
                            this.dialogueTimer.remove();
                        }
                        this.activeDialogue = false

                        this.defensiveHitbox.forEach((hitbox) => {
                            hitbox.destroy()
                        })
                        this.defensiveHitbox = []



                        const c1 = this.getEnemyCardObj('15')
                        const c2 = this.getEnemyCardObj('18')
                        const enemyCards = [c1, c2]
                        const pos = this.defensePosition

                        const dark_age = this.getPlayerCardObj('5')
                        const advCard = enemyCards[pos]
                        const otherCard = enemyCards.find((_, idx) => idx !== pos)

                        // Função de animação do dark_age e advCard
                        const animateDarkAgeAndAdvCard = () => {
                            simpleTweens(this, dark_age, dark_age.x, 560, 0.38, 1, 0, 200, () => {
                                simpleTweens(this, dark_age, dark_age.x, 475, 0.38, 1, 0, 100, () => {
                                    advCard.playDamageAnimation(-dark_age.attack.text)
                                    simpleTweens(this, dark_age, dark_age.x, 490, 0.38, 1, 0, 300, () => {
                                        sfx.cardDamage01.play()
                                        dark_age.update({
                                            attack: 3,
                                            defense: 3 - advCard.attack.text,
                                            vulnerable: true,
                                        })
                                    })
                                })
                            })

                            simpleTweens(this, advCard, advCard.x, 210, 0.38, 1, 0, 200, () => {
                                simpleTweens(this, advCard, advCard.x, 295, 0.38, 1, 0, 100, () => {
                                    dark_age.playDamageAnimation(-advCard.attack.text)
                                    simpleTweens(this, advCard, advCard.x, 280, 0.38, 1, 0, 300, () => {
                                        sfx.cardDamage01.play()
                                        advCard.update({
                                            attack: advCard.attack.text,
                                            defense: 1,
                                            vulnerable: true,
                                        })
                                    })
                                })
                            })
                        }

                        // Função de animação do otherCard
                        const animateOtherCard = () => {
                            simpleTweens(this, otherCard, otherCard.x, 210, 0.38, 1, 0, 200, () => {
                                simpleTweens(this, otherCard, otherCard.x, 295, 0.38, 1, 0, 100, () => {
                                    simpleTweens(this, otherCard, otherCard.x, 280, 0.38, 1, 0, 300, () => {
                                        sfx.cardDamage01.play()
                                        this.damageTakenAnimation(-otherCard.attack.text, 1)
                                    })
                                })
                            })
                        }

                        // Controla a ordem conforme o pos
                        if (pos === 0) {
                            animateDarkAgeAndAdvCard()
                            sleep(this, 1000, () => {  // espera as animações principais antes de ir pro otherCard
                                animateOtherCard()
                            })
                        } else {
                            animateOtherCard()
                            sleep(this, 1000, () => {
                                animateDarkAgeAndAdvCard()
                            })
                        }

                        sleep(this, 3200, () => {  // espera as animações principais antes de ir pro otherCard
                            this.pIndex = 39
                            this.activeDialogue = true
                            this.playNextDialogue()
                        })


                    })

                    return
                }

            })
            return
        }


        if (cardObj.state == 'onHand') {

            this.playerHand.removeCard(cardObj)
            this.playerHand.closedHandAnimation()
            this.playerBench.push(cardObj)
            this.benchPlayerAnimation()
            sleep(this, 400, () => {
                this.activeDialogue = true
                this.playNextDialogue()
                this.updateButton(0, 'TURNO DO OPONENTE')
                this.playerEnergy -= 1
                this.playerEnergyValue.setTexture('default_energy_' + this.playerEnergy)
            })
            return
        }
        if (cardObj.state == 'onBench') {
            this.updateButton(1, 'ATACAR')
            this.playerAttackZone.push(cardObj)
            this.attackPlayerAnimation(1)
            this.button.on('pointerup', () => {
                this.button.off('pointerup')
                this.input.setDefaultCursor('default');
                sfx.pressButton.play()
                this.updateButton(0, 'TURNO DO OPONENTE')
                sleep(this, 200, () => {
                    this.actualDialogueAudio.stop()
                    this.actualDialogueText.remove();
                    this.pIndex = 27
                    this.activeDialogue = true
                    if (this.dialogueTimer) {
                        this.dialogueTimer.remove();
                    }
                    this.playNextDialogue()
                })
            })
            return
        }

    }

    benchPlayerAnimation() {

        const numCards = this.playerBench.length;
        const spacing = 115;
        const offsetX = (numCards - 1) * spacing / 2;

        this.playerBench.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;
            this.tweens.add({
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
                    card.collider.disableInteractive()
                },
            });
        });
    }
    benchEnemyAnimation() {
        const numCards = this.enemyBench.length;

        const spacing = 115;
        const offsetX = (numCards - 1) * spacing / 2;


        this.enemyBench.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;
            card.setVisible(true)
            this.tweens.add({
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

    attackPlayerAnimation(len) {

        const numCards = len;
        const spacing = 140;
        const offsetX = (numCards - 1) * spacing / 2;

        this.playerAttackZone.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;
            this.tweens.add({
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

                },
            });
        });
    }
    attackEnemyAnimation(len) {

        const numCards = len;
        const spacing = 140;
        const offsetX = (numCards - 1) * spacing / 2;

        this.enemyAttackZone.forEach((card, index) => {
            const posX = centerX - offsetX + index * spacing;

            this.tweens.add({
                targets: card,
                scale: 0.38,
                depth: 50,
                angle: 0,
                x: posX,
                y: 280,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    sfx.impactWood.play()

                },
            });
        });
    }

    defensePlayerAnimation(cardId, position) {
        const cardObj = this.getPlayerCardObj(cardId)
        const pos = this.defensiveHitbox[position]
        this.defensePosition = position

        // 0 - x: 470
        // 1 - x: 610
        // 2 - x: 750
        // 3 - x: 890
        // 4 - x: 1030

        this.tweens.add({
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

            },
        });

    }
    defenseEnemyAnimation(cardId, position) {
        const cardObj = this.getEnemyCardObj(cardId)
        const pos = this.playerAttackZone[position].x


        this.tweens.add({
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

            },
        });

    }
    updateOfensiveIcon(player) {

        if (player == 1) {
            crashSwords(this, 300, 100, 0.25)
            this.updateCameras()
            return
        }
        crashSwords(this, 100, -100, 0.25)
        this.updateCameras()
    }
    draw(id) {
        var card = this.getPlayerCardObj(id)
        this.playerHand.drawCard(card)
        this.playerHand.off()
    }
    updateCameras() {
        this.cameras.main.ignore(this.uiElements);
        this.uiCamera.ignore(this.children.list.filter(obj => !this.uiElements.contains(obj)));
    }
    clearFocusMask() {
        if (this.focusMask) {
            this.focusMask.clear()
        }
    }
    removeMaskTween() {
        if (this.maskTween) {
            this.maskTween.remove()
        }
    }
    fadeOutBlackBlur() {
        this.tweens.add({
            targets: this.blackBlur,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => {
            }
        })
    }
    fadeInBlackBlur() {
        this.tweens.add({
            targets: this.blackBlur,
            alpha: 1,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
            }
        })
    }
    getPlayerCardObj(id) {
        var card = this.playerCards[id]
        return card
    }
    getEnemyCardObj(id) {
        var card = this.enemyCards[id]
        return card
    }
    isOver(pointer, bounds) {
        var is = pointer.x >= bounds.x && pointer.x <= bounds.x + bounds.width &&
            pointer.y >= bounds.y && pointer.y <= bounds.y + bounds.height
        return is
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
    spellS1Animation(spellID, target) {

        var owner = this.player
        var spell = this.getPlayerCardObj(spellID)
        var target_card = this.getPlayerCardObj(target.id);
        this.playerHand.removeCard(spell)
        this.playerHand.closeHand()


        //TODO melhorar animaçao e adicionar um brilho na carta que recebeu o buff
        this.tweens.add({
            targets: spell,
            scale: 0.60,
            depth: 10,
            angle: 0,
            x: centerX,
            y: centerY,
            duration: 300,
            ease: 'Linear',
            onComplete: () => {
                this.tweens.add({
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
                        const dark_age = this.getPlayerCardObj('5')
                        var data = {
                            attack: 3,
                            defense: 3,
                            vulnerable: true,
                        }
                        dark_age.update(data)
                    },
                });
            },
        });

    }
}