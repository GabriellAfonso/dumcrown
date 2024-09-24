
import { player, nicknameDenied, setNicknameDenied, nickServerMsg } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { Botao } from '../functions/functions.js';
import { sendSocket } from '../functions/functions.js';


export class Nickname extends Phaser.Scene {
    constructor() {
        super({ key: 'Nickname' });
    }

    create() {
        this.scale.fullscreenTarget = document.getElementById('game-display');


        const wallpaper = this.add.sprite(centerX, centerY, 'blank_background');


        this.inputElement = document.createElement("input");
        this.inputElement.type = "text"; // Define o tipo de input como texto (pode ser alterado para 'number', 'email', etc.)
        this.inputElement.style.width = "450px"; // Defina o tamanho do input conforme necessário
        this.inputElement.style.height = "60px"; // Defina o tamanho do input conforme necessário
        this.inputElement.style.fontSize = "40px"; // Defina o tamanho do input conforme necessário
        this.inputElement.style.outline = "none";
        this.inputElement.style.borderRadius = "10px";
        this.inputElement.style.backgroundColor = "#555555";
        this.inputElement.style.border = "2px solid #555555";
        this.inputElement.style.zIndex = '0';
        this.inputElement.placeholder = "Digite seu Nickname";

        const inputNick = this.add.dom(centerX, centerY - 100, this.inputElement);

        this.buttonElement = document.createElement("button");
        this.buttonElement.innerText = "CONFIRMAR"; // Define o texto exibido no botão
        this.buttonElement.style.width = "250px"; // Define a largura do botão conforme necessário
        this.buttonElement.style.height = "50px"; // Define a altura do botão conforme necessário
        this.buttonElement.style.fontSize = "23px"; // Define a altura do botão conforme necessário
        this.buttonElement.style.borderRadius = "6px";
        this.buttonElement.style.backgroundColor = "#555555";
        this.buttonElement.style.color = "#fff";
        // Define a altura do botão conforme necessário
        this.buttonElement.type = "submit";

        // this.game.scene.run('Tutorial')

        const inputConfirm = this.add.dom(centerX, 400, this.buttonElement);

        // Adiciona um evento de clique ao botão
        this.buttonElement.addEventListener("click", () => this.processInputValue());

        // Adiciona um evento de "keypress" ao input
        this.inputElement.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                this.processInputValue();
            }
        });
    }

    processInputValue() {
        const inputValue = this.inputElement.value.trim();
        sendSocket('set_new_nickname', inputValue)
        sendSocket('get_player_data')

    }

    update() {
        //esperar resposta do cervidor
        if (nicknameDenied === true) {

            setNicknameDenied(null);

            if (this.denied) {
                this.denied.destroy();
            }
            this.denied = this.add.text(centerX, centerY - 160, nickServerMsg, {
                font: '26px Arial', fill: '#DF0000',
            });

            this.denied.setOrigin(0.5, 0.5)

        } if (nicknameDenied === false) {


            if (player.nickname) {
                setNicknameDenied(null);
                GAME.scene.stop('Nickname');
                GAME.scene.stop('Tutorial');
                GAME.scene.start('HomeScene');
                // GAME.scene.start('Tutorial');
                // this.tutorial = this.scene.get('Tutorial')
                // this.tutorial.index = 1

            }


        }
    }



}