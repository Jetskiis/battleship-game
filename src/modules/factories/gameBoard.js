import { isEqual } from "lodash";
import battleship from "./Battleship.js";

const createGameBoard = () => {
  //board is 100 squares. goes from [1,10] both directions so shifted up by 1 from normal arrays. 2d array with [row][column]
  let board = create2D();
  //array containing battleshop objects of placed ships
  let shipsDatabase = [];
  //array containing all coordinates of placed ships
  let coordsDatabase = [];
  const allShips = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };
  let missedShots = [];
  let hitShots = [];

  //start takes array with 2 values: x,y
  //axis: x start from left to right, y start from down to up
  const place = (start, axis, type) => {
    let [x = null, y = null] = start;
    let shipCoord = [];
    const length = allShips[type];

    if (axis === "x") {
      if (x + length - 1 <= 10) {
        for (let i = 0; i < length; i++) {
          if (board[x + i - 1][y - 1] != "-") {
            //ship already placed at location
            return false;
          } else {
            board[x + i - 1][y - 1] = "O";
            shipCoord.push([x + i, y]);
          }
        }
        shipCoord.forEach((coord)=>coordsDatabase.push(coord));
        coordsDatabase.push("|");
        shipsDatabase.push(battleship(length, shipCoord));
        return true;
      } else {
        return false;
      }
    } else if (axis === "y") {
      if (y + length - 1 <= 10) {
        for (let i = 0; i < length; i++) {
          if (board[x - 1][y + i - 1] != "-") {
            //ship already placed at location
            return false;
          } else {
            board[x - 1][y + i - 1] = "O";
            shipCoord.push([x, y + i]);
          }
        }
        shipCoord.forEach((coord)=>coordsDatabase.push(coord));
        coordsDatabase.push("|");
        shipsDatabase.push(battleship(length, shipCoord));
        return true;
      } else {
        return false;
      }
    }
  };

  //try to attack a position and see if its already been hit
  const tryAttack = (coords) => {
    //attack on coord missed previously
    for (const missed of missedShots) {
      if (isEqual(missed, coords)) {
        return false;
      }
    }
    //attack on coord already hit previously
    for (const hit of hitShots) {
      if (isEqual(hit, coords)) {
        return false;
      }
    }
    return true
  };

  //execute attack, might need to change return values
  const receiveAttack = (coords) => {
    if (tryAttack(coords)) {
      for (const ship of shipsDatabase) {
        if (ship.hit(coords)) {
          hitShots.push(coords);
          return true;
        }
      }
      missedShots.push(coords);
      //shot missed
      return false;
    }
    else return false
  };

  const getMissedAttacks = () => {
    return missedShots;
  };
  const getHitAttacks = () => {
    return hitShots;
  };
  const numSunk = () => {
    let num = 0;
    shipsDatabase.forEach((ship) => {
      if(ship.beenSunk())
        num++;
    });

    return num;
  };
  
  const allShipsSunk = () => {
    return shipsDatabase.every((ship) => ship.beenSunk());
  };

  const getShipCoords = () => {
    return coordsDatabase;
  }

  return {
    allShips,
    place,
    tryAttack,
    receiveAttack,
    getMissedAttacks,
    getHitAttacks,
    numSunk,
    allShipsSunk,
    getShipCoords
  };
};


//creates 10x10 2D array
function create2D() {
  let arr = Array(10);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Array(10).fill("-");
  }
  return arr;
}

export {createGameBoard};
