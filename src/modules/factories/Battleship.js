//startCoords contains all the coordinates the ship occupies in [[x1,y1][x1,y2]...] form
//coords of x and y range from [1,10]
const battleShip = (len, startCoords) => {
  let lives = Array(len).fill("O");
  let hasTakenDamage = false;

  //marks index (num) of lives array as being hit
  const hit = (hitCoords) => {
    const x = hitCoords[0];
    const y = hitCoords[1];
    for (const [i, coord] of startCoords.entries()) {
      //coordinates are occupied by a ship
      if (coord[0] == x && coord[1] == y) {
        //if position is previously hit
        if (lives[i] == "X") {
          return false;
        } else {
          lives[i] = "X";
          hasTakenDamage = true;
          return true;
        }
      }
    }
    return false;
  };

  //if all parts of ship has been hit then its sunk
  const beenSunk = () => {
    if (lives.every((element) => element == "X")) return true;
    else return false;
  };

  //checks if ship has been hit at least once
  const beenHit = () => {
    return hasTakenDamage;
  };

  const getLength = () => {
    return len;
  };
  const getLives = () => {
    let count = 0;
    for (const life of lives) {
      if (life == "O") count++;
    }
    return count;
  };

  return {
    hit,
    beenHit,
    beenSunk,
    getLength,
    getLives,
  };
};

export default battleShip;
