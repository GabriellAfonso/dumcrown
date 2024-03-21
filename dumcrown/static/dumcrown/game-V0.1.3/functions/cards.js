import { GAME } from '../config/gameConfig.js';

import socket from '../main.js';

export class CardBase extends Phaser.GameObjects.Container {
    constructor(scene, monster, name, mana, attack, defense, dragable = false) {
        super(scene);

        this.setSize(656, 965);
        this.setScale(0.3)

        this.cardMonster = scene.add.image(0, 0, monster);

        this.cardLayout = scene.add.image(0, 0, 'cardlayout');


        this.nameText = scene.add.text(0, -390, name,
            { fontSize: '60px', fill: '#ffffff', fontStyle: 'bold' });
        this.nameText.setOrigin(0.5, 0.5);


        this.manaText = scene.add.text(-255, -410, mana,
            { fontSize: '90px', fill: '#ffffff', fontStyle: 'bold' });
        this.manaText.setOrigin(0.5, 0.5);

        this.attackText = scene.add.text(-188, 420, attack,
            { fontSize: '60px', fill: '#ffffff', fontStyle: 'bold' });
        this.attackText.setOrigin(0.5, 0.5);

        this.defenseText = scene.add.text(188, 420, defense,
            { fontSize: '60px', fill: '#ffffff', fontStyle: 'bold' });
        this.defenseText.setOrigin(0.5, 0.5);


        this.add([this.cardMonster, this.cardLayout, this.nameText, this.manaText, this.attackText, this.defenseText]);


    }
}



