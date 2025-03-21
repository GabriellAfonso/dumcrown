import { GAME, centerX, centerY } from '../config/gameConfig.js';


import { player, experienceUpdated, setExperienceUpdated, players_online, latency_ms, cardsDATA } from '../client/client.js';

import { toggleFullscreen, switchScenes } from '../functions/functions.js';
import { sfx } from '../soundfx/sounds.js';
import { Button, close_button } from '../functions/buttons.js';
import { add_text } from '../functions/texts.js'

import { sendSocket } from '../functions/functions.js';
import { instantiateCards } from '../cards/functions.js';
import { DeckLayout } from '../objects/deck_layout.js';
import { unitCardObject, compressedCardObject } from '../cards/base.js';
import { simpleTextTweens } from '../animations/scripts/functions.js';

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
        if (latency_ms <= 100) {
            return 'signal01'
        }

        if (latency_ms <= 250) {
            return 'signal02'
        }

        if (latency_ms <= 400) {
            return 'signal03'
        }

        return 'signal04'
    }

    update() {
        this.pingUpdate = this.scene.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => {
                if (this.ping) {
                    this.ping.setTexture(this.latencyCheck());
                    this.ms.setText(latency_ms);
                }
            }
        });
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
        this.completeNoActiveDeckMsg = true
        this.scale.fullscreenTarget = document.getElementById('game-display');

        const background = this.add.image(centerX, centerY, 'homescreen');

        const fullscreen_button = new Button(this, 1465, 35, 'fullscreen', () => {
            toggleFullscreen();
        });
        fullscreen_button.setScale(0.40);


        this.name = add_text(this, 218, 35, player.nickname, '28px')
        this.level = add_text(this, 223, 106, 'Lv: ' + player.level, '25px')

        const perfil = new Button(this, 115, 105, player.icon, () => {
            switchScenes('PerfilScene', 'HomeScene');

        }, { color: 0xcccccc, });

        perfil.setScale(0.5);
        var data = {
            "image": "khras_card",
            "name": "KHRAS",
            "description": "Que show da xuxa é esse???",
            "energy": 4,
            "attack": 8,
            "defense": 6,
        }

        const border_perfil = this.add.image(115, 105, player.border)
        border_perfil.setScale(0.5)

        const EXPBAR = new ExpBar(this)

        const crystal = this.add.image(550, 45, 'crystals');

        const crystalNumber = add_text(this, 575, 30, player.crystalsCoins, '25px')

        const ConfigButton = new Button(this, 1390, 35, 'config_button', () => {
            this.scene.get('ConfigScreen').setPreviousScene('HomeScene');
            switchScenes('ConfigScreen', 'HomeScene');

        });

        const StoreButton = new Button(this, 100, 725, 'store_button', () => {
            switchScenes('StoreScreen', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const missionsButton = new Button(this, 214, 725, 'missions_button', () => {
            //disabled
            // switchScenes('MissionsScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const decksButton = new Button(this, 328, 725, 'decks_button', () => {
            switchScenes('DecksScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const friendsButton = new Button(this, 442, 725, 'friends_button', () => {
            //disabled
            // switchScenes('FriendsScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });

        const emailButton = new Button(this, 556, 725, 'email_button', () => {
            sfx.cardSound01.play()
            //disabled
            // switchScenes('EmailsScene', 'HomeScene');
        }, { hoverSound: sfx.houverSound });
        const rankingButton = new Button(this, 670, 725, 'ranking_button', () => {
            sendSocket('get_ranking')
        }, { hoverSound: sfx.houverSound });


        const playButton = new Button(this, 1280, 640, 'play_button', () => {
            if (player.current_deck) {
                switchScenes('GameLobby', 'HomeScene');
            }
            else {
                this.noActiveDeckMsg()
            }
        }, { useHoverEffect: true });


        this.PingSignal = new Ping(this, 1260, 28)

        this.addEvents()


    }

    update() {


    }

    noActiveDeckMsg() {
        if (this.completeNoActiveDeckMsg) {
            this.completeNoActiveDeckMsg = false

            this.message = this.add.text(centerX, centerY - 50, 'Você precisa de um deck ativo para jogar',
                {
                    fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
                    fontStyle: 'bold', fill: '#FFD700'
                })
            this.message.alpha = 0
            this.message.setOrigin(0.5)
            this.messageAnimation = simpleTextTweens(this, this.message, centerX, centerY, 10, 0, 200, 1, () => {
                simpleTextTweens(this, this.message, centerX, centerY, 10, 0, 500, 0, () => {
                    this.completeNoActiveDeckMsg = true
                }, 1400)
            })
        }
    }

    addEvents() {
        this.events.on('stop', () => {

        });
    }
}