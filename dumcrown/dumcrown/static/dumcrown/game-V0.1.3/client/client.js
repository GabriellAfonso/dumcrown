import { GAME } from "../config/gameConfig.js";
import { sendSocket, switchScenes } from "../functions/functions.js";
let pingTime = 0
let pongTime = 0
export let latency_ms
export let cardsDATA
export var player = {
    icon: '',
    border: '',
    arena: '',
    nickname: '',
    level: '',
    experience: '',
    cards: [],
    decks: [],
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

export function receiveCards(data) {
    const message = data;
    cardsDATA = data

}
export function playerData(data) {
    const message = data;
    player.icon = message.icon;
    player.border = message.border;
    player.arena = message.arena;
    player.nickname = message.nickname;
    player.level = message.level;
    player.experience = message.experience;
    player.cards = message.cards
    player.decks = message.decks
    player.crystalsCoins = message.crystals
    player.matches = message.matches
    player.victories = message.victories
    player.defeats = message.defeats
    player.tier = message.tier
    player.musicVolume = message.volume_music;
    player.soundsVolume = message.soundsfx_volume;
    console.log('decks: ', player.decks)
}


export function catchNicknameResponse(data) {
    const message = data;
    nickServerMsg = message
    nicknameDenied = message !== 'saved';
}

export function rankingRecive(data) {
    const message = data
    playersRanking = message
    rankingUpdate = true
    switchScenes('RankingScreen', 'HomeScene');
}

export function alreadyOnline(data) {
    window.location.href = '/logout/';
    alert("Esta conta já está online em outra guia ou dispositivo!");
}

export function pingHandler(data) {
    latency_ms = get_ping_latency_ms()
    sendSocket('ping')
}
function get_ping_latency_ms() {
    pongTime = Date.now();
    var ms = pongTime - pingTime
    pingTime = Date.now();
    var latency = Math.floor(ms)
    if (latency > 999) {
        latency = 999
    }
    return latency
}

export function disconnected() {
    latency_ms = 999
}