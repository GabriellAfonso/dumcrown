import { simpleTweens } from "./functions.js";
import { centerX, centerY } from "../../config/gameConfig.js";
import { sleep } from "../../functions/functions.js";


export function attackCardsCrashAnimation(scene) {
    var time = 850
    //depois fazer um sleep pra ir de um em um
    if (Object.keys(scene.yourCardsOnArena).length == 1) {
        simpleTweens(scene,
            scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX, 560, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX, 460, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['0']['ID']],
                                centerX, 490, 0.38, 1, 0, 500)
                        })

                    })
            })
    }

    if (Object.keys(scene.yourCardsOnArena).length == 2) {
        simpleTweens(scene,
            scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 70, 560, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 70, 460, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['0']['ID']],
                                centerX - 70, 490, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX + 70, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX + 70, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['1']['ID']],
                                    centerX + 70, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })


    }

    if (Object.keys(scene.yourCardsOnArena).length == 3) {

        simpleTweens(scene,
            scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 135, 560, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 135, 460, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['0']['ID']],
                                centerX - 135, 490, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['1']['ID']],
                                    centerX, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 2, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['2']['ID']], centerX + 135, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['2']['ID']], centerX + 135, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['2']['ID']],
                                    centerX + 135, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })

    }

    if (Object.keys(scene.yourCardsOnArena).length == 4) {
        simpleTweens(scene,
            scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 210, 560, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 210, 460, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['0']['ID']],
                                centerX - 210, 490, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX - 70, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX - 70, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['1']['ID']],
                                    centerX - 70, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })

        sleep(scene, time * 2, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['2']['ID']], centerX + 70, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['2']['ID']], centerX + 70, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['2']['ID']],
                                    centerX + 70, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 3, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['3']['ID']], centerX + 210, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['3']['ID']], centerX + 210, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['3']['ID']],
                                    centerX + 210, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
    }



    if (Object.keys(scene.yourCardsOnArena).length == 5) {
        simpleTweens(scene,
            scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 270, 560, 0.42, 1, 0, 400, () => {
                simpleTweens(scene,
                    scene.yourCards[scene.yourCardsOnArena['0']['ID']], centerX - 270, 460, 0.38, 1, 0, 200, () => {
                        sleep(scene, 100, () => {
                            simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['0']['ID']],
                                centerX - 270, 490, 0.38, 1, 0, 500)
                        })

                    })
            })
        sleep(scene, time, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX - 135, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['1']['ID']], centerX - 135, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['1']['ID']],
                                    centerX - 135, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 2, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['2']['ID']], centerX, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['2']['ID']], centerX, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['2']['ID']],
                                    centerX, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 3, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['3']['ID']], centerX + 135, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['3']['ID']], centerX + 135, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['3']['ID']],
                                    centerX + 135, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })
        sleep(scene, time * 4, () => {
            simpleTweens(scene,
                scene.yourCards[scene.yourCardsOnArena['4']['ID']], centerX + 270, 560, 0.42, 1, 0, 400, () => {
                    simpleTweens(scene,
                        scene.yourCards[scene.yourCardsOnArena['4']['ID']], centerX + 270, 460, 0.38, 1, 0, 200, () => {
                            sleep(scene, 100, () => {
                                simpleTweens(scene, scene.yourCards[scene.yourCardsOnArena['4']['ID']],
                                    centerX + 270, 490, 0.38, 1, 0, 500)
                            })

                        })
                })
        })

    }
}