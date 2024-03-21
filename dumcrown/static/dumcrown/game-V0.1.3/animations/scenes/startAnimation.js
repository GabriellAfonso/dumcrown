import { GAME, centerX, centerY } from '../../config/gameConfig.js';

import { matchDB } from '../../game_clientside/match.js'
import { simpleTweens } from '../scripts/functions.js';


export class StartAnimation extends Phaser.Scene {
    constructor() {
        super({ key: 'StartAnimation' });
    }

    create() {

        this.background = this.add.image(centerX, centerY, 'blackground');
        this.background.alpha = 0
        this.background.setInteractive({ cursor: 'default' })

        simpleTweens(this, this.background, centerX, centerY, 1, 0, 0, 800, () => { }, 0.7)

        this.player1_icon = this.add.image(centerX - 350, centerY, matchDB.player1.icon);
        this.player1_icon.setScale(0.5)
        this.player1_icon.setAlpha(0)
        this.player1_border = this.add.image(centerX - 350, centerY, matchDB.player1.border);
        this.player1_border.setScale(0.5)
        this.player1_border.setAlpha(0)
        this.player1_nickname = this.add.text(centerX - 350, centerY + 100, matchDB.player1.nickname,
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            });
        this.player1_nickname.setOrigin(0.5, 0.5)
        this.player1_nickname.setShadow(0, 0, '#000', 6, false, true);
        this.player1_nickname.setAlpha(0)


        this.player2_icon = this.add.image(centerX + 350, centerY, matchDB.player2.icon);
        this.player2_icon.setScale(0.5)
        this.player2_icon.setAlpha(0)
        this.player2_border = this.add.image(centerX + 350, centerY, matchDB.player2.border);
        this.player2_border.setScale(0.5)
        this.player2_border.setAlpha(0)
        this.player2_nickname = this.add.text(centerX + 350, centerY + 100, matchDB.player2.nickname,
            {
                fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            });
        this.player2_nickname.setOrigin(0.5, 0.5)
        this.player2_nickname.setShadow(0, 0, '#000', 6, false, true);
        this.player2_nickname.setAlpha(0)


        this.sword01 = this.add.image(centerX - 200, 800, 'sword01');
        this.sword01.setScale(1)
        this.sword01.alpha = 0

        this.sword02 = this.add.image(centerX + 200, 800, 'sword02');
        this.sword02.setScale(1)
        this.sword02.alpha = 0

        simpleTweens(this, this.sword01, centerX, centerY, 1, 100, 0, 900)
        simpleTweens(this, this.sword02, centerX, centerY, 1, 100, 0, 900)

        this.tweens.add({
            targets: [this.player1_icon, this.player1_border, this.player1_nickname,
            this.player2_icon, this.player2_border, this.player2_nickname],
            alpha: 1,
            duration: 400,
        })
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
