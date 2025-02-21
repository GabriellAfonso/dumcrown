import { player } from "../client/client.js";
import { GAME } from "../config/gameConfig.js";

export var sfx

export function loadSFX() {
    console.log('chamou a funçao loading sfx')
    //nao pausa mais a musica
    GAME.sound.pauseOnBlur = false;
    sfx = {
        houverSound: GAME.sound.add('hover_sound'),
        clickSound: GAME.sound.add('click_sound'),
        clickSound01: GAME.sound.add('click_sound_01'),
        uiselect: GAME.sound.add('uiselect_sound'),
        closeSound: GAME.sound.add('close_sound'),
        cardSound01: GAME.sound.add('card_sound01'),
        cardSound02: GAME.sound.add('card_sound02'),
        cardSound03: GAME.sound.add('card_sound03'),
        cardDamage01: GAME.sound.add('card_damage01'),
    }
    SFXVolume()
}

export function SFXVolume() {
    sfx.houverSound.volume = 0.1 * player.soundsVolume;
    sfx.clickSound.volume = 0.1 * player.soundsVolume;
    sfx.clickSound01.volume = 0.1 * player.soundsVolume;
    sfx.uiselect.volume = 0.1 * player.soundsVolume;
    sfx.closeSound.volume = 0.1 * player.soundsVolume;
    sfx.cardSound01.volume = 0.1 * player.soundsVolume;
    sfx.cardSound02.volume = 0.1 * player.soundsVolume;
    sfx.cardSound03.volume = 0.1 * player.soundsVolume;
    sfx.cardDamage01.volume = 0.1 * player.soundsVolume;
}