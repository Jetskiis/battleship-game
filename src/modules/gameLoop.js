import { createGameBoard } from "./factories/gameBoard.js";
import { AI, player } from "./factories/player.js";
import { displaySelectionMenu, displayStartMenu } from "./UI.js";

let humanPlr;
const AIPlr = AI();
const AIBoard = createGameBoard();

function runGameLoop() {
  displayStartMenu();
}

function initializePlayers(name) {
  humanPlr = player(name);
  const plrHeading = document.querySelector("#player1").querySelector("h2");

  plrHeading.textContent = humanPlr.getName() + "'s Board";
  displaySelectionMenu();
}

//gameBoard is the player's board, the AI board is auto generated
function startGame(gameBoard) {
  createGrid("Human", gameBoard);
  createGrid("AI", AIBoard);
  const AIShipDatabase = generateAIShips();
}

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
  while (toPlace.length > 0) {
    let position = Math.floor(Math.random() * 2) == 0 ? "x" : "y";
    let ship = toPlace.pop();
    let len = shipsDict[ship];
    let coords = [];

    if (position == "x") {
      let startX = Math.floor(Math.random() * (10 - len + 1)) + 1;
      let startY = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < len; i++) {
        let currentX = startX + i;
        let currentY = startY;
        if (checkValidShipPlacement(coordsDatabase, [currentX, currentY]))
          coords.push([currentX, currentY]);
        else {
          coords = [];
          startX = Math.floor(Math.random() * (10 - len + 1)) + 1;
          startY = Math.floor(Math.random() * 10) + 1;
          i = -1;
        }
      }
    } else {
      let startX = Math.floor(Math.random() * 10) + 1;
      let startY = Math.floor(Math.random() * (10 - len + 1)) + 1;
      for (let i = 0; i < len; i++) {
        let currentX = startX + i;
        let currentY = startY;
        if (checkValidShipPlacement(coordsDatabase, [currentX, currentY]))
          coords.push([currentX, currentY]);
        else {
          coords = [];
          startX = Math.floor(Math.random() * 10) + 1;
          startY = Math.floor(Math.random() * (10 - len + 1)) + 1;
          i = -1;
        }
      }
    }
    coordsDatabase.push(coords);
  }
  return coordsDatabase;
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

export { runGameLoop, initializePlayers, startGame };
