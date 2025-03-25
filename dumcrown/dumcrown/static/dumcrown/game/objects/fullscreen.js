import { GAME } from "../config/gameConfig.js";
import { Button } from "../functions/buttons.js";


export class Fullscreen {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initialize(scene, x, y)
    }

    initialize(scene, x, y) {
        this.fullscreen_button = new Button(scene, x, y, 'fullscreen_on', () => {
            GAME.scale.toggleFullscreen()
            this.toggleTexture()
        });
        this.fullscreen_button.setScale(0.40);

    }

    toggleTexture() {
        if (this.fullscreen_button.texture.key == 'fullscreen_on') {
            this.fullscreen_button.setTexture('fullscreen_off')
            return
        }
        this.fullscreen_button.setTexture('fullscreen_on')

    }
}