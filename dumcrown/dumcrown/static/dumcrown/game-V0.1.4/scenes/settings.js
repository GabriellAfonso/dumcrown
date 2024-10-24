
import { player, setmusicVolume, setSondsVolume } from '../client/client.js';

import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax } from '../functions/functions.js';


import { Botao } from '../functions/functions.js';
import { sendSocket } from '../functions/functions.js';
import { areYouInGame, setAreYouInGame } from '../client/client.js';
import { room } from '../client/room.js';

export class ConfigScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ConfigScreen' });
    }

    create() {

        const soundfx = this.scene.get('Loading');

        const background = this.add.image(centerX, centerY, 'config_background');
        const x_close = new Botao(this, 1440, 40, 'x_close', () => {
            switchScenes('HomeScene', 'ConfigScreen')

        }, 0xffff00, soundfx.closeSound);
        x_close.setScale(0.5)

        this.aba_select = this.add.image(191, 65, 'aba_select');

        this.logout = new Botao(this, 600, 700, 'logout', () => {
            logoutAjax();
        }, 0xffffff, soundfx.clickSound);

        // const save = new Botao(this, 1300, 700, 'save_config', () => {


        // }, 0xffffff);

        var soundContainer = this.add.container(0, 0);
        soundContainer.visible = false;

        const geral = new Botao(this, 192.5, 65, 'geral', () => {
            soundContainer.visible = false;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 65, 'aba_select');
        }, 0xffffff, soundfx.uiselect);

        const audio = new Botao(this, 192.5, 205, 'audio', () => {
            soundContainer.visible = true;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 205, 'aba_select');
        }, 0xffffff, soundfx.uiselect);

        const conta = new Botao(this, 192.5, 345, 'conta', () => {
            soundContainer.visible = false;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 345, 'aba_select');
        }, 0xffffff, soundfx.uiselect);

        const sobre = new Botao(this, 192.5, 495, 'sobre', () => {
            soundContainer.visible = false;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 495, 'aba_select');
        }, 0xffffff, soundfx.uiselect);

        //music Volume bar
        this.musicVolumeBar = document.createElement("input");
        this.musicVolumeBar.type = "range"; // Defina o tipo de input como range para criar uma barra de deslizamento
        this.musicVolumeBar.min = "0";
        this.musicVolumeBar.max = "2";
        this.musicVolumeBar.step = "0.01";
        this.musicVolumeBar.value = player.musicVolume; // Defina o valor inicial com base no globalVolume
        this.musicVolumeBar.style.width = "300px";
        this.musicVolumeBar.style.height = "50px";
        this.musicVolumeBar.style.position = "absolute";

        //sounds Volume bar
        this.soundsVolumeBar = document.createElement("input");
        this.soundsVolumeBar.type = "range"; // Defina o tipo de input como range para criar uma barra de deslizamento
        this.soundsVolumeBar.min = "0";
        this.soundsVolumeBar.max = "2";
        this.soundsVolumeBar.step = "0.01";
        this.soundsVolumeBar.value = player.soundsVolume; // Defina o valor inicial com base no globalVolume
        this.soundsVolumeBar.style.width = "300px";
        this.soundsVolumeBar.style.height = "50px";
        this.soundsVolumeBar.style.position = "absolute";


        const volumeMusic = this.add.dom(570, 190, this.musicVolumeBar);
        const soundMusic = this.add.dom(570, 290, this.soundsVolumeBar);

        const musica = this.add.text(425, 130, 'MÚSICA', {
            fontSize: '28px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });

        const sons = this.add.text(425, 230, 'EFEITOS SONOROS', {
            fontSize: '28px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });

        this.musicVolumeBar.addEventListener('input', this.volumeChange.bind(this));
        this.soundsVolumeBar.addEventListener('input', this.soundfxChange.bind(this));



        soundContainer.add(musica);
        soundContainer.add(sons);
        soundContainer.add(volumeMusic);
        soundContainer.add(soundMusic);
    }

    volumeChange(event) {
        const newVolume = parseFloat(event.target.value);
        setmusicVolume(newVolume)
        sendSocket('sound_update', { 'musicVolume': newVolume, 'sondsVolume': player.soundsVolume });

    }

    soundfxChange(event) {
        const newVolume = parseFloat(event.target.value);
        setSondsVolume(newVolume)
        sendSocket('sound_update', { 'musicVolume': player.musicVolume, 'sondsVolume': newVolume });

    }


    update() {
        if (areYouInGame && !this.giveup) {
            this.logout.destroy()
            this.giveup = new Botao(this, 600, 700, 'giveup', () => {
                // mandar desistir pro server
                setAreYouInGame(false)
                sendSocket('give_up', room.id)
                this.game.scene.stop('ConfigScreen')
                this.giveup = null
            }, 0xffffff);
            this.giveup.setScale(0.8)
        }
    }
}
