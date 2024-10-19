
import { player } from '../client/client.js';
import { matchData as match } from '../client/match.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { sendSocket } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { cardsToSwap } from './swapButton.js';

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
        this.button.setTexture(this.buttonTexture[this.buttonState])
        this.buttonText.text = this.text
        if (this.buttonState) {
            this.button.setInteractive({ cursor: 'pointer' })
            return
        }
        this.button.disableInteractive()
    }
    createButton() {
        console.log('criando o botao')
        console.log(this.buttonTexture[this.buttonState])

        this.button = this.scene.add.image(1396, centerY, this.buttonTexture[this.buttonState]);
        this.buttonText = add_text(this.scene, 1396, centerY, this.text, '30px', 0.5)
        this.setEvents()
    }
    setEvents() {
        this.button.on('pointerup', () => {
            this.button.disableInteractive()
            console.log(this.text)
            if (this.text == 'Pronto') {
                console.log('mandando pro servidor', cardsToSwap)
                var data = {
                    match_id: match.id,
                    cards: cardsToSwap,
                }
                sendSocket('swap_cards', data)

            }
            //com base no texto do botao definir oq ele vai fazer
        });
    }
}
