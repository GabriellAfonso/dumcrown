
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { switchScenes, logoutAjax } from '../functions/functions.js';
import { cardsShow, Card } from '../functions/cards.js';

import socket from '../main.js';

import { Botao } from '../functions/functions.js';

export class DecksScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DecksScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');


        const background = this.add.image(centerX, centerY, 'decks_background');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'DecksScene')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)
        x_close.setDepth(4)


        const card = cardsShow(this);


        // Crie um grupo de containers para a rolagem
        const deckgroup = this.add.group();
        const deckcontainer = this.add.container(centerX + 200, centerY + 20)

        // Configure a área de visualização (máscara)
        const viewWidth = 1300;
        const viewHeight = 700;
        const mask = this.make.graphics();
        mask.fillRect(200, 85, viewWidth, 680);


        deckcontainer.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));
        deckcontainer.setSize(1100, 3600)
        deckcontainer.setDepth(1);
        card.c1.setDepth(0);
        card.c2.setDepth(0);
        card.c3.setDepth(0);
        card.c4.setDepth(0);
        card.c5.setDepth(0);
        card.c6.setDepth(0);
        card.c7.setDepth(0);
        card.c8.setDepth(0);
        card.c9.setDepth(0);
        card.c10.setDepth(0);

        deckcontainer.add(card.c1);
        deckcontainer.add(card.c2);
        deckcontainer.add(card.c3);
        deckcontainer.add(card.c4);
        deckcontainer.add(card.c5);
        deckcontainer.add(card.c6);
        deckcontainer.add(card.c7);
        deckcontainer.add(card.c8);
        deckcontainer.add(card.c9);
        deckcontainer.add(card.c10);

        deckcontainer.add(card.c11);
        deckcontainer.add(card.c12);
        deckcontainer.add(card.c13);
        deckcontainer.add(card.c14);
        deckcontainer.add(card.c15);
        deckcontainer.add(card.c16);
        deckcontainer.add(card.c17);
        deckcontainer.add(card.c18);
        deckcontainer.add(card.c19);
        deckcontainer.add(card.c20);
        deckcontainer.add(card.c21);
        deckcontainer.add(card.c22);
        deckcontainer.add(card.c23);

        deckgroup.add(card.c1);
        deckgroup.add(card.c2);
        deckgroup.add(card.c3);
        deckgroup.add(card.c4);
        deckgroup.add(card.c5);
        deckgroup.add(card.c6);
        deckgroup.add(card.c7);
        deckgroup.add(card.c8);
        deckgroup.add(card.c9);
        deckgroup.add(card.c10);

        deckgroup.add(card.c11);
        deckgroup.add(card.c12);
        deckgroup.add(card.c13);
        deckgroup.add(card.c14);
        deckgroup.add(card.c15);
        deckgroup.add(card.c16);
        deckgroup.add(card.c17);
        deckgroup.add(card.c18);
        deckgroup.add(card.c19);
        deckgroup.add(card.c20);
        deckgroup.add(card.c21);
        deckgroup.add(card.c22);
        deckgroup.add(card.c23);

        card.c1.setPosition(- 375, -160);
        card.c2.setPosition(- 125, -160);
        card.c3.setPosition(125, -160);
        card.c4.setPosition(375, -160);

        card.c5.setPosition(- 375, 200);
        card.c6.setPosition(- 125, 200);
        card.c7.setPosition(125, 200);
        card.c8.setPosition(375, 200);

        card.c9.setPosition(- 375, 560);
        card.c10.setPosition(- 125, 560);
        card.c11.setPosition(125, 560);
        card.c12.setPosition(375, 560);

        card.c13.setPosition(- 375, 920);
        card.c14.setPosition(- 125, 920);
        card.c15.setPosition(125, 920);
        card.c16.setPosition(375, 920);

        card.c17.setPosition(- 375, 1280);
        card.c18.setPosition(- 125, 1280);
        card.c19.setPosition(125, 1280);
        card.c20.setPosition(375, 1280);

        card.c21.setPosition(- 125, 1640);
        card.c22.setPosition(- 375, 1640);
        card.c23.setPosition(125, 1640);



        deckcontainer.setInteractive()


        let isDragging = false;
        let startY = 0;


        deckcontainer.on('pointerdown', function (pointer) {
            isDragging = true;
            startY = pointer.y - deckcontainer.y;

            deckgroup.children.iterate((child) => {
                child.setInteractive();
            });


            deckcontainer.disableInteractive()

            setTimeout(function () {
                deckgroup.children.iterate((child) => {
                    child.disableInteractive();
                });
                deckcontainer.setInteractive()
            }, 200);


        });




        this.input.on('pointerup', function (pointer, dragX, dragY) {
            isDragging = false;
        });

        deckcontainer.on('pointerup', () => {
            isDragging = false;

        });

        this.input.on('pointermove', (pointer) => {
            if (isDragging) {
                const newY = pointer.y - startY;
                deckcontainer.y = Phaser.Math.Clamp(newY, -1041, 399);

            }
        });

        // Adicione um evento de rolagem do mouse ao container
        deckcontainer.on('wheel', function (pointer, deltaX, deltaY, deltaZ) {
            // Calcule a nova posição Y do container com base na rolagem


            const minHeight = -1041;  // Altura mínima
            const maxHeight = 399;  // Altura máxima

            // Calcule a nova posição Y do container com base na rolagem
            deckcontainer.y -= deltaY;

            // Certifique-se de que a posição Y do container esteja dentro dos limites
            if (deckcontainer.y < minHeight) {
                deckcontainer.y = minHeight;
            } else if (deckcontainer.y > maxHeight) {
                deckcontainer.y = maxHeight;
            }

        });
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}

export class CardDetailScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CardDetailScene' });
    }

    // O método init permite receber os parâmetros passados ao iniciar a cena
    init(data) {
        this.cardDetails = data;
    }

    create() {
        // Agora você pode acessar os detalhes da carta usando this.cardDetails
        const { monster, name, energy, attack, defense } = this.cardDetails;



        const background = this.add.image(centerX, centerY, 'blackground');
        background.setInteractive()
        background.alpha = 0.7

        background.on('pointerup', () => {
            GAME.scene.stop('CardDetailScene')
        });


        const carta = new Card(this, 'id', monster, name, energy, attack, defense);

        carta.setPosition(centerX, centerY)
        carta.setScale(1)


    }
}