export class CardShowcase extends CardBase {
    constructor(scene, id, monster, name, energy, attack, defense, name2 = '') {
        super(scene);

        this.setSize(328, 483);
        this.setScale(0.6)
        this.setPosition(340, 668);
        this.setDepth(0)

        this.cardID = id
        this.cardMonster = scene.add.image(0, 0, monster);

        this.cardLayout = scene.add.image(0, 0, 'cardlayout');


        this.nameText = scene.add.text(0, -205, name,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold' });
        this.nameText.setOrigin(0.5, 0.5);
        this.nameText.setShadow(0, 0, '#000', 5, false, true);

        this.name2Text = scene.add.text(0, -175, name2,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold' });
        this.name2Text.setOrigin(0.5, 0.5);
        this.name2Text.setShadow(0, 0, '#000', 5, false, true);

        this.energyText = scene.add.text(-127, -205, energy,
            { fontSize: '45px', fill: '#ffffff', fontStyle: 'bold' });
        this.energyText.setOrigin(0.5, 0.5);

        this.attackText = scene.add.text(-94, 210, attack,
            { fontSize: '35px', fill: '#ffffff', fontStyle: 'bold' });
        this.attackText.setOrigin(0.5, 0.5);

        this.defenseText = scene.add.text(94, 210, defense,
            { fontSize: '35px', fill: '#ffffff', fontStyle: 'bold' });
        this.defenseText.setOrigin(0.5, 0.5);



        // this.setInteractive();



        this.add([this.cardMonster, this.cardLayout, this.nameText, this.name2Text, this.energyText, this.attackText, this.defenseText]);
        this.scene.add.existing(this);


        this.on('pointerup', () => {
            // Inicia a cena 'CardDetailScene' e passa os detalhes da carta
            GAME.scene.run('CardDetailScene', {
                monster: monster,
                name: name,
                energy: energy,
                attack: attack,
                defense: defense
            });
        });

        this.add([this.cardMonster, this.cardLayout, this.nameText, this.manaText, this.attackText, this.defenseText]);
    }
}

export function cardsShow(scene) {
    const card = {
        c1: new CardShowcase(scene, 'c1', 'morte_card', 'Morte', 5, 7, 2),
        c2: new CardShowcase(scene, 'c2', 'darkage1_card', 'Dark Age', 1, 3, 2, 'I'),
        c3: new CardShowcase(scene, 'c3', 'darkage2_card', 'Dark Age', 4, 5, 3, 'II'),
        c4: new CardShowcase(scene, 'c4', 'darkage3_card', 'Dark Age', 8, 7, 5, 'III'),
        c5: new CardShowcase(scene, 'c5', 'cdc_card', 'CDC', 4, 6, 2),
        c6: new CardShowcase(scene, 'c6', 'skillet_card', 'Skillet', 2, 4, 5),
        c7: new CardShowcase(scene, 'c7', 'kronos_card', 'Kronos', 6, 7, 4),
        c8: new CardShowcase(scene, 'c8', 'okada_card', 'Okada', 8, 8, 5),
        c9: new CardShowcase(scene, 'c9', 'khras_card', 'Khras', 1, 2, 4),
        c10: new CardShowcase(scene, 'c10', 'smoothcriminal_card', 'Smooth', 3, 4, 3, 'Criminal'),
        c11: new CardShowcase(scene, 'c11', 'boogie_card', 'Boogie', 2, 3, 1),
        c12: new CardShowcase(scene, 'c12', 'spring_card', 'Spring', 4, 8, 1),
        c13: new CardShowcase(scene, 'c13', 'polaroid_card', 'Polaroid', 3, 2, 6),
        c14: new CardShowcase(scene, 'c14', 'maniac_card', 'Maniac', 7, 10, 1),
        c15: new CardShowcase(scene, 'c15', 'crazy_card', 'Crazy', 1, 2, 4),
        c16: new CardShowcase(scene, 'c16', 'theojays_card', "O'Jays", 8, 10, 5),
        c17: new CardShowcase(scene, 'c17', 'neonb_card', 'Neon B.', 8, 3, 10),
        c18: new CardShowcase(scene, 'c18', 'ballhan_card', 'Ballhan', 1, 1, 4),
        c19: new CardShowcase(scene, 'c19', 'darknecessites_card', 'Dark', 2, 5, 1, 'Necessites'),
        c20: new CardShowcase(scene, 'c20', 'anomaly_card', 'Anomaly', 8, 8, 8),
        c21: new CardShowcase(scene, 'c21', 'jhon_card', 'Jhon Cooper', 5, 7, 5),
        c22: new CardShowcase(scene, 'c22', 'carol_card', 'Carol Arlet', 5, 7, 6),
        c23: new CardShowcase(scene, 'c23', 'darkage4_card', 'Dark Age', 10, 9, 10, 'IV'),
    };

    return card;
}

export function cards(scene) {
    const card = {
        c1: new Card(scene, 'c1', 'morte_card', 'Morte', 5, 6, 3),
        c2: new Card(scene, 'c2', 'darkage1_card', 'Dark Age', 1, 3, 2, 'I'),
        c3: new Card(scene, 'c3', 'darkage2_card', 'Dark Age', 4, 5, 3, 'II'),
        c4: new Card(scene, 'c4', 'darkage3_card', 'Dark Age', 8, 7, 5, 'III'),
        c5: new Card(scene, 'c5', 'cdc_card', 'CDC', 4, 6, 2),
        c6: new Card(scene, 'c6', 'skillet_card', 'Skillet', 2, 4, 5),
        c7: new Card(scene, 'c7', 'kronos_card', 'Kronos', 6, 7, 4),
        c8: new Card(scene, 'c8', 'okada_card', 'Okada', 8, 8, 5),
        c9: new Card(scene, 'c9', 'khras_card', 'Khras', 1, 2, 4),
        c10: new Card(scene, 'c10', 'smoothcriminal_card', 'Smooth', 3, 4, 3, 'Criminal'),
        c11: new Card(scene, 'c11', 'boogie_card', 'Boogie', 2, 3, 1),
        c12: new Card(scene, 'c12', 'spring_card', 'Spring', 5, 8, 2),
        c13: new Card(scene, 'c13', 'polaroid_card', 'Polaroid', 3, 2, 6),
        c14: new Card(scene, 'c14', 'maniac_card', 'Maniac', 7, 10, 1),
        c15: new Card(scene, 'c15', 'crazy_card', 'Crazy', 1, 2, 4),
        c16: new Card(scene, 'c16', 'theojays_card', "O'Jays", 8, 10, 5),
        c17: new Card(scene, 'c17', 'neonb_card', 'Neon B.', 8, 3, 10),
        c18: new Card(scene, 'c18', 'ballhan_card', 'Ballhan', 1, 1, 4),
        c19: new Card(scene, 'c19', 'darknecessites_card', 'Dark', 2, 5, 1, 'Necessites'),
        c20: new Card(scene, 'c20', 'anomaly_card', 'Anomaly', 8, 8, 8),
        c21: new Card(scene, 'c21', 'jhon_card', 'Jhon Cooper', 5, 7, 5),
        c22: new Card(scene, 'c22', 'carol_card', 'Carol Arlet', 5, 7, 6),
        c23: new Card(scene, 'c23', 'darkage4_card', 'Dark Age', 10, 9, 10, 'IV'),
        c24: new Card(scene, 'c24', 'rhioros_ghost', "Rioro's", 1, 1, 1, 'Ghost'),

        //copys
        c25: new Card(scene, 'c25', 'darkage1_card', 'Dark Age', 1, 3, 2, 'I'),
        c26: new Card(scene, 'c26', 'darkage1_card', 'Dark Age', 1, 3, 2, 'I'),
        c27: new Card(scene, 'c27', 'darkage2_card', 'Dark Age', 4, 5, 3, 'II'),
        c28: new Card(scene, 'c28', 'cdc_card', 'CDC', 4, 6, 2),
        c29: new Card(scene, 'c29', 'skillet_card', 'Skillet', 2, 4, 5),
        c30: new Card(scene, 'c30', 'skillet_card', 'Skillet', 2, 4, 5),
        c31: new Card(scene, 'c31', 'khras_card', 'Khras', 1, 2, 4),
        c32: new Card(scene, 'c32', 'khras_card', 'Khras', 1, 2, 4),
        c33: new Card(scene, 'c33', 'smoothcriminal_card', 'Smooth', 3, 4, 3, 'Criminal'),
        c34: new Card(scene, 'c34', 'smoothcriminal_card', 'Smooth', 3, 4, 3, 'Criminal'),
        c35: new Card(scene, 'c35', 'boogie_card', 'Boogie', 2, 3, 1),
        c36: new Card(scene, 'c36', 'boogie_card', 'Boogie', 2, 3, 1),
        c37: new Card(scene, 'c37', 'polaroid_card', 'Polaroid', 3, 2, 6),
        c38: new Card(scene, 'c38', 'polaroid_card', 'Polaroid', 3, 2, 6),
        c39: new Card(scene, 'c39', 'crazy_card', 'Crazy', 1, 2, 4),
        c40: new Card(scene, 'c40', 'crazy_card', 'Crazy', 1, 2, 4),
        c41: new Card(scene, 'c41', 'ballhan_card', 'Ballhan', 1, 1, 4),
        c42: new Card(scene, 'c42', 'ballhan_card', 'Ballhan', 1, 1, 4),
        c43: new Card(scene, 'c43', 'darknecessites_card', 'Dark', 2, 5, 1, 'Necessites'),
        c44: new Card(scene, 'c44', 'darknecessites_card', 'Dark', 2, 5, 1, 'Necessites'),
        c45: new Card(scene, 'c45', 'spring_card', 'Spring', 5, 8, 2),
        c46: new Card(scene, 'c46', 'rhioros_ghost', "Rioro's", 1, 1, 1, 'Ghost'),
        c47: new Card(scene, 'c47', 'rhioros_ghost', "Rioro's", 1, 1, 1, 'Ghost'),
        c48: new Card(scene, 'c48', 'morte_card', 'Morte', 5, 6, 3),
    };

    return card;
}






export class Card extends CardBase {
    constructor(scene, id, monster, name, energy, attack, defense, name2 = '') {
        super(scene);

        this.setSize(328, 483);
        this.setScale(0.001)
        this.setPosition(340, 668);
        this.setDepth(0)

        this.cardID = id
        this.cardMonster = scene.add.image(0, 0, monster);

        this.cardLayout = scene.add.image(0, 0, 'cardlayout');


        this.nameText = scene.add.text(0, -205, name,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold' });
        this.nameText.setOrigin(0.5, 0.5);
        this.nameText.setShadow(0, 0, '#000', 5, false, true);

        this.name2Text = scene.add.text(0, -175, name2,
            { fontSize: '30px', fill: '#ffffff', fontStyle: 'bold' });
        this.name2Text.setOrigin(0.5, 0.5);
        this.name2Text.setShadow(0, 0, '#000', 5, false, true);

        this.energyText = scene.add.text(-127, -205, energy,
            { fontSize: '45px', fill: '#ffffff', fontStyle: 'bold' });
        this.energyText.setOrigin(0.5, 0.5);

        this.attackText = scene.add.text(-94, 210, attack,
            { fontSize: '35px', fill: '#ffffff', fontStyle: 'bold' });
        this.attackText.setOrigin(0.5, 0.5);
        this.attackText.setShadow(0, 0, '#000', 5, false, true);

        this.defenseText = scene.add.text(94, 210, defense,
            { fontSize: '35px', fill: '#ffffff', fontStyle: 'bold' });
        this.defenseText.setOrigin(0.5, 0.5);
        this.defenseText.setShadow(0, 0, '#000', 5, false, true);



        this.setInteractive();



        this.add([this.cardMonster, this.cardLayout, this.nameText, this.name2Text, this.energyText, this.attackText, this.defenseText]);
        this.scene.add.existing(this);
        // this.visible = false

    }

    updateCardLayout(layout) {
        if (layout == 'normal') {
            this.cardLayout.setTexture('cardlayout');
        }
        else if (layout == 'mini') {
            this.cardLayout.setTexture('minicardlayout');

            this.attackText.setPosition(-75, 180)
            this.attackText.setFontSize('65px')

            this.defenseText.setPosition(75, 180)
            this.defenseText.setFontSize('65px')
            this.energyText.text = ''

        }


    }

    getCardInfo() {
        return {
            id: this.cardID,
            name: this.nameText.text,
            energy: parseInt(this.energyText.text),
            attack: parseInt(this.attackText.text),
            defense: parseInt(this.defenseText.text),
            // Adicione outras propriedades conforme necessário
        };
    }
}






// this.scene.input.on('dragstart', (pointer, gameObject) => {
//     // Armazena a posição original e o ângulo original quando o arrasto começa
//     originalAngle = gameObject.angle;
//     originalX = gameObject.x;
//     originalY = gameObject.y;


//     // Armazena a posição original e o ângulo original quando o arrasto começa
//     this.scene.tweens.add({
//         targets: gameObject,
//         y: 458,
//         angle: 0,
//         scale: 0.4,
//         duration: 500, // Duração da animação em milissegundos
//         ease: 'Power2', // Easing function para a animação
//     });


// });

// this.scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {

//     this.scene.tweens.add({
//         targets: gameObject,
//         scale: 0.25, // Restaura o ângulo original
//         duration: 500, // Duração da animação em milissegundos
//         ease: 'Power2', // Easing function para a animação
//     });
//     // Este código é acionado enquanto você está arrastando o objeto
//     gameObject.x = dragX;
//     gameObject.y = dragY;
//     gameObject.angle = 0;
// });

// this.scene.input.on('dragend', (pointer, gameObject) => {
//     // Este código é acionado quando você solta o objeto após o arrasto
//     // Mova a carta de volta à posição original de forma suave com uma animação
//     this.scene.tweens.add({
//         targets: gameObject,
//         x: originalX,
//         y: originalY,
//         angle: originalAngle,
//         scale: 0.25, // Restaura o ângulo original
//         duration: 500, // Duração da animação em milissegundos
//         ease: 'Power2', // Easing function para a animação
//     });

// });