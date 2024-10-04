import { GAME } from "../config/gameConfig.js";
import { sendSocket, switchScenes } from "../functions/functions.js";
let pingTime = 0
let pongTime = 0
export let latency_ms
export let cardsDATA
export var player = {
    icon: '',
    border: '',
    board: '',
    nickname: '',
    level: '',
    experience: '',
    cards: [],
    decks: [],
    current_deck: 0,
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
    player.board = message.board;
    player.nickname = message.nickname;
    player.level = message.level;
    player.experience = message.experience;
    player.cards = message.cards
    player.decks = message.decks
    player.current_deck = message.current_deck
    player.crystalsCoins = message.crystals
    player.matches = message.matches
    player.victories = message.victories
    player.defeats = message.defeats
    player.tier = message.tier
    player.musicVolume = message.volume_music;
    player.soundsVolume = message.soundsfx_volume;
    console.log(player.current_deck)
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

export function deckEditorError(data) {
    const message = data
    const deckEditor = GAME.scene.getScene('DeckEditorScene');
    deckEditor.events.emit('invalidDeck', message);

}

export function deckEditorSuccess(data) {
    const message = data
    const deckEditor = GAME.scene.getScene('DecksScene');
    deckEditor.events.emit('successDeck', message);
}