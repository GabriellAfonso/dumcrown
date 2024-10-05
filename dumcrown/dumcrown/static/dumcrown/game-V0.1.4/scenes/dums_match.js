import { matchData } from "../client/match.js";
import { MatchManager } from "../match_objects/match.js";

export class DumMatch extends Phaser.Scene {
    constructor() {
        super({ key: 'DumMatch' });
    }


    create() {


        const camera = this.cameras.main;

        // Definindo o zoom inicial (1 é o tamanho normal, valores maiores fazem zoom in)
        camera.setZoom(2);
        camera.setAlpha(0)

        // Definindo um evento de zoom com duração de 1 segundo (1000 ms)
        // let blurEffect = camera.preFX.addBlur(5);

        this.tweens.add({
            targets: camera,
            alpha: 1,
            duration: 1300,
            ease: 'Power2',
            onComplete: () => {

            }
        });
        this.tweens.add({
            targets: camera,
            zoom: 1,
            duration: 3000,
            ease: 'Power2',
            onComplete: () => {

            }
        });

        this.match = new MatchManager(this, matchData)
        this.match.start()


    }



    update() {

    }


}