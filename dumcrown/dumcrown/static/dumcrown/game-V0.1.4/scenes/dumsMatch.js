import { matchData } from "../client/match.js";
import { showCoordinates } from "../functions/functions.js";
import { MatchManager } from "../match_objects/match.js";

export class DumMatch extends Phaser.Scene {
    constructor() {
        super({ key: 'DumMatch' });
    }


    create() {

        this.startAnimation()
        this.match = new MatchManager(this, matchData)
        // showCoordinates(this)

    }



    update() {

    }

    startAnimation() {
        const camera = this.cameras.main;
        camera.setZoom(2);
        camera.setAlpha(0)

        this.tweens.add({
            targets: camera,
            alpha: 1,
            duration: 1300,
            ease: 'Power2',
        });
        this.tweens.add({
            targets: camera,
            zoom: 1,
            duration: 3000,
            ease: 'Power2',
        });
    }

}