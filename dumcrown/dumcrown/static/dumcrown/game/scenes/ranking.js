import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, sendSocket, showCoordinates } from '../functions/functions.js';
import { playersRanking, rankingUpdate } from '../client/client.js';
import { Button } from '../functions/buttons.js';
import { add_text } from '../functions/texts.js';

export class RankingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'RankingScreen' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'ranking_background');
        const x_close = new Button(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'RankingScreen')
        });
        x_close.setScale(0.5)
        this.title = add_text(this, centerX, 35, 'Ranking', '50px', 0.5)
        this.title.setStyle({ fontStyle: 'bold' })


        const startY = 135;
        const offsetY = 82.5;

        for (let i = 0; i < playersRanking.length; i++) {
            this.addRankingEntry(i, startY + i * offsetY);
        }


    }

    addRankingEntry(index, yPosition) {
        const player = playersRanking[index];

        if (index == 7) {
            const yourPosition = this.add.text(centerX - 475, yPosition, playersRanking[7].position,
                {
                    fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#fff'
                })
            yourPosition.setShadow(0, 0, '#000', 4, false, true);
            yourPosition.setOrigin(0, 0.5)
        }

        const nickname = this.add.text(centerX - 390, yPosition, player.nickname, {
            fontSize: '40px',
            fontFamily: 'Lexend Deca, sans-serif',
            fontStyle: 'bold',
            fill: '#000'
        });
        nickname.setOrigin(0, 0.5);
        const points = this.add.text(1120, yPosition, player.crown_points, {
            fontSize: '40px',
            fontFamily: 'Lexend Deca, sans-serif',
            fontStyle: 'bold',
            fill: '#000'
        });
        points.setOrigin(0.5, 0.5);
        // console.log(this.top1_nickname.y + this.top1_nickname.height / 2); //==137.5
        var tierPos = nickname.y + nickname.height / 2

        const tier = this.add.image(1000, yPosition, player.tier);
        tier.setScale(0.18);
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).

    }
}
