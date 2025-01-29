
import { player, setmusicVolume, setSondsVolume } from '../client/client.js';

import { GAME, centerX, centerY } from '../config/gameConfig.js';

import { switchScenes, logoutAjax, toggleFullscreen } from '../functions/functions.js';
import { sendSocket } from '../functions/functions.js';
import { areYouInGame, setAreYouInGame } from '../client/client.js';
import { room } from '../client/room.js';
import { sfx } from '../soundfx/sounds.js';
import { Button } from '../functions/buttons.js';

export class ConfigScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'ConfigScreen' });
        this.previousScene = 'HomeScene'
    }

    create() {

        const soundfx = this.scene.get('Loading');
        //TODO armazenar cena que usou pra entrar e voltar pra ela ao sair

        const background = this.add.image(centerX, centerY, 'config_background');
        background.setInteractive({ cursor: 'default' })
        const x_close = new Button(this, 1440, 40, 'x_close', () => {
            if (this.previousScene == 'HomeScene') {
                switchScenes('HomeScene', 'ConfigScreen')
                return
            }
            GAME.scene.stop('ConfigScreen')

        }, { color: 0xffff00, clickSound: sfx.closeSound });
        x_close.setScale(0.4)

        this.aba_select = this.add.image(191, 65, 'aba_select');

        if (this.previousScene == 'DumMatch') {
            this.giveup = new Button(this, 600, 700, 'giveup', () => {
                sendSocket('give_up')
                this.game.scene.stop('ConfigScreen')
            });
            this.giveup.setScale(0.8)

        } else {
            this.logout = new Button(this, 600, 700, 'logout', () => {
                logoutAjax();
            });
        }




        var soundContainer = this.add.container(0, 0);
        soundContainer.visible = false;

        const geral = new Button(this, 192.5, 65, 'geral', () => {
            soundContainer.visible = false;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 65, 'aba_select');
        }, { color: 0xffffff, clickSound: sfx.uiselect });

        const audio = new Button(this, 192.5, 205, 'audio', () => {
            soundContainer.visible = true;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 205, 'aba_select');
        }, { color: 0xffffff, clickSound: sfx.uiselect });

        const conta = new Button(this, 192.5, 345, 'conta', () => {
            soundContainer.visible = false;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 345, 'aba_select');
        }, { color: 0xffffff, clickSound: sfx.uiselect });

        const sobre = new Button(this, 192.5, 495, 'sobre', () => {
            soundContainer.visible = false;
            this.aba_select.destroy();
            this.aba_select = this.add.image(191, 495, 'aba_select');
        }, { color: 0xffffff, clickSound: sfx.uiselect });

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
    setPreviousScene(sceneKey) {
        this.previousScene = sceneKey;
    }

    update() {
        if (areYouInGame && !this.giveup) {
            this.logout.destroy()

        }
    }
}
