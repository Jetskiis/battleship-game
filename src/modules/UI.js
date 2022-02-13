import {initializePlayers, startGame} from "./gameLoop.js"
import {createGameBoard} from "./factories/gameBoard.js"

let gameBoard = createGameBoard();
let ships = ["carrier","submarine","cruiser","battleship","destroyer"];

//handles start menu asking for player's name
function displayStartMenu(){
    const body = document.querySelector("body");
    const main = document.querySelector("main");

    const startMenu = document.createElement("div");
    const namePrompt = document.createElement("form");
    const startButton = document.createElement("button");

    //hide main while startMenu is being displayed
    main.style.display="none";

    startMenu.classList.add("overlay");
    namePrompt.classList.add("user-form");

    startMenu.appendChild(namePrompt);
    namePrompt.innerHTML = "<label for=username>Enter your username: </label><input type=text name=username id=username>"
    namePrompt.appendChild(startButton);
    startButton.setAttribute("type","submit");
    startButton.innerText = "Continue";

    body.insertBefore(startMenu,main);
    startButton.addEventListener("click",removeStartMenu);
}

//hides start menu after player types in name
function removeStartMenu(e){
    const startMenu = document.querySelector(".overlay");
    const name = document.querySelector("#username").value;
    const main = document.querySelector("main");

    e.preventDefault();

    if(name.length == 0 || !name.match(/^[a-z0-9]+$/i)){
        alert("Invalid name, try again only alphanumeric characters and without spaces");

    }
    else {
        startMenu.remove();
        main.style.display="block";
        initializePlayers(name);
    }
}

//selection menu for ships
function displaySelectionMenu(){
    const body = document.querySelector("body");
    const main = document.querySelector("main");

    const container = document.createElement("div");
    const selectionDiv = document.createElement("div");
    const btnDiv = document.createElement("div");
    const directions = document.createElement("h2");
    const rotateBtn = document.createElement("button");
    const resetBtn = document.createElement("button");
    const startBtn = document.createElement("button");

    container.classList.add("overlay");
    selectionDiv.classList.add("selector");

    directions.textContent = "Place your ships";

    rotateBtn.textContent = "Rotate";
    rotateBtn.addEventListener("click",rotateAxis);
    rotateBtn.classList.add("x-axis");
    rotateBtn.setAttribute("id","rotate");
    
    btnDiv.classList.add("btn-div");
    resetBtn.setAttribute("id","reset");
    resetBtn.addEventListener("click",resetSelection);
    resetBtn.textContent = "Reset";
    startBtn.addEventListener("click",submitSelections);
    startBtn.setAttribute("id","start");
    startBtn.textContent = "Start";

    btnDiv.appendChild(startBtn);
    btnDiv.appendChild(resetBtn);
    selectionDiv.appendChild(directions);
    selectionDiv.appendChild(rotateBtn);
    selectionDiv.appendChild(btnDiv);
    container.appendChild(selectionDiv);

    body.insertBefore(container,main);
    createGrid();
}

//generate 10x10 grid using CSS/JS for selection menu
function createGrid(){
    const parentContainer = document.querySelector(".selector");
    const adjacentNode = document.querySelector(".btn-div");
    const container = document.createElement("div");

    container.addEventListener("mouseleave",clearSelected);

    for(let y = 1; y <= 10; y++){
        for(let x = 1; x <= 10; x++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("id",`${x}-${11-y}`);
            cell.addEventListener("mouseover",previewPlacement);
            cell.addEventListener("click",attemptPlacement)
            container.appendChild(cell);
        }
    }

    container.classList.add("grid");

    parentContainer.insertBefore(container,adjacentNode);
}


//toggles between x and y rotations using classes
function rotateAxis(e){
    const parent = e.target;
    if(parent.getAttribute("class").includes("x-axis")){
        parent.classList.remove("x-axis");
        parent.classList.add("y-axis");
    }
    else {
        parent.classList.remove("y-axis");
        parent.classList.add("x-axis");
    }
}

