import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";

export function attackCardsOnArena(scene) {

    if (Object.keys(scene.yourCardsOnArena).length == 1) {

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['0']['ID']],
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

    if (Object.keys(scene.yourCardsOnArena).length == 2) {

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['0']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 70,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },


        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['1']['ID']],
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

    if (Object.keys(scene.yourCardsOnArena).length == 3) {

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['0']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 135,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },


        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },

        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['2']['ID']],
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

    if (Object.keys(scene.yourCardsOnArena).length == 4) {

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['0']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 210,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 70,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['2']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX + 70,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['3']['ID']],
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



    if (Object.keys(scene.yourCardsOnArena).length == 5) {

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['0']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 270,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },


        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 135,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },

        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['2']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })
        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['3']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX + 135,
            y: 490,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.yourCards[scene.yourCardsOnArena['4']['ID']],
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

export function adversaryAttackCards(scene) {



    if (Object.keys(scene.adversaryCardsAttack).length == 1) {

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
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

    if (Object.keys(scene.adversaryCardsAttack).length == 2) {

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 70,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },


        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
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

    if (Object.keys(scene.adversaryCardsAttack).length == 3) {

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 135,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },


        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },

        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']],
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

    if (Object.keys(scene.adversaryCardsAttack).length == 4) {

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 210,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 70,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX + 70,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']],
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



    if (Object.keys(scene.adversaryCardsAttack).length == 5) {

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 270,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },


        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX - 135,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {


            },

        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })
        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']],
            scale: 0.38,
            depth: 1,
            x: centerX + 135,
            y: 280,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {

            },

        })

        scene.tweens.add({
            targets: scene.adversaryCards[scene.adversaryCardsAttack['5']['ID']],
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