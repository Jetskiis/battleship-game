import { createGameBoard } from "./factories/gameBoard.js";
import { AI, player } from "./factories/player.js";
import { clearSelected, displaySelectionMenu, displayStartMenu } from "./UI.js";

let turn = 0;
let humanPlr;
const AIPlr = AI();
const AIBoardObj = createGameBoard();
let humanBoardObj;

function runGameLoop() {
  displayStartMenu();
}

//sets up player name
function initializePlayers(name) {
  humanPlr = player(name);
  const plrHeading = document.querySelector("#player1").querySelector("h2");

  plrHeading.textContent = humanPlr.getName() + "'s Board";
  displaySelectionMenu();
}

//humanBoard is the player's board, the AI board is auto generated
function startGame(humanBoard) {
  const banner = document.querySelector(".banner");

  const AIShipDatabase = generateAIShips();
  coordinatesToBoard(AIShipDatabase, AIBoardObj);
  humanBoardObj = humanBoard;
  createGrid("Human", humanBoardObj);
  createGrid("AI", AIBoardObj);
  banner.textContent = "Your Turn!";

  // }
}

//creates grid and places down ships from database
function createGrid(player, board) {
  let parentDiv;
  let color = 1;

  if (player == "Human") parentDiv = document.querySelector("#player1");
  else parentDiv = document.querySelector("#player2");

  const database = board.getShipCoords();
  const container = document.createElement("div");

  for (let y = 1; y <= 10; y++) {
    for (let x = 1; x <= 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", `${x}-${11 - y}`);
      cell.style.height = "100%";
      cell.style.width = "100%";
      if(player == "AI")
        cell.addEventListener("click", fireShot);

      if (player == "AI") {
        cell.addEventListener("mouseover", (e) => {
          clearSelected();
          if (
            !(
              e.target.classList.contains("hit") ||
              e.target.classList.contains("missed")
            )
          )
            e.target.classList.add("highlight");
        });
        cell.addEventListener("mouseleave", clearSelected);
      }

      container.appendChild(cell);
    }
  }

  container.classList.add("grid");
  container.style.width = "100%";
  container.style.height = "90%";
  parentDiv.appendChild(container);

  if (player == "Human") {
    for (const coord of database) {
      let [x, y] = coord;
      let colorClass;

      switch (color) {
        case 5:
          colorClass = "fifth";
          break;
        case 4:
          colorClass = "fourth";
          break;
        case 3:
          colorClass = "third";
          break;
        case 2:
          colorClass = "second";
          break;
        case 1:
          colorClass = "first";
          break;
        default:
          break;
      }

      if (coord != "|") {
        const occupiedCell = document.getElementById(
          `${Number(x)}-${Number(y)}`
        );
        occupiedCell.classList.add("highlight");
        occupiedCell.classList.add(colorClass);
      } else {
        color += 1;
      }
    }
  }
}

//generates coordinates for the AI's ships
function generateAIShips() {
  let toPlace = ["carrier", "battleship", "cruiser", "submarine", "destroyer"];
  let shipsDict = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };
  let coordsDatabase = []; //contains array of arrays [[[1,2],[2,3],[4,5]] , ... ]
  let placeDatabase = []; //contains ([x,y],axis,type) used for placing ships on gameboard

  while (toPlace.length > 0) {
    const position = Math.floor(Math.random() * 2) == 0 ? "x" : "y";
    const ship = toPlace.pop();
    const len = shipsDict[ship];

    let placeArray = [];
    let coords = [];
    let startX;
    let startY;

    if (position == "x") {
      startX = Math.floor(Math.random() * (10 - len + 1)) + 1;
      startY = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < len; i++) {
        let currentX = startX + i;
        let currentY = startY;
        if (!checkValidShipPlacement(coordsDatabase, [currentX, currentY])) {
          startX = Math.floor(Math.random() * (10 - len + 1)) + 1;
          startY = Math.floor(Math.random() * 10) + 1;
          i = -1;
          coords = [];
        } else {
          coords.push([currentX, currentY]);
        }
      }
    } else {
      startX = Math.floor(Math.random() * 10) + 1;
      startY = Math.floor(Math.random() * (10 - len + 1)) + 1;
      for (let i = 0; i < len; i++) {
        let currentX = startX;
        let currentY = startY + i;
        if (!checkValidShipPlacement(coordsDatabase, [currentX, currentY])) {
          startX = Math.floor(Math.random() * 10) + 1;
          startY = Math.floor(Math.random() * (10 - len + 1)) + 1;
          i = -1;
          coords = [];
        } else {
          coords.push([currentX, currentY]);
        }
      }
    }
    placeArray.push([startX, startY]);
    placeArray.push(position);
    placeArray.push(ship);
    placeDatabase.push(placeArray);
    coordsDatabase.push(coords);
  }
  return placeDatabase;
}

