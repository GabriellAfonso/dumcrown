import {
    receiveCards, playerData, catchNicknameResponse, rankingRecive, onlineChecker, alreadyOnline, pingHandler,
    deckEditorError, deckEditorSuccess, errorMessageStore,
} from "./client.js";
import { callStart, roomOpen, roomUpdate, roomClose, clearRoom, roomErrorMsg } from "./room.js";
import {
    isPlayerInMatch, startMatch, initialDraw, swappedCards, updateMatchData, round1, newRound, matchMessage, invalidMove,
    animateCardToBench, animateCardToAttack, animateCardToDefense, defenseMode, clashLine, victoryMatch, defeatMatch,

    spellS1, spellS2, spellS5, spellS7, spellS8,
    returnCardToBench,
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
    is_player_in_match: isPlayerInMatch,
    ranking: rankingRecive,
    call_start: callStart,
    room_open: roomOpen,
    room_update: roomUpdate,
    // join_room: joinRoom,
    room_close: roomClose,
    clear_room: clearRoom,
    room_error_msg: roomErrorMsg,

    deck_editor_error: deckEditorError,
    deck_editor_success: deckEditorSuccess,

    start_match: startMatch,
    initial_draw: initialDraw,
    swapped_cards: swappedCards,
    update_match_data: updateMatchData,
    round_1: round1,
    new_round: newRound,
    defense_mode: defenseMode,
    clash_line: clashLine,

    match_message: matchMessage,

    spell_s1: spellS1,
    spell_s2: spellS2,
    spell_s5: spellS5,
    spell_s7: spellS7,
    spell_s8: spellS8,
    //match animations
    animate_card_to_bench: animateCardToBench,
    animate_card_to_attack: animateCardToAttack,
    animate_card_to_defense: animateCardToDefense,
    return_card_to_bench: returnCardToBench,

    //açoes invalidas
    invalid_move: invalidMove,

    victory_match: victoryMatch,
    defeat_match: defeatMatch,

    //store
    error_message_store: errorMessageStore,

};