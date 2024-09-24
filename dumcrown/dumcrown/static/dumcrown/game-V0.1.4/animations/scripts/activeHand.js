import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";

export function activeHandAnimation(scene, target) {

    if (scene.myHand.length == 1) {
        scene.card1 = simpleTweens(scene, target[0], centerX, 680, 0.50, 2, 0, 300, () => {
            scene.hitFirstCard = scene.add.rectangle(centerX, 680, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = 0
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)
        })
    }

    if (scene.myHand.length == 2) {
        scene.card1 = simpleTweens(scene, target[0], centerX - 60, 680, 0.50, 2, -3, 300, () => {

            scene.hitFirstCard = scene.add.rectangle(centerX - 60, 680, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = -3
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)

        })

        scene.card2 = simpleTweens(scene, target[1], centerX + 60, 680, 0.50, 3, 3, 300, () => {
            scene.hitSecondCard = scene.add.rectangle(centerX + 60, 680, 328, 483, 0x000080);
            scene.hitSecondCard.alpha = scene.hitBoxVisibility
            scene.hitSecondCard.angle = 3
            scene.hitSecondCard.setDepth(scene.myHand[1].depth + 1)
            scene.hitSecondCard.setScale(0.50)
            scene.hitSecondCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSecondCard)
            scene.HandCardAnimation(scene.myHand[1], scene.hitSecondCard)
        })
    }

    if (scene.myHand.length == 3) {
        scene.card1 = simpleTweens(scene, target[0], centerX - 120, 685, 0.50, 2, -3, 300, () => {
            scene.hitFirstCard = scene.add.rectangle(centerX - 120, 685, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = -3
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)
        })
        scene.card2 = simpleTweens(scene, target[1], centerX, 680, 0.50, 3, 0, 300, () => {
            scene.hitSecondCard = scene.add.rectangle(centerX, 680, 328, 483, 0x000080);
            scene.hitSecondCard.alpha = scene.hitBoxVisibility
            scene.hitSecondCard.angle = 0
            scene.hitSecondCard.setDepth(scene.myHand[1].depth + 1)
            scene.hitSecondCard.setScale(0.50)
            scene.hitSecondCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSecondCard)
            scene.HandCardAnimation(scene.myHand[1], scene.hitSecondCard)
        })
        scene.card3 = simpleTweens(scene, target[2], centerX + 120, 685, 0.50, 4, 3, 300, () => {
            scene.hitThirdCard = scene.add.rectangle(centerX + 120, 685, 328, 483, 0x000080);
            scene.hitThirdCard.alpha = scene.hitBoxVisibility
            scene.hitThirdCard.angle = 3
            scene.hitThirdCard.setDepth(scene.myHand[2].depth + 1)
            scene.hitThirdCard.setScale(0.50)
            scene.hitThirdCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitThirdCard)
            scene.HandCardAnimation(scene.myHand[2], scene.hitThirdCard)
        })
    }


    if (scene.myHand.length == 4) {
        scene.card1 = simpleTweens(scene, target[0], centerX - 180, 690, 0.50, 2, -6, 300, () => {
            scene.hitFirstCard = scene.add.rectangle(centerX - 180, 690, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = -6
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)

        })
        scene.card2 = simpleTweens(scene, target[1], centerX - 70, 680, 0.50, 3, -3, 300, () => {
            scene.hitSecondCard = scene.add.rectangle(centerX - 70, 680, 328, 483, 0x000080);
            scene.hitSecondCard.alpha = scene.hitBoxVisibility
            scene.hitSecondCard.angle = -3
            scene.hitSecondCard.setDepth(scene.myHand[1].depth + 1)
            scene.hitSecondCard.setScale(0.50)
            scene.hitSecondCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSecondCard)
            scene.HandCardAnimation(scene.myHand[1], scene.hitSecondCard)
        })
        scene.card3 = simpleTweens(scene, target[2], centerX + 70, 680, 0.50, 4, 3, 300, () => {
            scene.hitThirdCard = scene.add.rectangle(centerX + 70, 680, 328, 483, 0x000080);
            scene.hitThirdCard.alpha = scene.hitBoxVisibility
            scene.hitThirdCard.angle = 3
            scene.hitThirdCard.setDepth(scene.myHand[2].depth + 1)
            scene.hitThirdCard.setScale(0.50)
            scene.hitThirdCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitThirdCard)
            scene.HandCardAnimation(scene.myHand[2], scene.hitThirdCard)
        })
        scene.card4 = simpleTweens(scene, target[3], centerX + 180, 690, 0.50, 5, 6, 300, () => {
            scene.hitFourthCard = scene.add.rectangle(centerX + 180, 690, 328, 483, 0x000080);
            scene.hitFourthCard.alpha = scene.hitBoxVisibility
            scene.hitFourthCard.angle = 6
            scene.hitFourthCard.setDepth(scene.myHand[3].depth + 1)
            scene.hitFourthCard.setScale(0.50)
            scene.hitFourthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFourthCard)
            scene.HandCardAnimation(scene.myHand[3], scene.hitFourthCard)
        })
    }

    if (scene.myHand.length == 5) {
        scene.card1 = simpleTweens(scene, target[0], centerX - 280, 730, 0.50, 2, -13, 300, () => {
            scene.hitFirstCard = scene.add.rectangle(centerX - 280, 730, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = -13
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)
        })
        scene.card2 = simpleTweens(scene, target[1], centerX - 150, 690, 0.50, 3, -5, 300, () => {
            scene.hitSecondCard = scene.add.rectangle(centerX - 150, 690, 328, 483, 0x000080);
            scene.hitSecondCard.alpha = scene.hitBoxVisibility
            scene.hitSecondCard.angle = -5
            scene.hitSecondCard.setDepth(scene.myHand[1].depth + 1)
            scene.hitSecondCard.setScale(0.50)
            scene.hitSecondCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSecondCard)
            scene.HandCardAnimation(scene.myHand[1], scene.hitSecondCard)
        })
        scene.card3 = simpleTweens(scene, target[2], centerX, 680, 0.50, 4, 0, 300, () => {
            scene.hitThirdCard = scene.add.rectangle(centerX, 680, 328, 483, 0x000080);
            scene.hitThirdCard.alpha = scene.hitBoxVisibility
            scene.hitThirdCard.angle = 0
            scene.hitThirdCard.setDepth(scene.myHand[2].depth + 1)
            scene.hitThirdCard.setScale(0.50)
            scene.hitThirdCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitThirdCard)
            scene.HandCardAnimation(scene.myHand[2], scene.hitThirdCard)
        })
        scene.card4 = simpleTweens(scene, target[3], centerX + 150, 690, 0.50, 5, 5, 300, () => {
            scene.hitFourthCard = scene.add.rectangle(centerX + 150, 690, 328, 483, 0x000080);
            scene.hitFourthCard.alpha = scene.hitBoxVisibility
            scene.hitFourthCard.angle = + 5
            scene.hitFourthCard.setDepth(scene.myHand[3].depth + 1)
            scene.hitFourthCard.setScale(0.50)
            scene.hitFourthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFourthCard)
            scene.HandCardAnimation(scene.myHand[3], scene.hitFourthCard)
        })
        scene.card5 = simpleTweens(scene, target[4], centerX + 280, 730, 0.50, 6, 13, 300, () => {
            scene.hitFifthCard = scene.add.rectangle(centerX + 280, 730, 328, 483, 0x000080);
            scene.hitFifthCard.alpha = scene.hitBoxVisibility
            scene.hitFifthCard.angle = + 13
            scene.hitFifthCard.setDepth(scene.myHand[4].depth + 1)
            scene.hitFifthCard.setScale(0.50)
            scene.hitFifthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFifthCard)
            scene.HandCardAnimation(scene.myHand[4], scene.hitFifthCard)
        })
    }


    if (scene.myHand.length == 6) {
        scene.card1 = simpleTweens(scene, target[0], centerX - 270, 705, 0.50, 2, -9, 300, () => {
            scene.hitFirstCard = scene.add.rectangle(centerX - 270, 705, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = -9
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)
        })

        scene.card2 = simpleTweens(scene, target[1], centerX - 180, 690, 0.50, 3, -6, 300, () => {
            scene.hitSecondCard = scene.add.rectangle(centerX - 180, 690, 328, 483, 0x000080);
            scene.hitSecondCard.alpha = scene.hitBoxVisibility
            scene.hitSecondCard.angle = -6
            scene.hitSecondCard.setDepth(scene.myHand[1].depth + 1)
            scene.hitSecondCard.setScale(0.50)
            scene.hitSecondCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSecondCard)
            scene.HandCardAnimation(scene.myHand[1], scene.hitSecondCard)
        })
        scene.card3 = simpleTweens(scene, target[2], centerX - 70, 680, 0.50, 4, -3, 300, () => {
            scene.hitThirdCard = scene.add.rectangle(centerX - 70, 680, 328, 483, 0x000080);
            scene.hitThirdCard.alpha = scene.hitBoxVisibility
            scene.hitThirdCard.angle = -3
            scene.hitThirdCard.setDepth(scene.myHand[2].depth + 1)
            scene.hitThirdCard.setScale(0.50)
            scene.hitThirdCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitThirdCard)
            scene.HandCardAnimation(scene.myHand[2], scene.hitThirdCard)
        })
        scene.card4 = simpleTweens(scene, target[3], centerX + 70, 680, 0.50, 5, 3, 300, () => {
            scene.hitFourthCard = scene.add.rectangle(centerX + 70, 680, 328, 483, 0x000080);
            scene.hitFourthCard.alpha = scene.hitBoxVisibility
            scene.hitFourthCard.angle = 3
            scene.hitFourthCard.setDepth(scene.myHand[3].depth + 1)
            scene.hitFourthCard.setScale(0.50)
            scene.hitFourthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFourthCard)
            scene.HandCardAnimation(scene.myHand[3], scene.hitFourthCard)
        })
        scene.card5 = simpleTweens(scene, target[4], centerX + 180, 690, 0.50, 6, 6, 300, () => {
            scene.hitFifthCard = scene.add.rectangle(centerX + 180, 690, 328, 483, 0x000080);
            scene.hitFifthCard.alpha = scene.hitBoxVisibility
            scene.hitFifthCard.angle = 6
            scene.hitFifthCard.setDepth(scene.myHand[4].depth + 1)
            scene.hitFifthCard.setScale(0.50)
            scene.hitFifthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFifthCard)
            scene.HandCardAnimation(scene.myHand[4], scene.hitFifthCard)
        })
        scene.card6 = simpleTweens(scene, target[5], centerX + 270, 705, 0.50, 7, 9, 300, () => {
            scene.hitSixthCard = scene.add.rectangle(centerX + 270, 705, 328, 483, 0x000080);
            scene.hitSixthCard.alpha = scene.hitBoxVisibility
            scene.hitSixthCard.angle = 9
            scene.hitSixthCard.setDepth(scene.myHand[5].depth + 1)
            scene.hitSixthCard.setScale(0.50)
            scene.hitSixthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSixthCard)
            scene.HandCardAnimation(scene.myHand[5], scene.hitSixthCard)
        })
    }


    if (scene.myHand.length == 7) {
        scene.card1 = simpleTweens(scene, target[0], centerX - 270, 705, 0.50, 2, -9, 300, () => {
            scene.hitFirstCard = scene.add.rectangle(centerX - 270, 705, 328, 483, 0x000080);
            scene.hitFirstCard.alpha = scene.hitBoxVisibility
            scene.hitFirstCard.angle = -9
            scene.hitFirstCard.setDepth(scene.myHand[0].depth + 1)
            scene.hitFirstCard.setScale(0.50)
            scene.hitFirstCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFirstCard)
            scene.HandCardAnimation(scene.myHand[0], scene.hitFirstCard)
        })
        scene.card2 = simpleTweens(scene, target[1], centerX - 180, 692, 0.50, 3, -6, 300, () => {
            scene.hitSecondCard = scene.add.rectangle(centerX - 180, 692, 328, 483, 0x000080);
            scene.hitSecondCard.alpha = scene.hitBoxVisibility
            scene.hitSecondCard.angle = -6
            scene.hitSecondCard.setDepth(scene.myHand[1].depth + 1)
            scene.hitSecondCard.setScale(0.50)
            scene.hitSecondCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSecondCard)
            scene.HandCardAnimation(scene.myHand[1], scene.hitSecondCard)
        })
        scene.card3 = simpleTweens(scene, target[2], centerX - 90, 683, 0.50, 4, -3, 300, () => {
            scene.hitThirdCard = scene.add.rectangle(centerX - 90, 683, 328, 483, 0x000080);
            scene.hitThirdCard.alpha = scene.hitBoxVisibility
            scene.hitThirdCard.angle = -3
            scene.hitThirdCard.setDepth(scene.myHand[2].depth + 1)
            scene.hitThirdCard.setScale(0.50)
            scene.hitThirdCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitThirdCard)
            scene.HandCardAnimation(scene.myHand[2], scene.hitThirdCard)
        })
        scene.card4 = simpleTweens(scene, target[3], centerX, 680, 0.50, 5, 0, 300, () => {
            scene.hitFourthCard = scene.add.rectangle(centerX, 680, 328, 483, 0x000080);
            scene.hitFourthCard.alpha = scene.hitBoxVisibility
            scene.hitFourthCard.angle = 0
            scene.hitFourthCard.setDepth(scene.myHand[3].depth + 1)
            scene.hitFourthCard.setScale(0.50)
            scene.hitFourthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFourthCard)
            scene.HandCardAnimation(scene.myHand[3], scene.hitFourthCard)
        })
        scene.card5 = simpleTweens(scene, target[4], centerX + 90, 683, 0.50, 6, 3, 300, () => {
            scene.hitFifthCard = scene.add.rectangle(centerX + 90, 683, 328, 483, 0x000080);
            scene.hitFifthCard.alpha = scene.hitBoxVisibility
            scene.hitFifthCard.angle = 3
            scene.hitFifthCard.setDepth(scene.myHand[4].depth + 1)
            scene.hitFifthCard.setScale(0.50)
            scene.hitFifthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitFifthCard)
            scene.HandCardAnimation(scene.myHand[4], scene.hitFifthCard)
        })
        scene.card6 = simpleTweens(scene, target[5], centerX + 180, 692, 0.50, 7, 6, 300, () => {
            scene.hitSixthCard = scene.add.rectangle(centerX + 180, 692, 328, 483, 0x000080);
            scene.hitSixthCard.alpha = scene.hitBoxVisibility
            scene.hitSixthCard.angle = 6
            scene.hitSixthCard.setDepth(scene.myHand[5].depth + 1)
            scene.hitSixthCard.setScale(0.50)
            scene.hitSixthCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSixthCard)
            scene.HandCardAnimation(scene.myHand[5], scene.hitSixthCard)
        })
        scene.card7 = simpleTweens(scene, target[6], centerX + 270, 705, 0.50, 8, 9, 300, () => {
            scene.hitSeventhCard = scene.add.rectangle(centerX + 270, 705, 328, 483, 0x000080);
            scene.hitSeventhCard.alpha = scene.hitBoxVisibility
            scene.hitSeventhCard.angle = 9
            scene.hitSeventhCard.setDepth(scene.myHand[6].depth + 1)
            scene.hitSeventhCard.setScale(0.50)
            scene.hitSeventhCard.setInteractive();
            scene.cardsHitBoxGroup.add(scene.hitSeventhCard)
            scene.HandCardAnimation(scene.myHand[6], scene.hitSeventhCard)
        })
    }

}
