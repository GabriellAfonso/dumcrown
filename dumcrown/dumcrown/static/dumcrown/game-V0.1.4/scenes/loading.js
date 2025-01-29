import { player } from '../client/client.js';

import { GAME, centerX, centerY } from '../config/gameConfig.js';
import { PATH } from '../config/gameConfig.js';
import { Botao, sendSocket } from '../functions/functions.js';
import { toggleFullscreen } from '../functions/functions.js';
import { add_text } from '../functions/texts.js';
import { loadSFX } from '../soundfx/sounds.js';



export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: 'Preloader' });
    }

    preload() {

        this.load.image('loading_screen', PATH + '/images/backgrounds/loading_screen.jpg');

    }

    create() {

        this.scene.start('Loading');

    }
}

export class Loading extends Phaser.Scene {
    constructor() {
        super({ key: 'Loading' });
    }

    preload() {
        const ls = this.add.image(centerX, centerY, 'loading_screen')
        ls.setScale(1);
        ls.alpha = 0.5

        this.version = this.add.text(1320, 720, 'V 0.1.3', {
            fontSize: '35px',
            fontFamily: 'Lexend Deca, sans-serif',
            color: 'white',
        });


        // Carregue os recursos necessários para o jogo aqui.
        this.load.image('empty', PATH + '/images/utils/empty.png');

        //sounds
        this.load.audio('hover_sound', PATH + '/soundfx/hoverSound.wav')
        this.load.audio('close_sound', PATH + '/soundfx/closeSound.mp3')
        this.load.audio('click_sound', PATH + '/soundfx/clickSound.wav')
        this.load.audio('home_sound', PATH + '/soundfx/home_sound.mp3')
        this.load.audio('arena_music', PATH + '/soundfx/arena_music.mp3')
        this.load.audio('uiselect_sound', PATH + '/soundfx/uiselect.flac')
        this.load.audio('click_sound_01', PATH + '/soundfx/snapclick.wav')

        //background
        this.load.image('blackground', PATH + '/images/backgrounds/black_screen.jpg');
        this.load.image('blank_background', PATH + '/images/backgrounds/blank_screen.jpg');
        this.load.image('homescreen', PATH + '/images/backgrounds/homescreen.jpg');
        this.load.image('perfil_background', PATH + '/images/backgrounds/perfil_background.jpg');
        this.load.image('iconpage_background', PATH + '/images/backgrounds/iconpage_background.png');
        this.load.image('config_background', PATH + '/images/backgrounds/config_background.jpg');
        this.load.image('store_background', PATH + '/images/backgrounds/loja_screen.jpg');
        this.load.image('missions_background', PATH + '/images/backgrounds/missoes_screen.jpg');
        this.load.image('decks_background', PATH + '/images/backgrounds/decks_background.png');
        this.load.image('friends_background', PATH + '/images/backgrounds/amigos_background.jpg');
        this.load.image('emails_background', PATH + '/images/backgrounds/emails_screen.jpg');
        this.load.image('ranking_background', PATH + '/images/backgrounds/ranking_screen.jpg');
        this.load.image('lobby_background', PATH + '/images/backgrounds/lobby_background.png');
        this.load.image('room_screen', PATH + '/images/backgrounds/room_screen.png');
        this.load.image('victory_background', PATH + '/images/backgrounds/victory_background.png');
        this.load.image('loss_background', PATH + '/images/backgrounds/loss_background.png');
        this.load.image('building', PATH + '/images/backgrounds/building_screen.jpg');


        //popups
        this.load.image('basic_warning', PATH + '/images/popups/warning_box.png');

        //arenas
        this.load.image('arena01', PATH + '/images/arenas/dumarena01.png');
        this.load.image('arena02', PATH + '/images/arenas/dumarena02.png');

        //default board
        this.load.image('default_board', PATH + '/images/boards/default/board.png');
        this.load.image('default_board_button', PATH + '/images/boards/default/button/board_button.png');
        this.load.image('default_board_button_active', PATH + '/images/boards/default/button/board_button_active.png');
        this.load.image('default_board_energy_holder', PATH + '/images/boards/default/energy/energy_placeholder.png');
        this.load.image('default_energy_0', PATH + '/images/boards/default/energy/0.png');
        this.load.image('default_energy_1', PATH + '/images/boards/default/energy/1.png');
        this.load.image('default_energy_2', PATH + '/images/boards/default/energy/2.png');
        this.load.image('default_energy_3', PATH + '/images/boards/default/energy/3.png');
        this.load.image('default_energy_4', PATH + '/images/boards/default/energy/4.png');
        this.load.image('default_energy_5', PATH + '/images/boards/default/energy/5.png');
        this.load.image('default_energy_6', PATH + '/images/boards/default/energy/6.png');
        this.load.image('default_energy_7', PATH + '/images/boards/default/energy/7.png');
        this.load.image('default_energy_8', PATH + '/images/boards/default/energy/8.png');
        this.load.image('default_energy_9', PATH + '/images/boards/default/energy/9.png');
        this.load.image('default_energy_10', PATH + '/images/boards/default/energy/10.png');



        //icons
        this.load.image('khras_talk', PATH + '/images/khras_eyebrown_talk.png');
        this.load.image('chibi_khras', PATH + '/images/icones/khras.png');
        this.load.image('chibi_lda', PATH + '/images/icones/lda.png');
        this.load.image('chibi_kronos', PATH + '/images/icones/kronos.png');
        this.load.image('icon_example', PATH + '/images/icones/exemplo.png');

        //borders
        this.load.image('border01', PATH + '/images/border/border01.png');
        this.load.image('border02', PATH + '/images/border/border02.png');
        this.load.image('border03', PATH + '/images/border/border03.png');

        //tier shields
        this.load.image('bronze', PATH + '/images/tier_shields/bronze.png');
        this.load.image('silver', PATH + '/images/tier_shields/silver.png');
        this.load.image('gold', PATH + '/images/tier_shields/gold.png');
        this.load.image('diamond', PATH + '/images/tier_shields/diamond.png');
        this.load.image('master', PATH + '/images/tier_shields/master.png');

        //buttons 
        this.load.image('fullscreen', PATH + '/images/buttons/fullscreen.png');
        this.load.image('soscreen', PATH + '/images/buttons/soscreen.png');
        this.load.image('decks_button', PATH + '/images/buttons/deck.png');
        this.load.image('friends_button', PATH + '/images/buttons/amigos.png');
        this.load.image('config_button', PATH + '/images/buttons/config.png');
        this.load.image('email_button', PATH + '/images/buttons/envelope.png');
        this.load.image('store_button', PATH + '/images/buttons/loja.png');
        this.load.image('missions_button', PATH + '/images/buttons/missoes.png');
        this.load.image('ranking_button', PATH + '/images/buttons/podio.png');
        this.load.image('x_close', PATH + '/images/buttons/x.png');
        this.load.image('aba_icone', PATH + '/images/buttons/aba_icone.png');
        this.load.image('aba_moldura', PATH + '/images/buttons/aba_moldura.png');
        this.load.image('aba_arena', PATH + '/images/buttons/arena_button.png');
        this.load.image('save_deck', PATH + '/images/buttons/save_deck.png');
        this.load.image('swap_button', PATH + '/images/buttons/swap_button.jpg');
        this.load.image('swap_button_off', PATH + '/images/buttons/swap_button_off.jpg');
        this.load.image('swap_button_undo', PATH + '/images/buttons/swap_button_undo.jpg');


        this.load.image('decks_select_button', PATH + '/images/buttons/button_layout_01.png');
        this.load.image('decks_select_button_active', PATH + '/images/buttons/button_layout_01_selected.png');
        this.load.image('add_new_deck', PATH + '/images/buttons/add_new_deck.png');
        this.load.image('delete_deck', PATH + '/images/buttons/delete_deck_button.png');
        this.load.image('add_to_deck', PATH + '/images/buttons/card_to_compress.png');
        this.load.image('locked_card', PATH + '/images/buttons/locked_card.png');
        this.load.image('delete_button', PATH + '/images/buttons/delete_button.png');
        this.load.image('cancel_button', PATH + '/images/buttons/cancel_button.png');



        this.load.image('logout', PATH + '/images/buttons/sair.png');
        this.load.image('save_config', PATH + '/images/buttons/salvar.png');
        this.load.image('aba_select', PATH + '/images/buttons/select.png');
        this.load.image('geral', PATH + '/images/buttons/geral.png');
        this.load.image('audio', PATH + '/images/buttons/audio.png');
        this.load.image('conta', PATH + '/images/buttons/conta.png');
        this.load.image('sobre', PATH + '/images/buttons/sobre.png');
        this.load.image('entrar_button', PATH + '/images/buttons/entrar.png');
        this.load.image('play_button', PATH + '/images/buttons/play.png');
        this.load.image('personalized_button', PATH + '/images/buttons/personalized_button.png');
        this.load.image('find_match_button', PATH + '/images/buttons/find_match_button.png');
        this.load.image('enter_room', PATH + '/images/buttons/entrar_button.png');
        this.load.image('start_button', PATH + '/images/buttons/start.png');
        this.load.image('button_off', PATH + '/images/buttons/button_off.png');
        this.load.image('button_on', PATH + '/images/buttons/button_on.png');
        this.load.image('exit_button', PATH + '/images/buttons/exit_button.png');
        this.load.image('giveup', PATH + '/images/buttons/give_up_button.png');

        //utils
        this.load.image('vs', PATH + '/images/utils/vs.png');
        this.load.image('crystals', PATH + '/images/utils/crystals.png');
        this.load.image('hpbar', PATH + '/images/utils/hpbar.png');
        this.load.image('yourcrown', PATH + '/images/utils/yourcrown.png');
        this.load.image('enemycrown', PATH + '/images/utils/enemycrown.png');
        this.load.image('energy_holder', PATH + '/images/utils/energyholder.png');
        this.load.image('victory_text', PATH + '/images/utils/victory.png');
        this.load.image('loss_text', PATH + '/images/utils/loss.png');
        this.load.image('crown_points', PATH + '/images/utils/crown_points.png');

        this.load.image('sword01', PATH + '/images/utils/sword01.png');
        this.load.image('sword02', PATH + '/images/utils/sword02.png');
        this.load.image('timer', PATH + '/images/utils/timer.png');
        this.load.image('loading_circle', PATH + '/images/utils/loading_circle.png');

        this.load.image('signal01', PATH + '/images/utils/connection_signal01.png');
        this.load.image('signal02', PATH + '/images/utils/connection_signal02.png');
        this.load.image('signal03', PATH + '/images/utils/connection_signal03.png');
        this.load.image('signal04', PATH + '/images/utils/connection_signal04.png');


        //cards
        this.load.image('qualit2', PATH + '/images/cards/cdc.png');
        this.load.image('cardlayout-neutro', PATH + '/images/cards/layout-neutro.png');
        this.load.image('card_mask', PATH + '/images/cards/card_mask.png');
        this.load.image('disabled_card', PATH + '/images/cards/disabled_card.png');
        this.load.image('minicardlayout', PATH + '/images/cards/mini-card-layout.png');
        this.load.image('deck_border', PATH + '/images/cards/deck_border.png');
        this.load.image('compressed_unit_layout', PATH + '/images/cards/compressed_unit_layout.png');
        this.load.image('compressed_spell_layout', PATH + '/images/cards/compressed_spell_layout.png');

        this.load.image('verse_card', PATH + '/images/cards/verse_card.png');
        this.load.image('cards_deck', PATH + '/images/cards/deck.png');
        this.load.image('john_card', PATH + '/images/cards/monsters/john_copper.png');
        this.load.image('carol_card', PATH + '/images/cards/monsters/carol_arlet.png');
        this.load.image('mortem_card', PATH + '/images/cards/monsters/mortem.png');
        this.load.image('kronos_card', PATH + '/images/cards/monsters/kronos.png');
        this.load.image('darkage1_card', PATH + '/images/cards/monsters/dark_age.png');
        this.load.image('darkage2_card', PATH + '/images/cards/monsters/card03.png');
        this.load.image('darkage3_card', PATH + '/images/cards/monsters/card04.png');
        this.load.image('darkage4_card', PATH + '/images/cards/monsters/card23.png');
        this.load.image('khras_card', PATH + '/images/cards/monsters/khras.png');
        this.load.image('skillet_card', PATH + '/images/cards/monsters/skillet.png');
        this.load.image('cdc_card', PATH + '/images/cards/monsters/cdc.png');
        this.load.image('okada_card', PATH + '/images/cards/monsters/okada.png');
        this.load.image('smoothcriminal_card', PATH + '/images/cards/monsters/smoothcriminal.png');
        this.load.image('boogie_card', PATH + '/images/cards/monsters/boogie.png');
        this.load.image('spring_card', PATH + '/images/cards/monsters/spring.png');
        this.load.image('polaroid_card', PATH + '/images/cards/monsters/polaroid.png');
        this.load.image('maniac_card', PATH + '/images/cards/monsters/maniac.png');
        this.load.image('crazy_card', PATH + '/images/cards/monsters/crazy.png');
        this.load.image('theojays_card', PATH + '/images/cards/monsters/theojays.png');
        this.load.image('neonb_card', PATH + '/images/cards/monsters/neonb.png');
        this.load.image('ballhan_card', PATH + '/images/cards/monsters/ballhan.png');
        this.load.image('darknecessites_card', PATH + '/images/cards/monsters/darknecessites.png');
        this.load.image('anomaly_card', PATH + '/images/cards/monsters/anomaly.png');
        this.load.image('rhioros_ghost_card', PATH + '/images/cards/monsters/rhioros_ghost.png');

        //spells
        this.load.image('spellcardlayout', PATH + '/images/cards/spell-layout.png');
        this.load.image('someones_shield', PATH + '/images/cards/spells/someones_shield.jpeg');
        this.load.image('magic_barrier', PATH + '/images/cards/spells/magic_barrier.jpeg');
        this.load.image('sacrificial_fire', PATH + '/images/cards/spells/sacrificial_fire.jpeg');
        this.load.image('life_potion', PATH + '/images/cards/spells/life_potion.jpeg');
        this.load.image('summoned_ax', PATH + '/images/cards/spells/summoned_ax.jpeg');





        // Crie uma barra de progresso (retângulo) para exibir o progresso do carregamento.
        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();
        this.progressBox.fillStyle(0x1c1c1c, 1);
        this.progressBox.fillRect(centerX - 300, 670, 600, 15);

        // Registre um ouvinte de evento para o evento de progresso de carregamento.
        this.load.on('progress', this.handleProgress, this);
        this.load.on('complete', this.handleComplete, this);

        // Crie o texto da porcentagem

        this.progressText = add_text(this, centerX, 640, '0%', '35px', 0.5)


        // Inicie o carregamento dos recursos.
        this.load.start();
    }

