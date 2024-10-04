import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, showCoordinates } from '../functions/functions.js';

import { Botao } from '../functions/functions.js';

export class MissionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MissionsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');


        const background = this.add.image(centerX, centerY, 'missions_background');
        const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'MissionsScene')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)

        //fazer objeto de cada player onde vai tar o tabuleiro e talz pra nao encher de codigo
        this.playerBoard = this.add.image(centerX, centerY, 'default_board');
        this.opponentBoard = this.add.image(centerX, centerY, 'default_board');
        this.opponentBoard.setScale(1, -1);
        showCoordinates(this)

        this.button = this.add.image(1396, centerY, 'default_board_button');

        const playerIcon = this.add.image(110, 678, 'chibi_khras');
        playerIcon.setScale(0.4)
        this.playerBorder = this.add.image(110, 678, 'border03');
        this.playerBorder.setScale(0.4)

        const playerHpBar = this.add.image(110, centerY + 100, 'hpbar');
        playerHpBar.setScale(0.35)

        const playerDeck = this.add.image(346, 669, 'cards_deck');
        playerDeck.setScale(0.7)
        const playerFirsDeckCard = this.add.image(346 - 10, 669 - 7, 'verse_card');
        playerFirsDeckCard.setScale(0.4)
        const playerEnergyHolder = this.add.image(1396, centerY + 175, 'default_board_energy_holder');


        const opponentIcon = this.add.image(110, 90, 'chibi_kronos');
        opponentIcon.setScale(0.4)
        this.adversaryBorder = this.add.image(110, 90, 'border02');
        this.adversaryBorder.setScale(0.4)

        const opponentHpBar = this.add.image(110, centerY - 100, 'hpbar');
        opponentHpBar.setScale(0.35)

        const opponentDeck = this.add.image(346, 100, 'cards_deck');
        opponentDeck.setScale(0.7, -0.7)
        const enemyFirsDeckCard = this.add.image(346 + 10, 100 + 7, 'verse_card');
        enemyFirsDeckCard.setScale(0.4, -0.4)

        const opponentEnergyHolder = this.add.image(1396, centerY - 175, 'default_board_energy_holder');
    }


    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
