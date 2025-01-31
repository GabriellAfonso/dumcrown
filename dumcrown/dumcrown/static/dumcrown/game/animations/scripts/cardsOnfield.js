import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";

export function cardsOnfield(scene) {

    if (scene.firstFieldCard) {
        scene.firstFieldCard.destroy()
    }
    if (scene.secondFieldCard) {
        scene.secondFieldCard.destroy()
    }
    if (scene.thirdFieldCard) {
        scene.thirdFieldCard.destroy()
    }
    if (scene.fourthFieldCard) {
        scene.fourthFieldCard.destroy()
    }
    if (scene.fifthFieldCard) {
        scene.fifthFieldCard.destroy()
    }




    if (scene.yourCardsOnField.length == 1) {

        scene.tweens.add({
            targets: scene.yourCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.firstFieldCard = scene.add.rectangle(centerX, 668, 328, 483, 0x000080);
                scene.firstFieldCard.alpha = scene.hitBoxVisibility
                scene.firstFieldCard.angle = 0
                scene.firstFieldCard.setDepth(scene.yourCardsOnField[0].depth + 1)
                scene.firstFieldCard.setScale(0.28)
                scene.firstFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[0], scene.firstFieldCard)
            },

        })
    }

    if (scene.yourCardsOnField.length == 2) {

        scene.tweens.add({
            targets: scene.yourCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 55,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.firstFieldCard = scene.add.rectangle(centerX - 55, 668, 328, 483, 0x000080);
                scene.firstFieldCard.alpha = scene.hitBoxVisibility
                scene.firstFieldCard.angle = 0
                scene.firstFieldCard.setDepth(scene.yourCardsOnField[0].depth + 1)
                scene.firstFieldCard.setScale(0.28)
                scene.firstFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[0], scene.firstFieldCard)
            },


        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX + 55,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.secondFieldCard = scene.add.rectangle(centerX + 55, 668, 328, 483, 0x000080);
                scene.secondFieldCard.alpha = scene.hitBoxVisibility
                scene.secondFieldCard.angle = 0
                scene.secondFieldCard.setDepth(scene.yourCardsOnField[1].depth + 1)
                scene.secondFieldCard.setScale(0.28)
                scene.secondFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[1], scene.secondFieldCard)
            },


        })
    }

    if (scene.yourCardsOnField.length == 3) {

        scene.tweens.add({
            targets: scene.yourCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 105,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.firstFieldCard = scene.add.rectangle(centerX - 105, 668, 328, 483, 0x000080);
                scene.firstFieldCard.alpha = scene.hitBoxVisibility
                scene.firstFieldCard.angle = 0
                scene.firstFieldCard.setDepth(scene.yourCardsOnField[0].depth + 1)
                scene.firstFieldCard.setScale(0.28)
                scene.firstFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[0], scene.firstFieldCard)
            },


        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.secondFieldCard = scene.add.rectangle(centerX, 668, 328, 483, 0x000080);
                scene.secondFieldCard.alpha = scene.hitBoxVisibility
                scene.secondFieldCard.angle = 0
                scene.secondFieldCard.setDepth(scene.yourCardsOnField[1].depth + 1)
                scene.secondFieldCard.setScale(0.28)
                scene.secondFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[1], scene.secondFieldCard)
            },

        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[2],
            scale: 0.28,
            depth: 1,
            x: centerX + 105,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.thirdFieldCard = scene.add.rectangle(centerX + 105, 668, 328, 483, 0x000080);
                scene.thirdFieldCard.alpha = scene.hitBoxVisibility
                scene.thirdFieldCard.angle = 0
                scene.thirdFieldCard.setDepth(scene.yourCardsOnField[2].depth + 1)
                scene.thirdFieldCard.setScale(0.28)
                scene.thirdFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[2], scene.thirdFieldCard)
            },

        })
    }
    if (scene.yourCardsOnField.length == 4) {

        scene.tweens.add({
            targets: scene.yourCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 165,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.firstFieldCard = scene.add.rectangle(centerX - 165, 668, 328, 483, 0x000080);
                scene.firstFieldCard.alpha = scene.hitBoxVisibility
                scene.firstFieldCard.angle = 0
                scene.firstFieldCard.setDepth(scene.yourCardsOnField[0].depth + 1)
                scene.firstFieldCard.setScale(0.28)
                scene.firstFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[0], scene.firstFieldCard)
            },


        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX - 55,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.secondFieldCard = scene.add.rectangle(centerX - 55, 668, 328, 483, 0x000080);
                scene.secondFieldCard.alpha = scene.hitBoxVisibility
                scene.secondFieldCard.angle = 0
                scene.secondFieldCard.setDepth(scene.yourCardsOnField[1].depth + 1)
                scene.secondFieldCard.setScale(0.28)
                scene.secondFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[1], scene.secondFieldCard)
            },

        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[2],
            scale: 0.28,
            depth: 1,
            x: centerX + 55,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.thirdFieldCard = scene.add.rectangle(centerX + 55, 668, 328, 483, 0x000080);
                scene.thirdFieldCard.alpha = scene.hitBoxVisibility
                scene.thirdFieldCard.angle = 0
                scene.thirdFieldCard.setDepth(scene.yourCardsOnField[2].depth + 1)
                scene.thirdFieldCard.setScale(0.28)
                scene.thirdFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[2], scene.thirdFieldCard)
            },

        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[3],
            scale: 0.28,
            depth: 1,
            x: centerX + 165,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.fourthFieldCard = scene.add.rectangle(centerX + 165, 668, 328, 483, 0x000080);
                scene.fourthFieldCard.alpha = scene.hitBoxVisibility
                scene.fourthFieldCard.angle = 0
                scene.fourthFieldCard.setDepth(scene.yourCardsOnField[3].depth + 1)
                scene.fourthFieldCard.setScale(0.28)
                scene.fourthFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[3], scene.fourthFieldCard)
            },

        })
    }
    if (scene.yourCardsOnField.length == 5) {

        scene.tweens.add({
            targets: scene.yourCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 210,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.firstFieldCard = scene.add.rectangle(centerX - 210, 668, 328, 483, 0x000080);
                scene.firstFieldCard.alpha = scene.hitBoxVisibility
                scene.firstFieldCard.angle = 0
                scene.firstFieldCard.setDepth(scene.yourCardsOnField[0].depth + 1)
                scene.firstFieldCard.setScale(0.28)
                scene.firstFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[0], scene.firstFieldCard)
            },


        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX - 105,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.secondFieldCard = scene.add.rectangle(centerX - 105, 668, 328, 483, 0x000080);
                scene.secondFieldCard.alpha = scene.hitBoxVisibility
                scene.secondFieldCard.angle = 0
                scene.secondFieldCard.setDepth(scene.yourCardsOnField[1].depth + 1)
                scene.secondFieldCard.setScale(0.28)
                scene.secondFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[1], scene.secondFieldCard)
            },

        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[2],
            scale: 0.28,
            depth: 1,
            x: centerX,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.thirdFieldCard = scene.add.rectangle(centerX, 668, 328, 483, 0x000080);
                scene.thirdFieldCard.alpha = scene.hitBoxVisibility
                scene.thirdFieldCard.angle = 0
                scene.thirdFieldCard.setDepth(scene.yourCardsOnField[2].depth + 1)
                scene.thirdFieldCard.setScale(0.28)
                scene.thirdFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[2], scene.thirdFieldCard)
            },

        })

        scene.tweens.add({
            targets: scene.yourCardsOnField[3],
            scale: 0.28,
            depth: 1,
            x: centerX + 105,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.fourthFieldCard = scene.add.rectangle(centerX + 105, 668, 328, 483, 0x000080);
                scene.fourthFieldCard.alpha = scene.hitBoxVisibility
                scene.fourthFieldCard.angle = 0
                scene.fourthFieldCard.setDepth(scene.yourCardsOnField[3].depth + 1)
                scene.fourthFieldCard.setScale(0.28)
                scene.fourthFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[3], scene.fourthFieldCard)
            },

        })
        scene.tweens.add({
            targets: scene.yourCardsOnField[4],
            scale: 0.28,
            depth: 1,
            x: centerX + 210,
            y: 668,
            duration: 100,
            ease: 'Linear',
            onComplete: () => {
                scene.fifthFieldCard = scene.add.rectangle(centerX + 210, 668, 328, 483, 0x000080);
                scene.fifthFieldCard.alpha = scene.hitBoxVisibility
                scene.fifthFieldCard.angle = 0
                scene.fifthFieldCard.setDepth(scene.yourCardsOnField[4].depth + 1)
                scene.fifthFieldCard.setScale(0.28)
                scene.fifthFieldCard.setInteractive()
                scene.fieldCardAnimation(scene.yourCardsOnField[4], scene.fifthFieldCard)
            },

        })
    }

}