//clear all previous highlights
export function clearSelected(){
    const previousSelected = document.querySelectorAll(".highlight, .invalid");
    previousSelected.forEach((node)=>
    {   if(!node.classList.contains("placed"))
            node.classList.remove("highlight","invalid");
    });
}


//highlights square before ships is placed
function previewPlacement(e){   
    const currentCell = e.target.getAttribute("id");
    const axis = document.querySelector("#rotate").getAttribute("class");
    const [x,y] = currentCell.split("-");

    clearSelected();

    if(ships.length > 0){
        const currentShip = ships[ships.length-1];
        const len = gameBoard.allShips[currentShip];

        if(axis == "x-axis") {
            if(Number(x) + len - 1 <= 10){
                e.target.classList.add("highlight");
                for(let i = 1; i < len; i++){
                    const adjacentCell = document.getElementById(`${Number(x) + i}-${Number(y)}`);
                    adjacentCell.classList.add("highlight");
                }
            }
            else if(!e.target.classList.contains("placed")){
                e.target.classList.add("invalid");
            }
             
        }
        else if (axis == "y-axis") {
            if(Number(y) + len - 1 <= 10){
                e.target.classList.add("highlight");
                for(let i = 1; i < len; i++){
                    const adjacentCell = document.getElementById(`${Number(x)}-${Number(y)+i}`);
                    adjacentCell.classList.add("highlight");
                }
            }
            else if (!e.target.classList.contains("placed")){
                e.target.classList.add("invalid");
            }
        }
    }
}

//tries to place ship on clicked square
function attemptPlacement(e){
    const currentCell = e.target.getAttribute("id");
    const axis = document.querySelector("#rotate").getAttribute("class");
    const [x,y] = currentCell.split("-"); //x and y are strings
    const currentShip = ships[ships.length-1];
    const len = gameBoard.allShips[currentShip];
    const cells = [];
    let colorClass;

    cells.push(e.target);

    if(axis == "x-axis") {
        if(Number(x) + len - 1 <= 10){
            for(let i = 1; i < len; i++){
                const adjacentCell = document.getElementById(`${Number(x) + i}-${Number(y)}`);
                cells.push(adjacentCell);
            }
        }   
    }
    else if (axis == "y-axis") {
        if(Number(y) + len - 1 <= 10){
            for(let i = 1; i < len; i++){
                const adjacentCell = document.getElementById(`${Number(x)}-${Number(y)+i}`);
                cells.push(adjacentCell);
            }
        }
    }

    switch(ships.length){
        case(5):
            colorClass = "fifth";
            break;
        case(4):
            colorClass = "fourth";
            break;
        case(3):
            colorClass = "third";
            break;
        case(2):
            colorClass = "second";
            break;
        case(1):
            colorClass = "first";
            break;
        default:
            break;
    }

    //checks if current placement is valid (cells not occupied already,not out of boudns)
    if(cells.every((node)=>!node.classList.contains("placed") && !node.classList.contains("invalid"))){
        cells.forEach((node)=>{
            node.classList.add("placed");
            node.classList.add(`${colorClass}`)
        });
        gameBoard.place([Number(x),Number(y)], axis == "x-axis"? "x" : "y", currentShip);
        ships.pop();
    }

}

function resetSelection(){
    const cells = document.querySelectorAll(".cell");

    gameBoard = createGameBoard();
    ships = ["carrier","submarine","cruiser","battleship","destroyer"];
    cells.forEach((cell)=>{
        cell.classList.remove("first");
        cell.classList.remove("second");
        cell.classList.remove("third");
        cell.classList.remove("fourth");
        cell.classList.remove("fifth");
        cell.classList.remove("highlight");
        cell.classList.remove("invalid");
        cell.classList.remove("placed");
    })
}

function submitSelections(){
    const selectionOverlay = document.querySelector(".overlay");
    
    if(ships.length == 0){
        selectionOverlay.remove();
        startGame(gameBoard);
    }
    else {
        alert("Place all your ships first");
    }

}

export {displayStartMenu, displaySelectionMenu}