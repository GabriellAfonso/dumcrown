
import { crashSwords } from '../animations/scripts/attackingSwords.js';
import { simpleTextTweens, simpleTweens } from '../animations/scripts/functions.js';
import { unitCardObject } from '../cards/base.js';
import { createPlayerCards } from '../cards/functions.js';
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
                this.pIndex = 19
                this.tutorialPhrases = data
                console.log(this.tutorialPhrases)
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
        showCoordinates(this)
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
            fontSize: '40px',
            color: '#ffffff',
            wordWrap: { width: 800 }
        });
        this.dialogueText.depth = 201;

        // Criar o sprite do personagem falando
        this.character = this.add.image(1230, 500, 'khras_talk')
            .setScale(0.3)
            .setOrigin(0.5)
            .setVisible(true);
        this.character.depth = 202;

        this.skipDialogueButton = new Button(this, 1350, 700, 'decks_button', () => {
            if (this.dialogueTimer) {
                this.dialogueTimer.remove();
            }
            this.removeMaskTween()
            //TODO armazenar cada animaçao de um index diferente, pra quando passar por outro parar as do index passado
            this.actualDialogueAudio.stop()
            this.actualDialogueText.remove();
            this.pIndex++
            this.playNextDialogue()
        })
        // Adicionar os elementos da UI a um grupo
        this.uiElements = this.add.group([this.dialogueBox, this.dialogueText, this.character, this.skipDialogueButton]);
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
            fontSize: '40px',
            color: '#ffffff',
            wordWrap: { width: 800 }
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
            // console.log('esse é o 10')
            // console.log(this.cameras.main.scrollY)
            // console.log(this.cameras.main.scrollX)
            // console.log(this.cameras.main.zoom)

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
            // this.speedMultiplier = 1;
        } else if (index == 18) {
            this.speedMultiplier = 1;
            this.playerHand.off()
            console.log('deu off')
            sleep(this, 600, () => {
                this.showDialogueUI(false)
                this.fadeOutBlackBlur()
                console.log('ainda ta off?')
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
            //provisorio
            var hand = ['8', '5', 's1', '21', '15']
            for (const id of hand) {
                const card = this.getPlayerCardObj(id);
                card.setVisible(true)
                card.disableInteractive()
                this.playerHand.addCard(card);
            }
            this.playerHand.closedHandAnimation()
            this.playerHand.off()


            console.log('e agora?')
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
                    this.playerHand.openHandAnimation()

                    this.actualDialogueAudio.stop()
                    this.actualDialogueText.remove();
                    this.pIndex++
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
        }
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

        this.boardCollider = this.add.rectangle(centerX, centerY, 900, 400, 0xff0000, 0);
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
        this.playerEnergyHolder = this.add.image(1396, centerY + 175, 'default_board_energy_holder');
        this.playerEnergyValue = this.add.image(1396, centerY + 175, 'default_energy_' + 0);
        //enemy
        this.enemyEnergyHolder = this.add.image(1396, centerY - 175, 'default_board_energy_holder');
        this.enemyEnergyValue = this.add.image(1396, centerY - 175, 'default_energy_' + 0);
    }

    createPlayerHand() {
        this.player = {
            hand: [],
        }
        this.playerHand = new MatchHand(this)
    }
    instantiateCards() {
        console.log(player.decks[0].cards)
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
        console.log(this.playerCards)
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
                    this.draw(15) //TODO fazer uma lista com as cartas q vao ser compradas e remover a q comprou
                    if (number == 1) {
                        sleep(this, 1800, () => {
                            this.activeDialogue = true
                            this.showDialogueUI()
                            this.fadeInBlackBlur()
                            this.playNextDialogue()

                        })

                    }
                })


                // this.updateEnergy()
            }, 2000)
        })

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
}