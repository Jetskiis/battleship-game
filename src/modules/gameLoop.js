import {displayStartMenu,displaySelectionMenu} from "./UI.js"
import {player,AI} from "./factories/player.js"
import {createGameBoard} from "./factories/gameBoard.js"

let humanPlr;
const AIPlr = AI();
let toPlace = ["carrier","submarine","cruiser","battleship","destroyer"];

function runGameLoop(){
    displayStartMenu();
}

function initializePlayers(name){
    humanPlr = player(name);
    const plrHeading = document.querySelector("#player1").querySelector("h2");

    plrHeading.textContent = humanPlr.getName();
    displaySelectionMenu();
}

function startGame(gameBoard){
    
}






export {runGameLoop, initializePlayers, startGame}