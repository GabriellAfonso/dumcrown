
import { simpleTweens } from '../animations/scripts/functions.js';
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { add_text } from '../functions/texts.js';

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchHand {
    constructor(scene, player) {
        this.scene = scene
        this.hand = [] // lista de cartas na mao



    }

    // disabledHandAnimation(target) {

    //     const handLength = target.length;
    //     const positions = [
    //         { x: 1310, y: 695 }, { x: 1270, y: 695 }, { x: 1230, y: 700 }, { x: 1165, y: 722 },
    //         { x: 1160, y: 722 }, { x: 1200, y: 722 }, { x: 1185, y: 719 }
    //     ];

    //     const offsets = [
    //         { angle: 0 }, { angle: -5 }, { angle: -4 }, { angle: -15 },
    //         { angle: -15 }, { angle: -15 }, { angle: -15 }
    //     ];
    //     console.log(handLength)
    //     for (let i = 0; i < handLength; i++) {
    //         const posX = positions[handLength - 1].x + (i * 70); // ajuste dinâmico de X
    //         const posY = positions[handLength - 1].y;
    //         const angle = offsets[handLength - 1].angle + (i * 5); // ajuste dinâmico de ângulo
    //         console.log('que show da xuxa é esse')
    //         simpleTweens(this.scene, target[i], posX, posY, 0.40, i + 1, angle, 300);
    //     }
    // }
    disabledHandAnimation(target) {
        const configs = {
            1: [[1310, 695, 0, 300]],
            2: [[1270, 695, -5, 300], [1340, 695, 5, 300]],
            3: [[1230, 700, -4, 300], [1300, 695, -1, 300], [1370, 700, 4, 300]],
            4: [[1165, 722, -15, 300], [1230, 705, -6, 300], [1295, 700, -4, 300], [1360, 695, 0, 300]],
            5: [[1160, 722, -15, 300], [1210, 712, -10, 300], [1265, 705, -6, 300], [1330, 700, -4, 300], [1390, 698, 0, 300]],
            6: [[1200, 722, -15, 300], [1230, 712, -10, 300], [1265, 705, -6, 300], [1310, 700, -4, 300], [1350, 698, -1, 300], [1410, 696, 0, 300]],
            7: [[1185, 719, -15, 300], [1215, 712, -10, 300], [1250, 706, -6, 300], [1290, 702, -4, 300], [1335, 698, -2, 300], [1380, 696, -1, 300], [1420, 696, 0, 300]],
        };

        const config = configs[target.length];

        if (config) {
            config.forEach((cfg, i) => {
                simpleTweens(this.scene, target[i], cfg[0], cfg[1], 0.40, i + 1, cfg[2], cfg[3]);
            });
        }
    }


    getCardCount() {
        return this.hand.length;
    }
}
