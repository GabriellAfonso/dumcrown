import { player } from "../client/client.js";
import { add_text } from "../functions/texts.js";

export class ExpBar {
    constructor(scene) {
        this.scene = scene;
        this.initialize(scene)
    }

    initialize(scene) {
        var expToUp = player.level * 100;
        var progress = player.experience / expToUp;

        var expBox = scene.add.rectangle(221, 140, 162, 7, 0x222222, 1);
        expBox.setOrigin(0)
        expBox.setInteractive();

        var expBar = scene.add.graphics();
        expBar.fillStyle(0xFFA500, 1);
        expBar.fillRect(221, 140, 162 * progress, 7);


        this.progressBox = scene.add.rectangle(216, 160, 172, 50, 0x222222, 1);
        this.progressBox.setOrigin(0)

        this.progressNumbers = add_text(scene, 302, 185,
            'EXP: ' + player.experience + '/' + expToUp, '18px', 0.5)
        this.toggleVisibility(false)

        var levelContainer = scene.add.container()
        levelContainer.setSize(172, 20)
        levelContainer.setPosition(302, 144)
        levelContainer.setInteractive()

        // var containerRect = scene.add.rectangle(
        //     levelContainer.x, levelContainer.y,
        //     levelContainer.width, levelContainer.height, 0xCCCCCC, 0.4);
        // containerRect.setStrokeStyle(2, 0x000000);
        // containerRect.setOrigin(0.5);

        var pressed = false

        levelContainer.on('pointerup', () => {
            pressed = true
            this.toggleVisibility(true)
        });

        levelContainer.on('pointerover', () => {
            this.toggleVisibility(true)
        });

        levelContainer.on('pointerout', () => {
            if (!pressed) {
                this.toggleVisibility(false)
            }

        });
        scene.input.on('pointerdown', () => {
            if (pressed) {
                pressed = false
                this.toggleVisibility(false)
            }
        });
    }

    toggleVisibility(isVisible) {
        this.progressBox.setVisible(isVisible);
        this.progressNumbers.setVisible(isVisible);
    }

}