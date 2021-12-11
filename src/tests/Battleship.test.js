import battleShip from "../modules/factories/Battleship.js";

describe("Testing arguments (length) for battleship", () => {
  test("return 2 and 3 for length", () => {
    let length = 2;
    let submarine = battleShip(3,undefined);
    let destroyer = battleShip(length,undefined);

    expect(submarine.getLength()).toBe(3);
    expect(destroyer.getLength()).toBe(2);
  });
});

let testShip1 = battleShip(3,[[2,2],[3,2],[4,2]]);
//ship is horizontally placed

describe("Testing ship methods", () => {
  test("ship1 should not be hit yet",()=>{
      expect(testShip1.beenHit()).toBe(false);
  });
  test("ship1 should not be sunk yet",()=>{
      expect(testShip1.beenSunk()).toBe(false);
  });
  test("lives should be at 3",()=>{
      expect(testShip1.getLives()).toBe(3);
  })
  test("start position of ship1 should be hit",()=>{
      expect(testShip1.hit([2,2])).toBe(true);
  });
  test("ship1 should be hit now",()=>{
      expect(testShip1.beenHit()).toBe(true);
  })
  test("lives should be at 2",()=>{
    expect(testShip1.getLives()).toBe(2);
})
  test("middle of the ship1 should be hit",()=>{
    expect(testShip1.hit([3,2])).toBe(true);
  });
  test("ship1 should not be hit",()=>{
    expect(testShip1.hit(3)).toBe(false);
  });
  test("end of ship1 should be hit",()=>{
    expect(testShip1.hit([4,2])).toBe(true);
  });
  test("ship1 should be sunk now",()=>{
      expect(testShip1.beenSunk()).toBe(true);
  });
  test("lives should be at 0",()=>{
    expect(testShip1.getLives()).toBe(0);
})


});
