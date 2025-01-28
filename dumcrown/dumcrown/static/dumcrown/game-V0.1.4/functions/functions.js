import { matchData, updatePhase } from '../client/match.js';

import { GAME, centerX } from '../config/gameConfig.js';
import { socket } from '../main.js';
import { sfx } from '../soundfx/sounds.js';


export class Botao extends Phaser.GameObjects.Image {
    constructor(scene, x, y, key, callback,
        color = 0xffff00, clickSound = null, hoverSound = null, useHoverEffect = false) {
        super(scene, x, y, key);

        this.setInteractive({ cursor: 'pointer' });

        this.normalScale = 1;
        this.hoverScale = 1.1;

        this.on('pointerup', () => {
            callback();
            if (clickSound) {
                clickSound.play();
            }
        });

        scene.add.existing(this);

        if (useHoverEffect) {
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
        } else {
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
}




export class MasterButton extends Phaser.GameObjects.Image {
    constructor(scene, x, y, callback,
        color = 0x00FA9A, clickSound = null) {

        super(scene, x, y, 'button_off');

        this.buttonText = new Phaser.GameObjects.Text(scene, x, y + 3, 'Iniciando', {
            fontSize: '30px', fontFamily: 'Lexend Deca, sans-serif',
            fontStyle: 'bold', fill: '#fff'
        })
        this.buttonText.setOrigin(0.5, 0.7)
        this.buttonText.depth = 11

        scene.add.existing(this, this.buttonText);
        scene.add.existing(this.buttonText);

        this.buttonActive = false
        this.buttonMode = 'off'

        this.write = ''




        this.on('pointerup', () => {
            callback();


            if (this.buttonMode === 'ready') {
                this.setMode('wait')
                sendSocket('ready', matchData.id)
            } else if (this.buttonMode === 'pass') {

                if (matchData.phase != 4) {
                    sendSocket('pass', matchData.id)
                }
                if (matchData.phase == 4) {
                    updatePhase(5)
                    this.setMode('wait')
                    if (scene.firstDefeseHitBox) {
                        scene.firstDefeseHitBox.destroy()
                    }
                    if (scene.secondDefeseHitBox) {
                        scene.secondDefeseHitBox.destroy()
                    }
                    if (scene.thirdDefeseHitBox) {
                        scene.thirdDefeseHitBox.destroy()
                    }
                    if (scene.fourthDefeseHitBox) {
                        scene.fourthDefeseHitBox.destroy()
                    }
                    if (scene.fifthDefeseHitBox) {
                        scene.fifthDefeseHitBox.destroy()
                    }
                    scene.resolveDict[scene.iAm] = scene.yourDefeseCards
                    scene.resolveDict[scene.enemyAre] = scene.adversaryCardsAttack
                    sendSocket('resolve', [matchData.id, scene.resolveDict])


                }
            }

            if (clickSound) {
                clickSound.play();
            }
        });



        this.on('pointerover', () => {
            this.setTint(color);
        });
        this.on('pointerout', () => {
            this.clearTint();
        });



    }
    powerOFF() {
        this.buttonActive = false
        this.disableInteractive()
        this.setTexture('button_off')
        this.clearTint();
    }
    powerON() {
        this.buttonActive = true
        this.setInteractive({ cursor: 'pointer' });
        this.setTexture('button_on')
    }
    setMode(mode) {
        this.buttonMode = mode

        if (mode === 'ready') {
            this.buttonText.text = 'Pronto'
        }
        if (mode === 'wait') {
            this.buttonText.text = 'Aguarde'
            this.powerOFF()
        }
        if (mode === 'pass') {

            if (matchData.phase == 3) {
                this.buttonText.text = 'Atacar'
            }
            else if (matchData.phase == 4) {
                this.buttonText.text = 'Resolver'
            } else {
                this.buttonText.text = 'passar'
            }
            this.powerON()
        }
    }
}

export function sendSocket(code, data = '') {
    var message = {
        code: code,
        data: data,
    };
    socket.send(JSON.stringify(message));
}


export function toggleFullscreen() {
    if (GAME.scale.isFullscreen) {
        // Se o jogo já estiver em tela cheia, saia do modo de tela cheia
        GAME.scale.stopFullscreen();
    } else {
        // Se o jogo não estiver em tela cheia, entre no modo de tela cheia
        GAME.scale.startFullscreen();
    }
}

export function switchScenes(sceneToStart, sceneToStop = '') {
    var scene = GAME.scene.getScene(sceneToStop);
    scene.events.emit('stop');
    GAME.scene.stop(sceneToStop);
    GAME.scene.stop(sceneToStart);
    GAME.scene.run(sceneToStart, { null: null });
}

export function startScene(scene) {
    var sceneIsActive = GAME.scene.isActive(scene)
    if (sceneIsActive) {
        return
    }
    GAME.scene.start(scene);
}


export function sleep(scene, delay, callback) {
    scene.time.addEvent({
        delay: delay,
        callback: callback,
        callbackScope: scene,
        loop: false,
    });
}


export function showCoordinates(scene) {
    scene.mouseText = scene.add.text(centerX, 30, '', { fontSize: '20px', fill: '#ffffff' },);
    scene.mouseText.setOrigin(0.5)
    scene.input.on('pointermove', (pointer) => {
        scene.mouseText.setText('X: ' + pointer.x + ' Y: ' + pointer.y);
    });
}

export function removeFromList(list, target) {
    const indice = list.indexOf(target);
    console.log('o indice é', indice)
    if (indice !== -1) {
        list.splice(indice, 1);

    } else {
        console.log("Elemento não encontrado na lista");
    }
    return list
}

export function logoutAjax() {
    $.ajax({
        type: 'GET',
        url: '/logout/',  // Substitua pela URL correta do seu endpoint de logout
        success: function (data) {
            window.location.href = "/logout/";
            console.log('Logout successful');
            // Implemente qualquer lógica adicional após o logout, como redirecionamento
        },
        error: function () {
            console.log('Logout failed');
        }
    });
}


