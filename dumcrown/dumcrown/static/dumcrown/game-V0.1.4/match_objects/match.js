
import { createPlayerCards } from '../cards/functions.js';
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';

import { add_text } from '../functions/texts.js';
import { MatchButton } from './button.js';

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchManager {
    constructor(scene, match) {
        this.scene = scene
        this.id = match.id;
        this.round = match.round;
        this.player1 = match.player1;
        this.player2 = match.player2;
        this.button = new MatchButton(scene, match)
        this.turn = match.turn; // Indica de quem é a vez (pode ser 1 ou 2)
        this.offensiveTurn = match.offensive_turn; // Indica de quem é o turno ofensivo do round
        this.history = [];
        this.energyNumbers = []
        this.player = this.get_player();
        this.enemy = this.get_enemy();
        this.start()
    }

    get_player() {
        if (this.player1.id === player.id) {
            return this.player1;
        }
        return this.player2;
    }

    get_enemy() {
        if (this.player1.id === player.id) {
            return this.player2;
        }
        return this.player1;
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
    }


    createBoard() {
        //player
        this.playerBoard = this.scene.add.image(centerX, centerY, this.player.board);
        //enemy
        this.enemyBoard = this.scene.add.image(centerX, centerY, this.enemy.board);
        this.enemyBoard.setScale(1, -1);
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

    }

    instantiateCards() {
        //player
        this.playerCards = createPlayerCards(this.scene, this.player.deck)
        //enemy
        this.enemyCards = createPlayerCards(this.scene, this.enemy.deck)
    }
}
