import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";

export function crashSwords(scene, initialY, finalY, scale) {


    if (scene.sword01) {
        scene.sword01.destroy()
        scene.sword02.destroy()
    }


    scene.sword01 = scene.add.image(-150, centerY + initialY, 'sword01');
    scene.sword01.setScale(0.25)
    scene.sword01.alpha = 0

    scene.sword02 = scene.add.image(150, centerY + initialY, 'sword02');
    scene.sword02.setScale(0.25)
    scene.sword02.alpha = 0





    simpleTweens(scene, scene.sword01, 50, centerY + finalY, scale, 10, 0, 500)
    simpleTweens(scene, scene.sword02, 50, centerY + finalY, scale, 10, 0, 500)


}