import { GAME } from '../config/gameConfig.js';
import { sendSocket } from '../functions/functions.js';


export var matchData = {}

export var updatedHp = false

export var updateRound = false
export var pass = false
export var autopass = true

export var updatedEnergy = false


export var adversaryCard = ''
export var adversaryFieldUpdate = false

export var adversaryCardsAttack = {}
export var adversaryCardsAttackUpdate = false

export var adversaryCardsDefese = {}
export var adversaryCardsDefeseUpdate = false

export var resolveData = {}
export var resolveUpdate = false






export var adversaryCardsOnField = []

export var cardOnField = false
export var cardAtackkMode = false

export var damage = ''
export var damageUpdate = false



export function setUpdateHp(value) {
    updatedHp = value
}

export function setUpdateRound(value) {
    updateRound = value
}
export function setPassValue(value) {
    pass = value

}
export function setAutoPassValue(value) {
    autopass = value

}

export function setUpdatedEnergy(value) {
    updatedEnergy = value
}
export function setAdversaryFieldUpdate(value) {
    adversaryFieldUpdate = value
}
export function setAdversaryCardsAttackUpdate(value) {
    adversaryCardsAttackUpdate = value
}
export function setAdversaryCardsDefeseUpdate(value) {
    adversaryCardsDefeseUpdate = value
}
export function setResolveUpdate(value) {
    resolveUpdate = value
}





export function setAdversaryCardsOnField(value) {
    adversaryCardsOnField.splice(value, 1);
}


export function updatePhase(value) {
    matchDB.phase = (value)
}

export function setCardOnField(value) {
    cardOnField = value
}
export function setCardAttackMode(value) {
    cardAtackkMode = value
}
export function damageUpdateF(value) {
    damageUpdate = value
}


export function clearAdversaryCards() {
    adversaryCardsAttack = {}
    // console.log('cartas do adversario limpas')
}






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
    //pregar as cartas do cardsToSwap pra pegar os objetos que estao na tela fazer animaçao de retirada
    //refazer animaçao de entrada das cartas, sem o botao de substituir


}

export function updateMatchData(data) {
    matchData = data
    console.log(matchData)
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
export function matchMessage(data) {
    emitToMatch('message', data)
}
export function example(data) {

}

function getMatchScene() {
    return GAME.scene.getScene('DumMatch')
}
function emitToMatch(event, data = '') {
    var match = getMatchScene()
    match.events.emit(event, data)
}





//antigas
export function matchUpdate(data) {
    const message = data.match_update;

    matchDB.round = message.round
    matchDB.phase = message.phase
    matchDB.turn = message.turn
    matchDB.attacking = message.attacking

    matchDB.player1.channel = message.player1.channel
    matchDB.player1.ready = message.player1.ready
    matchDB.player1.icon = message.player1.icon
    matchDB.player1.nickname = message.player1.nickname
    matchDB.player1.arena = message.player1.arena
    matchDB.player1.hp = message.player1.hp
    matchDB.player1.energy = message.player1.energy
    matchDB.player1.deck = message.player1.deck



    matchDB.player2.channel = message.player2.channel
    matchDB.player2.ready = message.player2.ready
    matchDB.player2.icon = message.player2.icon
    matchDB.player2.nickname = message.player2.nickname
    matchDB.player2.arena = message.player2.arena
    matchDB.player2.hp = message.player2.hp
    matchDB.player2.energy = message.player2.energy
    matchDB.player2.deck = message.player2.deck

}

export function playerPass(data) {
    const message = data.player_pass;
    matchDB.turn = message.turn
    matchDB.phase = message.phase
    pass = true
    autopass = true
}
export function energyUpdate(data) {
    const message = data.energy_update;
    matchDB.player1.energy = message.player1.energy
    matchDB.player2.energy = message.player2.energy
    updatedEnergy = true
}
export function adversaryField(data) {
    const message = data.adversary_field;
    adversaryCard = message
    adversaryFieldUpdate = true

}

export function adversaryAttack(data) {
    const message = data.adversary_attack;
    adversaryCardsAttack = message
    adversaryCardsAttackUpdate = true
}
export function adversaryDefese(data) {
    const message = data.adversary_defese
    adversaryCardsDefese = message
    // console.log(adversaryCardsDefese)
    adversaryCardsDefeseUpdate = true
}
export function resolveConflit(data) {
    const message = data.resolve
    resolveData = message
    // console.log(resolveData)
    resolveUpdate = true
    autopass = true
}

export function autoResolve(data) {

    if (GAME.scene.isActive('DumArena')) {
        const DumArena = GAME.scene.getScene('DumArena');
        DumArena.masterButton.emit('pointerup');
    }
}

export function hpUpdate(data) {
    const message = data.hp_update;
    matchDB.player1.hp = message.player1.hp
    matchDB.player2.hp = message.player2.hp
    updatedHp = true
}

export function roundUpdate(data) {
    const message = data.round_update;
    matchDB.round = message.round
    matchDB.phase = message.phase
    matchDB.turn = message.turn
    matchDB.attacking = message.attacking
    // console.log('chegou no round')

    updateRound = true
}
