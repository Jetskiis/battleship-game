import gameBoard from "../modules/factories/Gameboard.js";
import { AI, player } from "../modules/factories/Player.js";

let playerBoard = gameBoard();
let AIBoard = gameBoard();
let plr1 = player("Joseph");
let plr2 = AI();

playerBoard.place([1,1],"x","carrier"); //from [1,1] to [5,1]

describe("Testing human player functions", () => {
  test("See if returned name is correct", () => {
    expect(plr1.getName()).toBe("Joseph");
  });
  test("Attack enemy player (AI) playerBoard on player's turn", () => {
    expect(plr1.attack([1, 1], AIBoard, 0)).toBe(true);
  });
  test("Attack enemy player (AI) playerBoard not on player's turn ", () => {
    expect(plr1.attack([1, 2], AIBoard, 1)).toBe(false);
  });
  test("Attack enemy player (AI) playerBoard on player's turn ", () => {
    expect(plr1.attack([9, 2], AIBoard, 2)).toBe(true);
  });
  test("Player is human", () => {
    expect(plr1.isHuman()).toBe(true);
  });
});

describe("Testing AI player functions", () => {
  test("AI attacking on AI's turn", () => {
    expect(plr2.attack(playerBoard,1)).toBe(true);
  });
  test("AI attacking not on AI's turn", () => {
    expect(plr2.attack(playerBoard,2)).toBe(false);
  });
  test("AI attacking on AI's turn", () => {
    expect(plr2.attack(playerBoard,3)).toBe(true);
  });
  test("Name of AI",()=>{
    expect(plr2.getName()).toBe("AI");
  });
  test("Is AI human",()=>{
      expect(plr2.isHuman()).toBe(false);
  })
});
