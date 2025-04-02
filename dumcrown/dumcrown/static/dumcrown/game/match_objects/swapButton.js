import { sfx } from "../soundfx/sounds.js";

export let cardsToSwap = {}

export class SwapButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, card) {
        super(scene, x, y, 'swap_button');

        scene.add.existing(this);
        this.mode = true

        this.setInteractive({ cursor: 'pointer' });

        this.on('pointerup', () => {
            if (this.mode) {
                cardsToSwap[card.id] = card.id;
                sfx.swapDo.play()
                this.setTexture('swap_button_undo')
                card.swapMode()
                this.mode = false
                console.log(cardsToSwap)
                return
            }
            delete cardsToSwap[card.id];
            sfx.swapUndo.play()
            this.setTexture('swap_button')
            card.swapMode('undo')
            this.mode = true


        });

    }

}

export function clearCardsToSwap() {
    cardsToSwap = {}
    console.log(cardsToSwap)
} 