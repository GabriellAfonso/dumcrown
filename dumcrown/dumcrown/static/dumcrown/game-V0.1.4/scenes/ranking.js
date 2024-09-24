import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, sendSocket } from '../functions/functions.js';
import { playersRanking, rankingUpdate } from '../client/client.js';

import { sleep } from '../functions/functions.js';
import { Botao } from '../functions/functions.js';

export class RankingScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'RankingScreen' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'ranking_background');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'RankingScreen')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)




        this.top1_nickname = this.add.text(centerX - 390, 80, playersRanking[0].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top1_points = this.add.text(1120, 98, playersRanking[0].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top1_points.setOrigin(0.5, 0.5)

        this.top1_tier = this.add.image(1000, 98, playersRanking[0].tier)
        this.top1_tier.setScale(0.18)


        this.top2_nickname = this.add.text(centerX - 390, 161, playersRanking[1].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top2_points = this.add.text(1120, 180, playersRanking[1].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top2_points.setOrigin(0.5, 0.5)
        this.top2_tier = this.add.image(1000, 180, playersRanking[1].tier)
        this.top2_tier.setScale(0.18)

        this.top3_nickname = this.add.text(centerX - 390, 242, playersRanking[2].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top3_points = this.add.text(1120, 260, playersRanking[2].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top3_points.setOrigin(0.5, 0.5)

        this.top3_tier = this.add.image(1000, 260, playersRanking[2].tier)
        this.top3_tier.setScale(0.18)

        this.top4_nickname = this.add.text(centerX - 390, 324, playersRanking[3].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top4_points = this.add.text(1120, 340, playersRanking[3].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top4_points.setOrigin(0.5, 0.5)
        this.top4_tier = this.add.image(1000, 340, playersRanking[3].tier)
        this.top4_tier.setScale(0.18)

        this.top5_nickname = this.add.text(centerX - 390, 406, playersRanking[4].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top5_points = this.add.text(1120, 426, playersRanking[4].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top5_points.setOrigin(0.5, 0.5)
        this.top5_tier = this.add.image(1000, 426, playersRanking[4].tier)
        this.top5_tier.setScale(0.18)

        this.top6_nickname = this.add.text(centerX - 390, 488, playersRanking[5].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top6_points = this.add.text(1120, 506, playersRanking[5].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top6_points.setOrigin(0.5, 0.5)
        this.top6_tier = this.add.image(1000, 506, playersRanking[5].tier)
        this.top6_tier.setScale(0.18)


        this.top7_nickname = this.add.text(centerX - 390, 567, playersRanking[6].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.top7_points = this.add.text(1120, 589, playersRanking[6].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.top7_points.setOrigin(0.5, 0.5)
        this.top7_tier = this.add.image(1000, 589, playersRanking[6].tier)
        this.top7_tier.setScale(0.18)

        this.your_position = this.add.text(centerX - 475, 652, playersRanking[7].position,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#fff'
            })
        this.your_position.setShadow(0, 0, '#000', 4, false, true);
        this.your_nickname = this.add.text(centerX - 390, 649, playersRanking[7].nickname,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })


        this.your_points = this.add.text(1120, 674, playersRanking[7].crown_points,
            {
                fontSize: '40px', fontFamily: 'Lexend Deca, sans-serif',
                fontStyle: 'bold', fill: '#000'
            })
        this.your_points.setOrigin(0.5, 0.5)
        this.your_tier = this.add.image(1000, 674, playersRanking[7].tier)
        this.your_tier.setScale(0.18)

    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).

    }
}
