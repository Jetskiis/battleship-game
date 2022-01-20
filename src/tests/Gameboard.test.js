import {createGameBoard} from "../modules/factories/gameBoard.js";

let board = createGameBoard();

describe("Ship placement", () => {
  test("Places ship successfully", () => {
    expect(board.place([1, 1], "x", "submarine")).toBe(true);
  });
  test("Places ship successfully", () => {
    expect(board.place([10, 6], "y", "submarine")).toBe(true);
  });
  test("Ship is out of bounds of gameboard", () => {
    expect(board.place([10, 2], "x", "destroyer")).toBe(false);
  });
  test("Ship is out of bounds of gameboard", () => {
    expect(board.place([1, 10], "y", "destroyer")).toBe(false);
  });
  test("Ship already placed at a certain location", () => {
    expect(board.place([3, 1], "x", "destroyer")).toBe(false);
  });
  test("Ship already placed at a certain location", () => {
    expect(board.place([2, 1], "y", "destroyer")).toBe(false);
  }); 
});

describe("Testing attacking on the board", () => {
  test("Attack successful", () => {
      expect(board.receiveAttack([1,1])).toBe(true);
  });
  test("Attack successful", () => {
    expect(board.receiveAttack([3,1])).toBe(true);
});
  test("Attack not successful", () => {
      expect(board.receiveAttack([4,1])).toBe(false);
  });
  test("Attack not successful", () => {
    expect(board.receiveAttack([5,1])).toBe(false);
});
  test("Attack successful", () => {
      expect(board.receiveAttack([10,7])).toBe(true);
  });
  test("Attack successful", () => {
    expect(board.receiveAttack([10,8])).toBe(true);
});
  test("Attack not successful", () => {
      expect(board.receiveAttack([8,8])).toBe(false);
  });
  test("Already attacked position, position already taken", () => {
      expect(board.receiveAttack([3,1])).toBe(false);
  });
  test("Already attacked position, position already taken", () => {
    expect(board.receiveAttack([10,7])).toBe(false);
});
  test("Already attacked position, position originally not occupied by ship", () => {
    expect(board.receiveAttack([8,8])).toBe(false);
}); 
});

describe("Testing hit and  missed attacks and if all ships are sunk",()=>{
  test("Display missed attacks",()=>{
    expect(board.getMissedAttacks()).toHaveLength(3);
    expect(board.getMissedAttacks()).toContainEqual([4,1]);
    expect(board.getMissedAttacks()).toContainEqual([5,1]);
    expect(board.getMissedAttacks()).toContainEqual([8,8]);
  })
  test("Display hit attacks",()=>{
    expect(board.getHitAttacks()).toHaveLength(4);
    expect(board.getHitAttacks()).toContainEqual([1,1]);
    expect(board.getHitAttacks()).toContainEqual([3,1]);
    expect(board.getHitAttacks()).toContainEqual([10,7]);
    expect(board.getHitAttacks()).toContainEqual([10,8]);
  })
  test("All ships should not be sunk yet",()=>{
    expect(board.allShipsSunk()).toBe(false);
  });
  test("All ships should be sunk",()=>{
    board.receiveAttack([2,1]);
    board.receiveAttack([10,6]);
    expect(board.allShipsSunk()).toBe(true);
  });
})