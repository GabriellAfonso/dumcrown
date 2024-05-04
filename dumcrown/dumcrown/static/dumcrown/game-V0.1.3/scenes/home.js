import { GAME, centerX, centerY } from '../config/gameConfig.js';


import { player, experienceUpdated, setExperienceUpdated, players_online, latency_ms } from '../client/client.js';

import { toggleFullscreen, switchScenes } from '../functions/functions.js';
import { sfx } from '../soundfx/sounds.js';
import { Botao } from '../functions/functions.js';
import { Button, close_button } from '../functions/buttons.js';
import { add_text } from '../functions/texts.js'

import { sendSocket } from '../functions/functions.js';
import { CardObject, JhonCopper } from '../cards/base.js';

class Ping {
    constructor(scene, x, y) {
        this.scene = scene;
        this.initialize(scene, x, y)
    }

    initialize(scene, x, y) {
        this.ping = scene.add.image(x, y, 'signal01');
        // this.ping.setScale(0.06)
        this.ms = add_text(scene, x + 35, y, latency_ms, '16px', 0.5)
        this.update()
    }

    latencyCheck() {
        if (latency_ms <= 70) {
            return 'signal01'
        }

        if (latency_ms <= 180) {
            return 'signal02'
        }

        if (latency_ms <= 300) {
            return 'signal03'
        }

        return 'signal04'
    }

    update() {
        this.updatePing = setInterval(() => {
            this.ping.setTexture(this.latencyCheck())
            this.ms.setText(latency_ms)
        }, 1000)
    }
}
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



export class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
    }


    create() {
        sendSocket('get_player_data')
        const soundfx = this.scene.get('Loading');
        this.scale.fullscreenTarget = document.getElementById('game-display');

        const background = this.add.image(centerX, centerY, 'homescreen');
        const lor = this.add.image(centerX - 200, centerY, 'runeterra');
        lor.setScale(1.05)
        var testando = new JhonCopper(this)

        const fullscreen_button = new Botao(this, 1465, 35, 'fullscreen', () => {
            toggleFullscreen();
        }, 0xffffff);
        fullscreen_button.setScale(0.40);


        this.name = add_text(this, 218, 35, player.nickname, '28px')
        this.level = add_text(this, 223, 106, 'Lv: ' + player.level, '25px')

        const perfil = new Botao(this, 115, 105, player.icon, () => {
            switchScenes('PerfilScene', 'HomeScene');

        }, 0xffffff, soundfx.clickSound);

        perfil.setScale(0.5);

        const border_perfil = this.add.image(115, 105, player.border)
        border_perfil.setScale(0.5)

        const EXPBAR = new ExpBar(this)

        const crystal = this.add.image(550, 45, 'crystals');

        const crystalNumber = add_text(this, 575, 30, player.crystalsCoins, '25px')

        const ConfigButton = new Button(this, 1390, 35, 'config_button', () => {
            switchScenes('ConfigScreen', 'HomeScene');
        });

        const StoreButton = new Button(this, 100, 725, 'store_button', () => {
            switchScenes('StoreScreen', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const missionsButton = new Button(this, 214, 725, 'missions_button', () => {
            switchScenes('MissionsScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const decksButton = new Button(this, 328, 725, 'decks_button', () => {
            switchScenes('DecksScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const friendsButton = new Button(this, 442, 725, 'friends_button', () => {
            switchScenes('FriendsScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const emailButton = new Button(this, 556, 725, 'email_button', () => {
            switchScenes('EmailsScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });
        const rankingButton = new Button(this, 670, 725, 'ranking_button', () => {
            sendSocket('get_ranking')
        }, { hoverSound: sfx.houverSound });


        const playButton = new Button(this, 1280, 640, 'play_button', () => {
            switchScenes('GameLobby', 'HomeScene');
        }, { useHoverEffect: true });



        this.mouseText = this.add.text(centerX, 10, '', { fontSize: '20px', fill: '#ffffff' },);
        this.input.on('pointermove', (pointer) => {
            // Atualize o texto com as coordenadas do mouse
            this.mouseText.setText('X: ' + pointer.x + ' Y: ' + pointer.y);
        });

        this.PingSignal = new Ping(this, 1260, 28)

        this.addEvents()


    }

    update() {


    }

    addEvents() {
        this.title = add_text(this, 954, 35, 'DECKS', '30px', 0.5)
        this.events.on('stop', () => {
            clearTimeout(this.PingSignal.updatePing);
        });
    }


}
