const { node } = require("webpack");
import battleship from "./Battleship.js";
import {isEqual} from "lodash"

const createGameBoard = () => {
  //board is 100 squares. goes from [1,10] both directions so shifted up by 1 from normal arrays. 2d array with [row][column]
  let board = create2D();
  //positions of all placed ships
  let shipsDatabase = [];
  const allShips = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };
  let missedShots = [];

  //start takes array with 2 values: x,y
  //axis: x start from left to right, y start from down to up
  const place = (start, axis, type) => {
    let [x, y] = start;
    let shipCoord = [];
    const length = allShips[type];

    if (axis === "x") {
      if (start[0] + length <= 10) {
        for (let i = 0; i < length; i++) {
          if (board[x + i - 1][y - 1] != "-") {
            //ship already placed at location
            return false;
          } else {
            board[x + i - 1][y - 1] = "O";
            shipCoord.push([x + i, y]);
          }
        }
        shipsDatabase.push(battleship(length, shipCoord));
        return true;
      } else {
        return false;
      }
    } else if (axis === "y") {
      if (start[1] + length <= 10) {
        for (let i = 0; i < length; i++) {
          if (board[x - 1][y + i - 1] != "-") {
            //ship already placed at location
            return false;
          } else {
            board[x - 1][y + i - 1] = "O";
            shipCoord.push([x, y + i]);
          }
        }
        shipsDatabase.push(battleship(length, shipCoord));
        return true;
      } else {
        return false;
      }
    }
  };

  const receiveAttack = (coords) => {
    //attack missed previously
    for (const missed of missedShots){
      if (isEqual(missed,coords)){
        return false
      }
    }
    for (const ship of shipsDatabase) {
      if (ship.hit(coords)) {
        return true;
      }
    }
    missedShots.push(coords);
    return false;
  };

  const getMissedAttacks = () => {
    return missedShots;
  };
  const allShipsSunk = () => {
    return shipsDatabase.every((ship)=>ship.beenSunk());
  };

  return {
    place,
    receiveAttack,
    getMissedAttacks,
    allShipsSunk
  };
};

function create2D() {
  let arr = Array(10);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Array(10).fill("-");
  }
  return arr;
}

export default createGameBoard;