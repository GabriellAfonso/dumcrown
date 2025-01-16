import { centerX, centerY, GAME } from "../../config/gameConfig.js";
import { Botao, switchScenes } from "../../functions/functions.js";


export function gameWin(scene, crystal, points) {
    const victory_screen = scene.add.image(centerX, centerY, 'victory_background')
    victory_screen.alpha = 0
    victory_screen.scale = 2
    victory_screen.setInteractive()

    const victory_text = scene.add.image(centerX, centerY - 80, 'victory_text')
    victory_text.alpha = 0
    victory_text.scale = 0

    scene.gameOverAnimation = scene.tweens.add({
        targets: victory_screen,
        depth: 90,
        alpha: 1,
        duration: 1000,
        scale: 1,
        ease: 'Linear',
        onComplete: () => {
            scene.tweens.add({
                targets: victory_text,
                depth: 91,
                alpha: 1,
                duration: 500,
                scale: 0.5,
                ease: 'Linear',
                onComplete: () => {


                    const crystals = scene.add.image(centerX - 120, centerY + 80, 'crystals')
                    const crownPoints = scene.add.image(centerX + 80, centerY + 78, 'crown_points')
                    crystals.alpha = 0
                    crownPoints.alpha = 0

                    const continue_button = new Botao(scene, centerX, 650, 'exit_button', () => {
                        switchScenes('HomeScene', 'DumMatch');
                        const soundfx = scene.scene.get('Loading');
                        soundfx.arena_music.stop()
                        soundfx.music.play()
                        soundfx.music.setLoop(true);

                    }, 0xffff00,);
                    continue_button.alpha = 0

                    crystals.scale = 0.8
                    crownPoints.scale = 0.8
                    continue_button.scale = 0.5



                    scene.crystals_text = scene.add.text(centerX - 80, centerY + 80, '+' + crystal,
                        {
                            fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                            fontStyle: 'bold', fill: '#fff'
                        })

                    scene.crystals_text.setShadow(2, 2, '#000', 2, false, true);
                    scene.crystals_text.alpha = 0;
                    scene.crystals_text.setOrigin(0.5, 0.5)

                    scene.crownP_text = scene.add.text(centerX + 125, centerY + 80, '+' + points,
                        {
                            fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                            fontStyle: 'bold', fill: '#fff'
                        })

                    scene.crownP_text.setShadow(2, 2, '#000', 2, false, true);
                    scene.crownP_text.alpha = 0;
                    scene.crownP_text.setOrigin(0.5, 0.5)


                    scene.tweens.add({
                        targets: [crystals, crownPoints, scene.crystals_text, scene.crownP_text],
                        depth: 91,
                        alpha: 1,
                        duration: 500,
                        ease: 'Linear',
                        onComplete: () => {
                            scene.tweens.add({
                                targets: continue_button,
                                depth: 91,
                                delay: 200,
                                alpha: 1,
                                duration: 300,
                                ease: 'Linear',
                            })
                        }
                    })

                },
            })
        },
    })
}



export function gameLoss(scene, crystal, points) {
    const loss_screen = scene.add.image(centerX, centerY, 'loss_background')
    loss_screen.alpha = 0
    loss_screen.scale = 2
    loss_screen.setInteractive()

    const loss_text = scene.add.image(centerX, centerY - 80, 'loss_text')
    loss_text.alpha = 0
    loss_text.scale = 0

    scene.gameOverAnimation = scene.tweens.add({
        targets: loss_screen,
        depth: 90,
        alpha: 1,
        duration: 1000,
        scale: 1,
        ease: 'Linear',
        onComplete: () => {
            scene.tweens.add({
                targets: loss_text,
                depth: 91,
                alpha: 1,
                duration: 500,
                scale: 0.5,
                ease: 'Linear',
                onComplete: () => {


                    const crystals = scene.add.image(centerX - 120, centerY + 80, 'crystals')
                    const crownPoints = scene.add.image(centerX + 80, centerY + 78, 'crown_points')
                    crystals.alpha = 0
                    crownPoints.alpha = 0

                    const continue_button = new Botao(scene, centerX, 650, 'exit_button', () => {

                        switchScenes('HomeScene', 'DumMatch');
                        const soundfx = scene.scene.get('Loading');
                        soundfx.arena_music.stop()
                        soundfx.music.play()
                        soundfx.music.setLoop(true);
                        // var match = getScene
                        // GAME.scene.getScene('DumMatch')

                    }, 0xffff00,);
                    continue_button.alpha = 0

                    crystals.scale = 0.8
                    crownPoints.scale = 0.8
                    continue_button.scale = 0.5



                    scene.crystals_text = scene.add.text(centerX - 80, centerY + 80, '+' + crystal,
                        {
                            fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                            fontStyle: 'bold', fill: '#fff'
                        })

                    scene.crystals_text.setShadow(2, 2, '#000', 2, false, true);
                    scene.crystals_text.alpha = 0;
                    scene.crystals_text.setOrigin(0.5, 0.5)

                    scene.crownP_text = scene.add.text(centerX + 125, centerY + 80, points,
                        {
                            fontSize: '25px', fontFamily: 'Lexend Deca, sans-serif',
                            fontStyle: 'bold', fill: '#ff0000'
                        })

                    scene.crownP_text.setShadow(2, 2, '#000', 2, false, true);
                    scene.crownP_text.alpha = 0;
                    scene.crownP_text.setOrigin(0.5, 0.5)


                    scene.tweens.add({
                        targets: [crystals, crownPoints, scene.crystals_text, scene.crownP_text],
                        depth: 91,
                        alpha: 1,
                        duration: 500,
                        ease: 'Linear',
                        onComplete: () => {
                            scene.tweens.add({
                                targets: continue_button,
                                depth: 91,
                                delay: 200,
                                alpha: 1,
                                duration: 300,
                                ease: 'Linear',
                            })
                        }
                    })

                },
            })
        },
    })
}

