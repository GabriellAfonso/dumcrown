
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { add_text } from '../functions/texts.js';

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

        this.turn = match.turn; // Indica de quem é a vez (pode ser 1 ou 2)
        this.offensiveTurn = match.offensiveTurn; // Indica de quem é o turno ofensivo do round
        this.history = [];

        this.player = this.get_player();
        this.enemy = this.get_enemy();
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
        this.create_board()
        this.create_button()
        this.create_icons()
        this.create_decks()
        this.create_hp()
        this.create_energy()
    }

    create_board() {
        //player
        this.playerBoard = this.scene.add.image(centerX, centerY, this.player.board);
        //enemy
        this.enemyBoard = this.scene.add.image(centerX, centerY, this.enemy.board);
        this.enemyBoard.setScale(1, -1);
    }
    create_button() {
        this.button = this.scene.add.image(1396, centerY, 'default_board_button_active');
    }

    create_icons() {
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

    create_decks() {
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

    create_hp() {
        //player
        this.playerHpBar = this.scene.add.image(110, centerY + 100, 'hpbar');
        this.playerHpBar.setScale(0.35)
        this.playerHpIcon = this.scene.add.image(80, centerY + 100, 'yourcrown');
        this.playerHpIcon.setScale(0.35)
        //enemy
        this.enemyHpBar = this.scene.add.image(110, centerY - 100, 'hpbar');
        this.enemyHpBar.setScale(0.35)
        this.enemyHpIcon = this.scene.add.image(80, centerY - 100, 'enemycrown');
        this.enemyHpIcon.setScale(0.35)
    }

    create_energy() {
        //player
        this.playerEnergyHolder = this.scene.add.image(1396, centerY + 175, 'default_board_energy_holder');
        //enemy
        this.enemyEnergyHolder = this.scene.add.image(1396, centerY - 175, 'default_board_energy_holder');
    }
}