function checkValidShipPlacement(parentArr, coord) {
  const x = coord[0];
  const y = coord[1];
  for (let i = 0; i < parentArr.length; i++) {
    for (let j = 0; j < parentArr[i].length; j++) {
      if (parentArr[i][j][0] == x && parentArr[i][j][1] == y) return false;
    }
  }
  return true;
}

//takes in randomly generated ship placement coordinates for AI and puts it on the board
function coordinatesToBoard(coords, board) {
  for (let i = 0; i < coords.length; i++) {
    board.place(coords[i][0], coords[i][1], coords[i][2]);
  }
}

//atempts to fire shot on the clicked cell
function fireShot(e) {
  const banner = document.querySelector(".banner");
  const numHit = AIBoardObj.getHitAttacks().length;
  const numMissed = AIBoardObj.getMissedAttacks().length;
  const target = e.target;
  const [x, y] = target.getAttribute("id").split("-");
  //x and y are strings

  if (!(AIBoardObj.allShipsSunk() || humanBoardObj.allShipsSunk()) && humanPlr.attack([Number(x), Number(y)], AIBoardObj, turn)) {
    if (AIBoardObj.getHitAttacks().length > numHit) {
      //attack hit
      target.classList.add("hit");
    } else if (AIBoardObj.getMissedAttacks().length > numMissed) {
      //attack missed
      target.classList.add("missed");
    } else {
      //attack invalid (cell already hit)
      alert("Invalid attack, try again");
      return;
    }

    if (AIBoardObj.allShipsSunk()) {
      endGame("Player wins"); //winner found
      return;
    }

    turn+=1;
    banner.textContent = "AI's turn";
    setTimeout(AIFireShot,2000);
    setTimeout(()=>{
      banner.textContent = "AI fires a shot";
    },1400);

  }
}

//AI automatically fires a valid shot onto player grid
function AIFireShot() {
  const banner = document.querySelector(".banner");
  const AIHitCount = humanBoardObj.getHitAttacks().length;
  const AIMissCount = humanBoardObj.getMissedAttacks().length;

  while(humanBoardObj.getHitAttacks().length == AIHitCount && humanBoardObj.getMissedAttacks().length == AIMissCount){
    //keep attacking until we get a hit or miss, no redundant attacks
    AIPlr.attack(humanBoardObj, turn);
  }

  if (humanBoardObj.getHitAttacks().length != AIHitCount) {
    //attack hit
    const hitCoord = humanBoardObj.getHitAttacks()[humanBoardObj.getHitAttacks().length-1];
    const [x,y] = hitCoord;
    const cell = document.getElementById(`${x}-${y}`);
    cell.classList.add("hit");
  } 
  else {
    //attack missed
    const missCoord = humanBoardObj.getMissedAttacks()[humanBoardObj.getMissedAttacks().length-1];
    const [x,y] = missCoord;
    const cell = document.getElementById(`${x}-${y}`);
    cell.classList.add("missed");
  }

  turn+=1;

  if (humanBoardObj.allShipsSunk()) {
    endGame("AI wins"); //winner found
    return;
  }
  
  banner.textContent = "Your turn!";

}

function endGame(msg) {
  const banner = document.querySelector(".banner");
  const cells = document.querySelectorAll(".cell");

  cells.forEach((cell)=>cell.removeEventListener("click",fireShot));

  if(msg == "Player wins"){
    banner.textContent = `Game over, ${humanPlr.getName()} wins`;
    banner.style["font-size"] = "2.2em";
  }
  else {
    banner.textContent = "Game over, AI wins";
  }
}

export { runGameLoop, initializePlayers, startGame };
