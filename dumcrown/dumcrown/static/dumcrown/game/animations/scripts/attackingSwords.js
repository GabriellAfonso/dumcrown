import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";
import { sleep } from "../../functions/functions.js";
import { sfx } from "../../soundfx/sounds.js";

export function crashSwords(scene, initialY, finalY, scale) {


    if (scene.sword01) {
        scene.sword01.destroy()
        scene.sword02.destroy()
    }


    scene.sword01 = scene.add.image(100, centerY + initialY, 'sword01');
    scene.sword01.setScale(0.25)
    scene.sword01.alpha = 0

    scene.sword02 = scene.add.image(300, centerY + initialY, 'sword02');
    scene.sword02.setScale(0.25)
    scene.sword02.alpha = 0




    sleep(scene, 200, () => {
        sfx.drawSword.play()
    })
    simpleTweens(scene, scene.sword01, 220, centerY + finalY, scale, 10, 0, 600)
    simpleTweens(scene, scene.sword02, 220, centerY + finalY, scale, 10, 0, 600)


}