    handleProgress(progress) {
        // Atualize a barra de progresso de acordo com o progresso de carregamento.
        this.progressBar.clear();
        this.progressBar.fillStyle(0x00ffff, 1);
        this.progressBar.fillRect(centerX - 295, 673, 590 * progress, 8);
        this.progressText.setText(Math.floor(progress * 100) + '%');
    }

    handleComplete() {
        // Remova a barra de progresso após o carregamento completo, se necessário.
        this.progressBox.destroy();
        this.progressBar.destroy();
        loadSFX()
        this.hoverSound = GAME.sound.add('hover_sound');
        this.clickSound = GAME.sound.add('click_sound');
        this.snapclick = GAME.sound.add('click_sound_01')
        this.closeSound = GAME.sound.add('close_sound');
        this.uiselect = GAME.sound.add('uiselect_sound');


        // Carregar a música
        this.music = this.sound.add('home_sound');
        this.arena_music = this.sound.add('arena_music');
        this.music.volume = 0.5 * player.musicVolume;
        // Quando a música terminar, defina o loop
        this.music.once('complete', function (sound) {
            sound.setLoop(true);
            sound.play();
        });

        // Iniciar a reprodução da música
        this.music.play();

        this.scale.fullscreenTarget = document.getElementById('game-display');

        const fullscreen_button = new Botao(this, 1465, 35, 'fullscreen', () => {
            toggleFullscreen();

        }, 0xffffff);
        fullscreen_button.setScale(0.40);

        const entrar = new Botao(this, centerX, 650, 'entrar_button', () => {
            fullscreen_button.destroy();
            entrar.destroy();
            if (player.nickname.length === 0) {
                GAME.scene.start('Nickname');
            } else {
                sendSocket('is_player_in_match')
                GAME.scene.start('HomeScene');
            }
        }, 0xffff00);
        entrar.setScale(0.6)

    }

    update() {
        this.music.volume = 0.05 * player.musicVolume;
        this.arena_music.volume = 0.05 * player.musicVolume;
        this.clickSound.volume = 0.1 * player.soundsVolume;
        this.closeSound.volume = 0.1 * player.soundsVolume;
        this.uiselect.volume = 0.4 * player.soundsVolume;
        this.hoverSound.volume = 1 * player.soundsVolume;
        this.snapclick.volume = 0.1 * player.soundsVolume;
    }
}





export class Exemple extends Phaser.Scene {
    constructor() {
        super({ key: 'Exemple' });
    }

    create() {
    }

    update() {
        // Lógica de atualização do jogo (executada continuamente durante o jogo).
    }
}



