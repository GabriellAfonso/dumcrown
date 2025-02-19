import { GAME } from '../config/gameConfig.js';
import { sendSocket } from '../functions/functions.js';

export var matchData = {}


export function startMatch(data) {
    matchData = data
    console.log(matchData)

    if (GAME.scene.isActive('QueueTimer')) {
        const QueueTimer = GAME.scene.getScene('QueueTimer');
        QueueTimer.events.emit('stopTimer');
        GAME.scene.stop('QueueTimer')
    }
    const soundfx = GAME.scene.getScene('Loading');
    soundfx.music.stop()
    soundfx.arena_music.play()
    soundfx.arena_music.setLoop(true);
    GAME.scene.stop('RoomScreen')
    GAME.scene.run('StartAnimation')
    setTimeout(() => {
        var lobby = GAME.scene.getScene('GameLobby')
        lobby.delInput()
        GAME.scene.start('DumMatch')
        setTimeout(() => {
            GAME.scene.stop('StartAnimation')
            GAME.scene.stop('GameLobby')
        }, 1500)
    }, 3000)


}

export function initialDraw(data) {
    matchData = data
    var matchScene = GAME.scene.getScene('DumMatch')
    matchScene.events.emit('initialDraw')
}
export function swappedCards() {
    emitToMatch('swapCards')
}

export function spellS1(data) {
    matchData = data.match
    emitToMatch('spell_s1', data)
}
export function spellS2(data) {
    matchData = data.match
    emitToMatch('spell_s2', data)
}
export function spellS5(data) {
    matchData = data.match
    emitToMatch('spell_s5', data)
}

export function spellS7(data) {
    matchData = data.match
    emitToMatch('spell_s7', data)
}
export function spellS8(data) {
    matchData = data.match
    emitToMatch('spell_s8', data)
}
export function updateMatchData(data) {
    matchData = data
    // console.log(matchData)
    emitToMatch('updateData')
}
export function round1(data) {
    matchData = data
    emitToMatch('round1')
}
export function newRound(data) {
    matchData = data
    emitToMatch('newRound', data)
}

export function invalidMove(data) {
    emitToMatch('invalidMove', data)
}

export function animateCardToBench(data) {
    updateMatchData(data.data)
    emitToMatch('animateCardToBench', data)
}

export function returnCardToBench(data) {
    updateMatchData(data.data)
    emitToMatch('returnCardToBench', data)
}

export function animateCardToAttack(data) {
    console.log(data)
    updateMatchData(data.data)
    emitToMatch('animateCardToAttack', data)
}
export function animateCardToDefense(data) {
    console.log('chamou o animete defense')
    updateMatchData(data.data)
    emitToMatch('animateCardToDefense', data)
}
export function matchMessage(data) {
    emitToMatch('message', data)
}
export function defenseMode(data) {
    // console.log('recebeu defesa do servidor')

    emitToMatch('defenseMode', data)
}
export function clashLine(data) {
    console.log('recebeu clashLine')
    updateMatchData(data.match)
    emitToMatch('clashLine', data)
}
export function victoryMatch(data) {
    emitToMatch('victoryMatch', data)
}
export function defeatMatch(data) {
    emitToMatch('defeatMatch', data)
}
export function example(data) {

}
export function isPlayerInMatch(data) {
    // console.log('o player esta em partida? ', data)
}

function getMatchScene() {
    return GAME.scene.getScene('DumMatch')
}
function emitToMatch(event, data = '') {
    var match = getMatchScene()
    match.events.emit(event, data)
}