export function adversaryCardsOnField(scene) {

    if (scene.adversaryCardsOnField.length == 1) {


        scene.tweens.add({
            targets: scene.adversaryCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })
    }

    if (scene.adversaryCardsOnField.length == 2) {


        scene.tweens.add({
            targets: scene.adversaryCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 55,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX + 55,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })
    }

    if (scene.adversaryCardsOnField.length == 3) {



        scene.tweens.add({
            targets: scene.adversaryCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 105,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[2],
            scale: 0.28,
            depth: 1,
            x: centerX + 105,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })
    }

    if (scene.adversaryCardsOnField.length == 4) {


        scene.tweens.add({
            targets: scene.adversaryCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 165,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX - 55,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[2],
            scale: 0.28,
            depth: 1,
            x: centerX + 55,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[3],
            scale: 0.28,
            depth: 1,
            x: centerX + 165,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })
    }

    if (scene.adversaryCardsOnField.length == 5) {



        scene.tweens.add({
            targets: scene.adversaryCardsOnField[0],
            scale: 0.28,
            depth: 1,
            x: centerX - 210,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[1],
            scale: 0.28,
            depth: 1,
            x: centerX - 105,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[2],
            scale: 0.28,
            depth: 1,
            x: centerX,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[3],
            scale: 0.28,
            depth: 1,
            x: centerX + 105,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })

        scene.tweens.add({
            targets: scene.adversaryCardsOnField[4],
            scale: 0.28,
            depth: 1,
            x: centerX + 210,
            y: 100,
            duration: 500,
            ease: 'Linear',

        })
    }


}