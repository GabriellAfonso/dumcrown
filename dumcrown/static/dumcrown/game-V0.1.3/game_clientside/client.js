import { GAME } from "../config/gameConfig.js";
import { sendSocket, switchScenes } from "../functions/functions.js";

export var player = {
    icon: '',
    border: '',
    arena: '',
    nickname: '',
    level: '',
    experience: '',
    musicVolume: 1,
    soundsVolume: 1,
    crystalsCoins: '',
    matches: '',
    victories: '',
    defeats: '',
    tier: '',
};


export let areYouInGame = false
export let experienceUpdated = null;

export let players_online = 0

export let nicknameDenied = null;
export let nickServerMsg = null;
export let playersRanking = null;
export let rankingUpdate = null;



export function setAreYouInGame(value) {
    areYouInGame = value;
}
export function setExperienceUpdated(value) {
    experienceUpdated = value;
}


export function setNicknameDenied(value) {
    nicknameDenied = value;
}

export function setmusicVolume(value) {
    player.musicVolume = value;
}

export function setSondsVolume(value) {
    player.soundsVolume = value;
}
export function onlineChecker(data) {
    sendSocket('confirm_online')
    players_online = data.is_online

}

export function playerData(data) {
    const message = data.initialdata;
    player.icon = message.icon;
    player.border = message.border;
    player.arena = message.arena;
    player.nickname = message.nickname;
    player.level = message.level;
    player.experience = message.experience;
    player.crystalsCoins = message.crystals
    player.matches = message.matches
    player.victories = message.victories
    player.defeats = message.defeats
    player.tier = message.tier
    player.musicVolume = message.volume_music;
    player.soundsVolume = message.soundsfx_volume;
    GAME.scene.start('Preloader');
}

export function updateData(data) {
    const message = data.update_data;
    player.icon = message.icon;
    player.border = message.border;
    player.arena = message.arena;
    player.nickname = message.nickname;
    player.level = message.level;
    player.experience = message.experience;
    player.crystalsCoins = message.crystals
    player.matches = message.matches
    player.victories = message.victories
    player.defeats = message.defeats
    player.tier = message.tier
}


export function serverNicknameCheck(data) {
    const message = data.nick_response;
    nickServerMsg = message
    nicknameDenied = message !== 'saved';
}

export function rankingRecive(data) {
    const message = data.ranking_update
    playersRanking = message
    // console.log(playersRanking)
    rankingUpdate = true
    switchScenes('RankingScreen', 'HomeScene');
}
