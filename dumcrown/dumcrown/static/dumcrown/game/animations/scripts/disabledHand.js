import { simpleTweens } from "./functions.js";

export function disabledHandAnimation(scene, target) {

    if (scene.myHand.length == 1) {
        simpleTweens(scene, target[0], 1310, 695, 0.40, 1, 0, 300)
    }
    if (scene.myHand.length == 2) {
        simpleTweens(scene, target[0], 1270, 695, 0.40, 1, -5, 300)
        simpleTweens(scene, target[1], 1340, 695, 0.40, 2, 5, 300)
    }
    if (scene.myHand.length == 3) {
        simpleTweens(scene, target[0], 1230, 700, 0.40, 1, -4, 300)
        simpleTweens(scene, target[1], 1300, 695, 0.40, 2, -1, 300)
        simpleTweens(scene, target[2], 1370, 700, 0.40, 3, 4, 300)
    }
    if (scene.myHand.length == 4) {
        simpleTweens(scene, target[0], 1165, 722, 0.40, 1, -15, 300)
        simpleTweens(scene, target[1], 1230, 705, 0.40, 2, -6, 300)
        simpleTweens(scene, target[2], 1295, 700, 0.40, 3, -4, 300)
        simpleTweens(scene, target[3], 1360, 695, 0.40, 4, 0, 300)
    }
    if (scene.myHand.length == 5) {
        simpleTweens(scene, target[0], 1160, 722, 0.40, 1, -15, 300)
        simpleTweens(scene, target[1], 1210, 712, 0.40, 2, -10, 300)
        simpleTweens(scene, target[2], 1265, 705, 0.40, 3, -6, 300)
        simpleTweens(scene, target[3], 1330, 700, 0.40, 4, -4, 300)
        simpleTweens(scene, target[4], 1390, 698, 0.40, 5, 0, 300)
    }
    if (scene.myHand.length == 6) {
        simpleTweens(scene, target[0], 1200, 722, 0.40, 1, -15, 300)
        simpleTweens(scene, target[1], 1230, 712, 0.40, 2, -10, 300)
        simpleTweens(scene, target[2], 1265, 705, 0.40, 3, -6, 300)
        simpleTweens(scene, target[3], 1310, 700, 0.40, 4, -4, 300)
        simpleTweens(scene, target[4], 1350, 698, 0.40, 5, -1, 300)
        simpleTweens(scene, target[5], 1410, 696, 0.40, 6, 0, 300)
    }
    if (scene.myHand.length == 7) {
        simpleTweens(scene, target[0], 1185, 719, 0.40, 1, -15, 300)
        simpleTweens(scene, target[1], 1215, 712, 0.40, 2, -10, 300)
        simpleTweens(scene, target[2], 1250, 706, 0.40, 3, -6, 300)
        simpleTweens(scene, target[3], 1290, 702, 0.40, 4, -4, 300)
        simpleTweens(scene, target[4], 1335, 698, 0.40, 5, -2, 300)
        simpleTweens(scene, target[5], 1380, 696, 0.40, 6, -1, 300)
        simpleTweens(scene, target[6], 1420, 696, 0.40, 7, 0, 300)
    }

}


function rightHandOrganization(delCard = '') {

    this.rightHandHitBox.setInteractive({ cursor: 'pointer' })
    this.cancelHand.disableInteractive()

    if (this.cardAnimation) {
        this.cardAnimation.stop()
    }
    if (this.finishCardAnimation) {

        this.finishCardAnimation.stop()
    }


    if (this.hitFirstCard) {

        this.hitFirstCard.destroy()
    }
    if (this.hitSecondCard) {
        this.hitSecondCard.destroy()
    }
    if (this.hitThirdCard) {
        this.hitThirdCard.destroy()
    }
    if (this.hitFourthCard) {
        this.hitFourthCard.destroy()
    }
    if (this.hitFifthCard) {
        this.hitFifthCard.destroy()
    }

    if (this.hitSixthCard) {
        this.hitSixthCard.destroy()
    }
    if (this.hitSeventhCard) {
        this.hitSeventhCard.destroy()
    }


    if (this.card1) {
        this.card1.stop()
    }
    if (this.card2) {
        this.card2.stop()
    }
    if (this.card3) {
        this.card3.stop()
    }
    if (this.card4) {
        this.card4.stop()
    }
    if (this.card5) {
        this.card5.stop()
    }
    if (this.card6) {
        this.card6.stop()
    }
    if (this.card7) {
        this.card7.stop()
    }


    if (delCard) {


        const indice = this.myHand.indexOf(delCard);

        if (indice !== -1) {
            this.myHand.splice(indice, 1);

        } else {
            // console.log("Elemento não encontrado na lista");
        }

        // console.log(this.myHand); // A lista agora não contém mais o elemento 3.

    }





}
