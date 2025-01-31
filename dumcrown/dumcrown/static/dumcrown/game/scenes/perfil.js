import { GAME, centerX, centerY } from '../config/gameConfig.js';


import { player, experienceUpdated, setExperienceUpdated, players_online, latency_ms } from '../client/client.js';

import { toggleFullscreen, switchScenes } from '../functions/functions.js';
import { sfx } from '../soundfx/sounds.js';
import { Button, close_button } from '../functions/buttons.js';
import { add_text } from '../functions/texts.js'

import { sendSocket } from '../functions/functions.js';

export class PerfilScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PerfilScene' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const perfil_background = this.add.image(centerX, centerY, 'perfil_background');


        const perfil = new Button(this, 315, 210, player.icon, () => {
            close.disableInteractive();
            perfil.disableInteractive();
            switchScenes('IconPage', 'HomeScene');
        }, { color: 0xcccccc });
        perfil.setScale(0.7);

        const border_perfil = this.add.image(315, 210, player.border)
        border_perfil.setScale(0.7)

        const tier = this.add.image(315, 450, player.tier)
        tier.setScale(0.4)

        this.name = add_text(this, 315, 350, player.nickname, '28px', 0.5)

        this.partidas = add_text(this, 315, 550, 'Partidas: ' + player.matches, '28px', 0.5)
        this.vitorias = add_text(this, 315, 600, 'Vitórias: ' + player.victories, '28px', 0.5)
        this.derrotas = add_text(this, 315, 650, 'Derrotas: ' + player.defeats, '28px', 0.5)

        var rate = 0
        if (player.matches) {
            rate = (player.victories / player.matches) * 100
        }
        this.winrate = add_text(this, 315, 700,
            'Taxa de vitorias: ' + rate.toFixed(1) + '%', '28px', 0.5)


        const close = close_button(this, 1440, 40, 'HomeScene', 'PerfilScene')

    }


    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}

