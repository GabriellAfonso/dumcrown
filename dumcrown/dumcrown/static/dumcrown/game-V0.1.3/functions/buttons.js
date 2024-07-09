import { matchDB, updatePhase } from '../client/match.js';

import { GAME } from '../config/gameConfig.js';
import { socket } from '../main.js';
import { sfx } from '../soundfx/sounds.js';
import { switchScenes } from './functions.js';

export class Button extends Phaser.GameObjects.Image {
    constructor(scene, x, y, key, callback, options = {}) {
        const { color = 0xffff00, clickSound = sfx.clickSound, hoverSound = null, useHoverEffect = false } = options;

        super(scene, x, y, key);
        scene.add.existing(this);

        this.setInteractive({ cursor: 'pointer' });

        this.normalScale = 1;
        this.hoverScale = 1.1;

        this.setupClickHandler(callback, clickSound);

        if (useHoverEffect) {
            this.setupHoverEffect(hoverSound);
        } else {
            this.setupColorEffect(color, hoverSound);
        }
    }

    setupClickHandler(callback, clickSound) {
        this.on('pointerup', () => {
            callback();
            if (clickSound) {
                clickSound.play();
            }
        });
    }

    setupHoverEffect(hoverSound) {
        this.on('pointerover', () => {
            if (hoverSound) {
                hoverSound.play();
            }
            this.scene.tweens.add({
                targets: this,
                scaleX: this.hoverScale,
                scaleY: this.hoverScale,
                duration: 200,
                ease: Phaser.Math.Easing.Linear,
            });
        });

        this.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this,
                scaleX: this.normalScale,
                scaleY: this.normalScale,
                duration: 200,
                ease: Phaser.Math.Easing.Linear,
            });
        });
    }

    setupColorEffect(color, hoverSound) {
        this.on('pointerover', () => {
            this.setTint(color);
            if (hoverSound) {
                hoverSound.play();
            }
        });

        this.on('pointerout', () => {
            this.clearTint();
        });
    }

}

export function close_button(scene, x, y, open, close, scale = 0.5) {
    const x_close = new Button(scene, x, y, 'x_close', () => {
        switchScenes(open, close)
    }, { clickSound: sfx.closeSound });
    x_close.setScale(scale)
    return x_close
}
