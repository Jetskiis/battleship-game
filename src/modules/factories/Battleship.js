const battleShip = (len, startCoords) => {
  let lives = Array(len).fill("O");
  let hasTakenDamage = false;

  const hit = (hitCoords) => {
    const x = hitCoords[0];
    const y = hitCoords[1];
    for (const [i, coord] of startCoords.entries()) {
      if (coord[0] === x && coord[1] === y) {
        lives[i] = "X";
        hasTakenDamage = true;
        return true
      }
    }
    return false
  };
  const beenSunk = () => {
    if (lives.every((element) => element === "X")) return true;
    else return false;
  };
  const beenHit = () => {
    return hasTakenDamage;
  };
  const getLength = () => {
    return len;
  };
  const getLives = () => {
    let count = 0;
    for (const life of lives) {
      if (life === "O") count++;
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

module.exports = battleShip;
