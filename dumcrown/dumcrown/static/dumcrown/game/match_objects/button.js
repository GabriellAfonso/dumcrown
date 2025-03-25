
import { disableSwapButtons, removeSwapButtons } from '../animations/match/initialDraw.js';
import { player } from '../client/client.js';
import { matchData as match } from '../client/match.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { sendSocket } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { cardsToSwap } from './swapButton.js';
import Logger from '../objects/logger.js';
import { sfx } from '../soundfx/sounds.js';

const log = new Logger()
log.enableGroup('all')

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchButton {
    constructor(scene) {
        this.scene = scene
        this.buttonTexture = ['default_board_button', 'default_board_button_active']
        this.turn = match.turn; // Indica de quem é a vez (pode ser 1 ou 2)
        this.offensiveTurn = match.offensive_turn; // Indica de quem é o turno ofensivo do round
        this.history = []

    }


    get player() {
        return this.get_player();
    }


    get_player() {
        if (match.player1.id === player.id) {
            return match.player1;
        }
        return match.player2;
    }
    get text() {
        return this.player.button_text
    }
    get buttonState() {
        return this.player.button_state
    }

    update() {
        log.info('matchButton', 'Atualizando matchButton')

        //TODO fazer um barulho toda vez que ficar disponivel pra clicar
        this.button.setTexture(this.buttonTexture[this.buttonState])
        this.buttonText.text = this.text
        if (this.buttonState) {
            this.button.setInteractive({ cursor: 'pointer' })
            return
        }
        this.button.disableInteractive()
    }
    waiting() {
        log.info('matchButton', 'Ativando modo aguarde')
        this.button.setTexture(this.buttonTexture[0])
        this.buttonText.text = 'AGUARDE'
        this.button.disableInteractive()
    }
    createButton() {
        log.info('matchButton', 'Criando MatchButton')

        this.button = this.scene.add.image(1396, centerY, this.buttonTexture[0]);
        this.button.depth = 90
        this.buttonText = add_text(this.scene, 1396, centerY, '', '25px', 0.5)
        this.buttonText.setAlign('center');
        this.buttonText.setWordWrapWidth(180, true);
        this.buttonText.setStyle({ fontStyle: 'bold' });
        this.buttonText.depth = 91
        this.setEvents()

    }
    setEvents() {
        log.info('matchButton', 'Setando eventos')

        this.button.on('pointerup', () => {
            this.button.disableInteractive()

            sfx.pressButton.play()

            //TODO usar this.text em uma tabela hash pra executar algo em especifico O(1)
            if (this.text == 'PRONTO') {
                var data = {
                    match_id: match.id,
                    cards: cardsToSwap,
                }
                sendSocket('ready', data)
                disableSwapButtons()
            }

            else if (this.text == 'SUA VEZ') {
                // console.log('passou a vez')
                sendSocket('player_pass', match.id)

            }
            else if (this.text == 'ATACAR') {
                sendSocket('player_clash', match.id)
            }
            else if (this.text == 'DEFENDER') {
                // console.log('mandou player clash pro servidor')
                sendSocket('player_clash', match.id)
            }

        });


        this.button.on('pointerover', () => {
            if (this.text == 'SUA VEZ') {
                sfx.hoverButton.play()
                this.buttonText.text = 'PASSAR'
                //TODO fazer som qunado passar o mouse e ficar mais claro tipo selecionado
            }
        });
        this.button.on('pointerout', () => {
            if (this.text == 'SUA VEZ') {
                sfx.hoverButton.play()
                this.buttonText.text = this.text
            }
        });
    }
}
