import { centerX, centerY } from "../../config/gameConfig.js";
import { sleep } from "../../functions/functions.js";
import { cardsToSwap, clearCardsToSwap, SwapButton } from "../../match_objects/swapButton.js";
import { simpleTweens } from "../scripts/functions.js";
import Logger from "../../objects/logger.js";
import { sfx } from "../../soundfx/sounds.js";
const log = new Logger()
log.enableGroup('all')

export function showCard(scene, cardObject, finalX,) {
    log.info('initialDrawn', 'Comprou a carta ' + cardObject.getID())
    const verseCard = scene.add.image(336, 662, 'verse_card');
    verseCard.setScale(0.4)



    simpleTweens(scene, verseCard, '-=150', '-=20', 0.4, 90, 0, 300, () => {
        sfx.flipcardSound01.play()
        simpleTweens(scene, verseCard, finalX, centerY, 0.54, 90, 0, 300, () => {
            var card = cardObject;
            card.setPosition(finalX, centerY);
            card.angle = 0
            card.scaleX = 0;
            card.scaleY = 0.54;
            card.depth = 5

            scene.tweens.add({
                targets: verseCard,
                scaleX: 0,
                duration: 100,
                ease: 'Linear',
                onComplete: () => {
                    cardObject.setVisible(true)
                    verseCard.destroy();

                }
            });

            scene.tweens.add({
                targets: cardObject,
                scaleX: 0.54,
                delay: 100,
                duration: 100,
                ease: 'Linear',
            });
        })
    })



}


// export function initialDraw(scene, cards) {

//     showCard(scene, cards[0], centerX - 300)

//     sleep(scene, 300, () => {
//         showCard(scene, cards[1], centerX - 100)
//     })
//     sleep(scene, 600, () => {
//         showCard(scene, cards[2], centerX + 100)
//     })
//     sleep(scene, 900, () => {
//         showCard(scene, cards[3], centerX + 300)
//     })



//     sleep(scene, 2000, () => {
//         showSwap(scene, cards[0], centerX - 300)
//         showSwap(scene, cards[1], centerX - 100)
//         showSwap(scene, cards[2], centerX + 100)
//         showSwap(scene, cards[3], centerX + 300)
//     })

// }

var swapButons = []

export function showSwap(scene, cardObject, finalX) {
    const swapButon = new SwapButton(scene, finalX, centerY + 160, cardObject)
    swapButon.setScale(0.35)
    swapButon.setAlpha(0)
    swapButons.push(swapButon)

    simpleTweens(scene, swapButon, finalX, centerY + 160, 0.35, 1, 0, 1100, null, 1)
    return swapButon
}
export function removeCard(scene, cardObject) {
    log.info('initialDrawn', 'subistituiu a carta ' + cardObject.getID())
    var scale = cardObject.scale
    const verseCard = scene.add.image(cardObject.x, cardObject.y, 'verse_card');
    verseCard.setScale(scale)
    verseCard.scaleX = 0
    sfx.flipcardSound01.play()
    scene.tweens.add({
        targets: cardObject,
        scaleX: 0,
        duration: 200,
        ease: 'Linear',
        onComplete: () => {
            cardObject.setVisible(false)
            scene.tweens.add({
                targets: verseCard,
                scaleX: scale,
                duration: 200,
                ease: 'Linear',
                onComplete: () => {
                    sfx.cardSound02.play({ rate: 0.7 })
                    scene.tweens.add({
                        targets: verseCard,
                        x: 336,
                        y: 662,
                        depth: 0,
                        scale: 0.38,
                        duration: 700,
                        ease: 'Linear',
                        onComplete: () => {
                            verseCard.destroy()
                        }
                    });
                }
            });

        }
    });

}

export function removeSwapButtons() {
    log.info('initialDrawn', 'removendo SwapButtons')
    clearCardsToSwap()
    if (swapButons) {
        swapButons.forEach(button => {
            button.destroy()
        })
    }

}

export function disableSwapButtons() {
    log.info('initialDrawn', 'desabilitando botoes de swap')
    if (swapButons) {
        swapButons.forEach(button => {
            button.setVisible(false)
            // button.disableInteractive()
        })
    }
}