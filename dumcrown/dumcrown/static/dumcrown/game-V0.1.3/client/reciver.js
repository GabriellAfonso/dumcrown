import { receiveCards, playerData, catchNicknameResponse, rankingRecive, onlineChecker, alreadyOnline, pingHandler } from "./client.js";
import { callStart, roomOpen, roomUpdate, roomClose, clearRoom, roomErrorMsg } from "./room.js";
import {
    startMatch, hpUpdate, matchUpdate, playerPass, energyUpdate, adversaryField,
    adversaryAttack, adversaryDefese, resolveConflit, autoResolve, roundUpdate,
} from "./match.js";

function msg(data) {
    const message = data.message
    console.log(message)
}

export const clientReciver = {
    get_cards: receiveCards,
    get_player_data: playerData,
    new_nickname_response: catchNicknameResponse,
    already_online: alreadyOnline,
    pong: pingHandler,
    message: msg,
    is_online: onlineChecker,
    ranking: rankingRecive,
    call_start: callStart,
    room_open: roomOpen,
    room_update: roomUpdate,
    // join_room: joinRoom,
    room_close: roomClose,
    clear_room: clearRoom,
    room_error_msg: roomErrorMsg,

    start_match: startMatch,
    match_update: matchUpdate,
    player_pass: playerPass,
    energy_update: energyUpdate,
    adversary_field: adversaryField,
    adversary_attack: adversaryAttack,
    adversary_defese: adversaryDefese,
    resolve: resolveConflit,
    auto_resolve: autoResolve,
    hp_update: hpUpdate,
    round_update: roundUpdate,





};