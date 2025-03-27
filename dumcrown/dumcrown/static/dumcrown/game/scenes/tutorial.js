
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
import { sfx } from '../soundfx/sounds.js';



export class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    create() {

        this.createScene()
        this.getPhrases()

    }
    getPhrases() {
        fetch(PATH + 'lang/tutorial.json')
            .then(response => response.json())
            .then(data => {
                this.pIndex = 1
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
                this.createBlur()
            }
        });
    }
    createBlur() {

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
                this.startDialogue()
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
            if (this.maskTween) {
                this.maskTween.remove()
            }
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
        this.playNextDialogue();
    }

    playNextDialogue() {
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
            this.time.delayedCall(200, () => {
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
            if (this.focusMask) {
                this.focusMask.clear()
            }
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
            if (this.focusMask) {
                this.focusMask.clear()
            }
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

        this.button.on('pointerover', () => {
            if (this.text == 'SUA VEZ') {
                sfx.hoverButton.play()
                this.buttonText.text = 'PASSAR'
            }
        });
        this.button.on('pointerout', () => {
            if (this.text == 'SUA VEZ') {
                sfx.hoverButton.play()
                this.buttonText.text = this.text
            }
        });
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

    update() {

    }



}