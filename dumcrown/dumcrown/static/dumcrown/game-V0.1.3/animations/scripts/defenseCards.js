import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";

export function yourDefenseCards(scene) {

    if (Object.keys(scene.adversaryCardsAttack).length == 1) {

        if (scene.yourDefeseCards[1]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }


    }
    if (Object.keys(scene.adversaryCardsAttack).length == 2) {

        if (scene.yourDefeseCards[1]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 70,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[2]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 70,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }


    }

    if (Object.keys(scene.adversaryCardsAttack).length == 3) {

        if (scene.yourDefeseCards[1]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 135,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[2]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[3]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[3]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 135,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }

    }

    if (Object.keys(scene.adversaryCardsAttack).length == 4) {

        if (scene.yourDefeseCards[1]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 210,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[2]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 70,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[3]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[3]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 70,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[4]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[4]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 210,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
    }
    if (Object.keys(scene.adversaryCardsAttack).length == 5) {

        if (scene.yourDefeseCards[1]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 270,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[2]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 135,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[3]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[3]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[4]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[4]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 135,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.yourDefeseCards[5]) {
            scene.tweens.add({
                targets: scene.yourCards[scene.yourDefeseCards[5]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 270,
                y: 490,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
    }

}

export function adversaryDefenseCards(scene) {
    if (Object.keys(scene.yourCardsOnArena).length == 1) {

        if (scene.adversaryCardsDefese[1]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }


    }
    if (Object.keys(scene.yourCardsOnArena).length == 2) {

        if (scene.adversaryCardsDefese[1]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 70,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[2]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 70,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }


    }

    if (Object.keys(scene.yourCardsOnArena).length == 3) {

        if (scene.adversaryCardsDefese[1]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 135,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[2]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[3]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[3]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 135,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }

    }

    if (Object.keys(scene.yourCardsOnArena).length == 4) {

        if (scene.adversaryCardsDefese[1]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 210,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[2]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 70,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[3]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[3]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 70,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[4]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[4]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 210,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
    }
    if (Object.keys(scene.yourCardsOnArena).length == 5) {

        if (scene.adversaryCardsDefese[1]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[1]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 270,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[2]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[2]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX - 135,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[3]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[3]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[4]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[4]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 135,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
        if (scene.adversaryCardsDefese[5]) {
            scene.tweens.add({
                targets: scene.adversaryCards[scene.adversaryCardsDefese[5]['ID']],
                scale: 0.38,
                depth: 1,
                x: centerX + 270,
                y: 280,
                duration: 500,
                ease: 'Linear',
                onComplete: () => {

                },

            })
        }
    }

}