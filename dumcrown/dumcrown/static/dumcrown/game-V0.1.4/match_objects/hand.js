
import { simpleTweens } from '../animations/scripts/functions.js';
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { sleep } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchHand {
    constructor(scene, cards = '') {
        this.scene = scene
        this.hand = []
        if (cards) {
            this.hand = cards
        }
        this.state = 0
        this.areaVisiblity = 0
        this.init()
    }
    init() {
        this.createClosedHandBox()
    }
    addCard(card) {
        this.hand.push(card)
    }
    createClosedHandBox() {
        this.closedHandBox = this.scene.add.rectangle(1294, 688, 500, 240, 0xffffff, 0)
        this.closedHandBox.depth = 10
        this.closedHandBox.setInteractive({ cursor: 'pointer' })
        this.closedHandBox.on('pointerup', () => {
            if (this.state == 0) {
                this.openHandAnimation()
                this.state = 1
                this.closedHandBox.setScale(10)
                this.closedHandBox.depth = 0
                return
            }
            this.closedHandAnimation()
            this.closedHandBox.setScale(1)
            this.closedHandBox.depth = 10
            this.state = 0

        });
    }
    closedHandAnimation() {
        const configs = {
            1: [[1310, 695, 0, 300]],
            2: [[1270, 695, -5, 300], [1340, 695, 5, 300]],
            3: [[1230, 700, -4, 300], [1300, 695, -1, 300], [1370, 700, 4, 300]],
            4: [[1165, 722, -15, 300], [1230, 707, -9, 300], [1295, 698, -4, 300], [1360, 695, 0, 300]],
            5: [[1160, 722, -15, 300], [1210, 712, -10, 300], [1265, 705, -6, 300], [1330, 700, -4, 300], [1390, 698, 0, 300]],
            6: [[1200, 722, -15, 300], [1230, 712, -10, 300], [1265, 705, -6, 300], [1310, 700, -4, 300], [1350, 698, -1, 300], [1410, 696, 0, 300]],
            7: [[1185, 719, -15, 300], [1215, 712, -10, 300], [1250, 706, -6, 300], [1290, 702, -4, 300], [1335, 698, -2, 300], [1380, 696, -1, 300], [1420, 696, 0, 300]],
        };

        const config = configs[this.hand.length];
        console.log(this.hand)

        if (config) {
            config.forEach((cfg, i) => {
                // simpleTweens(this.scene, this.hand[i], cfg[0], cfg[1], 0.40, i + 1, cfg[2], cfg[3]);
                this.hand[i].textScale = 0.4
                this.scene.tweens.add({
                    targets: this.hand[i],
                    x: cfg[0],
                    y: cfg[1],
                    scale: 0.4,
                    depth: i + 1,
                    angle: cfg[2],
                    duration: cfg[3],
                    ease: 'Power2',
                    onComplete: () => {

                    },
                });
                this.hand[i].closedHandMode()
            });
        }
    }


    openHandAnimation() {
        const length = this.hand.length;

        // Certifique-se de que as posições abertas estão criadas
        this.createOpenHandPositions();

        // Verifique se o comprimento está dentro dos limites
        if (this.openPositions[length]) {
            const positions = this.openPositions[length];

            // Inicie a profundidade com 1, para a primeira carta
            let depthValue = 1;

            // Use um loop for para animar cada carta
            for (let i = 0; i < length; i++) {
                const pos = positions[i];

                // Chame a função simpleTweens para cada carta com suas posições correspondentes
                this.hand[i].textScale = 0.5
                simpleTweens(this.scene, this.hand[i], pos.x, pos.y, 0.50, depthValue, pos.angle, 300, () => {
                    this.hand[i].openHandMode()
                }, 1);
                // Incrementa o valor da profundidade para a próxima carta
                depthValue++;

            }
        }
    }
    createOpenHandPositions() {
        this.openPositions = {
            1: [{ x: centerX, y: 680, angle: 0 }],
            2: [
                { x: centerX - 60, y: 680, angle: -3 },
                { x: centerX + 60, y: 680, angle: 3 }
            ],
            3: [
                { x: centerX - 120, y: 685, angle: -3 },
                { x: centerX, y: 680, angle: 0 },
                { x: centerX + 120, y: 685, angle: 3 }
            ],
            4: [
                { x: centerX - 180, y: 690, angle: -6 },
                { x: centerX - 70, y: 680, angle: -3 },
                { x: centerX + 70, y: 680, angle: 3 },
                { x: centerX + 180, y: 690, angle: 6 }
            ],
            5: [
                { x: centerX - 280, y: 730, angle: -13 },
                { x: centerX - 150, y: 690, angle: -5 },
                { x: centerX, y: 680, angle: 0 },
                { x: centerX + 150, y: 690, angle: 5 },
                { x: centerX + 280, y: 730, angle: 13 }
            ],
            6: [
                { x: centerX - 270, y: 705, angle: -9 },
                { x: centerX - 180, y: 690, angle: -6 },
                { x: centerX - 70, y: 680, angle: -3 },
                { x: centerX + 70, y: 680, angle: 3 },
                { x: centerX + 180, y: 690, angle: 6 },
                { x: centerX + 270, y: 705, angle: 9 }
            ],
            7: [
                { x: centerX - 270, y: 705, angle: -9 },
                { x: centerX - 180, y: 692, angle: -6 },
                { x: centerX - 90, y: 683, angle: -3 },
                { x: centerX, y: 680, angle: 0 },
                { x: centerX + 90, y: 683, angle: 3 },
                { x: centerX + 180, y: 692, angle: 6 },
                { x: centerX + 270, y: 705, angle: 9 }
            ]
        };
    }
    drawCard(cardObj) {
        // console.log(card)
        this.addCard(cardObj)

        const verseCard = this.scene.add.image(346 - 10, 669 - 7, 'verse_card');
        verseCard.setScale(0.2)

        this.scene.tweens.add({
            targets: verseCard,
            x: '-=150',
            y: '-=20',
            angle: 0,
            scale: 0.8,
            depth: 90,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: verseCard,
                    x: centerX,
                    y: centerY + 100,
                    duration: 200,
                    onComplete: () => {
                        var card = cardObj

                        card.setPosition(centerX, centerY + 100);
                        card.scaleX = 0;
                        card.scaleY = 0.8;
                        card.depth = 5
                        card.setVisible(true)

                        this.scene.tweens.add({
                            targets: verseCard,
                            scaleX: 0,
                            duration: 100,
                            ease: 'Linear',
                            onComplete: () => {
                                verseCard.destroy();
                            }
                        });

                        this.scene.tweens.add({
                            targets: card,
                            scaleX: 0.8,
                            delay: 100,
                            duration: 100,
                            ease: 'Linear',
                            onComplete: () => {
                                sleep(this.scene, 300, () => {
                                    this.closedHandAnimation()
                                })
                            }
                        });
                    }
                })
            }
        })


    }
    getCardCount() {
        return this.hand.length;
    }
}
