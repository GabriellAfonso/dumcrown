
import { player, nicknameDenied, setNicknameDenied, nickServerMsg } from '../client/client.js';
import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { Botao, sleep } from '../functions/functions.js';
import { sendSocket } from '../functions/functions.js';




export class Tutorial extends Phaser.Scene {
    constructor() {
        super({ key: 'Tutorial' });
    }

    create() {
        var answer = Math.floor(Math.random() * 8);
        this.nameResponse = [
            ' é um nome bem peculiar.',
            ' esse nome com certeza vai impor respeito!',
            ' ... sem duvidas é um dos nomes ja feitos.',
            ' que nome bonito!',
            ' eu teria medo de te enfrentar.',
            ' ... assustador!',
            ' é um nome engraçado',
            ' que nome maneiro!',
        ]

        this.falas = [
            'Bem Vindo a primeira versao beta de DumCrown! \nescolha seu nickname para continuar',
            'Então você se chama ' + player.nickname + ',' + this.nameResponse[answer],
            'meu nome é khras, agora que ja nos conhecemos deixa eu te explicar um pouco sobre este jogo',
            `Dumcrown é um jogo de cartas, que depende de estratégias e um pouco de sorte :) 
você pode criar uma sala e chamar aquele seu amigo pra uma batalha mano a mano!`,
            `Já se você não teme nada nem ninguém, você pode preocurar um jogador aleatório 
para batalhar e mostrar quem é o Melhor!`,
            `Como o jogo ainda esta na sua primeira versão beta, ainda nao temos um tutorial completo
E NÃO SAMUEL NÃO TEM BRILINHO!`,
            'Boa sorte a todos, nos vemos na arena!'

        ];
        this.letter = 0;
        this.index = 0;





        this.TutorialText = this.add.text(50, 550, '', { fontFamily: 'Arial', fontSize: 28, color: '#ffffff', lineSpacing: 15 });
        this.TutorialText.depth = 1

        const wallpaper = this.add.rectangle(centerX, centerY, 1500, 768, 0x000000);
        wallpaper.alpha = 0.5
        wallpaper.setInteractive()

        this.nickScene = this.scene.get('Nickname')
        this.nickScene.inputElement.disabled = true;
        this.nickScene.buttonElement.disabled = true;


        const retangulo = this.add.rectangle(centerX, 650, 1500, 250, 0x000000);
        retangulo.setOrigin(0.5, 0.5);
        retangulo.setAlpha(0.7)


        const krhas = this.add.image(1300, centerY + 100, 'khras_talk');
        krhas.setScale(0.25)
        sleep(this, 100, () => {
            this.writeText()
        })



    }


    update() {

    }

    writeText() {

        this.TutorialText.text += this.falas[this.index][this.letter];
        this.letter++;

        // Verifique se o texto foi totalmente escrito
        if (this.letter < this.falas[this.index].length) {
            this.time.delayedCall(40, this.writeText, [], this);
        } else if (this.index > 0 && this.index < 6) {
            sleep(this, 3500, () => {
                this.letter = 0
                this.index++
                this.TutorialText.text = ''
                this.writeText()
            })

        } else if (this.index > 5) {
            sleep(this, 2500, () => {
                this.game.scene.stop('Tutorial')
            })
        }
        else {
            this.nickScene.inputElement.disabled = false;
            this.nickScene.buttonElement.disabled = false;
        }
    }

}