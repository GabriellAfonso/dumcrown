import { GAME, centerX, centerY } from '../config/gameConfig.js';


import { player, experienceUpdated, setExperienceUpdated, players_online } from '../client/client.js';

import { toggleFullscreen, switchScenes } from '../functions/functions.js';

import { Botao } from '../functions/functions.js';
import { add_text } from '../functions/texts.js'

import { sendSocket } from '../functions/functions.js';


class ExpBar {
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



export class HomeScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScreen' });
    }


    create() {
        sendSocket('get_player_data')
        const soundfx = this.scene.get('Loading');
        this.scale.fullscreenTarget = document.getElementById('game-display');

        const background = this.add.image(centerX, centerY, 'homescreen');

        const fullscreen_button = new Botao(this, 1465, 35, 'fullscreen', () => {
            toggleFullscreen();
        }, 0xffffff);
        fullscreen_button.setScale(0.40);

        let circle = this.add.circle(1200, 40, 10, 0x00FF00);
        circle.setFillStyle(0x00FF00, 1);

        this.playersOnline = add_text(this, 1220, 28, players_online, '20px')

        this.name = add_text(this, 218, 35, player.nickname, '28px')
        this.level = add_text(this, 223, 106, 'Lv: ' + player.level, '25px')

        const perfil = new Botao(this, 115, 105, player.icon, () => {
            switchScenes('Perfil', 'HomeScreen');

        }, 0xffffff, soundfx.clickSound);

        perfil.setScale(0.5);

        const border_perfil = this.add.image(115, 105, player.border)
        border_perfil.setScale(0.5)

        const EXPBAR = new ExpBar(this)

        const crystal = this.add.image(550, 45, 'crystals');

        const crystalNumber = add_text(this, 575, 30, player.crystalsCoins, '25px')


        const config = new Botao(this, 1390, 35, 'config', () => {
            switchScenes('ConfigScreen', 'HomeScreen');
        }, 0xffff00, soundfx.clickSound);

        const loja = new Botao(this, 100, 725, 'loja', () => {
            sendSocket('add_experience', 2000)
            switchScenes('StoreScreen', 'HomeScreen');
        }, 0xffff00, soundfx.clickSound, soundfx.hoverSound);

        const missoes = new Botao(this, 214, 725, 'missoes', () => {
            switchScenes('MissionsScreen', 'HomeScreen');
        }, 0xffff00, soundfx.clickSound, soundfx.hoverSound);

        const deck = new Botao(this, 328, 725, 'deck', () => {
            switchScenes('DecksScreen', 'HomeScreen');
        }, 0xffff00, soundfx.clickSound, soundfx.hoverSound);

        const amigos = new Botao(this, 442, 725, 'amigos', () => {
            switchScenes('FriendsScreen', 'HomeScreen');
        }, 0xffff00, soundfx.clickSound, soundfx.hoverSound);

        const envelope = new Botao(this, 556, 725, 'envelope', () => {
            switchScenes('EmailsScreen', 'HomeScreen');
        }, 0xffff00, soundfx.clickSound, soundfx.hoverSound);

        const podio = new Botao(this, 670, 725, 'podio', () => {
            sendSocket('get_ranking')
        }, 0xffff00, soundfx.clickSound, soundfx.hoverSound);

        const jogo = new Botao(this, 1280, 640, 'play_button', () => {
            switchScenes('GameLobby', 'HomeScreen');
        }, 0xffffff, soundfx.clickSound, null, true);

        this.mouseText = this.add.text(centerX, 10, '', { fontSize: '20px', fill: '#ffffff' },);

        // Adicione um evento de 'pointermove' à cena
        this.input.on('pointermove', (pointer) => {
            // Atualize o texto com as coordenadas do mouse
            this.mouseText.setText('X: ' + pointer.x + ' Y: ' + pointer.y);
        });


    }

    update() {
        this.playersOnline.text = players_online

    }


}

export class Perfil extends Phaser.Scene {
    constructor() {
        super({ key: 'Perfil' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

        const perfil_background = this.add.image(centerX, centerY, 'perfil_background');


        const perfil = new Botao(this, 315, 210, player.icon, () => {
            x_close.disableInteractive();
            perfil.disableInteractive();
            switchScenes('IconPage', 'HomeScreen');
        }, 0xcccccc, soundfx.clickSound);
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


        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScreen', 'Perfil')
        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)


    }


    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}


export class IconPage extends Phaser.Scene {
    constructor() {
        super({ key: 'IconPage' });
    }

    create() {
        const soundfx = this.scene.get('Loading');

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
            GAME.scene.stop('Perfil')
            GAME.scene.run('Perfil')
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

