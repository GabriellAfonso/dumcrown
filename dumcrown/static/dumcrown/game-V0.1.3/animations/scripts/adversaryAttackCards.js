import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";
import { sleep } from "../../functions/functions.js";


export function adversaryAttackCardsCrashAnimation(scene) {
    var time = 850
    //depois fazer um sleep pra ir de um em um
    if (Object.keys(scene.adversaryCardsAttack).length == 1) {
        simpleTweens(scene,
            scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX, 210, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX, 310, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
                                centerX, 280, 0.38, 1, 0, 500)
                        })

                    })
            })
    }

    if (Object.keys(scene.adversaryCardsAttack).length == 2) {
        simpleTweens(scene,
            scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 70, 210, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 70, 310, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
                                centerX - 70, 280, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX + 70, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX + 70, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
                                    centerX + 70, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })


    }

    if (Object.keys(scene.adversaryCardsAttack).length == 3) {

        simpleTweens(scene,
            scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 135, 210, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 135, 310, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
                                centerX - 135, 280, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
                                    centerX, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 2, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']], centerX + 135, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']], centerX + 135, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']],
                                    centerX + 135, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })

    }

    if (Object.keys(scene.adversaryCardsAttack).length == 4) {
        simpleTweens(scene,
            scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 210, 210, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 210, 310, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
                                centerX - 210, 280, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX - 70, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX - 70, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
                                    centerX - 70, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })

        sleep(scene, time * 2, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']], centerX + 70, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']], centerX + 70, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']],
                                    centerX + 70, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 3, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']], centerX + 210, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']], centerX + 210, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']],
                                    centerX + 210, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
    }



    if (Object.keys(scene.adversaryCardsAttack).length == 5) {
        simpleTweens(scene,
            scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 270, 210, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']], centerX - 270, 310, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['1']['ID']],
                                centerX - 270, 280, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX - 135, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']], centerX - 135, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['2']['ID']],
                                    centerX - 135, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 2, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']], centerX, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']], centerX, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['3']['ID']],
                                    centerX, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 3, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']], centerX + 135, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']], centerX + 135, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['4']['ID']],
                                    centerX + 135, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 4, () => {
            simpleTweens(scene,
                scene.adversaryCards[scene.adversaryCardsAttack['5']['ID']], centerX + 270, 210, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.adversaryCards[scene.adversaryCardsAttack['5']['ID']], centerX + 270, 310, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.adversaryCards[scene.adversaryCardsAttack['5']['ID']],
                                    centerX + 270, 280, 0.38, 1, 0, 500)
                            })

                        })
                })
        })

    }
}