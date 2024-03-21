import { simpleTextTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";
import { sleep } from "../../functions/functions.js";


export function textAnimation(scene, x, y, text, color = '#fff', fontSize = 60, duration = [300, 400, 300]) {

    const receivedDamageMSG = scene.add.text(x, y, text,
        {
            fontSize: fontSize + 'px', fontFamily: 'Lexend Deca, sans-serif',
            fontStyle: 'bold', fill: color,
        })

    receivedDamageMSG.setShadow(2, 2, '#000', 2, false, true);
    receivedDamageMSG.alpha = 0;

    receivedDamageMSG.setOrigin(0.5, 0.5)

    simpleTextTweens(scene, receivedDamageMSG, x, y, 100, 0, duration[0], 1, () => {
        sleep(scene, duration[1], () => {

            simpleTextTweens(scene, receivedDamageMSG, x, y, 100, 0, duration[2], 0)
        })
    })
}