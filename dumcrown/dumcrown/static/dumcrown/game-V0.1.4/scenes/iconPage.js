import { GAME, centerX, centerY } from '../config/gameConfig.js';


import { player, experienceUpdated, setExperienceUpdated, players_online, latency_ms } from '../client/client.js';

import { toggleFullscreen, switchScenes, showCoordinates } from '../functions/functions.js';
import { sfx } from '../soundfx/sounds.js';
import { Botao } from '../functions/functions.js';
import { Button, close_button } from '../functions/buttons.js';
import { add_text } from '../functions/texts.js'

import { sendSocket } from '../functions/functions.js';


export class IconPage extends Phaser.Scene {
    constructor() {
        super({ key: 'IconPage' });
    }

    create() {
        const soundfx = this.scene.get('Loading');
        showCoordinates(this)
        this.background = this.add.graphics();
        this.background.fillStyle(0x222222, 0.85);
        this.background.fillRect(0, 0, 1500, 800);

        const iconpage_background = this.add.image(centerX, centerY, 'iconpage_background');
        this.icon_em_uso = this.add.image(1105, 360, player.icon);
        this.icon_em_uso.setScale(0.4);

        this.border_em_uso = this.add.image(1105, 360, player.border);
        this.border_em_uso.setScale(0.4);

        this.arena_em_uso = this.add.image(1105, 360, player.arena);
        this.arena_em_uso.setScale(0.05);

        const x_close = new Botao(this, 1170, 150, 'x_close', () => {
            GAME.scene.stop('IconPage');
            GAME.scene.stop('PerfilScene')
            GAME.scene.run('PerfilScene')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)

        this.aba_select = this.add.image(406, 250, 'aba_select');
        this.aba_select.setScale(0.64);

        var iconsContainer = this.add.container(0, 0);
        iconsContainer.visible = true;
        var bordersContainer = this.add.container(0, 0);
        bordersContainer.visible = false;
        var arenasContainer = this.add.container(0, 0);
        arenasContainer.visible = false;

        //icons
        const icon_khras = new Botao(this, 620, 270, 'chibi_khras', () => {
            sendSocket('icon_change', 'chibi_khras');
            sendSocket('get_player_data');
            this.icon_em_uso.destroy();
            this.icon_em_uso = this.add.image(1105, 360, 'chibi_khras');
            this.icon_em_uso.setScale(0.4);

        }, 0xeeeeee, soundfx.snapclick);
        icon_khras.setScale(0.3)

        const icon_kronos = new Botao(this, 745, 270, 'chibi_kronos', () => {
            sendSocket('icon_change', 'chibi_kronos');
            sendSocket('get_player_data');
            this.icon_em_uso.destroy();
            this.icon_em_uso = this.add.image(1105, 360, 'chibi_kronos');
            this.icon_em_uso.setScale(0.4);
        }, 0xeeeeee, soundfx.snapclick);
        icon_kronos.setScale(0.3)

        const icon_lda = new Botao(this, 870, 270, 'chibi_lda', () => {
            sendSocket('icon_change', 'chibi_lda');
            sendSocket('get_player_data');
            this.icon_em_uso.destroy();
            this.icon_em_uso = this.add.image(1105, 360, 'chibi_lda');
            this.icon_em_uso.setScale(0.4);
        }, 0xeeeeee, soundfx.snapclick);
        icon_lda.setScale(0.3)

        iconsContainer.add(icon_khras);
        iconsContainer.add(icon_kronos);
        iconsContainer.add(icon_lda);


        //border
        const border01 = new Botao(this, 620, 270, 'border01', () => {
            sendSocket('border_change', 'border01');
            sendSocket('get_player_data');
            this.border_em_uso.destroy();
            this.border_em_uso = this.add.image(1105, 360, 'border01');
            this.border_em_uso.setScale(0.4);

        }, 0xeeeeee, soundfx.snapclick);
        border01.setScale(0.3)

        const border02 = new Botao(this, 745, 270, 'border02', () => {
            sendSocket('border_change', 'border02');
            sendSocket('get_player_data');
            this.border_em_uso.destroy();
            this.border_em_uso = this.add.image(1105, 360, 'border02');
            this.border_em_uso.setScale(0.4);
        }, 0xeeeeee, soundfx.snapclick);
        border02.setScale(0.3)

        const border03 = new Botao(this, 870, 270, 'border03', () => {
            sendSocket('border_change', 'border03');
            sendSocket('get_player_data');
            this.border_em_uso.destroy();
            this.border_em_uso = this.add.image(1105, 360, 'border03');
            this.border_em_uso.setScale(0.4);
        }, 0xeeeeee, soundfx.snapclick);
        border03.setScale(0.3)

        bordersContainer.add(border01);
        bordersContainer.add(border02);
        bordersContainer.add(border03);


        //arenas

        const arena01 = new Botao(this, 620, 270, 'arena01', () => {
            sendSocket('arena_change', 'arena01');
            sendSocket('get_player_data');
            this.arena_em_uso.destroy();
            this.arena_em_uso = this.add.image(1105, 360, 'arena01');
            this.arena_em_uso.setScale(0.05);

        }, 0xeeeeee, soundfx.snapclick);
        arena01.setScale(0.05)

        const arena02 = new Botao(this, 830, 270, 'arena02', () => {
            sendSocket('arena_change', 'arena02');
            sendSocket('get_player_data');
            this.arena_em_uso.destroy();
            this.arena_em_uso = this.add.image(1105, 360, 'arena02');
            this.arena_em_uso.setScale(0.05);
        }, 0xeeeeee, soundfx.snapclick);
        arena02.setScale(0.05)

        arenasContainer.add(this.arena_em_uso)
        arenasContainer.add(arena01)
        arenasContainer.add(arena02)

        const aba_icone = new Botao(this, 407, 250, 'aba_icone', () => {
            aba_icone.setDepth(1)
            this.icon_em_uso.visible = true
            this.border_em_uso.visible = true
            this.arena_em_uso.visible = false

            bordersContainer.visible = false;
            arenasContainer.visible = false;
            iconsContainer.visible = true;
            this.aba_select.destroy();
            this.aba_select = this.add.image(406, 250, 'aba_select')
            this.aba_select.setScale(0.64);

        }, 0xffffff, soundfx.uiselect);


        const aba_moldura = new Botao(this, 407, 355, 'aba_moldura', () => {
            aba_moldura.setDepth(1)
            this.icon_em_uso.visible = true
            this.border_em_uso.visible = true
            this.arena_em_uso.visible = false

            iconsContainer.visible = false;
            arenasContainer.visible = false;
            bordersContainer.visible = true;
            this.aba_select.destroy();
            this.aba_select = this.add.image(406, 355, 'aba_select')
            this.aba_select.setScale(0.64);

        }, 0xffffff, soundfx.uiselect);

        const aba_arena = new Botao(this, 407, 460, 'aba_arena', () => {
            aba_arena.setDepth(1)
            this.icon_em_uso.visible = false
            this.border_em_uso.visible = false
            this.arena_em_uso.visible = true

            iconsContainer.visible = false;
            bordersContainer.visible = false;
            arenasContainer.visible = true;
            this.aba_select.destroy();
            this.aba_select = this.add.image(406, 460, 'aba_select')
            this.aba_select.setScale(0.64);

        }, 0xffffff, soundfx.uiselect);


    }


    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}
