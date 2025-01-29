import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { Button } from '../functions/buttons.js';

import { switchScenes, logoutAjax, sendSocket } from '../functions/functions.js';



import { add_text } from '../functions/texts.js';
import { sfx } from '../soundfx/sounds.js';

export class FriendsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FriendsScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'friends_background');
        const building = this.add.image(centerX, centerY, 'building');
        const x_close = new Button(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'FriendsScene')
        }, { color: 0xffff00, clickSound: sfx.closeSound });
        x_close.setScale(0.5)
        // this.textA = add_text(this, centerX - 100, centerY + 100, 'Resize', '20px', 0.5)
        // this.textB = add_text(this, centerX + 100, centerY + 100, 'Resize', '200px', 0.5)
        // this.textB.setScale(0.1)
        // const cardL = this.add.image(centerX - 200, centerY, 'cdc_card');
        // const cardH = this.add.image(centerX + 200, centerY, 'qualit2');

        // cardH.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        // // cardH.setDisplaySize(328, 483)
        // cardL.setScale(0.28)
        // // cardH.setScale(0.05)
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
