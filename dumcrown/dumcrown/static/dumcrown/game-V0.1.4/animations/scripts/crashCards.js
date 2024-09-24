import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";

export function yourDefenseCrash(scene) {

    var duration = 100

    if (Object.keys(scene.adversaryCardsAttack).length == 1) {
        if (scene.yourDefeseCards['1']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['1']['ID']], centerX, 475, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.yourDefeseCardsAnimation()
        })

    }

    if (Object.keys(scene.adversaryCardsAttack).length == 2) {
        if (scene.yourDefeseCards['1']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['1']['ID']], centerX - 70, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['2']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['2']['ID']], centerX + 70, 475, 0.38, 1, 0, duration, () => {
                })
        }
        sleep(scene, duration, () => {
            scene.yourDefeseCardsAnimation()
        })
    }

    if (Object.keys(scene.adversaryCardsAttack).length == 3) {
        if (scene.yourDefeseCards['1']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['1']['ID']], centerX - 135, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['2']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['2']['ID']], centerX, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['3']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['3']['ID']], centerX + 135, 475, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.yourDefeseCardsAnimation()
        })
    }

    if (Object.keys(scene.adversaryCardsAttack).length == 4) {
        if (scene.yourDefeseCards['1']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['1']['ID']], centerX - 210, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['2']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['2']['ID']], centerX - 70, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['3']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['3']['ID']], centerX + 70, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['4']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['4']['ID']], centerX + 210, 475, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.yourDefeseCardsAnimation()
        })
    }



    if (Object.keys(scene.adversaryCardsAttack).length == 5) {
        if (scene.yourDefeseCards['1']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['1']['ID']], centerX - 270, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['2']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['2']['ID']], centerX - 135, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['3']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['3']['ID']], centerX, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['4']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['4']['ID']], centerX + 135, 475, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.yourDefeseCards['5']) {
            simpleTweens(scene,
                scene.yourCards[scene.yourDefeseCards['5']['ID']], centerX + 270, 475, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.yourDefeseCardsAnimation()
        })
    }
}

export function adversaryDefenseCrash(scene) {
    var duration = 100

    if (Object.keys(scene.yourCardsOnArena).length == 1) {
        if (scene.adversaryCardsDefese['1']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['1']['ID']], centerX, 295, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.adversaryDefeseCardsAnimation()
        })

    }

    if (Object.keys(scene.yourCardsOnArena).length == 2) {
        if (scene.adversaryCardsDefese['1']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['1']['ID']], centerX - 70, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['2']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['2']['ID']], centerX + 70, 295, 0.38, 1, 0, duration, () => {
                })
        }
        sleep(scene, duration, () => {
            scene.adversaryDefeseCardsAnimation()
        })
    }

    if (Object.keys(scene.yourCardsOnArena).length == 3) {
        if (scene.adversaryCardsDefese['1']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['1']['ID']], centerX - 135, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['2']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['2']['ID']], centerX, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['3']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['3']['ID']], centerX + 135, 295, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.adversaryDefeseCardsAnimation()
        })
    }

    if (Object.keys(scene.yourCardsOnArena).length == 4) {
        if (scene.adversaryCardsDefese['1']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['1']['ID']], centerX - 210, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['2']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['2']['ID']], centerX - 70, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['3']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['3']['ID']], centerX + 70, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['4']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['4']['ID']], centerX + 210, 295, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.adversaryDefeseCardsAnimation()
        })
    }



    if (Object.keys(scene.yourCardsOnArena).length == 5) {
        if (scene.adversaryCardsDefese['1']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['1']['ID']], centerX - 270, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['2']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['2']['ID']], centerX - 135, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['3']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['3']['ID']], centerX, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['4']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['4']['ID']], centerX + 135, 295, 0.38, 1, 0, duration, () => {

                })
        }
        if (scene.adversaryCardsDefese['5']) {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsDefese['5']['ID']], centerX + 270, 295, 0.38, 1, 0, duration, () => {

                })
        }
        sleep(scene, duration, () => {
            scene.adversaryDefeseCardsAnimation()
        })
    }
}