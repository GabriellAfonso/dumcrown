
import { player } from '../client/client.js';
import { centerX, centerY } from '../config/gameConfig.js';
import { add_text } from '../functions/texts.js';

// essa classe vai apenas receber dados e gerenciar a parte visual
//vai ser criado uma instancia pra cada player entao tenho que configurar a visao de cada um

//talvez deixar essa classe só pra criar o visual?
// só instanciar card quando ela for comprada
export class MatchButton {
    constructor(scene, match) {
        this.scene = scene
        this.buttonState = match.button_state
        this.buttonTexture = ['default_board_button', 'default_board_button_active']

        this.turn = match.turn; // Indica de quem é a vez (pode ser 1 ou 2)
        this.offensiveTurn = match.offensive_turn; // Indica de quem é o turno ofensivo do round
        this.history = []
    }

    createButton() {
        this.button = this.scene.add.image(1396, centerY, this.buttonTexture[this.buttonState]);
    }
}
