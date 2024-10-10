import { centerX, centerY } from "../../config/gameConfig.js";
import { sleep } from "../../functions/functions.js";
import { simpleTweens } from "../scripts/functions.js";

export function showCard(scene, CardObject, finalX) {

    const verseCard = scene.add.image(346 - 10, 669 - 7, 'verse_card');
    verseCard.setScale(0.4)

    simpleTweens(scene, verseCard, '-=150', '-=20', 0.4, 90, 0, 300, () => {
        simpleTweens(scene, verseCard, finalX, centerY, 0.54, 90, 0, 300, () => {
            var card = CardObject;
            card.setPosition(finalX, centerY);
            card.scaleX = 0;
            card.scaleY = 0.54;
            card.depth = 5

            scene.tweens.add({
                targets: verseCard,
                scaleX: 0,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    CardObject.setVisible(true)
                    verseCard.destroy();
                }
            });

            scene.tweens.add({
                targets: CardObject,
                scaleX: 0.54,
                delay: 100,
                duration: 100,
                ease: 'Linear',
            });
        })
    })



}


export function initialDraw(scene, cards) {

    showCard(scene, cards[0], centerX - 300)

    sleep(scene, 300, () => {
        showCard(scene, cards[1], centerX - 100)
    })
    sleep(scene, 600, () => {
        showCard(scene, cards[2], centerX + 100)
    })
    sleep(scene, 900, () => {
        showCard(scene, cards[3], centerX + 300)
    })
}