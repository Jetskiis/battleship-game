import sanitizeHtml from "sanitize-html";

const player = (name) => {
  let playerName = sanitizeHtml(name);
  let isCurrentlyPlaying = false;

  const attack = (coords, board, turn) => {
    turn % 2 == 0 ? (isCurrentlyPlaying = true) : (isCurrentlyPlaying = false);
    if (isCurrentlyPlaying == true) {
      board.receiveAttack(coords); //doesnt tell us if attack was successful/not successful/redundant
      return true;
    } else {
      return false;
    }
  };

  const getName = () => {
    return playerName;
  };

  const isHuman = () => true;

  return {
    attack,
    getName,
    isHuman,
  };
};

const AI = () => {
  let list = [];
  let lastTurnHit; //turn number where an enemy ship is successfully hit
  let shipBeenHit = false;
  let shipBeenSunk = false;

  let isCurrentlyPlaying = false;
  const { getName } = player("AI");

  //randomly attacks location
  const attack = (board, turn) => {
    const numHit = board.getHitAttacks().length;
    const numSunk = board.numSunk();

    turn % 2 == 0 ? (isCurrentlyPlaying = false) : (isCurrentlyPlaying = true);
    if (isCurrentlyPlaying == true) {
      let coords = smartDetection(turn);

      board.receiveAttack(coords); //doesnt tell us if attack was successful/not successful/redundant

      if (board.getHitAttacks().length != numHit) {
        //attack has hit a ship successfully
        shipBeenHit = true;
        lastTurnHit = turn;
        if (numSunk != board.numSunk()) {
          //hit ship has been sunk
          shipBeenHit = false;
          shipBeenSunk = true;
          list = [];
        } else {
          //hit ship not sunk yet
          shipBeenSunk = false;
          list.push(coords); //push hit coord to list
        }
      }
      return true;
    } else {
      return false;
    }
  };

  const getRandomCoordinate = () => {
    let randomX = Math.floor(Math.random() * 10) + 1;
    let randomY = Math.floor(Math.random() * 10) + 1;
    return [randomX, randomY];
  };

  //lets AI determine where to attack, if it gets a hit onto a cell then it will target adjacent cells
  const smartDetection = (turn) => {
    const firstCoord = list[0];
    const lowerBound = 1;
    const upperBound = 10;

    if (shipBeenHit && !shipBeenSunk) {
      if (list.length == 1) {
        //ship is in one of four directions, return random coord in 4 directions
        let dir = Math.floor(Math.random() * 4);
        let returnCoord;

        let oldX = firstCoord[0];
        let oldY = firstCoord[1];

        //(edge case) if firstCoord is surrounded in all four directions by already attacked cells, then return random coord 
        if((document.getElementById(`${oldX+1}-${oldY}`).classList.contains("hit") || document.getElementById(`${oldX+1}-${oldY}`).classList.contains("missed")) && (document.getElementById(`${oldX-1}-${oldY}`).classList.contains("hit") || document.getElementById(`${oldX-1}-${oldY}`).classList.contains("missed")) && (document.getElementById(`${oldX}-${oldY+1}`).classList.contains("hit") || document.getElementById(`${oldX}-${oldY+1}`).classList.contains("missed")) && (document.getElementById(`${oldX}-${oldY-1}`).classList.contains("hit") || document.getElementById(`${oldX}-${oldY-1}`).classList.contains("missed")))
          return getRandomCoordinate();

        if (dir == 0) {
          if (firstCoord[1] + 1 <= upperBound)
            returnCoord = [firstCoord[0], firstCoord[1] + 1];
          else returnCoord = [firstCoord[0], firstCoord[1] - 1];
        } else if (dir == 1) {
          if (firstCoord[1] - 1 >= lowerBound)
            returnCoord = [firstCoord[0], firstCoord[1] - 1];
          else returnCoord = [firstCoord[0], firstCoord[1] + 1];
        } else if (dir == 2) {
          if (firstCoord[0] - 1 >= lowerBound)
            returnCoord = [firstCoord[0] - 1, firstCoord[1]];
          else returnCoord = [firstCoord[0] + 1, firstCoord[1]];
        } else if (dir == 3) {
          if (firstCoord[0] + 1 <= upperBound)
            returnCoord = [firstCoord[0] + 1, firstCoord[1]];
          else returnCoord = [firstCoord[0] - 1, firstCoord[1]];
        }

        return returnCoord;
      } else {
        const lastHit = list.pop();
        let returnCoord = [];
        let orient = "";
        let direct = "";

        if (lastHit[1] == firstCoord[1]) {
          orient = "hori";
          if (lastHit[0] > firstCoord[0]) direct = "right";
          else direct = "left";
        } else {
          orient = "vert";
          if (lastHit[1] > firstCoord[1]) direct = "up";
          else direct = "down";
        }

        if (lastTurnHit != turn - 2) {
          //change directions since last hit is incorrect
          lastHit = firstCoord;
          if (direct == "right") direct = "left";
          else if (direct == "left") direct = "right";
          else if (direct == "up") direct = "down";
          else if (direct == "down") direct = "up";
        }

        if (orient == "hori") {
          if (direct == "right") {
            if (lastHit[0] + 1 <= upperBound)
              returnCoord = [lastHit[0] + 1, lastHit[1]];
            else returnCoord = [firstCoord[0] - 1, lastHit[1]];
          } else if (direct == "left") {
            if (lastHit[0] - 1 >= lowerBound)
              returnCoord = [lastHit[0] - 1, lastHit[1]];
            else returnCoord = [firstCoord[0] + 1, lastHit[1]];
          }
        } else if (orient == "vert") {
          if (direct == "up") {
            if (lastHit[1] + 1 <= upperBound)
              returnCoord = [lastHit[0], lastHit[1] + 1];
            else returnCoord = [lastHit[0], firstCoord[1] - 1];
          } else if (direct == "down") {
            if (lastHit[1] - 1 >= lowerBound)
              returnCoord = [lastHit[0], lastHit[1] - 1];
            else returnCoord = [lastHit[0], firstCoord[1] + 1];
          }
        }

        if(returnCoord.length == 0) //edge case
          returnCoord = getRandomCoordinate();
        return returnCoord;
      }
    } else return getRandomCoordinate();
  };

  const isHuman = () => false;

  return {
    attack,
    getName,
    isHuman,
  };
};

export { player, AI };

