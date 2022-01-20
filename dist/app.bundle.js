/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/UI.js":
/*!***************************!*\
  !*** ./src/modules/UI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "displayStartMenu": () => (/* binding */ displayStartMenu),
/* harmony export */   "displaySelectionMenu": () => (/* binding */ displaySelectionMenu)
/* harmony export */ });
/* harmony import */ var _gameLoop_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameLoop.js */ "./src/modules/gameLoop.js");
 // import {createGameBoard} from "./factories/gameBoard.js"
//handles start menu asking for player's name

function displayStartMenu() {
  var body = document.querySelector("body");
  var main = document.querySelector("main");
  var startMenu = document.createElement("div");
  var namePrompt = document.createElement("form");
  var startButton = document.createElement("button"); //hide main while startMenu is being displayed

  main.style.display = "none";
  startMenu.classList.add("overlay");
  namePrompt.classList.add("user-form");
  startMenu.appendChild(namePrompt);
  namePrompt.innerHTML = "<label for=username>Enter your username: </label><input type=text name=username id=username>";
  namePrompt.appendChild(startButton);
  startButton.setAttribute("type", "submit");
  startButton.innerText = "Continue";
  body.insertBefore(startMenu, main);
  startButton.addEventListener("click", removeStartMenu);
} //hides start menu after player types in name


function removeStartMenu(e) {
  var startMenu = document.querySelector(".overlay");
  var name = document.querySelector("#username").value;
  var main = document.querySelector("main");
  e.preventDefault();

  if (name.length == 0 || !name.match(/^[a-z0-9]+$/i)) {
    alert("Invalid name, try again only alphanumeric characters and without spaces");
  } else {
    startMenu.remove();
    main.style.display = "block";
    (0,_gameLoop_js__WEBPACK_IMPORTED_MODULE_0__.initializePlayers)(name);
  }
} //selection menu for ships


function displaySelectionMenu() {
  var body = document.querySelector("body");
  var main = document.querySelector("main");
  var container = document.createElement("div");
  var selectionDiv = document.createElement("div");
  var directions = document.createElement("h2");
  var rotateBtn = document.createElement("button");
  directions.textContent = "Place your ship";
  rotateBtn.textContent = "Rotate";
  selectionDiv.appendChild(directions);
  selectionDiv.appendChild(rotateBtn);
  container.appendChild(selectionDiv);
  container.classList.add("overlay");
  selectionDiv.classList.add("selector");
  body.insertBefore(container, main);
  shipSelection();
} //generate 10x10 grid using CSS/JS


function createGrid() {
  var parentContainer = document.querySelector(".selector");
  var container = document.createElement("div");

  for (var x = 1; x <= 10; x++) {
    for (var y = 1; y <= 10; y++) {
      var cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", "".concat(x, "-").concat(y));
      cell.addEventListener("mouseover", previewPlacement);
      cell.addEventListener("click", attemptPlacement);
      container.appendChild(cell);
    }
  }

  container.classList.add("grid");
  parentContainer.appendChild(container);
} //handles actual ship selection


function shipSelection() {
  createGrid();
}

function resetSelection() {}



/***/ }),

/***/ "./src/modules/factories/player.js":
/*!*****************************************!*\
  !*** ./src/modules/factories/player.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "player": () => (/* binding */ player),
/* harmony export */   "AI": () => (/* binding */ AI)
/* harmony export */ });
/* harmony import */ var sanitize_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sanitize-html */ "./node_modules/sanitize-html/index.js");
/* harmony import */ var sanitize_html__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sanitize_html__WEBPACK_IMPORTED_MODULE_0__);


var player = function player(name) {
  var playerName = sanitize_html__WEBPACK_IMPORTED_MODULE_0___default()(name);
  var isCurrentlyPlaying = false;

  var attack = function attack(coords, board, turn) {
    turn % 2 == 0 ? isCurrentlyPlaying = true : isCurrentlyPlaying = false;

    if (isCurrentlyPlaying == true) {
      board.receiveAttack(coords); //doesnt tell us if attack was successful/not successful/redundant

      return true;
    } else {
      return false;
    }
  };

  var getName = function getName() {
    return playerName;
  };

  var isHuman = function isHuman() {
    return true;
  };

  return {
    attack: attack,
    getName: getName,
    isHuman: isHuman
  };
};

var AI = function AI() {
  var isCurrentlyPlaying = false;

  var _player = player("AI"),
      getName = _player.getName; //randomly attacks location


  var attack = function attack(board, turn) {
    turn % 2 == 0 ? isCurrentlyPlaying = false : isCurrentlyPlaying = true;

    if (isCurrentlyPlaying == true) {
      var coords = getRandomCoordinate();
      board.receiveAttack(coords);
      return true;
    } else {
      return false;
    }
  };

  var getRandomCoordinate = function getRandomCoordinate() {
    var randomX = Math.floor(Math.random() * 11);
    var randomY = Math.floor(Math.random() * 11);
    return [randomX, randomY];
  };

  var isHuman = function isHuman() {
    return false;
  };

  return {
    attack: attack,
    getName: getName,
    isHuman: isHuman
  };
}; //lets AI determine how to lock on to adjacent points after it gets a hit onto a point


function smartDetection() {}



/***/ }),

/***/ "./src/modules/gameLoop.js":
/*!*********************************!*\
  !*** ./src/modules/gameLoop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "runGameLoop": () => (/* binding */ runGameLoop),
/* harmony export */   "initializePlayers": () => (/* binding */ initializePlayers),
/* harmony export */   "startGame": () => (/* binding */ startGame)
/* harmony export */ });
/* harmony import */ var _UI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI.js */ "./src/modules/UI.js");
/* harmony import */ var _factories_player_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./factories/player.js */ "./src/modules/factories/player.js");

 // import {createGameBoard} from "./factories/gameBoard.js"

var humanPlr;
var AIPlr = (0,_factories_player_js__WEBPACK_IMPORTED_MODULE_1__.AI)();

function runGameLoop() {
  (0,_UI_js__WEBPACK_IMPORTED_MODULE_0__.displayStartMenu)();
}

function initializePlayers(name) {
  humanPlr = (0,_factories_player_js__WEBPACK_IMPORTED_MODULE_1__.player)(name);
  var plrHeading = document.querySelector("#player1").querySelector("h2");
  plrHeading.textContent = humanPlr.getName();
  (0,_UI_js__WEBPACK_IMPORTED_MODULE_0__.displaySelectionMenu)();
}

function startGame() {}



/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style/style.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style/style.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../img/heading.png */ "./src/img/heading.png"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\nhtml,body {\r\n    min-height: 100vh;\r\n    height: 100%;\r\n    background: rgb(78, 78, 228);\r\n}\r\n\r\n\r\nheader {\r\n    background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") padding-box no-repeat center;\r\n    background-size: 27em 8em;\r\n    padding: 4em;\r\n}\r\n\r\nmain {\r\n    min-height: 75vh;\r\n}\r\n\r\n/*layout of boards */\r\n.board-container {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: center;\r\n    gap: 15em;\r\n\r\n    margin-top: 1em;\r\n\r\n}\r\n\r\n.board {\r\n    height: 35em;\r\n    width: 30em;\r\n\r\n    padding: 2em;\r\n    text-align: center;\r\n}\r\n\r\n.board h2 {\r\n    font-size: 2.5em;\r\n    color: white;\r\n}\r\n\r\n/*hide main element */\r\n.overlay {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: flex-start;\r\n\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100vh;\r\n    margin-top: 2em;\r\n\r\n    background: rgb(21, 129, 218);\r\n    z-index: 1;\r\n}\r\n\r\n/*start menu */\r\n.user-form{\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n\r\n    margin-top: 10em;\r\n}\r\n\r\n.user-form label {\r\n    padding: 0.5em;\r\n\r\n    font-size: 1.4em;\r\n    text-transform: uppercase;\r\n    color: rgb(1, 22, 56);\r\n    font-weight: bold;\r\n}\r\n\r\n.user-form input {\r\n    padding: 0.8em;\r\n    width: 100%;\r\n\r\n    font-size: 1.1em;\r\n}\r\n\r\n.user-form button {\r\n    padding: 1em;\r\n    margin: 1em;\r\n\r\n    background: rgb(45, 147, 243);\r\n    color: white;\r\n    text-transform: uppercase;\r\n    font-weight: bold;\r\n    border: none;\r\n}\r\n\r\n.user-form button:hover {\r\n    background: rgb(7, 87, 236);\r\n}\r\n\r\n/*selection menu for ships */\r\n.selector {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n    width: 100%;\r\n    height: 100%;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.selector h2 {\r\n    color:rgb(1, 22, 56);\r\n    font-size: 2em;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.01em;\r\n}\r\n\r\n.selector button {\r\n    margin: 1.2em 0;\r\n    padding: 0.7em;\r\n\r\n    background: blue;\r\n    font-size: 1.2em;\r\n    text-transform: uppercase;\r\n    color:white;\r\n    border: none;\r\n}\r\n\r\n.selector button:hover {\r\n    background: rgb(3, 65, 180);\r\n}\r\n\r\n.grid{\r\n    display: grid;\r\n    grid-template-columns: repeat(10,1fr);\r\n    grid-template-rows: repeat(10,1fr);\r\n    grid-gap: 0.2em 0.2em;\r\n\r\n    height: 50%;\r\n    width: 25%;\r\n}\r\n\r\n.grid .cell{\r\n    background: rgb(207, 206, 206);\r\n}", "",{"version":3,"sources":["webpack://./src/style/style.css"],"names":[],"mappings":"AAAA;IACI,SAAS;IACT,UAAU;IACV,sBAAsB;AAC1B;;AAEA;IACI,iBAAiB;IACjB,YAAY;IACZ,4BAA4B;AAChC;;;AAGA;IACI,gFAAkE;IAClE,yBAAyB;IACzB,YAAY;AAChB;;AAEA;IACI,gBAAgB;AACpB;;AAEA,oBAAoB;AACpB;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,mBAAmB;IACnB,SAAS;;IAET,eAAe;;AAEnB;;AAEA;IACI,YAAY;IACZ,WAAW;;IAEX,YAAY;IACZ,kBAAkB;AACtB;;AAEA;IACI,gBAAgB;IAChB,YAAY;AAChB;;AAEA,qBAAqB;AACrB;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;IACvB,uBAAuB;;IAEvB,eAAe;IACf,WAAW;IACX,aAAa;IACb,eAAe;;IAEf,6BAA6B;IAC7B,UAAU;AACd;;AAEA,cAAc;AACd;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;;IAEnB,gBAAgB;AACpB;;AAEA;IACI,cAAc;;IAEd,gBAAgB;IAChB,yBAAyB;IACzB,qBAAqB;IACrB,iBAAiB;AACrB;;AAEA;IACI,cAAc;IACd,WAAW;;IAEX,gBAAgB;AACpB;;AAEA;IACI,YAAY;IACZ,WAAW;;IAEX,6BAA6B;IAC7B,YAAY;IACZ,yBAAyB;IACzB,iBAAiB;IACjB,YAAY;AAChB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA,4BAA4B;AAC5B;IACI,aAAa;IACb,sBAAsB;IACtB,mBAAmB;;IAEnB,WAAW;IACX,YAAY;IACZ,iBAAiB;AACrB;;AAEA;IACI,oBAAoB;IACpB,cAAc;IACd,yBAAyB;IACzB,sBAAsB;AAC1B;;AAEA;IACI,eAAe;IACf,cAAc;;IAEd,gBAAgB;IAChB,gBAAgB;IAChB,yBAAyB;IACzB,WAAW;IACX,YAAY;AAChB;;AAEA;IACI,2BAA2B;AAC/B;;AAEA;IACI,aAAa;IACb,qCAAqC;IACrC,kCAAkC;IAClC,qBAAqB;;IAErB,WAAW;IACX,UAAU;AACd;;AAEA;IACI,8BAA8B;AAClC","sourcesContent":["* {\r\n    margin: 0;\r\n    padding: 0;\r\n    box-sizing: border-box;\r\n}\r\n\r\nhtml,body {\r\n    min-height: 100vh;\r\n    height: 100%;\r\n    background: rgb(78, 78, 228);\r\n}\r\n\r\n\r\nheader {\r\n    background: url(\"../img/heading.png\") padding-box no-repeat center;\r\n    background-size: 27em 8em;\r\n    padding: 4em;\r\n}\r\n\r\nmain {\r\n    min-height: 75vh;\r\n}\r\n\r\n/*layout of boards */\r\n.board-container {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: center;\r\n    gap: 15em;\r\n\r\n    margin-top: 1em;\r\n\r\n}\r\n\r\n.board {\r\n    height: 35em;\r\n    width: 30em;\r\n\r\n    padding: 2em;\r\n    text-align: center;\r\n}\r\n\r\n.board h2 {\r\n    font-size: 2.5em;\r\n    color: white;\r\n}\r\n\r\n/*hide main element */\r\n.overlay {\r\n    display: flex;\r\n    flex-direction: row;\r\n    justify-content: center;\r\n    align-items: flex-start;\r\n\r\n    position: fixed;\r\n    width: 100%;\r\n    height: 100vh;\r\n    margin-top: 2em;\r\n\r\n    background: rgb(21, 129, 218);\r\n    z-index: 1;\r\n}\r\n\r\n/*start menu */\r\n.user-form{\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n\r\n    margin-top: 10em;\r\n}\r\n\r\n.user-form label {\r\n    padding: 0.5em;\r\n\r\n    font-size: 1.4em;\r\n    text-transform: uppercase;\r\n    color: rgb(1, 22, 56);\r\n    font-weight: bold;\r\n}\r\n\r\n.user-form input {\r\n    padding: 0.8em;\r\n    width: 100%;\r\n\r\n    font-size: 1.1em;\r\n}\r\n\r\n.user-form button {\r\n    padding: 1em;\r\n    margin: 1em;\r\n\r\n    background: rgb(45, 147, 243);\r\n    color: white;\r\n    text-transform: uppercase;\r\n    font-weight: bold;\r\n    border: none;\r\n}\r\n\r\n.user-form button:hover {\r\n    background: rgb(7, 87, 236);\r\n}\r\n\r\n/*selection menu for ships */\r\n.selector {\r\n    display: flex;\r\n    flex-direction: column;\r\n    align-items: center;\r\n    \r\n    width: 100%;\r\n    height: 100%;\r\n    margin-top: 3.5em;\r\n}\r\n\r\n.selector h2 {\r\n    color:rgb(1, 22, 56);\r\n    font-size: 2em;\r\n    text-transform: uppercase;\r\n    letter-spacing: 0.01em;\r\n}\r\n\r\n.selector button {\r\n    margin: 1.2em 0;\r\n    padding: 0.7em;\r\n\r\n    background: blue;\r\n    font-size: 1.2em;\r\n    text-transform: uppercase;\r\n    color:white;\r\n    border: none;\r\n}\r\n\r\n.selector button:hover {\r\n    background: rgb(3, 65, 180);\r\n}\r\n\r\n.grid{\r\n    display: grid;\r\n    grid-template-columns: repeat(10,1fr);\r\n    grid-template-rows: repeat(10,1fr);\r\n    grid-gap: 0.2em 0.2em;\r\n\r\n    height: 50%;\r\n    width: 25%;\r\n}\r\n\r\n.grid .cell{\r\n    background: rgb(207, 206, 206);\r\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    options = {};
  }

  if (!url) {
    return url;
  }

  url = String(url.__esModule ? url.default : url); // If url is already wrapped in quotes, remove them

  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }

  if (options.hash) {
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }

  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/deepmerge/dist/cjs.js":
/*!********************************************!*\
  !*** ./node_modules/deepmerge/dist/cjs.js ***!
  \********************************************/
/***/ ((module) => {

"use strict";


var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, options) {
	return (options.clone !== false && options.isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, options)
		: value
}

function defaultArrayMerge(target, source, options) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, options)
	})
}

function getMergeFunction(key, options) {
	if (!options.customMerge) {
		return deepmerge
	}
	var customMerge = options.customMerge(key);
	return typeof customMerge === 'function' ? customMerge : deepmerge
}

function getEnumerableOwnPropertySymbols(target) {
	return Object.getOwnPropertySymbols
		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return target.propertyIsEnumerable(symbol)
		})
		: []
}

function getKeys(target) {
	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
}

function propertyIsOnObject(object, property) {
	try {
		return property in object
	} catch(_) {
		return false
	}
}

// Protects from prototype poisoning and unexpected merging up the prototype chain.
function propertyIsUnsafe(target, key) {
	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
}

function mergeObject(target, source, options) {
	var destination = {};
	if (options.isMergeableObject(target)) {
		getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
	}
	getKeys(source).forEach(function(key) {
		if (propertyIsUnsafe(target, key)) {
			return
		}

		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
		} else {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		}
	});
	return destination
}

function deepmerge(target, source, options) {
	options = options || {};
	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
	// implementations can use it. The caller may not replace it.
	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, options)
	} else if (sourceIsArray) {
		return options.arrayMerge(target, source, options)
	} else {
		return mergeObject(target, source, options)
	}
}

deepmerge.all = function deepmergeAll(array, options) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, options)
	}, {})
};

var deepmerge_1 = deepmerge;

module.exports = deepmerge_1;


/***/ }),

/***/ "./node_modules/dom-serializer/lib/foreignNames.js":
/*!*********************************************************!*\
  !*** ./node_modules/dom-serializer/lib/foreignNames.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.attributeNames = exports.elementNames = void 0;
exports.elementNames = new Map([
    ["altglyph", "altGlyph"],
    ["altglyphdef", "altGlyphDef"],
    ["altglyphitem", "altGlyphItem"],
    ["animatecolor", "animateColor"],
    ["animatemotion", "animateMotion"],
    ["animatetransform", "animateTransform"],
    ["clippath", "clipPath"],
    ["feblend", "feBlend"],
    ["fecolormatrix", "feColorMatrix"],
    ["fecomponenttransfer", "feComponentTransfer"],
    ["fecomposite", "feComposite"],
    ["feconvolvematrix", "feConvolveMatrix"],
    ["fediffuselighting", "feDiffuseLighting"],
    ["fedisplacementmap", "feDisplacementMap"],
    ["fedistantlight", "feDistantLight"],
    ["fedropshadow", "feDropShadow"],
    ["feflood", "feFlood"],
    ["fefunca", "feFuncA"],
    ["fefuncb", "feFuncB"],
    ["fefuncg", "feFuncG"],
    ["fefuncr", "feFuncR"],
    ["fegaussianblur", "feGaussianBlur"],
    ["feimage", "feImage"],
    ["femerge", "feMerge"],
    ["femergenode", "feMergeNode"],
    ["femorphology", "feMorphology"],
    ["feoffset", "feOffset"],
    ["fepointlight", "fePointLight"],
    ["fespecularlighting", "feSpecularLighting"],
    ["fespotlight", "feSpotLight"],
    ["fetile", "feTile"],
    ["feturbulence", "feTurbulence"],
    ["foreignobject", "foreignObject"],
    ["glyphref", "glyphRef"],
    ["lineargradient", "linearGradient"],
    ["radialgradient", "radialGradient"],
    ["textpath", "textPath"],
]);
exports.attributeNames = new Map([
    ["definitionurl", "definitionURL"],
    ["attributename", "attributeName"],
    ["attributetype", "attributeType"],
    ["basefrequency", "baseFrequency"],
    ["baseprofile", "baseProfile"],
    ["calcmode", "calcMode"],
    ["clippathunits", "clipPathUnits"],
    ["diffuseconstant", "diffuseConstant"],
    ["edgemode", "edgeMode"],
    ["filterunits", "filterUnits"],
    ["glyphref", "glyphRef"],
    ["gradienttransform", "gradientTransform"],
    ["gradientunits", "gradientUnits"],
    ["kernelmatrix", "kernelMatrix"],
    ["kernelunitlength", "kernelUnitLength"],
    ["keypoints", "keyPoints"],
    ["keysplines", "keySplines"],
    ["keytimes", "keyTimes"],
    ["lengthadjust", "lengthAdjust"],
    ["limitingconeangle", "limitingConeAngle"],
    ["markerheight", "markerHeight"],
    ["markerunits", "markerUnits"],
    ["markerwidth", "markerWidth"],
    ["maskcontentunits", "maskContentUnits"],
    ["maskunits", "maskUnits"],
    ["numoctaves", "numOctaves"],
    ["pathlength", "pathLength"],
    ["patterncontentunits", "patternContentUnits"],
    ["patterntransform", "patternTransform"],
    ["patternunits", "patternUnits"],
    ["pointsatx", "pointsAtX"],
    ["pointsaty", "pointsAtY"],
    ["pointsatz", "pointsAtZ"],
    ["preservealpha", "preserveAlpha"],
    ["preserveaspectratio", "preserveAspectRatio"],
    ["primitiveunits", "primitiveUnits"],
    ["refx", "refX"],
    ["refy", "refY"],
    ["repeatcount", "repeatCount"],
    ["repeatdur", "repeatDur"],
    ["requiredextensions", "requiredExtensions"],
    ["requiredfeatures", "requiredFeatures"],
    ["specularconstant", "specularConstant"],
    ["specularexponent", "specularExponent"],
    ["spreadmethod", "spreadMethod"],
    ["startoffset", "startOffset"],
    ["stddeviation", "stdDeviation"],
    ["stitchtiles", "stitchTiles"],
    ["surfacescale", "surfaceScale"],
    ["systemlanguage", "systemLanguage"],
    ["tablevalues", "tableValues"],
    ["targetx", "targetX"],
    ["targety", "targetY"],
    ["textlength", "textLength"],
    ["viewbox", "viewBox"],
    ["viewtarget", "viewTarget"],
    ["xchannelselector", "xChannelSelector"],
    ["ychannelselector", "yChannelSelector"],
    ["zoomandpan", "zoomAndPan"],
]);


/***/ }),

/***/ "./node_modules/dom-serializer/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/dom-serializer/lib/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Module dependencies
 */
var ElementType = __importStar(__webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/index.js"));
var entities_1 = __webpack_require__(/*! entities */ "./node_modules/entities/lib/index.js");
/**
 * Mixed-case SVG and MathML tags & attributes
 * recognized by the HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
 */
var foreignNames_1 = __webpack_require__(/*! ./foreignNames */ "./node_modules/dom-serializer/lib/foreignNames.js");
var unencodedElements = new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript",
]);
/**
 * Format attributes
 */
function formatAttributes(attributes, opts) {
    if (!attributes)
        return;
    return Object.keys(attributes)
        .map(function (key) {
        var _a, _b;
        var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
        if (opts.xmlMode === "foreign") {
            /* Fix up mixed-case attribute names */
            key = (_b = foreignNames_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
        }
        if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
            return key;
        }
        return key + "=\"" + (opts.decodeEntities !== false
            ? entities_1.encodeXML(value)
            : value.replace(/"/g, "&quot;")) + "\"";
    })
        .join(" ");
}
/**
 * Self-enclosing tags
 */
var singleTag = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);
/**
 * Renders a DOM node or an array of DOM nodes to a string.
 *
 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
 *
 * @param node Node to be rendered.
 * @param options Changes serialization behavior
 */
function render(node, options) {
    if (options === void 0) { options = {}; }
    var nodes = "length" in node ? node : [node];
    var output = "";
    for (var i = 0; i < nodes.length; i++) {
        output += renderNode(nodes[i], options);
    }
    return output;
}
exports["default"] = render;
function renderNode(node, options) {
    switch (node.type) {
        case ElementType.Root:
            return render(node.children, options);
        case ElementType.Directive:
        case ElementType.Doctype:
            return renderDirective(node);
        case ElementType.Comment:
            return renderComment(node);
        case ElementType.CDATA:
            return renderCdata(node);
        case ElementType.Script:
        case ElementType.Style:
        case ElementType.Tag:
            return renderTag(node, options);
        case ElementType.Text:
            return renderText(node, options);
    }
}
var foreignModeIntegrationPoints = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title",
]);
var foreignElements = new Set(["svg", "math"]);
function renderTag(elem, opts) {
    var _a;
    // Handle SVG / MathML in HTML
    if (opts.xmlMode === "foreign") {
        /* Fix up mixed-case element names */
        elem.name = (_a = foreignNames_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
        /* Exit foreign mode at integration points */
        if (elem.parent &&
            foreignModeIntegrationPoints.has(elem.parent.name)) {
            opts = __assign(__assign({}, opts), { xmlMode: false });
        }
    }
    if (!opts.xmlMode && foreignElements.has(elem.name)) {
        opts = __assign(__assign({}, opts), { xmlMode: "foreign" });
    }
    var tag = "<" + elem.name;
    var attribs = formatAttributes(elem.attribs, opts);
    if (attribs) {
        tag += " " + attribs;
    }
    if (elem.children.length === 0 &&
        (opts.xmlMode
            ? // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
                opts.selfClosingTags !== false
            : // User explicitly asked for self-closing tags, even in HTML mode
                opts.selfClosingTags && singleTag.has(elem.name))) {
        if (!opts.xmlMode)
            tag += " ";
        tag += "/>";
    }
    else {
        tag += ">";
        if (elem.children.length > 0) {
            tag += render(elem.children, opts);
        }
        if (opts.xmlMode || !singleTag.has(elem.name)) {
            tag += "</" + elem.name + ">";
        }
    }
    return tag;
}
function renderDirective(elem) {
    return "<" + elem.data + ">";
}
function renderText(elem, opts) {
    var data = elem.data || "";
    // If entities weren't decoded, no need to encode them back
    if (opts.decodeEntities !== false &&
        !(!opts.xmlMode &&
            elem.parent &&
            unencodedElements.has(elem.parent.name))) {
        data = entities_1.encodeXML(data);
    }
    return data;
}
function renderCdata(elem) {
    return "<![CDATA[" + elem.children[0].data + "]]>";
}
function renderComment(elem) {
    return "<!--" + elem.data + "-->";
}


/***/ }),

/***/ "./node_modules/domelementtype/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/domelementtype/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
/** Types of elements found in htmlparser2's DOM */
var ElementType;
(function (ElementType) {
    /** Type for the root element of a document */
    ElementType["Root"] = "root";
    /** Type for Text */
    ElementType["Text"] = "text";
    /** Type for <? ... ?> */
    ElementType["Directive"] = "directive";
    /** Type for <!-- ... --> */
    ElementType["Comment"] = "comment";
    /** Type for <script> tags */
    ElementType["Script"] = "script";
    /** Type for <style> tags */
    ElementType["Style"] = "style";
    /** Type for Any tag */
    ElementType["Tag"] = "tag";
    /** Type for <![CDATA[ ... ]]> */
    ElementType["CDATA"] = "cdata";
    /** Type for <!doctype ...> */
    ElementType["Doctype"] = "doctype";
})(ElementType = exports.ElementType || (exports.ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */
function isTag(elem) {
    return (elem.type === ElementType.Tag ||
        elem.type === ElementType.Script ||
        elem.type === ElementType.Style);
}
exports.isTag = isTag;
// Exports for backwards compatibility
/** Type for the root element of a document */
exports.Root = ElementType.Root;
/** Type for Text */
exports.Text = ElementType.Text;
/** Type for <? ... ?> */
exports.Directive = ElementType.Directive;
/** Type for <!-- ... --> */
exports.Comment = ElementType.Comment;
/** Type for <script> tags */
exports.Script = ElementType.Script;
/** Type for <style> tags */
exports.Style = ElementType.Style;
/** Type for Any tag */
exports.Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */
exports.CDATA = ElementType.CDATA;
/** Type for <!doctype ...> */
exports.Doctype = ElementType.Doctype;


/***/ }),

/***/ "./node_modules/domhandler/lib/index.js":
/*!**********************************************!*\
  !*** ./node_modules/domhandler/lib/index.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomHandler = void 0;
var domelementtype_1 = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/index.js");
var node_1 = __webpack_require__(/*! ./node */ "./node_modules/domhandler/lib/node.js");
__exportStar(__webpack_require__(/*! ./node */ "./node_modules/domhandler/lib/node.js"), exports);
var reWhitespace = /\s+/g;
// Default options
var defaultOpts = {
    normalizeWhitespace: false,
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false,
};
var DomHandler = /** @class */ (function () {
    /**
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */
    function DomHandler(callback, options, elementCB) {
        /** The elements of the DOM */
        this.dom = [];
        /** The root element for the DOM */
        this.root = new node_1.Document(this.dom);
        /** Indicated whether parsing has been completed. */
        this.done = false;
        /** Stack of open tags. */
        this.tagStack = [this.root];
        /** A data node that is still being written to. */
        this.lastNode = null;
        /** Reference to the parser instance. Used for location information. */
        this.parser = null;
        // Make it possible to skip arguments, for backwards-compatibility
        if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
        }
        if (typeof callback === "object") {
            options = callback;
            callback = undefined;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    DomHandler.prototype.onparserinit = function (parser) {
        this.parser = parser;
    };
    // Resets the handler back to starting state
    DomHandler.prototype.onreset = function () {
        this.dom = [];
        this.root = new node_1.Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
    };
    // Signals the handler that parsing is done
    DomHandler.prototype.onend = function () {
        if (this.done)
            return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
    };
    DomHandler.prototype.onerror = function (error) {
        this.handleCallback(error);
    };
    DomHandler.prototype.onclosetag = function () {
        this.lastNode = null;
        var elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB)
            this.elementCB(elem);
    };
    DomHandler.prototype.onopentag = function (name, attribs) {
        var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : undefined;
        var element = new node_1.Element(name, attribs, undefined, type);
        this.addNode(element);
        this.tagStack.push(element);
    };
    DomHandler.prototype.ontext = function (data) {
        var normalizeWhitespace = this.options.normalizeWhitespace;
        var lastNode = this.lastNode;
        if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            if (normalizeWhitespace) {
                lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
            }
            else {
                lastNode.data += data;
            }
            if (this.options.withEndIndices) {
                lastNode.endIndex = this.parser.endIndex;
            }
        }
        else {
            if (normalizeWhitespace) {
                data = data.replace(reWhitespace, " ");
            }
            var node = new node_1.Text(data);
            this.addNode(node);
            this.lastNode = node;
        }
    };
    DomHandler.prototype.oncomment = function (data) {
        if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
        }
        var node = new node_1.Comment(data);
        this.addNode(node);
        this.lastNode = node;
    };
    DomHandler.prototype.oncommentend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.oncdatastart = function () {
        var text = new node_1.Text("");
        var node = new node_1.NodeWithChildren(domelementtype_1.ElementType.CDATA, [text]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
    };
    DomHandler.prototype.oncdataend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.onprocessinginstruction = function (name, data) {
        var node = new node_1.ProcessingInstruction(name, data);
        this.addNode(node);
    };
    DomHandler.prototype.handleCallback = function (error) {
        if (typeof this.callback === "function") {
            this.callback(error, this.dom);
        }
        else if (error) {
            throw error;
        }
    };
    DomHandler.prototype.addNode = function (node) {
        var parent = this.tagStack[this.tagStack.length - 1];
        var previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
            node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
            node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
            node.prev = previousSibling;
            previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
    };
    return DomHandler;
}());
exports.DomHandler = DomHandler;
exports["default"] = DomHandler;


/***/ }),

/***/ "./node_modules/domhandler/lib/node.js":
/*!*********************************************!*\
  !*** ./node_modules/domhandler/lib/node.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
var domelementtype_1 = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/index.js");
var nodeTypes = new Map([
    [domelementtype_1.ElementType.Tag, 1],
    [domelementtype_1.ElementType.Script, 1],
    [domelementtype_1.ElementType.Style, 1],
    [domelementtype_1.ElementType.Directive, 1],
    [domelementtype_1.ElementType.Text, 3],
    [domelementtype_1.ElementType.CDATA, 4],
    [domelementtype_1.ElementType.Comment, 8],
    [domelementtype_1.ElementType.Root, 9],
]);
/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */
var Node = /** @class */ (function () {
    /**
     *
     * @param type The type of the node.
     */
    function Node(type) {
        this.type = type;
        /** Parent of the node */
        this.parent = null;
        /** Previous sibling */
        this.prev = null;
        /** Next sibling */
        this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
        this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
        this.endIndex = null;
    }
    Object.defineProperty(Node.prototype, "nodeType", {
        // Read-only aliases
        /**
         * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
         * node {@link type}.
         */
        get: function () {
            var _a;
            return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.parent;
        },
        set: function (parent) {
            this.parent = parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.prev;
        },
        set: function (prev) {
            this.prev = prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.next;
        },
        set: function (next) {
            this.next = next;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */
    Node.prototype.cloneNode = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        return cloneNode(this, recursive);
    };
    return Node;
}());
exports.Node = Node;
/**
 * A node that contains some data.
 */
var DataNode = /** @class */ (function (_super) {
    __extends(DataNode, _super);
    /**
     * @param type The type of the node
     * @param data The content of the data node
     */
    function DataNode(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(DataNode.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DataNode;
}(Node));
exports.DataNode = DataNode;
/**
 * Text within the document.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(data) {
        return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
    }
    return Text;
}(DataNode));
exports.Text = Text;
/**
 * Comments within the document.
 */
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment(data) {
        return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
    }
    return Comment;
}(DataNode));
exports.Comment = Comment;
/**
 * Processing instructions, including doc types.
 */
var ProcessingInstruction = /** @class */ (function (_super) {
    __extends(ProcessingInstruction, _super);
    function ProcessingInstruction(name, data) {
        var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
        _this.name = name;
        return _this;
    }
    return ProcessingInstruction;
}(DataNode));
exports.ProcessingInstruction = ProcessingInstruction;
/**
 * A `Node` that can have children.
 */
var NodeWithChildren = /** @class */ (function (_super) {
    __extends(NodeWithChildren, _super);
    /**
     * @param type Type of the node.
     * @param children Children of the node. Only certain node types can have children.
     */
    function NodeWithChildren(type, children) {
        var _this = _super.call(this, type) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function () {
            var _a;
            return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
        /** Last child of the node. */
        get: function () {
            return this.children.length > 0
                ? this.children[this.children.length - 1]
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.children;
        },
        set: function (children) {
            this.children = children;
        },
        enumerable: false,
        configurable: true
    });
    return NodeWithChildren;
}(Node));
exports.NodeWithChildren = NodeWithChildren;
/**
 * The root node of the document.
 */
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(children) {
        return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
    }
    return Document;
}(NodeWithChildren));
exports.Document = Document;
/**
 * An element within the DOM.
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */
    function Element(name, attribs, children, type) {
        if (children === void 0) { children = []; }
        if (type === void 0) { type = name === "script"
            ? domelementtype_1.ElementType.Script
            : name === "style"
                ? domelementtype_1.ElementType.Style
                : domelementtype_1.ElementType.Tag; }
        var _this = _super.call(this, type, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        return _this;
    }
    Object.defineProperty(Element.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function () {
            var _this = this;
            return Object.keys(this.attribs).map(function (name) {
                var _a, _b;
                return ({
                    name: name,
                    value: _this.attribs[name],
                    namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                    prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name],
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    return Element;
}(NodeWithChildren));
exports.Element = Element;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */
function isTag(node) {
    return (0, domelementtype_1.isTag)(node);
}
exports.isTag = isTag;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */
function isCDATA(node) {
    return node.type === domelementtype_1.ElementType.CDATA;
}
exports.isCDATA = isCDATA;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */
function isText(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.isText = isText;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */
function isComment(node) {
    return node.type === domelementtype_1.ElementType.Comment;
}
exports.isComment = isComment;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDirective(node) {
    return node.type === domelementtype_1.ElementType.Directive;
}
exports.isDirective = isDirective;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDocument(node) {
    return node.type === domelementtype_1.ElementType.Root;
}
exports.isDocument = isDocument;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
 */
function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
exports.hasChildren = hasChildren;
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */
function cloneNode(node, recursive) {
    if (recursive === void 0) { recursive = false; }
    var result;
    if (isText(node)) {
        result = new Text(node.data);
    }
    else if (isComment(node)) {
        result = new Comment(node.data);
    }
    else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function (child) { return (child.parent = clone_1); });
        if (node.namespace != null) {
            clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
            clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
    }
    else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
        children.forEach(function (child) { return (child.parent = clone_2); });
        result = clone_2;
    }
    else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function (child) { return (child.parent = clone_3); });
        if (node["x-mode"]) {
            clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
    }
    else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    }
    else {
        throw new Error("Not implemented yet: ".concat(node.type));
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
exports.cloneNode = cloneNode;
function cloneChildren(childs) {
    var children = childs.map(function (child) { return cloneNode(child, true); });
    for (var i = 1; i < children.length; i++) {
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}


/***/ }),

/***/ "./node_modules/domutils/lib/feeds.js":
/*!********************************************!*\
  !*** ./node_modules/domutils/lib/feeds.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFeed = void 0;
var stringify_1 = __webpack_require__(/*! ./stringify */ "./node_modules/domutils/lib/stringify.js");
var legacy_1 = __webpack_require__(/*! ./legacy */ "./node_modules/domutils/lib/legacy.js");
/**
 * Get the feed object from the root of a DOM tree.
 *
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */
function getFeed(doc) {
    var feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot
        ? null
        : feedRoot.name === "feed"
            ? getAtomFeed(feedRoot)
            : getRssFeed(feedRoot);
}
exports.getFeed = getFeed;
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getAtomFeed(feedRoot) {
    var _a;
    var childs = feedRoot.children;
    var feed = {
        type: "atom",
        items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function (item) {
            var _a;
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs.href;
            if (href) {
                entry.link = href;
            }
            var description = fetch("summary", children) || fetch("content", children);
            if (description) {
                entry.description = description;
            }
            var pubDate = fetch("updated", children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }
            return entry;
        }),
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    var updated = fetch("updated", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getRssFeed(feedRoot) {
    var _a, _b;
    var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
    var feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function (item) {
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            var pubDate = fetch("pubDate", children);
            if (pubDate)
                entry.pubDate = new Date(pubDate);
            return entry;
        }),
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    var updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width",
];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */
function getMediaElements(where) {
    return (0, legacy_1.getElementsByTagName)("media:content", where).map(function (elem) {
        var attribs = elem.attribs;
        var media = {
            medium: attribs.medium,
            isDefault: !!attribs.isDefault,
        };
        for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
            var attrib = MEDIA_KEYS_STRING_1[_i];
            if (attribs[attrib]) {
                media[attrib] = attribs[attrib];
            }
        }
        for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
            var attrib = MEDIA_KEYS_INT_1[_a];
            if (attribs[attrib]) {
                media[attrib] = parseInt(attribs[attrib], 10);
            }
        }
        if (attribs.expression) {
            media.expression =
                attribs.expression;
        }
        return media;
    });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */
function getOneElement(tagName, node) {
    return (0, legacy_1.getElementsByTagName)(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where  Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */
function fetch(tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */
function addConditionally(obj, prop, tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    var val = fetch(tagName, where, recurse);
    if (val)
        obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */
function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
}


/***/ }),

/***/ "./node_modules/domutils/lib/helpers.js":
/*!**********************************************!*\
  !*** ./node_modules/domutils/lib/helpers.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniqueSort = exports.compareDocumentPosition = exports.removeSubsets = void 0;
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
/**
 * Given an array of nodes, remove any member that is contained by another.
 *
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't subtrees of each other.
 */
function removeSubsets(nodes) {
    var idx = nodes.length;
    /*
     * Check if each node (or one of its ancestors) is already contained in the
     * array.
     */
    while (--idx >= 0) {
        var node = nodes[idx];
        /*
         * Remove the node if it is not unique.
         * We are going through the array from the end, so we only
         * have to check nodes that preceed the node under consideration in the array.
         */
        if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
            nodes.splice(idx, 1);
            continue;
        }
        for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
            if (nodes.includes(ancestor)) {
                nodes.splice(idx, 1);
                break;
            }
        }
    }
    return nodes;
}
exports.removeSubsets = removeSubsets;
/**
 * Compare the position of one node against another node in any other document.
 * The return value is a bitmask with the following values:
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent./
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */
function compareDocumentPosition(nodeA, nodeB) {
    var aParents = [];
    var bParents = [];
    if (nodeA === nodeB) {
        return 0;
    }
    var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
    while (current) {
        aParents.unshift(current);
        current = current.parent;
    }
    current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
    while (current) {
        bParents.unshift(current);
        current = current.parent;
    }
    var maxIdx = Math.min(aParents.length, bParents.length);
    var idx = 0;
    while (idx < maxIdx && aParents[idx] === bParents[idx]) {
        idx++;
    }
    if (idx === 0) {
        return 1 /* DISCONNECTED */;
    }
    var sharedParent = aParents[idx - 1];
    var siblings = sharedParent.children;
    var aSibling = aParents[idx];
    var bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
            return 4 /* FOLLOWING */ | 16 /* CONTAINED_BY */;
        }
        return 4 /* FOLLOWING */;
    }
    if (sharedParent === nodeA) {
        return 2 /* PRECEDING */ | 8 /* CONTAINS */;
    }
    return 2 /* PRECEDING */;
}
exports.compareDocumentPosition = compareDocumentPosition;
/**
 * Sort an array of nodes based on their relative position in the document and
 * remove any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */
function uniqueSort(nodes) {
    nodes = nodes.filter(function (node, i, arr) { return !arr.includes(node, i + 1); });
    nodes.sort(function (a, b) {
        var relative = compareDocumentPosition(a, b);
        if (relative & 2 /* PRECEDING */) {
            return -1;
        }
        else if (relative & 4 /* FOLLOWING */) {
            return 1;
        }
        return 0;
    });
    return nodes;
}
exports.uniqueSort = uniqueSort;


/***/ }),

/***/ "./node_modules/domutils/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/domutils/lib/index.js ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
__exportStar(__webpack_require__(/*! ./stringify */ "./node_modules/domutils/lib/stringify.js"), exports);
__exportStar(__webpack_require__(/*! ./traversal */ "./node_modules/domutils/lib/traversal.js"), exports);
__exportStar(__webpack_require__(/*! ./manipulation */ "./node_modules/domutils/lib/manipulation.js"), exports);
__exportStar(__webpack_require__(/*! ./querying */ "./node_modules/domutils/lib/querying.js"), exports);
__exportStar(__webpack_require__(/*! ./legacy */ "./node_modules/domutils/lib/legacy.js"), exports);
__exportStar(__webpack_require__(/*! ./helpers */ "./node_modules/domutils/lib/helpers.js"), exports);
__exportStar(__webpack_require__(/*! ./feeds */ "./node_modules/domutils/lib/feeds.js"), exports);
/** @deprecated Use these methods from `domhandler` directly. */
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
Object.defineProperty(exports, "isTag", ({ enumerable: true, get: function () { return domhandler_1.isTag; } }));
Object.defineProperty(exports, "isCDATA", ({ enumerable: true, get: function () { return domhandler_1.isCDATA; } }));
Object.defineProperty(exports, "isText", ({ enumerable: true, get: function () { return domhandler_1.isText; } }));
Object.defineProperty(exports, "isComment", ({ enumerable: true, get: function () { return domhandler_1.isComment; } }));
Object.defineProperty(exports, "isDocument", ({ enumerable: true, get: function () { return domhandler_1.isDocument; } }));
Object.defineProperty(exports, "hasChildren", ({ enumerable: true, get: function () { return domhandler_1.hasChildren; } }));


/***/ }),

/***/ "./node_modules/domutils/lib/legacy.js":
/*!*********************************************!*\
  !*** ./node_modules/domutils/lib/legacy.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getElementsByTagType = exports.getElementsByTagName = exports.getElementById = exports.getElements = exports.testElement = void 0;
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
var querying_1 = __webpack_require__(/*! ./querying */ "./node_modules/domutils/lib/querying.js");
var Checks = {
    tag_name: function (name) {
        if (typeof name === "function") {
            return function (elem) { return (0, domhandler_1.isTag)(elem) && name(elem.name); };
        }
        else if (name === "*") {
            return domhandler_1.isTag;
        }
        return function (elem) { return (0, domhandler_1.isTag)(elem) && elem.name === name; };
    },
    tag_type: function (type) {
        if (typeof type === "function") {
            return function (elem) { return type(elem.type); };
        }
        return function (elem) { return elem.type === type; };
    },
    tag_contains: function (data) {
        if (typeof data === "function") {
            return function (elem) { return (0, domhandler_1.isText)(elem) && data(elem.data); };
        }
        return function (elem) { return (0, domhandler_1.isText)(elem) && elem.data === data; };
    },
};
/**
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a particular value.
 */
function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
        return function (elem) { return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]); };
    }
    return function (elem) { return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value; };
}
/**
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either
 * of the input functions returns `true` for the node.
 */
function combineFuncs(a, b) {
    return function (elem) { return a(elem) || b(elem); };
}
/**
 * @param options An object describing nodes to look for.
 * @returns A function executing all checks in `options` and returning `true`
 * if any of them match a node.
 */
function compileTest(options) {
    var funcs = Object.keys(options).map(function (key) {
        var value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key)
            ? Checks[key](value)
            : getAttribCheck(key, value);
    });
    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */
function testElement(options, node) {
    var test = compileTest(options);
    return test ? test(node) : true;
}
exports.testElement = testElement;
/**
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */
function getElements(options, nodes, recurse, limit) {
    if (limit === void 0) { limit = Infinity; }
    var test = compileTest(options);
    return test ? (0, querying_1.filter)(test, nodes, recurse, limit) : [];
}
exports.getElements = getElements;
/**
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */
function getElementById(id, nodes, recurse) {
    if (recurse === void 0) { recurse = true; }
    if (!Array.isArray(nodes))
        nodes = [nodes];
    return (0, querying_1.findOne)(getAttribCheck("id", id), nodes, recurse);
}
exports.getElementById = getElementById;
/**
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */
function getElementsByTagName(tagName, nodes, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    return (0, querying_1.filter)(Checks.tag_name(tagName), nodes, recurse, limit);
}
exports.getElementsByTagName = getElementsByTagName;
/**
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */
function getElementsByTagType(type, nodes, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    return (0, querying_1.filter)(Checks.tag_type(type), nodes, recurse, limit);
}
exports.getElementsByTagType = getElementsByTagType;


/***/ }),

/***/ "./node_modules/domutils/lib/manipulation.js":
/*!***************************************************!*\
  !*** ./node_modules/domutils/lib/manipulation.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepend = exports.prependChild = exports.append = exports.appendChild = exports.replaceElement = exports.removeElement = void 0;
/**
 * Remove an element from the dom
 *
 * @param elem The element to be removed
 */
function removeElement(elem) {
    if (elem.prev)
        elem.prev.next = elem.next;
    if (elem.next)
        elem.next.prev = elem.prev;
    if (elem.parent) {
        var childs = elem.parent.children;
        childs.splice(childs.lastIndexOf(elem), 1);
    }
}
exports.removeElement = removeElement;
/**
 * Replace an element in the dom
 *
 * @param elem The element to be replaced
 * @param replacement The element to be added
 */
function replaceElement(elem, replacement) {
    var prev = (replacement.prev = elem.prev);
    if (prev) {
        prev.next = replacement;
    }
    var next = (replacement.next = elem.next);
    if (next) {
        next.prev = replacement;
    }
    var parent = (replacement.parent = elem.parent);
    if (parent) {
        var childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
    }
}
exports.replaceElement = replaceElement;
/**
 * Append a child to an element.
 *
 * @param elem The element to append to.
 * @param child The element to be added as a child.
 */
function appendChild(elem, child) {
    removeElement(child);
    child.next = null;
    child.parent = elem;
    if (elem.children.push(child) > 1) {
        var sibling = elem.children[elem.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
    }
    else {
        child.prev = null;
    }
}
exports.appendChild = appendChild;
/**
 * Append an element after another.
 *
 * @param elem The element to append after.
 * @param next The element be added.
 */
function append(elem, next) {
    removeElement(next);
    var parent = elem.parent;
    var currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
        currNext.prev = next;
        if (parent) {
            var childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
    }
    else if (parent) {
        parent.children.push(next);
    }
}
exports.append = append;
/**
 * Prepend a child to an element.
 *
 * @param elem The element to prepend before.
 * @param child The element to be added as a child.
 */
function prependChild(elem, child) {
    removeElement(child);
    child.parent = elem;
    child.prev = null;
    if (elem.children.unshift(child) !== 1) {
        var sibling = elem.children[1];
        sibling.prev = child;
        child.next = sibling;
    }
    else {
        child.next = null;
    }
}
exports.prependChild = prependChild;
/**
 * Prepend an element before another.
 *
 * @param elem The element to prepend before.
 * @param prev The element be added.
 */
function prepend(elem, prev) {
    removeElement(prev);
    var parent = elem.parent;
    if (parent) {
        var childs = parent.children;
        childs.splice(childs.indexOf(elem), 0, prev);
    }
    if (elem.prev) {
        elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
}
exports.prepend = prepend;


/***/ }),

/***/ "./node_modules/domutils/lib/querying.js":
/*!***********************************************!*\
  !*** ./node_modules/domutils/lib/querying.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findAll = exports.existsOne = exports.findOne = exports.findOneChild = exports.find = exports.filter = void 0;
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
/**
 * Search a node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
function filter(test, node, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    if (!Array.isArray(node))
        node = [node];
    return find(test, node, recurse, limit);
}
exports.filter = filter;
/**
 * Search an array of node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
function find(test, nodes, recurse, limit) {
    var result = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var elem = nodes_1[_i];
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0)
                break;
        }
        if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
            var children = find(test, elem.children, recurse, limit);
            result.push.apply(result, children);
            limit -= children.length;
            if (limit <= 0)
                break;
        }
    }
    return result;
}
exports.find = find;
/**
 * Finds the first element inside of an array that matches a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 */
function findOneChild(test, nodes) {
    return nodes.find(test);
}
exports.findOneChild = findOneChild;
/**
 * Finds one element in a tree that passes a test.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first child node that passes `test`.
 */
function findOne(test, nodes, recurse) {
    if (recurse === void 0) { recurse = true; }
    var elem = null;
    for (var i = 0; i < nodes.length && !elem; i++) {
        var checked = nodes[i];
        if (!(0, domhandler_1.isTag)(checked)) {
            continue;
        }
        else if (test(checked)) {
            elem = checked;
        }
        else if (recurse && checked.children.length > 0) {
            elem = findOne(test, checked.children);
        }
    }
    return elem;
}
exports.findOne = findOne;
/**
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing a test.
 */
function existsOne(test, nodes) {
    return nodes.some(function (checked) {
        return (0, domhandler_1.isTag)(checked) &&
            (test(checked) ||
                (checked.children.length > 0 &&
                    existsOne(test, checked.children)));
    });
}
exports.existsOne = existsOne;
/**
 * Search and array of nodes and its children for nodes passing a test function.
 *
 * Same as `find`, only with less options, leading to reduced complexity.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */
function findAll(test, nodes) {
    var _a;
    var result = [];
    var stack = nodes.filter(domhandler_1.isTag);
    var elem;
    while ((elem = stack.shift())) {
        var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler_1.isTag);
        if (children && children.length > 0) {
            stack.unshift.apply(stack, children);
        }
        if (test(elem))
            result.push(elem);
    }
    return result;
}
exports.findAll = findAll;


/***/ }),

/***/ "./node_modules/domutils/lib/stringify.js":
/*!************************************************!*\
  !*** ./node_modules/domutils/lib/stringify.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.innerText = exports.textContent = exports.getText = exports.getInnerHTML = exports.getOuterHTML = void 0;
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
var dom_serializer_1 = __importDefault(__webpack_require__(/*! dom-serializer */ "./node_modules/dom-serializer/lib/index.js"));
var domelementtype_1 = __webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/index.js");
/**
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s outer HTML.
 */
function getOuterHTML(node, options) {
    return (0, dom_serializer_1.default)(node, options);
}
exports.getOuterHTML = getOuterHTML;
/**
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s inner HTML.
 */
function getInnerHTML(node, options) {
    return (0, domhandler_1.hasChildren)(node)
        ? node.children.map(function (node) { return getOuterHTML(node, options); }).join("")
        : "";
}
exports.getInnerHTML = getInnerHTML;
/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags.
 *
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */
function getText(node) {
    if (Array.isArray(node))
        return node.map(getText).join("");
    if ((0, domhandler_1.isTag)(node))
        return node.name === "br" ? "\n" : getText(node.children);
    if ((0, domhandler_1.isCDATA)(node))
        return getText(node.children);
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.getText = getText;
/**
 * Get a node's text content.
 *
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */
function textContent(node) {
    if (Array.isArray(node))
        return node.map(textContent).join("");
    if ((0, domhandler_1.hasChildren)(node) && !(0, domhandler_1.isComment)(node)) {
        return textContent(node.children);
    }
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.textContent = textContent;
/**
 * Get a node's inner text.
 *
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */
function innerText(node) {
    if (Array.isArray(node))
        return node.map(innerText).join("");
    if ((0, domhandler_1.hasChildren)(node) && (node.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node))) {
        return innerText(node.children);
    }
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.innerText = innerText;


/***/ }),

/***/ "./node_modules/domutils/lib/traversal.js":
/*!************************************************!*\
  !*** ./node_modules/domutils/lib/traversal.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prevElementSibling = exports.nextElementSibling = exports.getName = exports.hasAttrib = exports.getAttributeValue = exports.getSiblings = exports.getParent = exports.getChildren = void 0;
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
var emptyArray = [];
/**
 * Get a node's children.
 *
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */
function getChildren(elem) {
    var _a;
    return (_a = elem.children) !== null && _a !== void 0 ? _a : emptyArray;
}
exports.getChildren = getChildren;
/**
 * Get a node's parent.
 *
 * @param elem Node to get the parent of.
 * @returns `elem`'s parent node.
 */
function getParent(elem) {
    return elem.parent || null;
}
exports.getParent = getParent;
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first.
 * If we don't have a parent (the element is a root node),
 * we walk the element's `prev` & `next` to get all remaining nodes.
 *
 * @param elem Element to get the siblings of.
 * @returns `elem`'s siblings.
 */
function getSiblings(elem) {
    var _a, _b;
    var parent = getParent(elem);
    if (parent != null)
        return getChildren(parent);
    var siblings = [elem];
    var prev = elem.prev, next = elem.next;
    while (prev != null) {
        siblings.unshift(prev);
        (_a = prev, prev = _a.prev);
    }
    while (next != null) {
        siblings.push(next);
        (_b = next, next = _b.next);
    }
    return siblings;
}
exports.getSiblings = getSiblings;
/**
 * Gets an attribute from an element.
 *
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */
function getAttributeValue(elem, name) {
    var _a;
    return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
exports.getAttributeValue = getAttributeValue;
/**
 * Checks whether an element has an attribute.
 *
 * @param elem Element to check.
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */
function hasAttrib(elem, name) {
    return (elem.attribs != null &&
        Object.prototype.hasOwnProperty.call(elem.attribs, name) &&
        elem.attribs[name] != null);
}
exports.hasAttrib = hasAttrib;
/**
 * Get the tag name of an element.
 *
 * @param elem The element to get the name for.
 * @returns The tag name of `elem`.
 */
function getName(elem) {
    return elem.name;
}
exports.getName = getName;
/**
 * Returns the next element sibling of a node.
 *
 * @param elem The element to get the next sibling of.
 * @returns `elem`'s next sibling that is a tag.
 */
function nextElementSibling(elem) {
    var _a;
    var next = elem.next;
    while (next !== null && !(0, domhandler_1.isTag)(next))
        (_a = next, next = _a.next);
    return next;
}
exports.nextElementSibling = nextElementSibling;
/**
 * Returns the previous element sibling of a node.
 *
 * @param elem The element to get the previous sibling of.
 * @returns `elem`'s previous sibling that is a tag.
 */
function prevElementSibling(elem) {
    var _a;
    var prev = elem.prev;
    while (prev !== null && !(0, domhandler_1.isTag)(prev))
        (_a = prev, prev = _a.prev);
    return prev;
}
exports.prevElementSibling = prevElementSibling;


/***/ }),

/***/ "./node_modules/entities/lib/decode.js":
/*!*********************************************!*\
  !*** ./node_modules/entities/lib/decode.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
var entities_json_1 = __importDefault(__webpack_require__(/*! ./maps/entities.json */ "./node_modules/entities/lib/maps/entities.json"));
var legacy_json_1 = __importDefault(__webpack_require__(/*! ./maps/legacy.json */ "./node_modules/entities/lib/maps/legacy.json"));
var xml_json_1 = __importDefault(__webpack_require__(/*! ./maps/xml.json */ "./node_modules/entities/lib/maps/xml.json"));
var decode_codepoint_1 = __importDefault(__webpack_require__(/*! ./decode_codepoint */ "./node_modules/entities/lib/decode_codepoint.js"));
var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
exports.decodeXML = getStrictDecoder(xml_json_1.default);
exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
function getStrictDecoder(map) {
    var replace = getReplacer(map);
    return function (str) { return String(str).replace(strictEntityRe, replace); };
}
var sorter = function (a, b) { return (a < b ? 1 : -1); };
exports.decodeHTML = (function () {
    var legacy = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1.default).sort(sorter);
    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        }
        else {
            keys[i] += ";";
        }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1.default);
    function replacer(str) {
        if (str.substr(-1) !== ";")
            str += ";";
        return replace(str);
    }
    // TODO consider creating a merged map
    return function (str) { return String(str).replace(re, replacer); };
})();
function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            var secondChar = str.charAt(2);
            if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
            }
            return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return map[str.slice(1, -1)] || str;
    };
}


/***/ }),

/***/ "./node_modules/entities/lib/decode_codepoint.js":
/*!*******************************************************!*\
  !*** ./node_modules/entities/lib/decode_codepoint.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decode_json_1 = __importDefault(__webpack_require__(/*! ./maps/decode.json */ "./node_modules/entities/lib/maps/decode.json"));
// Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
var fromCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.fromCodePoint ||
    function (codePoint) {
        var output = "";
        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }
        output += String.fromCharCode(codePoint);
        return output;
    };
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
    }
    return fromCodePoint(codePoint);
}
exports["default"] = decodeCodePoint;


/***/ }),

/***/ "./node_modules/entities/lib/encode.js":
/*!*********************************************!*\
  !*** ./node_modules/entities/lib/encode.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
var xml_json_1 = __importDefault(__webpack_require__(/*! ./maps/xml.json */ "./node_modules/entities/lib/maps/xml.json"));
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeXML = getASCIIEncoder(inverseXML);
var entities_json_1 = __importDefault(__webpack_require__(/*! ./maps/entities.json */ "./node_modules/entities/lib/maps/entities.json"));
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
/**
 * Encodes all entities and non-ASCII characters in the input.
 *
 * This includes characters that are valid ASCII characters in HTML documents.
 * For example `#` will be encoded as `&num;`. To get a more compact output,
 * consider using the `encodeNonAsciiHTML` function.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
    }, {});
}
function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
            // Add value to single array
            single.push("\\" + k);
        }
        else {
            // Add value to multiple array
            multiple.push(k);
        }
    }
    // Add ranges to single characters.
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
        // Find the end of a run of characters
        var end = start;
        while (end < single.length - 1 &&
            single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
            end += 1;
        }
        var count = 1 + end - start;
        // We want to replace at least three characters
        if (count < 3)
            continue;
        single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
}
// /[^\0-\x7F]/gu
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
var getCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function (str) { return str.codePointAt(0); }
    : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function (c) {
            return (c.charCodeAt(0) - 0xd800) * 0x400 +
                c.charCodeAt(1) -
                0xdc00 +
                0x10000;
        };
function singleCharReplacer(c) {
    return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
        .toString(16)
        .toUpperCase() + ";";
}
function getInverse(inverse, re) {
    return function (data) {
        return data
            .replace(re, function (name) { return inverse[name]; })
            .replace(reNonASCII, singleCharReplacer);
    };
}
var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */
function escape(data) {
    return data.replace(reEscapeChars, singleCharReplacer);
}
exports.escape = escape;
/**
 * Encodes all characters not valid in XML documents using numeric hexadecimal
 * reference (eg. `&#xfc;`).
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */
function escapeUTF8(data) {
    return data.replace(xmlReplacer, singleCharReplacer);
}
exports.escapeUTF8 = escapeUTF8;
function getASCIIEncoder(obj) {
    return function (data) {
        return data.replace(reEscapeChars, function (c) { return obj[c] || singleCharReplacer(c); });
    };
}


/***/ }),

/***/ "./node_modules/entities/lib/index.js":
/*!********************************************!*\
  !*** ./node_modules/entities/lib/index.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
var decode_1 = __webpack_require__(/*! ./decode */ "./node_modules/entities/lib/decode.js");
var encode_1 = __webpack_require__(/*! ./encode */ "./node_modules/entities/lib/encode.js");
/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeXML` or `decodeHTML` directly.
 */
function decode(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
}
exports.decode = decode;
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
 */
function decodeStrict(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
}
exports.decodeStrict = decodeStrict;
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
 */
function encode(data, level) {
    return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
}
exports.encode = encode;
var encode_2 = __webpack_require__(/*! ./encode */ "./node_modules/entities/lib/encode.js");
Object.defineProperty(exports, "encodeXML", ({ enumerable: true, get: function () { return encode_2.encodeXML; } }));
Object.defineProperty(exports, "encodeHTML", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
Object.defineProperty(exports, "encodeNonAsciiHTML", ({ enumerable: true, get: function () { return encode_2.encodeNonAsciiHTML; } }));
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return encode_2.escape; } }));
Object.defineProperty(exports, "escapeUTF8", ({ enumerable: true, get: function () { return encode_2.escapeUTF8; } }));
// Legacy aliases (deprecated)
Object.defineProperty(exports, "encodeHTML4", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
Object.defineProperty(exports, "encodeHTML5", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
var decode_2 = __webpack_require__(/*! ./decode */ "./node_modules/entities/lib/decode.js");
Object.defineProperty(exports, "decodeXML", ({ enumerable: true, get: function () { return decode_2.decodeXML; } }));
Object.defineProperty(exports, "decodeHTML", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTMLStrict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
// Legacy aliases (deprecated)
Object.defineProperty(exports, "decodeHTML4", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTML5", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTML4Strict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
Object.defineProperty(exports, "decodeHTML5Strict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
Object.defineProperty(exports, "decodeXMLStrict", ({ enumerable: true, get: function () { return decode_2.decodeXML; } }));


/***/ }),

/***/ "./src/index.html":
/*!************************!*\
  !*** ./src/index.html ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<!DOCTYPE html>\r\n<html lang=\"en\">\r\n  <head>\r\n    <meta charset=\"UTF-8\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <title>Battleship</title>\r\n  </head>\r\n  <body>\r\n    <header>\r\n    </header>\r\n    <main>\r\n      <div class=\"board-container\">\r\n        <div class=\"board\" id=\"player1\">\r\n          <h2>Your board</h2>\r\n        </div>\r\n\r\n        <div class=\"board\" id=\"player2\">\r\n          <h2>Enemy's board</h2>\r\n        </div>\r\n      </div>\r\n    </main>\r\n  </body>\r\n</html>\r\n";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./node_modules/htmlparser2/lib/FeedHandler.js":
/*!*****************************************************!*\
  !*** ./node_modules/htmlparser2/lib/FeedHandler.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseFeed = exports.FeedHandler = void 0;
var domhandler_1 = __importDefault(__webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js"));
var DomUtils = __importStar(__webpack_require__(/*! domutils */ "./node_modules/domutils/lib/index.js"));
var Parser_1 = __webpack_require__(/*! ./Parser */ "./node_modules/htmlparser2/lib/Parser.js");
var FeedItemMediaMedium;
(function (FeedItemMediaMedium) {
    FeedItemMediaMedium[FeedItemMediaMedium["image"] = 0] = "image";
    FeedItemMediaMedium[FeedItemMediaMedium["audio"] = 1] = "audio";
    FeedItemMediaMedium[FeedItemMediaMedium["video"] = 2] = "video";
    FeedItemMediaMedium[FeedItemMediaMedium["document"] = 3] = "document";
    FeedItemMediaMedium[FeedItemMediaMedium["executable"] = 4] = "executable";
})(FeedItemMediaMedium || (FeedItemMediaMedium = {}));
var FeedItemMediaExpression;
(function (FeedItemMediaExpression) {
    FeedItemMediaExpression[FeedItemMediaExpression["sample"] = 0] = "sample";
    FeedItemMediaExpression[FeedItemMediaExpression["full"] = 1] = "full";
    FeedItemMediaExpression[FeedItemMediaExpression["nonstop"] = 2] = "nonstop";
})(FeedItemMediaExpression || (FeedItemMediaExpression = {}));
// TODO: Consume data as it is coming in
var FeedHandler = /** @class */ (function (_super) {
    __extends(FeedHandler, _super);
    /**
     *
     * @param callback
     * @param options
     */
    function FeedHandler(callback, options) {
        var _this = this;
        if (typeof callback === "object") {
            callback = undefined;
            options = callback;
        }
        _this = _super.call(this, callback, options) || this;
        return _this;
    }
    FeedHandler.prototype.onend = function () {
        var _a, _b;
        var feedRoot = getOneElement(isValidFeed, this.dom);
        if (!feedRoot) {
            this.handleCallback(new Error("couldn't find root of feed"));
            return;
        }
        var feed = {};
        if (feedRoot.name === "feed") {
            var childs = feedRoot.children;
            feed.type = "atom";
            addConditionally(feed, "id", "id", childs);
            addConditionally(feed, "title", "title", childs);
            var href = getAttribute("href", getOneElement("link", childs));
            if (href) {
                feed.link = href;
            }
            addConditionally(feed, "description", "subtitle", childs);
            var updated = fetch("updated", childs);
            if (updated) {
                feed.updated = new Date(updated);
            }
            addConditionally(feed, "author", "email", childs, true);
            feed.items = getElements("entry", childs).map(function (item) {
                var entry = {};
                var children = item.children;
                addConditionally(entry, "id", "id", children);
                addConditionally(entry, "title", "title", children);
                var href = getAttribute("href", getOneElement("link", children));
                if (href) {
                    entry.link = href;
                }
                var description = fetch("summary", children) || fetch("content", children);
                if (description) {
                    entry.description = description;
                }
                var pubDate = fetch("updated", children);
                if (pubDate) {
                    entry.pubDate = new Date(pubDate);
                }
                entry.media = getMediaElements(children);
                return entry;
            });
        }
        else {
            var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
            feed.type = feedRoot.name.substr(0, 3);
            feed.id = "";
            addConditionally(feed, "title", "title", childs);
            addConditionally(feed, "link", "link", childs);
            addConditionally(feed, "description", "description", childs);
            var updated = fetch("lastBuildDate", childs);
            if (updated) {
                feed.updated = new Date(updated);
            }
            addConditionally(feed, "author", "managingEditor", childs, true);
            feed.items = getElements("item", feedRoot.children).map(function (item) {
                var entry = {};
                var children = item.children;
                addConditionally(entry, "id", "guid", children);
                addConditionally(entry, "title", "title", children);
                addConditionally(entry, "link", "link", children);
                addConditionally(entry, "description", "description", children);
                var pubDate = fetch("pubDate", children);
                if (pubDate)
                    entry.pubDate = new Date(pubDate);
                entry.media = getMediaElements(children);
                return entry;
            });
        }
        this.feed = feed;
        this.handleCallback(null);
    };
    return FeedHandler;
}(domhandler_1.default));
exports.FeedHandler = FeedHandler;
function getMediaElements(where) {
    return getElements("media:content", where).map(function (elem) {
        var media = {
            medium: elem.attribs.medium,
            isDefault: !!elem.attribs.isDefault,
        };
        if (elem.attribs.url) {
            media.url = elem.attribs.url;
        }
        if (elem.attribs.fileSize) {
            media.fileSize = parseInt(elem.attribs.fileSize, 10);
        }
        if (elem.attribs.type) {
            media.type = elem.attribs.type;
        }
        if (elem.attribs.expression) {
            media.expression = elem.attribs
                .expression;
        }
        if (elem.attribs.bitrate) {
            media.bitrate = parseInt(elem.attribs.bitrate, 10);
        }
        if (elem.attribs.framerate) {
            media.framerate = parseInt(elem.attribs.framerate, 10);
        }
        if (elem.attribs.samplingrate) {
            media.samplingrate = parseInt(elem.attribs.samplingrate, 10);
        }
        if (elem.attribs.channels) {
            media.channels = parseInt(elem.attribs.channels, 10);
        }
        if (elem.attribs.duration) {
            media.duration = parseInt(elem.attribs.duration, 10);
        }
        if (elem.attribs.height) {
            media.height = parseInt(elem.attribs.height, 10);
        }
        if (elem.attribs.width) {
            media.width = parseInt(elem.attribs.width, 10);
        }
        if (elem.attribs.lang) {
            media.lang = elem.attribs.lang;
        }
        return media;
    });
}
function getElements(tagName, where) {
    return DomUtils.getElementsByTagName(tagName, where, true);
}
function getOneElement(tagName, node) {
    return DomUtils.getElementsByTagName(tagName, node, true, 1)[0];
}
function fetch(tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    return DomUtils.getText(DomUtils.getElementsByTagName(tagName, where, recurse, 1)).trim();
}
function getAttribute(name, elem) {
    if (!elem) {
        return null;
    }
    var attribs = elem.attribs;
    return attribs[name];
}
function addConditionally(obj, prop, what, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    var tmp = fetch(what, where, recurse);
    if (tmp)
        obj[prop] = tmp;
}
function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
}
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this option, you should set `xmlMode` to `true`.
 */
function parseFeed(feed, options) {
    if (options === void 0) { options = { xmlMode: true }; }
    var handler = new FeedHandler(options);
    new Parser_1.Parser(handler, options).end(feed);
    return handler.feed;
}
exports.parseFeed = parseFeed;


/***/ }),

/***/ "./node_modules/htmlparser2/lib/Parser.js":
/*!************************************************!*\
  !*** ./node_modules/htmlparser2/lib/Parser.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
var Tokenizer_1 = __importDefault(__webpack_require__(/*! ./Tokenizer */ "./node_modules/htmlparser2/lib/Tokenizer.js"));
var formTags = new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea",
]);
var pTag = new Set(["p"]);
var openImpliesClose = {
    tr: new Set(["tr", "th", "td"]),
    th: new Set(["th"]),
    td: new Set(["thead", "th", "td"]),
    body: new Set(["head", "link", "script"]),
    li: new Set(["li"]),
    p: pTag,
    h1: pTag,
    h2: pTag,
    h3: pTag,
    h4: pTag,
    h5: pTag,
    h6: pTag,
    select: formTags,
    input: formTags,
    output: formTags,
    button: formTags,
    datalist: formTags,
    textarea: formTags,
    option: new Set(["option"]),
    optgroup: new Set(["optgroup", "option"]),
    dd: new Set(["dt", "dd"]),
    dt: new Set(["dt", "dd"]),
    address: pTag,
    article: pTag,
    aside: pTag,
    blockquote: pTag,
    details: pTag,
    div: pTag,
    dl: pTag,
    fieldset: pTag,
    figcaption: pTag,
    figure: pTag,
    footer: pTag,
    form: pTag,
    header: pTag,
    hr: pTag,
    main: pTag,
    nav: pTag,
    ol: pTag,
    pre: pTag,
    section: pTag,
    table: pTag,
    ul: pTag,
    rt: new Set(["rt", "rp"]),
    rp: new Set(["rt", "rp"]),
    tbody: new Set(["thead", "tbody"]),
    tfoot: new Set(["thead", "tbody"]),
};
var voidElements = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);
var foreignContextElements = new Set(["math", "svg"]);
var htmlIntegrationElements = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title",
]);
var reNameEnd = /\s|\//;
var Parser = /** @class */ (function () {
    function Parser(cbs, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e;
        /** The start index of the last event. */
        this.startIndex = 0;
        /** The end index of the last event. */
        this.endIndex = null;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.options = options;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
        this.lowerCaseAttributeNames =
            (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_1.default)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
    }
    Parser.prototype.updatePosition = function (initialOffset) {
        if (this.endIndex === null) {
            if (this.tokenizer.sectionStart <= initialOffset) {
                this.startIndex = 0;
            }
            else {
                this.startIndex = this.tokenizer.sectionStart - initialOffset;
            }
        }
        else {
            this.startIndex = this.endIndex + 1;
        }
        this.endIndex = this.tokenizer.getAbsoluteIndex();
    };
    // Tokenizer event handlers
    Parser.prototype.ontext = function (data) {
        var _a, _b;
        this.updatePosition(1);
        this.endIndex--;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
    };
    Parser.prototype.onopentagname = function (name) {
        var _a, _b;
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        this.tagname = name;
        if (!this.options.xmlMode &&
            Object.prototype.hasOwnProperty.call(openImpliesClose, name)) {
            var el = void 0;
            while (this.stack.length > 0 &&
                openImpliesClose[name].has((el = this.stack[this.stack.length - 1]))) {
                this.onclosetag(el);
            }
        }
        if (this.options.xmlMode || !voidElements.has(name)) {
            this.stack.push(name);
            if (foreignContextElements.has(name)) {
                this.foreignContext.push(true);
            }
            else if (htmlIntegrationElements.has(name)) {
                this.foreignContext.push(false);
            }
        }
        (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, name);
        if (this.cbs.onopentag)
            this.attribs = {};
    };
    Parser.prototype.onopentagend = function () {
        var _a, _b;
        this.updatePosition(1);
        if (this.attribs) {
            (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs);
            this.attribs = null;
        }
        if (!this.options.xmlMode &&
            this.cbs.onclosetag &&
            voidElements.has(this.tagname)) {
            this.cbs.onclosetag(this.tagname);
        }
        this.tagname = "";
    };
    Parser.prototype.onclosetag = function (name) {
        this.updatePosition(1);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) ||
            htmlIntegrationElements.has(name)) {
            this.foreignContext.pop();
        }
        if (this.stack.length &&
            (this.options.xmlMode || !voidElements.has(name))) {
            var pos = this.stack.lastIndexOf(name);
            if (pos !== -1) {
                if (this.cbs.onclosetag) {
                    pos = this.stack.length - pos;
                    while (pos--) {
                        // We know the stack has sufficient elements.
                        this.cbs.onclosetag(this.stack.pop());
                    }
                }
                else
                    this.stack.length = pos;
            }
            else if (name === "p" && !this.options.xmlMode) {
                this.onopentagname(name);
                this.closeCurrentTag();
            }
        }
        else if (!this.options.xmlMode && (name === "br" || name === "p")) {
            this.onopentagname(name);
            this.closeCurrentTag();
        }
    };
    Parser.prototype.onselfclosingtag = function () {
        if (this.options.xmlMode ||
            this.options.recognizeSelfClosing ||
            this.foreignContext[this.foreignContext.length - 1]) {
            this.closeCurrentTag();
        }
        else {
            this.onopentagend();
        }
    };
    Parser.prototype.closeCurrentTag = function () {
        var _a, _b;
        var name = this.tagname;
        this.onopentagend();
        /*
         * Self-closing tags will be on the top of the stack
         * (cheaper check than in onclosetag)
         */
        if (this.stack[this.stack.length - 1] === name) {
            (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name);
            this.stack.pop();
        }
    };
    Parser.prototype.onattribname = function (name) {
        if (this.lowerCaseAttributeNames) {
            name = name.toLowerCase();
        }
        this.attribname = name;
    };
    Parser.prototype.onattribdata = function (value) {
        this.attribvalue += value;
    };
    Parser.prototype.onattribend = function (quote) {
        var _a, _b;
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote);
        if (this.attribs &&
            !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
            this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribname = "";
        this.attribvalue = "";
    };
    Parser.prototype.getInstructionName = function (value) {
        var idx = value.search(reNameEnd);
        var name = idx < 0 ? value : value.substr(0, idx);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        return name;
    };
    Parser.prototype.ondeclaration = function (value) {
        if (this.cbs.onprocessinginstruction) {
            var name_1 = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("!" + name_1, "!" + value);
        }
    };
    Parser.prototype.onprocessinginstruction = function (value) {
        if (this.cbs.onprocessinginstruction) {
            var name_2 = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("?" + name_2, "?" + value);
        }
    };
    Parser.prototype.oncomment = function (value) {
        var _a, _b, _c, _d;
        this.updatePosition(4);
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    };
    Parser.prototype.oncdata = function (value) {
        var _a, _b, _c, _d, _e, _f;
        this.updatePosition(1);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
            (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
            (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        }
        else {
            this.oncomment("[CDATA[" + value + "]]");
        }
    };
    Parser.prototype.onerror = function (err) {
        var _a, _b;
        (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    Parser.prototype.onend = function () {
        var _a, _b;
        if (this.cbs.onclosetag) {
            for (var i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i]))
                ;
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    /**
     * Resets the parser to a blank state, ready to parse a new HTML document
     */
    Parser.prototype.reset = function () {
        var _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack = [];
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    };
    /**
     * Resets the parser, then parses a complete document and
     * pushes it to the handler.
     *
     * @param data Document to parse.
     */
    Parser.prototype.parseComplete = function (data) {
        this.reset();
        this.end(data);
    };
    /**
     * Parses a chunk of data and calls the corresponding callbacks.
     *
     * @param chunk Chunk to parse.
     */
    Parser.prototype.write = function (chunk) {
        this.tokenizer.write(chunk);
    };
    /**
     * Parses the end of the buffer and clears the stack, calls onend.
     *
     * @param chunk Optional final chunk to parse.
     */
    Parser.prototype.end = function (chunk) {
        this.tokenizer.end(chunk);
    };
    /**
     * Pauses parsing. The parser won't emit events until `resume` is called.
     */
    Parser.prototype.pause = function () {
        this.tokenizer.pause();
    };
    /**
     * Resumes parsing after `pause` was called.
     */
    Parser.prototype.resume = function () {
        this.tokenizer.resume();
    };
    /**
     * Alias of `write`, for backwards compatibility.
     *
     * @param chunk Chunk to parse.
     * @deprecated
     */
    Parser.prototype.parseChunk = function (chunk) {
        this.write(chunk);
    };
    /**
     * Alias of `end`, for backwards compatibility.
     *
     * @param chunk Optional final chunk to parse.
     * @deprecated
     */
    Parser.prototype.done = function (chunk) {
        this.end(chunk);
    };
    return Parser;
}());
exports.Parser = Parser;


/***/ }),

/***/ "./node_modules/htmlparser2/lib/Tokenizer.js":
/*!***************************************************!*\
  !*** ./node_modules/htmlparser2/lib/Tokenizer.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decode_codepoint_1 = __importDefault(__webpack_require__(/*! entities/lib/decode_codepoint */ "./node_modules/entities/lib/decode_codepoint.js"));
var entities_json_1 = __importDefault(__webpack_require__(/*! entities/lib/maps/entities.json */ "./node_modules/entities/lib/maps/entities.json"));
var legacy_json_1 = __importDefault(__webpack_require__(/*! entities/lib/maps/legacy.json */ "./node_modules/entities/lib/maps/legacy.json"));
var xml_json_1 = __importDefault(__webpack_require__(/*! entities/lib/maps/xml.json */ "./node_modules/entities/lib/maps/xml.json"));
function whitespace(c) {
    return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}
function isASCIIAlpha(c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}
function ifElseState(upper, SUCCESS, FAILURE) {
    var lower = upper.toLowerCase();
    if (upper === lower) {
        return function (t, c) {
            if (c === lower) {
                t._state = SUCCESS;
            }
            else {
                t._state = FAILURE;
                t._index--;
            }
        };
    }
    return function (t, c) {
        if (c === lower || c === upper) {
            t._state = SUCCESS;
        }
        else {
            t._state = FAILURE;
            t._index--;
        }
    };
}
function consumeSpecialNameChar(upper, NEXT_STATE) {
    var lower = upper.toLowerCase();
    return function (t, c) {
        if (c === lower || c === upper) {
            t._state = NEXT_STATE;
        }
        else {
            t._state = 3 /* InTagName */;
            t._index--; // Consume the token again
        }
    };
}
var stateBeforeCdata1 = ifElseState("C", 24 /* BeforeCdata2 */, 16 /* InDeclaration */);
var stateBeforeCdata2 = ifElseState("D", 25 /* BeforeCdata3 */, 16 /* InDeclaration */);
var stateBeforeCdata3 = ifElseState("A", 26 /* BeforeCdata4 */, 16 /* InDeclaration */);
var stateBeforeCdata4 = ifElseState("T", 27 /* BeforeCdata5 */, 16 /* InDeclaration */);
var stateBeforeCdata5 = ifElseState("A", 28 /* BeforeCdata6 */, 16 /* InDeclaration */);
var stateBeforeScript1 = consumeSpecialNameChar("R", 35 /* BeforeScript2 */);
var stateBeforeScript2 = consumeSpecialNameChar("I", 36 /* BeforeScript3 */);
var stateBeforeScript3 = consumeSpecialNameChar("P", 37 /* BeforeScript4 */);
var stateBeforeScript4 = consumeSpecialNameChar("T", 38 /* BeforeScript5 */);
var stateAfterScript1 = ifElseState("R", 40 /* AfterScript2 */, 1 /* Text */);
var stateAfterScript2 = ifElseState("I", 41 /* AfterScript3 */, 1 /* Text */);
var stateAfterScript3 = ifElseState("P", 42 /* AfterScript4 */, 1 /* Text */);
var stateAfterScript4 = ifElseState("T", 43 /* AfterScript5 */, 1 /* Text */);
var stateBeforeStyle1 = consumeSpecialNameChar("Y", 45 /* BeforeStyle2 */);
var stateBeforeStyle2 = consumeSpecialNameChar("L", 46 /* BeforeStyle3 */);
var stateBeforeStyle3 = consumeSpecialNameChar("E", 47 /* BeforeStyle4 */);
var stateAfterStyle1 = ifElseState("Y", 49 /* AfterStyle2 */, 1 /* Text */);
var stateAfterStyle2 = ifElseState("L", 50 /* AfterStyle3 */, 1 /* Text */);
var stateAfterStyle3 = ifElseState("E", 51 /* AfterStyle4 */, 1 /* Text */);
var stateBeforeSpecialT = consumeSpecialNameChar("I", 54 /* BeforeTitle1 */);
var stateBeforeTitle1 = consumeSpecialNameChar("T", 55 /* BeforeTitle2 */);
var stateBeforeTitle2 = consumeSpecialNameChar("L", 56 /* BeforeTitle3 */);
var stateBeforeTitle3 = consumeSpecialNameChar("E", 57 /* BeforeTitle4 */);
var stateAfterSpecialTEnd = ifElseState("I", 58 /* AfterTitle1 */, 1 /* Text */);
var stateAfterTitle1 = ifElseState("T", 59 /* AfterTitle2 */, 1 /* Text */);
var stateAfterTitle2 = ifElseState("L", 60 /* AfterTitle3 */, 1 /* Text */);
var stateAfterTitle3 = ifElseState("E", 61 /* AfterTitle4 */, 1 /* Text */);
var stateBeforeEntity = ifElseState("#", 63 /* BeforeNumericEntity */, 64 /* InNamedEntity */);
var stateBeforeNumericEntity = ifElseState("X", 66 /* InHexEntity */, 65 /* InNumericEntity */);
var Tokenizer = /** @class */ (function () {
    function Tokenizer(options, cbs) {
        var _a;
        /** The current state the tokenizer is in. */
        this._state = 1 /* Text */;
        /** The read buffer. */
        this.buffer = "";
        /** The beginning of the section that is currently being read. */
        this.sectionStart = 0;
        /** The index within the buffer that we are currently looking at. */
        this._index = 0;
        /**
         * Data that has already been processed will be removed from the buffer occasionally.
         * `_bufferOffset` keeps track of how many characters have been removed, to make sure position information is accurate.
         */
        this.bufferOffset = 0;
        /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
        this.baseState = 1 /* Text */;
        /** For special parsing behavior inside of script and style tags. */
        this.special = 1 /* None */;
        /** Indicates whether the tokenizer has been paused. */
        this.running = true;
        /** Indicates whether the tokenizer has finished running / `.end` has been called. */
        this.ended = false;
        this.cbs = cbs;
        this.xmlMode = !!(options === null || options === void 0 ? void 0 : options.xmlMode);
        this.decodeEntities = (_a = options === null || options === void 0 ? void 0 : options.decodeEntities) !== null && _a !== void 0 ? _a : true;
    }
    Tokenizer.prototype.reset = function () {
        this._state = 1 /* Text */;
        this.buffer = "";
        this.sectionStart = 0;
        this._index = 0;
        this.bufferOffset = 0;
        this.baseState = 1 /* Text */;
        this.special = 1 /* None */;
        this.running = true;
        this.ended = false;
    };
    Tokenizer.prototype.write = function (chunk) {
        if (this.ended)
            this.cbs.onerror(Error(".write() after done!"));
        this.buffer += chunk;
        this.parse();
    };
    Tokenizer.prototype.end = function (chunk) {
        if (this.ended)
            this.cbs.onerror(Error(".end() after done!"));
        if (chunk)
            this.write(chunk);
        this.ended = true;
        if (this.running)
            this.finish();
    };
    Tokenizer.prototype.pause = function () {
        this.running = false;
    };
    Tokenizer.prototype.resume = function () {
        this.running = true;
        if (this._index < this.buffer.length) {
            this.parse();
        }
        if (this.ended) {
            this.finish();
        }
    };
    /**
     * The current index within all of the written data.
     */
    Tokenizer.prototype.getAbsoluteIndex = function () {
        return this.bufferOffset + this._index;
    };
    Tokenizer.prototype.stateText = function (c) {
        if (c === "<") {
            if (this._index > this.sectionStart) {
                this.cbs.ontext(this.getSection());
            }
            this._state = 2 /* BeforeTagName */;
            this.sectionStart = this._index;
        }
        else if (this.decodeEntities &&
            c === "&" &&
            (this.special === 1 /* None */ || this.special === 4 /* Title */)) {
            if (this._index > this.sectionStart) {
                this.cbs.ontext(this.getSection());
            }
            this.baseState = 1 /* Text */;
            this._state = 62 /* BeforeEntity */;
            this.sectionStart = this._index;
        }
    };
    /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */
    Tokenizer.prototype.isTagStartChar = function (c) {
        return (isASCIIAlpha(c) ||
            (this.xmlMode && !whitespace(c) && c !== "/" && c !== ">"));
    };
    Tokenizer.prototype.stateBeforeTagName = function (c) {
        if (c === "/") {
            this._state = 5 /* BeforeClosingTagName */;
        }
        else if (c === "<") {
            this.cbs.ontext(this.getSection());
            this.sectionStart = this._index;
        }
        else if (c === ">" ||
            this.special !== 1 /* None */ ||
            whitespace(c)) {
            this._state = 1 /* Text */;
        }
        else if (c === "!") {
            this._state = 15 /* BeforeDeclaration */;
            this.sectionStart = this._index + 1;
        }
        else if (c === "?") {
            this._state = 17 /* InProcessingInstruction */;
            this.sectionStart = this._index + 1;
        }
        else if (!this.isTagStartChar(c)) {
            this._state = 1 /* Text */;
        }
        else {
            this._state =
                !this.xmlMode && (c === "s" || c === "S")
                    ? 32 /* BeforeSpecialS */
                    : !this.xmlMode && (c === "t" || c === "T")
                        ? 52 /* BeforeSpecialT */
                        : 3 /* InTagName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInTagName = function (c) {
        if (c === "/" || c === ">" || whitespace(c)) {
            this.emitToken("onopentagname");
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateBeforeClosingTagName = function (c) {
        if (whitespace(c)) {
            // Ignore
        }
        else if (c === ">") {
            this._state = 1 /* Text */;
        }
        else if (this.special !== 1 /* None */) {
            if (this.special !== 4 /* Title */ && (c === "s" || c === "S")) {
                this._state = 33 /* BeforeSpecialSEnd */;
            }
            else if (this.special === 4 /* Title */ &&
                (c === "t" || c === "T")) {
                this._state = 53 /* BeforeSpecialTEnd */;
            }
            else {
                this._state = 1 /* Text */;
                this._index--;
            }
        }
        else if (!this.isTagStartChar(c)) {
            this._state = 20 /* InSpecialComment */;
            this.sectionStart = this._index;
        }
        else {
            this._state = 6 /* InClosingTagName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInClosingTagName = function (c) {
        if (c === ">" || whitespace(c)) {
            this.emitToken("onclosetag");
            this._state = 7 /* AfterClosingTagName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateAfterClosingTagName = function (c) {
        // Skip everything until ">"
        if (c === ">") {
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeName = function (c) {
        if (c === ">") {
            this.cbs.onopentagend();
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
        else if (c === "/") {
            this._state = 4 /* InSelfClosingTag */;
        }
        else if (!whitespace(c)) {
            this._state = 9 /* InAttributeName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInSelfClosingTag = function (c) {
        if (c === ">") {
            this.cbs.onselfclosingtag();
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
            this.special = 1 /* None */; // Reset special state, in case of self-closing special tags
        }
        else if (!whitespace(c)) {
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateInAttributeName = function (c) {
        if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
            this.cbs.onattribname(this.getSection());
            this.sectionStart = -1;
            this._state = 10 /* AfterAttributeName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateAfterAttributeName = function (c) {
        if (c === "=") {
            this._state = 11 /* BeforeAttributeValue */;
        }
        else if (c === "/" || c === ">") {
            this.cbs.onattribend(undefined);
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
        else if (!whitespace(c)) {
            this.cbs.onattribend(undefined);
            this._state = 9 /* InAttributeName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeValue = function (c) {
        if (c === '"') {
            this._state = 12 /* InAttributeValueDq */;
            this.sectionStart = this._index + 1;
        }
        else if (c === "'") {
            this._state = 13 /* InAttributeValueSq */;
            this.sectionStart = this._index + 1;
        }
        else if (!whitespace(c)) {
            this._state = 14 /* InAttributeValueNq */;
            this.sectionStart = this._index;
            this._index--; // Reconsume token
        }
    };
    Tokenizer.prototype.handleInAttributeValue = function (c, quote) {
        if (c === quote) {
            this.emitToken("onattribdata");
            this.cbs.onattribend(quote);
            this._state = 8 /* BeforeAttributeName */;
        }
        else if (this.decodeEntities && c === "&") {
            this.emitToken("onattribdata");
            this.baseState = this._state;
            this._state = 62 /* BeforeEntity */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function (c) {
        this.handleInAttributeValue(c, '"');
    };
    Tokenizer.prototype.stateInAttributeValueSingleQuotes = function (c) {
        this.handleInAttributeValue(c, "'");
    };
    Tokenizer.prototype.stateInAttributeValueNoQuotes = function (c) {
        if (whitespace(c) || c === ">") {
            this.emitToken("onattribdata");
            this.cbs.onattribend(null);
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
        else if (this.decodeEntities && c === "&") {
            this.emitToken("onattribdata");
            this.baseState = this._state;
            this._state = 62 /* BeforeEntity */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateBeforeDeclaration = function (c) {
        this._state =
            c === "["
                ? 23 /* BeforeCdata1 */
                : c === "-"
                    ? 18 /* BeforeComment */
                    : 16 /* InDeclaration */;
    };
    Tokenizer.prototype.stateInDeclaration = function (c) {
        if (c === ">") {
            this.cbs.ondeclaration(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateInProcessingInstruction = function (c) {
        if (c === ">") {
            this.cbs.onprocessinginstruction(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeComment = function (c) {
        if (c === "-") {
            this._state = 19 /* InComment */;
            this.sectionStart = this._index + 1;
        }
        else {
            this._state = 16 /* InDeclaration */;
        }
    };
    Tokenizer.prototype.stateInComment = function (c) {
        if (c === "-")
            this._state = 21 /* AfterComment1 */;
    };
    Tokenizer.prototype.stateInSpecialComment = function (c) {
        if (c === ">") {
            this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index));
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateAfterComment1 = function (c) {
        if (c === "-") {
            this._state = 22 /* AfterComment2 */;
        }
        else {
            this._state = 19 /* InComment */;
        }
    };
    Tokenizer.prototype.stateAfterComment2 = function (c) {
        if (c === ">") {
            // Remove 2 trailing chars
            this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index - 2));
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
        else if (c !== "-") {
            this._state = 19 /* InComment */;
        }
        // Else: stay in AFTER_COMMENT_2 (`--->`)
    };
    Tokenizer.prototype.stateBeforeCdata6 = function (c) {
        if (c === "[") {
            this._state = 29 /* InCdata */;
            this.sectionStart = this._index + 1;
        }
        else {
            this._state = 16 /* InDeclaration */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateInCdata = function (c) {
        if (c === "]")
            this._state = 30 /* AfterCdata1 */;
    };
    Tokenizer.prototype.stateAfterCdata1 = function (c) {
        if (c === "]")
            this._state = 31 /* AfterCdata2 */;
        else
            this._state = 29 /* InCdata */;
    };
    Tokenizer.prototype.stateAfterCdata2 = function (c) {
        if (c === ">") {
            // Remove 2 trailing chars
            this.cbs.oncdata(this.buffer.substring(this.sectionStart, this._index - 2));
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
        else if (c !== "]") {
            this._state = 29 /* InCdata */;
        }
        // Else: stay in AFTER_CDATA_2 (`]]]>`)
    };
    Tokenizer.prototype.stateBeforeSpecialS = function (c) {
        if (c === "c" || c === "C") {
            this._state = 34 /* BeforeScript1 */;
        }
        else if (c === "t" || c === "T") {
            this._state = 44 /* BeforeStyle1 */;
        }
        else {
            this._state = 3 /* InTagName */;
            this._index--; // Consume the token again
        }
    };
    Tokenizer.prototype.stateBeforeSpecialSEnd = function (c) {
        if (this.special === 2 /* Script */ && (c === "c" || c === "C")) {
            this._state = 39 /* AfterScript1 */;
        }
        else if (this.special === 3 /* Style */ && (c === "t" || c === "T")) {
            this._state = 48 /* AfterStyle1 */;
        }
        else
            this._state = 1 /* Text */;
    };
    Tokenizer.prototype.stateBeforeSpecialLast = function (c, special) {
        if (c === "/" || c === ">" || whitespace(c)) {
            this.special = special;
        }
        this._state = 3 /* InTagName */;
        this._index--; // Consume the token again
    };
    Tokenizer.prototype.stateAfterSpecialLast = function (c, sectionStartOffset) {
        if (c === ">" || whitespace(c)) {
            this.special = 1 /* None */;
            this._state = 6 /* InClosingTagName */;
            this.sectionStart = this._index - sectionStartOffset;
            this._index--; // Reconsume the token
        }
        else
            this._state = 1 /* Text */;
    };
    // For entities terminated with a semicolon
    Tokenizer.prototype.parseFixedEntity = function (map) {
        if (map === void 0) { map = this.xmlMode ? xml_json_1.default : entities_json_1.default; }
        // Offset = 1
        if (this.sectionStart + 1 < this._index) {
            var entity = this.buffer.substring(this.sectionStart + 1, this._index);
            if (Object.prototype.hasOwnProperty.call(map, entity)) {
                this.emitPartial(map[entity]);
                this.sectionStart = this._index + 1;
            }
        }
    };
    // Parses legacy entities (without trailing semicolon)
    Tokenizer.prototype.parseLegacyEntity = function () {
        var start = this.sectionStart + 1;
        // The max length of legacy entities is 6
        var limit = Math.min(this._index - start, 6);
        while (limit >= 2) {
            // The min length of legacy entities is 2
            var entity = this.buffer.substr(start, limit);
            if (Object.prototype.hasOwnProperty.call(legacy_json_1.default, entity)) {
                this.emitPartial(legacy_json_1.default[entity]);
                this.sectionStart += limit + 1;
                return;
            }
            limit--;
        }
    };
    Tokenizer.prototype.stateInNamedEntity = function (c) {
        if (c === ";") {
            this.parseFixedEntity();
            // Retry as legacy entity if entity wasn't parsed
            if (this.baseState === 1 /* Text */ &&
                this.sectionStart + 1 < this._index &&
                !this.xmlMode) {
                this.parseLegacyEntity();
            }
            this._state = this.baseState;
        }
        else if ((c < "0" || c > "9") && !isASCIIAlpha(c)) {
            if (this.xmlMode || this.sectionStart + 1 === this._index) {
                // Ignore
            }
            else if (this.baseState !== 1 /* Text */) {
                if (c !== "=") {
                    // Parse as legacy entity, without allowing additional characters.
                    this.parseFixedEntity(legacy_json_1.default);
                }
            }
            else {
                this.parseLegacyEntity();
            }
            this._state = this.baseState;
            this._index--;
        }
    };
    Tokenizer.prototype.decodeNumericEntity = function (offset, base, strict) {
        var sectionStart = this.sectionStart + offset;
        if (sectionStart !== this._index) {
            // Parse entity
            var entity = this.buffer.substring(sectionStart, this._index);
            var parsed = parseInt(entity, base);
            this.emitPartial(decode_codepoint_1.default(parsed));
            this.sectionStart = strict ? this._index + 1 : this._index;
        }
        this._state = this.baseState;
    };
    Tokenizer.prototype.stateInNumericEntity = function (c) {
        if (c === ";") {
            this.decodeNumericEntity(2, 10, true);
        }
        else if (c < "0" || c > "9") {
            if (!this.xmlMode) {
                this.decodeNumericEntity(2, 10, false);
            }
            else {
                this._state = this.baseState;
            }
            this._index--;
        }
    };
    Tokenizer.prototype.stateInHexEntity = function (c) {
        if (c === ";") {
            this.decodeNumericEntity(3, 16, true);
        }
        else if ((c < "a" || c > "f") &&
            (c < "A" || c > "F") &&
            (c < "0" || c > "9")) {
            if (!this.xmlMode) {
                this.decodeNumericEntity(3, 16, false);
            }
            else {
                this._state = this.baseState;
            }
            this._index--;
        }
    };
    Tokenizer.prototype.cleanup = function () {
        if (this.sectionStart < 0) {
            this.buffer = "";
            this.bufferOffset += this._index;
            this._index = 0;
        }
        else if (this.running) {
            if (this._state === 1 /* Text */) {
                if (this.sectionStart !== this._index) {
                    this.cbs.ontext(this.buffer.substr(this.sectionStart));
                }
                this.buffer = "";
                this.bufferOffset += this._index;
                this._index = 0;
            }
            else if (this.sectionStart === this._index) {
                // The section just started
                this.buffer = "";
                this.bufferOffset += this._index;
                this._index = 0;
            }
            else {
                // Remove everything unnecessary
                this.buffer = this.buffer.substr(this.sectionStart);
                this._index -= this.sectionStart;
                this.bufferOffset += this.sectionStart;
            }
            this.sectionStart = 0;
        }
    };
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */
    Tokenizer.prototype.parse = function () {
        while (this._index < this.buffer.length && this.running) {
            var c = this.buffer.charAt(this._index);
            if (this._state === 1 /* Text */) {
                this.stateText(c);
            }
            else if (this._state === 12 /* InAttributeValueDq */) {
                this.stateInAttributeValueDoubleQuotes(c);
            }
            else if (this._state === 9 /* InAttributeName */) {
                this.stateInAttributeName(c);
            }
            else if (this._state === 19 /* InComment */) {
                this.stateInComment(c);
            }
            else if (this._state === 20 /* InSpecialComment */) {
                this.stateInSpecialComment(c);
            }
            else if (this._state === 8 /* BeforeAttributeName */) {
                this.stateBeforeAttributeName(c);
            }
            else if (this._state === 3 /* InTagName */) {
                this.stateInTagName(c);
            }
            else if (this._state === 6 /* InClosingTagName */) {
                this.stateInClosingTagName(c);
            }
            else if (this._state === 2 /* BeforeTagName */) {
                this.stateBeforeTagName(c);
            }
            else if (this._state === 10 /* AfterAttributeName */) {
                this.stateAfterAttributeName(c);
            }
            else if (this._state === 13 /* InAttributeValueSq */) {
                this.stateInAttributeValueSingleQuotes(c);
            }
            else if (this._state === 11 /* BeforeAttributeValue */) {
                this.stateBeforeAttributeValue(c);
            }
            else if (this._state === 5 /* BeforeClosingTagName */) {
                this.stateBeforeClosingTagName(c);
            }
            else if (this._state === 7 /* AfterClosingTagName */) {
                this.stateAfterClosingTagName(c);
            }
            else if (this._state === 32 /* BeforeSpecialS */) {
                this.stateBeforeSpecialS(c);
            }
            else if (this._state === 21 /* AfterComment1 */) {
                this.stateAfterComment1(c);
            }
            else if (this._state === 14 /* InAttributeValueNq */) {
                this.stateInAttributeValueNoQuotes(c);
            }
            else if (this._state === 4 /* InSelfClosingTag */) {
                this.stateInSelfClosingTag(c);
            }
            else if (this._state === 16 /* InDeclaration */) {
                this.stateInDeclaration(c);
            }
            else if (this._state === 15 /* BeforeDeclaration */) {
                this.stateBeforeDeclaration(c);
            }
            else if (this._state === 22 /* AfterComment2 */) {
                this.stateAfterComment2(c);
            }
            else if (this._state === 18 /* BeforeComment */) {
                this.stateBeforeComment(c);
            }
            else if (this._state === 33 /* BeforeSpecialSEnd */) {
                this.stateBeforeSpecialSEnd(c);
            }
            else if (this._state === 53 /* BeforeSpecialTEnd */) {
                stateAfterSpecialTEnd(this, c);
            }
            else if (this._state === 39 /* AfterScript1 */) {
                stateAfterScript1(this, c);
            }
            else if (this._state === 40 /* AfterScript2 */) {
                stateAfterScript2(this, c);
            }
            else if (this._state === 41 /* AfterScript3 */) {
                stateAfterScript3(this, c);
            }
            else if (this._state === 34 /* BeforeScript1 */) {
                stateBeforeScript1(this, c);
            }
            else if (this._state === 35 /* BeforeScript2 */) {
                stateBeforeScript2(this, c);
            }
            else if (this._state === 36 /* BeforeScript3 */) {
                stateBeforeScript3(this, c);
            }
            else if (this._state === 37 /* BeforeScript4 */) {
                stateBeforeScript4(this, c);
            }
            else if (this._state === 38 /* BeforeScript5 */) {
                this.stateBeforeSpecialLast(c, 2 /* Script */);
            }
            else if (this._state === 42 /* AfterScript4 */) {
                stateAfterScript4(this, c);
            }
            else if (this._state === 43 /* AfterScript5 */) {
                this.stateAfterSpecialLast(c, 6);
            }
            else if (this._state === 44 /* BeforeStyle1 */) {
                stateBeforeStyle1(this, c);
            }
            else if (this._state === 29 /* InCdata */) {
                this.stateInCdata(c);
            }
            else if (this._state === 45 /* BeforeStyle2 */) {
                stateBeforeStyle2(this, c);
            }
            else if (this._state === 46 /* BeforeStyle3 */) {
                stateBeforeStyle3(this, c);
            }
            else if (this._state === 47 /* BeforeStyle4 */) {
                this.stateBeforeSpecialLast(c, 3 /* Style */);
            }
            else if (this._state === 48 /* AfterStyle1 */) {
                stateAfterStyle1(this, c);
            }
            else if (this._state === 49 /* AfterStyle2 */) {
                stateAfterStyle2(this, c);
            }
            else if (this._state === 50 /* AfterStyle3 */) {
                stateAfterStyle3(this, c);
            }
            else if (this._state === 51 /* AfterStyle4 */) {
                this.stateAfterSpecialLast(c, 5);
            }
            else if (this._state === 52 /* BeforeSpecialT */) {
                stateBeforeSpecialT(this, c);
            }
            else if (this._state === 54 /* BeforeTitle1 */) {
                stateBeforeTitle1(this, c);
            }
            else if (this._state === 55 /* BeforeTitle2 */) {
                stateBeforeTitle2(this, c);
            }
            else if (this._state === 56 /* BeforeTitle3 */) {
                stateBeforeTitle3(this, c);
            }
            else if (this._state === 57 /* BeforeTitle4 */) {
                this.stateBeforeSpecialLast(c, 4 /* Title */);
            }
            else if (this._state === 58 /* AfterTitle1 */) {
                stateAfterTitle1(this, c);
            }
            else if (this._state === 59 /* AfterTitle2 */) {
                stateAfterTitle2(this, c);
            }
            else if (this._state === 60 /* AfterTitle3 */) {
                stateAfterTitle3(this, c);
            }
            else if (this._state === 61 /* AfterTitle4 */) {
                this.stateAfterSpecialLast(c, 5);
            }
            else if (this._state === 17 /* InProcessingInstruction */) {
                this.stateInProcessingInstruction(c);
            }
            else if (this._state === 64 /* InNamedEntity */) {
                this.stateInNamedEntity(c);
            }
            else if (this._state === 23 /* BeforeCdata1 */) {
                stateBeforeCdata1(this, c);
            }
            else if (this._state === 62 /* BeforeEntity */) {
                stateBeforeEntity(this, c);
            }
            else if (this._state === 24 /* BeforeCdata2 */) {
                stateBeforeCdata2(this, c);
            }
            else if (this._state === 25 /* BeforeCdata3 */) {
                stateBeforeCdata3(this, c);
            }
            else if (this._state === 30 /* AfterCdata1 */) {
                this.stateAfterCdata1(c);
            }
            else if (this._state === 31 /* AfterCdata2 */) {
                this.stateAfterCdata2(c);
            }
            else if (this._state === 26 /* BeforeCdata4 */) {
                stateBeforeCdata4(this, c);
            }
            else if (this._state === 27 /* BeforeCdata5 */) {
                stateBeforeCdata5(this, c);
            }
            else if (this._state === 28 /* BeforeCdata6 */) {
                this.stateBeforeCdata6(c);
            }
            else if (this._state === 66 /* InHexEntity */) {
                this.stateInHexEntity(c);
            }
            else if (this._state === 65 /* InNumericEntity */) {
                this.stateInNumericEntity(c);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            }
            else if (this._state === 63 /* BeforeNumericEntity */) {
                stateBeforeNumericEntity(this, c);
            }
            else {
                this.cbs.onerror(Error("unknown _state"), this._state);
            }
            this._index++;
        }
        this.cleanup();
    };
    Tokenizer.prototype.finish = function () {
        // If there is remaining data, emit it in a reasonable way
        if (this.sectionStart < this._index) {
            this.handleTrailingData();
        }
        this.cbs.onend();
    };
    Tokenizer.prototype.handleTrailingData = function () {
        var data = this.buffer.substr(this.sectionStart);
        if (this._state === 29 /* InCdata */ ||
            this._state === 30 /* AfterCdata1 */ ||
            this._state === 31 /* AfterCdata2 */) {
            this.cbs.oncdata(data);
        }
        else if (this._state === 19 /* InComment */ ||
            this._state === 21 /* AfterComment1 */ ||
            this._state === 22 /* AfterComment2 */) {
            this.cbs.oncomment(data);
        }
        else if (this._state === 64 /* InNamedEntity */ && !this.xmlMode) {
            this.parseLegacyEntity();
            if (this.sectionStart < this._index) {
                this._state = this.baseState;
                this.handleTrailingData();
            }
        }
        else if (this._state === 65 /* InNumericEntity */ && !this.xmlMode) {
            this.decodeNumericEntity(2, 10, false);
            if (this.sectionStart < this._index) {
                this._state = this.baseState;
                this.handleTrailingData();
            }
        }
        else if (this._state === 66 /* InHexEntity */ && !this.xmlMode) {
            this.decodeNumericEntity(3, 16, false);
            if (this.sectionStart < this._index) {
                this._state = this.baseState;
                this.handleTrailingData();
            }
        }
        else if (this._state !== 3 /* InTagName */ &&
            this._state !== 8 /* BeforeAttributeName */ &&
            this._state !== 11 /* BeforeAttributeValue */ &&
            this._state !== 10 /* AfterAttributeName */ &&
            this._state !== 9 /* InAttributeName */ &&
            this._state !== 13 /* InAttributeValueSq */ &&
            this._state !== 12 /* InAttributeValueDq */ &&
            this._state !== 14 /* InAttributeValueNq */ &&
            this._state !== 6 /* InClosingTagName */) {
            this.cbs.ontext(data);
        }
        /*
         * Else, ignore remaining data
         * TODO add a way to remove current tag
         */
    };
    Tokenizer.prototype.getSection = function () {
        return this.buffer.substring(this.sectionStart, this._index);
    };
    Tokenizer.prototype.emitToken = function (name) {
        this.cbs[name](this.getSection());
        this.sectionStart = -1;
    };
    Tokenizer.prototype.emitPartial = function (value) {
        if (this.baseState !== 1 /* Text */) {
            this.cbs.onattribdata(value); // TODO implement the new event
        }
        else {
            this.cbs.ontext(value);
        }
    };
    return Tokenizer;
}());
exports["default"] = Tokenizer;


/***/ }),

/***/ "./node_modules/htmlparser2/lib/index.js":
/*!***********************************************!*\
  !*** ./node_modules/htmlparser2/lib/index.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RssHandler = exports.DefaultHandler = exports.DomUtils = exports.ElementType = exports.Tokenizer = exports.createDomStream = exports.parseDOM = exports.parseDocument = exports.DomHandler = exports.Parser = void 0;
var Parser_1 = __webpack_require__(/*! ./Parser */ "./node_modules/htmlparser2/lib/Parser.js");
Object.defineProperty(exports, "Parser", ({ enumerable: true, get: function () { return Parser_1.Parser; } }));
var domhandler_1 = __webpack_require__(/*! domhandler */ "./node_modules/domhandler/lib/index.js");
Object.defineProperty(exports, "DomHandler", ({ enumerable: true, get: function () { return domhandler_1.DomHandler; } }));
Object.defineProperty(exports, "DefaultHandler", ({ enumerable: true, get: function () { return domhandler_1.DomHandler; } }));
// Helper methods
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */
function parseDocument(data, options) {
    var handler = new domhandler_1.DomHandler(undefined, options);
    new Parser_1.Parser(handler, options).end(data);
    return handler.root;
}
exports.parseDocument = parseDocument;
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */
function parseDOM(data, options) {
    return parseDocument(data, options).children;
}
exports.parseDOM = parseDOM;
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param cb A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
 */
function createDomStream(cb, options, elementCb) {
    var handler = new domhandler_1.DomHandler(cb, options, elementCb);
    return new Parser_1.Parser(handler, options);
}
exports.createDomStream = createDomStream;
var Tokenizer_1 = __webpack_require__(/*! ./Tokenizer */ "./node_modules/htmlparser2/lib/Tokenizer.js");
Object.defineProperty(exports, "Tokenizer", ({ enumerable: true, get: function () { return __importDefault(Tokenizer_1).default; } }));
var ElementType = __importStar(__webpack_require__(/*! domelementtype */ "./node_modules/domelementtype/lib/index.js"));
exports.ElementType = ElementType;
/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */
__exportStar(__webpack_require__(/*! ./FeedHandler */ "./node_modules/htmlparser2/lib/FeedHandler.js"), exports);
exports.DomUtils = __importStar(__webpack_require__(/*! domutils */ "./node_modules/domutils/lib/index.js"));
var FeedHandler_1 = __webpack_require__(/*! ./FeedHandler */ "./node_modules/htmlparser2/lib/FeedHandler.js");
Object.defineProperty(exports, "RssHandler", ({ enumerable: true, get: function () { return FeedHandler_1.FeedHandler; } }));


/***/ }),

/***/ "./node_modules/is-plain-object/dist/is-plain-object.js":
/*!**************************************************************!*\
  !*** ./node_modules/is-plain-object/dist/is-plain-object.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ "./node_modules/parse-srcset/src/parse-srcset.js":
/*!*******************************************************!*\
  !*** ./node_modules/parse-srcset/src/parse-srcset.js ***!
  \*******************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Srcset Parser
 *
 * By Alex Bell |  MIT License
 *
 * JS Parser for the string value that appears in markup <img srcset="here">
 *
 * @returns Array [{url: _, d: _, w: _, h:_}, ...]
 *
 * Based super duper closely on the reference algorithm at:
 * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
 *
 * Most comments are copied in directly from the spec
 * (except for comments in parens).
 */

(function (root, factory) {
	if (true) {
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}(this, function () {

	// 1. Let input be the value passed to this algorithm.
	return function (input) {

		// UTILITY FUNCTIONS

		// Manual is faster than RegEx
		// http://bjorn.tipling.com/state-and-regular-expressions-in-javascript
		// http://jsperf.com/whitespace-character/5
		function isSpace(c) {
			return (c === "\u0020" || // space
			c === "\u0009" || // horizontal tab
			c === "\u000A" || // new line
			c === "\u000C" || // form feed
			c === "\u000D");  // carriage return
		}

		function collectCharacters(regEx) {
			var chars,
				match = regEx.exec(input.substring(pos));
			if (match) {
				chars = match[ 0 ];
				pos += chars.length;
				return chars;
			}
		}

		var inputLength = input.length,

			// (Don't use \s, to avoid matching non-breaking space)
			regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
			regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
			regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
			regexTrailingCommas = /[,]+$/,
			regexNonNegativeInteger = /^\d+$/,

			// ( Positive or negative or unsigned integers or decimals, without or without exponents.
			// Must include at least one digit.
			// According to spec tests any decimal point must be followed by a digit.
			// No leading plus sign is allowed.)
			// https://html.spec.whatwg.org/multipage/infrastructure.html#valid-floating-point-number
			regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,

			url,
			descriptors,
			currentDescriptor,
			state,
			c,

			// 2. Let position be a pointer into input, initially pointing at the start
			//    of the string.
			pos = 0,

			// 3. Let candidates be an initially empty source set.
			candidates = [];

		// 4. Splitting loop: Collect a sequence of characters that are space
		//    characters or U+002C COMMA characters. If any U+002C COMMA characters
		//    were collected, that is a parse error.
		while (true) {
			collectCharacters(regexLeadingCommasOrSpaces);

			// 5. If position is past the end of input, return candidates and abort these steps.
			if (pos >= inputLength) {
				return candidates; // (we're done, this is the sole return path)
			}

			// 6. Collect a sequence of characters that are not space characters,
			//    and let that be url.
			url = collectCharacters(regexLeadingNotSpaces);

			// 7. Let descriptors be a new empty list.
			descriptors = [];

			// 8. If url ends with a U+002C COMMA character (,), follow these substeps:
			//		(1). Remove all trailing U+002C COMMA characters from url. If this removed
			//         more than one character, that is a parse error.
			if (url.slice(-1) === ",") {
				url = url.replace(regexTrailingCommas, "");
				// (Jump ahead to step 9 to skip tokenization and just push the candidate).
				parseDescriptors();

				//	Otherwise, follow these substeps:
			} else {
				tokenize();
			} // (close else of step 8)

			// 16. Return to the step labeled splitting loop.
		} // (Close of big while loop.)

		/**
		 * Tokenizes descriptor properties prior to parsing
		 * Returns undefined.
		 */
		function tokenize() {

			// 8.1. Descriptor tokeniser: Skip whitespace
			collectCharacters(regexLeadingSpaces);

			// 8.2. Let current descriptor be the empty string.
			currentDescriptor = "";

			// 8.3. Let state be in descriptor.
			state = "in descriptor";

			while (true) {

				// 8.4. Let c be the character at position.
				c = input.charAt(pos);

				//  Do the following depending on the value of state.
				//  For the purpose of this step, "EOF" is a special character representing
				//  that position is past the end of input.

				// In descriptor
				if (state === "in descriptor") {
					// Do the following, depending on the value of c:

					// Space character
					// If current descriptor is not empty, append current descriptor to
					// descriptors and let current descriptor be the empty string.
					// Set state to after descriptor.
					if (isSpace(c)) {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
							currentDescriptor = "";
							state = "after descriptor";
						}

						// U+002C COMMA (,)
						// Advance position to the next character in input. If current descriptor
						// is not empty, append current descriptor to descriptors. Jump to the step
						// labeled descriptor parser.
					} else if (c === ",") {
						pos += 1;
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

						// U+0028 LEFT PARENTHESIS (()
						// Append c to current descriptor. Set state to in parens.
					} else if (c === "\u0028") {
						currentDescriptor = currentDescriptor + c;
						state = "in parens";

						// EOF
						// If current descriptor is not empty, append current descriptor to
						// descriptors. Jump to the step labeled descriptor parser.
					} else if (c === "") {
						if (currentDescriptor) {
							descriptors.push(currentDescriptor);
						}
						parseDescriptors();
						return;

						// Anything else
						// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}
					// (end "in descriptor"

					// In parens
				} else if (state === "in parens") {

					// U+0029 RIGHT PARENTHESIS ())
					// Append c to current descriptor. Set state to in descriptor.
					if (c === ")") {
						currentDescriptor = currentDescriptor + c;
						state = "in descriptor";

						// EOF
						// Append current descriptor to descriptors. Jump to the step labeled
						// descriptor parser.
					} else if (c === "") {
						descriptors.push(currentDescriptor);
						parseDescriptors();
						return;

						// Anything else
						// Append c to current descriptor.
					} else {
						currentDescriptor = currentDescriptor + c;
					}

					// After descriptor
				} else if (state === "after descriptor") {

					// Do the following, depending on the value of c:
					// Space character: Stay in this state.
					if (isSpace(c)) {

						// EOF: Jump to the step labeled descriptor parser.
					} else if (c === "") {
						parseDescriptors();
						return;

						// Anything else
						// Set state to in descriptor. Set position to the previous character in input.
					} else {
						state = "in descriptor";
						pos -= 1;

					}
				}

				// Advance position to the next character in input.
				pos += 1;

				// Repeat this step.
			} // (close while true loop)
		}

		/**
		 * Adds descriptor properties to a candidate, pushes to the candidates array
		 * @return undefined
		 */
		// Declared outside of the while loop so that it's only created once.
		function parseDescriptors() {

			// 9. Descriptor parser: Let error be no.
			var pError = false,

				// 10. Let width be absent.
				// 11. Let density be absent.
				// 12. Let future-compat-h be absent. (We're implementing it now as h)
				w, d, h, i,
				candidate = {},
				desc, lastChar, value, intVal, floatVal;

			// 13. For each descriptor in descriptors, run the appropriate set of steps
			// from the following list:
			for (i = 0 ; i < descriptors.length; i++) {
				desc = descriptors[ i ];

				lastChar = desc[ desc.length - 1 ];
				value = desc.substring(0, desc.length - 1);
				intVal = parseInt(value, 10);
				floatVal = parseFloat(value);

				// If the descriptor consists of a valid non-negative integer followed by
				// a U+0077 LATIN SMALL LETTER W character
				if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {

					// If width and density are not both absent, then let error be yes.
					if (w || d) {pError = true;}

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes.
					// Otherwise, let width be the result.
					if (intVal === 0) {pError = true;} else {w = intVal;}

					// If the descriptor consists of a valid floating-point number followed by
					// a U+0078 LATIN SMALL LETTER X character
				} else if (regexFloatingPoint.test(value) && (lastChar === "x")) {

					// If width, density and future-compat-h are not all absent, then let error
					// be yes.
					if (w || d || h) {pError = true;}

					// Apply the rules for parsing floating-point number values to the descriptor.
					// If the result is less than zero, let error be yes. Otherwise, let density
					// be the result.
					if (floatVal < 0) {pError = true;} else {d = floatVal;}

					// If the descriptor consists of a valid non-negative integer followed by
					// a U+0068 LATIN SMALL LETTER H character
				} else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {

					// If height and density are not both absent, then let error be yes.
					if (h || d) {pError = true;}

					// Apply the rules for parsing non-negative integers to the descriptor.
					// If the result is zero, let error be yes. Otherwise, let future-compat-h
					// be the result.
					if (intVal === 0) {pError = true;} else {h = intVal;}

					// Anything else, Let error be yes.
				} else {pError = true;}
			} // (close step 13 for loop)

			// 15. If error is still no, then append a new image source to candidates whose
			// URL is url, associated with a width width if not absent and a pixel
			// density density if not absent. Otherwise, there is a parse error.
			if (!pError) {
				candidate.url = url;
				if (w) { candidate.w = w;}
				if (d) { candidate.d = d;}
				if (h) { candidate.h = h;}
				candidates.push(candidate);
			} else if (console && console.log) {
				console.log("Invalid srcset descriptor found in '" +
					input + "' at '" + desc + "'.");
			}
		} // (close parseDescriptors fn)

	}
}));


/***/ }),

/***/ "./node_modules/picocolors/picocolors.browser.js":
/*!*******************************************************!*\
  !*** ./node_modules/picocolors/picocolors.browser.js ***!
  \*******************************************************/
/***/ ((module) => {

var x=String;
var create=function() {return {isColorSupported:false,reset:x,bold:x,dim:x,italic:x,underline:x,inverse:x,hidden:x,strikethrough:x,black:x,red:x,green:x,yellow:x,blue:x,magenta:x,cyan:x,white:x,gray:x,bgBlack:x,bgRed:x,bgGreen:x,bgYellow:x,bgBlue:x,bgMagenta:x,bgCyan:x,bgWhite:x}};
module.exports=create();
module.exports.createColors = create;


/***/ }),

/***/ "./node_modules/postcss/lib/at-rule.js":
/*!*********************************************!*\
  !*** ./node_modules/postcss/lib/at-rule.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")

class AtRule extends Container {
  constructor(defaults) {
    super(defaults)
    this.type = 'atrule'
  }

  append(...children) {
    if (!this.proxyOf.nodes) this.nodes = []
    return super.append(...children)
  }

  prepend(...children) {
    if (!this.proxyOf.nodes) this.nodes = []
    return super.prepend(...children)
  }
}

module.exports = AtRule
AtRule.default = AtRule

Container.registerAtRule(AtRule)


/***/ }),

/***/ "./node_modules/postcss/lib/comment.js":
/*!*********************************************!*\
  !*** ./node_modules/postcss/lib/comment.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Node = __webpack_require__(/*! ./node */ "./node_modules/postcss/lib/node.js")

class Comment extends Node {
  constructor(defaults) {
    super(defaults)
    this.type = 'comment'
  }
}

module.exports = Comment
Comment.default = Comment


/***/ }),

/***/ "./node_modules/postcss/lib/container.js":
/*!***********************************************!*\
  !*** ./node_modules/postcss/lib/container.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let { isClean, my } = __webpack_require__(/*! ./symbols */ "./node_modules/postcss/lib/symbols.js")
let Declaration = __webpack_require__(/*! ./declaration */ "./node_modules/postcss/lib/declaration.js")
let Comment = __webpack_require__(/*! ./comment */ "./node_modules/postcss/lib/comment.js")
let Node = __webpack_require__(/*! ./node */ "./node_modules/postcss/lib/node.js")

let parse, Rule, AtRule

function cleanSource(nodes) {
  return nodes.map(i => {
    if (i.nodes) i.nodes = cleanSource(i.nodes)
    delete i.source
    return i
  })
}

function markDirtyUp(node) {
  node[isClean] = false
  if (node.proxyOf.nodes) {
    for (let i of node.proxyOf.nodes) {
      markDirtyUp(i)
    }
  }
}

class Container extends Node {
  push(child) {
    child.parent = this
    this.proxyOf.nodes.push(child)
    return this
  }

  each(callback) {
    if (!this.proxyOf.nodes) return undefined
    let iterator = this.getIterator()

    let index, result
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index = this.indexes[iterator]
      result = callback(this.proxyOf.nodes[index], index)
      if (result === false) break

      this.indexes[iterator] += 1
    }

    delete this.indexes[iterator]
    return result
  }

  walk(callback) {
    return this.each((child, i) => {
      let result
      try {
        result = callback(child, i)
      } catch (e) {
        throw child.addToError(e)
      }
      if (result !== false && child.walk) {
        result = child.walk(callback)
      }

      return result
    })
  }

  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop
      return this.walk((child, i) => {
        if (child.type === 'decl') {
          return callback(child, i)
        }
      })
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'decl' && prop.test(child.prop)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'decl' && child.prop === prop) {
        return callback(child, i)
      }
    })
  }

  walkRules(selector, callback) {
    if (!callback) {
      callback = selector

      return this.walk((child, i) => {
        if (child.type === 'rule') {
          return callback(child, i)
        }
      })
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'rule' && selector.test(child.selector)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'rule' && child.selector === selector) {
        return callback(child, i)
      }
    })
  }

  walkAtRules(name, callback) {
    if (!callback) {
      callback = name
      return this.walk((child, i) => {
        if (child.type === 'atrule') {
          return callback(child, i)
        }
      })
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === 'atrule' && name.test(child.name)) {
          return callback(child, i)
        }
      })
    }
    return this.walk((child, i) => {
      if (child.type === 'atrule' && child.name === name) {
        return callback(child, i)
      }
    })
  }

  walkComments(callback) {
    return this.walk((child, i) => {
      if (child.type === 'comment') {
        return callback(child, i)
      }
    })
  }

  append(...children) {
    for (let child of children) {
      let nodes = this.normalize(child, this.last)
      for (let node of nodes) this.proxyOf.nodes.push(node)
    }

    this.markDirty()

    return this
  }

  prepend(...children) {
    children = children.reverse()
    for (let child of children) {
      let nodes = this.normalize(child, this.first, 'prepend').reverse()
      for (let node of nodes) this.proxyOf.nodes.unshift(node)
      for (let id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween)
    if (this.nodes) {
      for (let node of this.nodes) node.cleanRaws(keepBetween)
    }
  }

  insertBefore(exist, add) {
    exist = this.index(exist)

    let type = exist === 0 ? 'prepend' : false
    let nodes = this.normalize(add, this.proxyOf.nodes[exist], type).reverse()
    for (let node of nodes) this.proxyOf.nodes.splice(exist, 0, node)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (exist <= index) {
        this.indexes[id] = index + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  insertAfter(exist, add) {
    exist = this.index(exist)

    let nodes = this.normalize(add, this.proxyOf.nodes[exist]).reverse()
    for (let node of nodes) this.proxyOf.nodes.splice(exist + 1, 0, node)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (exist < index) {
        this.indexes[id] = index + nodes.length
      }
    }

    this.markDirty()

    return this
  }

  removeChild(child) {
    child = this.index(child)
    this.proxyOf.nodes[child].parent = undefined
    this.proxyOf.nodes.splice(child, 1)

    let index
    for (let id in this.indexes) {
      index = this.indexes[id]
      if (index >= child) {
        this.indexes[id] = index - 1
      }
    }

    this.markDirty()

    return this
  }

  removeAll() {
    for (let node of this.proxyOf.nodes) node.parent = undefined
    this.proxyOf.nodes = []

    this.markDirty()

    return this
  }

  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts
      opts = {}
    }

    this.walkDecls(decl => {
      if (opts.props && !opts.props.includes(decl.prop)) return
      if (opts.fast && !decl.value.includes(opts.fast)) return

      decl.value = decl.value.replace(pattern, callback)
    })

    this.markDirty()

    return this
  }

  every(condition) {
    return this.nodes.every(condition)
  }

  some(condition) {
    return this.nodes.some(condition)
  }

  index(child) {
    if (typeof child === 'number') return child
    if (child.proxyOf) child = child.proxyOf
    return this.proxyOf.nodes.indexOf(child)
  }

  get first() {
    if (!this.proxyOf.nodes) return undefined
    return this.proxyOf.nodes[0]
  }

  get last() {
    if (!this.proxyOf.nodes) return undefined
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1]
  }

  normalize(nodes, sample) {
    if (typeof nodes === 'string') {
      nodes = cleanSource(parse(nodes).nodes)
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0)
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore')
      }
    } else if (nodes.type === 'root' && this.type !== 'document') {
      nodes = nodes.nodes.slice(0)
      for (let i of nodes) {
        if (i.parent) i.parent.removeChild(i, 'ignore')
      }
    } else if (nodes.type) {
      nodes = [nodes]
    } else if (nodes.prop) {
      if (typeof nodes.value === 'undefined') {
        throw new Error('Value field is missed in node creation')
      } else if (typeof nodes.value !== 'string') {
        nodes.value = String(nodes.value)
      }
      nodes = [new Declaration(nodes)]
    } else if (nodes.selector) {
      nodes = [new Rule(nodes)]
    } else if (nodes.name) {
      nodes = [new AtRule(nodes)]
    } else if (nodes.text) {
      nodes = [new Comment(nodes)]
    } else {
      throw new Error('Unknown node type in node creation')
    }

    let processed = nodes.map(i => {
      /* c8 ignore next */
      if (!i[my]) Container.rebuild(i)
      i = i.proxyOf
      if (i.parent) i.parent.removeChild(i)
      if (i[isClean]) markDirtyUp(i)
      if (typeof i.raws.before === 'undefined') {
        if (sample && typeof sample.raws.before !== 'undefined') {
          i.raws.before = sample.raws.before.replace(/\S/g, '')
        }
      }
      i.parent = this
      return i
    })

    return processed
  }

  getProxyProcessor() {
    return {
      set(node, prop, value) {
        if (node[prop] === value) return true
        node[prop] = value
        if (prop === 'name' || prop === 'params' || prop === 'selector') {
          node.markDirty()
        }
        return true
      },

      get(node, prop) {
        if (prop === 'proxyOf') {
          return node
        } else if (!node[prop]) {
          return node[prop]
        } else if (
          prop === 'each' ||
          (typeof prop === 'string' && prop.startsWith('walk'))
        ) {
          return (...args) => {
            return node[prop](
              ...args.map(i => {
                if (typeof i === 'function') {
                  return (child, index) => i(child.toProxy(), index)
                } else {
                  return i
                }
              })
            )
          }
        } else if (prop === 'every' || prop === 'some') {
          return cb => {
            return node[prop]((child, ...other) =>
              cb(child.toProxy(), ...other)
            )
          }
        } else if (prop === 'root') {
          return () => node.root().toProxy()
        } else if (prop === 'nodes') {
          return node.nodes.map(i => i.toProxy())
        } else if (prop === 'first' || prop === 'last') {
          return node[prop].toProxy()
        } else {
          return node[prop]
        }
      }
    }
  }

  getIterator() {
    if (!this.lastEach) this.lastEach = 0
    if (!this.indexes) this.indexes = {}

    this.lastEach += 1
    let iterator = this.lastEach
    this.indexes[iterator] = 0

    return iterator
  }
}

Container.registerParse = dependant => {
  parse = dependant
}

Container.registerRule = dependant => {
  Rule = dependant
}

Container.registerAtRule = dependant => {
  AtRule = dependant
}

module.exports = Container
Container.default = Container

/* c8 ignore start */
Container.rebuild = node => {
  if (node.type === 'atrule') {
    Object.setPrototypeOf(node, AtRule.prototype)
  } else if (node.type === 'rule') {
    Object.setPrototypeOf(node, Rule.prototype)
  } else if (node.type === 'decl') {
    Object.setPrototypeOf(node, Declaration.prototype)
  } else if (node.type === 'comment') {
    Object.setPrototypeOf(node, Comment.prototype)
  }

  node[my] = true

  if (node.nodes) {
    node.nodes.forEach(child => {
      Container.rebuild(child)
    })
  }
}
/* c8 ignore stop */


/***/ }),

/***/ "./node_modules/postcss/lib/css-syntax-error.js":
/*!******************************************************!*\
  !*** ./node_modules/postcss/lib/css-syntax-error.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let pico = __webpack_require__(/*! picocolors */ "./node_modules/picocolors/picocolors.browser.js")

let terminalHighlight = __webpack_require__(/*! ./terminal-highlight */ "?fe98")

class CssSyntaxError extends Error {
  constructor(message, line, column, source, file, plugin) {
    super(message)
    this.name = 'CssSyntaxError'
    this.reason = message

    if (file) {
      this.file = file
    }
    if (source) {
      this.source = source
    }
    if (plugin) {
      this.plugin = plugin
    }
    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
      if (typeof line === 'number') {
        this.line = line
        this.column = column
      } else {
        this.line = line.line
        this.column = line.column
        this.endLine = column.line
        this.endColumn = column.column
      }
    }

    this.setMessage()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CssSyntaxError)
    }
  }

  setMessage() {
    this.message = this.plugin ? this.plugin + ': ' : ''
    this.message += this.file ? this.file : '<css input>'
    if (typeof this.line !== 'undefined') {
      this.message += ':' + this.line + ':' + this.column
    }
    this.message += ': ' + this.reason
  }

  showSourceCode(color) {
    if (!this.source) return ''

    let css = this.source
    if (color == null) color = pico.isColorSupported
    if (terminalHighlight) {
      if (color) css = terminalHighlight(css)
    }

    let lines = css.split(/\r?\n/)
    let start = Math.max(this.line - 3, 0)
    let end = Math.min(this.line + 2, lines.length)

    let maxWidth = String(end).length

    let mark, aside
    if (color) {
      let { bold, red, gray } = pico.createColors(true)
      mark = text => bold(red(text))
      aside = text => gray(text)
    } else {
      mark = aside = str => str
    }

    return lines
      .slice(start, end)
      .map((line, index) => {
        let number = start + 1 + index
        let gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | '
        if (number === this.line) {
          let spacing =
            aside(gutter.replace(/\d/g, ' ')) +
            line.slice(0, this.column - 1).replace(/[^\t]/g, ' ')
          return mark('>') + aside(gutter) + line + '\n ' + spacing + mark('^')
        }
        return ' ' + aside(gutter) + line
      })
      .join('\n')
  }

  toString() {
    let code = this.showSourceCode()
    if (code) {
      code = '\n\n' + code + '\n'
    }
    return this.name + ': ' + this.message + code
  }
}

module.exports = CssSyntaxError
CssSyntaxError.default = CssSyntaxError


/***/ }),

/***/ "./node_modules/postcss/lib/declaration.js":
/*!*************************************************!*\
  !*** ./node_modules/postcss/lib/declaration.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Node = __webpack_require__(/*! ./node */ "./node_modules/postcss/lib/node.js")

class Declaration extends Node {
  constructor(defaults) {
    if (
      defaults &&
      typeof defaults.value !== 'undefined' &&
      typeof defaults.value !== 'string'
    ) {
      defaults = { ...defaults, value: String(defaults.value) }
    }
    super(defaults)
    this.type = 'decl'
  }

  get variable() {
    return this.prop.startsWith('--') || this.prop[0] === '$'
  }
}

module.exports = Declaration
Declaration.default = Declaration


/***/ }),

/***/ "./node_modules/postcss/lib/document.js":
/*!**********************************************!*\
  !*** ./node_modules/postcss/lib/document.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")

let LazyResult, Processor

class Document extends Container {
  constructor(defaults) {
    // type needs to be passed to super, otherwise child roots won't be normalized correctly
    super({ type: 'document', ...defaults })

    if (!this.nodes) {
      this.nodes = []
    }
  }

  toResult(opts = {}) {
    let lazy = new LazyResult(new Processor(), this, opts)

    return lazy.stringify()
  }
}

Document.registerLazyResult = dependant => {
  LazyResult = dependant
}

Document.registerProcessor = dependant => {
  Processor = dependant
}

module.exports = Document
Document.default = Document


/***/ }),

/***/ "./node_modules/postcss/lib/fromJSON.js":
/*!**********************************************!*\
  !*** ./node_modules/postcss/lib/fromJSON.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Declaration = __webpack_require__(/*! ./declaration */ "./node_modules/postcss/lib/declaration.js")
let PreviousMap = __webpack_require__(/*! ./previous-map */ "./node_modules/postcss/lib/previous-map.js")
let Comment = __webpack_require__(/*! ./comment */ "./node_modules/postcss/lib/comment.js")
let AtRule = __webpack_require__(/*! ./at-rule */ "./node_modules/postcss/lib/at-rule.js")
let Input = __webpack_require__(/*! ./input */ "./node_modules/postcss/lib/input.js")
let Root = __webpack_require__(/*! ./root */ "./node_modules/postcss/lib/root.js")
let Rule = __webpack_require__(/*! ./rule */ "./node_modules/postcss/lib/rule.js")

function fromJSON(json, inputs) {
  if (Array.isArray(json)) return json.map(n => fromJSON(n))

  let { inputs: ownInputs, ...defaults } = json
  if (ownInputs) {
    inputs = []
    for (let input of ownInputs) {
      let inputHydrated = { ...input, __proto__: Input.prototype }
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map,
          __proto__: PreviousMap.prototype
        }
      }
      inputs.push(inputHydrated)
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map(n => fromJSON(n, inputs))
  }
  if (defaults.source) {
    let { inputId, ...source } = defaults.source
    defaults.source = source
    if (inputId != null) {
      defaults.source.input = inputs[inputId]
    }
  }
  if (defaults.type === 'root') {
    return new Root(defaults)
  } else if (defaults.type === 'decl') {
    return new Declaration(defaults)
  } else if (defaults.type === 'rule') {
    return new Rule(defaults)
  } else if (defaults.type === 'comment') {
    return new Comment(defaults)
  } else if (defaults.type === 'atrule') {
    return new AtRule(defaults)
  } else {
    throw new Error('Unknown node type: ' + json.type)
  }
}

module.exports = fromJSON
fromJSON.default = fromJSON


/***/ }),

/***/ "./node_modules/postcss/lib/input.js":
/*!*******************************************!*\
  !*** ./node_modules/postcss/lib/input.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let { SourceMapConsumer, SourceMapGenerator } = __webpack_require__(/*! source-map-js */ "?6f78")
let { fileURLToPath, pathToFileURL } = __webpack_require__(/*! url */ "?9214")
let { resolve, isAbsolute } = __webpack_require__(/*! path */ "?25fb")
let { nanoid } = __webpack_require__(/*! nanoid/non-secure */ "./node_modules/nanoid/non-secure/index.cjs")

let terminalHighlight = __webpack_require__(/*! ./terminal-highlight */ "?fe98")
let CssSyntaxError = __webpack_require__(/*! ./css-syntax-error */ "./node_modules/postcss/lib/css-syntax-error.js")
let PreviousMap = __webpack_require__(/*! ./previous-map */ "./node_modules/postcss/lib/previous-map.js")

let fromOffsetCache = Symbol('fromOffsetCache')

let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator)
let pathAvailable = Boolean(resolve && isAbsolute)

class Input {
  constructor(css, opts = {}) {
    if (
      css === null ||
      typeof css === 'undefined' ||
      (typeof css === 'object' && !css.toString)
    ) {
      throw new Error(`PostCSS received ${css} instead of CSS string`)
    }

    this.css = css.toString()

    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
      this.hasBOM = true
      this.css = this.css.slice(1)
    } else {
      this.hasBOM = false
    }

    if (opts.from) {
      if (
        !pathAvailable ||
        /^\w+:\/\//.test(opts.from) ||
        isAbsolute(opts.from)
      ) {
        this.file = opts.from
      } else {
        this.file = resolve(opts.from)
      }
    }

    if (pathAvailable && sourceMapAvailable) {
      let map = new PreviousMap(this.css, opts)
      if (map.text) {
        this.map = map
        let file = map.consumer().file
        if (!this.file && file) this.file = this.mapResolve(file)
      }
    }

    if (!this.file) {
      this.id = '<input css ' + nanoid(6) + '>'
    }
    if (this.map) this.map.file = this.from
  }

  fromOffset(offset) {
    let lastLine, lineToIndex
    if (!this[fromOffsetCache]) {
      let lines = this.css.split('\n')
      lineToIndex = new Array(lines.length)
      let prevIndex = 0

      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex
        prevIndex += lines[i].length + 1
      }

      this[fromOffsetCache] = lineToIndex
    } else {
      lineToIndex = this[fromOffsetCache]
    }
    lastLine = lineToIndex[lineToIndex.length - 1]

    let min = 0
    if (offset >= lastLine) {
      min = lineToIndex.length - 1
    } else {
      let max = lineToIndex.length - 2
      let mid
      while (min < max) {
        mid = min + ((max - min) >> 1)
        if (offset < lineToIndex[mid]) {
          max = mid - 1
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1
        } else {
          min = mid
          break
        }
      }
    }
    return {
      line: min + 1,
      col: offset - lineToIndex[min] + 1
    }
  }

  error(message, line, column, opts = {}) {
    let result, endLine, endColumn

    if (line && typeof line === 'object') {
      let start = line
      let end = column
      if (typeof line.offset === 'number') {
        let pos = this.fromOffset(start.offset)
        line = pos.line
        column = pos.col
      } else {
        line = start.line
        column = start.column
      }
      if (typeof end.offset === 'number') {
        let pos = this.fromOffset(end.offset)
        endLine = pos.line
        endColumn = pos.col
      } else {
        endLine = end.line
        endColumn = end.column
      }
    } else if (!column) {
      let pos = this.fromOffset(line)
      line = pos.line
      column = pos.col
    }

    let origin = this.origin(line, column, endLine, endColumn)
    if (origin) {
      result = new CssSyntaxError(
        message,
        origin.endLine === undefined
          ? origin.line
          : { line: origin.line, column: origin.column },
        origin.endLine === undefined
          ? origin.column
          : { line: origin.endLine, column: origin.endColumn },
        origin.source,
        origin.file,
        opts.plugin
      )
    } else {
      result = new CssSyntaxError(
        message,
        endLine === undefined ? line : { line, column },
        endLine === undefined ? column : { line: endLine, column: endColumn },
        this.css,
        this.file,
        opts.plugin
      )
    }

    result.input = { line, column, endLine, endColumn, source: this.css }
    if (this.file) {
      if (pathToFileURL) {
        result.input.url = pathToFileURL(this.file).toString()
      }
      result.input.file = this.file
    }

    return result
  }

  origin(line, column, endLine, endColumn) {
    if (!this.map) return false
    let consumer = this.map.consumer()

    let from = consumer.originalPositionFor({ line, column })
    if (!from.source) return false

    let to
    if (typeof endLine === 'number') {
      to = consumer.originalPositionFor({ line: endLine, column: endColumn })
    }

    let fromUrl

    if (isAbsolute(from.source)) {
      fromUrl = pathToFileURL(from.source)
    } else {
      fromUrl = new URL(
        from.source,
        this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
      )
    }

    let result = {
      url: fromUrl.toString(),
      line: from.line,
      column: from.column,
      endLine: to && to.line,
      endColumn: to && to.column
    }

    if (fromUrl.protocol === 'file:') {
      if (fileURLToPath) {
        result.file = fileURLToPath(fromUrl)
      } else {
        /* c8 ignore next 2 */
        throw new Error(`file: protocol is not available in this PostCSS build`)
      }
    }

    let source = consumer.sourceContentFor(from.source)
    if (source) result.source = source

    return result
  }

  mapResolve(file) {
    if (/^\w+:\/\//.test(file)) {
      return file
    }
    return resolve(this.map.consumer().sourceRoot || this.map.root || '.', file)
  }

  get from() {
    return this.file || this.id
  }

  toJSON() {
    let json = {}
    for (let name of ['hasBOM', 'css', 'file', 'id']) {
      if (this[name] != null) {
        json[name] = this[name]
      }
    }
    if (this.map) {
      json.map = { ...this.map }
      if (json.map.consumerCache) {
        json.map.consumerCache = undefined
      }
    }
    return json
  }
}

module.exports = Input
Input.default = Input

if (terminalHighlight && terminalHighlight.registerInput) {
  terminalHighlight.registerInput(Input)
}


/***/ }),

/***/ "./node_modules/postcss/lib/lazy-result.js":
/*!*************************************************!*\
  !*** ./node_modules/postcss/lib/lazy-result.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let { isClean, my } = __webpack_require__(/*! ./symbols */ "./node_modules/postcss/lib/symbols.js")
let MapGenerator = __webpack_require__(/*! ./map-generator */ "./node_modules/postcss/lib/map-generator.js")
let stringify = __webpack_require__(/*! ./stringify */ "./node_modules/postcss/lib/stringify.js")
let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")
let Document = __webpack_require__(/*! ./document */ "./node_modules/postcss/lib/document.js")
let warnOnce = __webpack_require__(/*! ./warn-once */ "./node_modules/postcss/lib/warn-once.js")
let Result = __webpack_require__(/*! ./result */ "./node_modules/postcss/lib/result.js")
let parse = __webpack_require__(/*! ./parse */ "./node_modules/postcss/lib/parse.js")
let Root = __webpack_require__(/*! ./root */ "./node_modules/postcss/lib/root.js")

const TYPE_TO_CLASS_NAME = {
  document: 'Document',
  root: 'Root',
  atrule: 'AtRule',
  rule: 'Rule',
  decl: 'Declaration',
  comment: 'Comment'
}

const PLUGIN_PROPS = {
  postcssPlugin: true,
  prepare: true,
  Once: true,
  Document: true,
  Root: true,
  Declaration: true,
  Rule: true,
  AtRule: true,
  Comment: true,
  DeclarationExit: true,
  RuleExit: true,
  AtRuleExit: true,
  CommentExit: true,
  RootExit: true,
  DocumentExit: true,
  OnceExit: true
}

const NOT_VISITORS = {
  postcssPlugin: true,
  prepare: true,
  Once: true
}

const CHILDREN = 0

function isPromise(obj) {
  return typeof obj === 'object' && typeof obj.then === 'function'
}

function getEvents(node) {
  let key = false
  let type = TYPE_TO_CLASS_NAME[node.type]
  if (node.type === 'decl') {
    key = node.prop.toLowerCase()
  } else if (node.type === 'atrule') {
    key = node.name.toLowerCase()
  }

  if (key && node.append) {
    return [
      type,
      type + '-' + key,
      CHILDREN,
      type + 'Exit',
      type + 'Exit-' + key
    ]
  } else if (key) {
    return [type, type + '-' + key, type + 'Exit', type + 'Exit-' + key]
  } else if (node.append) {
    return [type, CHILDREN, type + 'Exit']
  } else {
    return [type, type + 'Exit']
  }
}

function toStack(node) {
  let events
  if (node.type === 'document') {
    events = ['Document', CHILDREN, 'DocumentExit']
  } else if (node.type === 'root') {
    events = ['Root', CHILDREN, 'RootExit']
  } else {
    events = getEvents(node)
  }

  return {
    node,
    events,
    eventIndex: 0,
    visitors: [],
    visitorIndex: 0,
    iterator: 0
  }
}

function cleanMarks(node) {
  node[isClean] = false
  if (node.nodes) node.nodes.forEach(i => cleanMarks(i))
  return node
}

let postcss = {}

class LazyResult {
  constructor(processor, css, opts) {
    this.stringified = false
    this.processed = false

    let root
    if (
      typeof css === 'object' &&
      css !== null &&
      (css.type === 'root' || css.type === 'document')
    ) {
      root = cleanMarks(css)
    } else if (css instanceof LazyResult || css instanceof Result) {
      root = cleanMarks(css.root)
      if (css.map) {
        if (typeof opts.map === 'undefined') opts.map = {}
        if (!opts.map.inline) opts.map.inline = false
        opts.map.prev = css.map
      }
    } else {
      let parser = parse
      if (opts.syntax) parser = opts.syntax.parse
      if (opts.parser) parser = opts.parser
      if (parser.parse) parser = parser.parse

      try {
        root = parser(css, opts)
      } catch (error) {
        this.processed = true
        this.error = error
      }

      if (root && !root[my]) {
        /* c8 ignore next 2 */
        Container.rebuild(root)
      }
    }

    this.result = new Result(processor, root, opts)
    this.helpers = { ...postcss, result: this.result, postcss }
    this.plugins = this.processor.plugins.map(plugin => {
      if (typeof plugin === 'object' && plugin.prepare) {
        return { ...plugin, ...plugin.prepare(this.result) }
      } else {
        return plugin
      }
    })
  }

  get [Symbol.toStringTag]() {
    return 'LazyResult'
  }

  get processor() {
    return this.result.processor
  }

  get opts() {
    return this.result.opts
  }

  get css() {
    return this.stringify().css
  }

  get content() {
    return this.stringify().content
  }

  get map() {
    return this.stringify().map
  }

  get root() {
    return this.sync().root
  }

  get messages() {
    return this.sync().messages
  }

  warnings() {
    return this.sync().warnings()
  }

  toString() {
    return this.css
  }

  then(onFulfilled, onRejected) {
    if (true) {
      if (!('from' in this.opts)) {
        warnOnce(
          'Without `from` option PostCSS could generate wrong source map ' +
            'and will not find Browserslist config. Set it to CSS file path ' +
            'or to `undefined` to prevent this warning.'
        )
      }
    }
    return this.async().then(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this.async().catch(onRejected)
  }

  finally(onFinally) {
    return this.async().then(onFinally, onFinally)
  }

  async() {
    if (this.error) return Promise.reject(this.error)
    if (this.processed) return Promise.resolve(this.result)
    if (!this.processing) {
      this.processing = this.runAsync()
    }
    return this.processing
  }

  sync() {
    if (this.error) throw this.error
    if (this.processed) return this.result
    this.processed = true

    if (this.processing) {
      throw this.getAsyncError()
    }

    for (let plugin of this.plugins) {
      let promise = this.runOnRoot(plugin)
      if (isPromise(promise)) {
        throw this.getAsyncError()
      }
    }

    this.prepareVisitors()
    if (this.hasListener) {
      let root = this.result.root
      while (!root[isClean]) {
        root[isClean] = true
        this.walkSync(root)
      }
      if (this.listeners.OnceExit) {
        if (root.type === 'document') {
          for (let subRoot of root.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot)
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root)
        }
      }
    }

    return this.result
  }

  stringify() {
    if (this.error) throw this.error
    if (this.stringified) return this.result
    this.stringified = true

    this.sync()

    let opts = this.result.opts
    let str = stringify
    if (opts.syntax) str = opts.syntax.stringify
    if (opts.stringifier) str = opts.stringifier
    if (str.stringify) str = str.stringify

    let map = new MapGenerator(str, this.result.root, this.result.opts)
    let data = map.generate()
    this.result.css = data[0]
    this.result.map = data[1]

    return this.result
  }

  walkSync(node) {
    node[isClean] = true
    let events = getEvents(node)
    for (let event of events) {
      if (event === CHILDREN) {
        if (node.nodes) {
          node.each(child => {
            if (!child[isClean]) this.walkSync(child)
          })
        }
      } else {
        let visitors = this.listeners[event]
        if (visitors) {
          if (this.visitSync(visitors, node.toProxy())) return
        }
      }
    }
  }

  visitSync(visitors, node) {
    for (let [plugin, visitor] of visitors) {
      this.result.lastPlugin = plugin
      let promise
      try {
        promise = visitor(node, this.helpers)
      } catch (e) {
        throw this.handleError(e, node.proxyOf)
      }
      if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
        return true
      }
      if (isPromise(promise)) {
        throw this.getAsyncError()
      }
    }
  }

  runOnRoot(plugin) {
    this.result.lastPlugin = plugin
    try {
      if (typeof plugin === 'object' && plugin.Once) {
        if (this.result.root.type === 'document') {
          let roots = this.result.root.nodes.map(root =>
            plugin.Once(root, this.helpers)
          )

          if (isPromise(roots[0])) {
            return Promise.all(roots)
          }

          return roots
        }

        return plugin.Once(this.result.root, this.helpers)
      } else if (typeof plugin === 'function') {
        return plugin(this.result.root, this.result)
      }
    } catch (error) {
      throw this.handleError(error)
    }
  }

  getAsyncError() {
    throw new Error('Use process(css).then(cb) to work with async plugins')
  }

  handleError(error, node) {
    let plugin = this.result.lastPlugin
    try {
      if (node) node.addToError(error)
      this.error = error
      if (error.name === 'CssSyntaxError' && !error.plugin) {
        error.plugin = plugin.postcssPlugin
        error.setMessage()
      } else if (plugin.postcssVersion) {
        if (true) {
          let pluginName = plugin.postcssPlugin
          let pluginVer = plugin.postcssVersion
          let runtimeVer = this.result.processor.version
          let a = pluginVer.split('.')
          let b = runtimeVer.split('.')

          if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
            // eslint-disable-next-line no-console
            console.error(
              'Unknown error from PostCSS plugin. Your current PostCSS ' +
                'version is ' +
                runtimeVer +
                ', but ' +
                pluginName +
                ' uses ' +
                pluginVer +
                '. Perhaps this is the source of the error below.'
            )
          }
        }
      }
    } catch (err) {
      /* c8 ignore next 3 */
      // eslint-disable-next-line no-console
      if (console && console.error) console.error(err)
    }
    return error
  }

  async runAsync() {
    this.plugin = 0
    for (let i = 0; i < this.plugins.length; i++) {
      let plugin = this.plugins[i]
      let promise = this.runOnRoot(plugin)
      if (isPromise(promise)) {
        try {
          await promise
        } catch (error) {
          throw this.handleError(error)
        }
      }
    }

    this.prepareVisitors()
    if (this.hasListener) {
      let root = this.result.root
      while (!root[isClean]) {
        root[isClean] = true
        let stack = [toStack(root)]
        while (stack.length > 0) {
          let promise = this.visitTick(stack)
          if (isPromise(promise)) {
            try {
              await promise
            } catch (e) {
              let node = stack[stack.length - 1].node
              throw this.handleError(e, node)
            }
          }
        }
      }

      if (this.listeners.OnceExit) {
        for (let [plugin, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin
          try {
            if (root.type === 'document') {
              let roots = root.nodes.map(subRoot =>
                visitor(subRoot, this.helpers)
              )

              await Promise.all(roots)
            } else {
              await visitor(root, this.helpers)
            }
          } catch (e) {
            throw this.handleError(e)
          }
        }
      }
    }

    this.processed = true
    return this.stringify()
  }

  prepareVisitors() {
    this.listeners = {}
    let add = (plugin, type, cb) => {
      if (!this.listeners[type]) this.listeners[type] = []
      this.listeners[type].push([plugin, cb])
    }
    for (let plugin of this.plugins) {
      if (typeof plugin === 'object') {
        for (let event in plugin) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin.postcssPlugin}. ` +
                `Try to update PostCSS (${this.processor.version} now).`
            )
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin[event] === 'object') {
              for (let filter in plugin[event]) {
                if (filter === '*') {
                  add(plugin, event, plugin[event][filter])
                } else {
                  add(
                    plugin,
                    event + '-' + filter.toLowerCase(),
                    plugin[event][filter]
                  )
                }
              }
            } else if (typeof plugin[event] === 'function') {
              add(plugin, event, plugin[event])
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0
  }

  visitTick(stack) {
    let visit = stack[stack.length - 1]
    let { node, visitors } = visit

    if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
      stack.pop()
      return
    }

    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
      let [plugin, visitor] = visitors[visit.visitorIndex]
      visit.visitorIndex += 1
      if (visit.visitorIndex === visitors.length) {
        visit.visitors = []
        visit.visitorIndex = 0
      }
      this.result.lastPlugin = plugin
      try {
        return visitor(node.toProxy(), this.helpers)
      } catch (e) {
        throw this.handleError(e, node)
      }
    }

    if (visit.iterator !== 0) {
      let iterator = visit.iterator
      let child
      while ((child = node.nodes[node.indexes[iterator]])) {
        node.indexes[iterator] += 1
        if (!child[isClean]) {
          child[isClean] = true
          stack.push(toStack(child))
          return
        }
      }
      visit.iterator = 0
      delete node.indexes[iterator]
    }

    let events = visit.events
    while (visit.eventIndex < events.length) {
      let event = events[visit.eventIndex]
      visit.eventIndex += 1
      if (event === CHILDREN) {
        if (node.nodes && node.nodes.length) {
          node[isClean] = true
          visit.iterator = node.getIterator()
        }
        return
      } else if (this.listeners[event]) {
        visit.visitors = this.listeners[event]
        return
      }
    }
    stack.pop()
  }
}

LazyResult.registerPostcss = dependant => {
  postcss = dependant
}

module.exports = LazyResult
LazyResult.default = LazyResult

Root.registerLazyResult(LazyResult)
Document.registerLazyResult(LazyResult)


/***/ }),

/***/ "./node_modules/postcss/lib/list.js":
/*!******************************************!*\
  !*** ./node_modules/postcss/lib/list.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


let list = {
  split(string, separators, last) {
    let array = []
    let current = ''
    let split = false

    let func = 0
    let quote = false
    let escape = false

    for (let letter of string) {
      if (escape) {
        escape = false
      } else if (letter === '\\') {
        escape = true
      } else if (quote) {
        if (letter === quote) {
          quote = false
        }
      } else if (letter === '"' || letter === "'") {
        quote = letter
      } else if (letter === '(') {
        func += 1
      } else if (letter === ')') {
        if (func > 0) func -= 1
      } else if (func === 0) {
        if (separators.includes(letter)) split = true
      }

      if (split) {
        if (current !== '') array.push(current.trim())
        current = ''
        split = false
      } else {
        current += letter
      }
    }

    if (last || current !== '') array.push(current.trim())
    return array
  },

  space(string) {
    let spaces = [' ', '\n', '\t']
    return list.split(string, spaces)
  },

  comma(string) {
    return list.split(string, [','], true)
  }
}

module.exports = list
list.default = list


/***/ }),

/***/ "./node_modules/postcss/lib/map-generator.js":
/*!***************************************************!*\
  !*** ./node_modules/postcss/lib/map-generator.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let { SourceMapConsumer, SourceMapGenerator } = __webpack_require__(/*! source-map-js */ "?6f78")
let { dirname, resolve, relative, sep } = __webpack_require__(/*! path */ "?25fb")
let { pathToFileURL } = __webpack_require__(/*! url */ "?9214")

let Input = __webpack_require__(/*! ./input */ "./node_modules/postcss/lib/input.js")

let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator)
let pathAvailable = Boolean(dirname && resolve && relative && sep)

class MapGenerator {
  constructor(stringify, root, opts, cssString) {
    this.stringify = stringify
    this.mapOpts = opts.map || {}
    this.root = root
    this.opts = opts
    this.css = cssString
  }

  isMap() {
    if (typeof this.opts.map !== 'undefined') {
      return !!this.opts.map
    }
    return this.previous().length > 0
  }

  previous() {
    if (!this.previousMaps) {
      this.previousMaps = []
      if (this.root) {
        this.root.walk(node => {
          if (node.source && node.source.input.map) {
            let map = node.source.input.map
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map)
            }
          }
        })
      } else {
        let input = new Input(this.css, this.opts)
        if (input.map) this.previousMaps.push(input.map)
      }
    }

    return this.previousMaps
  }

  isInline() {
    if (typeof this.mapOpts.inline !== 'undefined') {
      return this.mapOpts.inline
    }

    let annotation = this.mapOpts.annotation
    if (typeof annotation !== 'undefined' && annotation !== true) {
      return false
    }

    if (this.previous().length) {
      return this.previous().some(i => i.inline)
    }
    return true
  }

  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== 'undefined') {
      return this.mapOpts.sourcesContent
    }
    if (this.previous().length) {
      return this.previous().some(i => i.withContent())
    }
    return true
  }

  clearAnnotation() {
    if (this.mapOpts.annotation === false) return

    if (this.root) {
      let node
      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
        node = this.root.nodes[i]
        if (node.type !== 'comment') continue
        if (node.text.indexOf('# sourceMappingURL=') === 0) {
          this.root.removeChild(i)
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/(\n)?\/\*#[\S\s]*?\*\/$/gm, '')
    }
  }

  setSourcesContent() {
    let already = {}
    if (this.root) {
      this.root.walk(node => {
        if (node.source) {
          let from = node.source.input.from
          if (from && !already[from]) {
            already[from] = true
            this.map.setSourceContent(
              this.toUrl(this.path(from)),
              node.source.input.css
            )
          }
        }
      })
    } else if (this.css) {
      let from = this.opts.from
        ? this.toUrl(this.path(this.opts.from))
        : '<no source>'
      this.map.setSourceContent(from, this.css)
    }
  }

  applyPrevMaps() {
    for (let prev of this.previous()) {
      let from = this.toUrl(this.path(prev.file))
      let root = prev.root || dirname(prev.file)
      let map

      if (this.mapOpts.sourcesContent === false) {
        map = new SourceMapConsumer(prev.text)
        if (map.sourcesContent) {
          map.sourcesContent = map.sourcesContent.map(() => null)
        }
      } else {
        map = prev.consumer()
      }

      this.map.applySourceMap(map, from, this.toUrl(this.path(root)))
    }
  }

  isAnnotation() {
    if (this.isInline()) {
      return true
    }
    if (typeof this.mapOpts.annotation !== 'undefined') {
      return this.mapOpts.annotation
    }
    if (this.previous().length) {
      return this.previous().some(i => i.annotation)
    }
    return true
  }

  toBase64(str) {
    if (Buffer) {
      return Buffer.from(str).toString('base64')
    } else {
      return window.btoa(unescape(encodeURIComponent(str)))
    }
  }

  addAnnotation() {
    let content

    if (this.isInline()) {
      content =
        'data:application/json;base64,' + this.toBase64(this.map.toString())
    } else if (typeof this.mapOpts.annotation === 'string') {
      content = this.mapOpts.annotation
    } else if (typeof this.mapOpts.annotation === 'function') {
      content = this.mapOpts.annotation(this.opts.to, this.root)
    } else {
      content = this.outputFile() + '.map'
    }
    let eol = '\n'
    if (this.css.includes('\r\n')) eol = '\r\n'

    this.css += eol + '/*# sourceMappingURL=' + content + ' */'
  }

  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to)
    } else if (this.opts.from) {
      return this.path(this.opts.from)
    } else {
      return 'to.css'
    }
  }

  generateMap() {
    if (this.root) {
      this.generateString()
    } else if (this.previous().length === 1) {
      let prev = this.previous()[0].consumer()
      prev.file = this.outputFile()
      this.map = SourceMapGenerator.fromSourceMap(prev)
    } else {
      this.map = new SourceMapGenerator({ file: this.outputFile() })
      this.map.addMapping({
        source: this.opts.from
          ? this.toUrl(this.path(this.opts.from))
          : '<no source>',
        generated: { line: 1, column: 0 },
        original: { line: 1, column: 0 }
      })
    }

    if (this.isSourcesContent()) this.setSourcesContent()
    if (this.root && this.previous().length > 0) this.applyPrevMaps()
    if (this.isAnnotation()) this.addAnnotation()

    if (this.isInline()) {
      return [this.css]
    } else {
      return [this.css, this.map]
    }
  }

  path(file) {
    if (file.indexOf('<') === 0) return file
    if (/^\w+:\/\//.test(file)) return file
    if (this.mapOpts.absolute) return file

    let from = this.opts.to ? dirname(this.opts.to) : '.'

    if (typeof this.mapOpts.annotation === 'string') {
      from = dirname(resolve(from, this.mapOpts.annotation))
    }

    file = relative(from, file)
    return file
  }

  toUrl(path) {
    if (sep === '\\') {
      path = path.replace(/\\/g, '/')
    }
    return encodeURI(path).replace(/[#?]/g, encodeURIComponent)
  }

  sourcePath(node) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from)
    } else if (this.mapOpts.absolute) {
      if (pathToFileURL) {
        return pathToFileURL(node.source.input.from).toString()
      } else {
        throw new Error(
          '`map.absolute` option is not available in this PostCSS build'
        )
      }
    } else {
      return this.toUrl(this.path(node.source.input.from))
    }
  }

  generateString() {
    this.css = ''
    this.map = new SourceMapGenerator({ file: this.outputFile() })

    let line = 1
    let column = 1

    let noSource = '<no source>'
    let mapping = {
      source: '',
      generated: { line: 0, column: 0 },
      original: { line: 0, column: 0 }
    }

    let lines, last
    this.stringify(this.root, (str, node, type) => {
      this.css += str

      if (node && type !== 'end') {
        mapping.generated.line = line
        mapping.generated.column = column - 1
        if (node.source && node.source.start) {
          mapping.source = this.sourcePath(node)
          mapping.original.line = node.source.start.line
          mapping.original.column = node.source.start.column - 1
          this.map.addMapping(mapping)
        } else {
          mapping.source = noSource
          mapping.original.line = 1
          mapping.original.column = 0
          this.map.addMapping(mapping)
        }
      }

      lines = str.match(/\n/g)
      if (lines) {
        line += lines.length
        last = str.lastIndexOf('\n')
        column = str.length - last
      } else {
        column += str.length
      }

      if (node && type !== 'start') {
        let p = node.parent || { raws: {} }
        if (node.type !== 'decl' || node !== p.last || p.raws.semicolon) {
          if (node.source && node.source.end) {
            mapping.source = this.sourcePath(node)
            mapping.original.line = node.source.end.line
            mapping.original.column = node.source.end.column - 1
            mapping.generated.line = line
            mapping.generated.column = column - 2
            this.map.addMapping(mapping)
          } else {
            mapping.source = noSource
            mapping.original.line = 1
            mapping.original.column = 0
            mapping.generated.line = line
            mapping.generated.column = column - 1
            this.map.addMapping(mapping)
          }
        }
      }
    })
  }

  generate() {
    this.clearAnnotation()
    if (pathAvailable && sourceMapAvailable && this.isMap()) {
      return this.generateMap()
    } else {
      let result = ''
      this.stringify(this.root, i => {
        result += i
      })
      return [result]
    }
  }
}

module.exports = MapGenerator


/***/ }),

/***/ "./node_modules/postcss/lib/no-work-result.js":
/*!****************************************************!*\
  !*** ./node_modules/postcss/lib/no-work-result.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let MapGenerator = __webpack_require__(/*! ./map-generator */ "./node_modules/postcss/lib/map-generator.js")
let stringify = __webpack_require__(/*! ./stringify */ "./node_modules/postcss/lib/stringify.js")
let warnOnce = __webpack_require__(/*! ./warn-once */ "./node_modules/postcss/lib/warn-once.js")
let parse = __webpack_require__(/*! ./parse */ "./node_modules/postcss/lib/parse.js")
const Result = __webpack_require__(/*! ./result */ "./node_modules/postcss/lib/result.js")

class NoWorkResult {
  constructor(processor, css, opts) {
    css = css.toString()
    this.stringified = false

    this._processor = processor
    this._css = css
    this._opts = opts
    this._map = undefined
    let root

    let str = stringify
    this.result = new Result(this._processor, root, this._opts)
    this.result.css = css

    let self = this
    Object.defineProperty(this.result, 'root', {
      get() {
        return self.root
      }
    })

    let map = new MapGenerator(str, root, this._opts, css)
    if (map.isMap()) {
      let [generatedCSS, generatedMap] = map.generate()
      if (generatedCSS) {
        this.result.css = generatedCSS
      }
      if (generatedMap) {
        this.result.map = generatedMap
      }
    }
  }

  get [Symbol.toStringTag]() {
    return 'NoWorkResult'
  }

  get processor() {
    return this.result.processor
  }

  get opts() {
    return this.result.opts
  }

  get css() {
    return this.result.css
  }

  get content() {
    return this.result.css
  }

  get map() {
    return this.result.map
  }

  get root() {
    if (this._root) {
      return this._root
    }

    let root
    let parser = parse

    try {
      root = parser(this._css, this._opts)
    } catch (error) {
      this.error = error
    }

    this._root = root

    return root
  }

  get messages() {
    return []
  }

  warnings() {
    return []
  }

  toString() {
    return this._css
  }

  then(onFulfilled, onRejected) {
    if (true) {
      if (!('from' in this._opts)) {
        warnOnce(
          'Without `from` option PostCSS could generate wrong source map ' +
            'and will not find Browserslist config. Set it to CSS file path ' +
            'or to `undefined` to prevent this warning.'
        )
      }
    }

    return this.async().then(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this.async().catch(onRejected)
  }

  finally(onFinally) {
    return this.async().then(onFinally, onFinally)
  }

  async() {
    if (this.error) return Promise.reject(this.error)
    return Promise.resolve(this.result)
  }

  sync() {
    if (this.error) throw this.error
    return this.result
  }
}

module.exports = NoWorkResult
NoWorkResult.default = NoWorkResult


/***/ }),

/***/ "./node_modules/postcss/lib/node.js":
/*!******************************************!*\
  !*** ./node_modules/postcss/lib/node.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let { isClean, my } = __webpack_require__(/*! ./symbols */ "./node_modules/postcss/lib/symbols.js")
let CssSyntaxError = __webpack_require__(/*! ./css-syntax-error */ "./node_modules/postcss/lib/css-syntax-error.js")
let Stringifier = __webpack_require__(/*! ./stringifier */ "./node_modules/postcss/lib/stringifier.js")
let stringify = __webpack_require__(/*! ./stringify */ "./node_modules/postcss/lib/stringify.js")

function cloneNode(obj, parent) {
  let cloned = new obj.constructor()

  for (let i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      /* c8 ignore next 2 */
      continue
    }
    if (i === 'proxyCache') continue
    let value = obj[i]
    let type = typeof value

    if (i === 'parent' && type === 'object') {
      if (parent) cloned[i] = parent
    } else if (i === 'source') {
      cloned[i] = value
    } else if (Array.isArray(value)) {
      cloned[i] = value.map(j => cloneNode(j, cloned))
    } else {
      if (type === 'object' && value !== null) value = cloneNode(value)
      cloned[i] = value
    }
  }

  return cloned
}

class Node {
  constructor(defaults = {}) {
    this.raws = {}
    this[isClean] = false
    this[my] = true

    for (let name in defaults) {
      if (name === 'nodes') {
        this.nodes = []
        for (let node of defaults[name]) {
          if (typeof node.clone === 'function') {
            this.append(node.clone())
          } else {
            this.append(node)
          }
        }
      } else {
        this[name] = defaults[name]
      }
    }
  }

  error(message, opts = {}) {
    if (this.source) {
      let { start, end } = this.rangeBy(opts)
      return this.source.input.error(
        message,
        { line: start.line, column: start.column },
        { line: end.line, column: end.column },
        opts
      )
    }
    return new CssSyntaxError(message)
  }

  warn(result, text, opts) {
    let data = { node: this }
    for (let i in opts) data[i] = opts[i]
    return result.warn(text, data)
  }

  remove() {
    if (this.parent) {
      this.parent.removeChild(this)
    }
    this.parent = undefined
    return this
  }

  toString(stringifier = stringify) {
    if (stringifier.stringify) stringifier = stringifier.stringify
    let result = ''
    stringifier(this, i => {
      result += i
    })
    return result
  }

  assign(overrides = {}) {
    for (let name in overrides) {
      this[name] = overrides[name]
    }
    return this
  }

  clone(overrides = {}) {
    let cloned = cloneNode(this)
    for (let name in overrides) {
      cloned[name] = overrides[name]
    }
    return cloned
  }

  cloneBefore(overrides = {}) {
    let cloned = this.clone(overrides)
    this.parent.insertBefore(this, cloned)
    return cloned
  }

  cloneAfter(overrides = {}) {
    let cloned = this.clone(overrides)
    this.parent.insertAfter(this, cloned)
    return cloned
  }

  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this
      let foundSelf = false
      for (let node of nodes) {
        if (node === this) {
          foundSelf = true
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node)
          bookmark = node
        } else {
          this.parent.insertBefore(bookmark, node)
        }
      }

      if (!foundSelf) {
        this.remove()
      }
    }

    return this
  }

  next() {
    if (!this.parent) return undefined
    let index = this.parent.index(this)
    return this.parent.nodes[index + 1]
  }

  prev() {
    if (!this.parent) return undefined
    let index = this.parent.index(this)
    return this.parent.nodes[index - 1]
  }

  before(add) {
    this.parent.insertBefore(this, add)
    return this
  }

  after(add) {
    this.parent.insertAfter(this, add)
    return this
  }

  root() {
    let result = this
    while (result.parent && result.parent.type !== 'document') {
      result = result.parent
    }
    return result
  }

  raw(prop, defaultType) {
    let str = new Stringifier()
    return str.raw(this, prop, defaultType)
  }

  cleanRaws(keepBetween) {
    delete this.raws.before
    delete this.raws.after
    if (!keepBetween) delete this.raws.between
  }

  toJSON(_, inputs) {
    let fixed = {}
    let emitInputs = inputs == null
    inputs = inputs || new Map()
    let inputsNextIndex = 0

    for (let name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        /* c8 ignore next 2 */
        continue
      }
      if (name === 'parent' || name === 'proxyCache') continue
      let value = this[name]

      if (Array.isArray(value)) {
        fixed[name] = value.map(i => {
          if (typeof i === 'object' && i.toJSON) {
            return i.toJSON(null, inputs)
          } else {
            return i
          }
        })
      } else if (typeof value === 'object' && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs)
      } else if (name === 'source') {
        let inputId = inputs.get(value.input)
        if (inputId == null) {
          inputId = inputsNextIndex
          inputs.set(value.input, inputsNextIndex)
          inputsNextIndex++
        }
        fixed[name] = {
          inputId,
          start: value.start,
          end: value.end
        }
      } else {
        fixed[name] = value
      }
    }

    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map(input => input.toJSON())
    }

    return fixed
  }

  positionInside(index) {
    let string = this.toString()
    let column = this.source.start.column
    let line = this.source.start.line

    for (let i = 0; i < index; i++) {
      if (string[i] === '\n') {
        column = 1
        line += 1
      } else {
        column += 1
      }
    }

    return { line, column }
  }

  positionBy(opts) {
    let pos = this.source.start
    if (opts.index) {
      pos = this.positionInside(opts.index)
    } else if (opts.word) {
      let index = this.toString().indexOf(opts.word)
      if (index !== -1) pos = this.positionInside(index)
    }
    return pos
  }

  rangeBy(opts) {
    let start = {
      line: this.source.start.line,
      column: this.source.start.column
    }
    let end = this.source.end
      ? {
          line: this.source.end.line,
          column: this.source.end.column + 1
        }
      : {
          line: start.line,
          column: start.column + 1
        }

    if (opts.word) {
      let index = this.toString().indexOf(opts.word)
      if (index !== -1) {
        start = this.positionInside(index)
        end = this.positionInside(index + opts.word.length)
      }
    } else {
      if (opts.start) {
        start = {
          line: opts.start.line,
          column: opts.start.column
        }
      } else if (opts.index) {
        start = this.positionInside(opts.index)
      }

      if (opts.end) {
        end = {
          line: opts.end.line,
          column: opts.end.column
        }
      } else if (opts.endIndex) {
        end = this.positionInside(opts.endIndex)
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1)
      }
    }

    if (
      end.line < start.line ||
      (end.line === start.line && end.column <= start.column)
    ) {
      end = { line: start.line, column: start.column + 1 }
    }

    return { start, end }
  }

  getProxyProcessor() {
    return {
      set(node, prop, value) {
        if (node[prop] === value) return true
        node[prop] = value
        if (
          prop === 'prop' ||
          prop === 'value' ||
          prop === 'name' ||
          prop === 'params' ||
          prop === 'important' ||
          /* c8 ignore next */
          prop === 'text'
        ) {
          node.markDirty()
        }
        return true
      },

      get(node, prop) {
        if (prop === 'proxyOf') {
          return node
        } else if (prop === 'root') {
          return () => node.root().toProxy()
        } else {
          return node[prop]
        }
      }
    }
  }

  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor())
    }
    return this.proxyCache
  }

  addToError(error) {
    error.postcssNode = this
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      let s = this.source
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
      )
    }
    return error
  }

  markDirty() {
    if (this[isClean]) {
      this[isClean] = false
      let next = this
      while ((next = next.parent)) {
        next[isClean] = false
      }
    }
  }

  get proxyOf() {
    return this
  }
}

module.exports = Node
Node.default = Node


/***/ }),

/***/ "./node_modules/postcss/lib/parse.js":
/*!*******************************************!*\
  !*** ./node_modules/postcss/lib/parse.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")
let Parser = __webpack_require__(/*! ./parser */ "./node_modules/postcss/lib/parser.js")
let Input = __webpack_require__(/*! ./input */ "./node_modules/postcss/lib/input.js")

function parse(css, opts) {
  let input = new Input(css, opts)
  let parser = new Parser(input)
  try {
    parser.parse()
  } catch (e) {
    if (true) {
      if (e.name === 'CssSyntaxError' && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse SCSS with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-scss parser'
        } else if (/\.sass/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse Sass with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-sass parser'
        } else if (/\.less$/i.test(opts.from)) {
          e.message +=
            '\nYou tried to parse Less with ' +
            'the standard CSS parser; ' +
            'try again with the postcss-less parser'
        }
      }
    }
    throw e
  }

  return parser.root
}

module.exports = parse
parse.default = parse

Container.registerParse(parse)


/***/ }),

/***/ "./node_modules/postcss/lib/parser.js":
/*!********************************************!*\
  !*** ./node_modules/postcss/lib/parser.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Declaration = __webpack_require__(/*! ./declaration */ "./node_modules/postcss/lib/declaration.js")
let tokenizer = __webpack_require__(/*! ./tokenize */ "./node_modules/postcss/lib/tokenize.js")
let Comment = __webpack_require__(/*! ./comment */ "./node_modules/postcss/lib/comment.js")
let AtRule = __webpack_require__(/*! ./at-rule */ "./node_modules/postcss/lib/at-rule.js")
let Root = __webpack_require__(/*! ./root */ "./node_modules/postcss/lib/root.js")
let Rule = __webpack_require__(/*! ./rule */ "./node_modules/postcss/lib/rule.js")

class Parser {
  constructor(input) {
    this.input = input

    this.root = new Root()
    this.current = this.root
    this.spaces = ''
    this.semicolon = false
    this.customProperty = false

    this.createTokenizer()
    this.root.source = { input, start: { offset: 0, line: 1, column: 1 } }
  }

  createTokenizer() {
    this.tokenizer = tokenizer(this.input)
  }

  parse() {
    let token
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken()

      switch (token[0]) {
        case 'space':
          this.spaces += token[1]
          break

        case ';':
          this.freeSemicolon(token)
          break

        case '}':
          this.end(token)
          break

        case 'comment':
          this.comment(token)
          break

        case 'at-word':
          this.atrule(token)
          break

        case '{':
          this.emptyRule(token)
          break

        default:
          this.other(token)
          break
      }
    }
    this.endFile()
  }

  comment(token) {
    let node = new Comment()
    this.init(node, token[2])
    node.source.end = this.getPosition(token[3] || token[2])

    let text = token[1].slice(2, -2)
    if (/^\s*$/.test(text)) {
      node.text = ''
      node.raws.left = text
      node.raws.right = ''
    } else {
      let match = text.match(/^(\s*)([^]*\S)(\s*)$/)
      node.text = match[2]
      node.raws.left = match[1]
      node.raws.right = match[3]
    }
  }

  emptyRule(token) {
    let node = new Rule()
    this.init(node, token[2])
    node.selector = ''
    node.raws.between = ''
    this.current = node
  }

  other(start) {
    let end = false
    let type = null
    let colon = false
    let bracket = null
    let brackets = []
    let customProperty = start[1].startsWith('--')

    let tokens = []
    let token = start
    while (token) {
      type = token[0]
      tokens.push(token)

      if (type === '(' || type === '[') {
        if (!bracket) bracket = token
        brackets.push(type === '(' ? ')' : ']')
      } else if (customProperty && colon && type === '{') {
        if (!bracket) bracket = token
        brackets.push('}')
      } else if (brackets.length === 0) {
        if (type === ';') {
          if (colon) {
            this.decl(tokens, customProperty)
            return
          } else {
            break
          }
        } else if (type === '{') {
          this.rule(tokens)
          return
        } else if (type === '}') {
          this.tokenizer.back(tokens.pop())
          end = true
          break
        } else if (type === ':') {
          colon = true
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop()
        if (brackets.length === 0) bracket = null
      }

      token = this.tokenizer.nextToken()
    }

    if (this.tokenizer.endOfFile()) end = true
    if (brackets.length > 0) this.unclosedBracket(bracket)

    if (end && colon) {
      while (tokens.length) {
        token = tokens[tokens.length - 1][0]
        if (token !== 'space' && token !== 'comment') break
        this.tokenizer.back(tokens.pop())
      }
      this.decl(tokens, customProperty)
    } else {
      this.unknownWord(tokens)
    }
  }

  rule(tokens) {
    tokens.pop()

    let node = new Rule()
    this.init(node, tokens[0][2])

    node.raws.between = this.spacesAndCommentsFromEnd(tokens)
    this.raw(node, 'selector', tokens)
    this.current = node
  }

  decl(tokens, customProperty) {
    let node = new Declaration()
    this.init(node, tokens[0][2])

    let last = tokens[tokens.length - 1]
    if (last[0] === ';') {
      this.semicolon = true
      tokens.pop()
    }
    node.source.end = this.getPosition(last[3] || last[2])

    while (tokens[0][0] !== 'word') {
      if (tokens.length === 1) this.unknownWord(tokens)
      node.raws.before += tokens.shift()[1]
    }
    node.source.start = this.getPosition(tokens[0][2])

    node.prop = ''
    while (tokens.length) {
      let type = tokens[0][0]
      if (type === ':' || type === 'space' || type === 'comment') {
        break
      }
      node.prop += tokens.shift()[1]
    }

    node.raws.between = ''

    let token
    while (tokens.length) {
      token = tokens.shift()

      if (token[0] === ':') {
        node.raws.between += token[1]
        break
      } else {
        if (token[0] === 'word' && /\w/.test(token[1])) {
          this.unknownWord([token])
        }
        node.raws.between += token[1]
      }
    }

    if (node.prop[0] === '_' || node.prop[0] === '*') {
      node.raws.before += node.prop[0]
      node.prop = node.prop.slice(1)
    }
    let firstSpaces = this.spacesAndCommentsFromStart(tokens)
    this.precheckMissedSemicolon(tokens)

    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i]
      if (token[1].toLowerCase() === '!important') {
        node.important = true
        let string = this.stringFrom(tokens, i)
        string = this.spacesFromEnd(tokens) + string
        if (string !== ' !important') node.raws.important = string
        break
      } else if (token[1].toLowerCase() === 'important') {
        let cache = tokens.slice(0)
        let str = ''
        for (let j = i; j > 0; j--) {
          let type = cache[j][0]
          if (str.trim().indexOf('!') === 0 && type !== 'space') {
            break
          }
          str = cache.pop()[1] + str
        }
        if (str.trim().indexOf('!') === 0) {
          node.important = true
          node.raws.important = str
          tokens = cache
        }
      }

      if (token[0] !== 'space' && token[0] !== 'comment') {
        break
      }
    }

    let hasWord = tokens.some(i => i[0] !== 'space' && i[0] !== 'comment')
    this.raw(node, 'value', tokens)
    if (hasWord) {
      node.raws.between += firstSpaces
    } else {
      node.value = firstSpaces + node.value
    }

    if (node.value.includes(':') && !customProperty) {
      this.checkMissedSemicolon(tokens)
    }
  }

  atrule(token) {
    let node = new AtRule()
    node.name = token[1].slice(1)
    if (node.name === '') {
      this.unnamedAtrule(node, token)
    }
    this.init(node, token[2])

    let type
    let prev
    let shift
    let last = false
    let open = false
    let params = []
    let brackets = []

    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken()
      type = token[0]

      if (type === '(' || type === '[') {
        brackets.push(type === '(' ? ')' : ']')
      } else if (type === '{' && brackets.length > 0) {
        brackets.push('}')
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop()
      }

      if (brackets.length === 0) {
        if (type === ';') {
          node.source.end = this.getPosition(token[2])
          this.semicolon = true
          break
        } else if (type === '{') {
          open = true
          break
        } else if (type === '}') {
          if (params.length > 0) {
            shift = params.length - 1
            prev = params[shift]
            while (prev && prev[0] === 'space') {
              prev = params[--shift]
            }
            if (prev) {
              node.source.end = this.getPosition(prev[3] || prev[2])
            }
          }
          this.end(token)
          break
        } else {
          params.push(token)
        }
      } else {
        params.push(token)
      }

      if (this.tokenizer.endOfFile()) {
        last = true
        break
      }
    }

    node.raws.between = this.spacesAndCommentsFromEnd(params)
    if (params.length) {
      node.raws.afterName = this.spacesAndCommentsFromStart(params)
      this.raw(node, 'params', params)
      if (last) {
        token = params[params.length - 1]
        node.source.end = this.getPosition(token[3] || token[2])
        this.spaces = node.raws.between
        node.raws.between = ''
      }
    } else {
      node.raws.afterName = ''
      node.params = ''
    }

    if (open) {
      node.nodes = []
      this.current = node
    }
  }

  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon
    }
    this.semicolon = false

    this.current.raws.after = (this.current.raws.after || '') + this.spaces
    this.spaces = ''

    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2])
      this.current = this.current.parent
    } else {
      this.unexpectedClose(token)
    }
  }

  endFile() {
    if (this.current.parent) this.unclosedBlock()
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon
    }
    this.current.raws.after = (this.current.raws.after || '') + this.spaces
  }

  freeSemicolon(token) {
    this.spaces += token[1]
    if (this.current.nodes) {
      let prev = this.current.nodes[this.current.nodes.length - 1]
      if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces
        this.spaces = ''
      }
    }
  }

  // Helpers

  getPosition(offset) {
    let pos = this.input.fromOffset(offset)
    return {
      offset,
      line: pos.line,
      column: pos.col
    }
  }

  init(node, offset) {
    this.current.push(node)
    node.source = {
      start: this.getPosition(offset),
      input: this.input
    }
    node.raws.before = this.spaces
    this.spaces = ''
    if (node.type !== 'comment') this.semicolon = false
  }

  raw(node, prop, tokens) {
    let token, type
    let length = tokens.length
    let value = ''
    let clean = true
    let next, prev
    let pattern = /^([#.|])?(\w)+/i

    for (let i = 0; i < length; i += 1) {
      token = tokens[i]
      type = token[0]

      if (type === 'comment' && node.type === 'rule') {
        prev = tokens[i - 1]
        next = tokens[i + 1]

        if (
          prev[0] !== 'space' &&
          next[0] !== 'space' &&
          pattern.test(prev[1]) &&
          pattern.test(next[1])
        ) {
          value += token[1]
        } else {
          clean = false
        }

        continue
      }

      if (type === 'comment' || (type === 'space' && i === length - 1)) {
        clean = false
      } else {
        value += token[1]
      }
    }
    if (!clean) {
      let raw = tokens.reduce((all, i) => all + i[1], '')
      node.raws[prop] = { value, raw }
    }
    node[prop] = value
  }

  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType
    let spaces = ''
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0]
      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break
      spaces = tokens.pop()[1] + spaces
    }
    return spaces
  }

  spacesAndCommentsFromStart(tokens) {
    let next
    let spaces = ''
    while (tokens.length) {
      next = tokens[0][0]
      if (next !== 'space' && next !== 'comment') break
      spaces += tokens.shift()[1]
    }
    return spaces
  }

  spacesFromEnd(tokens) {
    let lastTokenType
    let spaces = ''
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0]
      if (lastTokenType !== 'space') break
      spaces = tokens.pop()[1] + spaces
    }
    return spaces
  }

  stringFrom(tokens, from) {
    let result = ''
    for (let i = from; i < tokens.length; i++) {
      result += tokens[i][1]
    }
    tokens.splice(from, tokens.length - from)
    return result
  }

  colon(tokens) {
    let brackets = 0
    let token, type, prev
    for (let [i, element] of tokens.entries()) {
      token = element
      type = token[0]

      if (type === '(') {
        brackets += 1
      }
      if (type === ')') {
        brackets -= 1
      }
      if (brackets === 0 && type === ':') {
        if (!prev) {
          this.doubleColon(token)
        } else if (prev[0] === 'word' && prev[1] === 'progid') {
          continue
        } else {
          return i
        }
      }

      prev = token
    }
    return false
  }

  // Errors

  unclosedBracket(bracket) {
    throw this.input.error(
      'Unclosed bracket',
      { offset: bracket[2] },
      { offset: bracket[2] + 1 }
    )
  }

  unknownWord(tokens) {
    throw this.input.error(
      'Unknown word',
      { offset: tokens[0][2] },
      { offset: tokens[0][2] + tokens[0][1].length }
    )
  }

  unexpectedClose(token) {
    throw this.input.error(
      'Unexpected }',
      { offset: token[2] },
      { offset: token[2] + 1 }
    )
  }

  unclosedBlock() {
    let pos = this.current.source.start
    throw this.input.error('Unclosed block', pos.line, pos.column)
  }

  doubleColon(token) {
    throw this.input.error(
      'Double colon',
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    )
  }

  unnamedAtrule(node, token) {
    throw this.input.error(
      'At-rule without name',
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    )
  }

  precheckMissedSemicolon(/* tokens */) {
    // Hook for Safe Parser
  }

  checkMissedSemicolon(tokens) {
    let colon = this.colon(tokens)
    if (colon === false) return

    let founded = 0
    let token
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j]
      if (token[0] !== 'space') {
        founded += 1
        if (founded === 2) break
      }
    }
    // If the token is a word, e.g. `!important`, `red` or any other valid property's value.
    // Then we need to return the colon after that word token. [3] is the "end" colon of that word.
    // And because we need it after that one we do +1 to get the next one.
    throw this.input.error(
      'Missed semicolon',
      token[0] === 'word' ? token[3] + 1 : token[2]
    )
  }
}

module.exports = Parser


/***/ }),

/***/ "./node_modules/postcss/lib/postcss.js":
/*!*********************************************!*\
  !*** ./node_modules/postcss/lib/postcss.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let CssSyntaxError = __webpack_require__(/*! ./css-syntax-error */ "./node_modules/postcss/lib/css-syntax-error.js")
let Declaration = __webpack_require__(/*! ./declaration */ "./node_modules/postcss/lib/declaration.js")
let LazyResult = __webpack_require__(/*! ./lazy-result */ "./node_modules/postcss/lib/lazy-result.js")
let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")
let Processor = __webpack_require__(/*! ./processor */ "./node_modules/postcss/lib/processor.js")
let stringify = __webpack_require__(/*! ./stringify */ "./node_modules/postcss/lib/stringify.js")
let fromJSON = __webpack_require__(/*! ./fromJSON */ "./node_modules/postcss/lib/fromJSON.js")
let Document = __webpack_require__(/*! ./document */ "./node_modules/postcss/lib/document.js")
let Warning = __webpack_require__(/*! ./warning */ "./node_modules/postcss/lib/warning.js")
let Comment = __webpack_require__(/*! ./comment */ "./node_modules/postcss/lib/comment.js")
let AtRule = __webpack_require__(/*! ./at-rule */ "./node_modules/postcss/lib/at-rule.js")
let Result = __webpack_require__(/*! ./result.js */ "./node_modules/postcss/lib/result.js")
let Input = __webpack_require__(/*! ./input */ "./node_modules/postcss/lib/input.js")
let parse = __webpack_require__(/*! ./parse */ "./node_modules/postcss/lib/parse.js")
let list = __webpack_require__(/*! ./list */ "./node_modules/postcss/lib/list.js")
let Rule = __webpack_require__(/*! ./rule */ "./node_modules/postcss/lib/rule.js")
let Root = __webpack_require__(/*! ./root */ "./node_modules/postcss/lib/root.js")
let Node = __webpack_require__(/*! ./node */ "./node_modules/postcss/lib/node.js")

function postcss(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0]
  }
  return new Processor(plugins)
}

postcss.plugin = function plugin(name, initializer) {
  // eslint-disable-next-line no-console
  if (console && console.warn) {
    // eslint-disable-next-line no-console
    console.warn(
      name +
        ': postcss.plugin was deprecated. Migration guide:\n' +
        'https://evilmartians.com/chronicles/postcss-8-plugin-migration'
    )
    if (process.env.LANG && process.env.LANG.startsWith('cn')) {
      /* c8 ignore next 7 */
      // eslint-disable-next-line no-console
      console.warn(
        name +
          ': 里面 postcss.plugin 被弃用. 迁移指南:\n' +
          'https://www.w3ctech.com/topic/2226'
      )
    }
  }
  function creator(...args) {
    let transformer = initializer(...args)
    transformer.postcssPlugin = name
    transformer.postcssVersion = new Processor().version
    return transformer
  }

  let cache
  Object.defineProperty(creator, 'postcss', {
    get() {
      if (!cache) cache = creator()
      return cache
    }
  })

  creator.process = function (css, processOpts, pluginOpts) {
    return postcss([creator(pluginOpts)]).process(css, processOpts)
  }

  return creator
}

postcss.stringify = stringify
postcss.parse = parse
postcss.fromJSON = fromJSON
postcss.list = list

postcss.comment = defaults => new Comment(defaults)
postcss.atRule = defaults => new AtRule(defaults)
postcss.decl = defaults => new Declaration(defaults)
postcss.rule = defaults => new Rule(defaults)
postcss.root = defaults => new Root(defaults)
postcss.document = defaults => new Document(defaults)

postcss.CssSyntaxError = CssSyntaxError
postcss.Declaration = Declaration
postcss.Container = Container
postcss.Processor = Processor
postcss.Document = Document
postcss.Comment = Comment
postcss.Warning = Warning
postcss.AtRule = AtRule
postcss.Result = Result
postcss.Input = Input
postcss.Rule = Rule
postcss.Root = Root
postcss.Node = Node

LazyResult.registerPostcss(postcss)

module.exports = postcss
postcss.default = postcss


/***/ }),

/***/ "./node_modules/postcss/lib/previous-map.js":
/*!**************************************************!*\
  !*** ./node_modules/postcss/lib/previous-map.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let { SourceMapConsumer, SourceMapGenerator } = __webpack_require__(/*! source-map-js */ "?6f78")
let { existsSync, readFileSync } = __webpack_require__(/*! fs */ "?2f81")
let { dirname, join } = __webpack_require__(/*! path */ "?25fb")

function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, 'base64').toString()
  } else {
    /* c8 ignore next 2 */
    return window.atob(str)
  }
}

class PreviousMap {
  constructor(css, opts) {
    if (opts.map === false) return
    this.loadAnnotation(css)
    this.inline = this.startWith(this.annotation, 'data:')

    let prev = opts.map ? opts.map.prev : undefined
    let text = this.loadMap(opts.from, prev)
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from
    }
    if (this.mapFile) this.root = dirname(this.mapFile)
    if (text) this.text = text
  }

  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer(this.text)
    }
    return this.consumerCache
  }

  withContent() {
    return !!(
      this.consumer().sourcesContent &&
      this.consumer().sourcesContent.length > 0
    )
  }

  startWith(string, start) {
    if (!string) return false
    return string.substr(0, start.length) === start
  }

  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, '').trim()
  }

  loadAnnotation(css) {
    let comments = css.match(/\/\*\s*# sourceMappingURL=/gm)
    if (!comments) return

    // sourceMappingURLs from comments, strings, etc.
    let start = css.lastIndexOf(comments.pop())
    let end = css.indexOf('*/', start)

    if (start > -1 && end > -1) {
      // Locate the last sourceMappingURL to avoid pickin
      this.annotation = this.getAnnotationURL(css.substring(start, end))
    }
  }

  decodeInline(text) {
    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/
    let baseUri = /^data:application\/json;base64,/
    let charsetUri = /^data:application\/json;charset=utf-?8,/
    let uri = /^data:application\/json,/

    if (charsetUri.test(text) || uri.test(text)) {
      return decodeURIComponent(text.substr(RegExp.lastMatch.length))
    }

    if (baseCharsetUri.test(text) || baseUri.test(text)) {
      return fromBase64(text.substr(RegExp.lastMatch.length))
    }

    let encoding = text.match(/data:application\/json;([^,]+),/)[1]
    throw new Error('Unsupported source map encoding ' + encoding)
  }

  loadFile(path) {
    this.root = dirname(path)
    if (existsSync(path)) {
      this.mapFile = path
      return readFileSync(path, 'utf-8').toString().trim()
    }
  }

  loadMap(file, prev) {
    if (prev === false) return false

    if (prev) {
      if (typeof prev === 'string') {
        return prev
      } else if (typeof prev === 'function') {
        let prevPath = prev(file)
        if (prevPath) {
          let map = this.loadFile(prevPath)
          if (!map) {
            throw new Error(
              'Unable to load previous source map: ' + prevPath.toString()
            )
          }
          return map
        }
      } else if (prev instanceof SourceMapConsumer) {
        return SourceMapGenerator.fromSourceMap(prev).toString()
      } else if (prev instanceof SourceMapGenerator) {
        return prev.toString()
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev)
      } else {
        throw new Error(
          'Unsupported previous source map format: ' + prev.toString()
        )
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation)
    } else if (this.annotation) {
      let map = this.annotation
      if (file) map = join(dirname(file), map)
      return this.loadFile(map)
    }
  }

  isMap(map) {
    if (typeof map !== 'object') return false
    return (
      typeof map.mappings === 'string' ||
      typeof map._mappings === 'string' ||
      Array.isArray(map.sections)
    )
  }
}

module.exports = PreviousMap
PreviousMap.default = PreviousMap


/***/ }),

/***/ "./node_modules/postcss/lib/processor.js":
/*!***********************************************!*\
  !*** ./node_modules/postcss/lib/processor.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let NoWorkResult = __webpack_require__(/*! ./no-work-result */ "./node_modules/postcss/lib/no-work-result.js")
let LazyResult = __webpack_require__(/*! ./lazy-result */ "./node_modules/postcss/lib/lazy-result.js")
let Document = __webpack_require__(/*! ./document */ "./node_modules/postcss/lib/document.js")
let Root = __webpack_require__(/*! ./root */ "./node_modules/postcss/lib/root.js")

class Processor {
  constructor(plugins = []) {
    this.version = '8.4.5'
    this.plugins = this.normalize(plugins)
  }

  use(plugin) {
    this.plugins = this.plugins.concat(this.normalize([plugin]))
    return this
  }

  process(css, opts = {}) {
    if (
      this.plugins.length === 0 &&
      typeof opts.parser === 'undefined' &&
      typeof opts.stringifier === 'undefined' &&
      typeof opts.syntax === 'undefined'
    ) {
      return new NoWorkResult(this, css, opts)
    } else {
      return new LazyResult(this, css, opts)
    }
  }

  normalize(plugins) {
    let normalized = []
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i()
      } else if (i.postcss) {
        i = i.postcss
      }

      if (typeof i === 'object' && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins)
      } else if (typeof i === 'object' && i.postcssPlugin) {
        normalized.push(i)
      } else if (typeof i === 'function') {
        normalized.push(i)
      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
        if (true) {
          throw new Error(
            'PostCSS syntaxes cannot be used as plugins. Instead, please use ' +
              'one of the syntax/parser/stringifier options as outlined ' +
              'in your PostCSS runner documentation.'
          )
        }
      } else {
        throw new Error(i + ' is not a PostCSS plugin')
      }
    }
    return normalized
  }
}

module.exports = Processor
Processor.default = Processor

Root.registerProcessor(Processor)
Document.registerProcessor(Processor)


/***/ }),

/***/ "./node_modules/postcss/lib/result.js":
/*!********************************************!*\
  !*** ./node_modules/postcss/lib/result.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Warning = __webpack_require__(/*! ./warning */ "./node_modules/postcss/lib/warning.js")

class Result {
  constructor(processor, root, opts) {
    this.processor = processor
    this.messages = []
    this.root = root
    this.opts = opts
    this.css = undefined
    this.map = undefined
  }

  toString() {
    return this.css
  }

  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin
      }
    }

    let warning = new Warning(text, opts)
    this.messages.push(warning)

    return warning
  }

  warnings() {
    return this.messages.filter(i => i.type === 'warning')
  }

  get content() {
    return this.css
  }
}

module.exports = Result
Result.default = Result


/***/ }),

/***/ "./node_modules/postcss/lib/root.js":
/*!******************************************!*\
  !*** ./node_modules/postcss/lib/root.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")

let LazyResult, Processor

class Root extends Container {
  constructor(defaults) {
    super(defaults)
    this.type = 'root'
    if (!this.nodes) this.nodes = []
  }

  removeChild(child, ignore) {
    let index = this.index(child)

    if (!ignore && index === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index].raws.before
    }

    return super.removeChild(child)
  }

  normalize(child, sample, type) {
    let nodes = super.normalize(child)

    if (sample) {
      if (type === 'prepend') {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before
        } else {
          delete sample.raws.before
        }
      } else if (this.first !== sample) {
        for (let node of nodes) {
          node.raws.before = sample.raws.before
        }
      }
    }

    return nodes
  }

  toResult(opts = {}) {
    let lazy = new LazyResult(new Processor(), this, opts)
    return lazy.stringify()
  }
}

Root.registerLazyResult = dependant => {
  LazyResult = dependant
}

Root.registerProcessor = dependant => {
  Processor = dependant
}

module.exports = Root
Root.default = Root


/***/ }),

/***/ "./node_modules/postcss/lib/rule.js":
/*!******************************************!*\
  !*** ./node_modules/postcss/lib/rule.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Container = __webpack_require__(/*! ./container */ "./node_modules/postcss/lib/container.js")
let list = __webpack_require__(/*! ./list */ "./node_modules/postcss/lib/list.js")

class Rule extends Container {
  constructor(defaults) {
    super(defaults)
    this.type = 'rule'
    if (!this.nodes) this.nodes = []
  }

  get selectors() {
    return list.comma(this.selector)
  }

  set selectors(values) {
    let match = this.selector ? this.selector.match(/,\s*/) : null
    let sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen')
    this.selector = values.join(sep)
  }
}

module.exports = Rule
Rule.default = Rule

Container.registerRule(Rule)


/***/ }),

/***/ "./node_modules/postcss/lib/stringifier.js":
/*!*************************************************!*\
  !*** ./node_modules/postcss/lib/stringifier.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


const DEFAULT_RAW = {
  colon: ': ',
  indent: '    ',
  beforeDecl: '\n',
  beforeRule: '\n',
  beforeOpen: ' ',
  beforeClose: '\n',
  beforeComment: '\n',
  after: '\n',
  emptyBody: '',
  commentLeft: ' ',
  commentRight: ' ',
  semicolon: false
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1)
}

class Stringifier {
  constructor(builder) {
    this.builder = builder
  }

  stringify(node, semicolon) {
    /* c8 ignore start */
    if (!this[node.type]) {
      throw new Error(
        'Unknown AST node type ' +
          node.type +
          '. ' +
          'Maybe you need to change PostCSS stringifier.'
      )
    }
    /* c8 ignore stop */
    this[node.type](node, semicolon)
  }

  document(node) {
    this.body(node)
  }

  root(node) {
    this.body(node)
    if (node.raws.after) this.builder(node.raws.after)
  }

  comment(node) {
    let left = this.raw(node, 'left', 'commentLeft')
    let right = this.raw(node, 'right', 'commentRight')
    this.builder('/*' + left + node.text + right + '*/', node)
  }

  decl(node, semicolon) {
    let between = this.raw(node, 'between', 'colon')
    let string = node.prop + between + this.rawValue(node, 'value')

    if (node.important) {
      string += node.raws.important || ' !important'
    }

    if (semicolon) string += ';'
    this.builder(string, node)
  }

  rule(node) {
    this.block(node, this.rawValue(node, 'selector'))
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, 'end')
    }
  }

  atrule(node, semicolon) {
    let name = '@' + node.name
    let params = node.params ? this.rawValue(node, 'params') : ''

    if (typeof node.raws.afterName !== 'undefined') {
      name += node.raws.afterName
    } else if (params) {
      name += ' '
    }

    if (node.nodes) {
      this.block(node, name + params)
    } else {
      let end = (node.raws.between || '') + (semicolon ? ';' : '')
      this.builder(name + params + end, node)
    }
  }

  body(node) {
    let last = node.nodes.length - 1
    while (last > 0) {
      if (node.nodes[last].type !== 'comment') break
      last -= 1
    }

    let semicolon = this.raw(node, 'semicolon')
    for (let i = 0; i < node.nodes.length; i++) {
      let child = node.nodes[i]
      let before = this.raw(child, 'before')
      if (before) this.builder(before)
      this.stringify(child, last !== i || semicolon)
    }
  }

  block(node, start) {
    let between = this.raw(node, 'between', 'beforeOpen')
    this.builder(start + between + '{', node, 'start')

    let after
    if (node.nodes && node.nodes.length) {
      this.body(node)
      after = this.raw(node, 'after')
    } else {
      after = this.raw(node, 'after', 'emptyBody')
    }

    if (after) this.builder(after)
    this.builder('}', node, 'end')
  }

  raw(node, own, detect) {
    let value
    if (!detect) detect = own

    // Already had
    if (own) {
      value = node.raws[own]
      if (typeof value !== 'undefined') return value
    }

    let parent = node.parent

    if (detect === 'before') {
      // Hack for first rule in CSS
      if (!parent || (parent.type === 'root' && parent.first === node)) {
        return ''
      }

      // `root` nodes in `document` should use only their own raws
      if (parent && parent.type === 'document') {
        return ''
      }
    }

    // Floating child without parent
    if (!parent) return DEFAULT_RAW[detect]

    // Detect style by other nodes
    let root = node.root()
    if (!root.rawCache) root.rawCache = {}
    if (typeof root.rawCache[detect] !== 'undefined') {
      return root.rawCache[detect]
    }

    if (detect === 'before' || detect === 'after') {
      return this.beforeAfter(node, detect)
    } else {
      let method = 'raw' + capitalize(detect)
      if (this[method]) {
        value = this[method](root, node)
      } else {
        root.walk(i => {
          value = i.raws[own]
          if (typeof value !== 'undefined') return false
        })
      }
    }

    if (typeof value === 'undefined') value = DEFAULT_RAW[detect]

    root.rawCache[detect] = value
    return value
  }

  rawSemicolon(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
        value = i.raws.semicolon
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawEmptyBody(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawIndent(root) {
    if (root.raws.indent) return root.raws.indent
    let value
    root.walk(i => {
      let p = i.parent
      if (p && p !== root && p.parent && p.parent === root) {
        if (typeof i.raws.before !== 'undefined') {
          let parts = i.raws.before.split('\n')
          value = parts[parts.length - 1]
          value = value.replace(/\S/g, '')
          return false
        }
      }
    })
    return value
  }

  rawBeforeComment(root, node) {
    let value
    root.walkComments(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before
        if (value.includes('\n')) {
          value = value.replace(/[^\n]+$/, '')
        }
        return false
      }
    })
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeDecl')
    } else if (value) {
      value = value.replace(/\S/g, '')
    }
    return value
  }

  rawBeforeDecl(root, node) {
    let value
    root.walkDecls(i => {
      if (typeof i.raws.before !== 'undefined') {
        value = i.raws.before
        if (value.includes('\n')) {
          value = value.replace(/[^\n]+$/, '')
        }
        return false
      }
    })
    if (typeof value === 'undefined') {
      value = this.raw(node, null, 'beforeRule')
    } else if (value) {
      value = value.replace(/\S/g, '')
    }
    return value
  }

  rawBeforeRule(root) {
    let value
    root.walk(i => {
      if (i.nodes && (i.parent !== root || root.first !== i)) {
        if (typeof i.raws.before !== 'undefined') {
          value = i.raws.before
          if (value.includes('\n')) {
            value = value.replace(/[^\n]+$/, '')
          }
          return false
        }
      }
    })
    if (value) value = value.replace(/\S/g, '')
    return value
  }

  rawBeforeClose(root) {
    let value
    root.walk(i => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== 'undefined') {
          value = i.raws.after
          if (value.includes('\n')) {
            value = value.replace(/[^\n]+$/, '')
          }
          return false
        }
      }
    })
    if (value) value = value.replace(/\S/g, '')
    return value
  }

  rawBeforeOpen(root) {
    let value
    root.walk(i => {
      if (i.type !== 'decl') {
        value = i.raws.between
        if (typeof value !== 'undefined') return false
      }
    })
    return value
  }

  rawColon(root) {
    let value
    root.walkDecls(i => {
      if (typeof i.raws.between !== 'undefined') {
        value = i.raws.between.replace(/[^\s:]/g, '')
        return false
      }
    })
    return value
  }

  beforeAfter(node, detect) {
    let value
    if (node.type === 'decl') {
      value = this.raw(node, null, 'beforeDecl')
    } else if (node.type === 'comment') {
      value = this.raw(node, null, 'beforeComment')
    } else if (detect === 'before') {
      value = this.raw(node, null, 'beforeRule')
    } else {
      value = this.raw(node, null, 'beforeClose')
    }

    let buf = node.parent
    let depth = 0
    while (buf && buf.type !== 'root') {
      depth += 1
      buf = buf.parent
    }

    if (value.includes('\n')) {
      let indent = this.raw(node, null, 'indent')
      if (indent.length) {
        for (let step = 0; step < depth; step++) value += indent
      }
    }

    return value
  }

  rawValue(node, prop) {
    let value = node[prop]
    let raw = node.raws[prop]
    if (raw && raw.value === value) {
      return raw.raw
    }

    return value
  }
}

module.exports = Stringifier
Stringifier.default = Stringifier


/***/ }),

/***/ "./node_modules/postcss/lib/stringify.js":
/*!***********************************************!*\
  !*** ./node_modules/postcss/lib/stringify.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


let Stringifier = __webpack_require__(/*! ./stringifier */ "./node_modules/postcss/lib/stringifier.js")

function stringify(node, builder) {
  let str = new Stringifier(builder)
  str.stringify(node)
}

module.exports = stringify
stringify.default = stringify


/***/ }),

/***/ "./node_modules/postcss/lib/symbols.js":
/*!*********************************************!*\
  !*** ./node_modules/postcss/lib/symbols.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


module.exports.isClean = Symbol('isClean')

module.exports.my = Symbol('my')


/***/ }),

/***/ "./node_modules/postcss/lib/tokenize.js":
/*!**********************************************!*\
  !*** ./node_modules/postcss/lib/tokenize.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";


const SINGLE_QUOTE = "'".charCodeAt(0)
const DOUBLE_QUOTE = '"'.charCodeAt(0)
const BACKSLASH = '\\'.charCodeAt(0)
const SLASH = '/'.charCodeAt(0)
const NEWLINE = '\n'.charCodeAt(0)
const SPACE = ' '.charCodeAt(0)
const FEED = '\f'.charCodeAt(0)
const TAB = '\t'.charCodeAt(0)
const CR = '\r'.charCodeAt(0)
const OPEN_SQUARE = '['.charCodeAt(0)
const CLOSE_SQUARE = ']'.charCodeAt(0)
const OPEN_PARENTHESES = '('.charCodeAt(0)
const CLOSE_PARENTHESES = ')'.charCodeAt(0)
const OPEN_CURLY = '{'.charCodeAt(0)
const CLOSE_CURLY = '}'.charCodeAt(0)
const SEMICOLON = ';'.charCodeAt(0)
const ASTERISK = '*'.charCodeAt(0)
const COLON = ':'.charCodeAt(0)
const AT = '@'.charCodeAt(0)

const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g
const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g
const RE_BAD_BRACKET = /.[\n"'(/\\]/
const RE_HEX_ESCAPE = /[\da-f]/i

module.exports = function tokenizer(input, options = {}) {
  let css = input.css.valueOf()
  let ignore = options.ignoreErrors

  let code, next, quote, content, escape
  let escaped, escapePos, prev, n, currentToken

  let length = css.length
  let pos = 0
  let buffer = []
  let returned = []

  function position() {
    return pos
  }

  function unclosed(what) {
    throw input.error('Unclosed ' + what, pos)
  }

  function endOfFile() {
    return returned.length === 0 && pos >= length
  }

  function nextToken(opts) {
    if (returned.length) return returned.pop()
    if (pos >= length) return

    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false

    code = css.charCodeAt(pos)

    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos
        do {
          next += 1
          code = css.charCodeAt(next)
        } while (
          code === SPACE ||
          code === NEWLINE ||
          code === TAB ||
          code === CR ||
          code === FEED
        )

        currentToken = ['space', css.slice(pos, next)]
        pos = next - 1
        break
      }

      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        let controlChar = String.fromCharCode(code)
        currentToken = [controlChar, controlChar, pos]
        break
      }

      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : ''
        n = css.charCodeAt(pos + 1)
        if (
          prev === 'url' &&
          n !== SINGLE_QUOTE &&
          n !== DOUBLE_QUOTE &&
          n !== SPACE &&
          n !== NEWLINE &&
          n !== TAB &&
          n !== FEED &&
          n !== CR
        ) {
          next = pos
          do {
            escaped = false
            next = css.indexOf(')', next + 1)
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos
                break
              } else {
                unclosed('bracket')
              }
            }
            escapePos = next
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1
              escaped = !escaped
            }
          } while (escaped)

          currentToken = ['brackets', css.slice(pos, next + 1), pos, next]

          pos = next
        } else {
          next = css.indexOf(')', pos + 1)
          content = css.slice(pos, next + 1)

          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ['(', '(', pos]
          } else {
            currentToken = ['brackets', content, pos, next]
            pos = next
          }
        }

        break
      }

      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"'
        next = pos
        do {
          escaped = false
          next = css.indexOf(quote, next + 1)
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1
              break
            } else {
              unclosed('string')
            }
          }
          escapePos = next
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1
            escaped = !escaped
          }
        } while (escaped)

        currentToken = ['string', css.slice(pos, next + 1), pos, next]
        pos = next
        break
      }

      case AT: {
        RE_AT_END.lastIndex = pos + 1
        RE_AT_END.test(css)
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1
        } else {
          next = RE_AT_END.lastIndex - 2
        }

        currentToken = ['at-word', css.slice(pos, next + 1), pos, next]

        pos = next
        break
      }

      case BACKSLASH: {
        next = pos
        escape = true
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1
          escape = !escape
        }
        code = css.charCodeAt(next + 1)
        if (
          escape &&
          code !== SLASH &&
          code !== SPACE &&
          code !== NEWLINE &&
          code !== TAB &&
          code !== CR &&
          code !== FEED
        ) {
          next += 1
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1
            }
          }
        }

        currentToken = ['word', css.slice(pos, next + 1), pos, next]

        pos = next
        break
      }

      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf('*/', pos + 2) + 1
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length
            } else {
              unclosed('comment')
            }
          }

          currentToken = ['comment', css.slice(pos, next + 1), pos, next]
          pos = next
        } else {
          RE_WORD_END.lastIndex = pos + 1
          RE_WORD_END.test(css)
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1
          } else {
            next = RE_WORD_END.lastIndex - 2
          }

          currentToken = ['word', css.slice(pos, next + 1), pos, next]
          buffer.push(currentToken)
          pos = next
        }

        break
      }
    }

    pos++
    return currentToken
  }

  function back(token) {
    returned.push(token)
  }

  return {
    back,
    nextToken,
    endOfFile,
    position
  }
}


/***/ }),

/***/ "./node_modules/postcss/lib/warn-once.js":
/*!***********************************************!*\
  !*** ./node_modules/postcss/lib/warn-once.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
/* eslint-disable no-console */


let printed = {}

module.exports = function warnOnce(message) {
  if (printed[message]) return
  printed[message] = true

  if (typeof console !== 'undefined' && console.warn) {
    console.warn(message)
  }
}


/***/ }),

/***/ "./node_modules/postcss/lib/warning.js":
/*!*********************************************!*\
  !*** ./node_modules/postcss/lib/warning.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";


class Warning {
  constructor(text, opts = {}) {
    this.type = 'warning'
    this.text = text

    if (opts.node && opts.node.source) {
      let range = opts.node.rangeBy(opts)
      this.line = range.start.line
      this.column = range.start.column
      this.endLine = range.end.line
      this.endColumn = range.end.column
    }

    for (let opt in opts) this[opt] = opts[opt]
  }

  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        plugin: this.plugin,
        index: this.index,
        word: this.word
      }).message
    }

    if (this.plugin) {
      return this.plugin + ': ' + this.text
    }

    return this.text
  }
}

module.exports = Warning
Warning.default = Warning


/***/ }),

/***/ "./node_modules/sanitize-html/index.js":
/*!*********************************************!*\
  !*** ./node_modules/sanitize-html/index.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const htmlparser = __webpack_require__(/*! htmlparser2 */ "./node_modules/htmlparser2/lib/index.js");
const escapeStringRegexp = __webpack_require__(/*! escape-string-regexp */ "./node_modules/sanitize-html/node_modules/escape-string-regexp/index.js");
const { isPlainObject } = __webpack_require__(/*! is-plain-object */ "./node_modules/is-plain-object/dist/is-plain-object.js");
const deepmerge = __webpack_require__(/*! deepmerge */ "./node_modules/deepmerge/dist/cjs.js");
const parseSrcset = __webpack_require__(/*! parse-srcset */ "./node_modules/parse-srcset/src/parse-srcset.js");
const { parse: postcssParse } = __webpack_require__(/*! postcss */ "./node_modules/postcss/lib/postcss.js");
// Tags that can conceivably represent stand-alone media.
const mediaTags = [
  'img', 'audio', 'video', 'picture', 'svg',
  'object', 'map', 'iframe', 'embed'
];
// Tags that are inherently vulnerable to being used in XSS attacks.
const vulnerableTags = [ 'script', 'style' ];

function each(obj, cb) {
  if (obj) {
    Object.keys(obj).forEach(function (key) {
      cb(obj[key], key);
    });
  }
}

// Avoid false positives with .__proto__, .hasOwnProperty, etc.
function has(obj, key) {
  return ({}).hasOwnProperty.call(obj, key);
}

// Returns those elements of `a` for which `cb(a)` returns truthy
function filter(a, cb) {
  const n = [];
  each(a, function(v) {
    if (cb(v)) {
      n.push(v);
    }
  });
  return n;
}

function isEmptyObject(obj) {
  for (const key in obj) {
    if (has(obj, key)) {
      return false;
    }
  }
  return true;
}

function stringifySrcset(parsedSrcset) {
  return parsedSrcset.map(function(part) {
    if (!part.url) {
      throw new Error('URL missing');
    }

    return (
      part.url +
      (part.w ? ` ${part.w}w` : '') +
      (part.h ? ` ${part.h}h` : '') +
      (part.d ? ` ${part.d}x` : '')
    );
  }).join(', ');
}

module.exports = sanitizeHtml;

// A valid attribute name.
// We use a tolerant definition based on the set of strings defined by
// html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state
// and html.spec.whatwg.org/multipage/parsing.html#attribute-name-state .
// The characters accepted are ones which can be appended to the attribute
// name buffer without triggering a parse error:
//   * unexpected-equals-sign-before-attribute-name
//   * unexpected-null-character
//   * unexpected-character-in-attribute-name
// We exclude the empty string because it's impossible to get to the after
// attribute name state with an empty attribute name buffer.
const VALID_HTML_ATTRIBUTE_NAME = /^[^\0\t\n\f\r /<=>]+$/;

// Ignore the _recursing flag; it's there for recursive
// invocation as a guard against this exploit:
// https://github.com/fb55/htmlparser2/issues/105

function sanitizeHtml(html, options, _recursing) {
  if (html == null) {
    return '';
  }

  let result = '';
  // Used for hot swapping the result variable with an empty string in order to "capture" the text written to it.
  let tempResult = '';

  function Frame(tag, attribs) {
    const that = this;
    this.tag = tag;
    this.attribs = attribs || {};
    this.tagPosition = result.length;
    this.text = ''; // Node inner text
    this.mediaChildren = [];

    this.updateParentNodeText = function() {
      if (stack.length) {
        const parentFrame = stack[stack.length - 1];
        parentFrame.text += that.text;
      }
    };

    this.updateParentNodeMediaChildren = function() {
      if (stack.length && mediaTags.includes(this.tag)) {
        const parentFrame = stack[stack.length - 1];
        parentFrame.mediaChildren.push(this.tag);
      }
    };
  }

  options = Object.assign({}, sanitizeHtml.defaults, options);
  options.parser = Object.assign({}, htmlParserDefaults, options.parser);

  // vulnerableTags
  vulnerableTags.forEach(function (tag) {
    if (
      options.allowedTags && options.allowedTags.indexOf(tag) > -1 &&
      !options.allowVulnerableTags
    ) {
      console.warn(`\n\n⚠️ Your \`allowedTags\` option includes, \`${tag}\`, which is inherently\nvulnerable to XSS attacks. Please remove it from \`allowedTags\`.\nOr, to disable this warning, add the \`allowVulnerableTags\` option\nand ensure you are accounting for this risk.\n\n`);
    }
  });

  // Tags that contain something other than HTML, or where discarding
  // the text when the tag is disallowed makes sense for other reasons.
  // If we are not allowing these tags, we should drop their content too.
  // For other tags you would drop the tag but keep its content.
  const nonTextTagsArray = options.nonTextTags || [
    'script',
    'style',
    'textarea',
    'option'
  ];
  let allowedAttributesMap;
  let allowedAttributesGlobMap;
  if (options.allowedAttributes) {
    allowedAttributesMap = {};
    allowedAttributesGlobMap = {};
    each(options.allowedAttributes, function(attributes, tag) {
      allowedAttributesMap[tag] = [];
      const globRegex = [];
      attributes.forEach(function(obj) {
        if (typeof obj === 'string' && obj.indexOf('*') >= 0) {
          globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, '.*'));
        } else {
          allowedAttributesMap[tag].push(obj);
        }
      });
      if (globRegex.length) {
        allowedAttributesGlobMap[tag] = new RegExp('^(' + globRegex.join('|') + ')$');
      }
    });
  }
  const allowedClassesMap = {};
  const allowedClassesGlobMap = {};
  const allowedClassesRegexMap = {};
  each(options.allowedClasses, function(classes, tag) {
    // Implicitly allows the class attribute
    if (allowedAttributesMap) {
      if (!has(allowedAttributesMap, tag)) {
        allowedAttributesMap[tag] = [];
      }
      allowedAttributesMap[tag].push('class');
    }

    allowedClassesMap[tag] = [];
    allowedClassesRegexMap[tag] = [];
    const globRegex = [];
    classes.forEach(function(obj) {
      if (typeof obj === 'string' && obj.indexOf('*') >= 0) {
        globRegex.push(escapeStringRegexp(obj).replace(/\\\*/g, '.*'));
      } else if (obj instanceof RegExp) {
        allowedClassesRegexMap[tag].push(obj);
      } else {
        allowedClassesMap[tag].push(obj);
      }
    });
    if (globRegex.length) {
      allowedClassesGlobMap[tag] = new RegExp('^(' + globRegex.join('|') + ')$');
    }
  });

  const transformTagsMap = {};
  let transformTagsAll;
  each(options.transformTags, function(transform, tag) {
    let transFun;
    if (typeof transform === 'function') {
      transFun = transform;
    } else if (typeof transform === 'string') {
      transFun = sanitizeHtml.simpleTransform(transform);
    }
    if (tag === '*') {
      transformTagsAll = transFun;
    } else {
      transformTagsMap[tag] = transFun;
    }
  });

  let depth;
  let stack;
  let skipMap;
  let transformMap;
  let skipText;
  let skipTextDepth;
  let addedText = false;

  initializeState();

  const parser = new htmlparser.Parser({
    onopentag: function(name, attribs) {
      // If `enforceHtmlBoundary` is `true` and this has found the opening
      // `html` tag, reset the state.
      if (options.enforceHtmlBoundary && name === 'html') {
        initializeState();
      }

      if (skipText) {
        skipTextDepth++;
        return;
      }
      const frame = new Frame(name, attribs);
      stack.push(frame);

      let skip = false;
      const hasText = !!frame.text;
      let transformedTag;
      if (has(transformTagsMap, name)) {
        transformedTag = transformTagsMap[name](name, attribs);

        frame.attribs = attribs = transformedTag.attribs;

        if (transformedTag.text !== undefined) {
          frame.innerText = transformedTag.text;
        }

        if (name !== transformedTag.tagName) {
          frame.name = name = transformedTag.tagName;
          transformMap[depth] = transformedTag.tagName;
        }
      }
      if (transformTagsAll) {
        transformedTag = transformTagsAll(name, attribs);

        frame.attribs = attribs = transformedTag.attribs;
        if (name !== transformedTag.tagName) {
          frame.name = name = transformedTag.tagName;
          transformMap[depth] = transformedTag.tagName;
        }
      }

      if ((options.allowedTags && options.allowedTags.indexOf(name) === -1) || (options.disallowedTagsMode === 'recursiveEscape' && !isEmptyObject(skipMap)) || (options.nestingLimit != null && depth >= options.nestingLimit)) {
        skip = true;
        skipMap[depth] = true;
        if (options.disallowedTagsMode === 'discard') {
          if (nonTextTagsArray.indexOf(name) !== -1) {
            skipText = true;
            skipTextDepth = 1;
          }
        }
        skipMap[depth] = true;
      }
      depth++;
      if (skip) {
        if (options.disallowedTagsMode === 'discard') {
          // We want the contents but not this tag
          return;
        }
        tempResult = result;
        result = '';
      }
      result += '<' + name;

      if (name === 'script') {
        if (options.allowedScriptHostnames || options.allowedScriptDomains) {
          frame.innerText = '';
        }
      }

      if (!allowedAttributesMap || has(allowedAttributesMap, name) || allowedAttributesMap['*']) {
        each(attribs, function(value, a) {
          if (!VALID_HTML_ATTRIBUTE_NAME.test(a)) {
            // This prevents part of an attribute name in the output from being
            // interpreted as the end of an attribute, or end of a tag.
            delete frame.attribs[a];
            return;
          }
          let parsed;
          // check allowedAttributesMap for the element and attribute and modify the value
          // as necessary if there are specific values defined.
          let passedAllowedAttributesMapCheck = false;
          if (!allowedAttributesMap ||
            (has(allowedAttributesMap, name) && allowedAttributesMap[name].indexOf(a) !== -1) ||
            (allowedAttributesMap['*'] && allowedAttributesMap['*'].indexOf(a) !== -1) ||
            (has(allowedAttributesGlobMap, name) && allowedAttributesGlobMap[name].test(a)) ||
            (allowedAttributesGlobMap['*'] && allowedAttributesGlobMap['*'].test(a))) {
            passedAllowedAttributesMapCheck = true;
          } else if (allowedAttributesMap && allowedAttributesMap[name]) {
            for (const o of allowedAttributesMap[name]) {
              if (isPlainObject(o) && o.name && (o.name === a)) {
                passedAllowedAttributesMapCheck = true;
                let newValue = '';
                if (o.multiple === true) {
                  // verify the values that are allowed
                  const splitStrArray = value.split(' ');
                  for (const s of splitStrArray) {
                    if (o.values.indexOf(s) !== -1) {
                      if (newValue === '') {
                        newValue = s;
                      } else {
                        newValue += ' ' + s;
                      }
                    }
                  }
                } else if (o.values.indexOf(value) >= 0) {
                  // verified an allowed value matches the entire attribute value
                  newValue = value;
                }
                value = newValue;
              }
            }
          }
          if (passedAllowedAttributesMapCheck) {
            if (options.allowedSchemesAppliedToAttributes.indexOf(a) !== -1) {
              if (naughtyHref(name, value)) {
                delete frame.attribs[a];
                return;
              }
            }

            if (name === 'script' && a === 'src') {

              let allowed = true;

              try {
                const parsed = new URL(value);

                if (options.allowedScriptHostnames || options.allowedScriptDomains) {
                  const allowedHostname = (options.allowedScriptHostnames || []).find(function (hostname) {
                    return hostname === parsed.hostname;
                  });
                  const allowedDomain = (options.allowedScriptDomains || []).find(function(domain) {
                    return parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`);
                  });
                  allowed = allowedHostname || allowedDomain;
                }
              } catch (e) {
                allowed = false;
              }

              if (!allowed) {
                delete frame.attribs[a];
                return;
              }
            }

            if (name === 'iframe' && a === 'src') {
              let allowed = true;
              try {
                // Chrome accepts \ as a substitute for / in the // at the
                // start of a URL, so rewrite accordingly to prevent exploit.
                // Also drop any whitespace at that point in the URL
                value = value.replace(/^(\w+:)?\s*[\\/]\s*[\\/]/, '$1//');
                if (value.startsWith('relative:')) {
                  // An attempt to exploit our workaround for base URLs being
                  // mandatory for relative URL validation in the WHATWG
                  // URL parser, reject it
                  throw new Error('relative: exploit attempt');
                }
                // naughtyHref is in charge of whether protocol relative URLs
                // are cool. Here we are concerned just with allowed hostnames and
                // whether to allow relative URLs.
                //
                // Build a placeholder "base URL" against which any reasonable
                // relative URL may be parsed successfully
                let base = 'relative://relative-site';
                for (let i = 0; (i < 100); i++) {
                  base += `/${i}`;
                }
                const parsed = new URL(value, base);
                const isRelativeUrl = parsed && parsed.hostname === 'relative-site' && parsed.protocol === 'relative:';
                if (isRelativeUrl) {
                  // default value of allowIframeRelativeUrls is true
                  // unless allowedIframeHostnames or allowedIframeDomains specified
                  allowed = has(options, 'allowIframeRelativeUrls')
                    ? options.allowIframeRelativeUrls
                    : (!options.allowedIframeHostnames && !options.allowedIframeDomains);
                } else if (options.allowedIframeHostnames || options.allowedIframeDomains) {
                  const allowedHostname = (options.allowedIframeHostnames || []).find(function (hostname) {
                    return hostname === parsed.hostname;
                  });
                  const allowedDomain = (options.allowedIframeDomains || []).find(function(domain) {
                    return parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`);
                  });
                  allowed = allowedHostname || allowedDomain;
                }
              } catch (e) {
                // Unparseable iframe src
                allowed = false;
              }
              if (!allowed) {
                delete frame.attribs[a];
                return;
              }
            }
            if (a === 'srcset') {
              try {
                parsed = parseSrcset(value);
                parsed.forEach(function(value) {
                  if (naughtyHref('srcset', value.url)) {
                    value.evil = true;
                  }
                });
                parsed = filter(parsed, function(v) {
                  return !v.evil;
                });
                if (!parsed.length) {
                  delete frame.attribs[a];
                  return;
                } else {
                  value = stringifySrcset(filter(parsed, function(v) {
                    return !v.evil;
                  }));
                  frame.attribs[a] = value;
                }
              } catch (e) {
                // Unparseable srcset
                delete frame.attribs[a];
                return;
              }
            }
            if (a === 'class') {
              const allowedSpecificClasses = allowedClassesMap[name];
              const allowedWildcardClasses = allowedClassesMap['*'];
              const allowedSpecificClassesGlob = allowedClassesGlobMap[name];
              const allowedSpecificClassesRegex = allowedClassesRegexMap[name];
              const allowedWildcardClassesGlob = allowedClassesGlobMap['*'];
              const allowedClassesGlobs = [
                allowedSpecificClassesGlob,
                allowedWildcardClassesGlob
              ]
                .concat(allowedSpecificClassesRegex)
                .filter(function (t) {
                  return t;
                });
              if (allowedSpecificClasses && allowedWildcardClasses) {
                value = filterClasses(value, deepmerge(allowedSpecificClasses, allowedWildcardClasses), allowedClassesGlobs);
              } else {
                value = filterClasses(value, allowedSpecificClasses || allowedWildcardClasses, allowedClassesGlobs);
              }
              if (!value.length) {
                delete frame.attribs[a];
                return;
              }
            }
            if (a === 'style') {
              try {
                const abstractSyntaxTree = postcssParse(name + ' {' + value + '}');
                const filteredAST = filterCss(abstractSyntaxTree, options.allowedStyles);

                value = stringifyStyleAttributes(filteredAST);

                if (value.length === 0) {
                  delete frame.attribs[a];
                  return;
                }
              } catch (e) {
                delete frame.attribs[a];
                return;
              }
            }
            result += ' ' + a;
            if (value && value.length) {
              result += '="' + escapeHtml(value, true) + '"';
            }
          } else {
            delete frame.attribs[a];
          }
        });
      }
      if (options.selfClosing.indexOf(name) !== -1) {
        result += ' />';
      } else {
        result += '>';
        if (frame.innerText && !hasText && !options.textFilter) {
          result += escapeHtml(frame.innerText);
          addedText = true;
        }
      }
      if (skip) {
        result = tempResult + escapeHtml(result);
        tempResult = '';
      }
    },
    ontext: function(text) {
      if (skipText) {
        return;
      }
      const lastFrame = stack[stack.length - 1];
      let tag;

      if (lastFrame) {
        tag = lastFrame.tag;
        // If inner text was set by transform function then let's use it
        text = lastFrame.innerText !== undefined ? lastFrame.innerText : text;
      }

      if (options.disallowedTagsMode === 'discard' && ((tag === 'script') || (tag === 'style'))) {
        // htmlparser2 gives us these as-is. Escaping them ruins the content. Allowing
        // script tags is, by definition, game over for XSS protection, so if that's
        // your concern, don't allow them. The same is essentially true for style tags
        // which have their own collection of XSS vectors.
        result += text;
      } else {
        const escaped = escapeHtml(text, false);
        if (options.textFilter && !addedText) {
          result += options.textFilter(escaped, tag);
        } else if (!addedText) {
          result += escaped;
        }
      }
      if (stack.length) {
        const frame = stack[stack.length - 1];
        frame.text += text;
      }
    },
    onclosetag: function(name) {

      if (skipText) {
        skipTextDepth--;
        if (!skipTextDepth) {
          skipText = false;
        } else {
          return;
        }
      }

      const frame = stack.pop();
      if (!frame) {
        // Do not crash on bad markup
        return;
      }
      skipText = options.enforceHtmlBoundary ? name === 'html' : false;
      depth--;
      const skip = skipMap[depth];
      if (skip) {
        delete skipMap[depth];
        if (options.disallowedTagsMode === 'discard') {
          frame.updateParentNodeText();
          return;
        }
        tempResult = result;
        result = '';
      }

      if (transformMap[depth]) {
        name = transformMap[depth];
        delete transformMap[depth];
      }

      if (options.exclusiveFilter && options.exclusiveFilter(frame)) {
        result = result.substr(0, frame.tagPosition);
        return;
      }

      frame.updateParentNodeMediaChildren();
      frame.updateParentNodeText();

      if (options.selfClosing.indexOf(name) !== -1) {
        // Already output />
        if (skip) {
          result = tempResult;
          tempResult = '';
        }
        return;
      }

      result += '</' + name + '>';
      if (skip) {
        result = tempResult + escapeHtml(result);
        tempResult = '';
      }
      addedText = false;
    }
  }, options.parser);
  parser.write(html);
  parser.end();

  return result;

  function initializeState() {
    result = '';
    depth = 0;
    stack = [];
    skipMap = {};
    transformMap = {};
    skipText = false;
    skipTextDepth = 0;
  }

  function escapeHtml(s, quote) {
    if (typeof (s) !== 'string') {
      s = s + '';
    }
    if (options.parser.decodeEntities) {
      s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      if (quote) {
        s = s.replace(/"/g, '&quot;');
      }
    }
    // TODO: this is inadequate because it will pass `&0;`. This approach
    // will not work, each & must be considered with regard to whether it
    // is followed by a 100% syntactically valid entity or not, and escaped
    // if it is not. If this bothers you, don't set parser.decodeEntities
    // to false. (The default is true.)
    s = s.replace(/&(?![a-zA-Z0-9#]{1,20};)/g, '&amp;') // Match ampersands not part of existing HTML entity
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    if (quote) {
      s = s.replace(/"/g, '&quot;');
    }
    return s;
  }

  function naughtyHref(name, href) {
    // Browsers ignore character codes of 32 (space) and below in a surprising
    // number of situations. Start reading here:
    // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet#Embedded_tab
    // eslint-disable-next-line no-control-regex
    href = href.replace(/[\x00-\x20]+/g, '');
    // Clobber any comments in URLs, which the browser might
    // interpret inside an XML data island, allowing
    // a javascript: URL to be snuck through
    href = href.replace(/<!--.*?-->/g, '');
    // Case insensitive so we don't get faked out by JAVASCRIPT #1
    // Allow more characters after the first so we don't get faked
    // out by certain schemes browsers accept
    const matches = href.match(/^([a-zA-Z][a-zA-Z0-9.\-+]*):/);
    if (!matches) {
      // Protocol-relative URL starting with any combination of '/' and '\'
      if (href.match(/^[/\\]{2}/)) {
        return !options.allowProtocolRelative;
      }

      // No scheme
      return false;
    }
    const scheme = matches[1].toLowerCase();

    if (has(options.allowedSchemesByTag, name)) {
      return options.allowedSchemesByTag[name].indexOf(scheme) === -1;
    }

    return !options.allowedSchemes || options.allowedSchemes.indexOf(scheme) === -1;
  }

  /**
   * Filters user input css properties by allowlisted regex attributes.
   * Modifies the abstractSyntaxTree object.
   *
   * @param {object} abstractSyntaxTree  - Object representation of CSS attributes.
   * @property {array[Declaration]} abstractSyntaxTree.nodes[0] - Each object cointains prop and value key, i.e { prop: 'color', value: 'red' }.
   * @param {object} allowedStyles       - Keys are properties (i.e color), value is list of permitted regex rules (i.e /green/i).
   * @return {object}                    - The modified tree.
   */
  function filterCss(abstractSyntaxTree, allowedStyles) {
    if (!allowedStyles) {
      return abstractSyntaxTree;
    }

    const astRules = abstractSyntaxTree.nodes[0];
    let selectedRule;

    // Merge global and tag-specific styles into new AST.
    if (allowedStyles[astRules.selector] && allowedStyles['*']) {
      selectedRule = deepmerge(
        allowedStyles[astRules.selector],
        allowedStyles['*']
      );
    } else {
      selectedRule = allowedStyles[astRules.selector] || allowedStyles['*'];
    }

    if (selectedRule) {
      abstractSyntaxTree.nodes[0].nodes = astRules.nodes.reduce(filterDeclarations(selectedRule), []);
    }

    return abstractSyntaxTree;
  }

  /**
   * Extracts the style attributes from an AbstractSyntaxTree and formats those
   * values in the inline style attribute format.
   *
   * @param  {AbstractSyntaxTree} filteredAST
   * @return {string}             - Example: "color:yellow;text-align:center !important;font-family:helvetica;"
   */
  function stringifyStyleAttributes(filteredAST) {
    return filteredAST.nodes[0].nodes
      .reduce(function(extractedAttributes, attrObject) {
        extractedAttributes.push(
          `${attrObject.prop}:${attrObject.value}${attrObject.important ? ' !important' : ''}`
        );
        return extractedAttributes;
      }, [])
      .join(';');
  }

  /**
    * Filters the existing attributes for the given property. Discards any attributes
    * which don't match the allowlist.
    *
    * @param  {object} selectedRule             - Example: { color: red, font-family: helvetica }
    * @param  {array} allowedDeclarationsList   - List of declarations which pass the allowlist.
    * @param  {object} attributeObject          - Object representing the current css property.
    * @property {string} attributeObject.type   - Typically 'declaration'.
    * @property {string} attributeObject.prop   - The CSS property, i.e 'color'.
    * @property {string} attributeObject.value  - The corresponding value to the css property, i.e 'red'.
    * @return {function}                        - When used in Array.reduce, will return an array of Declaration objects
    */
  function filterDeclarations(selectedRule) {
    return function (allowedDeclarationsList, attributeObject) {
      // If this property is allowlisted...
      if (has(selectedRule, attributeObject.prop)) {
        const matchesRegex = selectedRule[attributeObject.prop].some(function(regularExpression) {
          return regularExpression.test(attributeObject.value);
        });

        if (matchesRegex) {
          allowedDeclarationsList.push(attributeObject);
        }
      }
      return allowedDeclarationsList;
    };
  }

  function filterClasses(classes, allowed, allowedGlobs) {
    if (!allowed) {
      // The class attribute is allowed without filtering on this tag
      return classes;
    }
    classes = classes.split(/\s+/);
    return classes.filter(function(clss) {
      return allowed.indexOf(clss) !== -1 || allowedGlobs.some(function(glob) {
        return glob.test(clss);
      });
    }).join(' ');
  }
}

// Defaults are accessible to you so that you can use them as a starting point
// programmatically if you wish

const htmlParserDefaults = {
  decodeEntities: true
};
sanitizeHtml.defaults = {
  allowedTags: [
    // Sections derived from MDN element categories and limited to the more
    // benign categories.
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element
    // Content sectioning
    'address', 'article', 'aside', 'footer', 'header',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hgroup',
    'main', 'nav', 'section',
    // Text content
    'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure',
    'hr', 'li', 'main', 'ol', 'p', 'pre', 'ul',
    // Inline text semantics
    'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn',
    'em', 'i', 'kbd', 'mark', 'q',
    'rb', 'rp', 'rt', 'rtc', 'ruby',
    's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
    // Table content
    'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr'
  ],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: [ 'href', 'name', 'target' ],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    img: [ 'src' ]
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
  // URL schemes we permit
  allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false
};

sanitizeHtml.simpleTransform = function(newTagName, newAttribs, merge) {
  merge = (merge === undefined) ? true : merge;
  newAttribs = newAttribs || {};

  return function(tagName, attribs) {
    let attrib;
    if (merge) {
      for (attrib in newAttribs) {
        attribs[attrib] = newAttribs[attrib];
      }
    } else {
      attribs = newAttribs;
    }

    return {
      tagName: newTagName,
      attribs: attribs
    };
  };
};


/***/ }),

/***/ "./node_modules/sanitize-html/node_modules/escape-string-regexp/index.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/sanitize-html/node_modules/escape-string-regexp/index.js ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";


module.exports = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
};


/***/ }),

/***/ "./src/style/style.css":
/*!*****************************!*\
  !*** ./src/style/style.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/img/heading.png":
/*!*****************************!*\
  !*** ./src/img/heading.png ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__.p + "heading.png";

/***/ }),

/***/ "?fe98":
/*!**************************************!*\
  !*** ./terminal-highlight (ignored) ***!
  \**************************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?2f81":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?25fb":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?6f78":
/*!*******************************!*\
  !*** source-map-js (ignored) ***!
  \*******************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?9214":
/*!*********************!*\
  !*** url (ignored) ***!
  \*********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/nanoid/non-secure/index.cjs":
/*!**************************************************!*\
  !*** ./node_modules/nanoid/non-secure/index.cjs ***!
  \**************************************************/
/***/ ((module) => {

let urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
let customAlphabet = (alphabet, size) => {
  return () => {
    let id = ''
    let i = size
    while (i--) {
      id += alphabet[(Math.random() * alphabet.length) | 0]
    }
    return id
  }
}
let nanoid = (size = 21) => {
  let id = ''
  let i = size
  while (i--) {
    id += urlAlphabet[(Math.random() * 64) | 0]
  }
  return id
}
module.exports = { nanoid, customAlphabet }


/***/ }),

/***/ "./node_modules/entities/lib/maps/decode.json":
/*!****************************************************!*\
  !*** ./node_modules/entities/lib/maps/decode.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}');

/***/ }),

/***/ "./node_modules/entities/lib/maps/entities.json":
/*!******************************************************!*\
  !*** ./node_modules/entities/lib/maps/entities.json ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');

/***/ }),

/***/ "./node_modules/entities/lib/maps/legacy.json":
/*!****************************************************!*\
  !*** ./node_modules/entities/lib/maps/legacy.json ***!
  \****************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}');

/***/ }),

/***/ "./node_modules/entities/lib/maps/xml.json":
/*!*************************************************!*\
  !*** ./node_modules/entities/lib/maps/xml.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/To-Do-List/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/style.css */ "./src/style/style.css");
/* harmony import */ var _modules_gameLoop_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/gameLoop.js */ "./src/modules/gameLoop.js");
__webpack_require__(/*! ./index.html */ "./src/index.html");



(0,_modules_gameLoop_js__WEBPACK_IMPORTED_MODULE_1__.runGameLoop)();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixtQkFBTyxDQUFDLHNEQUFVO0FBQzlDLGVBQWUsbUJBQU8sQ0FBQywwREFBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsa0RBQWtEO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLDBEQUEwRDtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFlBQVk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7Ozs7Ozs7Ozs7OztBQzFPSjtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZCxrQ0FBa0MsbUJBQU8sQ0FBQyxnRUFBYTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxPQUFPO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsY0FBYzs7Ozs7Ozs7Ozs7O0FDNVhEO0FBQ2I7QUFDQSw2Q0FBNkM7QUFDN0M7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QseUNBQXlDLG1CQUFPLENBQUMsc0ZBQStCO0FBQ2hGLHNDQUFzQyxtQkFBTyxDQUFDLHVGQUFpQztBQUMvRSxvQ0FBb0MsbUJBQU8sQ0FBQyxtRkFBK0I7QUFDM0UsaUNBQWlDLG1CQUFPLENBQUMsNkVBQTRCO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxrQkFBZTs7Ozs7Ozs7Ozs7O0FDNTRCRjtBQUNiO0FBQ0E7QUFDQSxtQ0FBbUMsb0NBQW9DLGdCQUFnQjtBQUN2RixDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBLDBDQUEwQyw0QkFBNEI7QUFDdEUsQ0FBQztBQUNEO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkM7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FB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UjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEsSUFBcUM7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1IsWUFBWSxJQUFxQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixPQUFPLEtBQUsscUJBQXFCO0FBQ2hFLDBDQUEwQyx3QkFBd0I7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsVUFBVSxpQkFBaUI7O0FBRTNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3JpQlk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3ZEWTs7QUFFWixNQUFNLHdDQUF3QyxFQUFFLG1CQUFPLENBQUMsNEJBQWU7QUFDdkUsTUFBTSxrQ0FBa0MsRUFBRSxtQkFBTyxDQUFDLG1CQUFNO0FBQ3hELE1BQU0sZ0JBQWdCLEVBQUUsbUJBQU8sQ0FBQyxrQkFBSzs7QUFFckMsWUFBWSxtQkFBTyxDQUFDLG9EQUFTOztBQUU3QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0NBQStDLFFBQVE7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtCQUErQjtBQUMvQixNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sMENBQTBDLHlCQUF5QjtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0I7QUFDekMsb0JBQW9CO0FBQ3BCLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MseUJBQXlCOztBQUVqRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixvQkFBb0I7QUFDdkMsa0JBQWtCO0FBQ2xCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUMxVVk7O0FBRVosbUJBQW1CLG1CQUFPLENBQUMsb0VBQWlCO0FBQzVDLGdCQUFnQixtQkFBTyxDQUFDLDREQUFhO0FBQ3JDLGVBQWUsbUJBQU8sQ0FBQyw0REFBYTtBQUNwQyxZQUFZLG1CQUFPLENBQUMsb0RBQVM7QUFDN0IsZUFBZSxtQkFBTyxDQUFDLHNEQUFVOztBQUVqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLElBQXFDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDbklZOztBQUVaLE1BQU0sY0FBYyxFQUFFLG1CQUFPLENBQUMsd0RBQVc7QUFDekMscUJBQXFCLG1CQUFPLENBQUMsMEVBQW9CO0FBQ2pELGtCQUFrQixtQkFBTyxDQUFDLGdFQUFlO0FBQ3pDLGdCQUFnQixtQkFBTyxDQUFDLDREQUFhOztBQUVyQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBCQUEwQjtBQUMxQjtBQUNBLFlBQVksYUFBYTtBQUN6QjtBQUNBO0FBQ0EsVUFBVSx3Q0FBd0M7QUFDbEQsVUFBVSxvQ0FBb0M7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFNBQVM7QUFDVCxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CLFdBQVc7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7O0FBRUEsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLEVBQUU7QUFDOUM7QUFDQTtBQUNBLGNBQWMsRUFBRTtBQUNoQixhQUFhLGFBQWEsR0FBRyxhQUFhLEdBQUcsZUFBZTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDMVhZOztBQUVaLGdCQUFnQixtQkFBTyxDQUFDLDREQUFhO0FBQ3JDLGFBQWEsbUJBQU8sQ0FBQyxzREFBVTtBQUMvQixZQUFZLG1CQUFPLENBQUMsb0RBQVM7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osUUFBUSxJQUFxQztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQztBQUN0QztBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FDekNZOztBQUVaLGtCQUFrQixtQkFBTyxDQUFDLGdFQUFlO0FBQ3pDLGdCQUFnQixtQkFBTyxDQUFDLDBEQUFZO0FBQ3BDLGNBQWMsbUJBQU8sQ0FBQyx3REFBVztBQUNqQyxhQUFhLG1CQUFPLENBQUMsd0RBQVc7QUFDaEMsV0FBVyxtQkFBTyxDQUFDLGtEQUFRO0FBQzNCLFdBQVcsbUJBQU8sQ0FBQyxrREFBUTs7QUFFM0I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBeUIsZ0JBQWdCO0FBQ3pDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxlQUFlO0FBQ2Y7QUFDQTs7QUFFQSxlQUFlO0FBQ2Y7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGVBQWU7QUFDZjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSwrQ0FBK0M7QUFDdkQ7QUFDQSx3QkFBd0I7QUFDeEIsUUFBUTtBQUNSLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFVBQVUsb0JBQW9CO0FBQzlCO0FBQ0E7QUFDQSxVQUFVLG9CQUFvQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DLFFBQVE7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUSxvQkFBb0I7QUFDNUIsd0JBQXdCO0FBQ3hCLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLFVBQVUsb0JBQW9CO0FBQzlCO0FBQ0E7QUFDQSxVQUFVLG9CQUFvQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsWUFBWTtBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0JBQW9CO0FBQzVCLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0JBQXNCO0FBQzlCLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkIsUUFBUSxrQkFBa0I7QUFDMUIsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrQkFBa0I7QUFDMUIsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUSxrQkFBa0I7QUFDMUIsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNEJBQTRCLFFBQVE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUN4a0JZOztBQUVaLHFCQUFxQixtQkFBTyxDQUFDLDBFQUFvQjtBQUNqRCxrQkFBa0IsbUJBQU8sQ0FBQyxnRUFBZTtBQUN6QyxpQkFBaUIsbUJBQU8sQ0FBQyxnRUFBZTtBQUN4QyxnQkFBZ0IsbUJBQU8sQ0FBQyw0REFBYTtBQUNyQyxnQkFBZ0IsbUJBQU8sQ0FBQyw0REFBYTtBQUNyQyxnQkFBZ0IsbUJBQU8sQ0FBQyw0REFBYTtBQUNyQyxlQUFlLG1CQUFPLENBQUMsMERBQVk7QUFDbkMsZUFBZSxtQkFBTyxDQUFDLDBEQUFZO0FBQ25DLGNBQWMsbUJBQU8sQ0FBQyx3REFBVztBQUNqQyxjQUFjLG1CQUFPLENBQUMsd0RBQVc7QUFDakMsYUFBYSxtQkFBTyxDQUFDLHdEQUFXO0FBQ2hDLGFBQWEsbUJBQU8sQ0FBQyx5REFBYTtBQUNsQyxZQUFZLG1CQUFPLENBQUMsb0RBQVM7QUFDN0IsWUFBWSxtQkFBTyxDQUFDLG9EQUFTO0FBQzdCLFdBQVcsbUJBQU8sQ0FBQyxrREFBUTtBQUMzQixXQUFXLG1CQUFPLENBQUMsa0RBQVE7QUFDM0IsV0FBVyxtQkFBTyxDQUFDLGtEQUFRO0FBQzNCLFdBQVcsbUJBQU8sQ0FBQyxrREFBUTs7QUFFM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xHWTs7QUFFWixNQUFNLHdDQUF3QyxFQUFFLG1CQUFPLENBQUMsNEJBQWU7QUFDdkUsTUFBTSwyQkFBMkIsRUFBRSxtQkFBTyxDQUFDLGlCQUFJO0FBQy9DLE1BQU0sZ0JBQWdCLEVBQUUsbUJBQU8sQ0FBQyxtQkFBTTs7QUFFdEM7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0QsZUFBZTtBQUNqRSwyQ0FBMkM7QUFDM0MsOENBQThDO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0RBQXNEO0FBQ3REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDN0lZOztBQUVaLG1CQUFtQixtQkFBTyxDQUFDLHNFQUFrQjtBQUM3QyxpQkFBaUIsbUJBQU8sQ0FBQyxnRUFBZTtBQUN4QyxlQUFlLG1CQUFPLENBQUMsMERBQVk7QUFDbkMsV0FBVyxtQkFBTyxDQUFDLGtEQUFROztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1IsWUFBWSxJQUFxQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEVZOztBQUVaLGNBQWMsbUJBQU8sQ0FBQyx3REFBVzs7QUFFakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3pDWTs7QUFFWixnQkFBZ0IsbUJBQU8sQ0FBQyw0REFBYTs7QUFFckM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7QUMxRFk7O0FBRVosZ0JBQWdCLG1CQUFPLENBQUMsNERBQWE7QUFDckMsV0FBVyxtQkFBTyxDQUFDLGtEQUFROztBQUUzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUMxQlk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0I7QUFDL0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLDJEQUEyRDtBQUMzRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFDQUFxQzs7QUFFckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBLG1CQUFtQjtBQUNuQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNwQm5CO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7O1dDQUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOzs7Ozs7Ozs7Ozs7OztBQ3JCQUMsbUJBQU8sQ0FBQyxzQ0FBRCxDQUFQOztBQUNBO0FBQ0E7QUFHQUgsaUVBQVcsRyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9VSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZmFjdG9yaWVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvZ2FtZUxvb3AuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvZGVlcG1lcmdlL2Rpc3QvY2pzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvZG9tLXNlcmlhbGl6ZXIvbGliL2ZvcmVpZ25OYW1lcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2RvbS1zZXJpYWxpemVyL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2RvbWVsZW1lbnR0eXBlL2xpYi9pbmRleC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2RvbWhhbmRsZXIvbGliL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvZG9taGFuZGxlci9saWIvbm9kZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2RvbXV0aWxzL2xpYi9mZWVkcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2RvbXV0aWxzL2xpYi9oZWxwZXJzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvZG9tdXRpbHMvbGliL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvZG9tdXRpbHMvbGliL2xlZ2FjeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2RvbXV0aWxzL2xpYi9tYW5pcHVsYXRpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9kb211dGlscy9saWIvcXVlcnlpbmcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9kb211dGlscy9saWIvc3RyaW5naWZ5LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvZG9tdXRpbHMvbGliL3RyYXZlcnNhbC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2VudGl0aWVzL2xpYi9kZWNvZGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9lbnRpdGllcy9saWIvZGVjb2RlX2NvZGVwb2ludC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2VudGl0aWVzL2xpYi9lbmNvZGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9lbnRpdGllcy9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5odG1sIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvaHRtbHBhcnNlcjIvbGliL0ZlZWRIYW5kbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvaHRtbHBhcnNlcjIvbGliL1BhcnNlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL2h0bWxwYXJzZXIyL2xpYi9Ub2tlbml6ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9odG1scGFyc2VyMi9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9pcy1wbGFpbi1vYmplY3QvZGlzdC9pcy1wbGFpbi1vYmplY3QuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wYXJzZS1zcmNzZXQvc3JjL3BhcnNlLXNyY3NldC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3BpY29jb2xvcnMvcGljb2NvbG9ycy5icm93c2VyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvYXQtcnVsZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL2NvbW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9jb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9jc3Mtc3ludGF4LWVycm9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvZGVjbGFyYXRpb24uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9kb2N1bWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL2Zyb21KU09OLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvaW5wdXQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9sYXp5LXJlc3VsdC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL2xpc3QuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9tYXAtZ2VuZXJhdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvbm8td29yay1yZXN1bHQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9ub2RlLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9wb3N0Y3NzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvcHJldmlvdXMtbWFwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvcHJvY2Vzc29yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvcmVzdWx0LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWIvcm9vdC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL3J1bGUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi9zdHJpbmdpZmllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL3N5bWJvbHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYi90b2tlbml6ZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL3dhcm4tb25jZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGliL3dhcm5pbmcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zYW5pdGl6ZS1odG1sL2luZGV4LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc2FuaXRpemUtaHRtbC9ub2RlX21vZHVsZXMvZXNjYXBlLXN0cmluZy1yZWdleHAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9zdHlsZS9zdHlsZS5jc3M/YmNmMiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvaWdub3JlZHwvbW50L2MvVXNlcnMvZ2VuZXMvRGVza3RvcC9Db2RpbmcvVE9QL2JhdHRsZXNoaXAtZ2FtZS9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWJ8Li90ZXJtaW5hbC1oaWdobGlnaHQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC9pZ25vcmVkfC9tbnQvYy9Vc2Vycy9nZW5lcy9EZXNrdG9wL0NvZGluZy9UT1AvYmF0dGxlc2hpcC1nYW1lL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYnxmcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL2lnbm9yZWR8L21udC9jL1VzZXJzL2dlbmVzL0Rlc2t0b3AvQ29kaW5nL1RPUC9iYXR0bGVzaGlwLWdhbWUvbm9kZV9tb2R1bGVzL3Bvc3Rjc3MvbGlifHBhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC9pZ25vcmVkfC9tbnQvYy9Vc2Vycy9nZW5lcy9EZXNrdG9wL0NvZGluZy9UT1AvYmF0dGxlc2hpcC1nYW1lL25vZGVfbW9kdWxlcy9wb3N0Y3NzL2xpYnxzb3VyY2UtbWFwLWpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvaWdub3JlZHwvbW50L2MvVXNlcnMvZ2VuZXMvRGVza3RvcC9Db2RpbmcvVE9QL2JhdHRsZXNoaXAtZ2FtZS9ub2RlX21vZHVsZXMvcG9zdGNzcy9saWJ8dXJsIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbmFub2lkL25vbi1zZWN1cmUvaW5kZXguY2pzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5pdGlhbGl6ZVBsYXllcnN9IGZyb20gXCIuL2dhbWVMb29wLmpzXCJcclxuLy8gaW1wb3J0IHtjcmVhdGVHYW1lQm9hcmR9IGZyb20gXCIuL2ZhY3Rvcmllcy9nYW1lQm9hcmQuanNcIlxyXG5cclxuXHJcbi8vaGFuZGxlcyBzdGFydCBtZW51IGFza2luZyBmb3IgcGxheWVyJ3MgbmFtZVxyXG5mdW5jdGlvbiBkaXNwbGF5U3RhcnRNZW51KCl7XHJcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XHJcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XHJcblxyXG4gICAgY29uc3Qgc3RhcnRNZW51ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgIGNvbnN0IG5hbWVQcm9tcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZm9ybVwiKTtcclxuICAgIGNvbnN0IHN0YXJ0QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcclxuXHJcbiAgICAvL2hpZGUgbWFpbiB3aGlsZSBzdGFydE1lbnUgaXMgYmVpbmcgZGlzcGxheWVkXHJcbiAgICBtYWluLnN0eWxlLmRpc3BsYXk9XCJub25lXCI7XHJcblxyXG4gICAgc3RhcnRNZW51LmNsYXNzTGlzdC5hZGQoXCJvdmVybGF5XCIpO1xyXG4gICAgbmFtZVByb21wdC5jbGFzc0xpc3QuYWRkKFwidXNlci1mb3JtXCIpO1xyXG5cclxuICAgIHN0YXJ0TWVudS5hcHBlbmRDaGlsZChuYW1lUHJvbXB0KTtcclxuICAgIG5hbWVQcm9tcHQuaW5uZXJIVE1MID0gXCI8bGFiZWwgZm9yPXVzZXJuYW1lPkVudGVyIHlvdXIgdXNlcm5hbWU6IDwvbGFiZWw+PGlucHV0IHR5cGU9dGV4dCBuYW1lPXVzZXJuYW1lIGlkPXVzZXJuYW1lPlwiXHJcbiAgICBuYW1lUHJvbXB0LmFwcGVuZENoaWxkKHN0YXJ0QnV0dG9uKTtcclxuICAgIHN0YXJ0QnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIixcInN1Ym1pdFwiKTtcclxuICAgIHN0YXJ0QnV0dG9uLmlubmVyVGV4dCA9IFwiQ29udGludWVcIjtcclxuXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZShzdGFydE1lbnUsbWFpbik7XHJcbiAgICBzdGFydEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixyZW1vdmVTdGFydE1lbnUpO1xyXG59XHJcblxyXG4vL2hpZGVzIHN0YXJ0IG1lbnUgYWZ0ZXIgcGxheWVyIHR5cGVzIGluIG5hbWVcclxuZnVuY3Rpb24gcmVtb3ZlU3RhcnRNZW51KGUpe1xyXG4gICAgY29uc3Qgc3RhcnRNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5vdmVybGF5XCIpO1xyXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdXNlcm5hbWVcIikudmFsdWU7XHJcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIm1haW5cIik7XHJcblxyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmKG5hbWUubGVuZ3RoID09IDAgfHwgIW5hbWUubWF0Y2goL15bYS16MC05XSskL2kpKXtcclxuICAgICAgICBhbGVydChcIkludmFsaWQgbmFtZSwgdHJ5IGFnYWluIG9ubHkgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgYW5kIHdpdGhvdXQgc3BhY2VzXCIpO1xyXG5cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHN0YXJ0TWVudS5yZW1vdmUoKTtcclxuICAgICAgICBtYWluLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wiO1xyXG4gICAgICAgIGluaXRpYWxpemVQbGF5ZXJzKG5hbWUpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vL3NlbGVjdGlvbiBtZW51IGZvciBzaGlwc1xyXG5mdW5jdGlvbiBkaXNwbGF5U2VsZWN0aW9uTWVudSgpe1xyXG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xyXG4gICAgY29uc3QgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtYWluXCIpO1xyXG5cclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICBjb25zdCBzZWxlY3Rpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgY29uc3QgZGlyZWN0aW9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcclxuICAgIGNvbnN0IHJvdGF0ZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XHJcblxyXG4gICAgZGlyZWN0aW9ucy50ZXh0Q29udGVudCA9IFwiUGxhY2UgeW91ciBzaGlwXCI7XHJcbiAgICByb3RhdGVCdG4udGV4dENvbnRlbnQgPSBcIlJvdGF0ZVwiO1xyXG5cclxuICAgIHNlbGVjdGlvbkRpdi5hcHBlbmRDaGlsZChkaXJlY3Rpb25zKTtcclxuICAgIHNlbGVjdGlvbkRpdi5hcHBlbmRDaGlsZChyb3RhdGVCdG4pO1xyXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNlbGVjdGlvbkRpdik7XHJcblxyXG4gICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoXCJvdmVybGF5XCIpO1xyXG4gICAgc2VsZWN0aW9uRGl2LmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RvclwiKTtcclxuXHJcbiAgICBib2R5Lmluc2VydEJlZm9yZShjb250YWluZXIsbWFpbik7XHJcbiAgICBzaGlwU2VsZWN0aW9uKCk7XHJcbn1cclxuXHJcbi8vZ2VuZXJhdGUgMTB4MTAgZ3JpZCB1c2luZyBDU1MvSlNcclxuZnVuY3Rpb24gY3JlYXRlR3JpZCgpe1xyXG4gICAgY29uc3QgcGFyZW50Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5zZWxlY3RvclwiKTtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcblxyXG4gICAgZm9yKGxldCB4ID0gMTsgeCA8PSAxMDsgeCsrKXtcclxuICAgICAgICBmb3IobGV0IHkgPSAxOyB5IDw9IDEwOyB5Kyspe1xyXG4gICAgICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcclxuICAgICAgICAgICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJpZFwiLGAke3h9LSR7eX1gKTtcclxuICAgICAgICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VvdmVyXCIscHJldmlld1BsYWNlbWVudCk7XHJcbiAgICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsYXR0ZW1wdFBsYWNlbWVudClcclxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNlbGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZChcImdyaWRcIik7XHJcblxyXG4gICAgcGFyZW50Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcbn1cclxuXHJcbi8vaGFuZGxlcyBhY3R1YWwgc2hpcCBzZWxlY3Rpb25cclxuZnVuY3Rpb24gc2hpcFNlbGVjdGlvbigpe1xyXG4gICAgY3JlYXRlR3JpZCgpO1xyXG5cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiByZXNldFNlbGVjdGlvbigpe1xyXG5cclxufVxyXG5cclxuZXhwb3J0IHtkaXNwbGF5U3RhcnRNZW51LCBkaXNwbGF5U2VsZWN0aW9uTWVudX0iLCJpbXBvcnQgc2FuaXRpemVIdG1sIGZyb20gXCJzYW5pdGl6ZS1odG1sXCI7XHJcblxyXG5jb25zdCBwbGF5ZXIgPSAobmFtZSkgPT4ge1xyXG4gICAgbGV0IHBsYXllck5hbWUgPSBzYW5pdGl6ZUh0bWwobmFtZSk7XHJcbiAgICBsZXQgaXNDdXJyZW50bHlQbGF5aW5nID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGNvbnN0IGF0dGFjayA9IChjb29yZHMsYm9hcmQsdHVybikgPT4ge1xyXG4gICAgICAgIHR1cm4gJSAyID09IDAgPyBpc0N1cnJlbnRseVBsYXlpbmcgPSB0cnVlIDogaXNDdXJyZW50bHlQbGF5aW5nID0gZmFsc2UgXHJcbiAgICAgICAgaWYgKGlzQ3VycmVudGx5UGxheWluZyA9PSB0cnVlKXtcclxuICAgICAgICAgICAgYm9hcmQucmVjZWl2ZUF0dGFjayhjb29yZHMpOyAvL2RvZXNudCB0ZWxsIHVzIGlmIGF0dGFjayB3YXMgc3VjY2Vzc2Z1bC9ub3Qgc3VjY2Vzc2Z1bC9yZWR1bmRhbnRcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGdldE5hbWUgPSAoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHBsYXllck5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNIdW1hbiA9ICgpID0+IHRydWVcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGF0dGFjayxcclxuICAgICAgICBnZXROYW1lLFxyXG4gICAgICAgIGlzSHVtYW5cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNvbnN0IEFJID0gKCkgPT4ge1xyXG4gICAgbGV0IGlzQ3VycmVudGx5UGxheWluZyA9IGZhbHNlO1xyXG4gICAgY29uc3Qge2dldE5hbWV9ID0gcGxheWVyKFwiQUlcIik7XHJcblxyXG4gICAgLy9yYW5kb21seSBhdHRhY2tzIGxvY2F0aW9uXHJcbiAgICBjb25zdCBhdHRhY2sgPSAoYm9hcmQsdHVybikgPT4ge1xyXG4gICAgICAgIHR1cm4gJSAyID09IDAgPyBpc0N1cnJlbnRseVBsYXlpbmcgPSBmYWxzZSA6IGlzQ3VycmVudGx5UGxheWluZyA9IHRydWVcclxuICAgICAgICBpZiAoaXNDdXJyZW50bHlQbGF5aW5nID09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvb3JkcyA9IGdldFJhbmRvbUNvb3JkaW5hdGUoKTtcclxuICAgICAgICAgICAgICAgIGJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgY29uc3QgZ2V0UmFuZG9tQ29vcmRpbmF0ZSA9ICgpID0+IHtcclxuICAgICAgICBsZXQgcmFuZG9tWCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDExKTtcclxuICAgICAgICBsZXQgcmFuZG9tWSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDExKTtcclxuICAgICAgICByZXR1cm4gW3JhbmRvbVgscmFuZG9tWV07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgaXNIdW1hbiA9ICgpID0+IGZhbHNlXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhdHRhY2ssXHJcbiAgICAgICAgZ2V0TmFtZSxcclxuICAgICAgICBpc0h1bWFuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4vL2xldHMgQUkgZGV0ZXJtaW5lIGhvdyB0byBsb2NrIG9uIHRvIGFkamFjZW50IHBvaW50cyBhZnRlciBpdCBnZXRzIGEgaGl0IG9udG8gYSBwb2ludFxyXG5mdW5jdGlvbiBzbWFydERldGVjdGlvbigpe1xyXG5cclxufVxyXG5cclxuXHJcbmV4cG9ydCB7IHBsYXllciwgQUkgfTtcclxuIiwiaW1wb3J0IHtkaXNwbGF5U3RhcnRNZW51LGRpc3BsYXlTZWxlY3Rpb25NZW51fSBmcm9tIFwiLi9VSS5qc1wiXHJcbmltcG9ydCB7cGxheWVyLEFJfSBmcm9tIFwiLi9mYWN0b3JpZXMvcGxheWVyLmpzXCJcclxuLy8gaW1wb3J0IHtjcmVhdGVHYW1lQm9hcmR9IGZyb20gXCIuL2ZhY3Rvcmllcy9nYW1lQm9hcmQuanNcIlxyXG5cclxubGV0IGh1bWFuUGxyO1xyXG5jb25zdCBBSVBsciA9IEFJKCk7XHJcblxyXG5mdW5jdGlvbiBydW5HYW1lTG9vcCgpe1xyXG4gICAgZGlzcGxheVN0YXJ0TWVudSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0aWFsaXplUGxheWVycyhuYW1lKXtcclxuICAgIGh1bWFuUGxyID0gcGxheWVyKG5hbWUpO1xyXG4gICAgY29uc3QgcGxySGVhZGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcGxheWVyMVwiKS5xdWVyeVNlbGVjdG9yKFwiaDJcIik7XHJcblxyXG4gICAgcGxySGVhZGluZy50ZXh0Q29udGVudCA9IGh1bWFuUGxyLmdldE5hbWUoKTtcclxuICAgIGRpc3BsYXlTZWxlY3Rpb25NZW51KCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpe1xyXG5cclxufVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQge3J1bkdhbWVMb29wLCBpbml0aWFsaXplUGxheWVycywgc3RhcnRHYW1lfSIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9pbWcvaGVhZGluZy5wbmdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIqIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG5odG1sLGJvZHkge1xcclxcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNzgsIDc4LCAyMjgpO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG5oZWFkZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXCIgKyBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fICsgXCIpIHBhZGRpbmctYm94IG5vLXJlcGVhdCBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjdlbSA4ZW07XFxyXFxuICAgIHBhZGRpbmc6IDRlbTtcXHJcXG59XFxyXFxuXFxyXFxubWFpbiB7XFxyXFxuICAgIG1pbi1oZWlnaHQ6IDc1dmg7XFxyXFxufVxcclxcblxcclxcbi8qbGF5b3V0IG9mIGJvYXJkcyAqL1xcclxcbi5ib2FyZC1jb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgZ2FwOiAxNWVtO1xcclxcblxcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxuXFxyXFxufVxcclxcblxcclxcbi5ib2FyZCB7XFxyXFxuICAgIGhlaWdodDogMzVlbTtcXHJcXG4gICAgd2lkdGg6IDMwZW07XFxyXFxuXFxyXFxuICAgIHBhZGRpbmc6IDJlbTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uYm9hcmQgaDIge1xcclxcbiAgICBmb250LXNpemU6IDIuNWVtO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi8qaGlkZSBtYWluIGVsZW1lbnQgKi9cXHJcXG4ub3ZlcmxheSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXHJcXG5cXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMmVtO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjEsIDEyOSwgMjE4KTtcXHJcXG4gICAgei1pbmRleDogMTtcXHJcXG59XFxyXFxuXFxyXFxuLypzdGFydCBtZW51ICovXFxyXFxuLnVzZXItZm9ybXtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgbWFyZ2luLXRvcDogMTBlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnVzZXItZm9ybSBsYWJlbCB7XFxyXFxuICAgIHBhZGRpbmc6IDAuNWVtO1xcclxcblxcclxcbiAgICBmb250LXNpemU6IDEuNGVtO1xcclxcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcclxcbiAgICBjb2xvcjogcmdiKDEsIDIyLCA1Nik7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbn1cXHJcXG5cXHJcXG4udXNlci1mb3JtIGlucHV0IHtcXHJcXG4gICAgcGFkZGluZzogMC44ZW07XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcblxcclxcbiAgICBmb250LXNpemU6IDEuMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4udXNlci1mb3JtIGJ1dHRvbiB7XFxyXFxuICAgIHBhZGRpbmc6IDFlbTtcXHJcXG4gICAgbWFyZ2luOiAxZW07XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig0NSwgMTQ3LCAyNDMpO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICBib3JkZXI6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi51c2VyLWZvcm0gYnV0dG9uOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDcsIDg3LCAyMzYpO1xcclxcbn1cXHJcXG5cXHJcXG4vKnNlbGVjdGlvbiBtZW51IGZvciBzaGlwcyAqL1xcclxcbi5zZWxlY3RvciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIFxcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNlbGVjdG9yIGgyIHtcXHJcXG4gICAgY29sb3I6cmdiKDEsIDIyLCA1Nik7XFxyXFxuICAgIGZvbnQtc2l6ZTogMmVtO1xcclxcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcclxcbiAgICBsZXR0ZXItc3BhY2luZzogMC4wMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2VsZWN0b3IgYnV0dG9uIHtcXHJcXG4gICAgbWFyZ2luOiAxLjJlbSAwO1xcclxcbiAgICBwYWRkaW5nOiAwLjdlbTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZDogYmx1ZTtcXHJcXG4gICAgZm9udC1zaXplOiAxLjJlbTtcXHJcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXHJcXG4gICAgY29sb3I6d2hpdGU7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLnNlbGVjdG9yIGJ1dHRvbjpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzLCA2NSwgMTgwKTtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWR7XFxyXFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDFmcik7XFxyXFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLDFmcik7XFxyXFxuICAgIGdyaWQtZ2FwOiAwLjJlbSAwLjJlbTtcXHJcXG5cXHJcXG4gICAgaGVpZ2h0OiA1MCU7XFxyXFxuICAgIHdpZHRoOiAyNSU7XFxyXFxufVxcclxcblxcclxcbi5ncmlkIC5jZWxse1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjA3LCAyMDYsIDIwNik7XFxyXFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZS9zdHlsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7SUFDSSxTQUFTO0lBQ1QsVUFBVTtJQUNWLHNCQUFzQjtBQUMxQjs7QUFFQTtJQUNJLGlCQUFpQjtJQUNqQixZQUFZO0lBQ1osNEJBQTRCO0FBQ2hDOzs7QUFHQTtJQUNJLGdGQUFrRTtJQUNsRSx5QkFBeUI7SUFDekIsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQSxvQkFBb0I7QUFDcEI7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2QixtQkFBbUI7SUFDbkIsU0FBUzs7SUFFVCxlQUFlOztBQUVuQjs7QUFFQTtJQUNJLFlBQVk7SUFDWixXQUFXOztJQUVYLFlBQVk7SUFDWixrQkFBa0I7QUFDdEI7O0FBRUE7SUFDSSxnQkFBZ0I7SUFDaEIsWUFBWTtBQUNoQjs7QUFFQSxxQkFBcUI7QUFDckI7SUFDSSxhQUFhO0lBQ2IsbUJBQW1CO0lBQ25CLHVCQUF1QjtJQUN2Qix1QkFBdUI7O0lBRXZCLGVBQWU7SUFDZixXQUFXO0lBQ1gsYUFBYTtJQUNiLGVBQWU7O0lBRWYsNkJBQTZCO0lBQzdCLFVBQVU7QUFDZDs7QUFFQSxjQUFjO0FBQ2Q7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjs7SUFFbkIsZ0JBQWdCO0FBQ3BCOztBQUVBO0lBQ0ksY0FBYzs7SUFFZCxnQkFBZ0I7SUFDaEIseUJBQXlCO0lBQ3pCLHFCQUFxQjtJQUNyQixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxjQUFjO0lBQ2QsV0FBVzs7SUFFWCxnQkFBZ0I7QUFDcEI7O0FBRUE7SUFDSSxZQUFZO0lBQ1osV0FBVzs7SUFFWCw2QkFBNkI7SUFDN0IsWUFBWTtJQUNaLHlCQUF5QjtJQUN6QixpQkFBaUI7SUFDakIsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQSw0QkFBNEI7QUFDNUI7SUFDSSxhQUFhO0lBQ2Isc0JBQXNCO0lBQ3RCLG1CQUFtQjs7SUFFbkIsV0FBVztJQUNYLFlBQVk7SUFDWixpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxvQkFBb0I7SUFDcEIsY0FBYztJQUNkLHlCQUF5QjtJQUN6QixzQkFBc0I7QUFDMUI7O0FBRUE7SUFDSSxlQUFlO0lBQ2YsY0FBYzs7SUFFZCxnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLHlCQUF5QjtJQUN6QixXQUFXO0lBQ1gsWUFBWTtBQUNoQjs7QUFFQTtJQUNJLDJCQUEyQjtBQUMvQjs7QUFFQTtJQUNJLGFBQWE7SUFDYixxQ0FBcUM7SUFDckMsa0NBQWtDO0lBQ2xDLHFCQUFxQjs7SUFFckIsV0FBVztJQUNYLFVBQVU7QUFDZDs7QUFFQTtJQUNJLDhCQUE4QjtBQUNsQ1wiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcclxcbn1cXHJcXG5cXHJcXG5odG1sLGJvZHkge1xcclxcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoNzgsIDc4LCAyMjgpO1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG5oZWFkZXIge1xcclxcbiAgICBiYWNrZ3JvdW5kOiB1cmwoXFxcIi4uL2ltZy9oZWFkaW5nLnBuZ1xcXCIpIHBhZGRpbmctYm94IG5vLXJlcGVhdCBjZW50ZXI7XFxyXFxuICAgIGJhY2tncm91bmQtc2l6ZTogMjdlbSA4ZW07XFxyXFxuICAgIHBhZGRpbmc6IDRlbTtcXHJcXG59XFxyXFxuXFxyXFxubWFpbiB7XFxyXFxuICAgIG1pbi1oZWlnaHQ6IDc1dmg7XFxyXFxufVxcclxcblxcclxcbi8qbGF5b3V0IG9mIGJvYXJkcyAqL1xcclxcbi5ib2FyZC1jb250YWluZXIge1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xcclxcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG4gICAgZ2FwOiAxNWVtO1xcclxcblxcclxcbiAgICBtYXJnaW4tdG9wOiAxZW07XFxyXFxuXFxyXFxufVxcclxcblxcclxcbi5ib2FyZCB7XFxyXFxuICAgIGhlaWdodDogMzVlbTtcXHJcXG4gICAgd2lkdGg6IDMwZW07XFxyXFxuXFxyXFxuICAgIHBhZGRpbmc6IDJlbTtcXHJcXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcclxcbn1cXHJcXG5cXHJcXG4uYm9hcmQgaDIge1xcclxcbiAgICBmb250LXNpemU6IDIuNWVtO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxufVxcclxcblxcclxcbi8qaGlkZSBtYWluIGVsZW1lbnQgKi9cXHJcXG4ub3ZlcmxheSB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxyXFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcclxcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcXHJcXG5cXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDB2aDtcXHJcXG4gICAgbWFyZ2luLXRvcDogMmVtO1xcclxcblxcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjEsIDEyOSwgMjE4KTtcXHJcXG4gICAgei1pbmRleDogMTtcXHJcXG59XFxyXFxuXFxyXFxuLypzdGFydCBtZW51ICovXFxyXFxuLnVzZXItZm9ybXtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXHJcXG5cXHJcXG4gICAgbWFyZ2luLXRvcDogMTBlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnVzZXItZm9ybSBsYWJlbCB7XFxyXFxuICAgIHBhZGRpbmc6IDAuNWVtO1xcclxcblxcclxcbiAgICBmb250LXNpemU6IDEuNGVtO1xcclxcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcclxcbiAgICBjb2xvcjogcmdiKDEsIDIyLCA1Nik7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbn1cXHJcXG5cXHJcXG4udXNlci1mb3JtIGlucHV0IHtcXHJcXG4gICAgcGFkZGluZzogMC44ZW07XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcblxcclxcbiAgICBmb250LXNpemU6IDEuMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4udXNlci1mb3JtIGJ1dHRvbiB7XFxyXFxuICAgIHBhZGRpbmc6IDFlbTtcXHJcXG4gICAgbWFyZ2luOiAxZW07XFxyXFxuXFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYig0NSwgMTQ3LCAyNDMpO1xcclxcbiAgICBjb2xvcjogd2hpdGU7XFxyXFxuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XFxyXFxuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xcclxcbiAgICBib3JkZXI6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbi51c2VyLWZvcm0gYnV0dG9uOmhvdmVyIHtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDcsIDg3LCAyMzYpO1xcclxcbn1cXHJcXG5cXHJcXG4vKnNlbGVjdGlvbiBtZW51IGZvciBzaGlwcyAqL1xcclxcbi5zZWxlY3RvciB7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxyXFxuICAgIFxcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBtYXJnaW4tdG9wOiAzLjVlbTtcXHJcXG59XFxyXFxuXFxyXFxuLnNlbGVjdG9yIGgyIHtcXHJcXG4gICAgY29sb3I6cmdiKDEsIDIyLCA1Nik7XFxyXFxuICAgIGZvbnQtc2l6ZTogMmVtO1xcclxcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcclxcbiAgICBsZXR0ZXItc3BhY2luZzogMC4wMWVtO1xcclxcbn1cXHJcXG5cXHJcXG4uc2VsZWN0b3IgYnV0dG9uIHtcXHJcXG4gICAgbWFyZ2luOiAxLjJlbSAwO1xcclxcbiAgICBwYWRkaW5nOiAwLjdlbTtcXHJcXG5cXHJcXG4gICAgYmFja2dyb3VuZDogYmx1ZTtcXHJcXG4gICAgZm9udC1zaXplOiAxLjJlbTtcXHJcXG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcXHJcXG4gICAgY29sb3I6d2hpdGU7XFxyXFxuICAgIGJvcmRlcjogbm9uZTtcXHJcXG59XFxyXFxuXFxyXFxuLnNlbGVjdG9yIGJ1dHRvbjpob3ZlciB7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYigzLCA2NSwgMTgwKTtcXHJcXG59XFxyXFxuXFxyXFxuLmdyaWR7XFxyXFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxyXFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLDFmcik7XFxyXFxuICAgIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDEwLDFmcik7XFxyXFxuICAgIGdyaWQtZ2FwOiAwLjJlbSAwLjJlbTtcXHJcXG5cXHJcXG4gICAgaGVpZ2h0OiA1MCU7XFxyXFxuICAgIHdpZHRoOiAyNSU7XFxyXFxufVxcclxcblxcclxcbi5ncmlkIC5jZWxse1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjA3LCAyMDYsIDIwNik7XFxyXFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cblxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuXG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07IC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cblxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuXG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblxuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuXG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG5cbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7IC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfSAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG5cblxuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblxuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGlzTWVyZ2VhYmxlT2JqZWN0ID0gZnVuY3Rpb24gaXNNZXJnZWFibGVPYmplY3QodmFsdWUpIHtcblx0cmV0dXJuIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSlcblx0XHQmJiAhaXNTcGVjaWFsKHZhbHVlKVxufTtcblxuZnVuY3Rpb24gaXNOb25OdWxsT2JqZWN0KHZhbHVlKSB7XG5cdHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gaXNTcGVjaWFsKHZhbHVlKSB7XG5cdHZhciBzdHJpbmdWYWx1ZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yO1xudmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IGNhblVzZVN5bWJvbCA/IFN5bWJvbC5mb3IoJ3JlYWN0LmVsZW1lbnQnKSA6IDB4ZWFjNztcblxuZnVuY3Rpb24gaXNSZWFjdEVsZW1lbnQodmFsdWUpIHtcblx0cmV0dXJuIHZhbHVlLiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbn1cblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gZ2V0TWVyZ2VGdW5jdGlvbihrZXksIG9wdGlvbnMpIHtcblx0aWYgKCFvcHRpb25zLmN1c3RvbU1lcmdlKSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZVxuXHR9XG5cdHZhciBjdXN0b21NZXJnZSA9IG9wdGlvbnMuY3VzdG9tTWVyZ2Uoa2V5KTtcblx0cmV0dXJuIHR5cGVvZiBjdXN0b21NZXJnZSA9PT0gJ2Z1bmN0aW9uJyA/IGN1c3RvbU1lcmdlIDogZGVlcG1lcmdlXG59XG5cbmZ1bmN0aW9uIGdldEVudW1lcmFibGVPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzXG5cdFx0PyBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkuZmlsdGVyKGZ1bmN0aW9uKHN5bWJvbCkge1xuXHRcdFx0cmV0dXJuIHRhcmdldC5wcm9wZXJ0eUlzRW51bWVyYWJsZShzeW1ib2wpXG5cdFx0fSlcblx0XHQ6IFtdXG59XG5cbmZ1bmN0aW9uIGdldEtleXModGFyZ2V0KSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyh0YXJnZXQpLmNvbmNhdChnZXRFbnVtZXJhYmxlT3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpXG59XG5cbmZ1bmN0aW9uIHByb3BlcnR5SXNPbk9iamVjdChvYmplY3QsIHByb3BlcnR5KSB7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHByb3BlcnR5IGluIG9iamVjdFxuXHR9IGNhdGNoKF8pIHtcblx0XHRyZXR1cm4gZmFsc2Vcblx0fVxufVxuXG4vLyBQcm90ZWN0cyBmcm9tIHByb3RvdHlwZSBwb2lzb25pbmcgYW5kIHVuZXhwZWN0ZWQgbWVyZ2luZyB1cCB0aGUgcHJvdG90eXBlIGNoYWluLlxuZnVuY3Rpb24gcHJvcGVydHlJc1Vuc2FmZSh0YXJnZXQsIGtleSkge1xuXHRyZXR1cm4gcHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAvLyBQcm9wZXJ0aWVzIGFyZSBzYWZlIHRvIG1lcmdlIGlmIHRoZXkgZG9uJ3QgZXhpc3QgaW4gdGhlIHRhcmdldCB5ZXQsXG5cdFx0JiYgIShPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkgLy8gdW5zYWZlIGlmIHRoZXkgZXhpc3QgdXAgdGhlIHByb3RvdHlwZSBjaGFpbixcblx0XHRcdCYmIE9iamVjdC5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRhcmdldCwga2V5KSkgLy8gYW5kIGFsc28gdW5zYWZlIGlmIHRoZXkncmUgbm9uZW51bWVyYWJsZS5cbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0dmFyIGRlc3RpbmF0aW9uID0ge307XG5cdGlmIChvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHRhcmdldCkpIHtcblx0XHRnZXRLZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucyk7XG5cdFx0fSk7XG5cdH1cblx0Z2V0S2V5cyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG5cdFx0aWYgKHByb3BlcnR5SXNVbnNhZmUodGFyZ2V0LCBrZXkpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHRpZiAocHJvcGVydHlJc09uT2JqZWN0KHRhcmdldCwga2V5KSAmJiBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0KHNvdXJjZVtrZXldKSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGdldE1lcmdlRnVuY3Rpb24oa2V5LCBvcHRpb25zKSh0YXJnZXRba2V5XSwgc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoc291cmNlW2tleV0sIG9wdGlvbnMpO1xuXHRcdH1cblx0fSk7XG5cdHJldHVybiBkZXN0aW5hdGlvblxufVxuXG5mdW5jdGlvbiBkZWVwbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXJyYXlNZXJnZSA9IG9wdGlvbnMuYXJyYXlNZXJnZSB8fCBkZWZhdWx0QXJyYXlNZXJnZTtcblx0b3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCA9IG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgfHwgaXNNZXJnZWFibGVPYmplY3Q7XG5cdC8vIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkIGlzIGFkZGVkIHRvIGBvcHRpb25zYCBzbyB0aGF0IGN1c3RvbSBhcnJheU1lcmdlKClcblx0Ly8gaW1wbGVtZW50YXRpb25zIGNhbiB1c2UgaXQuIFRoZSBjYWxsZXIgbWF5IG5vdCByZXBsYWNlIGl0LlxuXHRvcHRpb25zLmNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkID0gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQ7XG5cblx0dmFyIHNvdXJjZUlzQXJyYXkgPSBBcnJheS5pc0FycmF5KHNvdXJjZSk7XG5cdHZhciB0YXJnZXRJc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpO1xuXHR2YXIgc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCA9IHNvdXJjZUlzQXJyYXkgPT09IHRhcmdldElzQXJyYXk7XG5cblx0aWYgKCFzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoKSB7XG5cdFx0cmV0dXJuIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIGlmIChzb3VyY2VJc0FycmF5KSB7XG5cdFx0cmV0dXJuIG9wdGlvbnMuYXJyYXlNZXJnZSh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucylcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH1cbn1cblxuZGVlcG1lcmdlLmFsbCA9IGZ1bmN0aW9uIGRlZXBtZXJnZUFsbChhcnJheSwgb3B0aW9ucykge1xuXHRpZiAoIUFycmF5LmlzQXJyYXkoYXJyYXkpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdmaXJzdCBhcmd1bWVudCBzaG91bGQgYmUgYW4gYXJyYXknKVxuXHR9XG5cblx0cmV0dXJuIGFycmF5LnJlZHVjZShmdW5jdGlvbihwcmV2LCBuZXh0KSB7XG5cdFx0cmV0dXJuIGRlZXBtZXJnZShwcmV2LCBuZXh0LCBvcHRpb25zKVxuXHR9LCB7fSlcbn07XG5cbnZhciBkZWVwbWVyZ2VfMSA9IGRlZXBtZXJnZTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWVwbWVyZ2VfMTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hdHRyaWJ1dGVOYW1lcyA9IGV4cG9ydHMuZWxlbWVudE5hbWVzID0gdm9pZCAwO1xuZXhwb3J0cy5lbGVtZW50TmFtZXMgPSBuZXcgTWFwKFtcbiAgICBbXCJhbHRnbHlwaFwiLCBcImFsdEdseXBoXCJdLFxuICAgIFtcImFsdGdseXBoZGVmXCIsIFwiYWx0R2x5cGhEZWZcIl0sXG4gICAgW1wiYWx0Z2x5cGhpdGVtXCIsIFwiYWx0R2x5cGhJdGVtXCJdLFxuICAgIFtcImFuaW1hdGVjb2xvclwiLCBcImFuaW1hdGVDb2xvclwiXSxcbiAgICBbXCJhbmltYXRlbW90aW9uXCIsIFwiYW5pbWF0ZU1vdGlvblwiXSxcbiAgICBbXCJhbmltYXRldHJhbnNmb3JtXCIsIFwiYW5pbWF0ZVRyYW5zZm9ybVwiXSxcbiAgICBbXCJjbGlwcGF0aFwiLCBcImNsaXBQYXRoXCJdLFxuICAgIFtcImZlYmxlbmRcIiwgXCJmZUJsZW5kXCJdLFxuICAgIFtcImZlY29sb3JtYXRyaXhcIiwgXCJmZUNvbG9yTWF0cml4XCJdLFxuICAgIFtcImZlY29tcG9uZW50dHJhbnNmZXJcIiwgXCJmZUNvbXBvbmVudFRyYW5zZmVyXCJdLFxuICAgIFtcImZlY29tcG9zaXRlXCIsIFwiZmVDb21wb3NpdGVcIl0sXG4gICAgW1wiZmVjb252b2x2ZW1hdHJpeFwiLCBcImZlQ29udm9sdmVNYXRyaXhcIl0sXG4gICAgW1wiZmVkaWZmdXNlbGlnaHRpbmdcIiwgXCJmZURpZmZ1c2VMaWdodGluZ1wiXSxcbiAgICBbXCJmZWRpc3BsYWNlbWVudG1hcFwiLCBcImZlRGlzcGxhY2VtZW50TWFwXCJdLFxuICAgIFtcImZlZGlzdGFudGxpZ2h0XCIsIFwiZmVEaXN0YW50TGlnaHRcIl0sXG4gICAgW1wiZmVkcm9wc2hhZG93XCIsIFwiZmVEcm9wU2hhZG93XCJdLFxuICAgIFtcImZlZmxvb2RcIiwgXCJmZUZsb29kXCJdLFxuICAgIFtcImZlZnVuY2FcIiwgXCJmZUZ1bmNBXCJdLFxuICAgIFtcImZlZnVuY2JcIiwgXCJmZUZ1bmNCXCJdLFxuICAgIFtcImZlZnVuY2dcIiwgXCJmZUZ1bmNHXCJdLFxuICAgIFtcImZlZnVuY3JcIiwgXCJmZUZ1bmNSXCJdLFxuICAgIFtcImZlZ2F1c3NpYW5ibHVyXCIsIFwiZmVHYXVzc2lhbkJsdXJcIl0sXG4gICAgW1wiZmVpbWFnZVwiLCBcImZlSW1hZ2VcIl0sXG4gICAgW1wiZmVtZXJnZVwiLCBcImZlTWVyZ2VcIl0sXG4gICAgW1wiZmVtZXJnZW5vZGVcIiwgXCJmZU1lcmdlTm9kZVwiXSxcbiAgICBbXCJmZW1vcnBob2xvZ3lcIiwgXCJmZU1vcnBob2xvZ3lcIl0sXG4gICAgW1wiZmVvZmZzZXRcIiwgXCJmZU9mZnNldFwiXSxcbiAgICBbXCJmZXBvaW50bGlnaHRcIiwgXCJmZVBvaW50TGlnaHRcIl0sXG4gICAgW1wiZmVzcGVjdWxhcmxpZ2h0aW5nXCIsIFwiZmVTcGVjdWxhckxpZ2h0aW5nXCJdLFxuICAgIFtcImZlc3BvdGxpZ2h0XCIsIFwiZmVTcG90TGlnaHRcIl0sXG4gICAgW1wiZmV0aWxlXCIsIFwiZmVUaWxlXCJdLFxuICAgIFtcImZldHVyYnVsZW5jZVwiLCBcImZlVHVyYnVsZW5jZVwiXSxcbiAgICBbXCJmb3JlaWdub2JqZWN0XCIsIFwiZm9yZWlnbk9iamVjdFwiXSxcbiAgICBbXCJnbHlwaHJlZlwiLCBcImdseXBoUmVmXCJdLFxuICAgIFtcImxpbmVhcmdyYWRpZW50XCIsIFwibGluZWFyR3JhZGllbnRcIl0sXG4gICAgW1wicmFkaWFsZ3JhZGllbnRcIiwgXCJyYWRpYWxHcmFkaWVudFwiXSxcbiAgICBbXCJ0ZXh0cGF0aFwiLCBcInRleHRQYXRoXCJdLFxuXSk7XG5leHBvcnRzLmF0dHJpYnV0ZU5hbWVzID0gbmV3IE1hcChbXG4gICAgW1wiZGVmaW5pdGlvbnVybFwiLCBcImRlZmluaXRpb25VUkxcIl0sXG4gICAgW1wiYXR0cmlidXRlbmFtZVwiLCBcImF0dHJpYnV0ZU5hbWVcIl0sXG4gICAgW1wiYXR0cmlidXRldHlwZVwiLCBcImF0dHJpYnV0ZVR5cGVcIl0sXG4gICAgW1wiYmFzZWZyZXF1ZW5jeVwiLCBcImJhc2VGcmVxdWVuY3lcIl0sXG4gICAgW1wiYmFzZXByb2ZpbGVcIiwgXCJiYXNlUHJvZmlsZVwiXSxcbiAgICBbXCJjYWxjbW9kZVwiLCBcImNhbGNNb2RlXCJdLFxuICAgIFtcImNsaXBwYXRodW5pdHNcIiwgXCJjbGlwUGF0aFVuaXRzXCJdLFxuICAgIFtcImRpZmZ1c2Vjb25zdGFudFwiLCBcImRpZmZ1c2VDb25zdGFudFwiXSxcbiAgICBbXCJlZGdlbW9kZVwiLCBcImVkZ2VNb2RlXCJdLFxuICAgIFtcImZpbHRlcnVuaXRzXCIsIFwiZmlsdGVyVW5pdHNcIl0sXG4gICAgW1wiZ2x5cGhyZWZcIiwgXCJnbHlwaFJlZlwiXSxcbiAgICBbXCJncmFkaWVudHRyYW5zZm9ybVwiLCBcImdyYWRpZW50VHJhbnNmb3JtXCJdLFxuICAgIFtcImdyYWRpZW50dW5pdHNcIiwgXCJncmFkaWVudFVuaXRzXCJdLFxuICAgIFtcImtlcm5lbG1hdHJpeFwiLCBcImtlcm5lbE1hdHJpeFwiXSxcbiAgICBbXCJrZXJuZWx1bml0bGVuZ3RoXCIsIFwia2VybmVsVW5pdExlbmd0aFwiXSxcbiAgICBbXCJrZXlwb2ludHNcIiwgXCJrZXlQb2ludHNcIl0sXG4gICAgW1wia2V5c3BsaW5lc1wiLCBcImtleVNwbGluZXNcIl0sXG4gICAgW1wia2V5dGltZXNcIiwgXCJrZXlUaW1lc1wiXSxcbiAgICBbXCJsZW5ndGhhZGp1c3RcIiwgXCJsZW5ndGhBZGp1c3RcIl0sXG4gICAgW1wibGltaXRpbmdjb25lYW5nbGVcIiwgXCJsaW1pdGluZ0NvbmVBbmdsZVwiXSxcbiAgICBbXCJtYXJrZXJoZWlnaHRcIiwgXCJtYXJrZXJIZWlnaHRcIl0sXG4gICAgW1wibWFya2VydW5pdHNcIiwgXCJtYXJrZXJVbml0c1wiXSxcbiAgICBbXCJtYXJrZXJ3aWR0aFwiLCBcIm1hcmtlcldpZHRoXCJdLFxuICAgIFtcIm1hc2tjb250ZW50dW5pdHNcIiwgXCJtYXNrQ29udGVudFVuaXRzXCJdLFxuICAgIFtcIm1hc2t1bml0c1wiLCBcIm1hc2tVbml0c1wiXSxcbiAgICBbXCJudW1vY3RhdmVzXCIsIFwibnVtT2N0YXZlc1wiXSxcbiAgICBbXCJwYXRobGVuZ3RoXCIsIFwicGF0aExlbmd0aFwiXSxcbiAgICBbXCJwYXR0ZXJuY29udGVudHVuaXRzXCIsIFwicGF0dGVybkNvbnRlbnRVbml0c1wiXSxcbiAgICBbXCJwYXR0ZXJudHJhbnNmb3JtXCIsIFwicGF0dGVyblRyYW5zZm9ybVwiXSxcbiAgICBbXCJwYXR0ZXJudW5pdHNcIiwgXCJwYXR0ZXJuVW5pdHNcIl0sXG4gICAgW1wicG9pbnRzYXR4XCIsIFwicG9pbnRzQXRYXCJdLFxuICAgIFtcInBvaW50c2F0eVwiLCBcInBvaW50c0F0WVwiXSxcbiAgICBbXCJwb2ludHNhdHpcIiwgXCJwb2ludHNBdFpcIl0sXG4gICAgW1wicHJlc2VydmVhbHBoYVwiLCBcInByZXNlcnZlQWxwaGFcIl0sXG4gICAgW1wicHJlc2VydmVhc3BlY3RyYXRpb1wiLCBcInByZXNlcnZlQXNwZWN0UmF0aW9cIl0sXG4gICAgW1wicHJpbWl0aXZldW5pdHNcIiwgXCJwcmltaXRpdmVVbml0c1wiXSxcbiAgICBbXCJyZWZ4XCIsIFwicmVmWFwiXSxcbiAgICBbXCJyZWZ5XCIsIFwicmVmWVwiXSxcbiAgICBbXCJyZXBlYXRjb3VudFwiLCBcInJlcGVhdENvdW50XCJdLFxuICAgIFtcInJlcGVhdGR1clwiLCBcInJlcGVhdER1clwiXSxcbiAgICBbXCJyZXF1aXJlZGV4dGVuc2lvbnNcIiwgXCJyZXF1aXJlZEV4dGVuc2lvbnNcIl0sXG4gICAgW1wicmVxdWlyZWRmZWF0dXJlc1wiLCBcInJlcXVpcmVkRmVhdHVyZXNcIl0sXG4gICAgW1wic3BlY3VsYXJjb25zdGFudFwiLCBcInNwZWN1bGFyQ29uc3RhbnRcIl0sXG4gICAgW1wic3BlY3VsYXJleHBvbmVudFwiLCBcInNwZWN1bGFyRXhwb25lbnRcIl0sXG4gICAgW1wic3ByZWFkbWV0aG9kXCIsIFwic3ByZWFkTWV0aG9kXCJdLFxuICAgIFtcInN0YXJ0b2Zmc2V0XCIsIFwic3RhcnRPZmZzZXRcIl0sXG4gICAgW1wic3RkZGV2aWF0aW9uXCIsIFwic3RkRGV2aWF0aW9uXCJdLFxuICAgIFtcInN0aXRjaHRpbGVzXCIsIFwic3RpdGNoVGlsZXNcIl0sXG4gICAgW1wic3VyZmFjZXNjYWxlXCIsIFwic3VyZmFjZVNjYWxlXCJdLFxuICAgIFtcInN5c3RlbWxhbmd1YWdlXCIsIFwic3lzdGVtTGFuZ3VhZ2VcIl0sXG4gICAgW1widGFibGV2YWx1ZXNcIiwgXCJ0YWJsZVZhbHVlc1wiXSxcbiAgICBbXCJ0YXJnZXR4XCIsIFwidGFyZ2V0WFwiXSxcbiAgICBbXCJ0YXJnZXR5XCIsIFwidGFyZ2V0WVwiXSxcbiAgICBbXCJ0ZXh0bGVuZ3RoXCIsIFwidGV4dExlbmd0aFwiXSxcbiAgICBbXCJ2aWV3Ym94XCIsIFwidmlld0JveFwiXSxcbiAgICBbXCJ2aWV3dGFyZ2V0XCIsIFwidmlld1RhcmdldFwiXSxcbiAgICBbXCJ4Y2hhbm5lbHNlbGVjdG9yXCIsIFwieENoYW5uZWxTZWxlY3RvclwiXSxcbiAgICBbXCJ5Y2hhbm5lbHNlbGVjdG9yXCIsIFwieUNoYW5uZWxTZWxlY3RvclwiXSxcbiAgICBbXCJ6b29tYW5kcGFuXCIsIFwiem9vbUFuZFBhblwiXSxcbl0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKlxuICogTW9kdWxlIGRlcGVuZGVuY2llc1xuICovXG52YXIgRWxlbWVudFR5cGUgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImRvbWVsZW1lbnR0eXBlXCIpKTtcbnZhciBlbnRpdGllc18xID0gcmVxdWlyZShcImVudGl0aWVzXCIpO1xuLyoqXG4gKiBNaXhlZC1jYXNlIFNWRyBhbmQgTWF0aE1MIHRhZ3MgJiBhdHRyaWJ1dGVzXG4gKiByZWNvZ25pemVkIGJ5IHRoZSBIVE1MIHBhcnNlci5cbiAqXG4gKiBAc2VlIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3BhcnNpbmcuaHRtbCNwYXJzaW5nLW1haW4taW5mb3JlaWduXG4gKi9cbnZhciBmb3JlaWduTmFtZXNfMSA9IHJlcXVpcmUoXCIuL2ZvcmVpZ25OYW1lc1wiKTtcbnZhciB1bmVuY29kZWRFbGVtZW50cyA9IG5ldyBTZXQoW1xuICAgIFwic3R5bGVcIixcbiAgICBcInNjcmlwdFwiLFxuICAgIFwieG1wXCIsXG4gICAgXCJpZnJhbWVcIixcbiAgICBcIm5vZW1iZWRcIixcbiAgICBcIm5vZnJhbWVzXCIsXG4gICAgXCJwbGFpbnRleHRcIixcbiAgICBcIm5vc2NyaXB0XCIsXG5dKTtcbi8qKlxuICogRm9ybWF0IGF0dHJpYnV0ZXNcbiAqL1xuZnVuY3Rpb24gZm9ybWF0QXR0cmlidXRlcyhhdHRyaWJ1dGVzLCBvcHRzKSB7XG4gICAgaWYgKCFhdHRyaWJ1dGVzKVxuICAgICAgICByZXR1cm47XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB2YXIgdmFsdWUgPSAoX2EgPSBhdHRyaWJ1dGVzW2tleV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFwiXCI7XG4gICAgICAgIGlmIChvcHRzLnhtbE1vZGUgPT09IFwiZm9yZWlnblwiKSB7XG4gICAgICAgICAgICAvKiBGaXggdXAgbWl4ZWQtY2FzZSBhdHRyaWJ1dGUgbmFtZXMgKi9cbiAgICAgICAgICAgIGtleSA9IChfYiA9IGZvcmVpZ25OYW1lc18xLmF0dHJpYnV0ZU5hbWVzLmdldChrZXkpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFvcHRzLmVtcHR5QXR0cnMgJiYgIW9wdHMueG1sTW9kZSAmJiB2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIGtleTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ga2V5ICsgXCI9XFxcIlwiICsgKG9wdHMuZGVjb2RlRW50aXRpZXMgIT09IGZhbHNlXG4gICAgICAgICAgICA/IGVudGl0aWVzXzEuZW5jb2RlWE1MKHZhbHVlKVxuICAgICAgICAgICAgOiB2YWx1ZS5yZXBsYWNlKC9cIi9nLCBcIiZxdW90O1wiKSkgKyBcIlxcXCJcIjtcbiAgICB9KVxuICAgICAgICAuam9pbihcIiBcIik7XG59XG4vKipcbiAqIFNlbGYtZW5jbG9zaW5nIHRhZ3NcbiAqL1xudmFyIHNpbmdsZVRhZyA9IG5ldyBTZXQoW1xuICAgIFwiYXJlYVwiLFxuICAgIFwiYmFzZVwiLFxuICAgIFwiYmFzZWZvbnRcIixcbiAgICBcImJyXCIsXG4gICAgXCJjb2xcIixcbiAgICBcImNvbW1hbmRcIixcbiAgICBcImVtYmVkXCIsXG4gICAgXCJmcmFtZVwiLFxuICAgIFwiaHJcIixcbiAgICBcImltZ1wiLFxuICAgIFwiaW5wdXRcIixcbiAgICBcImlzaW5kZXhcIixcbiAgICBcImtleWdlblwiLFxuICAgIFwibGlua1wiLFxuICAgIFwibWV0YVwiLFxuICAgIFwicGFyYW1cIixcbiAgICBcInNvdXJjZVwiLFxuICAgIFwidHJhY2tcIixcbiAgICBcIndiclwiLFxuXSk7XG4vKipcbiAqIFJlbmRlcnMgYSBET00gbm9kZSBvciBhbiBhcnJheSBvZiBET00gbm9kZXMgdG8gYSBzdHJpbmcuXG4gKlxuICogQ2FuIGJlIHRob3VnaHQgb2YgYXMgdGhlIGVxdWl2YWxlbnQgb2YgdGhlIGBvdXRlckhUTUxgIG9mIHRoZSBwYXNzZWQgbm9kZShzKS5cbiAqXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGJlIHJlbmRlcmVkLlxuICogQHBhcmFtIG9wdGlvbnMgQ2hhbmdlcyBzZXJpYWxpemF0aW9uIGJlaGF2aW9yXG4gKi9cbmZ1bmN0aW9uIHJlbmRlcihub2RlLCBvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICB2YXIgbm9kZXMgPSBcImxlbmd0aFwiIGluIG5vZGUgPyBub2RlIDogW25vZGVdO1xuICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgb3V0cHV0ICs9IHJlbmRlck5vZGUobm9kZXNbaV0sIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gb3V0cHV0O1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gcmVuZGVyO1xuZnVuY3Rpb24gcmVuZGVyTm9kZShub2RlLCBvcHRpb25zKSB7XG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBFbGVtZW50VHlwZS5Sb290OlxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlcihub2RlLmNoaWxkcmVuLCBvcHRpb25zKTtcbiAgICAgICAgY2FzZSBFbGVtZW50VHlwZS5EaXJlY3RpdmU6XG4gICAgICAgIGNhc2UgRWxlbWVudFR5cGUuRG9jdHlwZTpcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJEaXJlY3RpdmUobm9kZSk7XG4gICAgICAgIGNhc2UgRWxlbWVudFR5cGUuQ29tbWVudDpcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJDb21tZW50KG5vZGUpO1xuICAgICAgICBjYXNlIEVsZW1lbnRUeXBlLkNEQVRBOlxuICAgICAgICAgICAgcmV0dXJuIHJlbmRlckNkYXRhKG5vZGUpO1xuICAgICAgICBjYXNlIEVsZW1lbnRUeXBlLlNjcmlwdDpcbiAgICAgICAgY2FzZSBFbGVtZW50VHlwZS5TdHlsZTpcbiAgICAgICAgY2FzZSBFbGVtZW50VHlwZS5UYWc6XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyVGFnKG5vZGUsIG9wdGlvbnMpO1xuICAgICAgICBjYXNlIEVsZW1lbnRUeXBlLlRleHQ6XG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyVGV4dChub2RlLCBvcHRpb25zKTtcbiAgICB9XG59XG52YXIgZm9yZWlnbk1vZGVJbnRlZ3JhdGlvblBvaW50cyA9IG5ldyBTZXQoW1xuICAgIFwibWlcIixcbiAgICBcIm1vXCIsXG4gICAgXCJtblwiLFxuICAgIFwibXNcIixcbiAgICBcIm10ZXh0XCIsXG4gICAgXCJhbm5vdGF0aW9uLXhtbFwiLFxuICAgIFwiZm9yZWlnbk9iamVjdFwiLFxuICAgIFwiZGVzY1wiLFxuICAgIFwidGl0bGVcIixcbl0pO1xudmFyIGZvcmVpZ25FbGVtZW50cyA9IG5ldyBTZXQoW1wic3ZnXCIsIFwibWF0aFwiXSk7XG5mdW5jdGlvbiByZW5kZXJUYWcoZWxlbSwgb3B0cykge1xuICAgIHZhciBfYTtcbiAgICAvLyBIYW5kbGUgU1ZHIC8gTWF0aE1MIGluIEhUTUxcbiAgICBpZiAob3B0cy54bWxNb2RlID09PSBcImZvcmVpZ25cIikge1xuICAgICAgICAvKiBGaXggdXAgbWl4ZWQtY2FzZSBlbGVtZW50IG5hbWVzICovXG4gICAgICAgIGVsZW0ubmFtZSA9IChfYSA9IGZvcmVpZ25OYW1lc18xLmVsZW1lbnROYW1lcy5nZXQoZWxlbS5uYW1lKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZWxlbS5uYW1lO1xuICAgICAgICAvKiBFeGl0IGZvcmVpZ24gbW9kZSBhdCBpbnRlZ3JhdGlvbiBwb2ludHMgKi9cbiAgICAgICAgaWYgKGVsZW0ucGFyZW50ICYmXG4gICAgICAgICAgICBmb3JlaWduTW9kZUludGVncmF0aW9uUG9pbnRzLmhhcyhlbGVtLnBhcmVudC5uYW1lKSkge1xuICAgICAgICAgICAgb3B0cyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRzKSwgeyB4bWxNb2RlOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoIW9wdHMueG1sTW9kZSAmJiBmb3JlaWduRWxlbWVudHMuaGFzKGVsZW0ubmFtZSkpIHtcbiAgICAgICAgb3B0cyA9IF9fYXNzaWduKF9fYXNzaWduKHt9LCBvcHRzKSwgeyB4bWxNb2RlOiBcImZvcmVpZ25cIiB9KTtcbiAgICB9XG4gICAgdmFyIHRhZyA9IFwiPFwiICsgZWxlbS5uYW1lO1xuICAgIHZhciBhdHRyaWJzID0gZm9ybWF0QXR0cmlidXRlcyhlbGVtLmF0dHJpYnMsIG9wdHMpO1xuICAgIGlmIChhdHRyaWJzKSB7XG4gICAgICAgIHRhZyArPSBcIiBcIiArIGF0dHJpYnM7XG4gICAgfVxuICAgIGlmIChlbGVtLmNoaWxkcmVuLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICAob3B0cy54bWxNb2RlXG4gICAgICAgICAgICA/IC8vIEluIFhNTCBtb2RlIG9yIGZvcmVpZ24gbW9kZSwgYW5kIHVzZXIgaGFzbid0IGV4cGxpY2l0bHkgdHVybmVkIG9mZiBzZWxmLWNsb3NpbmcgdGFnc1xuICAgICAgICAgICAgICAgIG9wdHMuc2VsZkNsb3NpbmdUYWdzICE9PSBmYWxzZVxuICAgICAgICAgICAgOiAvLyBVc2VyIGV4cGxpY2l0bHkgYXNrZWQgZm9yIHNlbGYtY2xvc2luZyB0YWdzLCBldmVuIGluIEhUTUwgbW9kZVxuICAgICAgICAgICAgICAgIG9wdHMuc2VsZkNsb3NpbmdUYWdzICYmIHNpbmdsZVRhZy5oYXMoZWxlbS5uYW1lKSkpIHtcbiAgICAgICAgaWYgKCFvcHRzLnhtbE1vZGUpXG4gICAgICAgICAgICB0YWcgKz0gXCIgXCI7XG4gICAgICAgIHRhZyArPSBcIi8+XCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0YWcgKz0gXCI+XCI7XG4gICAgICAgIGlmIChlbGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRhZyArPSByZW5kZXIoZWxlbS5jaGlsZHJlbiwgb3B0cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdHMueG1sTW9kZSB8fCAhc2luZ2xlVGFnLmhhcyhlbGVtLm5hbWUpKSB7XG4gICAgICAgICAgICB0YWcgKz0gXCI8L1wiICsgZWxlbS5uYW1lICsgXCI+XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhZztcbn1cbmZ1bmN0aW9uIHJlbmRlckRpcmVjdGl2ZShlbGVtKSB7XG4gICAgcmV0dXJuIFwiPFwiICsgZWxlbS5kYXRhICsgXCI+XCI7XG59XG5mdW5jdGlvbiByZW5kZXJUZXh0KGVsZW0sIG9wdHMpIHtcbiAgICB2YXIgZGF0YSA9IGVsZW0uZGF0YSB8fCBcIlwiO1xuICAgIC8vIElmIGVudGl0aWVzIHdlcmVuJ3QgZGVjb2RlZCwgbm8gbmVlZCB0byBlbmNvZGUgdGhlbSBiYWNrXG4gICAgaWYgKG9wdHMuZGVjb2RlRW50aXRpZXMgIT09IGZhbHNlICYmXG4gICAgICAgICEoIW9wdHMueG1sTW9kZSAmJlxuICAgICAgICAgICAgZWxlbS5wYXJlbnQgJiZcbiAgICAgICAgICAgIHVuZW5jb2RlZEVsZW1lbnRzLmhhcyhlbGVtLnBhcmVudC5uYW1lKSkpIHtcbiAgICAgICAgZGF0YSA9IGVudGl0aWVzXzEuZW5jb2RlWE1MKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZGF0YTtcbn1cbmZ1bmN0aW9uIHJlbmRlckNkYXRhKGVsZW0pIHtcbiAgICByZXR1cm4gXCI8IVtDREFUQVtcIiArIGVsZW0uY2hpbGRyZW5bMF0uZGF0YSArIFwiXV0+XCI7XG59XG5mdW5jdGlvbiByZW5kZXJDb21tZW50KGVsZW0pIHtcbiAgICByZXR1cm4gXCI8IS0tXCIgKyBlbGVtLmRhdGEgKyBcIi0tPlwiO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRvY3R5cGUgPSBleHBvcnRzLkNEQVRBID0gZXhwb3J0cy5UYWcgPSBleHBvcnRzLlN0eWxlID0gZXhwb3J0cy5TY3JpcHQgPSBleHBvcnRzLkNvbW1lbnQgPSBleHBvcnRzLkRpcmVjdGl2ZSA9IGV4cG9ydHMuVGV4dCA9IGV4cG9ydHMuUm9vdCA9IGV4cG9ydHMuaXNUYWcgPSBleHBvcnRzLkVsZW1lbnRUeXBlID0gdm9pZCAwO1xuLyoqIFR5cGVzIG9mIGVsZW1lbnRzIGZvdW5kIGluIGh0bWxwYXJzZXIyJ3MgRE9NICovXG52YXIgRWxlbWVudFR5cGU7XG4oZnVuY3Rpb24gKEVsZW1lbnRUeXBlKSB7XG4gICAgLyoqIFR5cGUgZm9yIHRoZSByb290IGVsZW1lbnQgb2YgYSBkb2N1bWVudCAqL1xuICAgIEVsZW1lbnRUeXBlW1wiUm9vdFwiXSA9IFwicm9vdFwiO1xuICAgIC8qKiBUeXBlIGZvciBUZXh0ICovXG4gICAgRWxlbWVudFR5cGVbXCJUZXh0XCJdID0gXCJ0ZXh0XCI7XG4gICAgLyoqIFR5cGUgZm9yIDw/IC4uLiA/PiAqL1xuICAgIEVsZW1lbnRUeXBlW1wiRGlyZWN0aXZlXCJdID0gXCJkaXJlY3RpdmVcIjtcbiAgICAvKiogVHlwZSBmb3IgPCEtLSAuLi4gLS0+ICovXG4gICAgRWxlbWVudFR5cGVbXCJDb21tZW50XCJdID0gXCJjb21tZW50XCI7XG4gICAgLyoqIFR5cGUgZm9yIDxzY3JpcHQ+IHRhZ3MgKi9cbiAgICBFbGVtZW50VHlwZVtcIlNjcmlwdFwiXSA9IFwic2NyaXB0XCI7XG4gICAgLyoqIFR5cGUgZm9yIDxzdHlsZT4gdGFncyAqL1xuICAgIEVsZW1lbnRUeXBlW1wiU3R5bGVcIl0gPSBcInN0eWxlXCI7XG4gICAgLyoqIFR5cGUgZm9yIEFueSB0YWcgKi9cbiAgICBFbGVtZW50VHlwZVtcIlRhZ1wiXSA9IFwidGFnXCI7XG4gICAgLyoqIFR5cGUgZm9yIDwhW0NEQVRBWyAuLi4gXV0+ICovXG4gICAgRWxlbWVudFR5cGVbXCJDREFUQVwiXSA9IFwiY2RhdGFcIjtcbiAgICAvKiogVHlwZSBmb3IgPCFkb2N0eXBlIC4uLj4gKi9cbiAgICBFbGVtZW50VHlwZVtcIkRvY3R5cGVcIl0gPSBcImRvY3R5cGVcIjtcbn0pKEVsZW1lbnRUeXBlID0gZXhwb3J0cy5FbGVtZW50VHlwZSB8fCAoZXhwb3J0cy5FbGVtZW50VHlwZSA9IHt9KSk7XG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgYW4gZWxlbWVudCBpcyBhIHRhZyBvciBub3QuXG4gKlxuICogQHBhcmFtIGVsZW0gRWxlbWVudCB0byB0ZXN0XG4gKi9cbmZ1bmN0aW9uIGlzVGFnKGVsZW0pIHtcbiAgICByZXR1cm4gKGVsZW0udHlwZSA9PT0gRWxlbWVudFR5cGUuVGFnIHx8XG4gICAgICAgIGVsZW0udHlwZSA9PT0gRWxlbWVudFR5cGUuU2NyaXB0IHx8XG4gICAgICAgIGVsZW0udHlwZSA9PT0gRWxlbWVudFR5cGUuU3R5bGUpO1xufVxuZXhwb3J0cy5pc1RhZyA9IGlzVGFnO1xuLy8gRXhwb3J0cyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbi8qKiBUeXBlIGZvciB0aGUgcm9vdCBlbGVtZW50IG9mIGEgZG9jdW1lbnQgKi9cbmV4cG9ydHMuUm9vdCA9IEVsZW1lbnRUeXBlLlJvb3Q7XG4vKiogVHlwZSBmb3IgVGV4dCAqL1xuZXhwb3J0cy5UZXh0ID0gRWxlbWVudFR5cGUuVGV4dDtcbi8qKiBUeXBlIGZvciA8PyAuLi4gPz4gKi9cbmV4cG9ydHMuRGlyZWN0aXZlID0gRWxlbWVudFR5cGUuRGlyZWN0aXZlO1xuLyoqIFR5cGUgZm9yIDwhLS0gLi4uIC0tPiAqL1xuZXhwb3J0cy5Db21tZW50ID0gRWxlbWVudFR5cGUuQ29tbWVudDtcbi8qKiBUeXBlIGZvciA8c2NyaXB0PiB0YWdzICovXG5leHBvcnRzLlNjcmlwdCA9IEVsZW1lbnRUeXBlLlNjcmlwdDtcbi8qKiBUeXBlIGZvciA8c3R5bGU+IHRhZ3MgKi9cbmV4cG9ydHMuU3R5bGUgPSBFbGVtZW50VHlwZS5TdHlsZTtcbi8qKiBUeXBlIGZvciBBbnkgdGFnICovXG5leHBvcnRzLlRhZyA9IEVsZW1lbnRUeXBlLlRhZztcbi8qKiBUeXBlIGZvciA8IVtDREFUQVsgLi4uIF1dPiAqL1xuZXhwb3J0cy5DREFUQSA9IEVsZW1lbnRUeXBlLkNEQVRBO1xuLyoqIFR5cGUgZm9yIDwhZG9jdHlwZSAuLi4+ICovXG5leHBvcnRzLkRvY3R5cGUgPSBFbGVtZW50VHlwZS5Eb2N0eXBlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRG9tSGFuZGxlciA9IHZvaWQgMDtcbnZhciBkb21lbGVtZW50dHlwZV8xID0gcmVxdWlyZShcImRvbWVsZW1lbnR0eXBlXCIpO1xudmFyIG5vZGVfMSA9IHJlcXVpcmUoXCIuL25vZGVcIik7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vbm9kZVwiKSwgZXhwb3J0cyk7XG52YXIgcmVXaGl0ZXNwYWNlID0gL1xccysvZztcbi8vIERlZmF1bHQgb3B0aW9uc1xudmFyIGRlZmF1bHRPcHRzID0ge1xuICAgIG5vcm1hbGl6ZVdoaXRlc3BhY2U6IGZhbHNlLFxuICAgIHdpdGhTdGFydEluZGljZXM6IGZhbHNlLFxuICAgIHdpdGhFbmRJbmRpY2VzOiBmYWxzZSxcbiAgICB4bWxNb2RlOiBmYWxzZSxcbn07XG52YXIgRG9tSGFuZGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgQ2FsbGVkIG9uY2UgcGFyc2luZyBoYXMgY29tcGxldGVkLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIFNldHRpbmdzIGZvciB0aGUgaGFuZGxlci5cbiAgICAgKiBAcGFyYW0gZWxlbWVudENCIENhbGxiYWNrIHdoZW5ldmVyIGEgdGFnIGlzIGNsb3NlZC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBEb21IYW5kbGVyKGNhbGxiYWNrLCBvcHRpb25zLCBlbGVtZW50Q0IpIHtcbiAgICAgICAgLyoqIFRoZSBlbGVtZW50cyBvZiB0aGUgRE9NICovXG4gICAgICAgIHRoaXMuZG9tID0gW107XG4gICAgICAgIC8qKiBUaGUgcm9vdCBlbGVtZW50IGZvciB0aGUgRE9NICovXG4gICAgICAgIHRoaXMucm9vdCA9IG5ldyBub2RlXzEuRG9jdW1lbnQodGhpcy5kb20pO1xuICAgICAgICAvKiogSW5kaWNhdGVkIHdoZXRoZXIgcGFyc2luZyBoYXMgYmVlbiBjb21wbGV0ZWQuICovXG4gICAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgICAvKiogU3RhY2sgb2Ygb3BlbiB0YWdzLiAqL1xuICAgICAgICB0aGlzLnRhZ1N0YWNrID0gW3RoaXMucm9vdF07XG4gICAgICAgIC8qKiBBIGRhdGEgbm9kZSB0aGF0IGlzIHN0aWxsIGJlaW5nIHdyaXR0ZW4gdG8uICovXG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xuICAgICAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBwYXJzZXIgaW5zdGFuY2UuIFVzZWQgZm9yIGxvY2F0aW9uIGluZm9ybWF0aW9uLiAqL1xuICAgICAgICB0aGlzLnBhcnNlciA9IG51bGw7XG4gICAgICAgIC8vIE1ha2UgaXQgcG9zc2libGUgdG8gc2tpcCBhcmd1bWVudHMsIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgZWxlbWVudENCID0gb3B0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkZWZhdWx0T3B0cztcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gY2FsbGJhY2s7XG4gICAgICAgICAgICBjYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2sgIT09IG51bGwgJiYgY2FsbGJhY2sgIT09IHZvaWQgMCA/IGNhbGxiYWNrIDogbnVsbDtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgPyBvcHRpb25zIDogZGVmYXVsdE9wdHM7XG4gICAgICAgIHRoaXMuZWxlbWVudENCID0gZWxlbWVudENCICE9PSBudWxsICYmIGVsZW1lbnRDQiAhPT0gdm9pZCAwID8gZWxlbWVudENCIDogbnVsbDtcbiAgICB9XG4gICAgRG9tSGFuZGxlci5wcm90b3R5cGUub25wYXJzZXJpbml0ID0gZnVuY3Rpb24gKHBhcnNlcikge1xuICAgICAgICB0aGlzLnBhcnNlciA9IHBhcnNlcjtcbiAgICB9O1xuICAgIC8vIFJlc2V0cyB0aGUgaGFuZGxlciBiYWNrIHRvIHN0YXJ0aW5nIHN0YXRlXG4gICAgRG9tSGFuZGxlci5wcm90b3R5cGUub25yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kb20gPSBbXTtcbiAgICAgICAgdGhpcy5yb290ID0gbmV3IG5vZGVfMS5Eb2N1bWVudCh0aGlzLmRvbSk7XG4gICAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRhZ1N0YWNrID0gW3RoaXMucm9vdF07XG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xuICAgICAgICB0aGlzLnBhcnNlciA9IG51bGw7XG4gICAgfTtcbiAgICAvLyBTaWduYWxzIHRoZSBoYW5kbGVyIHRoYXQgcGFyc2luZyBpcyBkb25lXG4gICAgRG9tSGFuZGxlci5wcm90b3R5cGUub25lbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvbmUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG4gICAgICAgIHRoaXMucGFyc2VyID0gbnVsbDtcbiAgICAgICAgdGhpcy5oYW5kbGVDYWxsYmFjayhudWxsKTtcbiAgICB9O1xuICAgIERvbUhhbmRsZXIucHJvdG90eXBlLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVDYWxsYmFjayhlcnJvcik7XG4gICAgfTtcbiAgICBEb21IYW5kbGVyLnByb3RvdHlwZS5vbmNsb3NldGFnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmxhc3ROb2RlID0gbnVsbDtcbiAgICAgICAgdmFyIGVsZW0gPSB0aGlzLnRhZ1N0YWNrLnBvcCgpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLndpdGhFbmRJbmRpY2VzKSB7XG4gICAgICAgICAgICBlbGVtLmVuZEluZGV4ID0gdGhpcy5wYXJzZXIuZW5kSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZWxlbWVudENCKVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50Q0IoZWxlbSk7XG4gICAgfTtcbiAgICBEb21IYW5kbGVyLnByb3RvdHlwZS5vbm9wZW50YWcgPSBmdW5jdGlvbiAobmFtZSwgYXR0cmlicykge1xuICAgICAgICB2YXIgdHlwZSA9IHRoaXMub3B0aW9ucy54bWxNb2RlID8gZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5UYWcgOiB1bmRlZmluZWQ7XG4gICAgICAgIHZhciBlbGVtZW50ID0gbmV3IG5vZGVfMS5FbGVtZW50KG5hbWUsIGF0dHJpYnMsIHVuZGVmaW5lZCwgdHlwZSk7XG4gICAgICAgIHRoaXMuYWRkTm9kZShlbGVtZW50KTtcbiAgICAgICAgdGhpcy50YWdTdGFjay5wdXNoKGVsZW1lbnQpO1xuICAgIH07XG4gICAgRG9tSGFuZGxlci5wcm90b3R5cGUub250ZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIG5vcm1hbGl6ZVdoaXRlc3BhY2UgPSB0aGlzLm9wdGlvbnMubm9ybWFsaXplV2hpdGVzcGFjZTtcbiAgICAgICAgdmFyIGxhc3ROb2RlID0gdGhpcy5sYXN0Tm9kZTtcbiAgICAgICAgaWYgKGxhc3ROb2RlICYmIGxhc3ROb2RlLnR5cGUgPT09IGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuVGV4dCkge1xuICAgICAgICAgICAgaWYgKG5vcm1hbGl6ZVdoaXRlc3BhY2UpIHtcbiAgICAgICAgICAgICAgICBsYXN0Tm9kZS5kYXRhID0gKGxhc3ROb2RlLmRhdGEgKyBkYXRhKS5yZXBsYWNlKHJlV2hpdGVzcGFjZSwgXCIgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGFzdE5vZGUuZGF0YSArPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy53aXRoRW5kSW5kaWNlcykge1xuICAgICAgICAgICAgICAgIGxhc3ROb2RlLmVuZEluZGV4ID0gdGhpcy5wYXJzZXIuZW5kSW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9ybWFsaXplV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgICAgIGRhdGEgPSBkYXRhLnJlcGxhY2UocmVXaGl0ZXNwYWNlLCBcIiBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5ldyBub2RlXzEuVGV4dChkYXRhKTtcbiAgICAgICAgICAgIHRoaXMuYWRkTm9kZShub2RlKTtcbiAgICAgICAgICAgIHRoaXMubGFzdE5vZGUgPSBub2RlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEb21IYW5kbGVyLnByb3RvdHlwZS5vbmNvbW1lbnQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAodGhpcy5sYXN0Tm9kZSAmJiB0aGlzLmxhc3ROb2RlLnR5cGUgPT09IGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuQ29tbWVudCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0Tm9kZS5kYXRhICs9IGRhdGE7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZV8xLkNvbW1lbnQoZGF0YSk7XG4gICAgICAgIHRoaXMuYWRkTm9kZShub2RlKTtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG5vZGU7XG4gICAgfTtcbiAgICBEb21IYW5kbGVyLnByb3RvdHlwZS5vbmNvbW1lbnRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSBudWxsO1xuICAgIH07XG4gICAgRG9tSGFuZGxlci5wcm90b3R5cGUub25jZGF0YXN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGV4dCA9IG5ldyBub2RlXzEuVGV4dChcIlwiKTtcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgbm9kZV8xLk5vZGVXaXRoQ2hpbGRyZW4oZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5DREFUQSwgW3RleHRdKTtcbiAgICAgICAgdGhpcy5hZGROb2RlKG5vZGUpO1xuICAgICAgICB0ZXh0LnBhcmVudCA9IG5vZGU7XG4gICAgICAgIHRoaXMubGFzdE5vZGUgPSB0ZXh0O1xuICAgIH07XG4gICAgRG9tSGFuZGxlci5wcm90b3R5cGUub25jZGF0YWVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG4gICAgfTtcbiAgICBEb21IYW5kbGVyLnByb3RvdHlwZS5vbnByb2Nlc3NpbmdpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBkYXRhKSB7XG4gICAgICAgIHZhciBub2RlID0gbmV3IG5vZGVfMS5Qcm9jZXNzaW5nSW5zdHJ1Y3Rpb24obmFtZSwgZGF0YSk7XG4gICAgICAgIHRoaXMuYWRkTm9kZShub2RlKTtcbiAgICB9O1xuICAgIERvbUhhbmRsZXIucHJvdG90eXBlLmhhbmRsZUNhbGxiYWNrID0gZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrKGVycm9yLCB0aGlzLmRvbSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBEb21IYW5kbGVyLnByb3RvdHlwZS5hZGROb2RlID0gZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMudGFnU3RhY2tbdGhpcy50YWdTdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIHByZXZpb3VzU2libGluZyA9IHBhcmVudC5jaGlsZHJlbltwYXJlbnQuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMud2l0aFN0YXJ0SW5kaWNlcykge1xuICAgICAgICAgICAgbm9kZS5zdGFydEluZGV4ID0gdGhpcy5wYXJzZXIuc3RhcnRJbmRleDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLndpdGhFbmRJbmRpY2VzKSB7XG4gICAgICAgICAgICBub2RlLmVuZEluZGV4ID0gdGhpcy5wYXJzZXIuZW5kSW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgcGFyZW50LmNoaWxkcmVuLnB1c2gobm9kZSk7XG4gICAgICAgIGlmIChwcmV2aW91c1NpYmxpbmcpIHtcbiAgICAgICAgICAgIG5vZGUucHJldiA9IHByZXZpb3VzU2libGluZztcbiAgICAgICAgICAgIHByZXZpb3VzU2libGluZy5uZXh0ID0gbm9kZTtcbiAgICAgICAgfVxuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5sYXN0Tm9kZSA9IG51bGw7XG4gICAgfTtcbiAgICByZXR1cm4gRG9tSGFuZGxlcjtcbn0oKSk7XG5leHBvcnRzLkRvbUhhbmRsZXIgPSBEb21IYW5kbGVyO1xuZXhwb3J0cy5kZWZhdWx0ID0gRG9tSGFuZGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNsb25lTm9kZSA9IGV4cG9ydHMuaGFzQ2hpbGRyZW4gPSBleHBvcnRzLmlzRG9jdW1lbnQgPSBleHBvcnRzLmlzRGlyZWN0aXZlID0gZXhwb3J0cy5pc0NvbW1lbnQgPSBleHBvcnRzLmlzVGV4dCA9IGV4cG9ydHMuaXNDREFUQSA9IGV4cG9ydHMuaXNUYWcgPSBleHBvcnRzLkVsZW1lbnQgPSBleHBvcnRzLkRvY3VtZW50ID0gZXhwb3J0cy5Ob2RlV2l0aENoaWxkcmVuID0gZXhwb3J0cy5Qcm9jZXNzaW5nSW5zdHJ1Y3Rpb24gPSBleHBvcnRzLkNvbW1lbnQgPSBleHBvcnRzLlRleHQgPSBleHBvcnRzLkRhdGFOb2RlID0gZXhwb3J0cy5Ob2RlID0gdm9pZCAwO1xudmFyIGRvbWVsZW1lbnR0eXBlXzEgPSByZXF1aXJlKFwiZG9tZWxlbWVudHR5cGVcIik7XG52YXIgbm9kZVR5cGVzID0gbmV3IE1hcChbXG4gICAgW2RvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuVGFnLCAxXSxcbiAgICBbZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5TY3JpcHQsIDFdLFxuICAgIFtkb21lbGVtZW50dHlwZV8xLkVsZW1lbnRUeXBlLlN0eWxlLCAxXSxcbiAgICBbZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5EaXJlY3RpdmUsIDFdLFxuICAgIFtkb21lbGVtZW50dHlwZV8xLkVsZW1lbnRUeXBlLlRleHQsIDNdLFxuICAgIFtkb21lbGVtZW50dHlwZV8xLkVsZW1lbnRUeXBlLkNEQVRBLCA0XSxcbiAgICBbZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5Db21tZW50LCA4XSxcbiAgICBbZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5Sb290LCA5XSxcbl0pO1xuLyoqXG4gKiBUaGlzIG9iamVjdCB3aWxsIGJlIHVzZWQgYXMgdGhlIHByb3RvdHlwZSBmb3IgTm9kZXMgd2hlbiBjcmVhdGluZyBhXG4gKiBET00tTGV2ZWwtMS1jb21wbGlhbnQgc3RydWN0dXJlLlxuICovXG52YXIgTm9kZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlIFRoZSB0eXBlIG9mIHRoZSBub2RlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIE5vZGUodHlwZSkge1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICAvKiogUGFyZW50IG9mIHRoZSBub2RlICovXG4gICAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgICAgLyoqIFByZXZpb3VzIHNpYmxpbmcgKi9cbiAgICAgICAgdGhpcy5wcmV2ID0gbnVsbDtcbiAgICAgICAgLyoqIE5leHQgc2libGluZyAqL1xuICAgICAgICB0aGlzLm5leHQgPSBudWxsO1xuICAgICAgICAvKiogVGhlIHN0YXJ0IGluZGV4IG9mIHRoZSBub2RlLiBSZXF1aXJlcyBgd2l0aFN0YXJ0SW5kaWNlc2Agb24gdGhlIGhhbmRsZXIgdG8gYmUgYHRydWUuICovXG4gICAgICAgIHRoaXMuc3RhcnRJbmRleCA9IG51bGw7XG4gICAgICAgIC8qKiBUaGUgZW5kIGluZGV4IG9mIHRoZSBub2RlLiBSZXF1aXJlcyBgd2l0aEVuZEluZGljZXNgIG9uIHRoZSBoYW5kbGVyIHRvIGJlIGB0cnVlLiAqL1xuICAgICAgICB0aGlzLmVuZEluZGV4ID0gbnVsbDtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCBcIm5vZGVUeXBlXCIsIHtcbiAgICAgICAgLy8gUmVhZC1vbmx5IGFsaWFzZXNcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFtET00gc3BlY10oaHR0cHM6Ly9kb20uc3BlYy53aGF0d2cub3JnLyNkb20tbm9kZS1ub2RldHlwZSktY29tcGF0aWJsZVxuICAgICAgICAgKiBub2RlIHtAbGluayB0eXBlfS5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgcmV0dXJuIChfYSA9IG5vZGVUeXBlcy5nZXQodGhpcy50eXBlKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgXCJwYXJlbnROb2RlXCIsIHtcbiAgICAgICAgLy8gUmVhZC13cml0ZSBhbGlhc2VzIGZvciBwcm9wZXJ0aWVzXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYW1lIGFzIHtAbGluayBwYXJlbnR9LlxuICAgICAgICAgKiBbRE9NIHNwZWNdKGh0dHBzOi8vZG9tLnNwZWMud2hhdHdnLm9yZyktY29tcGF0aWJsZSBhbGlhcy5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyZW50O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChwYXJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCBcInByZXZpb3VzU2libGluZ1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYW1lIGFzIHtAbGluayBwcmV2fS5cbiAgICAgICAgICogW0RPTSBzcGVjXShodHRwczovL2RvbS5zcGVjLndoYXR3Zy5vcmcpLWNvbXBhdGlibGUgYWxpYXMuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnByZXY7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHByZXYpIHtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IHByZXY7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsIFwibmV4dFNpYmxpbmdcIiwge1xuICAgICAgICAvKipcbiAgICAgICAgICogU2FtZSBhcyB7QGxpbmsgbmV4dH0uXG4gICAgICAgICAqIFtET00gc3BlY10oaHR0cHM6Ly9kb20uc3BlYy53aGF0d2cub3JnKS1jb21wYXRpYmxlIGFsaWFzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5uZXh0O1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuZXh0KSB7XG4gICAgICAgICAgICB0aGlzLm5leHQgPSBuZXh0O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgLyoqXG4gICAgICogQ2xvbmUgdGhpcyBub2RlLCBhbmQgb3B0aW9uYWxseSBpdHMgY2hpbGRyZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVjdXJzaXZlIENsb25lIGNoaWxkIG5vZGVzIGFzIHdlbGwuXG4gICAgICogQHJldHVybnMgQSBjbG9uZSBvZiB0aGUgbm9kZS5cbiAgICAgKi9cbiAgICBOb2RlLnByb3RvdHlwZS5jbG9uZU5vZGUgPSBmdW5jdGlvbiAocmVjdXJzaXZlKSB7XG4gICAgICAgIGlmIChyZWN1cnNpdmUgPT09IHZvaWQgMCkgeyByZWN1cnNpdmUgPSBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gY2xvbmVOb2RlKHRoaXMsIHJlY3Vyc2l2ZSk7XG4gICAgfTtcbiAgICByZXR1cm4gTm9kZTtcbn0oKSk7XG5leHBvcnRzLk5vZGUgPSBOb2RlO1xuLyoqXG4gKiBBIG5vZGUgdGhhdCBjb250YWlucyBzb21lIGRhdGEuXG4gKi9cbnZhciBEYXRhTm9kZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRGF0YU5vZGUsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHR5cGUgVGhlIHR5cGUgb2YgdGhlIG5vZGVcbiAgICAgKiBAcGFyYW0gZGF0YSBUaGUgY29udGVudCBvZiB0aGUgZGF0YSBub2RlXG4gICAgICovXG4gICAgZnVuY3Rpb24gRGF0YU5vZGUodHlwZSwgZGF0YSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCB0eXBlKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRGF0YU5vZGUucHJvdG90eXBlLCBcIm5vZGVWYWx1ZVwiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYW1lIGFzIHtAbGluayBkYXRhfS5cbiAgICAgICAgICogW0RPTSBzcGVjXShodHRwczovL2RvbS5zcGVjLndoYXR3Zy5vcmcpLWNvbXBhdGlibGUgYWxpYXMuXG4gICAgICAgICAqL1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gRGF0YU5vZGU7XG59KE5vZGUpKTtcbmV4cG9ydHMuRGF0YU5vZGUgPSBEYXRhTm9kZTtcbi8qKlxuICogVGV4dCB3aXRoaW4gdGhlIGRvY3VtZW50LlxuICovXG52YXIgVGV4dCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVGV4dCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBUZXh0KGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuVGV4dCwgZGF0YSkgfHwgdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFRleHQ7XG59KERhdGFOb2RlKSk7XG5leHBvcnRzLlRleHQgPSBUZXh0O1xuLyoqXG4gKiBDb21tZW50cyB3aXRoaW4gdGhlIGRvY3VtZW50LlxuICovXG52YXIgQ29tbWVudCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ29tbWVudCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDb21tZW50KGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuQ29tbWVudCwgZGF0YSkgfHwgdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIENvbW1lbnQ7XG59KERhdGFOb2RlKSk7XG5leHBvcnRzLkNvbW1lbnQgPSBDb21tZW50O1xuLyoqXG4gKiBQcm9jZXNzaW5nIGluc3RydWN0aW9ucywgaW5jbHVkaW5nIGRvYyB0eXBlcy5cbiAqL1xudmFyIFByb2Nlc3NpbmdJbnN0cnVjdGlvbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUHJvY2Vzc2luZ0luc3RydWN0aW9uLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFByb2Nlc3NpbmdJbnN0cnVjdGlvbihuYW1lLCBkYXRhKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuRGlyZWN0aXZlLCBkYXRhKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUHJvY2Vzc2luZ0luc3RydWN0aW9uO1xufShEYXRhTm9kZSkpO1xuZXhwb3J0cy5Qcm9jZXNzaW5nSW5zdHJ1Y3Rpb24gPSBQcm9jZXNzaW5nSW5zdHJ1Y3Rpb247XG4vKipcbiAqIEEgYE5vZGVgIHRoYXQgY2FuIGhhdmUgY2hpbGRyZW4uXG4gKi9cbnZhciBOb2RlV2l0aENoaWxkcmVuID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb2RlV2l0aENoaWxkcmVuLCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB0eXBlIFR5cGUgb2YgdGhlIG5vZGUuXG4gICAgICogQHBhcmFtIGNoaWxkcmVuIENoaWxkcmVuIG9mIHRoZSBub2RlLiBPbmx5IGNlcnRhaW4gbm9kZSB0eXBlcyBjYW4gaGF2ZSBjaGlsZHJlbi5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBOb2RlV2l0aENoaWxkcmVuKHR5cGUsIGNoaWxkcmVuKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIHR5cGUpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGVXaXRoQ2hpbGRyZW4ucHJvdG90eXBlLCBcImZpcnN0Q2hpbGRcIiwge1xuICAgICAgICAvLyBBbGlhc2VzXG4gICAgICAgIC8qKiBGaXJzdCBjaGlsZCBvZiB0aGUgbm9kZS4gKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICByZXR1cm4gKF9hID0gdGhpcy5jaGlsZHJlblswXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbnVsbDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlV2l0aENoaWxkcmVuLnByb3RvdHlwZSwgXCJsYXN0Q2hpbGRcIiwge1xuICAgICAgICAvKiogTGFzdCBjaGlsZCBvZiB0aGUgbm9kZS4gKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwXG4gICAgICAgICAgICAgICAgPyB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV1cbiAgICAgICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZVdpdGhDaGlsZHJlbi5wcm90b3R5cGUsIFwiY2hpbGROb2Rlc1wiLCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTYW1lIGFzIHtAbGluayBjaGlsZHJlbn0uXG4gICAgICAgICAqIFtET00gc3BlY10oaHR0cHM6Ly9kb20uc3BlYy53aGF0d2cub3JnKS1jb21wYXRpYmxlIGFsaWFzLlxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBOb2RlV2l0aENoaWxkcmVuO1xufShOb2RlKSk7XG5leHBvcnRzLk5vZGVXaXRoQ2hpbGRyZW4gPSBOb2RlV2l0aENoaWxkcmVuO1xuLyoqXG4gKiBUaGUgcm9vdCBub2RlIG9mIHRoZSBkb2N1bWVudC5cbiAqL1xudmFyIERvY3VtZW50ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhEb2N1bWVudCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBEb2N1bWVudChjaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5Sb290LCBjaGlsZHJlbikgfHwgdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIERvY3VtZW50O1xufShOb2RlV2l0aENoaWxkcmVuKSk7XG5leHBvcnRzLkRvY3VtZW50ID0gRG9jdW1lbnQ7XG4vKipcbiAqIEFuIGVsZW1lbnQgd2l0aGluIHRoZSBET00uXG4gKi9cbnZhciBFbGVtZW50ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFbGVtZW50LCBfc3VwZXIpO1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIHRhZywgZWcuIGBkaXZgLCBgc3BhbmAuXG4gICAgICogQHBhcmFtIGF0dHJpYnMgT2JqZWN0IG1hcHBpbmcgYXR0cmlidXRlIG5hbWVzIHRvIGF0dHJpYnV0ZSB2YWx1ZXMuXG4gICAgICogQHBhcmFtIGNoaWxkcmVuIENoaWxkcmVuIG9mIHRoZSBub2RlLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEVsZW1lbnQobmFtZSwgYXR0cmlicywgY2hpbGRyZW4sIHR5cGUpIHtcbiAgICAgICAgaWYgKGNoaWxkcmVuID09PSB2b2lkIDApIHsgY2hpbGRyZW4gPSBbXTsgfVxuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBuYW1lID09PSBcInNjcmlwdFwiXG4gICAgICAgICAgICA/IGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuU2NyaXB0XG4gICAgICAgICAgICA6IG5hbWUgPT09IFwic3R5bGVcIlxuICAgICAgICAgICAgICAgID8gZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5TdHlsZVxuICAgICAgICAgICAgICAgIDogZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5UYWc7IH1cbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgdHlwZSwgY2hpbGRyZW4pIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICBfdGhpcy5hdHRyaWJzID0gYXR0cmlicztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRWxlbWVudC5wcm90b3R5cGUsIFwidGFnTmFtZVwiLCB7XG4gICAgICAgIC8vIERPTSBMZXZlbCAxIGFsaWFzZXNcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNhbWUgYXMge0BsaW5rIG5hbWV9LlxuICAgICAgICAgKiBbRE9NIHNwZWNdKGh0dHBzOi8vZG9tLnNwZWMud2hhdHdnLm9yZyktY29tcGF0aWJsZSBhbGlhcy5cbiAgICAgICAgICovXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbGVtZW50LnByb3RvdHlwZSwgXCJhdHRyaWJ1dGVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuYXR0cmlicykubWFwKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF90aGlzLmF0dHJpYnNbbmFtZV0sXG4gICAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZTogKF9hID0gX3RoaXNbXCJ4LWF0dHJpYnNOYW1lc3BhY2VcIl0pID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtuYW1lXSxcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiAoX2IgPSBfdGhpc1tcIngtYXR0cmlic1ByZWZpeFwiXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW25hbWVdLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gRWxlbWVudDtcbn0oTm9kZVdpdGhDaGlsZHJlbikpO1xuZXhwb3J0cy5FbGVtZW50ID0gRWxlbWVudDtcbi8qKlxuICogQHBhcmFtIG5vZGUgTm9kZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIGB0cnVlYCBpZiB0aGUgbm9kZSBpcyBhIGBFbGVtZW50YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGlzVGFnKG5vZGUpIHtcbiAgICByZXR1cm4gKDAsIGRvbWVsZW1lbnR0eXBlXzEuaXNUYWcpKG5vZGUpO1xufVxuZXhwb3J0cy5pc1RhZyA9IGlzVGFnO1xuLyoqXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGNoZWNrLlxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBub2RlIGhhcyB0aGUgdHlwZSBgQ0RBVEFgLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gaXNDREFUQShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5DREFUQTtcbn1cbmV4cG9ydHMuaXNDREFUQSA9IGlzQ0RBVEE7XG4vKipcbiAqIEBwYXJhbSBub2RlIE5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG5vZGUgaGFzIHRoZSB0eXBlIGBUZXh0YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGlzVGV4dChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5UZXh0O1xufVxuZXhwb3J0cy5pc1RleHQgPSBpc1RleHQ7XG4vKipcbiAqIEBwYXJhbSBub2RlIE5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG5vZGUgaGFzIHRoZSB0eXBlIGBDb21tZW50YCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGlzQ29tbWVudChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUudHlwZSA9PT0gZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5Db21tZW50O1xufVxuZXhwb3J0cy5pc0NvbW1lbnQgPSBpc0NvbW1lbnQ7XG4vKipcbiAqIEBwYXJhbSBub2RlIE5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG5vZGUgaGFzIHRoZSB0eXBlIGBQcm9jZXNzaW5nSW5zdHJ1Y3Rpb25gLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAqL1xuZnVuY3Rpb24gaXNEaXJlY3RpdmUobm9kZSkge1xuICAgIHJldHVybiBub2RlLnR5cGUgPT09IGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuRGlyZWN0aXZlO1xufVxuZXhwb3J0cy5pc0RpcmVjdGl2ZSA9IGlzRGlyZWN0aXZlO1xuLyoqXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGNoZWNrLlxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSBub2RlIGhhcyB0aGUgdHlwZSBgUHJvY2Vzc2luZ0luc3RydWN0aW9uYCwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKi9cbmZ1bmN0aW9uIGlzRG9jdW1lbnQobm9kZSkge1xuICAgIHJldHVybiBub2RlLnR5cGUgPT09IGRvbWVsZW1lbnR0eXBlXzEuRWxlbWVudFR5cGUuUm9vdDtcbn1cbmV4cG9ydHMuaXNEb2N1bWVudCA9IGlzRG9jdW1lbnQ7XG4vKipcbiAqIEBwYXJhbSBub2RlIE5vZGUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG5vZGUgaXMgYSBgTm9kZVdpdGhDaGlsZHJlbmAgKGhhcyBjaGlsZHJlbiksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBoYXNDaGlsZHJlbihub2RlKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChub2RlLCBcImNoaWxkcmVuXCIpO1xufVxuZXhwb3J0cy5oYXNDaGlsZHJlbiA9IGhhc0NoaWxkcmVuO1xuLyoqXG4gKiBDbG9uZSBhIG5vZGUsIGFuZCBvcHRpb25hbGx5IGl0cyBjaGlsZHJlbi5cbiAqXG4gKiBAcGFyYW0gcmVjdXJzaXZlIENsb25lIGNoaWxkIG5vZGVzIGFzIHdlbGwuXG4gKiBAcmV0dXJucyBBIGNsb25lIG9mIHRoZSBub2RlLlxuICovXG5mdW5jdGlvbiBjbG9uZU5vZGUobm9kZSwgcmVjdXJzaXZlKSB7XG4gICAgaWYgKHJlY3Vyc2l2ZSA9PT0gdm9pZCAwKSB7IHJlY3Vyc2l2ZSA9IGZhbHNlOyB9XG4gICAgdmFyIHJlc3VsdDtcbiAgICBpZiAoaXNUZXh0KG5vZGUpKSB7XG4gICAgICAgIHJlc3VsdCA9IG5ldyBUZXh0KG5vZGUuZGF0YSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzQ29tbWVudChub2RlKSkge1xuICAgICAgICByZXN1bHQgPSBuZXcgQ29tbWVudChub2RlLmRhdGEpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1RhZyhub2RlKSkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSByZWN1cnNpdmUgPyBjbG9uZUNoaWxkcmVuKG5vZGUuY2hpbGRyZW4pIDogW107XG4gICAgICAgIHZhciBjbG9uZV8xID0gbmV3IEVsZW1lbnQobm9kZS5uYW1lLCBfX2Fzc2lnbih7fSwgbm9kZS5hdHRyaWJzKSwgY2hpbGRyZW4pO1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gKGNoaWxkLnBhcmVudCA9IGNsb25lXzEpOyB9KTtcbiAgICAgICAgaWYgKG5vZGUubmFtZXNwYWNlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNsb25lXzEubmFtZXNwYWNlID0gbm9kZS5uYW1lc3BhY2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVbXCJ4LWF0dHJpYnNOYW1lc3BhY2VcIl0pIHtcbiAgICAgICAgICAgIGNsb25lXzFbXCJ4LWF0dHJpYnNOYW1lc3BhY2VcIl0gPSBfX2Fzc2lnbih7fSwgbm9kZVtcIngtYXR0cmlic05hbWVzcGFjZVwiXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGVbXCJ4LWF0dHJpYnNQcmVmaXhcIl0pIHtcbiAgICAgICAgICAgIGNsb25lXzFbXCJ4LWF0dHJpYnNQcmVmaXhcIl0gPSBfX2Fzc2lnbih7fSwgbm9kZVtcIngtYXR0cmlic1ByZWZpeFwiXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0ID0gY2xvbmVfMTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNDREFUQShub2RlKSkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSByZWN1cnNpdmUgPyBjbG9uZUNoaWxkcmVuKG5vZGUuY2hpbGRyZW4pIDogW107XG4gICAgICAgIHZhciBjbG9uZV8yID0gbmV3IE5vZGVXaXRoQ2hpbGRyZW4oZG9tZWxlbWVudHR5cGVfMS5FbGVtZW50VHlwZS5DREFUQSwgY2hpbGRyZW4pO1xuICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gKGNoaWxkLnBhcmVudCA9IGNsb25lXzIpOyB9KTtcbiAgICAgICAgcmVzdWx0ID0gY2xvbmVfMjtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNEb2N1bWVudChub2RlKSkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSByZWN1cnNpdmUgPyBjbG9uZUNoaWxkcmVuKG5vZGUuY2hpbGRyZW4pIDogW107XG4gICAgICAgIHZhciBjbG9uZV8zID0gbmV3IERvY3VtZW50KGNoaWxkcmVuKTtcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIChjaGlsZC5wYXJlbnQgPSBjbG9uZV8zKTsgfSk7XG4gICAgICAgIGlmIChub2RlW1wieC1tb2RlXCJdKSB7XG4gICAgICAgICAgICBjbG9uZV8zW1wieC1tb2RlXCJdID0gbm9kZVtcIngtbW9kZVwiXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBjbG9uZV8zO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc0RpcmVjdGl2ZShub2RlKSkge1xuICAgICAgICB2YXIgaW5zdHJ1Y3Rpb24gPSBuZXcgUHJvY2Vzc2luZ0luc3RydWN0aW9uKG5vZGUubmFtZSwgbm9kZS5kYXRhKTtcbiAgICAgICAgaWYgKG5vZGVbXCJ4LW5hbWVcIl0gIT0gbnVsbCkge1xuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25bXCJ4LW5hbWVcIl0gPSBub2RlW1wieC1uYW1lXCJdO1xuICAgICAgICAgICAgaW5zdHJ1Y3Rpb25bXCJ4LXB1YmxpY0lkXCJdID0gbm9kZVtcIngtcHVibGljSWRcIl07XG4gICAgICAgICAgICBpbnN0cnVjdGlvbltcIngtc3lzdGVtSWRcIl0gPSBub2RlW1wieC1zeXN0ZW1JZFwiXTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQgPSBpbnN0cnVjdGlvbjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQ6IFwiLmNvbmNhdChub2RlLnR5cGUpKTtcbiAgICB9XG4gICAgcmVzdWx0LnN0YXJ0SW5kZXggPSBub2RlLnN0YXJ0SW5kZXg7XG4gICAgcmVzdWx0LmVuZEluZGV4ID0gbm9kZS5lbmRJbmRleDtcbiAgICBpZiAobm9kZS5zb3VyY2VDb2RlTG9jYXRpb24gIT0gbnVsbCkge1xuICAgICAgICByZXN1bHQuc291cmNlQ29kZUxvY2F0aW9uID0gbm9kZS5zb3VyY2VDb2RlTG9jYXRpb247XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmNsb25lTm9kZSA9IGNsb25lTm9kZTtcbmZ1bmN0aW9uIGNsb25lQ2hpbGRyZW4oY2hpbGRzKSB7XG4gICAgdmFyIGNoaWxkcmVuID0gY2hpbGRzLm1hcChmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIGNsb25lTm9kZShjaGlsZCwgdHJ1ZSk7IH0pO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY2hpbGRyZW5baV0ucHJldiA9IGNoaWxkcmVuW2kgLSAxXTtcbiAgICAgICAgY2hpbGRyZW5baSAtIDFdLm5leHQgPSBjaGlsZHJlbltpXTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEZlZWQgPSB2b2lkIDA7XG52YXIgc3RyaW5naWZ5XzEgPSByZXF1aXJlKFwiLi9zdHJpbmdpZnlcIik7XG52YXIgbGVnYWN5XzEgPSByZXF1aXJlKFwiLi9sZWdhY3lcIik7XG4vKipcbiAqIEdldCB0aGUgZmVlZCBvYmplY3QgZnJvbSB0aGUgcm9vdCBvZiBhIERPTSB0cmVlLlxuICpcbiAqIEBwYXJhbSBkb2MgLSBUaGUgRE9NIHRvIHRvIGV4dHJhY3QgdGhlIGZlZWQgZnJvbS5cbiAqIEByZXR1cm5zIFRoZSBmZWVkLlxuICovXG5mdW5jdGlvbiBnZXRGZWVkKGRvYykge1xuICAgIHZhciBmZWVkUm9vdCA9IGdldE9uZUVsZW1lbnQoaXNWYWxpZEZlZWQsIGRvYyk7XG4gICAgcmV0dXJuICFmZWVkUm9vdFxuICAgICAgICA/IG51bGxcbiAgICAgICAgOiBmZWVkUm9vdC5uYW1lID09PSBcImZlZWRcIlxuICAgICAgICAgICAgPyBnZXRBdG9tRmVlZChmZWVkUm9vdClcbiAgICAgICAgICAgIDogZ2V0UnNzRmVlZChmZWVkUm9vdCk7XG59XG5leHBvcnRzLmdldEZlZWQgPSBnZXRGZWVkO1xuLyoqXG4gKiBQYXJzZSBhbiBBdG9tIGZlZWQuXG4gKlxuICogQHBhcmFtIGZlZWRSb290IFRoZSByb290IG9mIHRoZSBmZWVkLlxuICogQHJldHVybnMgVGhlIHBhcnNlZCBmZWVkLlxuICovXG5mdW5jdGlvbiBnZXRBdG9tRmVlZChmZWVkUm9vdCkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgY2hpbGRzID0gZmVlZFJvb3QuY2hpbGRyZW47XG4gICAgdmFyIGZlZWQgPSB7XG4gICAgICAgIHR5cGU6IFwiYXRvbVwiLFxuICAgICAgICBpdGVtczogKDAsIGxlZ2FjeV8xLmdldEVsZW1lbnRzQnlUYWdOYW1lKShcImVudHJ5XCIsIGNoaWxkcykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgICAgICAgdmFyIGVudHJ5ID0geyBtZWRpYTogZ2V0TWVkaWFFbGVtZW50cyhjaGlsZHJlbikgfTtcbiAgICAgICAgICAgIGFkZENvbmRpdGlvbmFsbHkoZW50cnksIFwiaWRcIiwgXCJpZFwiLCBjaGlsZHJlbik7XG4gICAgICAgICAgICBhZGRDb25kaXRpb25hbGx5KGVudHJ5LCBcInRpdGxlXCIsIFwidGl0bGVcIiwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgdmFyIGhyZWYgPSAoX2EgPSBnZXRPbmVFbGVtZW50KFwibGlua1wiLCBjaGlsZHJlbikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hdHRyaWJzLmhyZWY7XG4gICAgICAgICAgICBpZiAoaHJlZikge1xuICAgICAgICAgICAgICAgIGVudHJ5LmxpbmsgPSBocmVmO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZmV0Y2goXCJzdW1tYXJ5XCIsIGNoaWxkcmVuKSB8fCBmZXRjaChcImNvbnRlbnRcIiwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgZW50cnkuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwdWJEYXRlID0gZmV0Y2goXCJ1cGRhdGVkXCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIGlmIChwdWJEYXRlKSB7XG4gICAgICAgICAgICAgICAgZW50cnkucHViRGF0ZSA9IG5ldyBEYXRlKHB1YkRhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVudHJ5O1xuICAgICAgICB9KSxcbiAgICB9O1xuICAgIGFkZENvbmRpdGlvbmFsbHkoZmVlZCwgXCJpZFwiLCBcImlkXCIsIGNoaWxkcyk7XG4gICAgYWRkQ29uZGl0aW9uYWxseShmZWVkLCBcInRpdGxlXCIsIFwidGl0bGVcIiwgY2hpbGRzKTtcbiAgICB2YXIgaHJlZiA9IChfYSA9IGdldE9uZUVsZW1lbnQoXCJsaW5rXCIsIGNoaWxkcykpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5hdHRyaWJzLmhyZWY7XG4gICAgaWYgKGhyZWYpIHtcbiAgICAgICAgZmVlZC5saW5rID0gaHJlZjtcbiAgICB9XG4gICAgYWRkQ29uZGl0aW9uYWxseShmZWVkLCBcImRlc2NyaXB0aW9uXCIsIFwic3VidGl0bGVcIiwgY2hpbGRzKTtcbiAgICB2YXIgdXBkYXRlZCA9IGZldGNoKFwidXBkYXRlZFwiLCBjaGlsZHMpO1xuICAgIGlmICh1cGRhdGVkKSB7XG4gICAgICAgIGZlZWQudXBkYXRlZCA9IG5ldyBEYXRlKHVwZGF0ZWQpO1xuICAgIH1cbiAgICBhZGRDb25kaXRpb25hbGx5KGZlZWQsIFwiYXV0aG9yXCIsIFwiZW1haWxcIiwgY2hpbGRzLCB0cnVlKTtcbiAgICByZXR1cm4gZmVlZDtcbn1cbi8qKlxuICogUGFyc2UgYSBSU1MgZmVlZC5cbiAqXG4gKiBAcGFyYW0gZmVlZFJvb3QgVGhlIHJvb3Qgb2YgdGhlIGZlZWQuXG4gKiBAcmV0dXJucyBUaGUgcGFyc2VkIGZlZWQuXG4gKi9cbmZ1bmN0aW9uIGdldFJzc0ZlZWQoZmVlZFJvb3QpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIHZhciBjaGlsZHMgPSAoX2IgPSAoX2EgPSBnZXRPbmVFbGVtZW50KFwiY2hhbm5lbFwiLCBmZWVkUm9vdC5jaGlsZHJlbikpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jaGlsZHJlbikgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW107XG4gICAgdmFyIGZlZWQgPSB7XG4gICAgICAgIHR5cGU6IGZlZWRSb290Lm5hbWUuc3Vic3RyKDAsIDMpLFxuICAgICAgICBpZDogXCJcIixcbiAgICAgICAgaXRlbXM6ICgwLCBsZWdhY3lfMS5nZXRFbGVtZW50c0J5VGFnTmFtZSkoXCJpdGVtXCIsIGZlZWRSb290LmNoaWxkcmVuKS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICB2YXIgZW50cnkgPSB7IG1lZGlhOiBnZXRNZWRpYUVsZW1lbnRzKGNoaWxkcmVuKSB9O1xuICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJpZFwiLCBcImd1aWRcIiwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJ0aXRsZVwiLCBcInRpdGxlXCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIGFkZENvbmRpdGlvbmFsbHkoZW50cnksIFwibGlua1wiLCBcImxpbmtcIiwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJkZXNjcmlwdGlvblwiLCBcImRlc2NyaXB0aW9uXCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIHZhciBwdWJEYXRlID0gZmV0Y2goXCJwdWJEYXRlXCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIGlmIChwdWJEYXRlKVxuICAgICAgICAgICAgICAgIGVudHJ5LnB1YkRhdGUgPSBuZXcgRGF0ZShwdWJEYXRlKTtcbiAgICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgfSksXG4gICAgfTtcbiAgICBhZGRDb25kaXRpb25hbGx5KGZlZWQsIFwidGl0bGVcIiwgXCJ0aXRsZVwiLCBjaGlsZHMpO1xuICAgIGFkZENvbmRpdGlvbmFsbHkoZmVlZCwgXCJsaW5rXCIsIFwibGlua1wiLCBjaGlsZHMpO1xuICAgIGFkZENvbmRpdGlvbmFsbHkoZmVlZCwgXCJkZXNjcmlwdGlvblwiLCBcImRlc2NyaXB0aW9uXCIsIGNoaWxkcyk7XG4gICAgdmFyIHVwZGF0ZWQgPSBmZXRjaChcImxhc3RCdWlsZERhdGVcIiwgY2hpbGRzKTtcbiAgICBpZiAodXBkYXRlZCkge1xuICAgICAgICBmZWVkLnVwZGF0ZWQgPSBuZXcgRGF0ZSh1cGRhdGVkKTtcbiAgICB9XG4gICAgYWRkQ29uZGl0aW9uYWxseShmZWVkLCBcImF1dGhvclwiLCBcIm1hbmFnaW5nRWRpdG9yXCIsIGNoaWxkcywgdHJ1ZSk7XG4gICAgcmV0dXJuIGZlZWQ7XG59XG52YXIgTUVESUFfS0VZU19TVFJJTkcgPSBbXCJ1cmxcIiwgXCJ0eXBlXCIsIFwibGFuZ1wiXTtcbnZhciBNRURJQV9LRVlTX0lOVCA9IFtcbiAgICBcImZpbGVTaXplXCIsXG4gICAgXCJiaXRyYXRlXCIsXG4gICAgXCJmcmFtZXJhdGVcIixcbiAgICBcInNhbXBsaW5ncmF0ZVwiLFxuICAgIFwiY2hhbm5lbHNcIixcbiAgICBcImR1cmF0aW9uXCIsXG4gICAgXCJoZWlnaHRcIixcbiAgICBcIndpZHRoXCIsXG5dO1xuLyoqXG4gKiBHZXQgYWxsIG1lZGlhIGVsZW1lbnRzIG9mIGEgZmVlZCBpdGVtLlxuICpcbiAqIEBwYXJhbSB3aGVyZSBOb2RlcyB0byBzZWFyY2ggaW4uXG4gKiBAcmV0dXJucyBNZWRpYSBlbGVtZW50cy5cbiAqL1xuZnVuY3Rpb24gZ2V0TWVkaWFFbGVtZW50cyh3aGVyZSkge1xuICAgIHJldHVybiAoMCwgbGVnYWN5XzEuZ2V0RWxlbWVudHNCeVRhZ05hbWUpKFwibWVkaWE6Y29udGVudFwiLCB3aGVyZSkubWFwKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHZhciBhdHRyaWJzID0gZWxlbS5hdHRyaWJzO1xuICAgICAgICB2YXIgbWVkaWEgPSB7XG4gICAgICAgICAgICBtZWRpdW06IGF0dHJpYnMubWVkaXVtLFxuICAgICAgICAgICAgaXNEZWZhdWx0OiAhIWF0dHJpYnMuaXNEZWZhdWx0LFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIE1FRElBX0tFWVNfU1RSSU5HXzEgPSBNRURJQV9LRVlTX1NUUklORzsgX2kgPCBNRURJQV9LRVlTX1NUUklOR18xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIGF0dHJpYiA9IE1FRElBX0tFWVNfU1RSSU5HXzFbX2ldO1xuICAgICAgICAgICAgaWYgKGF0dHJpYnNbYXR0cmliXSkge1xuICAgICAgICAgICAgICAgIG1lZGlhW2F0dHJpYl0gPSBhdHRyaWJzW2F0dHJpYl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBNRURJQV9LRVlTX0lOVF8xID0gTUVESUFfS0VZU19JTlQ7IF9hIDwgTUVESUFfS0VZU19JTlRfMS5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgIHZhciBhdHRyaWIgPSBNRURJQV9LRVlTX0lOVF8xW19hXTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJzW2F0dHJpYl0pIHtcbiAgICAgICAgICAgICAgICBtZWRpYVthdHRyaWJdID0gcGFyc2VJbnQoYXR0cmlic1thdHRyaWJdLCAxMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGF0dHJpYnMuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgbWVkaWEuZXhwcmVzc2lvbiA9XG4gICAgICAgICAgICAgICAgYXR0cmlicy5leHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZWRpYTtcbiAgICB9KTtcbn1cbi8qKlxuICogR2V0IG9uZSBlbGVtZW50IGJ5IHRhZyBuYW1lLlxuICpcbiAqIEBwYXJhbSB0YWdOYW1lIFRhZyBuYW1lIHRvIGxvb2sgZm9yXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIHNlYXJjaCBpblxuICogQHJldHVybnMgVGhlIGVsZW1lbnQgb3IgbnVsbFxuICovXG5mdW5jdGlvbiBnZXRPbmVFbGVtZW50KHRhZ05hbWUsIG5vZGUpIHtcbiAgICByZXR1cm4gKDAsIGxlZ2FjeV8xLmdldEVsZW1lbnRzQnlUYWdOYW1lKSh0YWdOYW1lLCBub2RlLCB0cnVlLCAxKVswXTtcbn1cbi8qKlxuICogR2V0IHRoZSB0ZXh0IGNvbnRlbnQgb2YgYW4gZWxlbWVudCB3aXRoIGEgY2VydGFpbiB0YWcgbmFtZS5cbiAqXG4gKiBAcGFyYW0gdGFnTmFtZSBUYWcgbmFtZSB0byBsb29rIGZvci5cbiAqIEBwYXJhbSB3aGVyZSAgTm9kZSB0byBzZWFyY2ggaW4uXG4gKiBAcGFyYW0gcmVjdXJzZSBXaGV0aGVyIHRvIHJlY3Vyc2UgaW50byBjaGlsZCBub2Rlcy5cbiAqIEByZXR1cm5zIFRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQuXG4gKi9cbmZ1bmN0aW9uIGZldGNoKHRhZ05hbWUsIHdoZXJlLCByZWN1cnNlKSB7XG4gICAgaWYgKHJlY3Vyc2UgPT09IHZvaWQgMCkgeyByZWN1cnNlID0gZmFsc2U7IH1cbiAgICByZXR1cm4gKDAsIHN0cmluZ2lmeV8xLnRleHRDb250ZW50KSgoMCwgbGVnYWN5XzEuZ2V0RWxlbWVudHNCeVRhZ05hbWUpKHRhZ05hbWUsIHdoZXJlLCByZWN1cnNlLCAxKSkudHJpbSgpO1xufVxuLyoqXG4gKiBBZGRzIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0IGlmIGl0IGhhcyBhIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBvYmogT2JqZWN0IHRvIGJlIGV4dGVuZGVkXG4gKiBAcGFyYW0gcHJvcCBQcm9wZXJ0eSBuYW1lXG4gKiBAcGFyYW0gdGFnTmFtZSBUYWcgbmFtZSB0aGF0IGNvbnRhaW5zIHRoZSBjb25kaXRpb25hbGx5IGFkZGVkIHByb3BlcnR5XG4gKiBAcGFyYW0gd2hlcmUgRWxlbWVudCB0byBzZWFyY2ggZm9yIHRoZSBwcm9wZXJ0eVxuICogQHBhcmFtIHJlY3Vyc2UgV2hldGhlciB0byByZWN1cnNlIGludG8gY2hpbGQgbm9kZXMuXG4gKi9cbmZ1bmN0aW9uIGFkZENvbmRpdGlvbmFsbHkob2JqLCBwcm9wLCB0YWdOYW1lLCB3aGVyZSwgcmVjdXJzZSkge1xuICAgIGlmIChyZWN1cnNlID09PSB2b2lkIDApIHsgcmVjdXJzZSA9IGZhbHNlOyB9XG4gICAgdmFyIHZhbCA9IGZldGNoKHRhZ05hbWUsIHdoZXJlLCByZWN1cnNlKTtcbiAgICBpZiAodmFsKVxuICAgICAgICBvYmpbcHJvcF0gPSB2YWw7XG59XG4vKipcbiAqIENoZWNrcyBpZiBhbiBlbGVtZW50IGlzIGEgZmVlZCByb290IG5vZGUuXG4gKlxuICogQHBhcmFtIHZhbHVlIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRvIGNoZWNrLlxuICogQHJldHVybnMgV2hldGhlciBhbiBlbGVtZW50IGlzIGEgZmVlZCByb290IG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGlzVmFsaWRGZWVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBcInJzc1wiIHx8IHZhbHVlID09PSBcImZlZWRcIiB8fCB2YWx1ZSA9PT0gXCJyZGY6UkRGXCI7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudW5pcXVlU29ydCA9IGV4cG9ydHMuY29tcGFyZURvY3VtZW50UG9zaXRpb24gPSBleHBvcnRzLnJlbW92ZVN1YnNldHMgPSB2b2lkIDA7XG52YXIgZG9taGFuZGxlcl8xID0gcmVxdWlyZShcImRvbWhhbmRsZXJcIik7XG4vKipcbiAqIEdpdmVuIGFuIGFycmF5IG9mIG5vZGVzLCByZW1vdmUgYW55IG1lbWJlciB0aGF0IGlzIGNvbnRhaW5lZCBieSBhbm90aGVyLlxuICpcbiAqIEBwYXJhbSBub2RlcyBOb2RlcyB0byBmaWx0ZXIuXG4gKiBAcmV0dXJucyBSZW1haW5pbmcgbm9kZXMgdGhhdCBhcmVuJ3Qgc3VidHJlZXMgb2YgZWFjaCBvdGhlci5cbiAqL1xuZnVuY3Rpb24gcmVtb3ZlU3Vic2V0cyhub2Rlcykge1xuICAgIHZhciBpZHggPSBub2Rlcy5sZW5ndGg7XG4gICAgLypcbiAgICAgKiBDaGVjayBpZiBlYWNoIG5vZGUgKG9yIG9uZSBvZiBpdHMgYW5jZXN0b3JzKSBpcyBhbHJlYWR5IGNvbnRhaW5lZCBpbiB0aGVcbiAgICAgKiBhcnJheS5cbiAgICAgKi9cbiAgICB3aGlsZSAoLS1pZHggPj0gMCkge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2lkeF07XG4gICAgICAgIC8qXG4gICAgICAgICAqIFJlbW92ZSB0aGUgbm9kZSBpZiBpdCBpcyBub3QgdW5pcXVlLlxuICAgICAgICAgKiBXZSBhcmUgZ29pbmcgdGhyb3VnaCB0aGUgYXJyYXkgZnJvbSB0aGUgZW5kLCBzbyB3ZSBvbmx5XG4gICAgICAgICAqIGhhdmUgdG8gY2hlY2sgbm9kZXMgdGhhdCBwcmVjZWVkIHRoZSBub2RlIHVuZGVyIGNvbnNpZGVyYXRpb24gaW4gdGhlIGFycmF5LlxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKGlkeCA+IDAgJiYgbm9kZXMubGFzdEluZGV4T2Yobm9kZSwgaWR4IC0gMSkgPj0gMCkge1xuICAgICAgICAgICAgbm9kZXMuc3BsaWNlKGlkeCwgMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBhbmNlc3RvciA9IG5vZGUucGFyZW50OyBhbmNlc3RvcjsgYW5jZXN0b3IgPSBhbmNlc3Rvci5wYXJlbnQpIHtcbiAgICAgICAgICAgIGlmIChub2Rlcy5pbmNsdWRlcyhhbmNlc3RvcikpIHtcbiAgICAgICAgICAgICAgICBub2Rlcy5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZXM7XG59XG5leHBvcnRzLnJlbW92ZVN1YnNldHMgPSByZW1vdmVTdWJzZXRzO1xuLyoqXG4gKiBDb21wYXJlIHRoZSBwb3NpdGlvbiBvZiBvbmUgbm9kZSBhZ2FpbnN0IGFub3RoZXIgbm9kZSBpbiBhbnkgb3RoZXIgZG9jdW1lbnQuXG4gKiBUaGUgcmV0dXJuIHZhbHVlIGlzIGEgYml0bWFzayB3aXRoIHRoZSBmb2xsb3dpbmcgdmFsdWVzOlxuICpcbiAqIERvY3VtZW50IG9yZGVyOlxuICogPiBUaGVyZSBpcyBhbiBvcmRlcmluZywgZG9jdW1lbnQgb3JkZXIsIGRlZmluZWQgb24gYWxsIHRoZSBub2RlcyBpbiB0aGVcbiAqID4gZG9jdW1lbnQgY29ycmVzcG9uZGluZyB0byB0aGUgb3JkZXIgaW4gd2hpY2ggdGhlIGZpcnN0IGNoYXJhY3RlciBvZiB0aGVcbiAqID4gWE1MIHJlcHJlc2VudGF0aW9uIG9mIGVhY2ggbm9kZSBvY2N1cnMgaW4gdGhlIFhNTCByZXByZXNlbnRhdGlvbiBvZiB0aGVcbiAqID4gZG9jdW1lbnQgYWZ0ZXIgZXhwYW5zaW9uIG9mIGdlbmVyYWwgZW50aXRpZXMuIFRodXMsIHRoZSBkb2N1bWVudCBlbGVtZW50XG4gKiA+IG5vZGUgd2lsbCBiZSB0aGUgZmlyc3Qgbm9kZS4gRWxlbWVudCBub2RlcyBvY2N1ciBiZWZvcmUgdGhlaXIgY2hpbGRyZW4uXG4gKiA+IFRodXMsIGRvY3VtZW50IG9yZGVyIG9yZGVycyBlbGVtZW50IG5vZGVzIGluIG9yZGVyIG9mIHRoZSBvY2N1cnJlbmNlIG9mXG4gKiA+IHRoZWlyIHN0YXJ0LXRhZyBpbiB0aGUgWE1MIChhZnRlciBleHBhbnNpb24gb2YgZW50aXRpZXMpLiBUaGUgYXR0cmlidXRlXG4gKiA+IG5vZGVzIG9mIGFuIGVsZW1lbnQgb2NjdXIgYWZ0ZXIgdGhlIGVsZW1lbnQgYW5kIGJlZm9yZSBpdHMgY2hpbGRyZW4uIFRoZVxuICogPiByZWxhdGl2ZSBvcmRlciBvZiBhdHRyaWJ1dGUgbm9kZXMgaXMgaW1wbGVtZW50YXRpb24tZGVwZW5kZW50Li9cbiAqXG4gKiBTb3VyY2U6XG4gKiBodHRwOi8vd3d3LnczLm9yZy9UUi9ET00tTGV2ZWwtMy1Db3JlL2dsb3NzYXJ5Lmh0bWwjZHQtZG9jdW1lbnQtb3JkZXJcbiAqXG4gKiBAcGFyYW0gbm9kZUEgVGhlIGZpcnN0IG5vZGUgdG8gdXNlIGluIHRoZSBjb21wYXJpc29uXG4gKiBAcGFyYW0gbm9kZUIgVGhlIHNlY29uZCBub2RlIHRvIHVzZSBpbiB0aGUgY29tcGFyaXNvblxuICogQHJldHVybnMgQSBiaXRtYXNrIGRlc2NyaWJpbmcgdGhlIGlucHV0IG5vZGVzJyByZWxhdGl2ZSBwb3NpdGlvbi5cbiAqXG4gKiBTZWUgaHR0cDovL2RvbS5zcGVjLndoYXR3Zy5vcmcvI2RvbS1ub2RlLWNvbXBhcmVkb2N1bWVudHBvc2l0aW9uIGZvclxuICogYSBkZXNjcmlwdGlvbiBvZiB0aGVzZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKG5vZGVBLCBub2RlQikge1xuICAgIHZhciBhUGFyZW50cyA9IFtdO1xuICAgIHZhciBiUGFyZW50cyA9IFtdO1xuICAgIGlmIChub2RlQSA9PT0gbm9kZUIpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIHZhciBjdXJyZW50ID0gKDAsIGRvbWhhbmRsZXJfMS5oYXNDaGlsZHJlbikobm9kZUEpID8gbm9kZUEgOiBub2RlQS5wYXJlbnQ7XG4gICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgYVBhcmVudHMudW5zaGlmdChjdXJyZW50KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cbiAgICBjdXJyZW50ID0gKDAsIGRvbWhhbmRsZXJfMS5oYXNDaGlsZHJlbikobm9kZUIpID8gbm9kZUIgOiBub2RlQi5wYXJlbnQ7XG4gICAgd2hpbGUgKGN1cnJlbnQpIHtcbiAgICAgICAgYlBhcmVudHMudW5zaGlmdChjdXJyZW50KTtcbiAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgIH1cbiAgICB2YXIgbWF4SWR4ID0gTWF0aC5taW4oYVBhcmVudHMubGVuZ3RoLCBiUGFyZW50cy5sZW5ndGgpO1xuICAgIHZhciBpZHggPSAwO1xuICAgIHdoaWxlIChpZHggPCBtYXhJZHggJiYgYVBhcmVudHNbaWR4XSA9PT0gYlBhcmVudHNbaWR4XSkge1xuICAgICAgICBpZHgrKztcbiAgICB9XG4gICAgaWYgKGlkeCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gMSAvKiBESVNDT05ORUNURUQgKi87XG4gICAgfVxuICAgIHZhciBzaGFyZWRQYXJlbnQgPSBhUGFyZW50c1tpZHggLSAxXTtcbiAgICB2YXIgc2libGluZ3MgPSBzaGFyZWRQYXJlbnQuY2hpbGRyZW47XG4gICAgdmFyIGFTaWJsaW5nID0gYVBhcmVudHNbaWR4XTtcbiAgICB2YXIgYlNpYmxpbmcgPSBiUGFyZW50c1tpZHhdO1xuICAgIGlmIChzaWJsaW5ncy5pbmRleE9mKGFTaWJsaW5nKSA+IHNpYmxpbmdzLmluZGV4T2YoYlNpYmxpbmcpKSB7XG4gICAgICAgIGlmIChzaGFyZWRQYXJlbnQgPT09IG5vZGVCKSB7XG4gICAgICAgICAgICByZXR1cm4gNCAvKiBGT0xMT1dJTkcgKi8gfCAxNiAvKiBDT05UQUlORURfQlkgKi87XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDQgLyogRk9MTE9XSU5HICovO1xuICAgIH1cbiAgICBpZiAoc2hhcmVkUGFyZW50ID09PSBub2RlQSkge1xuICAgICAgICByZXR1cm4gMiAvKiBQUkVDRURJTkcgKi8gfCA4IC8qIENPTlRBSU5TICovO1xuICAgIH1cbiAgICByZXR1cm4gMiAvKiBQUkVDRURJTkcgKi87XG59XG5leHBvcnRzLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uID0gY29tcGFyZURvY3VtZW50UG9zaXRpb247XG4vKipcbiAqIFNvcnQgYW4gYXJyYXkgb2Ygbm9kZXMgYmFzZWQgb24gdGhlaXIgcmVsYXRpdmUgcG9zaXRpb24gaW4gdGhlIGRvY3VtZW50IGFuZFxuICogcmVtb3ZlIGFueSBkdXBsaWNhdGUgbm9kZXMuIElmIHRoZSBhcnJheSBjb250YWlucyBub2RlcyB0aGF0IGRvIG5vdCBiZWxvbmdcbiAqIHRvIHRoZSBzYW1lIGRvY3VtZW50LCBzb3J0IG9yZGVyIGlzIHVuc3BlY2lmaWVkLlxuICpcbiAqIEBwYXJhbSBub2RlcyBBcnJheSBvZiBET00gbm9kZXMuXG4gKiBAcmV0dXJucyBDb2xsZWN0aW9uIG9mIHVuaXF1ZSBub2Rlcywgc29ydGVkIGluIGRvY3VtZW50IG9yZGVyLlxuICovXG5mdW5jdGlvbiB1bmlxdWVTb3J0KG5vZGVzKSB7XG4gICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKG5vZGUsIGksIGFycikgeyByZXR1cm4gIWFyci5pbmNsdWRlcyhub2RlLCBpICsgMSk7IH0pO1xuICAgIG5vZGVzLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgdmFyIHJlbGF0aXZlID0gY29tcGFyZURvY3VtZW50UG9zaXRpb24oYSwgYik7XG4gICAgICAgIGlmIChyZWxhdGl2ZSAmIDIgLyogUFJFQ0VESU5HICovKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocmVsYXRpdmUgJiA0IC8qIEZPTExPV0lORyAqLykge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5vZGVzO1xufVxuZXhwb3J0cy51bmlxdWVTb3J0ID0gdW5pcXVlU29ydDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmhhc0NoaWxkcmVuID0gZXhwb3J0cy5pc0RvY3VtZW50ID0gZXhwb3J0cy5pc0NvbW1lbnQgPSBleHBvcnRzLmlzVGV4dCA9IGV4cG9ydHMuaXNDREFUQSA9IGV4cG9ydHMuaXNUYWcgPSB2b2lkIDA7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vc3RyaW5naWZ5XCIpLCBleHBvcnRzKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90cmF2ZXJzYWxcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL21hbmlwdWxhdGlvblwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vcXVlcnlpbmdcIiksIGV4cG9ydHMpO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL2xlZ2FjeVwiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vaGVscGVyc1wiKSwgZXhwb3J0cyk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vZmVlZHNcIiksIGV4cG9ydHMpO1xuLyoqIEBkZXByZWNhdGVkIFVzZSB0aGVzZSBtZXRob2RzIGZyb20gYGRvbWhhbmRsZXJgIGRpcmVjdGx5LiAqL1xudmFyIGRvbWhhbmRsZXJfMSA9IHJlcXVpcmUoXCJkb21oYW5kbGVyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaXNUYWdcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRvbWhhbmRsZXJfMS5pc1RhZzsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImlzQ0RBVEFcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRvbWhhbmRsZXJfMS5pc0NEQVRBOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaXNUZXh0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb21oYW5kbGVyXzEuaXNUZXh0OyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaXNDb21tZW50XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb21oYW5kbGVyXzEuaXNDb21tZW50OyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiaXNEb2N1bWVudFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9taGFuZGxlcl8xLmlzRG9jdW1lbnQ7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJoYXNDaGlsZHJlblwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZG9taGFuZGxlcl8xLmhhc0NoaWxkcmVuOyB9IH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmdldEVsZW1lbnRzQnlUYWdUeXBlID0gZXhwb3J0cy5nZXRFbGVtZW50c0J5VGFnTmFtZSA9IGV4cG9ydHMuZ2V0RWxlbWVudEJ5SWQgPSBleHBvcnRzLmdldEVsZW1lbnRzID0gZXhwb3J0cy50ZXN0RWxlbWVudCA9IHZvaWQgMDtcbnZhciBkb21oYW5kbGVyXzEgPSByZXF1aXJlKFwiZG9taGFuZGxlclwiKTtcbnZhciBxdWVyeWluZ18xID0gcmVxdWlyZShcIi4vcXVlcnlpbmdcIik7XG52YXIgQ2hlY2tzID0ge1xuICAgIHRhZ19uYW1lOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtKSB7IHJldHVybiAoMCwgZG9taGFuZGxlcl8xLmlzVGFnKShlbGVtKSAmJiBuYW1lKGVsZW0ubmFtZSk7IH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobmFtZSA9PT0gXCIqXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21oYW5kbGVyXzEuaXNUYWc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtKSB7IHJldHVybiAoMCwgZG9taGFuZGxlcl8xLmlzVGFnKShlbGVtKSAmJiBlbGVtLm5hbWUgPT09IG5hbWU7IH07XG4gICAgfSxcbiAgICB0YWdfdHlwZTogZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbSkgeyByZXR1cm4gdHlwZShlbGVtLnR5cGUpOyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbSkgeyByZXR1cm4gZWxlbS50eXBlID09PSB0eXBlOyB9O1xuICAgIH0sXG4gICAgdGFnX2NvbnRhaW5zOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAodHlwZW9mIGRhdGEgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtKSB7IHJldHVybiAoMCwgZG9taGFuZGxlcl8xLmlzVGV4dCkoZWxlbSkgJiYgZGF0YShlbGVtLmRhdGEpOyB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbSkgeyByZXR1cm4gKDAsIGRvbWhhbmRsZXJfMS5pc1RleHQpKGVsZW0pICYmIGVsZW0uZGF0YSA9PT0gZGF0YTsgfTtcbiAgICB9LFxufTtcbi8qKlxuICogQHBhcmFtIGF0dHJpYiBBdHRyaWJ1dGUgdG8gY2hlY2suXG4gKiBAcGFyYW0gdmFsdWUgQXR0cmlidXRlIHZhbHVlIHRvIGxvb2sgZm9yLlxuICogQHJldHVybnMgQSBmdW5jdGlvbiB0byBjaGVjayB3aGV0aGVyIHRoZSBhIG5vZGUgaGFzIGFuIGF0dHJpYnV0ZSB3aXRoIGEgcGFydGljdWxhciB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0QXR0cmliQ2hlY2soYXR0cmliLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGVsZW0pIHsgcmV0dXJuICgwLCBkb21oYW5kbGVyXzEuaXNUYWcpKGVsZW0pICYmIHZhbHVlKGVsZW0uYXR0cmlic1thdHRyaWJdKTsgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlbGVtKSB7IHJldHVybiAoMCwgZG9taGFuZGxlcl8xLmlzVGFnKShlbGVtKSAmJiBlbGVtLmF0dHJpYnNbYXR0cmliXSA9PT0gdmFsdWU7IH07XG59XG4vKipcbiAqIEBwYXJhbSBhIEZpcnN0IGZ1bmN0aW9uIHRvIGNvbWJpbmUuXG4gKiBAcGFyYW0gYiBTZWNvbmQgZnVuY3Rpb24gdG8gY29tYmluZS5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGFraW5nIGEgbm9kZSBhbmQgcmV0dXJuaW5nIGB0cnVlYCBpZiBlaXRoZXJcbiAqIG9mIHRoZSBpbnB1dCBmdW5jdGlvbnMgcmV0dXJucyBgdHJ1ZWAgZm9yIHRoZSBub2RlLlxuICovXG5mdW5jdGlvbiBjb21iaW5lRnVuY3MoYSwgYikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZWxlbSkgeyByZXR1cm4gYShlbGVtKSB8fCBiKGVsZW0pOyB9O1xufVxuLyoqXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBvYmplY3QgZGVzY3JpYmluZyBub2RlcyB0byBsb29rIGZvci5cbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gZXhlY3V0aW5nIGFsbCBjaGVja3MgaW4gYG9wdGlvbnNgIGFuZCByZXR1cm5pbmcgYHRydWVgXG4gKiBpZiBhbnkgb2YgdGhlbSBtYXRjaCBhIG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGVUZXN0KG9wdGlvbnMpIHtcbiAgICB2YXIgZnVuY3MgPSBPYmplY3Qua2V5cyhvcHRpb25zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBvcHRpb25zW2tleV07XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoQ2hlY2tzLCBrZXkpXG4gICAgICAgICAgICA/IENoZWNrc1trZXldKHZhbHVlKVxuICAgICAgICAgICAgOiBnZXRBdHRyaWJDaGVjayhrZXksIHZhbHVlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZnVuY3MubGVuZ3RoID09PSAwID8gbnVsbCA6IGZ1bmNzLnJlZHVjZShjb21iaW5lRnVuY3MpO1xufVxuLyoqXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBvYmplY3QgZGVzY3JpYmluZyBub2RlcyB0byBsb29rIGZvci5cbiAqIEBwYXJhbSBub2RlIFRoZSBlbGVtZW50IHRvIHRlc3QuXG4gKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBlbGVtZW50IG1hdGNoZXMgdGhlIGRlc2NyaXB0aW9uIGluIGBvcHRpb25zYC5cbiAqL1xuZnVuY3Rpb24gdGVzdEVsZW1lbnQob3B0aW9ucywgbm9kZSkge1xuICAgIHZhciB0ZXN0ID0gY29tcGlsZVRlc3Qob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRlc3QgPyB0ZXN0KG5vZGUpIDogdHJ1ZTtcbn1cbmV4cG9ydHMudGVzdEVsZW1lbnQgPSB0ZXN0RWxlbWVudDtcbi8qKlxuICogQHBhcmFtIG9wdGlvbnMgQW4gb2JqZWN0IGRlc2NyaWJpbmcgbm9kZXMgdG8gbG9vayBmb3IuXG4gKiBAcGFyYW0gbm9kZXMgTm9kZXMgdG8gc2VhcmNoIHRocm91Z2guXG4gKiBAcGFyYW0gcmVjdXJzZSBBbHNvIGNvbnNpZGVyIGNoaWxkIG5vZGVzLlxuICogQHBhcmFtIGxpbWl0IE1heGltdW0gbnVtYmVyIG9mIG5vZGVzIHRvIHJldHVybi5cbiAqIEByZXR1cm5zIEFsbCBub2RlcyB0aGF0IG1hdGNoIGBvcHRpb25zYC5cbiAqL1xuZnVuY3Rpb24gZ2V0RWxlbWVudHMob3B0aW9ucywgbm9kZXMsIHJlY3Vyc2UsIGxpbWl0KSB7XG4gICAgaWYgKGxpbWl0ID09PSB2b2lkIDApIHsgbGltaXQgPSBJbmZpbml0eTsgfVxuICAgIHZhciB0ZXN0ID0gY29tcGlsZVRlc3Qob3B0aW9ucyk7XG4gICAgcmV0dXJuIHRlc3QgPyAoMCwgcXVlcnlpbmdfMS5maWx0ZXIpKHRlc3QsIG5vZGVzLCByZWN1cnNlLCBsaW1pdCkgOiBbXTtcbn1cbmV4cG9ydHMuZ2V0RWxlbWVudHMgPSBnZXRFbGVtZW50cztcbi8qKlxuICogQHBhcmFtIGlkIFRoZSB1bmlxdWUgSUQgYXR0cmlidXRlIHZhbHVlIHRvIGxvb2sgZm9yLlxuICogQHBhcmFtIG5vZGVzIE5vZGVzIHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHJlY3Vyc2UgQWxzbyBjb25zaWRlciBjaGlsZCBub2Rlcy5cbiAqIEByZXR1cm5zIFRoZSBub2RlIHdpdGggdGhlIHN1cHBsaWVkIElELlxuICovXG5mdW5jdGlvbiBnZXRFbGVtZW50QnlJZChpZCwgbm9kZXMsIHJlY3Vyc2UpIHtcbiAgICBpZiAocmVjdXJzZSA9PT0gdm9pZCAwKSB7IHJlY3Vyc2UgPSB0cnVlOyB9XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KG5vZGVzKSlcbiAgICAgICAgbm9kZXMgPSBbbm9kZXNdO1xuICAgIHJldHVybiAoMCwgcXVlcnlpbmdfMS5maW5kT25lKShnZXRBdHRyaWJDaGVjayhcImlkXCIsIGlkKSwgbm9kZXMsIHJlY3Vyc2UpO1xufVxuZXhwb3J0cy5nZXRFbGVtZW50QnlJZCA9IGdldEVsZW1lbnRCeUlkO1xuLyoqXG4gKiBAcGFyYW0gdGFnTmFtZSBUYWcgbmFtZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIG5vZGVzIE5vZGVzIHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHJlY3Vyc2UgQWxzbyBjb25zaWRlciBjaGlsZCBub2Rlcy5cbiAqIEBwYXJhbSBsaW1pdCBNYXhpbXVtIG51bWJlciBvZiBub2RlcyB0byByZXR1cm4uXG4gKiBAcmV0dXJucyBBbGwgbm9kZXMgd2l0aCB0aGUgc3VwcGxpZWQgYHRhZ05hbWVgLlxuICovXG5mdW5jdGlvbiBnZXRFbGVtZW50c0J5VGFnTmFtZSh0YWdOYW1lLCBub2RlcywgcmVjdXJzZSwgbGltaXQpIHtcbiAgICBpZiAocmVjdXJzZSA9PT0gdm9pZCAwKSB7IHJlY3Vyc2UgPSB0cnVlOyB9XG4gICAgaWYgKGxpbWl0ID09PSB2b2lkIDApIHsgbGltaXQgPSBJbmZpbml0eTsgfVxuICAgIHJldHVybiAoMCwgcXVlcnlpbmdfMS5maWx0ZXIpKENoZWNrcy50YWdfbmFtZSh0YWdOYW1lKSwgbm9kZXMsIHJlY3Vyc2UsIGxpbWl0KTtcbn1cbmV4cG9ydHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUgPSBnZXRFbGVtZW50c0J5VGFnTmFtZTtcbi8qKlxuICogQHBhcmFtIHR5cGUgRWxlbWVudCB0eXBlIHRvIGxvb2sgZm9yLlxuICogQHBhcmFtIG5vZGVzIE5vZGVzIHRvIHNlYXJjaCB0aHJvdWdoLlxuICogQHBhcmFtIHJlY3Vyc2UgQWxzbyBjb25zaWRlciBjaGlsZCBub2Rlcy5cbiAqIEBwYXJhbSBsaW1pdCBNYXhpbXVtIG51bWJlciBvZiBub2RlcyB0byByZXR1cm4uXG4gKiBAcmV0dXJucyBBbGwgbm9kZXMgd2l0aCB0aGUgc3VwcGxpZWQgYHR5cGVgLlxuICovXG5mdW5jdGlvbiBnZXRFbGVtZW50c0J5VGFnVHlwZSh0eXBlLCBub2RlcywgcmVjdXJzZSwgbGltaXQpIHtcbiAgICBpZiAocmVjdXJzZSA9PT0gdm9pZCAwKSB7IHJlY3Vyc2UgPSB0cnVlOyB9XG4gICAgaWYgKGxpbWl0ID09PSB2b2lkIDApIHsgbGltaXQgPSBJbmZpbml0eTsgfVxuICAgIHJldHVybiAoMCwgcXVlcnlpbmdfMS5maWx0ZXIpKENoZWNrcy50YWdfdHlwZSh0eXBlKSwgbm9kZXMsIHJlY3Vyc2UsIGxpbWl0KTtcbn1cbmV4cG9ydHMuZ2V0RWxlbWVudHNCeVRhZ1R5cGUgPSBnZXRFbGVtZW50c0J5VGFnVHlwZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wcmVwZW5kID0gZXhwb3J0cy5wcmVwZW5kQ2hpbGQgPSBleHBvcnRzLmFwcGVuZCA9IGV4cG9ydHMuYXBwZW5kQ2hpbGQgPSBleHBvcnRzLnJlcGxhY2VFbGVtZW50ID0gZXhwb3J0cy5yZW1vdmVFbGVtZW50ID0gdm9pZCAwO1xuLyoqXG4gKiBSZW1vdmUgYW4gZWxlbWVudCBmcm9tIHRoZSBkb21cbiAqXG4gKiBAcGFyYW0gZWxlbSBUaGUgZWxlbWVudCB0byBiZSByZW1vdmVkXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUVsZW1lbnQoZWxlbSkge1xuICAgIGlmIChlbGVtLnByZXYpXG4gICAgICAgIGVsZW0ucHJldi5uZXh0ID0gZWxlbS5uZXh0O1xuICAgIGlmIChlbGVtLm5leHQpXG4gICAgICAgIGVsZW0ubmV4dC5wcmV2ID0gZWxlbS5wcmV2O1xuICAgIGlmIChlbGVtLnBhcmVudCkge1xuICAgICAgICB2YXIgY2hpbGRzID0gZWxlbS5wYXJlbnQuY2hpbGRyZW47XG4gICAgICAgIGNoaWxkcy5zcGxpY2UoY2hpbGRzLmxhc3RJbmRleE9mKGVsZW0pLCAxKTtcbiAgICB9XG59XG5leHBvcnRzLnJlbW92ZUVsZW1lbnQgPSByZW1vdmVFbGVtZW50O1xuLyoqXG4gKiBSZXBsYWNlIGFuIGVsZW1lbnQgaW4gdGhlIGRvbVxuICpcbiAqIEBwYXJhbSBlbGVtIFRoZSBlbGVtZW50IHRvIGJlIHJlcGxhY2VkXG4gKiBAcGFyYW0gcmVwbGFjZW1lbnQgVGhlIGVsZW1lbnQgdG8gYmUgYWRkZWRcbiAqL1xuZnVuY3Rpb24gcmVwbGFjZUVsZW1lbnQoZWxlbSwgcmVwbGFjZW1lbnQpIHtcbiAgICB2YXIgcHJldiA9IChyZXBsYWNlbWVudC5wcmV2ID0gZWxlbS5wcmV2KTtcbiAgICBpZiAocHJldikge1xuICAgICAgICBwcmV2Lm5leHQgPSByZXBsYWNlbWVudDtcbiAgICB9XG4gICAgdmFyIG5leHQgPSAocmVwbGFjZW1lbnQubmV4dCA9IGVsZW0ubmV4dCk7XG4gICAgaWYgKG5leHQpIHtcbiAgICAgICAgbmV4dC5wcmV2ID0gcmVwbGFjZW1lbnQ7XG4gICAgfVxuICAgIHZhciBwYXJlbnQgPSAocmVwbGFjZW1lbnQucGFyZW50ID0gZWxlbS5wYXJlbnQpO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgdmFyIGNoaWxkcyA9IHBhcmVudC5jaGlsZHJlbjtcbiAgICAgICAgY2hpbGRzW2NoaWxkcy5sYXN0SW5kZXhPZihlbGVtKV0gPSByZXBsYWNlbWVudDtcbiAgICB9XG59XG5leHBvcnRzLnJlcGxhY2VFbGVtZW50ID0gcmVwbGFjZUVsZW1lbnQ7XG4vKipcbiAqIEFwcGVuZCBhIGNoaWxkIHRvIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIGVsZW0gVGhlIGVsZW1lbnQgdG8gYXBwZW5kIHRvLlxuICogQHBhcmFtIGNoaWxkIFRoZSBlbGVtZW50IHRvIGJlIGFkZGVkIGFzIGEgY2hpbGQuXG4gKi9cbmZ1bmN0aW9uIGFwcGVuZENoaWxkKGVsZW0sIGNoaWxkKSB7XG4gICAgcmVtb3ZlRWxlbWVudChjaGlsZCk7XG4gICAgY2hpbGQubmV4dCA9IG51bGw7XG4gICAgY2hpbGQucGFyZW50ID0gZWxlbTtcbiAgICBpZiAoZWxlbS5jaGlsZHJlbi5wdXNoKGNoaWxkKSA+IDEpIHtcbiAgICAgICAgdmFyIHNpYmxpbmcgPSBlbGVtLmNoaWxkcmVuW2VsZW0uY2hpbGRyZW4ubGVuZ3RoIC0gMl07XG4gICAgICAgIHNpYmxpbmcubmV4dCA9IGNoaWxkO1xuICAgICAgICBjaGlsZC5wcmV2ID0gc2libGluZztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNoaWxkLnByZXYgPSBudWxsO1xuICAgIH1cbn1cbmV4cG9ydHMuYXBwZW5kQ2hpbGQgPSBhcHBlbmRDaGlsZDtcbi8qKlxuICogQXBwZW5kIGFuIGVsZW1lbnQgYWZ0ZXIgYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0gZWxlbSBUaGUgZWxlbWVudCB0byBhcHBlbmQgYWZ0ZXIuXG4gKiBAcGFyYW0gbmV4dCBUaGUgZWxlbWVudCBiZSBhZGRlZC5cbiAqL1xuZnVuY3Rpb24gYXBwZW5kKGVsZW0sIG5leHQpIHtcbiAgICByZW1vdmVFbGVtZW50KG5leHQpO1xuICAgIHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudDtcbiAgICB2YXIgY3Vyck5leHQgPSBlbGVtLm5leHQ7XG4gICAgbmV4dC5uZXh0ID0gY3Vyck5leHQ7XG4gICAgbmV4dC5wcmV2ID0gZWxlbTtcbiAgICBlbGVtLm5leHQgPSBuZXh0O1xuICAgIG5leHQucGFyZW50ID0gcGFyZW50O1xuICAgIGlmIChjdXJyTmV4dCkge1xuICAgICAgICBjdXJyTmV4dC5wcmV2ID0gbmV4dDtcbiAgICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICAgICAgdmFyIGNoaWxkcyA9IHBhcmVudC5jaGlsZHJlbjtcbiAgICAgICAgICAgIGNoaWxkcy5zcGxpY2UoY2hpbGRzLmxhc3RJbmRleE9mKGN1cnJOZXh0KSwgMCwgbmV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5jaGlsZHJlbi5wdXNoKG5leHQpO1xuICAgIH1cbn1cbmV4cG9ydHMuYXBwZW5kID0gYXBwZW5kO1xuLyoqXG4gKiBQcmVwZW5kIGEgY2hpbGQgdG8gYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gZWxlbSBUaGUgZWxlbWVudCB0byBwcmVwZW5kIGJlZm9yZS5cbiAqIEBwYXJhbSBjaGlsZCBUaGUgZWxlbWVudCB0byBiZSBhZGRlZCBhcyBhIGNoaWxkLlxuICovXG5mdW5jdGlvbiBwcmVwZW5kQ2hpbGQoZWxlbSwgY2hpbGQpIHtcbiAgICByZW1vdmVFbGVtZW50KGNoaWxkKTtcbiAgICBjaGlsZC5wYXJlbnQgPSBlbGVtO1xuICAgIGNoaWxkLnByZXYgPSBudWxsO1xuICAgIGlmIChlbGVtLmNoaWxkcmVuLnVuc2hpZnQoY2hpbGQpICE9PSAxKSB7XG4gICAgICAgIHZhciBzaWJsaW5nID0gZWxlbS5jaGlsZHJlblsxXTtcbiAgICAgICAgc2libGluZy5wcmV2ID0gY2hpbGQ7XG4gICAgICAgIGNoaWxkLm5leHQgPSBzaWJsaW5nO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY2hpbGQubmV4dCA9IG51bGw7XG4gICAgfVxufVxuZXhwb3J0cy5wcmVwZW5kQ2hpbGQgPSBwcmVwZW5kQ2hpbGQ7XG4vKipcbiAqIFByZXBlbmQgYW4gZWxlbWVudCBiZWZvcmUgYW5vdGhlci5cbiAqXG4gKiBAcGFyYW0gZWxlbSBUaGUgZWxlbWVudCB0byBwcmVwZW5kIGJlZm9yZS5cbiAqIEBwYXJhbSBwcmV2IFRoZSBlbGVtZW50IGJlIGFkZGVkLlxuICovXG5mdW5jdGlvbiBwcmVwZW5kKGVsZW0sIHByZXYpIHtcbiAgICByZW1vdmVFbGVtZW50KHByZXYpO1xuICAgIHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudDtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHZhciBjaGlsZHMgPSBwYXJlbnQuY2hpbGRyZW47XG4gICAgICAgIGNoaWxkcy5zcGxpY2UoY2hpbGRzLmluZGV4T2YoZWxlbSksIDAsIHByZXYpO1xuICAgIH1cbiAgICBpZiAoZWxlbS5wcmV2KSB7XG4gICAgICAgIGVsZW0ucHJldi5uZXh0ID0gcHJldjtcbiAgICB9XG4gICAgcHJldi5wYXJlbnQgPSBwYXJlbnQ7XG4gICAgcHJldi5wcmV2ID0gZWxlbS5wcmV2O1xuICAgIHByZXYubmV4dCA9IGVsZW07XG4gICAgZWxlbS5wcmV2ID0gcHJldjtcbn1cbmV4cG9ydHMucHJlcGVuZCA9IHByZXBlbmQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZmluZEFsbCA9IGV4cG9ydHMuZXhpc3RzT25lID0gZXhwb3J0cy5maW5kT25lID0gZXhwb3J0cy5maW5kT25lQ2hpbGQgPSBleHBvcnRzLmZpbmQgPSBleHBvcnRzLmZpbHRlciA9IHZvaWQgMDtcbnZhciBkb21oYW5kbGVyXzEgPSByZXF1aXJlKFwiZG9taGFuZGxlclwiKTtcbi8qKlxuICogU2VhcmNoIGEgbm9kZSBhbmQgaXRzIGNoaWxkcmVuIGZvciBub2RlcyBwYXNzaW5nIGEgdGVzdCBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gdGVzdCBGdW5jdGlvbiB0byB0ZXN0IG5vZGVzIG9uLlxuICogQHBhcmFtIG5vZGUgTm9kZSB0byBzZWFyY2guIFdpbGwgYmUgaW5jbHVkZWQgaW4gdGhlIHJlc3VsdCBzZXQgaWYgaXQgbWF0Y2hlcy5cbiAqIEBwYXJhbSByZWN1cnNlIEFsc28gY29uc2lkZXIgY2hpbGQgbm9kZXMuXG4gKiBAcGFyYW0gbGltaXQgTWF4aW11bSBudW1iZXIgb2Ygbm9kZXMgdG8gcmV0dXJuLlxuICogQHJldHVybnMgQWxsIG5vZGVzIHBhc3NpbmcgYHRlc3RgLlxuICovXG5mdW5jdGlvbiBmaWx0ZXIodGVzdCwgbm9kZSwgcmVjdXJzZSwgbGltaXQpIHtcbiAgICBpZiAocmVjdXJzZSA9PT0gdm9pZCAwKSB7IHJlY3Vyc2UgPSB0cnVlOyB9XG4gICAgaWYgKGxpbWl0ID09PSB2b2lkIDApIHsgbGltaXQgPSBJbmZpbml0eTsgfVxuICAgIGlmICghQXJyYXkuaXNBcnJheShub2RlKSlcbiAgICAgICAgbm9kZSA9IFtub2RlXTtcbiAgICByZXR1cm4gZmluZCh0ZXN0LCBub2RlLCByZWN1cnNlLCBsaW1pdCk7XG59XG5leHBvcnRzLmZpbHRlciA9IGZpbHRlcjtcbi8qKlxuICogU2VhcmNoIGFuIGFycmF5IG9mIG5vZGUgYW5kIGl0cyBjaGlsZHJlbiBmb3Igbm9kZXMgcGFzc2luZyBhIHRlc3QgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHRlc3QgRnVuY3Rpb24gdG8gdGVzdCBub2RlcyBvbi5cbiAqIEBwYXJhbSBub2RlcyBBcnJheSBvZiBub2RlcyB0byBzZWFyY2guXG4gKiBAcGFyYW0gcmVjdXJzZSBBbHNvIGNvbnNpZGVyIGNoaWxkIG5vZGVzLlxuICogQHBhcmFtIGxpbWl0IE1heGltdW0gbnVtYmVyIG9mIG5vZGVzIHRvIHJldHVybi5cbiAqIEByZXR1cm5zIEFsbCBub2RlcyBwYXNzaW5nIGB0ZXN0YC5cbiAqL1xuZnVuY3Rpb24gZmluZCh0ZXN0LCBub2RlcywgcmVjdXJzZSwgbGltaXQpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAwLCBub2Rlc18xID0gbm9kZXM7IF9pIDwgbm9kZXNfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGVsZW0gPSBub2Rlc18xW19pXTtcbiAgICAgICAgaWYgKHRlc3QoZWxlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZW0pO1xuICAgICAgICAgICAgaWYgKC0tbGltaXQgPD0gMClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjdXJzZSAmJiAoMCwgZG9taGFuZGxlcl8xLmhhc0NoaWxkcmVuKShlbGVtKSAmJiBlbGVtLmNoaWxkcmVuLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGZpbmQodGVzdCwgZWxlbS5jaGlsZHJlbiwgcmVjdXJzZSwgbGltaXQpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBjaGlsZHJlbik7XG4gICAgICAgICAgICBsaW1pdCAtPSBjaGlsZHJlbi5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobGltaXQgPD0gMClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5maW5kID0gZmluZDtcbi8qKlxuICogRmluZHMgdGhlIGZpcnN0IGVsZW1lbnQgaW5zaWRlIG9mIGFuIGFycmF5IHRoYXQgbWF0Y2hlcyBhIHRlc3QgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHRlc3QgRnVuY3Rpb24gdG8gdGVzdCBub2RlcyBvbi5cbiAqIEBwYXJhbSBub2RlcyBBcnJheSBvZiBub2RlcyB0byBzZWFyY2guXG4gKiBAcmV0dXJucyBUaGUgZmlyc3Qgbm9kZSBpbiB0aGUgYXJyYXkgdGhhdCBwYXNzZXMgYHRlc3RgLlxuICovXG5mdW5jdGlvbiBmaW5kT25lQ2hpbGQodGVzdCwgbm9kZXMpIHtcbiAgICByZXR1cm4gbm9kZXMuZmluZCh0ZXN0KTtcbn1cbmV4cG9ydHMuZmluZE9uZUNoaWxkID0gZmluZE9uZUNoaWxkO1xuLyoqXG4gKiBGaW5kcyBvbmUgZWxlbWVudCBpbiBhIHRyZWUgdGhhdCBwYXNzZXMgYSB0ZXN0LlxuICpcbiAqIEBwYXJhbSB0ZXN0IEZ1bmN0aW9uIHRvIHRlc3Qgbm9kZXMgb24uXG4gKiBAcGFyYW0gbm9kZXMgQXJyYXkgb2Ygbm9kZXMgdG8gc2VhcmNoLlxuICogQHBhcmFtIHJlY3Vyc2UgQWxzbyBjb25zaWRlciBjaGlsZCBub2Rlcy5cbiAqIEByZXR1cm5zIFRoZSBmaXJzdCBjaGlsZCBub2RlIHRoYXQgcGFzc2VzIGB0ZXN0YC5cbiAqL1xuZnVuY3Rpb24gZmluZE9uZSh0ZXN0LCBub2RlcywgcmVjdXJzZSkge1xuICAgIGlmIChyZWN1cnNlID09PSB2b2lkIDApIHsgcmVjdXJzZSA9IHRydWU7IH1cbiAgICB2YXIgZWxlbSA9IG51bGw7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGggJiYgIWVsZW07IGkrKykge1xuICAgICAgICB2YXIgY2hlY2tlZCA9IG5vZGVzW2ldO1xuICAgICAgICBpZiAoISgwLCBkb21oYW5kbGVyXzEuaXNUYWcpKGNoZWNrZWQpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0ZXN0KGNoZWNrZWQpKSB7XG4gICAgICAgICAgICBlbGVtID0gY2hlY2tlZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChyZWN1cnNlICYmIGNoZWNrZWQuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWxlbSA9IGZpbmRPbmUodGVzdCwgY2hlY2tlZC5jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVsZW07XG59XG5leHBvcnRzLmZpbmRPbmUgPSBmaW5kT25lO1xuLyoqXG4gKiBAcGFyYW0gdGVzdCBGdW5jdGlvbiB0byB0ZXN0IG5vZGVzIG9uLlxuICogQHBhcmFtIG5vZGVzIEFycmF5IG9mIG5vZGVzIHRvIHNlYXJjaC5cbiAqIEByZXR1cm5zIFdoZXRoZXIgYSB0cmVlIG9mIG5vZGVzIGNvbnRhaW5zIGF0IGxlYXN0IG9uZSBub2RlIHBhc3NpbmcgYSB0ZXN0LlxuICovXG5mdW5jdGlvbiBleGlzdHNPbmUodGVzdCwgbm9kZXMpIHtcbiAgICByZXR1cm4gbm9kZXMuc29tZShmdW5jdGlvbiAoY2hlY2tlZCkge1xuICAgICAgICByZXR1cm4gKDAsIGRvbWhhbmRsZXJfMS5pc1RhZykoY2hlY2tlZCkgJiZcbiAgICAgICAgICAgICh0ZXN0KGNoZWNrZWQpIHx8XG4gICAgICAgICAgICAgICAgKGNoZWNrZWQuY2hpbGRyZW4ubGVuZ3RoID4gMCAmJlxuICAgICAgICAgICAgICAgICAgICBleGlzdHNPbmUodGVzdCwgY2hlY2tlZC5jaGlsZHJlbikpKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZXhpc3RzT25lID0gZXhpc3RzT25lO1xuLyoqXG4gKiBTZWFyY2ggYW5kIGFycmF5IG9mIG5vZGVzIGFuZCBpdHMgY2hpbGRyZW4gZm9yIG5vZGVzIHBhc3NpbmcgYSB0ZXN0IGZ1bmN0aW9uLlxuICpcbiAqIFNhbWUgYXMgYGZpbmRgLCBvbmx5IHdpdGggbGVzcyBvcHRpb25zLCBsZWFkaW5nIHRvIHJlZHVjZWQgY29tcGxleGl0eS5cbiAqXG4gKiBAcGFyYW0gdGVzdCBGdW5jdGlvbiB0byB0ZXN0IG5vZGVzIG9uLlxuICogQHBhcmFtIG5vZGVzIEFycmF5IG9mIG5vZGVzIHRvIHNlYXJjaC5cbiAqIEByZXR1cm5zIEFsbCBub2RlcyBwYXNzaW5nIGB0ZXN0YC5cbiAqL1xuZnVuY3Rpb24gZmluZEFsbCh0ZXN0LCBub2Rlcykge1xuICAgIHZhciBfYTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIHN0YWNrID0gbm9kZXMuZmlsdGVyKGRvbWhhbmRsZXJfMS5pc1RhZyk7XG4gICAgdmFyIGVsZW07XG4gICAgd2hpbGUgKChlbGVtID0gc3RhY2suc2hpZnQoKSkpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gKF9hID0gZWxlbS5jaGlsZHJlbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZpbHRlcihkb21oYW5kbGVyXzEuaXNUYWcpO1xuICAgICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc3RhY2sudW5zaGlmdC5hcHBseShzdGFjaywgY2hpbGRyZW4pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0ZXN0KGVsZW0pKVxuICAgICAgICAgICAgcmVzdWx0LnB1c2goZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmZpbmRBbGwgPSBmaW5kQWxsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmlubmVyVGV4dCA9IGV4cG9ydHMudGV4dENvbnRlbnQgPSBleHBvcnRzLmdldFRleHQgPSBleHBvcnRzLmdldElubmVySFRNTCA9IGV4cG9ydHMuZ2V0T3V0ZXJIVE1MID0gdm9pZCAwO1xudmFyIGRvbWhhbmRsZXJfMSA9IHJlcXVpcmUoXCJkb21oYW5kbGVyXCIpO1xudmFyIGRvbV9zZXJpYWxpemVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImRvbS1zZXJpYWxpemVyXCIpKTtcbnZhciBkb21lbGVtZW50dHlwZV8xID0gcmVxdWlyZShcImRvbWVsZW1lbnR0eXBlXCIpO1xuLyoqXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGdldCB0aGUgb3V0ZXIgSFRNTCBvZi5cbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHNlcmlhbGl6YXRpb24uXG4gKiBAZGVwcmVjYXRlZCBVc2UgdGhlIGBkb20tc2VyaWFsaXplcmAgbW9kdWxlIGRpcmVjdGx5LlxuICogQHJldHVybnMgYG5vZGVgJ3Mgb3V0ZXIgSFRNTC5cbiAqL1xuZnVuY3Rpb24gZ2V0T3V0ZXJIVE1MKG5vZGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKDAsIGRvbV9zZXJpYWxpemVyXzEuZGVmYXVsdCkobm9kZSwgb3B0aW9ucyk7XG59XG5leHBvcnRzLmdldE91dGVySFRNTCA9IGdldE91dGVySFRNTDtcbi8qKlxuICogQHBhcmFtIG5vZGUgTm9kZSB0byBnZXQgdGhlIGlubmVyIEhUTUwgb2YuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBzZXJpYWxpemF0aW9uLlxuICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBgZG9tLXNlcmlhbGl6ZXJgIG1vZHVsZSBkaXJlY3RseS5cbiAqIEByZXR1cm5zIGBub2RlYCdzIGlubmVyIEhUTUwuXG4gKi9cbmZ1bmN0aW9uIGdldElubmVySFRNTChub2RlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuICgwLCBkb21oYW5kbGVyXzEuaGFzQ2hpbGRyZW4pKG5vZGUpXG4gICAgICAgID8gbm9kZS5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKG5vZGUpIHsgcmV0dXJuIGdldE91dGVySFRNTChub2RlLCBvcHRpb25zKTsgfSkuam9pbihcIlwiKVxuICAgICAgICA6IFwiXCI7XG59XG5leHBvcnRzLmdldElubmVySFRNTCA9IGdldElubmVySFRNTDtcbi8qKlxuICogR2V0IGEgbm9kZSdzIGlubmVyIHRleHQuIFNhbWUgYXMgYHRleHRDb250ZW50YCwgYnV0IGluc2VydHMgbmV3bGluZXMgZm9yIGA8YnI+YCB0YWdzLlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgdGV4dENvbnRlbnRgIGluc3RlYWQuXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGdldCB0aGUgaW5uZXIgdGV4dCBvZi5cbiAqIEByZXR1cm5zIGBub2RlYCdzIGlubmVyIHRleHQuXG4gKi9cbmZ1bmN0aW9uIGdldFRleHQobm9kZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKVxuICAgICAgICByZXR1cm4gbm9kZS5tYXAoZ2V0VGV4dCkuam9pbihcIlwiKTtcbiAgICBpZiAoKDAsIGRvbWhhbmRsZXJfMS5pc1RhZykobm9kZSkpXG4gICAgICAgIHJldHVybiBub2RlLm5hbWUgPT09IFwiYnJcIiA/IFwiXFxuXCIgOiBnZXRUZXh0KG5vZGUuY2hpbGRyZW4pO1xuICAgIGlmICgoMCwgZG9taGFuZGxlcl8xLmlzQ0RBVEEpKG5vZGUpKVxuICAgICAgICByZXR1cm4gZ2V0VGV4dChub2RlLmNoaWxkcmVuKTtcbiAgICBpZiAoKDAsIGRvbWhhbmRsZXJfMS5pc1RleHQpKG5vZGUpKVxuICAgICAgICByZXR1cm4gbm9kZS5kYXRhO1xuICAgIHJldHVybiBcIlwiO1xufVxuZXhwb3J0cy5nZXRUZXh0ID0gZ2V0VGV4dDtcbi8qKlxuICogR2V0IGEgbm9kZSdzIHRleHQgY29udGVudC5cbiAqXG4gKiBAcGFyYW0gbm9kZSBOb2RlIHRvIGdldCB0aGUgdGV4dCBjb250ZW50IG9mLlxuICogQHJldHVybnMgYG5vZGVgJ3MgdGV4dCBjb250ZW50LlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvdGV4dENvbnRlbnR9XG4gKi9cbmZ1bmN0aW9uIHRleHRDb250ZW50KG5vZGUpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShub2RlKSlcbiAgICAgICAgcmV0dXJuIG5vZGUubWFwKHRleHRDb250ZW50KS5qb2luKFwiXCIpO1xuICAgIGlmICgoMCwgZG9taGFuZGxlcl8xLmhhc0NoaWxkcmVuKShub2RlKSAmJiAhKDAsIGRvbWhhbmRsZXJfMS5pc0NvbW1lbnQpKG5vZGUpKSB7XG4gICAgICAgIHJldHVybiB0ZXh0Q29udGVudChub2RlLmNoaWxkcmVuKTtcbiAgICB9XG4gICAgaWYgKCgwLCBkb21oYW5kbGVyXzEuaXNUZXh0KShub2RlKSlcbiAgICAgICAgcmV0dXJuIG5vZGUuZGF0YTtcbiAgICByZXR1cm4gXCJcIjtcbn1cbmV4cG9ydHMudGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudDtcbi8qKlxuICogR2V0IGEgbm9kZSdzIGlubmVyIHRleHQuXG4gKlxuICogQHBhcmFtIG5vZGUgTm9kZSB0byBnZXQgdGhlIGlubmVyIHRleHQgb2YuXG4gKiBAcmV0dXJucyBgbm9kZWAncyBpbm5lciB0ZXh0LlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGUvaW5uZXJUZXh0fVxuICovXG5mdW5jdGlvbiBpbm5lclRleHQobm9kZSkge1xuICAgIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKVxuICAgICAgICByZXR1cm4gbm9kZS5tYXAoaW5uZXJUZXh0KS5qb2luKFwiXCIpO1xuICAgIGlmICgoMCwgZG9taGFuZGxlcl8xLmhhc0NoaWxkcmVuKShub2RlKSAmJiAobm9kZS50eXBlID09PSBkb21lbGVtZW50dHlwZV8xLkVsZW1lbnRUeXBlLlRhZyB8fCAoMCwgZG9taGFuZGxlcl8xLmlzQ0RBVEEpKG5vZGUpKSkge1xuICAgICAgICByZXR1cm4gaW5uZXJUZXh0KG5vZGUuY2hpbGRyZW4pO1xuICAgIH1cbiAgICBpZiAoKDAsIGRvbWhhbmRsZXJfMS5pc1RleHQpKG5vZGUpKVxuICAgICAgICByZXR1cm4gbm9kZS5kYXRhO1xuICAgIHJldHVybiBcIlwiO1xufVxuZXhwb3J0cy5pbm5lclRleHQgPSBpbm5lclRleHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucHJldkVsZW1lbnRTaWJsaW5nID0gZXhwb3J0cy5uZXh0RWxlbWVudFNpYmxpbmcgPSBleHBvcnRzLmdldE5hbWUgPSBleHBvcnRzLmhhc0F0dHJpYiA9IGV4cG9ydHMuZ2V0QXR0cmlidXRlVmFsdWUgPSBleHBvcnRzLmdldFNpYmxpbmdzID0gZXhwb3J0cy5nZXRQYXJlbnQgPSBleHBvcnRzLmdldENoaWxkcmVuID0gdm9pZCAwO1xudmFyIGRvbWhhbmRsZXJfMSA9IHJlcXVpcmUoXCJkb21oYW5kbGVyXCIpO1xudmFyIGVtcHR5QXJyYXkgPSBbXTtcbi8qKlxuICogR2V0IGEgbm9kZSdzIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSBlbGVtIE5vZGUgdG8gZ2V0IHRoZSBjaGlsZHJlbiBvZi5cbiAqIEByZXR1cm5zIGBlbGVtYCdzIGNoaWxkcmVuLCBvciBhbiBlbXB0eSBhcnJheS5cbiAqL1xuZnVuY3Rpb24gZ2V0Q2hpbGRyZW4oZWxlbSkge1xuICAgIHZhciBfYTtcbiAgICByZXR1cm4gKF9hID0gZWxlbS5jaGlsZHJlbikgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZW1wdHlBcnJheTtcbn1cbmV4cG9ydHMuZ2V0Q2hpbGRyZW4gPSBnZXRDaGlsZHJlbjtcbi8qKlxuICogR2V0IGEgbm9kZSdzIHBhcmVudC5cbiAqXG4gKiBAcGFyYW0gZWxlbSBOb2RlIHRvIGdldCB0aGUgcGFyZW50IG9mLlxuICogQHJldHVybnMgYGVsZW1gJ3MgcGFyZW50IG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdldFBhcmVudChlbGVtKSB7XG4gICAgcmV0dXJuIGVsZW0ucGFyZW50IHx8IG51bGw7XG59XG5leHBvcnRzLmdldFBhcmVudCA9IGdldFBhcmVudDtcbi8qKlxuICogR2V0cyBhbiBlbGVtZW50cyBzaWJsaW5ncywgaW5jbHVkaW5nIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAqXG4gKiBBdHRlbXB0cyB0byBnZXQgdGhlIGNoaWxkcmVuIHRocm91Z2ggdGhlIGVsZW1lbnQncyBwYXJlbnQgZmlyc3QuXG4gKiBJZiB3ZSBkb24ndCBoYXZlIGEgcGFyZW50ICh0aGUgZWxlbWVudCBpcyBhIHJvb3Qgbm9kZSksXG4gKiB3ZSB3YWxrIHRoZSBlbGVtZW50J3MgYHByZXZgICYgYG5leHRgIHRvIGdldCBhbGwgcmVtYWluaW5nIG5vZGVzLlxuICpcbiAqIEBwYXJhbSBlbGVtIEVsZW1lbnQgdG8gZ2V0IHRoZSBzaWJsaW5ncyBvZi5cbiAqIEByZXR1cm5zIGBlbGVtYCdzIHNpYmxpbmdzLlxuICovXG5mdW5jdGlvbiBnZXRTaWJsaW5ncyhlbGVtKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICB2YXIgcGFyZW50ID0gZ2V0UGFyZW50KGVsZW0pO1xuICAgIGlmIChwYXJlbnQgIT0gbnVsbClcbiAgICAgICAgcmV0dXJuIGdldENoaWxkcmVuKHBhcmVudCk7XG4gICAgdmFyIHNpYmxpbmdzID0gW2VsZW1dO1xuICAgIHZhciBwcmV2ID0gZWxlbS5wcmV2LCBuZXh0ID0gZWxlbS5uZXh0O1xuICAgIHdoaWxlIChwcmV2ICE9IG51bGwpIHtcbiAgICAgICAgc2libGluZ3MudW5zaGlmdChwcmV2KTtcbiAgICAgICAgKF9hID0gcHJldiwgcHJldiA9IF9hLnByZXYpO1xuICAgIH1cbiAgICB3aGlsZSAobmV4dCAhPSBudWxsKSB7XG4gICAgICAgIHNpYmxpbmdzLnB1c2gobmV4dCk7XG4gICAgICAgIChfYiA9IG5leHQsIG5leHQgPSBfYi5uZXh0KTtcbiAgICB9XG4gICAgcmV0dXJuIHNpYmxpbmdzO1xufVxuZXhwb3J0cy5nZXRTaWJsaW5ncyA9IGdldFNpYmxpbmdzO1xuLyoqXG4gKiBHZXRzIGFuIGF0dHJpYnV0ZSBmcm9tIGFuIGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIGVsZW0gRWxlbWVudCB0byBjaGVjay5cbiAqIEBwYXJhbSBuYW1lIEF0dHJpYnV0ZSBuYW1lIHRvIHJldHJpZXZlLlxuICogQHJldHVybnMgVGhlIGVsZW1lbnQncyBhdHRyaWJ1dGUgdmFsdWUsIG9yIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXRBdHRyaWJ1dGVWYWx1ZShlbGVtLCBuYW1lKSB7XG4gICAgdmFyIF9hO1xuICAgIHJldHVybiAoX2EgPSBlbGVtLmF0dHJpYnMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYVtuYW1lXTtcbn1cbmV4cG9ydHMuZ2V0QXR0cmlidXRlVmFsdWUgPSBnZXRBdHRyaWJ1dGVWYWx1ZTtcbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgYW4gZWxlbWVudCBoYXMgYW4gYXR0cmlidXRlLlxuICpcbiAqIEBwYXJhbSBlbGVtIEVsZW1lbnQgdG8gY2hlY2suXG4gKiBAcGFyYW0gbmFtZSBBdHRyaWJ1dGUgbmFtZSB0byBsb29rIGZvci5cbiAqIEByZXR1cm5zIFJldHVybnMgd2hldGhlciBgZWxlbWAgaGFzIHRoZSBhdHRyaWJ1dGUgYG5hbWVgLlxuICovXG5mdW5jdGlvbiBoYXNBdHRyaWIoZWxlbSwgbmFtZSkge1xuICAgIHJldHVybiAoZWxlbS5hdHRyaWJzICE9IG51bGwgJiZcbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGVsZW0uYXR0cmlicywgbmFtZSkgJiZcbiAgICAgICAgZWxlbS5hdHRyaWJzW25hbWVdICE9IG51bGwpO1xufVxuZXhwb3J0cy5oYXNBdHRyaWIgPSBoYXNBdHRyaWI7XG4vKipcbiAqIEdldCB0aGUgdGFnIG5hbWUgb2YgYW4gZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0gZWxlbSBUaGUgZWxlbWVudCB0byBnZXQgdGhlIG5hbWUgZm9yLlxuICogQHJldHVybnMgVGhlIHRhZyBuYW1lIG9mIGBlbGVtYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmFtZShlbGVtKSB7XG4gICAgcmV0dXJuIGVsZW0ubmFtZTtcbn1cbmV4cG9ydHMuZ2V0TmFtZSA9IGdldE5hbWU7XG4vKipcbiAqIFJldHVybnMgdGhlIG5leHQgZWxlbWVudCBzaWJsaW5nIG9mIGEgbm9kZS5cbiAqXG4gKiBAcGFyYW0gZWxlbSBUaGUgZWxlbWVudCB0byBnZXQgdGhlIG5leHQgc2libGluZyBvZi5cbiAqIEByZXR1cm5zIGBlbGVtYCdzIG5leHQgc2libGluZyB0aGF0IGlzIGEgdGFnLlxuICovXG5mdW5jdGlvbiBuZXh0RWxlbWVudFNpYmxpbmcoZWxlbSkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgbmV4dCA9IGVsZW0ubmV4dDtcbiAgICB3aGlsZSAobmV4dCAhPT0gbnVsbCAmJiAhKDAsIGRvbWhhbmRsZXJfMS5pc1RhZykobmV4dCkpXG4gICAgICAgIChfYSA9IG5leHQsIG5leHQgPSBfYS5uZXh0KTtcbiAgICByZXR1cm4gbmV4dDtcbn1cbmV4cG9ydHMubmV4dEVsZW1lbnRTaWJsaW5nID0gbmV4dEVsZW1lbnRTaWJsaW5nO1xuLyoqXG4gKiBSZXR1cm5zIHRoZSBwcmV2aW91cyBlbGVtZW50IHNpYmxpbmcgb2YgYSBub2RlLlxuICpcbiAqIEBwYXJhbSBlbGVtIFRoZSBlbGVtZW50IHRvIGdldCB0aGUgcHJldmlvdXMgc2libGluZyBvZi5cbiAqIEByZXR1cm5zIGBlbGVtYCdzIHByZXZpb3VzIHNpYmxpbmcgdGhhdCBpcyBhIHRhZy5cbiAqL1xuZnVuY3Rpb24gcHJldkVsZW1lbnRTaWJsaW5nKGVsZW0pIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHByZXYgPSBlbGVtLnByZXY7XG4gICAgd2hpbGUgKHByZXYgIT09IG51bGwgJiYgISgwLCBkb21oYW5kbGVyXzEuaXNUYWcpKHByZXYpKVxuICAgICAgICAoX2EgPSBwcmV2LCBwcmV2ID0gX2EucHJldik7XG4gICAgcmV0dXJuIHByZXY7XG59XG5leHBvcnRzLnByZXZFbGVtZW50U2libGluZyA9IHByZXZFbGVtZW50U2libGluZztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZWNvZGVIVE1MID0gZXhwb3J0cy5kZWNvZGVIVE1MU3RyaWN0ID0gZXhwb3J0cy5kZWNvZGVYTUwgPSB2b2lkIDA7XG52YXIgZW50aXRpZXNfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL21hcHMvZW50aXRpZXMuanNvblwiKSk7XG52YXIgbGVnYWN5X2pzb25fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9tYXBzL2xlZ2FjeS5qc29uXCIpKTtcbnZhciB4bWxfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL21hcHMveG1sLmpzb25cIikpO1xudmFyIGRlY29kZV9jb2RlcG9pbnRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9kZWNvZGVfY29kZXBvaW50XCIpKTtcbnZhciBzdHJpY3RFbnRpdHlSZSA9IC8mKD86W2EtekEtWjAtOV0rfCNbeFhdW1xcZGEtZkEtRl0rfCNcXGQrKTsvZztcbmV4cG9ydHMuZGVjb2RlWE1MID0gZ2V0U3RyaWN0RGVjb2Rlcih4bWxfanNvbl8xLmRlZmF1bHQpO1xuZXhwb3J0cy5kZWNvZGVIVE1MU3RyaWN0ID0gZ2V0U3RyaWN0RGVjb2RlcihlbnRpdGllc19qc29uXzEuZGVmYXVsdCk7XG5mdW5jdGlvbiBnZXRTdHJpY3REZWNvZGVyKG1hcCkge1xuICAgIHZhciByZXBsYWNlID0gZ2V0UmVwbGFjZXIobWFwKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gU3RyaW5nKHN0cikucmVwbGFjZShzdHJpY3RFbnRpdHlSZSwgcmVwbGFjZSk7IH07XG59XG52YXIgc29ydGVyID0gZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIChhIDwgYiA/IDEgOiAtMSk7IH07XG5leHBvcnRzLmRlY29kZUhUTUwgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsZWdhY3kgPSBPYmplY3Qua2V5cyhsZWdhY3lfanNvbl8xLmRlZmF1bHQpLnNvcnQoc29ydGVyKTtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGVudGl0aWVzX2pzb25fMS5kZWZhdWx0KS5zb3J0KHNvcnRlcik7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAobGVnYWN5W2pdID09PSBrZXlzW2ldKSB7XG4gICAgICAgICAgICBrZXlzW2ldICs9IFwiOz9cIjtcbiAgICAgICAgICAgIGorKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGtleXNbaV0gKz0gXCI7XCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIHJlID0gbmV3IFJlZ0V4cChcIiYoPzpcIiArIGtleXMuam9pbihcInxcIikgKyBcInwjW3hYXVtcXFxcZGEtZkEtRl0rOz98I1xcXFxkKzs/KVwiLCBcImdcIik7XG4gICAgdmFyIHJlcGxhY2UgPSBnZXRSZXBsYWNlcihlbnRpdGllc19qc29uXzEuZGVmYXVsdCk7XG4gICAgZnVuY3Rpb24gcmVwbGFjZXIoc3RyKSB7XG4gICAgICAgIGlmIChzdHIuc3Vic3RyKC0xKSAhPT0gXCI7XCIpXG4gICAgICAgICAgICBzdHIgKz0gXCI7XCI7XG4gICAgICAgIHJldHVybiByZXBsYWNlKHN0cik7XG4gICAgfVxuICAgIC8vIFRPRE8gY29uc2lkZXIgY3JlYXRpbmcgYSBtZXJnZWQgbWFwXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIFN0cmluZyhzdHIpLnJlcGxhY2UocmUsIHJlcGxhY2VyKTsgfTtcbn0pKCk7XG5mdW5jdGlvbiBnZXRSZXBsYWNlcihtYXApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVwbGFjZShzdHIpIHtcbiAgICAgICAgaWYgKHN0ci5jaGFyQXQoMSkgPT09IFwiI1wiKSB7XG4gICAgICAgICAgICB2YXIgc2Vjb25kQ2hhciA9IHN0ci5jaGFyQXQoMik7XG4gICAgICAgICAgICBpZiAoc2Vjb25kQ2hhciA9PT0gXCJYXCIgfHwgc2Vjb25kQ2hhciA9PT0gXCJ4XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjb2RlX2NvZGVwb2ludF8xLmRlZmF1bHQocGFyc2VJbnQoc3RyLnN1YnN0cigzKSwgMTYpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWNvZGVfY29kZXBvaW50XzEuZGVmYXVsdChwYXJzZUludChzdHIuc3Vic3RyKDIpLCAxMCkpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLW51bGxpc2gtY29hbGVzY2luZ1xuICAgICAgICByZXR1cm4gbWFwW3N0ci5zbGljZSgxLCAtMSldIHx8IHN0cjtcbiAgICB9O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgZGVjb2RlX2pzb25fMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9tYXBzL2RlY29kZS5qc29uXCIpKTtcbi8vIEFkYXB0ZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9oZS9ibG9iL21hc3Rlci9zcmMvaGUuanMjTDk0LUwxMTlcbnZhciBmcm9tQ29kZVBvaW50ID0gXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LWNvbmRpdGlvblxuU3RyaW5nLmZyb21Db2RlUG9pbnQgfHxcbiAgICBmdW5jdGlvbiAoY29kZVBvaW50KSB7XG4gICAgICAgIHZhciBvdXRwdXQgPSBcIlwiO1xuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhmZmZmKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgLT0gMHgxMDAwMDtcbiAgICAgICAgICAgIG91dHB1dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoY29kZVBvaW50ID4+PiAxMCkgJiAweDNmZikgfCAweGQ4MDApO1xuICAgICAgICAgICAgY29kZVBvaW50ID0gMHhkYzAwIHwgKGNvZGVQb2ludCAmIDB4M2ZmKTtcbiAgICAgICAgfVxuICAgICAgICBvdXRwdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlUG9pbnQpO1xuICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgIH07XG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnQoY29kZVBvaW50KSB7XG4gICAgaWYgKChjb2RlUG9pbnQgPj0gMHhkODAwICYmIGNvZGVQb2ludCA8PSAweGRmZmYpIHx8IGNvZGVQb2ludCA+IDB4MTBmZmZmKSB7XG4gICAgICAgIHJldHVybiBcIlxcdUZGRkRcIjtcbiAgICB9XG4gICAgaWYgKGNvZGVQb2ludCBpbiBkZWNvZGVfanNvbl8xLmRlZmF1bHQpIHtcbiAgICAgICAgY29kZVBvaW50ID0gZGVjb2RlX2pzb25fMS5kZWZhdWx0W2NvZGVQb2ludF07XG4gICAgfVxuICAgIHJldHVybiBmcm9tQ29kZVBvaW50KGNvZGVQb2ludCk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkZWNvZGVDb2RlUG9pbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZXNjYXBlVVRGOCA9IGV4cG9ydHMuZXNjYXBlID0gZXhwb3J0cy5lbmNvZGVOb25Bc2NpaUhUTUwgPSBleHBvcnRzLmVuY29kZUhUTUwgPSBleHBvcnRzLmVuY29kZVhNTCA9IHZvaWQgMDtcbnZhciB4bWxfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL21hcHMveG1sLmpzb25cIikpO1xudmFyIGludmVyc2VYTUwgPSBnZXRJbnZlcnNlT2JqKHhtbF9qc29uXzEuZGVmYXVsdCk7XG52YXIgeG1sUmVwbGFjZXIgPSBnZXRJbnZlcnNlUmVwbGFjZXIoaW52ZXJzZVhNTCk7XG4vKipcbiAqIEVuY29kZXMgYWxsIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLCBhcyB3ZWxsIGFzIGNoYXJhY3RlcnMgbm90IHZhbGlkIGluIFhNTFxuICogZG9jdW1lbnRzIHVzaW5nIFhNTCBlbnRpdGllcy5cbiAqXG4gKiBJZiBhIGNoYXJhY3RlciBoYXMgbm8gZXF1aXZhbGVudCBlbnRpdHksIGFcbiAqIG51bWVyaWMgaGV4YWRlY2ltYWwgcmVmZXJlbmNlIChlZy4gYCYjeGZjO2ApIHdpbGwgYmUgdXNlZC5cbiAqL1xuZXhwb3J0cy5lbmNvZGVYTUwgPSBnZXRBU0NJSUVuY29kZXIoaW52ZXJzZVhNTCk7XG52YXIgZW50aXRpZXNfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL21hcHMvZW50aXRpZXMuanNvblwiKSk7XG52YXIgaW52ZXJzZUhUTUwgPSBnZXRJbnZlcnNlT2JqKGVudGl0aWVzX2pzb25fMS5kZWZhdWx0KTtcbnZhciBodG1sUmVwbGFjZXIgPSBnZXRJbnZlcnNlUmVwbGFjZXIoaW52ZXJzZUhUTUwpO1xuLyoqXG4gKiBFbmNvZGVzIGFsbCBlbnRpdGllcyBhbmQgbm9uLUFTQ0lJIGNoYXJhY3RlcnMgaW4gdGhlIGlucHV0LlxuICpcbiAqIFRoaXMgaW5jbHVkZXMgY2hhcmFjdGVycyB0aGF0IGFyZSB2YWxpZCBBU0NJSSBjaGFyYWN0ZXJzIGluIEhUTUwgZG9jdW1lbnRzLlxuICogRm9yIGV4YW1wbGUgYCNgIHdpbGwgYmUgZW5jb2RlZCBhcyBgJm51bTtgLiBUbyBnZXQgYSBtb3JlIGNvbXBhY3Qgb3V0cHV0LFxuICogY29uc2lkZXIgdXNpbmcgdGhlIGBlbmNvZGVOb25Bc2NpaUhUTUxgIGZ1bmN0aW9uLlxuICpcbiAqIElmIGEgY2hhcmFjdGVyIGhhcyBubyBlcXVpdmFsZW50IGVudGl0eSwgYVxuICogbnVtZXJpYyBoZXhhZGVjaW1hbCByZWZlcmVuY2UgKGVnLiBgJiN4ZmM7YCkgd2lsbCBiZSB1c2VkLlxuICovXG5leHBvcnRzLmVuY29kZUhUTUwgPSBnZXRJbnZlcnNlKGludmVyc2VIVE1MLCBodG1sUmVwbGFjZXIpO1xuLyoqXG4gKiBFbmNvZGVzIGFsbCBub24tQVNDSUkgY2hhcmFjdGVycywgYXMgd2VsbCBhcyBjaGFyYWN0ZXJzIG5vdCB2YWxpZCBpbiBIVE1MXG4gKiBkb2N1bWVudHMgdXNpbmcgSFRNTCBlbnRpdGllcy5cbiAqXG4gKiBJZiBhIGNoYXJhY3RlciBoYXMgbm8gZXF1aXZhbGVudCBlbnRpdHksIGFcbiAqIG51bWVyaWMgaGV4YWRlY2ltYWwgcmVmZXJlbmNlIChlZy4gYCYjeGZjO2ApIHdpbGwgYmUgdXNlZC5cbiAqL1xuZXhwb3J0cy5lbmNvZGVOb25Bc2NpaUhUTUwgPSBnZXRBU0NJSUVuY29kZXIoaW52ZXJzZUhUTUwpO1xuZnVuY3Rpb24gZ2V0SW52ZXJzZU9iaihvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKVxuICAgICAgICAuc29ydCgpXG4gICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKGludmVyc2UsIG5hbWUpIHtcbiAgICAgICAgaW52ZXJzZVtvYmpbbmFtZV1dID0gXCImXCIgKyBuYW1lICsgXCI7XCI7XG4gICAgICAgIHJldHVybiBpbnZlcnNlO1xuICAgIH0sIHt9KTtcbn1cbmZ1bmN0aW9uIGdldEludmVyc2VSZXBsYWNlcihpbnZlcnNlKSB7XG4gICAgdmFyIHNpbmdsZSA9IFtdO1xuICAgIHZhciBtdWx0aXBsZSA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSBPYmplY3Qua2V5cyhpbnZlcnNlKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGsgPSBfYVtfaV07XG4gICAgICAgIGlmIChrLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gQWRkIHZhbHVlIHRvIHNpbmdsZSBhcnJheVxuICAgICAgICAgICAgc2luZ2xlLnB1c2goXCJcXFxcXCIgKyBrKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEFkZCB2YWx1ZSB0byBtdWx0aXBsZSBhcnJheVxuICAgICAgICAgICAgbXVsdGlwbGUucHVzaChrKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGQgcmFuZ2VzIHRvIHNpbmdsZSBjaGFyYWN0ZXJzLlxuICAgIHNpbmdsZS5zb3J0KCk7XG4gICAgZm9yICh2YXIgc3RhcnQgPSAwOyBzdGFydCA8IHNpbmdsZS5sZW5ndGggLSAxOyBzdGFydCsrKSB7XG4gICAgICAgIC8vIEZpbmQgdGhlIGVuZCBvZiBhIHJ1biBvZiBjaGFyYWN0ZXJzXG4gICAgICAgIHZhciBlbmQgPSBzdGFydDtcbiAgICAgICAgd2hpbGUgKGVuZCA8IHNpbmdsZS5sZW5ndGggLSAxICYmXG4gICAgICAgICAgICBzaW5nbGVbZW5kXS5jaGFyQ29kZUF0KDEpICsgMSA9PT0gc2luZ2xlW2VuZCArIDFdLmNoYXJDb2RlQXQoMSkpIHtcbiAgICAgICAgICAgIGVuZCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb3VudCA9IDEgKyBlbmQgLSBzdGFydDtcbiAgICAgICAgLy8gV2Ugd2FudCB0byByZXBsYWNlIGF0IGxlYXN0IHRocmVlIGNoYXJhY3RlcnNcbiAgICAgICAgaWYgKGNvdW50IDwgMylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBzaW5nbGUuc3BsaWNlKHN0YXJ0LCBjb3VudCwgc2luZ2xlW3N0YXJ0XSArIFwiLVwiICsgc2luZ2xlW2VuZF0pO1xuICAgIH1cbiAgICBtdWx0aXBsZS51bnNoaWZ0KFwiW1wiICsgc2luZ2xlLmpvaW4oXCJcIikgKyBcIl1cIik7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAobXVsdGlwbGUuam9pbihcInxcIiksIFwiZ1wiKTtcbn1cbi8vIC9bXlxcMC1cXHg3Rl0vZ3VcbnZhciByZU5vbkFTQ0lJID0gLyg/OltcXHg4MC1cXHVEN0ZGXFx1RTAwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdKS9nO1xudmFyIGdldENvZGVQb2ludCA9IFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS1jb25kaXRpb25cblN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQgIT0gbnVsbFxuICAgID8gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gc3RyLmNvZGVQb2ludEF0KDApOyB9XG4gICAgOiAvLyBodHRwOi8vbWF0aGlhc2J5bmVucy5iZS9ub3Rlcy9qYXZhc2NyaXB0LWVuY29kaW5nI3N1cnJvZ2F0ZS1mb3JtdWxhZVxuICAgICAgICBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgcmV0dXJuIChjLmNoYXJDb2RlQXQoMCkgLSAweGQ4MDApICogMHg0MDAgK1xuICAgICAgICAgICAgICAgIGMuY2hhckNvZGVBdCgxKSAtXG4gICAgICAgICAgICAgICAgMHhkYzAwICtcbiAgICAgICAgICAgICAgICAweDEwMDAwO1xuICAgICAgICB9O1xuZnVuY3Rpb24gc2luZ2xlQ2hhclJlcGxhY2VyKGMpIHtcbiAgICByZXR1cm4gXCImI3hcIiArIChjLmxlbmd0aCA+IDEgPyBnZXRDb2RlUG9pbnQoYykgOiBjLmNoYXJDb2RlQXQoMCkpXG4gICAgICAgIC50b1N0cmluZygxNilcbiAgICAgICAgLnRvVXBwZXJDYXNlKCkgKyBcIjtcIjtcbn1cbmZ1bmN0aW9uIGdldEludmVyc2UoaW52ZXJzZSwgcmUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGRhdGFcbiAgICAgICAgICAgIC5yZXBsYWNlKHJlLCBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gaW52ZXJzZVtuYW1lXTsgfSlcbiAgICAgICAgICAgIC5yZXBsYWNlKHJlTm9uQVNDSUksIHNpbmdsZUNoYXJSZXBsYWNlcik7XG4gICAgfTtcbn1cbnZhciByZUVzY2FwZUNoYXJzID0gbmV3IFJlZ0V4cCh4bWxSZXBsYWNlci5zb3VyY2UgKyBcInxcIiArIHJlTm9uQVNDSUkuc291cmNlLCBcImdcIik7XG4vKipcbiAqIEVuY29kZXMgYWxsIG5vbi1BU0NJSSBjaGFyYWN0ZXJzLCBhcyB3ZWxsIGFzIGNoYXJhY3RlcnMgbm90IHZhbGlkIGluIFhNTFxuICogZG9jdW1lbnRzIHVzaW5nIG51bWVyaWMgaGV4YWRlY2ltYWwgcmVmZXJlbmNlIChlZy4gYCYjeGZjO2ApLlxuICpcbiAqIEhhdmUgYSBsb29rIGF0IGBlc2NhcGVVVEY4YCBpZiB5b3Ugd2FudCBhIG1vcmUgY29uY2lzZSBvdXRwdXQgYXQgdGhlIGV4cGVuc2VcbiAqIG9mIHJlZHVjZWQgdHJhbnNwb3J0YWJpbGl0eS5cbiAqXG4gKiBAcGFyYW0gZGF0YSBTdHJpbmcgdG8gZXNjYXBlLlxuICovXG5mdW5jdGlvbiBlc2NhcGUoZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnJlcGxhY2UocmVFc2NhcGVDaGFycywgc2luZ2xlQ2hhclJlcGxhY2VyKTtcbn1cbmV4cG9ydHMuZXNjYXBlID0gZXNjYXBlO1xuLyoqXG4gKiBFbmNvZGVzIGFsbCBjaGFyYWN0ZXJzIG5vdCB2YWxpZCBpbiBYTUwgZG9jdW1lbnRzIHVzaW5nIG51bWVyaWMgaGV4YWRlY2ltYWxcbiAqIHJlZmVyZW5jZSAoZWcuIGAmI3hmYztgKS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIG91dHB1dCB3aWxsIGJlIGNoYXJhY3Rlci1zZXQgZGVwZW5kZW50LlxuICpcbiAqIEBwYXJhbSBkYXRhIFN0cmluZyB0byBlc2NhcGUuXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVVURjgoZGF0YSkge1xuICAgIHJldHVybiBkYXRhLnJlcGxhY2UoeG1sUmVwbGFjZXIsIHNpbmdsZUNoYXJSZXBsYWNlcik7XG59XG5leHBvcnRzLmVzY2FwZVVURjggPSBlc2NhcGVVVEY4O1xuZnVuY3Rpb24gZ2V0QVNDSUlFbmNvZGVyKG9iaikge1xuICAgIHJldHVybiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4gZGF0YS5yZXBsYWNlKHJlRXNjYXBlQ2hhcnMsIGZ1bmN0aW9uIChjKSB7IHJldHVybiBvYmpbY10gfHwgc2luZ2xlQ2hhclJlcGxhY2VyKGMpOyB9KTtcbiAgICB9O1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlY29kZVhNTFN0cmljdCA9IGV4cG9ydHMuZGVjb2RlSFRNTDVTdHJpY3QgPSBleHBvcnRzLmRlY29kZUhUTUw0U3RyaWN0ID0gZXhwb3J0cy5kZWNvZGVIVE1MNSA9IGV4cG9ydHMuZGVjb2RlSFRNTDQgPSBleHBvcnRzLmRlY29kZUhUTUxTdHJpY3QgPSBleHBvcnRzLmRlY29kZUhUTUwgPSBleHBvcnRzLmRlY29kZVhNTCA9IGV4cG9ydHMuZW5jb2RlSFRNTDUgPSBleHBvcnRzLmVuY29kZUhUTUw0ID0gZXhwb3J0cy5lc2NhcGVVVEY4ID0gZXhwb3J0cy5lc2NhcGUgPSBleHBvcnRzLmVuY29kZU5vbkFzY2lpSFRNTCA9IGV4cG9ydHMuZW5jb2RlSFRNTCA9IGV4cG9ydHMuZW5jb2RlWE1MID0gZXhwb3J0cy5lbmNvZGUgPSBleHBvcnRzLmRlY29kZVN0cmljdCA9IGV4cG9ydHMuZGVjb2RlID0gdm9pZCAwO1xudmFyIGRlY29kZV8xID0gcmVxdWlyZShcIi4vZGVjb2RlXCIpO1xudmFyIGVuY29kZV8xID0gcmVxdWlyZShcIi4vZW5jb2RlXCIpO1xuLyoqXG4gKiBEZWNvZGVzIGEgc3RyaW5nIHdpdGggZW50aXRpZXMuXG4gKlxuICogQHBhcmFtIGRhdGEgU3RyaW5nIHRvIGRlY29kZS5cbiAqIEBwYXJhbSBsZXZlbCBPcHRpb25hbCBsZXZlbCB0byBkZWNvZGUgYXQuIDAgPSBYTUwsIDEgPSBIVE1MLiBEZWZhdWx0IGlzIDAuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYGRlY29kZVhNTGAgb3IgYGRlY29kZUhUTUxgIGRpcmVjdGx5LlxuICovXG5mdW5jdGlvbiBkZWNvZGUoZGF0YSwgbGV2ZWwpIHtcbiAgICByZXR1cm4gKCFsZXZlbCB8fCBsZXZlbCA8PSAwID8gZGVjb2RlXzEuZGVjb2RlWE1MIDogZGVjb2RlXzEuZGVjb2RlSFRNTCkoZGF0YSk7XG59XG5leHBvcnRzLmRlY29kZSA9IGRlY29kZTtcbi8qKlxuICogRGVjb2RlcyBhIHN0cmluZyB3aXRoIGVudGl0aWVzLiBEb2VzIG5vdCBhbGxvdyBtaXNzaW5nIHRyYWlsaW5nIHNlbWljb2xvbnMgZm9yIGVudGl0aWVzLlxuICpcbiAqIEBwYXJhbSBkYXRhIFN0cmluZyB0byBkZWNvZGUuXG4gKiBAcGFyYW0gbGV2ZWwgT3B0aW9uYWwgbGV2ZWwgdG8gZGVjb2RlIGF0LiAwID0gWE1MLCAxID0gSFRNTC4gRGVmYXVsdCBpcyAwLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBkZWNvZGVIVE1MU3RyaWN0YCBvciBgZGVjb2RlWE1MYCBkaXJlY3RseS5cbiAqL1xuZnVuY3Rpb24gZGVjb2RlU3RyaWN0KGRhdGEsIGxldmVsKSB7XG4gICAgcmV0dXJuICghbGV2ZWwgfHwgbGV2ZWwgPD0gMCA/IGRlY29kZV8xLmRlY29kZVhNTCA6IGRlY29kZV8xLmRlY29kZUhUTUxTdHJpY3QpKGRhdGEpO1xufVxuZXhwb3J0cy5kZWNvZGVTdHJpY3QgPSBkZWNvZGVTdHJpY3Q7XG4vKipcbiAqIEVuY29kZXMgYSBzdHJpbmcgd2l0aCBlbnRpdGllcy5cbiAqXG4gKiBAcGFyYW0gZGF0YSBTdHJpbmcgdG8gZW5jb2RlLlxuICogQHBhcmFtIGxldmVsIE9wdGlvbmFsIGxldmVsIHRvIGVuY29kZSBhdC4gMCA9IFhNTCwgMSA9IEhUTUwuIERlZmF1bHQgaXMgMC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgZW5jb2RlSFRNTGAsIGBlbmNvZGVYTUxgIG9yIGBlbmNvZGVOb25Bc2NpaUhUTUxgIGRpcmVjdGx5LlxuICovXG5mdW5jdGlvbiBlbmNvZGUoZGF0YSwgbGV2ZWwpIHtcbiAgICByZXR1cm4gKCFsZXZlbCB8fCBsZXZlbCA8PSAwID8gZW5jb2RlXzEuZW5jb2RlWE1MIDogZW5jb2RlXzEuZW5jb2RlSFRNTCkoZGF0YSk7XG59XG5leHBvcnRzLmVuY29kZSA9IGVuY29kZTtcbnZhciBlbmNvZGVfMiA9IHJlcXVpcmUoXCIuL2VuY29kZVwiKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImVuY29kZVhNTFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZW5jb2RlXzIuZW5jb2RlWE1MOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZW5jb2RlSFRNTFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZW5jb2RlXzIuZW5jb2RlSFRNTDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImVuY29kZU5vbkFzY2lpSFRNTFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZW5jb2RlXzIuZW5jb2RlTm9uQXNjaWlIVE1MOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZXNjYXBlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBlbmNvZGVfMi5lc2NhcGU7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJlc2NhcGVVVEY4XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBlbmNvZGVfMi5lc2NhcGVVVEY4OyB9IH0pO1xuLy8gTGVnYWN5IGFsaWFzZXMgKGRlcHJlY2F0ZWQpXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJlbmNvZGVIVE1MNFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZW5jb2RlXzIuZW5jb2RlSFRNTDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImVuY29kZUhUTUw1XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBlbmNvZGVfMi5lbmNvZGVIVE1MOyB9IH0pO1xudmFyIGRlY29kZV8yID0gcmVxdWlyZShcIi4vZGVjb2RlXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVjb2RlWE1MXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkZWNvZGVfMi5kZWNvZGVYTUw7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkZWNvZGVIVE1MXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkZWNvZGVfMi5kZWNvZGVIVE1MOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVjb2RlSFRNTFN0cmljdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZGVjb2RlXzIuZGVjb2RlSFRNTFN0cmljdDsgfSB9KTtcbi8vIExlZ2FjeSBhbGlhc2VzIChkZXByZWNhdGVkKVxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVjb2RlSFRNTDRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRlY29kZV8yLmRlY29kZUhUTUw7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkZWNvZGVIVE1MNVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gZGVjb2RlXzIuZGVjb2RlSFRNTDsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRlY29kZUhUTUw0U3RyaWN0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkZWNvZGVfMi5kZWNvZGVIVE1MU3RyaWN0OyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGVjb2RlSFRNTDVTdHJpY3RcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRlY29kZV8yLmRlY29kZUhUTUxTdHJpY3Q7IH0gfSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkZWNvZGVYTUxTdHJpY3RcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRlY29kZV8yLmRlY29kZVhNTDsgfSB9KTtcbiIsIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhRE9DVFlQRSBodG1sPlxcclxcbjxodG1sIGxhbmc9XFxcImVuXFxcIj5cXHJcXG4gIDxoZWFkPlxcclxcbiAgICA8bWV0YSBjaGFyc2V0PVxcXCJVVEYtOFxcXCIgLz5cXHJcXG4gICAgPG1ldGEgaHR0cC1lcXVpdj1cXFwiWC1VQS1Db21wYXRpYmxlXFxcIiBjb250ZW50PVxcXCJJRT1lZGdlXFxcIiAvPlxcclxcbiAgICA8bWV0YSBuYW1lPVxcXCJ2aWV3cG9ydFxcXCIgY29udGVudD1cXFwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFxcXCIgLz5cXHJcXG4gICAgPHRpdGxlPkJhdHRsZXNoaXA8L3RpdGxlPlxcclxcbiAgPC9oZWFkPlxcclxcbiAgPGJvZHk+XFxyXFxuICAgIDxoZWFkZXI+XFxyXFxuICAgIDwvaGVhZGVyPlxcclxcbiAgICA8bWFpbj5cXHJcXG4gICAgICA8ZGl2IGNsYXNzPVxcXCJib2FyZC1jb250YWluZXJcXFwiPlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwiYm9hcmRcXFwiIGlkPVxcXCJwbGF5ZXIxXFxcIj5cXHJcXG4gICAgICAgICAgPGgyPllvdXIgYm9hcmQ8L2gyPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuXFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJib2FyZFxcXCIgaWQ9XFxcInBsYXllcjJcXFwiPlxcclxcbiAgICAgICAgICA8aDI+RW5lbXkncyBib2FyZDwvaDI+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICA8L2Rpdj5cXHJcXG4gICAgPC9tYWluPlxcclxcbiAgPC9ib2R5PlxcclxcbjwvaHRtbD5cXHJcXG5cIjtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IGNvZGU7IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlRmVlZCA9IGV4cG9ydHMuRmVlZEhhbmRsZXIgPSB2b2lkIDA7XG52YXIgZG9taGFuZGxlcl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJkb21oYW5kbGVyXCIpKTtcbnZhciBEb21VdGlscyA9IF9faW1wb3J0U3RhcihyZXF1aXJlKFwiZG9tdXRpbHNcIikpO1xudmFyIFBhcnNlcl8xID0gcmVxdWlyZShcIi4vUGFyc2VyXCIpO1xudmFyIEZlZWRJdGVtTWVkaWFNZWRpdW07XG4oZnVuY3Rpb24gKEZlZWRJdGVtTWVkaWFNZWRpdW0pIHtcbiAgICBGZWVkSXRlbU1lZGlhTWVkaXVtW0ZlZWRJdGVtTWVkaWFNZWRpdW1bXCJpbWFnZVwiXSA9IDBdID0gXCJpbWFnZVwiO1xuICAgIEZlZWRJdGVtTWVkaWFNZWRpdW1bRmVlZEl0ZW1NZWRpYU1lZGl1bVtcImF1ZGlvXCJdID0gMV0gPSBcImF1ZGlvXCI7XG4gICAgRmVlZEl0ZW1NZWRpYU1lZGl1bVtGZWVkSXRlbU1lZGlhTWVkaXVtW1widmlkZW9cIl0gPSAyXSA9IFwidmlkZW9cIjtcbiAgICBGZWVkSXRlbU1lZGlhTWVkaXVtW0ZlZWRJdGVtTWVkaWFNZWRpdW1bXCJkb2N1bWVudFwiXSA9IDNdID0gXCJkb2N1bWVudFwiO1xuICAgIEZlZWRJdGVtTWVkaWFNZWRpdW1bRmVlZEl0ZW1NZWRpYU1lZGl1bVtcImV4ZWN1dGFibGVcIl0gPSA0XSA9IFwiZXhlY3V0YWJsZVwiO1xufSkoRmVlZEl0ZW1NZWRpYU1lZGl1bSB8fCAoRmVlZEl0ZW1NZWRpYU1lZGl1bSA9IHt9KSk7XG52YXIgRmVlZEl0ZW1NZWRpYUV4cHJlc3Npb247XG4oZnVuY3Rpb24gKEZlZWRJdGVtTWVkaWFFeHByZXNzaW9uKSB7XG4gICAgRmVlZEl0ZW1NZWRpYUV4cHJlc3Npb25bRmVlZEl0ZW1NZWRpYUV4cHJlc3Npb25bXCJzYW1wbGVcIl0gPSAwXSA9IFwic2FtcGxlXCI7XG4gICAgRmVlZEl0ZW1NZWRpYUV4cHJlc3Npb25bRmVlZEl0ZW1NZWRpYUV4cHJlc3Npb25bXCJmdWxsXCJdID0gMV0gPSBcImZ1bGxcIjtcbiAgICBGZWVkSXRlbU1lZGlhRXhwcmVzc2lvbltGZWVkSXRlbU1lZGlhRXhwcmVzc2lvbltcIm5vbnN0b3BcIl0gPSAyXSA9IFwibm9uc3RvcFwiO1xufSkoRmVlZEl0ZW1NZWRpYUV4cHJlc3Npb24gfHwgKEZlZWRJdGVtTWVkaWFFeHByZXNzaW9uID0ge30pKTtcbi8vIFRPRE86IENvbnN1bWUgZGF0YSBhcyBpdCBpcyBjb21pbmcgaW5cbnZhciBGZWVkSGFuZGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRmVlZEhhbmRsZXIsIF9zdXBlcik7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIEZlZWRIYW5kbGVyKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgb3B0aW9ucyA9IGNhbGxiYWNrO1xuICAgICAgICB9XG4gICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY2FsbGJhY2ssIG9wdGlvbnMpIHx8IHRoaXM7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgRmVlZEhhbmRsZXIucHJvdG90eXBlLm9uZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB2YXIgZmVlZFJvb3QgPSBnZXRPbmVFbGVtZW50KGlzVmFsaWRGZWVkLCB0aGlzLmRvbSk7XG4gICAgICAgIGlmICghZmVlZFJvb3QpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FsbGJhY2sobmV3IEVycm9yKFwiY291bGRuJ3QgZmluZCByb290IG9mIGZlZWRcIikpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmZWVkID0ge307XG4gICAgICAgIGlmIChmZWVkUm9vdC5uYW1lID09PSBcImZlZWRcIikge1xuICAgICAgICAgICAgdmFyIGNoaWxkcyA9IGZlZWRSb290LmNoaWxkcmVuO1xuICAgICAgICAgICAgZmVlZC50eXBlID0gXCJhdG9tXCI7XG4gICAgICAgICAgICBhZGRDb25kaXRpb25hbGx5KGZlZWQsIFwiaWRcIiwgXCJpZFwiLCBjaGlsZHMpO1xuICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShmZWVkLCBcInRpdGxlXCIsIFwidGl0bGVcIiwgY2hpbGRzKTtcbiAgICAgICAgICAgIHZhciBocmVmID0gZ2V0QXR0cmlidXRlKFwiaHJlZlwiLCBnZXRPbmVFbGVtZW50KFwibGlua1wiLCBjaGlsZHMpKTtcbiAgICAgICAgICAgIGlmIChocmVmKSB7XG4gICAgICAgICAgICAgICAgZmVlZC5saW5rID0gaHJlZjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENvbmRpdGlvbmFsbHkoZmVlZCwgXCJkZXNjcmlwdGlvblwiLCBcInN1YnRpdGxlXCIsIGNoaWxkcyk7XG4gICAgICAgICAgICB2YXIgdXBkYXRlZCA9IGZldGNoKFwidXBkYXRlZFwiLCBjaGlsZHMpO1xuICAgICAgICAgICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBmZWVkLnVwZGF0ZWQgPSBuZXcgRGF0ZSh1cGRhdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFkZENvbmRpdGlvbmFsbHkoZmVlZCwgXCJhdXRob3JcIiwgXCJlbWFpbFwiLCBjaGlsZHMsIHRydWUpO1xuICAgICAgICAgICAgZmVlZC5pdGVtcyA9IGdldEVsZW1lbnRzKFwiZW50cnlcIiwgY2hpbGRzKS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgZW50cnkgPSB7fTtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBpdGVtLmNoaWxkcmVuO1xuICAgICAgICAgICAgICAgIGFkZENvbmRpdGlvbmFsbHkoZW50cnksIFwiaWRcIiwgXCJpZFwiLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJ0aXRsZVwiLCBcInRpdGxlXCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IGdldEF0dHJpYnV0ZShcImhyZWZcIiwgZ2V0T25lRWxlbWVudChcImxpbmtcIiwgY2hpbGRyZW4pKTtcbiAgICAgICAgICAgICAgICBpZiAoaHJlZikge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS5saW5rID0gaHJlZjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZmV0Y2goXCJzdW1tYXJ5XCIsIGNoaWxkcmVuKSB8fCBmZXRjaChcImNvbnRlbnRcIiwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBlbnRyeS5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgcHViRGF0ZSA9IGZldGNoKFwidXBkYXRlZFwiLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgaWYgKHB1YkRhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cnkucHViRGF0ZSA9IG5ldyBEYXRlKHB1YkRhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbnRyeS5tZWRpYSA9IGdldE1lZGlhRWxlbWVudHMoY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNoaWxkcyA9IChfYiA9IChfYSA9IGdldE9uZUVsZW1lbnQoXCJjaGFubmVsXCIsIGZlZWRSb290LmNoaWxkcmVuKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNoaWxkcmVuKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcbiAgICAgICAgICAgIGZlZWQudHlwZSA9IGZlZWRSb290Lm5hbWUuc3Vic3RyKDAsIDMpO1xuICAgICAgICAgICAgZmVlZC5pZCA9IFwiXCI7XG4gICAgICAgICAgICBhZGRDb25kaXRpb25hbGx5KGZlZWQsIFwidGl0bGVcIiwgXCJ0aXRsZVwiLCBjaGlsZHMpO1xuICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShmZWVkLCBcImxpbmtcIiwgXCJsaW5rXCIsIGNoaWxkcyk7XG4gICAgICAgICAgICBhZGRDb25kaXRpb25hbGx5KGZlZWQsIFwiZGVzY3JpcHRpb25cIiwgXCJkZXNjcmlwdGlvblwiLCBjaGlsZHMpO1xuICAgICAgICAgICAgdmFyIHVwZGF0ZWQgPSBmZXRjaChcImxhc3RCdWlsZERhdGVcIiwgY2hpbGRzKTtcbiAgICAgICAgICAgIGlmICh1cGRhdGVkKSB7XG4gICAgICAgICAgICAgICAgZmVlZC51cGRhdGVkID0gbmV3IERhdGUodXBkYXRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhZGRDb25kaXRpb25hbGx5KGZlZWQsIFwiYXV0aG9yXCIsIFwibWFuYWdpbmdFZGl0b3JcIiwgY2hpbGRzLCB0cnVlKTtcbiAgICAgICAgICAgIGZlZWQuaXRlbXMgPSBnZXRFbGVtZW50cyhcIml0ZW1cIiwgZmVlZFJvb3QuY2hpbGRyZW4pLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGl0ZW0uY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJpZFwiLCBcImd1aWRcIiwgY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIGFkZENvbmRpdGlvbmFsbHkoZW50cnksIFwidGl0bGVcIiwgXCJ0aXRsZVwiLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJsaW5rXCIsIFwibGlua1wiLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgYWRkQ29uZGl0aW9uYWxseShlbnRyeSwgXCJkZXNjcmlwdGlvblwiLCBcImRlc2NyaXB0aW9uXCIsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICB2YXIgcHViRGF0ZSA9IGZldGNoKFwicHViRGF0ZVwiLCBjaGlsZHJlbik7XG4gICAgICAgICAgICAgICAgaWYgKHB1YkRhdGUpXG4gICAgICAgICAgICAgICAgICAgIGVudHJ5LnB1YkRhdGUgPSBuZXcgRGF0ZShwdWJEYXRlKTtcbiAgICAgICAgICAgICAgICBlbnRyeS5tZWRpYSA9IGdldE1lZGlhRWxlbWVudHMoY2hpbGRyZW4pO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZCA9IGZlZWQ7XG4gICAgICAgIHRoaXMuaGFuZGxlQ2FsbGJhY2sobnVsbCk7XG4gICAgfTtcbiAgICByZXR1cm4gRmVlZEhhbmRsZXI7XG59KGRvbWhhbmRsZXJfMS5kZWZhdWx0KSk7XG5leHBvcnRzLkZlZWRIYW5kbGVyID0gRmVlZEhhbmRsZXI7XG5mdW5jdGlvbiBnZXRNZWRpYUVsZW1lbnRzKHdoZXJlKSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzKFwibWVkaWE6Y29udGVudFwiLCB3aGVyZSkubWFwKGZ1bmN0aW9uIChlbGVtKSB7XG4gICAgICAgIHZhciBtZWRpYSA9IHtcbiAgICAgICAgICAgIG1lZGl1bTogZWxlbS5hdHRyaWJzLm1lZGl1bSxcbiAgICAgICAgICAgIGlzRGVmYXVsdDogISFlbGVtLmF0dHJpYnMuaXNEZWZhdWx0LFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZWxlbS5hdHRyaWJzLnVybCkge1xuICAgICAgICAgICAgbWVkaWEudXJsID0gZWxlbS5hdHRyaWJzLnVybDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbS5hdHRyaWJzLmZpbGVTaXplKSB7XG4gICAgICAgICAgICBtZWRpYS5maWxlU2l6ZSA9IHBhcnNlSW50KGVsZW0uYXR0cmlicy5maWxlU2l6ZSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dHJpYnMudHlwZSkge1xuICAgICAgICAgICAgbWVkaWEudHlwZSA9IGVsZW0uYXR0cmlicy50eXBlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dHJpYnMuZXhwcmVzc2lvbikge1xuICAgICAgICAgICAgbWVkaWEuZXhwcmVzc2lvbiA9IGVsZW0uYXR0cmlic1xuICAgICAgICAgICAgICAgIC5leHByZXNzaW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dHJpYnMuYml0cmF0ZSkge1xuICAgICAgICAgICAgbWVkaWEuYml0cmF0ZSA9IHBhcnNlSW50KGVsZW0uYXR0cmlicy5iaXRyYXRlLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW0uYXR0cmlicy5mcmFtZXJhdGUpIHtcbiAgICAgICAgICAgIG1lZGlhLmZyYW1lcmF0ZSA9IHBhcnNlSW50KGVsZW0uYXR0cmlicy5mcmFtZXJhdGUsIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbS5hdHRyaWJzLnNhbXBsaW5ncmF0ZSkge1xuICAgICAgICAgICAgbWVkaWEuc2FtcGxpbmdyYXRlID0gcGFyc2VJbnQoZWxlbS5hdHRyaWJzLnNhbXBsaW5ncmF0ZSwgMTApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dHJpYnMuY2hhbm5lbHMpIHtcbiAgICAgICAgICAgIG1lZGlhLmNoYW5uZWxzID0gcGFyc2VJbnQoZWxlbS5hdHRyaWJzLmNoYW5uZWxzLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW0uYXR0cmlicy5kdXJhdGlvbikge1xuICAgICAgICAgICAgbWVkaWEuZHVyYXRpb24gPSBwYXJzZUludChlbGVtLmF0dHJpYnMuZHVyYXRpb24sIDEwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbS5hdHRyaWJzLmhlaWdodCkge1xuICAgICAgICAgICAgbWVkaWEuaGVpZ2h0ID0gcGFyc2VJbnQoZWxlbS5hdHRyaWJzLmhlaWdodCwgMTApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtLmF0dHJpYnMud2lkdGgpIHtcbiAgICAgICAgICAgIG1lZGlhLndpZHRoID0gcGFyc2VJbnQoZWxlbS5hdHRyaWJzLndpZHRoLCAxMCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVsZW0uYXR0cmlicy5sYW5nKSB7XG4gICAgICAgICAgICBtZWRpYS5sYW5nID0gZWxlbS5hdHRyaWJzLmxhbmc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lZGlhO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZ2V0RWxlbWVudHModGFnTmFtZSwgd2hlcmUpIHtcbiAgICByZXR1cm4gRG9tVXRpbHMuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSwgd2hlcmUsIHRydWUpO1xufVxuZnVuY3Rpb24gZ2V0T25lRWxlbWVudCh0YWdOYW1lLCBub2RlKSB7XG4gICAgcmV0dXJuIERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUsIG5vZGUsIHRydWUsIDEpWzBdO1xufVxuZnVuY3Rpb24gZmV0Y2godGFnTmFtZSwgd2hlcmUsIHJlY3Vyc2UpIHtcbiAgICBpZiAocmVjdXJzZSA9PT0gdm9pZCAwKSB7IHJlY3Vyc2UgPSBmYWxzZTsgfVxuICAgIHJldHVybiBEb21VdGlscy5nZXRUZXh0KERvbVV0aWxzLmdldEVsZW1lbnRzQnlUYWdOYW1lKHRhZ05hbWUsIHdoZXJlLCByZWN1cnNlLCAxKSkudHJpbSgpO1xufVxuZnVuY3Rpb24gZ2V0QXR0cmlidXRlKG5hbWUsIGVsZW0pIHtcbiAgICBpZiAoIWVsZW0pIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBhdHRyaWJzID0gZWxlbS5hdHRyaWJzO1xuICAgIHJldHVybiBhdHRyaWJzW25hbWVdO1xufVxuZnVuY3Rpb24gYWRkQ29uZGl0aW9uYWxseShvYmosIHByb3AsIHdoYXQsIHdoZXJlLCByZWN1cnNlKSB7XG4gICAgaWYgKHJlY3Vyc2UgPT09IHZvaWQgMCkgeyByZWN1cnNlID0gZmFsc2U7IH1cbiAgICB2YXIgdG1wID0gZmV0Y2god2hhdCwgd2hlcmUsIHJlY3Vyc2UpO1xuICAgIGlmICh0bXApXG4gICAgICAgIG9ialtwcm9wXSA9IHRtcDtcbn1cbmZ1bmN0aW9uIGlzVmFsaWRGZWVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBcInJzc1wiIHx8IHZhbHVlID09PSBcImZlZWRcIiB8fCB2YWx1ZSA9PT0gXCJyZGY6UkRGXCI7XG59XG4vKipcbiAqIFBhcnNlIGEgZmVlZC5cbiAqXG4gKiBAcGFyYW0gZmVlZCBUaGUgZmVlZCB0aGF0IHNob3VsZCBiZSBwYXJzZWQsIGFzIGEgc3RyaW5nLlxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWxseSwgb3B0aW9ucyBmb3IgcGFyc2luZy4gV2hlbiB1c2luZyB0aGlzIG9wdGlvbiwgeW91IHNob3VsZCBzZXQgYHhtbE1vZGVgIHRvIGB0cnVlYC5cbiAqL1xuZnVuY3Rpb24gcGFyc2VGZWVkKGZlZWQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7IHhtbE1vZGU6IHRydWUgfTsgfVxuICAgIHZhciBoYW5kbGVyID0gbmV3IEZlZWRIYW5kbGVyKG9wdGlvbnMpO1xuICAgIG5ldyBQYXJzZXJfMS5QYXJzZXIoaGFuZGxlciwgb3B0aW9ucykuZW5kKGZlZWQpO1xuICAgIHJldHVybiBoYW5kbGVyLmZlZWQ7XG59XG5leHBvcnRzLnBhcnNlRmVlZCA9IHBhcnNlRmVlZDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QYXJzZXIgPSB2b2lkIDA7XG52YXIgVG9rZW5pemVyXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vVG9rZW5pemVyXCIpKTtcbnZhciBmb3JtVGFncyA9IG5ldyBTZXQoW1xuICAgIFwiaW5wdXRcIixcbiAgICBcIm9wdGlvblwiLFxuICAgIFwib3B0Z3JvdXBcIixcbiAgICBcInNlbGVjdFwiLFxuICAgIFwiYnV0dG9uXCIsXG4gICAgXCJkYXRhbGlzdFwiLFxuICAgIFwidGV4dGFyZWFcIixcbl0pO1xudmFyIHBUYWcgPSBuZXcgU2V0KFtcInBcIl0pO1xudmFyIG9wZW5JbXBsaWVzQ2xvc2UgPSB7XG4gICAgdHI6IG5ldyBTZXQoW1widHJcIiwgXCJ0aFwiLCBcInRkXCJdKSxcbiAgICB0aDogbmV3IFNldChbXCJ0aFwiXSksXG4gICAgdGQ6IG5ldyBTZXQoW1widGhlYWRcIiwgXCJ0aFwiLCBcInRkXCJdKSxcbiAgICBib2R5OiBuZXcgU2V0KFtcImhlYWRcIiwgXCJsaW5rXCIsIFwic2NyaXB0XCJdKSxcbiAgICBsaTogbmV3IFNldChbXCJsaVwiXSksXG4gICAgcDogcFRhZyxcbiAgICBoMTogcFRhZyxcbiAgICBoMjogcFRhZyxcbiAgICBoMzogcFRhZyxcbiAgICBoNDogcFRhZyxcbiAgICBoNTogcFRhZyxcbiAgICBoNjogcFRhZyxcbiAgICBzZWxlY3Q6IGZvcm1UYWdzLFxuICAgIGlucHV0OiBmb3JtVGFncyxcbiAgICBvdXRwdXQ6IGZvcm1UYWdzLFxuICAgIGJ1dHRvbjogZm9ybVRhZ3MsXG4gICAgZGF0YWxpc3Q6IGZvcm1UYWdzLFxuICAgIHRleHRhcmVhOiBmb3JtVGFncyxcbiAgICBvcHRpb246IG5ldyBTZXQoW1wib3B0aW9uXCJdKSxcbiAgICBvcHRncm91cDogbmV3IFNldChbXCJvcHRncm91cFwiLCBcIm9wdGlvblwiXSksXG4gICAgZGQ6IG5ldyBTZXQoW1wiZHRcIiwgXCJkZFwiXSksXG4gICAgZHQ6IG5ldyBTZXQoW1wiZHRcIiwgXCJkZFwiXSksXG4gICAgYWRkcmVzczogcFRhZyxcbiAgICBhcnRpY2xlOiBwVGFnLFxuICAgIGFzaWRlOiBwVGFnLFxuICAgIGJsb2NrcXVvdGU6IHBUYWcsXG4gICAgZGV0YWlsczogcFRhZyxcbiAgICBkaXY6IHBUYWcsXG4gICAgZGw6IHBUYWcsXG4gICAgZmllbGRzZXQ6IHBUYWcsXG4gICAgZmlnY2FwdGlvbjogcFRhZyxcbiAgICBmaWd1cmU6IHBUYWcsXG4gICAgZm9vdGVyOiBwVGFnLFxuICAgIGZvcm06IHBUYWcsXG4gICAgaGVhZGVyOiBwVGFnLFxuICAgIGhyOiBwVGFnLFxuICAgIG1haW46IHBUYWcsXG4gICAgbmF2OiBwVGFnLFxuICAgIG9sOiBwVGFnLFxuICAgIHByZTogcFRhZyxcbiAgICBzZWN0aW9uOiBwVGFnLFxuICAgIHRhYmxlOiBwVGFnLFxuICAgIHVsOiBwVGFnLFxuICAgIHJ0OiBuZXcgU2V0KFtcInJ0XCIsIFwicnBcIl0pLFxuICAgIHJwOiBuZXcgU2V0KFtcInJ0XCIsIFwicnBcIl0pLFxuICAgIHRib2R5OiBuZXcgU2V0KFtcInRoZWFkXCIsIFwidGJvZHlcIl0pLFxuICAgIHRmb290OiBuZXcgU2V0KFtcInRoZWFkXCIsIFwidGJvZHlcIl0pLFxufTtcbnZhciB2b2lkRWxlbWVudHMgPSBuZXcgU2V0KFtcbiAgICBcImFyZWFcIixcbiAgICBcImJhc2VcIixcbiAgICBcImJhc2Vmb250XCIsXG4gICAgXCJiclwiLFxuICAgIFwiY29sXCIsXG4gICAgXCJjb21tYW5kXCIsXG4gICAgXCJlbWJlZFwiLFxuICAgIFwiZnJhbWVcIixcbiAgICBcImhyXCIsXG4gICAgXCJpbWdcIixcbiAgICBcImlucHV0XCIsXG4gICAgXCJpc2luZGV4XCIsXG4gICAgXCJrZXlnZW5cIixcbiAgICBcImxpbmtcIixcbiAgICBcIm1ldGFcIixcbiAgICBcInBhcmFtXCIsXG4gICAgXCJzb3VyY2VcIixcbiAgICBcInRyYWNrXCIsXG4gICAgXCJ3YnJcIixcbl0pO1xudmFyIGZvcmVpZ25Db250ZXh0RWxlbWVudHMgPSBuZXcgU2V0KFtcIm1hdGhcIiwgXCJzdmdcIl0pO1xudmFyIGh0bWxJbnRlZ3JhdGlvbkVsZW1lbnRzID0gbmV3IFNldChbXG4gICAgXCJtaVwiLFxuICAgIFwibW9cIixcbiAgICBcIm1uXCIsXG4gICAgXCJtc1wiLFxuICAgIFwibXRleHRcIixcbiAgICBcImFubm90YXRpb24teG1sXCIsXG4gICAgXCJmb3JlaWduT2JqZWN0XCIsXG4gICAgXCJkZXNjXCIsXG4gICAgXCJ0aXRsZVwiLFxuXSk7XG52YXIgcmVOYW1lRW5kID0gL1xcc3xcXC8vO1xudmFyIFBhcnNlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJzZXIoY2JzLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2U7XG4gICAgICAgIC8qKiBUaGUgc3RhcnQgaW5kZXggb2YgdGhlIGxhc3QgZXZlbnQuICovXG4gICAgICAgIHRoaXMuc3RhcnRJbmRleCA9IDA7XG4gICAgICAgIC8qKiBUaGUgZW5kIGluZGV4IG9mIHRoZSBsYXN0IGV2ZW50LiAqL1xuICAgICAgICB0aGlzLmVuZEluZGV4ID0gbnVsbDtcbiAgICAgICAgdGhpcy50YWduYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5hdHRyaWJuYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5hdHRyaWJ2YWx1ZSA9IFwiXCI7XG4gICAgICAgIHRoaXMuYXR0cmlicyA9IG51bGw7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5mb3JlaWduQ29udGV4dCA9IFtdO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLmNicyA9IGNicyAhPT0gbnVsbCAmJiBjYnMgIT09IHZvaWQgMCA/IGNicyA6IHt9O1xuICAgICAgICB0aGlzLmxvd2VyQ2FzZVRhZ05hbWVzID0gKF9hID0gb3B0aW9ucy5sb3dlckNhc2VUYWdzKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAhb3B0aW9ucy54bWxNb2RlO1xuICAgICAgICB0aGlzLmxvd2VyQ2FzZUF0dHJpYnV0ZU5hbWVzID1cbiAgICAgICAgICAgIChfYiA9IG9wdGlvbnMubG93ZXJDYXNlQXR0cmlidXRlTmFtZXMpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICFvcHRpb25zLnhtbE1vZGU7XG4gICAgICAgIHRoaXMudG9rZW5pemVyID0gbmV3ICgoX2MgPSBvcHRpb25zLlRva2VuaXplcikgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogVG9rZW5pemVyXzEuZGVmYXVsdCkodGhpcy5vcHRpb25zLCB0aGlzKTtcbiAgICAgICAgKF9lID0gKF9kID0gdGhpcy5jYnMpLm9ucGFyc2VyaW5pdCkgPT09IG51bGwgfHwgX2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9lLmNhbGwoX2QsIHRoaXMpO1xuICAgIH1cbiAgICBQYXJzZXIucHJvdG90eXBlLnVwZGF0ZVBvc2l0aW9uID0gZnVuY3Rpb24gKGluaXRpYWxPZmZzZXQpIHtcbiAgICAgICAgaWYgKHRoaXMuZW5kSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnRva2VuaXplci5zZWN0aW9uU3RhcnQgPD0gaW5pdGlhbE9mZnNldCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRJbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SW5kZXggPSB0aGlzLnRva2VuaXplci5zZWN0aW9uU3RhcnQgLSBpbml0aWFsT2Zmc2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zdGFydEluZGV4ID0gdGhpcy5lbmRJbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbmRJbmRleCA9IHRoaXMudG9rZW5pemVyLmdldEFic29sdXRlSW5kZXgoKTtcbiAgICB9O1xuICAgIC8vIFRva2VuaXplciBldmVudCBoYW5kbGVyc1xuICAgIFBhcnNlci5wcm90b3R5cGUub250ZXh0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigxKTtcbiAgICAgICAgdGhpcy5lbmRJbmRleC0tO1xuICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmNicykub250ZXh0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgZGF0YSk7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLm9ub3BlbnRhZ25hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAodGhpcy5sb3dlckNhc2VUYWdOYW1lcykge1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhZ25hbWUgPSBuYW1lO1xuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy54bWxNb2RlICYmXG4gICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob3BlbkltcGxpZXNDbG9zZSwgbmFtZSkpIHtcbiAgICAgICAgICAgIHZhciBlbCA9IHZvaWQgMDtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLnN0YWNrLmxlbmd0aCA+IDAgJiZcbiAgICAgICAgICAgICAgICBvcGVuSW1wbGllc0Nsb3NlW25hbWVdLmhhcygoZWwgPSB0aGlzLnN0YWNrW3RoaXMuc3RhY2subGVuZ3RoIC0gMV0pKSkge1xuICAgICAgICAgICAgICAgIHRoaXMub25jbG9zZXRhZyhlbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy54bWxNb2RlIHx8ICF2b2lkRWxlbWVudHMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YWNrLnB1c2gobmFtZSk7XG4gICAgICAgICAgICBpZiAoZm9yZWlnbkNvbnRleHRFbGVtZW50cy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcmVpZ25Db250ZXh0LnB1c2godHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChodG1sSW50ZWdyYXRpb25FbGVtZW50cy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZvcmVpZ25Db250ZXh0LnB1c2goZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIChfYiA9IChfYSA9IHRoaXMuY2JzKS5vbm9wZW50YWduYW1lKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgbmFtZSk7XG4gICAgICAgIGlmICh0aGlzLmNicy5vbm9wZW50YWcpXG4gICAgICAgICAgICB0aGlzLmF0dHJpYnMgPSB7fTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUub25vcGVudGFnZW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKDEpO1xuICAgICAgICBpZiAodGhpcy5hdHRyaWJzKSB7XG4gICAgICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmNicykub25vcGVudGFnKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgdGhpcy50YWduYW1lLCB0aGlzLmF0dHJpYnMpO1xuICAgICAgICAgICAgdGhpcy5hdHRyaWJzID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy54bWxNb2RlICYmXG4gICAgICAgICAgICB0aGlzLmNicy5vbmNsb3NldGFnICYmXG4gICAgICAgICAgICB2b2lkRWxlbWVudHMuaGFzKHRoaXMudGFnbmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9uY2xvc2V0YWcodGhpcy50YWduYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhZ25hbWUgPSBcIlwiO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5vbmNsb3NldGFnID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigxKTtcbiAgICAgICAgaWYgKHRoaXMubG93ZXJDYXNlVGFnTmFtZXMpIHtcbiAgICAgICAgICAgIG5hbWUgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcmVpZ25Db250ZXh0RWxlbWVudHMuaGFzKG5hbWUpIHx8XG4gICAgICAgICAgICBodG1sSW50ZWdyYXRpb25FbGVtZW50cy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZm9yZWlnbkNvbnRleHQucG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3RhY2subGVuZ3RoICYmXG4gICAgICAgICAgICAodGhpcy5vcHRpb25zLnhtbE1vZGUgfHwgIXZvaWRFbGVtZW50cy5oYXMobmFtZSkpKSB7XG4gICAgICAgICAgICB2YXIgcG9zID0gdGhpcy5zdGFjay5sYXN0SW5kZXhPZihuYW1lKTtcbiAgICAgICAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2JzLm9uY2xvc2V0YWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gdGhpcy5zdGFjay5sZW5ndGggLSBwb3M7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChwb3MtLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2Uga25vdyB0aGUgc3RhY2sgaGFzIHN1ZmZpY2llbnQgZWxlbWVudHMuXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNicy5vbmNsb3NldGFnKHRoaXMuc3RhY2sucG9wKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFjay5sZW5ndGggPSBwb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChuYW1lID09PSBcInBcIiAmJiAhdGhpcy5vcHRpb25zLnhtbE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9ub3BlbnRhZ25hbWUobmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9zZUN1cnJlbnRUYWcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghdGhpcy5vcHRpb25zLnhtbE1vZGUgJiYgKG5hbWUgPT09IFwiYnJcIiB8fCBuYW1lID09PSBcInBcIikpIHtcbiAgICAgICAgICAgIHRoaXMub25vcGVudGFnbmFtZShuYW1lKTtcbiAgICAgICAgICAgIHRoaXMuY2xvc2VDdXJyZW50VGFnKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUub25zZWxmY2xvc2luZ3RhZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy54bWxNb2RlIHx8XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMucmVjb2duaXplU2VsZkNsb3NpbmcgfHxcbiAgICAgICAgICAgIHRoaXMuZm9yZWlnbkNvbnRleHRbdGhpcy5mb3JlaWduQ29udGV4dC5sZW5ndGggLSAxXSkge1xuICAgICAgICAgICAgdGhpcy5jbG9zZUN1cnJlbnRUYWcoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25vcGVudGFnZW5kKCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUuY2xvc2VDdXJyZW50VGFnID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICB2YXIgbmFtZSA9IHRoaXMudGFnbmFtZTtcbiAgICAgICAgdGhpcy5vbm9wZW50YWdlbmQoKTtcbiAgICAgICAgLypcbiAgICAgICAgICogU2VsZi1jbG9zaW5nIHRhZ3Mgd2lsbCBiZSBvbiB0aGUgdG9wIG9mIHRoZSBzdGFja1xuICAgICAgICAgKiAoY2hlYXBlciBjaGVjayB0aGFuIGluIG9uY2xvc2V0YWcpXG4gICAgICAgICAqL1xuICAgICAgICBpZiAodGhpcy5zdGFja1t0aGlzLnN0YWNrLmxlbmd0aCAtIDFdID09PSBuYW1lKSB7XG4gICAgICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmNicykub25jbG9zZXRhZykgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EsIG5hbWUpO1xuICAgICAgICAgICAgdGhpcy5zdGFjay5wb3AoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5vbmF0dHJpYm5hbWUgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBpZiAodGhpcy5sb3dlckNhc2VBdHRyaWJ1dGVOYW1lcykge1xuICAgICAgICAgICAgbmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmF0dHJpYm5hbWUgPSBuYW1lO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5vbmF0dHJpYmRhdGEgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ2YWx1ZSArPSB2YWx1ZTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUub25hdHRyaWJlbmQgPSBmdW5jdGlvbiAocXVvdGUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5jYnMpLm9uYXR0cmlidXRlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgdGhpcy5hdHRyaWJuYW1lLCB0aGlzLmF0dHJpYnZhbHVlLCBxdW90ZSk7XG4gICAgICAgIGlmICh0aGlzLmF0dHJpYnMgJiZcbiAgICAgICAgICAgICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpcy5hdHRyaWJzLCB0aGlzLmF0dHJpYm5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmF0dHJpYnNbdGhpcy5hdHRyaWJuYW1lXSA9IHRoaXMuYXR0cmlidmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJuYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5hdHRyaWJ2YWx1ZSA9IFwiXCI7XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLmdldEluc3RydWN0aW9uTmFtZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgaWR4ID0gdmFsdWUuc2VhcmNoKHJlTmFtZUVuZCk7XG4gICAgICAgIHZhciBuYW1lID0gaWR4IDwgMCA/IHZhbHVlIDogdmFsdWUuc3Vic3RyKDAsIGlkeCk7XG4gICAgICAgIGlmICh0aGlzLmxvd2VyQ2FzZVRhZ05hbWVzKSB7XG4gICAgICAgICAgICBuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuYW1lO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5vbmRlY2xhcmF0aW9uID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmNicy5vbnByb2Nlc3NpbmdpbnN0cnVjdGlvbikge1xuICAgICAgICAgICAgdmFyIG5hbWVfMSA9IHRoaXMuZ2V0SW5zdHJ1Y3Rpb25OYW1lKHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9ucHJvY2Vzc2luZ2luc3RydWN0aW9uKFwiIVwiICsgbmFtZV8xLCBcIiFcIiArIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5vbnByb2Nlc3NpbmdpbnN0cnVjdGlvbiA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAodGhpcy5jYnMub25wcm9jZXNzaW5naW5zdHJ1Y3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBuYW1lXzIgPSB0aGlzLmdldEluc3RydWN0aW9uTmFtZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNicy5vbnByb2Nlc3NpbmdpbnN0cnVjdGlvbihcIj9cIiArIG5hbWVfMiwgXCI/XCIgKyB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUub25jb21tZW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbig0KTtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5jYnMpLm9uY29tbWVudCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EsIHZhbHVlKTtcbiAgICAgICAgKF9kID0gKF9jID0gdGhpcy5jYnMpLm9uY29tbWVudGVuZCkgPT09IG51bGwgfHwgX2QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9kLmNhbGwoX2MpO1xuICAgIH07XG4gICAgUGFyc2VyLnByb3RvdHlwZS5vbmNkYXRhID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZCwgX2UsIF9mO1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKDEpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnhtbE1vZGUgfHwgdGhpcy5vcHRpb25zLnJlY29nbml6ZUNEQVRBKSB7XG4gICAgICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmNicykub25jZGF0YXN0YXJ0KSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSk7XG4gICAgICAgICAgICAoX2QgPSAoX2MgPSB0aGlzLmNicykub250ZXh0KSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuY2FsbChfYywgdmFsdWUpO1xuICAgICAgICAgICAgKF9mID0gKF9lID0gdGhpcy5jYnMpLm9uY2RhdGFlbmQpID09PSBudWxsIHx8IF9mID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZi5jYWxsKF9lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMub25jb21tZW50KFwiW0NEQVRBW1wiICsgdmFsdWUgKyBcIl1dXCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJzZXIucHJvdG90eXBlLm9uZXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIChfYiA9IChfYSA9IHRoaXMuY2JzKS5vbmVycm9yKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSwgZXJyKTtcbiAgICB9O1xuICAgIFBhcnNlci5wcm90b3R5cGUub25lbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGlmICh0aGlzLmNicy5vbmNsb3NldGFnKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gdGhpcy5zdGFjay5sZW5ndGg7IGkgPiAwOyB0aGlzLmNicy5vbmNsb3NldGFnKHRoaXMuc3RhY2tbLS1pXSkpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICB9XG4gICAgICAgIChfYiA9IChfYSA9IHRoaXMuY2JzKS5vbmVuZCkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwoX2EpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVzZXRzIHRoZSBwYXJzZXIgdG8gYSBibGFuayBzdGF0ZSwgcmVhZHkgdG8gcGFyc2UgYSBuZXcgSFRNTCBkb2N1bWVudFxuICAgICAqL1xuICAgIFBhcnNlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5jYnMpLm9ucmVzZXQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hKTtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIucmVzZXQoKTtcbiAgICAgICAgdGhpcy50YWduYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5hdHRyaWJuYW1lID0gXCJcIjtcbiAgICAgICAgdGhpcy5hdHRyaWJzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zdGFjayA9IFtdO1xuICAgICAgICAoX2QgPSAoX2MgPSB0aGlzLmNicykub25wYXJzZXJpbml0KSA9PT0gbnVsbCB8fCBfZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2QuY2FsbChfYywgdGhpcyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBSZXNldHMgdGhlIHBhcnNlciwgdGhlbiBwYXJzZXMgYSBjb21wbGV0ZSBkb2N1bWVudCBhbmRcbiAgICAgKiBwdXNoZXMgaXQgdG8gdGhlIGhhbmRsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZGF0YSBEb2N1bWVudCB0byBwYXJzZS5cbiAgICAgKi9cbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQ29tcGxldGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIHRoaXMuZW5kKGRhdGEpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUGFyc2VzIGEgY2h1bmsgb2YgZGF0YSBhbmQgY2FsbHMgdGhlIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNodW5rIENodW5rIHRvIHBhcnNlLlxuICAgICAqL1xuICAgIFBhcnNlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIud3JpdGUoY2h1bmspO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUGFyc2VzIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlciBhbmQgY2xlYXJzIHRoZSBzdGFjaywgY2FsbHMgb25lbmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2h1bmsgT3B0aW9uYWwgZmluYWwgY2h1bmsgdG8gcGFyc2UuXG4gICAgICovXG4gICAgUGFyc2VyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIuZW5kKGNodW5rKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFBhdXNlcyBwYXJzaW5nLiBUaGUgcGFyc2VyIHdvbid0IGVtaXQgZXZlbnRzIHVudGlsIGByZXN1bWVgIGlzIGNhbGxlZC5cbiAgICAgKi9cbiAgICBQYXJzZXIucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRva2VuaXplci5wYXVzZSgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmVzdW1lcyBwYXJzaW5nIGFmdGVyIGBwYXVzZWAgd2FzIGNhbGxlZC5cbiAgICAgKi9cbiAgICBQYXJzZXIucHJvdG90eXBlLnJlc3VtZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIucmVzdW1lKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBgd3JpdGVgLCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2h1bmsgQ2h1bmsgdG8gcGFyc2UuXG4gICAgICogQGRlcHJlY2F0ZWRcbiAgICAgKi9cbiAgICBQYXJzZXIucHJvdG90eXBlLnBhcnNlQ2h1bmsgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgdGhpcy53cml0ZShjaHVuayk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBgZW5kYCwgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgICAqXG4gICAgICogQHBhcmFtIGNodW5rIE9wdGlvbmFsIGZpbmFsIGNodW5rIHRvIHBhcnNlLlxuICAgICAqIEBkZXByZWNhdGVkXG4gICAgICovXG4gICAgUGFyc2VyLnByb3RvdHlwZS5kb25lID0gZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgICAgIHRoaXMuZW5kKGNodW5rKTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJzZXI7XG59KCkpO1xuZXhwb3J0cy5QYXJzZXIgPSBQYXJzZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBkZWNvZGVfY29kZXBvaW50XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImVudGl0aWVzL2xpYi9kZWNvZGVfY29kZXBvaW50XCIpKTtcbnZhciBlbnRpdGllc19qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImVudGl0aWVzL2xpYi9tYXBzL2VudGl0aWVzLmpzb25cIikpO1xudmFyIGxlZ2FjeV9qc29uXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImVudGl0aWVzL2xpYi9tYXBzL2xlZ2FjeS5qc29uXCIpKTtcbnZhciB4bWxfanNvbl8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJlbnRpdGllcy9saWIvbWFwcy94bWwuanNvblwiKSk7XG5mdW5jdGlvbiB3aGl0ZXNwYWNlKGMpIHtcbiAgICByZXR1cm4gYyA9PT0gXCIgXCIgfHwgYyA9PT0gXCJcXG5cIiB8fCBjID09PSBcIlxcdFwiIHx8IGMgPT09IFwiXFxmXCIgfHwgYyA9PT0gXCJcXHJcIjtcbn1cbmZ1bmN0aW9uIGlzQVNDSUlBbHBoYShjKSB7XG4gICAgcmV0dXJuIChjID49IFwiYVwiICYmIGMgPD0gXCJ6XCIpIHx8IChjID49IFwiQVwiICYmIGMgPD0gXCJaXCIpO1xufVxuZnVuY3Rpb24gaWZFbHNlU3RhdGUodXBwZXIsIFNVQ0NFU1MsIEZBSUxVUkUpIHtcbiAgICB2YXIgbG93ZXIgPSB1cHBlci50b0xvd2VyQ2FzZSgpO1xuICAgIGlmICh1cHBlciA9PT0gbG93ZXIpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICh0LCBjKSB7XG4gICAgICAgICAgICBpZiAoYyA9PT0gbG93ZXIpIHtcbiAgICAgICAgICAgICAgICB0Ll9zdGF0ZSA9IFNVQ0NFU1M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0Ll9zdGF0ZSA9IEZBSUxVUkU7XG4gICAgICAgICAgICAgICAgdC5faW5kZXgtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0LCBjKSB7XG4gICAgICAgIGlmIChjID09PSBsb3dlciB8fCBjID09PSB1cHBlcikge1xuICAgICAgICAgICAgdC5fc3RhdGUgPSBTVUNDRVNTO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdC5fc3RhdGUgPSBGQUlMVVJFO1xuICAgICAgICAgICAgdC5faW5kZXgtLTtcbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBjb25zdW1lU3BlY2lhbE5hbWVDaGFyKHVwcGVyLCBORVhUX1NUQVRFKSB7XG4gICAgdmFyIGxvd2VyID0gdXBwZXIudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHQsIGMpIHtcbiAgICAgICAgaWYgKGMgPT09IGxvd2VyIHx8IGMgPT09IHVwcGVyKSB7XG4gICAgICAgICAgICB0Ll9zdGF0ZSA9IE5FWFRfU1RBVEU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0Ll9zdGF0ZSA9IDMgLyogSW5UYWdOYW1lICovO1xuICAgICAgICAgICAgdC5faW5kZXgtLTsgLy8gQ29uc3VtZSB0aGUgdG9rZW4gYWdhaW5cbiAgICAgICAgfVxuICAgIH07XG59XG52YXIgc3RhdGVCZWZvcmVDZGF0YTEgPSBpZkVsc2VTdGF0ZShcIkNcIiwgMjQgLyogQmVmb3JlQ2RhdGEyICovLCAxNiAvKiBJbkRlY2xhcmF0aW9uICovKTtcbnZhciBzdGF0ZUJlZm9yZUNkYXRhMiA9IGlmRWxzZVN0YXRlKFwiRFwiLCAyNSAvKiBCZWZvcmVDZGF0YTMgKi8sIDE2IC8qIEluRGVjbGFyYXRpb24gKi8pO1xudmFyIHN0YXRlQmVmb3JlQ2RhdGEzID0gaWZFbHNlU3RhdGUoXCJBXCIsIDI2IC8qIEJlZm9yZUNkYXRhNCAqLywgMTYgLyogSW5EZWNsYXJhdGlvbiAqLyk7XG52YXIgc3RhdGVCZWZvcmVDZGF0YTQgPSBpZkVsc2VTdGF0ZShcIlRcIiwgMjcgLyogQmVmb3JlQ2RhdGE1ICovLCAxNiAvKiBJbkRlY2xhcmF0aW9uICovKTtcbnZhciBzdGF0ZUJlZm9yZUNkYXRhNSA9IGlmRWxzZVN0YXRlKFwiQVwiLCAyOCAvKiBCZWZvcmVDZGF0YTYgKi8sIDE2IC8qIEluRGVjbGFyYXRpb24gKi8pO1xudmFyIHN0YXRlQmVmb3JlU2NyaXB0MSA9IGNvbnN1bWVTcGVjaWFsTmFtZUNoYXIoXCJSXCIsIDM1IC8qIEJlZm9yZVNjcmlwdDIgKi8pO1xudmFyIHN0YXRlQmVmb3JlU2NyaXB0MiA9IGNvbnN1bWVTcGVjaWFsTmFtZUNoYXIoXCJJXCIsIDM2IC8qIEJlZm9yZVNjcmlwdDMgKi8pO1xudmFyIHN0YXRlQmVmb3JlU2NyaXB0MyA9IGNvbnN1bWVTcGVjaWFsTmFtZUNoYXIoXCJQXCIsIDM3IC8qIEJlZm9yZVNjcmlwdDQgKi8pO1xudmFyIHN0YXRlQmVmb3JlU2NyaXB0NCA9IGNvbnN1bWVTcGVjaWFsTmFtZUNoYXIoXCJUXCIsIDM4IC8qIEJlZm9yZVNjcmlwdDUgKi8pO1xudmFyIHN0YXRlQWZ0ZXJTY3JpcHQxID0gaWZFbHNlU3RhdGUoXCJSXCIsIDQwIC8qIEFmdGVyU2NyaXB0MiAqLywgMSAvKiBUZXh0ICovKTtcbnZhciBzdGF0ZUFmdGVyU2NyaXB0MiA9IGlmRWxzZVN0YXRlKFwiSVwiLCA0MSAvKiBBZnRlclNjcmlwdDMgKi8sIDEgLyogVGV4dCAqLyk7XG52YXIgc3RhdGVBZnRlclNjcmlwdDMgPSBpZkVsc2VTdGF0ZShcIlBcIiwgNDIgLyogQWZ0ZXJTY3JpcHQ0ICovLCAxIC8qIFRleHQgKi8pO1xudmFyIHN0YXRlQWZ0ZXJTY3JpcHQ0ID0gaWZFbHNlU3RhdGUoXCJUXCIsIDQzIC8qIEFmdGVyU2NyaXB0NSAqLywgMSAvKiBUZXh0ICovKTtcbnZhciBzdGF0ZUJlZm9yZVN0eWxlMSA9IGNvbnN1bWVTcGVjaWFsTmFtZUNoYXIoXCJZXCIsIDQ1IC8qIEJlZm9yZVN0eWxlMiAqLyk7XG52YXIgc3RhdGVCZWZvcmVTdHlsZTIgPSBjb25zdW1lU3BlY2lhbE5hbWVDaGFyKFwiTFwiLCA0NiAvKiBCZWZvcmVTdHlsZTMgKi8pO1xudmFyIHN0YXRlQmVmb3JlU3R5bGUzID0gY29uc3VtZVNwZWNpYWxOYW1lQ2hhcihcIkVcIiwgNDcgLyogQmVmb3JlU3R5bGU0ICovKTtcbnZhciBzdGF0ZUFmdGVyU3R5bGUxID0gaWZFbHNlU3RhdGUoXCJZXCIsIDQ5IC8qIEFmdGVyU3R5bGUyICovLCAxIC8qIFRleHQgKi8pO1xudmFyIHN0YXRlQWZ0ZXJTdHlsZTIgPSBpZkVsc2VTdGF0ZShcIkxcIiwgNTAgLyogQWZ0ZXJTdHlsZTMgKi8sIDEgLyogVGV4dCAqLyk7XG52YXIgc3RhdGVBZnRlclN0eWxlMyA9IGlmRWxzZVN0YXRlKFwiRVwiLCA1MSAvKiBBZnRlclN0eWxlNCAqLywgMSAvKiBUZXh0ICovKTtcbnZhciBzdGF0ZUJlZm9yZVNwZWNpYWxUID0gY29uc3VtZVNwZWNpYWxOYW1lQ2hhcihcIklcIiwgNTQgLyogQmVmb3JlVGl0bGUxICovKTtcbnZhciBzdGF0ZUJlZm9yZVRpdGxlMSA9IGNvbnN1bWVTcGVjaWFsTmFtZUNoYXIoXCJUXCIsIDU1IC8qIEJlZm9yZVRpdGxlMiAqLyk7XG52YXIgc3RhdGVCZWZvcmVUaXRsZTIgPSBjb25zdW1lU3BlY2lhbE5hbWVDaGFyKFwiTFwiLCA1NiAvKiBCZWZvcmVUaXRsZTMgKi8pO1xudmFyIHN0YXRlQmVmb3JlVGl0bGUzID0gY29uc3VtZVNwZWNpYWxOYW1lQ2hhcihcIkVcIiwgNTcgLyogQmVmb3JlVGl0bGU0ICovKTtcbnZhciBzdGF0ZUFmdGVyU3BlY2lhbFRFbmQgPSBpZkVsc2VTdGF0ZShcIklcIiwgNTggLyogQWZ0ZXJUaXRsZTEgKi8sIDEgLyogVGV4dCAqLyk7XG52YXIgc3RhdGVBZnRlclRpdGxlMSA9IGlmRWxzZVN0YXRlKFwiVFwiLCA1OSAvKiBBZnRlclRpdGxlMiAqLywgMSAvKiBUZXh0ICovKTtcbnZhciBzdGF0ZUFmdGVyVGl0bGUyID0gaWZFbHNlU3RhdGUoXCJMXCIsIDYwIC8qIEFmdGVyVGl0bGUzICovLCAxIC8qIFRleHQgKi8pO1xudmFyIHN0YXRlQWZ0ZXJUaXRsZTMgPSBpZkVsc2VTdGF0ZShcIkVcIiwgNjEgLyogQWZ0ZXJUaXRsZTQgKi8sIDEgLyogVGV4dCAqLyk7XG52YXIgc3RhdGVCZWZvcmVFbnRpdHkgPSBpZkVsc2VTdGF0ZShcIiNcIiwgNjMgLyogQmVmb3JlTnVtZXJpY0VudGl0eSAqLywgNjQgLyogSW5OYW1lZEVudGl0eSAqLyk7XG52YXIgc3RhdGVCZWZvcmVOdW1lcmljRW50aXR5ID0gaWZFbHNlU3RhdGUoXCJYXCIsIDY2IC8qIEluSGV4RW50aXR5ICovLCA2NSAvKiBJbk51bWVyaWNFbnRpdHkgKi8pO1xudmFyIFRva2VuaXplciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUb2tlbml6ZXIob3B0aW9ucywgY2JzKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgLyoqIFRoZSBjdXJyZW50IHN0YXRlIHRoZSB0b2tlbml6ZXIgaXMgaW4uICovXG4gICAgICAgIHRoaXMuX3N0YXRlID0gMSAvKiBUZXh0ICovO1xuICAgICAgICAvKiogVGhlIHJlYWQgYnVmZmVyLiAqL1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IFwiXCI7XG4gICAgICAgIC8qKiBUaGUgYmVnaW5uaW5nIG9mIHRoZSBzZWN0aW9uIHRoYXQgaXMgY3VycmVudGx5IGJlaW5nIHJlYWQuICovXG4gICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gMDtcbiAgICAgICAgLyoqIFRoZSBpbmRleCB3aXRoaW4gdGhlIGJ1ZmZlciB0aGF0IHdlIGFyZSBjdXJyZW50bHkgbG9va2luZyBhdC4gKi9cbiAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICAvKipcbiAgICAgICAgICogRGF0YSB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gcHJvY2Vzc2VkIHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBidWZmZXIgb2NjYXNpb25hbGx5LlxuICAgICAgICAgKiBgX2J1ZmZlck9mZnNldGAga2VlcHMgdHJhY2sgb2YgaG93IG1hbnkgY2hhcmFjdGVycyBoYXZlIGJlZW4gcmVtb3ZlZCwgdG8gbWFrZSBzdXJlIHBvc2l0aW9uIGluZm9ybWF0aW9uIGlzIGFjY3VyYXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5idWZmZXJPZmZzZXQgPSAwO1xuICAgICAgICAvKiogU29tZSBiZWhhdmlvciwgZWcuIHdoZW4gZGVjb2RpbmcgZW50aXRpZXMsIGlzIGRvbmUgd2hpbGUgd2UgYXJlIGluIGFub3RoZXIgc3RhdGUuIFRoaXMga2VlcHMgdHJhY2sgb2YgdGhlIG90aGVyIHN0YXRlIHR5cGUuICovXG4gICAgICAgIHRoaXMuYmFzZVN0YXRlID0gMSAvKiBUZXh0ICovO1xuICAgICAgICAvKiogRm9yIHNwZWNpYWwgcGFyc2luZyBiZWhhdmlvciBpbnNpZGUgb2Ygc2NyaXB0IGFuZCBzdHlsZSB0YWdzLiAqL1xuICAgICAgICB0aGlzLnNwZWNpYWwgPSAxIC8qIE5vbmUgKi87XG4gICAgICAgIC8qKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdG9rZW5pemVyIGhhcyBiZWVuIHBhdXNlZC4gKi9cbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgLyoqIEluZGljYXRlcyB3aGV0aGVyIHRoZSB0b2tlbml6ZXIgaGFzIGZpbmlzaGVkIHJ1bm5pbmcgLyBgLmVuZGAgaGFzIGJlZW4gY2FsbGVkLiAqL1xuICAgICAgICB0aGlzLmVuZGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY2JzID0gY2JzO1xuICAgICAgICB0aGlzLnhtbE1vZGUgPSAhIShvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMueG1sTW9kZSk7XG4gICAgICAgIHRoaXMuZGVjb2RlRW50aXRpZXMgPSAoX2EgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZGVjb2RlRW50aXRpZXMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IHRydWU7XG4gICAgfVxuICAgIFRva2VuaXplci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gMSAvKiBUZXh0ICovO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IFwiXCI7XG4gICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gMDtcbiAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICB0aGlzLmJ1ZmZlck9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMuYmFzZVN0YXRlID0gMSAvKiBUZXh0ICovO1xuICAgICAgICB0aGlzLnNwZWNpYWwgPSAxIC8qIE5vbmUgKi87XG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuZW5kZWQgPSBmYWxzZTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgaWYgKHRoaXMuZW5kZWQpXG4gICAgICAgICAgICB0aGlzLmNicy5vbmVycm9yKEVycm9yKFwiLndyaXRlKCkgYWZ0ZXIgZG9uZSFcIikpO1xuICAgICAgICB0aGlzLmJ1ZmZlciArPSBjaHVuaztcbiAgICAgICAgdGhpcy5wYXJzZSgpO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5lbmQgPSBmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgaWYgKHRoaXMuZW5kZWQpXG4gICAgICAgICAgICB0aGlzLmNicy5vbmVycm9yKEVycm9yKFwiLmVuZCgpIGFmdGVyIGRvbmUhXCIpKTtcbiAgICAgICAgaWYgKGNodW5rKVxuICAgICAgICAgICAgdGhpcy53cml0ZShjaHVuayk7XG4gICAgICAgIHRoaXMuZW5kZWQgPSB0cnVlO1xuICAgICAgICBpZiAodGhpcy5ydW5uaW5nKVxuICAgICAgICAgICAgdGhpcy5maW5pc2goKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IGZhbHNlO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLl9pbmRleCA8IHRoaXMuYnVmZmVyLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmVuZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaGUgY3VycmVudCBpbmRleCB3aXRoaW4gYWxsIG9mIHRoZSB3cml0dGVuIGRhdGEuXG4gICAgICovXG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5nZXRBYnNvbHV0ZUluZGV4ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXJPZmZzZXQgKyB0aGlzLl9pbmRleDtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVUZXh0ID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKGMgPT09IFwiPFwiKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faW5kZXggPiB0aGlzLnNlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2JzLm9udGV4dCh0aGlzLmdldFNlY3Rpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDIgLyogQmVmb3JlVGFnTmFtZSAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5kZWNvZGVFbnRpdGllcyAmJlxuICAgICAgICAgICAgYyA9PT0gXCImXCIgJiZcbiAgICAgICAgICAgICh0aGlzLnNwZWNpYWwgPT09IDEgLyogTm9uZSAqLyB8fCB0aGlzLnNwZWNpYWwgPT09IDQgLyogVGl0bGUgKi8pKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5faW5kZXggPiB0aGlzLnNlY3Rpb25TdGFydCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2JzLm9udGV4dCh0aGlzLmdldFNlY3Rpb24oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJhc2VTdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gNjIgLyogQmVmb3JlRW50aXR5ICovO1xuICAgICAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgPSB0aGlzLl9pbmRleDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSFRNTCBvbmx5IGFsbG93cyBBU0NJSSBhbHBoYSBjaGFyYWN0ZXJzIChhLXogYW5kIEEtWikgYXQgdGhlIGJlZ2lubmluZyBvZiBhIHRhZyBuYW1lLlxuICAgICAqXG4gICAgICogWE1MIGFsbG93cyBhIGxvdCBtb3JlIGNoYXJhY3RlcnMgaGVyZSAoQHNlZSBodHRwczovL3d3dy53My5vcmcvVFIvUkVDLXhtbC8jTlQtTmFtZVN0YXJ0Q2hhcikuXG4gICAgICogV2UgYWxsb3cgYW55dGhpbmcgdGhhdCB3b3VsZG4ndCBlbmQgdGhlIHRhZy5cbiAgICAgKi9cbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmlzVGFnU3RhcnRDaGFyID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIChpc0FTQ0lJQWxwaGEoYykgfHxcbiAgICAgICAgICAgICh0aGlzLnhtbE1vZGUgJiYgIXdoaXRlc3BhY2UoYykgJiYgYyAhPT0gXCIvXCIgJiYgYyAhPT0gXCI+XCIpKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVCZWZvcmVUYWdOYW1lID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKGMgPT09IFwiL1wiKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDUgLyogQmVmb3JlQ2xvc2luZ1RhZ05hbWUgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCI8XCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9udGV4dCh0aGlzLmdldFNlY3Rpb24oKSk7XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwiPlwiIHx8XG4gICAgICAgICAgICB0aGlzLnNwZWNpYWwgIT09IDEgLyogTm9uZSAqLyB8fFxuICAgICAgICAgICAgd2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxIC8qIFRleHQgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCIhXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gMTUgLyogQmVmb3JlRGVjbGFyYXRpb24gKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIj9cIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxNyAvKiBJblByb2Nlc3NpbmdJbnN0cnVjdGlvbiAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLmlzVGFnU3RhcnRDaGFyKGMpKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID1cbiAgICAgICAgICAgICAgICAhdGhpcy54bWxNb2RlICYmIChjID09PSBcInNcIiB8fCBjID09PSBcIlNcIilcbiAgICAgICAgICAgICAgICAgICAgPyAzMiAvKiBCZWZvcmVTcGVjaWFsUyAqL1xuICAgICAgICAgICAgICAgICAgICA6ICF0aGlzLnhtbE1vZGUgJiYgKGMgPT09IFwidFwiIHx8IGMgPT09IFwiVFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyA1MiAvKiBCZWZvcmVTcGVjaWFsVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgOiAzIC8qIEluVGFnTmFtZSAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXg7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVJblRhZ05hbWUgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCIvXCIgfHwgYyA9PT0gXCI+XCIgfHwgd2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgdGhpcy5lbWl0VG9rZW4oXCJvbm9wZW50YWduYW1lXCIpO1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSA4IC8qIEJlZm9yZUF0dHJpYnV0ZU5hbWUgKi87XG4gICAgICAgICAgICB0aGlzLl9pbmRleC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQmVmb3JlQ2xvc2luZ1RhZ05hbWUgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAod2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgLy8gSWdub3JlXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gMSAvKiBUZXh0ICovO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3BlY2lhbCAhPT0gMSAvKiBOb25lICovKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zcGVjaWFsICE9PSA0IC8qIFRpdGxlICovICYmIChjID09PSBcInNcIiB8fCBjID09PSBcIlNcIikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDMzIC8qIEJlZm9yZVNwZWNpYWxTRW5kICovO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5zcGVjaWFsID09PSA0IC8qIFRpdGxlICovICYmXG4gICAgICAgICAgICAgICAgKGMgPT09IFwidFwiIHx8IGMgPT09IFwiVFwiKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gNTMgLyogQmVmb3JlU3BlY2lhbFRFbmQgKi87XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleC0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKCF0aGlzLmlzVGFnU3RhcnRDaGFyKGMpKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDIwIC8qIEluU3BlY2lhbENvbW1lbnQgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSA2IC8qIEluQ2xvc2luZ1RhZ05hbWUgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5DbG9zaW5nVGFnTmFtZSA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIj5cIiB8fCB3aGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRUb2tlbihcIm9uY2xvc2V0YWdcIik7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDcgLyogQWZ0ZXJDbG9zaW5nVGFnTmFtZSAqLztcbiAgICAgICAgICAgIHRoaXMuX2luZGV4LS07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVBZnRlckNsb3NpbmdUYWdOYW1lID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgLy8gU2tpcCBldmVyeXRoaW5nIHVudGlsIFwiPlwiXG4gICAgICAgIGlmIChjID09PSBcIj5cIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxIC8qIFRleHQgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUJlZm9yZUF0dHJpYnV0ZU5hbWUgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9ub3BlbnRhZ2VuZCgpO1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxIC8qIFRleHQgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIi9cIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSA0IC8qIEluU2VsZkNsb3NpbmdUYWcgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXdoaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gOSAvKiBJbkF0dHJpYnV0ZU5hbWUgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5TZWxmQ2xvc2luZ1RhZyA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIj5cIikge1xuICAgICAgICAgICAgdGhpcy5jYnMub25zZWxmY2xvc2luZ3RhZygpO1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxIC8qIFRleHQgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgICAgICAgIHRoaXMuc3BlY2lhbCA9IDEgLyogTm9uZSAqLzsgLy8gUmVzZXQgc3BlY2lhbCBzdGF0ZSwgaW4gY2FzZSBvZiBzZWxmLWNsb3Npbmcgc3BlY2lhbCB0YWdzXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXdoaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gOCAvKiBCZWZvcmVBdHRyaWJ1dGVOYW1lICovO1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUluQXR0cmlidXRlTmFtZSA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIj1cIiB8fCBjID09PSBcIi9cIiB8fCBjID09PSBcIj5cIiB8fCB3aGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICB0aGlzLmNicy5vbmF0dHJpYm5hbWUodGhpcy5nZXRTZWN0aW9uKCkpO1xuICAgICAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgPSAtMTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gMTAgLyogQWZ0ZXJBdHRyaWJ1dGVOYW1lICovO1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUFmdGVyQXR0cmlidXRlTmFtZSA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIj1cIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxMSAvKiBCZWZvcmVBdHRyaWJ1dGVWYWx1ZSAqLztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIi9cIiB8fCBjID09PSBcIj5cIikge1xuICAgICAgICAgICAgdGhpcy5jYnMub25hdHRyaWJlbmQodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gOCAvKiBCZWZvcmVBdHRyaWJ1dGVOYW1lICovO1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghd2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgdGhpcy5jYnMub25hdHRyaWJlbmQodW5kZWZpbmVkKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gOSAvKiBJbkF0dHJpYnV0ZU5hbWUgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQmVmb3JlQXR0cmlidXRlVmFsdWUgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gJ1wiJykge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxMiAvKiBJbkF0dHJpYnV0ZVZhbHVlRHEgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIidcIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxMyAvKiBJbkF0dHJpYnV0ZVZhbHVlU3EgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4ICsgMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICghd2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxNCAvKiBJbkF0dHJpYnV0ZVZhbHVlTnEgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTsgLy8gUmVjb25zdW1lIHRva2VuXG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuaGFuZGxlSW5BdHRyaWJ1dGVWYWx1ZSA9IGZ1bmN0aW9uIChjLCBxdW90ZSkge1xuICAgICAgICBpZiAoYyA9PT0gcXVvdGUpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdFRva2VuKFwib25hdHRyaWJkYXRhXCIpO1xuICAgICAgICAgICAgdGhpcy5jYnMub25hdHRyaWJlbmQocXVvdGUpO1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSA4IC8qIEJlZm9yZUF0dHJpYnV0ZU5hbWUgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5kZWNvZGVFbnRpdGllcyAmJiBjID09PSBcIiZcIikge1xuICAgICAgICAgICAgdGhpcy5lbWl0VG9rZW4oXCJvbmF0dHJpYmRhdGFcIik7XG4gICAgICAgICAgICB0aGlzLmJhc2VTdGF0ZSA9IHRoaXMuX3N0YXRlO1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSA2MiAvKiBCZWZvcmVFbnRpdHkgKi87XG4gICAgICAgICAgICB0aGlzLnNlY3Rpb25TdGFydCA9IHRoaXMuX2luZGV4O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5BdHRyaWJ1dGVWYWx1ZURvdWJsZVF1b3RlcyA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlSW5BdHRyaWJ1dGVWYWx1ZShjLCAnXCInKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVJbkF0dHJpYnV0ZVZhbHVlU2luZ2xlUXVvdGVzID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVJbkF0dHJpYnV0ZVZhbHVlKGMsIFwiJ1wiKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVJbkF0dHJpYnV0ZVZhbHVlTm9RdW90ZXMgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAod2hpdGVzcGFjZShjKSB8fCBjID09PSBcIj5cIikge1xuICAgICAgICAgICAgdGhpcy5lbWl0VG9rZW4oXCJvbmF0dHJpYmRhdGFcIik7XG4gICAgICAgICAgICB0aGlzLmNicy5vbmF0dHJpYmVuZChudWxsKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gOCAvKiBCZWZvcmVBdHRyaWJ1dGVOYW1lICovO1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRlY29kZUVudGl0aWVzICYmIGMgPT09IFwiJlwiKSB7XG4gICAgICAgICAgICB0aGlzLmVtaXRUb2tlbihcIm9uYXR0cmliZGF0YVwiKTtcbiAgICAgICAgICAgIHRoaXMuYmFzZVN0YXRlID0gdGhpcy5fc3RhdGU7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDYyIC8qIEJlZm9yZUVudGl0eSAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXg7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVCZWZvcmVEZWNsYXJhdGlvbiA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIHRoaXMuX3N0YXRlID1cbiAgICAgICAgICAgIGMgPT09IFwiW1wiXG4gICAgICAgICAgICAgICAgPyAyMyAvKiBCZWZvcmVDZGF0YTEgKi9cbiAgICAgICAgICAgICAgICA6IGMgPT09IFwiLVwiXG4gICAgICAgICAgICAgICAgICAgID8gMTggLyogQmVmb3JlQ29tbWVudCAqL1xuICAgICAgICAgICAgICAgICAgICA6IDE2IC8qIEluRGVjbGFyYXRpb24gKi87XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5EZWNsYXJhdGlvbiA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIj5cIikge1xuICAgICAgICAgICAgdGhpcy5jYnMub25kZWNsYXJhdGlvbih0aGlzLmdldFNlY3Rpb24oKSk7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5Qcm9jZXNzaW5nSW5zdHJ1Y3Rpb24gPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9ucHJvY2Vzc2luZ2luc3RydWN0aW9uKHRoaXMuZ2V0U2VjdGlvbigpKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gMSAvKiBUZXh0ICovO1xuICAgICAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgPSB0aGlzLl9pbmRleCArIDE7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVCZWZvcmVDb21tZW50ID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKGMgPT09IFwiLVwiKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDE5IC8qIEluQ29tbWVudCAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxNiAvKiBJbkRlY2xhcmF0aW9uICovO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5Db21tZW50ID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKGMgPT09IFwiLVwiKVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAyMSAvKiBBZnRlckNvbW1lbnQxICovO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUluU3BlY2lhbENvbW1lbnQgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9uY29tbWVudCh0aGlzLmJ1ZmZlci5zdWJzdHJpbmcodGhpcy5zZWN0aW9uU3RhcnQsIHRoaXMuX2luZGV4KSk7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQWZ0ZXJDb21tZW50MSA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIi1cIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAyMiAvKiBBZnRlckNvbW1lbnQyICovO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxOSAvKiBJbkNvbW1lbnQgKi87XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVBZnRlckNvbW1lbnQyID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKGMgPT09IFwiPlwiKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgMiB0cmFpbGluZyBjaGFyc1xuICAgICAgICAgICAgdGhpcy5jYnMub25jb21tZW50KHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnNlY3Rpb25TdGFydCwgdGhpcy5faW5kZXggLSAyKSk7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgIT09IFwiLVwiKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDE5IC8qIEluQ29tbWVudCAqLztcbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlOiBzdGF5IGluIEFGVEVSX0NPTU1FTlRfMiAoYC0tLT5gKVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUJlZm9yZUNkYXRhNiA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIltcIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAyOSAvKiBJbkNkYXRhICovO1xuICAgICAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgPSB0aGlzLl9pbmRleCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDE2IC8qIEluRGVjbGFyYXRpb24gKi87XG4gICAgICAgICAgICB0aGlzLl9pbmRleC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5DZGF0YSA9IGZ1bmN0aW9uIChjKSB7XG4gICAgICAgIGlmIChjID09PSBcIl1cIilcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gMzAgLyogQWZ0ZXJDZGF0YTEgKi87XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQWZ0ZXJDZGF0YTEgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCJdXCIpXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDMxIC8qIEFmdGVyQ2RhdGEyICovO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDI5IC8qIEluQ2RhdGEgKi87XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQWZ0ZXJDZGF0YTIgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCI+XCIpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSAyIHRyYWlsaW5nIGNoYXJzXG4gICAgICAgICAgICB0aGlzLmNicy5vbmNkYXRhKHRoaXMuYnVmZmVyLnN1YnN0cmluZyh0aGlzLnNlY3Rpb25TdGFydCwgdGhpcy5faW5kZXggLSAyKSk7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDEgLyogVGV4dCAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgIT09IFwiXVwiKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDI5IC8qIEluQ2RhdGEgKi87XG4gICAgICAgIH1cbiAgICAgICAgLy8gRWxzZTogc3RheSBpbiBBRlRFUl9DREFUQV8yIChgXV1dPmApXG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQmVmb3JlU3BlY2lhbFMgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCJjXCIgfHwgYyA9PT0gXCJDXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gMzQgLyogQmVmb3JlU2NyaXB0MSAqLztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcInRcIiB8fCBjID09PSBcIlRcIikge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSA0NCAvKiBCZWZvcmVTdHlsZTEgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDMgLyogSW5UYWdOYW1lICovO1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTsgLy8gQ29uc3VtZSB0aGUgdG9rZW4gYWdhaW5cbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUJlZm9yZVNwZWNpYWxTRW5kID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKHRoaXMuc3BlY2lhbCA9PT0gMiAvKiBTY3JpcHQgKi8gJiYgKGMgPT09IFwiY1wiIHx8IGMgPT09IFwiQ1wiKSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAzOSAvKiBBZnRlclNjcmlwdDEgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zcGVjaWFsID09PSAzIC8qIFN0eWxlICovICYmIChjID09PSBcInRcIiB8fCBjID09PSBcIlRcIikpIHtcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gNDggLyogQWZ0ZXJTdHlsZTEgKi87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxIC8qIFRleHQgKi87XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlQmVmb3JlU3BlY2lhbExhc3QgPSBmdW5jdGlvbiAoYywgc3BlY2lhbCkge1xuICAgICAgICBpZiAoYyA9PT0gXCIvXCIgfHwgYyA9PT0gXCI+XCIgfHwgd2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgdGhpcy5zcGVjaWFsID0gc3BlY2lhbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9zdGF0ZSA9IDMgLyogSW5UYWdOYW1lICovO1xuICAgICAgICB0aGlzLl9pbmRleC0tOyAvLyBDb25zdW1lIHRoZSB0b2tlbiBhZ2FpblxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5zdGF0ZUFmdGVyU3BlY2lhbExhc3QgPSBmdW5jdGlvbiAoYywgc2VjdGlvblN0YXJ0T2Zmc2V0KSB7XG4gICAgICAgIGlmIChjID09PSBcIj5cIiB8fCB3aGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWNpYWwgPSAxIC8qIE5vbmUgKi87XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IDYgLyogSW5DbG9zaW5nVGFnTmFtZSAqLztcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggLSBzZWN0aW9uU3RhcnRPZmZzZXQ7XG4gICAgICAgICAgICB0aGlzLl9pbmRleC0tOyAvLyBSZWNvbnN1bWUgdGhlIHRva2VuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSAxIC8qIFRleHQgKi87XG4gICAgfTtcbiAgICAvLyBGb3IgZW50aXRpZXMgdGVybWluYXRlZCB3aXRoIGEgc2VtaWNvbG9uXG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5wYXJzZUZpeGVkRW50aXR5ID0gZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICBpZiAobWFwID09PSB2b2lkIDApIHsgbWFwID0gdGhpcy54bWxNb2RlID8geG1sX2pzb25fMS5kZWZhdWx0IDogZW50aXRpZXNfanNvbl8xLmRlZmF1bHQ7IH1cbiAgICAgICAgLy8gT2Zmc2V0ID0gMVxuICAgICAgICBpZiAodGhpcy5zZWN0aW9uU3RhcnQgKyAxIDwgdGhpcy5faW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBlbnRpdHkgPSB0aGlzLmJ1ZmZlci5zdWJzdHJpbmcodGhpcy5zZWN0aW9uU3RhcnQgKyAxLCB0aGlzLl9pbmRleCk7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1hcCwgZW50aXR5KSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdFBhcnRpYWwobWFwW2VudGl0eV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gdGhpcy5faW5kZXggKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBQYXJzZXMgbGVnYWN5IGVudGl0aWVzICh3aXRob3V0IHRyYWlsaW5nIHNlbWljb2xvbilcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnBhcnNlTGVnYWN5RW50aXR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RhcnQgPSB0aGlzLnNlY3Rpb25TdGFydCArIDE7XG4gICAgICAgIC8vIFRoZSBtYXggbGVuZ3RoIG9mIGxlZ2FjeSBlbnRpdGllcyBpcyA2XG4gICAgICAgIHZhciBsaW1pdCA9IE1hdGgubWluKHRoaXMuX2luZGV4IC0gc3RhcnQsIDYpO1xuICAgICAgICB3aGlsZSAobGltaXQgPj0gMikge1xuICAgICAgICAgICAgLy8gVGhlIG1pbiBsZW5ndGggb2YgbGVnYWN5IGVudGl0aWVzIGlzIDJcbiAgICAgICAgICAgIHZhciBlbnRpdHkgPSB0aGlzLmJ1ZmZlci5zdWJzdHIoc3RhcnQsIGxpbWl0KTtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobGVnYWN5X2pzb25fMS5kZWZhdWx0LCBlbnRpdHkpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0UGFydGlhbChsZWdhY3lfanNvbl8xLmRlZmF1bHRbZW50aXR5XSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgKz0gbGltaXQgKyAxO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpbWl0LS07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVJbk5hbWVkRW50aXR5ID0gZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgaWYgKGMgPT09IFwiO1wiKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlRml4ZWRFbnRpdHkoKTtcbiAgICAgICAgICAgIC8vIFJldHJ5IGFzIGxlZ2FjeSBlbnRpdHkgaWYgZW50aXR5IHdhc24ndCBwYXJzZWRcbiAgICAgICAgICAgIGlmICh0aGlzLmJhc2VTdGF0ZSA9PT0gMSAvKiBUZXh0ICovICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgKyAxIDwgdGhpcy5faW5kZXggJiZcbiAgICAgICAgICAgICAgICAhdGhpcy54bWxNb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJzZUxlZ2FjeUVudGl0eSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLmJhc2VTdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgoYyA8IFwiMFwiIHx8IGMgPiBcIjlcIikgJiYgIWlzQVNDSUlBbHBoYShjKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMueG1sTW9kZSB8fCB0aGlzLnNlY3Rpb25TdGFydCArIDEgPT09IHRoaXMuX2luZGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gSWdub3JlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmJhc2VTdGF0ZSAhPT0gMSAvKiBUZXh0ICovKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMgIT09IFwiPVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhcnNlIGFzIGxlZ2FjeSBlbnRpdHksIHdpdGhvdXQgYWxsb3dpbmcgYWRkaXRpb25hbCBjaGFyYWN0ZXJzLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhcnNlRml4ZWRFbnRpdHkobGVnYWN5X2pzb25fMS5kZWZhdWx0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnNlTGVnYWN5RW50aXR5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuYmFzZVN0YXRlO1xuICAgICAgICAgICAgdGhpcy5faW5kZXgtLTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5kZWNvZGVOdW1lcmljRW50aXR5ID0gZnVuY3Rpb24gKG9mZnNldCwgYmFzZSwgc3RyaWN0KSB7XG4gICAgICAgIHZhciBzZWN0aW9uU3RhcnQgPSB0aGlzLnNlY3Rpb25TdGFydCArIG9mZnNldDtcbiAgICAgICAgaWYgKHNlY3Rpb25TdGFydCAhPT0gdGhpcy5faW5kZXgpIHtcbiAgICAgICAgICAgIC8vIFBhcnNlIGVudGl0eVxuICAgICAgICAgICAgdmFyIGVudGl0eSA9IHRoaXMuYnVmZmVyLnN1YnN0cmluZyhzZWN0aW9uU3RhcnQsIHRoaXMuX2luZGV4KTtcbiAgICAgICAgICAgIHZhciBwYXJzZWQgPSBwYXJzZUludChlbnRpdHksIGJhc2UpO1xuICAgICAgICAgICAgdGhpcy5lbWl0UGFydGlhbChkZWNvZGVfY29kZXBvaW50XzEuZGVmYXVsdChwYXJzZWQpKTtcbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gc3RyaWN0ID8gdGhpcy5faW5kZXggKyAxIDogdGhpcy5faW5kZXg7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLmJhc2VTdGF0ZTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuc3RhdGVJbk51bWVyaWNFbnRpdHkgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCI7XCIpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjb2RlTnVtZXJpY0VudGl0eSgyLCAxMCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA8IFwiMFwiIHx8IGMgPiBcIjlcIikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnhtbE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29kZU51bWVyaWNFbnRpdHkoMiwgMTAsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5iYXNlU3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pbmRleC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLnN0YXRlSW5IZXhFbnRpdHkgPSBmdW5jdGlvbiAoYykge1xuICAgICAgICBpZiAoYyA9PT0gXCI7XCIpIHtcbiAgICAgICAgICAgIHRoaXMuZGVjb2RlTnVtZXJpY0VudGl0eSgzLCAxNiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKGMgPCBcImFcIiB8fCBjID4gXCJmXCIpICYmXG4gICAgICAgICAgICAoYyA8IFwiQVwiIHx8IGMgPiBcIkZcIikgJiZcbiAgICAgICAgICAgIChjIDwgXCIwXCIgfHwgYyA+IFwiOVwiKSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnhtbE1vZGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29kZU51bWVyaWNFbnRpdHkoMywgMTYsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXRlID0gdGhpcy5iYXNlU3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pbmRleC0tO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmNsZWFudXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnNlY3Rpb25TdGFydCA8IDApIHtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuX2luZGV4O1xuICAgICAgICAgICAgdGhpcy5faW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlID09PSAxIC8qIFRleHQgKi8pIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zZWN0aW9uU3RhcnQgIT09IHRoaXMuX2luZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2JzLm9udGV4dCh0aGlzLmJ1ZmZlci5zdWJzdHIodGhpcy5zZWN0aW9uU3RhcnQpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXIgPSBcIlwiO1xuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyT2Zmc2V0ICs9IHRoaXMuX2luZGV4O1xuICAgICAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuc2VjdGlvblN0YXJ0ID09PSB0aGlzLl9pbmRleCkge1xuICAgICAgICAgICAgICAgIC8vIFRoZSBzZWN0aW9uIGp1c3Qgc3RhcnRlZFxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gXCJcIjtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlck9mZnNldCArPSB0aGlzLl9pbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgZXZlcnl0aGluZyB1bm5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyID0gdGhpcy5idWZmZXIuc3Vic3RyKHRoaXMuc2VjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9pbmRleCAtPSB0aGlzLnNlY3Rpb25TdGFydDtcbiAgICAgICAgICAgICAgICB0aGlzLmJ1ZmZlck9mZnNldCArPSB0aGlzLnNlY3Rpb25TdGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2VjdGlvblN0YXJ0ID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogSXRlcmF0ZXMgdGhyb3VnaCB0aGUgYnVmZmVyLCBjYWxsaW5nIHRoZSBmdW5jdGlvbiBjb3JyZXNwb25kaW5nIHRvIHRoZSBjdXJyZW50IHN0YXRlLlxuICAgICAqXG4gICAgICogU3RhdGVzIHRoYXQgYXJlIG1vcmUgbGlrZWx5IHRvIGJlIGhpdCBhcmUgaGlnaGVyIHVwLCBhcyBhIHBlcmZvcm1hbmNlIGltcHJvdmVtZW50LlxuICAgICAqL1xuICAgIFRva2VuaXplci5wcm90b3R5cGUucGFyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9pbmRleCA8IHRoaXMuYnVmZmVyLmxlbmd0aCAmJiB0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5idWZmZXIuY2hhckF0KHRoaXMuX2luZGV4KTtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gMSAvKiBUZXh0ICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZVRleHQoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMTIgLyogSW5BdHRyaWJ1dGVWYWx1ZURxICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluQXR0cmlidXRlVmFsdWVEb3VibGVRdW90ZXMoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gOSAvKiBJbkF0dHJpYnV0ZU5hbWUgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlSW5BdHRyaWJ1dGVOYW1lKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDE5IC8qIEluQ29tbWVudCAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVJbkNvbW1lbnQoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMjAgLyogSW5TcGVjaWFsQ29tbWVudCAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVJblNwZWNpYWxDb21tZW50KGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDggLyogQmVmb3JlQXR0cmlidXRlTmFtZSAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVCZWZvcmVBdHRyaWJ1dGVOYW1lKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDMgLyogSW5UYWdOYW1lICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluVGFnTmFtZShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA2IC8qIEluQ2xvc2luZ1RhZ05hbWUgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlSW5DbG9zaW5nVGFnTmFtZShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyIC8qIEJlZm9yZVRhZ05hbWUgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQmVmb3JlVGFnTmFtZShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAxMCAvKiBBZnRlckF0dHJpYnV0ZU5hbWUgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQWZ0ZXJBdHRyaWJ1dGVOYW1lKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDEzIC8qIEluQXR0cmlidXRlVmFsdWVTcSAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVJbkF0dHJpYnV0ZVZhbHVlU2luZ2xlUXVvdGVzKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDExIC8qIEJlZm9yZUF0dHJpYnV0ZVZhbHVlICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUJlZm9yZUF0dHJpYnV0ZVZhbHVlKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDUgLyogQmVmb3JlQ2xvc2luZ1RhZ05hbWUgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQmVmb3JlQ2xvc2luZ1RhZ05hbWUoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNyAvKiBBZnRlckNsb3NpbmdUYWdOYW1lICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUFmdGVyQ2xvc2luZ1RhZ05hbWUoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMzIgLyogQmVmb3JlU3BlY2lhbFMgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQmVmb3JlU3BlY2lhbFMoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMjEgLyogQWZ0ZXJDb21tZW50MSAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVBZnRlckNvbW1lbnQxKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDE0IC8qIEluQXR0cmlidXRlVmFsdWVOcSAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVJbkF0dHJpYnV0ZVZhbHVlTm9RdW90ZXMoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNCAvKiBJblNlbGZDbG9zaW5nVGFnICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluU2VsZkNsb3NpbmdUYWcoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMTYgLyogSW5EZWNsYXJhdGlvbiAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVJbkRlY2xhcmF0aW9uKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDE1IC8qIEJlZm9yZURlY2xhcmF0aW9uICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUJlZm9yZURlY2xhcmF0aW9uKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDIyIC8qIEFmdGVyQ29tbWVudDIgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQWZ0ZXJDb21tZW50MihjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAxOCAvKiBCZWZvcmVDb21tZW50ICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUJlZm9yZUNvbW1lbnQoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMzMgLyogQmVmb3JlU3BlY2lhbFNFbmQgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQmVmb3JlU3BlY2lhbFNFbmQoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNTMgLyogQmVmb3JlU3BlY2lhbFRFbmQgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUFmdGVyU3BlY2lhbFRFbmQodGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMzkgLyogQWZ0ZXJTY3JpcHQxICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVBZnRlclNjcmlwdDEodGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNDAgLyogQWZ0ZXJTY3JpcHQyICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVBZnRlclNjcmlwdDIodGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNDEgLyogQWZ0ZXJTY3JpcHQzICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVBZnRlclNjcmlwdDModGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMzQgLyogQmVmb3JlU2NyaXB0MSAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQmVmb3JlU2NyaXB0MSh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAzNSAvKiBCZWZvcmVTY3JpcHQyICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVCZWZvcmVTY3JpcHQyKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDM2IC8qIEJlZm9yZVNjcmlwdDMgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZVNjcmlwdDModGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gMzcgLyogQmVmb3JlU2NyaXB0NCAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQmVmb3JlU2NyaXB0NCh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAzOCAvKiBCZWZvcmVTY3JpcHQ1ICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUJlZm9yZVNwZWNpYWxMYXN0KGMsIDIgLyogU2NyaXB0ICovKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA0MiAvKiBBZnRlclNjcmlwdDQgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUFmdGVyU2NyaXB0NCh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA0MyAvKiBBZnRlclNjcmlwdDUgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQWZ0ZXJTcGVjaWFsTGFzdChjLCA2KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA0NCAvKiBCZWZvcmVTdHlsZTEgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZVN0eWxlMSh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyOSAvKiBJbkNkYXRhICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluQ2RhdGEoYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNDUgLyogQmVmb3JlU3R5bGUyICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVCZWZvcmVTdHlsZTIodGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNDYgLyogQmVmb3JlU3R5bGUzICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVCZWZvcmVTdHlsZTModGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNDcgLyogQmVmb3JlU3R5bGU0ICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUJlZm9yZVNwZWNpYWxMYXN0KGMsIDMgLyogU3R5bGUgKi8pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDQ4IC8qIEFmdGVyU3R5bGUxICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVBZnRlclN0eWxlMSh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA0OSAvKiBBZnRlclN0eWxlMiAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQWZ0ZXJTdHlsZTIodGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNTAgLyogQWZ0ZXJTdHlsZTMgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUFmdGVyU3R5bGUzKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDUxIC8qIEFmdGVyU3R5bGU0ICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUFmdGVyU3BlY2lhbExhc3QoYywgNSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNTIgLyogQmVmb3JlU3BlY2lhbFQgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZVNwZWNpYWxUKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDU0IC8qIEJlZm9yZVRpdGxlMSAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQmVmb3JlVGl0bGUxKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDU1IC8qIEJlZm9yZVRpdGxlMiAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQmVmb3JlVGl0bGUyKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDU2IC8qIEJlZm9yZVRpdGxlMyAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQmVmb3JlVGl0bGUzKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDU3IC8qIEJlZm9yZVRpdGxlNCAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVCZWZvcmVTcGVjaWFsTGFzdChjLCA0IC8qIFRpdGxlICovKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA1OCAvKiBBZnRlclRpdGxlMSAqLykge1xuICAgICAgICAgICAgICAgIHN0YXRlQWZ0ZXJUaXRsZTEodGhpcywgYyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLl9zdGF0ZSA9PT0gNTkgLyogQWZ0ZXJUaXRsZTIgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUFmdGVyVGl0bGUyKHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDYwIC8qIEFmdGVyVGl0bGUzICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVBZnRlclRpdGxlMyh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA2MSAvKiBBZnRlclRpdGxlNCAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVBZnRlclNwZWNpYWxMYXN0KGMsIDUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDE3IC8qIEluUHJvY2Vzc2luZ0luc3RydWN0aW9uICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluUHJvY2Vzc2luZ0luc3RydWN0aW9uKGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDY0IC8qIEluTmFtZWRFbnRpdHkgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlSW5OYW1lZEVudGl0eShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyMyAvKiBCZWZvcmVDZGF0YTEgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZUNkYXRhMSh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA2MiAvKiBCZWZvcmVFbnRpdHkgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZUVudGl0eSh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyNCAvKiBCZWZvcmVDZGF0YTIgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZUNkYXRhMih0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyNSAvKiBCZWZvcmVDZGF0YTMgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZUNkYXRhMyh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAzMCAvKiBBZnRlckNkYXRhMSAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVBZnRlckNkYXRhMShjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAzMSAvKiBBZnRlckNkYXRhMiAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVBZnRlckNkYXRhMihjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyNiAvKiBCZWZvcmVDZGF0YTQgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZUNkYXRhNCh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyNyAvKiBCZWZvcmVDZGF0YTUgKi8pIHtcbiAgICAgICAgICAgICAgICBzdGF0ZUJlZm9yZUNkYXRhNSh0aGlzLCBjKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSAyOCAvKiBCZWZvcmVDZGF0YTYgKi8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlQmVmb3JlQ2RhdGE2KGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDY2IC8qIEluSGV4RW50aXR5ICovKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZUluSGV4RW50aXR5KGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDY1IC8qIEluTnVtZXJpY0VudGl0eSAqLykge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGVJbk51bWVyaWNFbnRpdHkoYyk7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS1jb25kaXRpb25cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA2MyAvKiBCZWZvcmVOdW1lcmljRW50aXR5ICovKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVCZWZvcmVOdW1lcmljRW50aXR5KHRoaXMsIGMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYnMub25lcnJvcihFcnJvcihcInVua25vd24gX3N0YXRlXCIpLCB0aGlzLl9zdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9pbmRleCsrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2xlYW51cCgpO1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIElmIHRoZXJlIGlzIHJlbWFpbmluZyBkYXRhLCBlbWl0IGl0IGluIGEgcmVhc29uYWJsZSB3YXlcbiAgICAgICAgaWYgKHRoaXMuc2VjdGlvblN0YXJ0IDwgdGhpcy5faW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlVHJhaWxpbmdEYXRhKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jYnMub25lbmQoKTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuaGFuZGxlVHJhaWxpbmdEYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuYnVmZmVyLnN1YnN0cih0aGlzLnNlY3Rpb25TdGFydCk7XG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZSA9PT0gMjkgLyogSW5DZGF0YSAqLyB8fFxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPT09IDMwIC8qIEFmdGVyQ2RhdGExICovIHx8XG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSA9PT0gMzEgLyogQWZ0ZXJDZGF0YTIgKi8pIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9uY2RhdGEoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDE5IC8qIEluQ29tbWVudCAqLyB8fFxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgPT09IDIxIC8qIEFmdGVyQ29tbWVudDEgKi8gfHxcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlID09PSAyMiAvKiBBZnRlckNvbW1lbnQyICovKSB7XG4gICAgICAgICAgICB0aGlzLmNicy5vbmNvbW1lbnQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDY0IC8qIEluTmFtZWRFbnRpdHkgKi8gJiYgIXRoaXMueG1sTW9kZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUxlZ2FjeUVudGl0eSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VjdGlvblN0YXJ0IDwgdGhpcy5faW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0ZSA9IHRoaXMuYmFzZVN0YXRlO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVHJhaWxpbmdEYXRhKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5fc3RhdGUgPT09IDY1IC8qIEluTnVtZXJpY0VudGl0eSAqLyAmJiAhdGhpcy54bWxNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29kZU51bWVyaWNFbnRpdHkoMiwgMTAsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25TdGFydCA8IHRoaXMuX2luZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLmJhc2VTdGF0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRyYWlsaW5nRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlID09PSA2NiAvKiBJbkhleEVudGl0eSAqLyAmJiAhdGhpcy54bWxNb2RlKSB7XG4gICAgICAgICAgICB0aGlzLmRlY29kZU51bWVyaWNFbnRpdHkoMywgMTYsIGZhbHNlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlY3Rpb25TdGFydCA8IHRoaXMuX2luZGV4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdGUgPSB0aGlzLmJhc2VTdGF0ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVRyYWlsaW5nRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuX3N0YXRlICE9PSAzIC8qIEluVGFnTmFtZSAqLyAmJlxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgIT09IDggLyogQmVmb3JlQXR0cmlidXRlTmFtZSAqLyAmJlxuICAgICAgICAgICAgdGhpcy5fc3RhdGUgIT09IDExIC8qIEJlZm9yZUF0dHJpYnV0ZVZhbHVlICovICYmXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSAhPT0gMTAgLyogQWZ0ZXJBdHRyaWJ1dGVOYW1lICovICYmXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZSAhPT0gOSAvKiBJbkF0dHJpYnV0ZU5hbWUgKi8gJiZcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlICE9PSAxMyAvKiBJbkF0dHJpYnV0ZVZhbHVlU3EgKi8gJiZcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlICE9PSAxMiAvKiBJbkF0dHJpYnV0ZVZhbHVlRHEgKi8gJiZcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlICE9PSAxNCAvKiBJbkF0dHJpYnV0ZVZhbHVlTnEgKi8gJiZcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlICE9PSA2IC8qIEluQ2xvc2luZ1RhZ05hbWUgKi8pIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9udGV4dChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICAvKlxuICAgICAgICAgKiBFbHNlLCBpZ25vcmUgcmVtYWluaW5nIGRhdGFcbiAgICAgICAgICogVE9ETyBhZGQgYSB3YXkgdG8gcmVtb3ZlIGN1cnJlbnQgdGFnXG4gICAgICAgICAqL1xuICAgIH07XG4gICAgVG9rZW5pemVyLnByb3RvdHlwZS5nZXRTZWN0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5idWZmZXIuc3Vic3RyaW5nKHRoaXMuc2VjdGlvblN0YXJ0LCB0aGlzLl9pbmRleCk7XG4gICAgfTtcbiAgICBUb2tlbml6ZXIucHJvdG90eXBlLmVtaXRUb2tlbiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHRoaXMuY2JzW25hbWVdKHRoaXMuZ2V0U2VjdGlvbigpKTtcbiAgICAgICAgdGhpcy5zZWN0aW9uU3RhcnQgPSAtMTtcbiAgICB9O1xuICAgIFRva2VuaXplci5wcm90b3R5cGUuZW1pdFBhcnRpYWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuYmFzZVN0YXRlICE9PSAxIC8qIFRleHQgKi8pIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9uYXR0cmliZGF0YSh2YWx1ZSk7IC8vIFRPRE8gaW1wbGVtZW50IHRoZSBuZXcgZXZlbnRcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2JzLm9udGV4dCh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBUb2tlbml6ZXI7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gVG9rZW5pemVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fc2V0TW9kdWxlRGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19zZXRNb2R1bGVEZWZhdWx0KSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIFwiZGVmYXVsdFwiLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2IH0pO1xufSkgOiBmdW5jdGlvbihvLCB2KSB7XG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xufSk7XG52YXIgX19pbXBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydFN0YXIpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICBpZiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSByZXR1cm4gbW9kO1xuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XG4gICAgX19zZXRNb2R1bGVEZWZhdWx0KHJlc3VsdCwgbW9kKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlJzc0hhbmRsZXIgPSBleHBvcnRzLkRlZmF1bHRIYW5kbGVyID0gZXhwb3J0cy5Eb21VdGlscyA9IGV4cG9ydHMuRWxlbWVudFR5cGUgPSBleHBvcnRzLlRva2VuaXplciA9IGV4cG9ydHMuY3JlYXRlRG9tU3RyZWFtID0gZXhwb3J0cy5wYXJzZURPTSA9IGV4cG9ydHMucGFyc2VEb2N1bWVudCA9IGV4cG9ydHMuRG9tSGFuZGxlciA9IGV4cG9ydHMuUGFyc2VyID0gdm9pZCAwO1xudmFyIFBhcnNlcl8xID0gcmVxdWlyZShcIi4vUGFyc2VyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiUGFyc2VyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBQYXJzZXJfMS5QYXJzZXI7IH0gfSk7XG52YXIgZG9taGFuZGxlcl8xID0gcmVxdWlyZShcImRvbWhhbmRsZXJcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJEb21IYW5kbGVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb21oYW5kbGVyXzEuRG9tSGFuZGxlcjsgfSB9KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIkRlZmF1bHRIYW5kbGVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkb21oYW5kbGVyXzEuRG9tSGFuZGxlcjsgfSB9KTtcbi8vIEhlbHBlciBtZXRob2RzXG4vKipcbiAqIFBhcnNlcyB0aGUgZGF0YSwgcmV0dXJucyB0aGUgcmVzdWx0aW5nIGRvY3VtZW50LlxuICpcbiAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRoYXQgc2hvdWxkIGJlIHBhcnNlZC5cbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbmFsIG9wdGlvbnMgZm9yIHRoZSBwYXJzZXIgYW5kIERPTSBidWlsZGVyLlxuICovXG5mdW5jdGlvbiBwYXJzZURvY3VtZW50KGRhdGEsIG9wdGlvbnMpIHtcbiAgICB2YXIgaGFuZGxlciA9IG5ldyBkb21oYW5kbGVyXzEuRG9tSGFuZGxlcih1bmRlZmluZWQsIG9wdGlvbnMpO1xuICAgIG5ldyBQYXJzZXJfMS5QYXJzZXIoaGFuZGxlciwgb3B0aW9ucykuZW5kKGRhdGEpO1xuICAgIHJldHVybiBoYW5kbGVyLnJvb3Q7XG59XG5leHBvcnRzLnBhcnNlRG9jdW1lbnQgPSBwYXJzZURvY3VtZW50O1xuLyoqXG4gKiBQYXJzZXMgZGF0YSwgcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcm9vdCBub2Rlcy5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIHJvb3Qgbm9kZXMgc3RpbGwgaGF2ZSBhIGBEb2N1bWVudGAgbm9kZSBhcyB0aGVpciBwYXJlbnQuXG4gKiBVc2UgYHBhcnNlRG9jdW1lbnRgIHRvIGdldCB0aGUgYERvY3VtZW50YCBub2RlIGluc3RlYWQuXG4gKlxuICogQHBhcmFtIGRhdGEgVGhlIGRhdGEgdGhhdCBzaG91bGQgYmUgcGFyc2VkLlxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9uYWwgb3B0aW9ucyBmb3IgdGhlIHBhcnNlciBhbmQgRE9NIGJ1aWxkZXIuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYHBhcnNlRG9jdW1lbnRgIGluc3RlYWQuXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRE9NKGRhdGEsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gcGFyc2VEb2N1bWVudChkYXRhLCBvcHRpb25zKS5jaGlsZHJlbjtcbn1cbmV4cG9ydHMucGFyc2VET00gPSBwYXJzZURPTTtcbi8qKlxuICogQ3JlYXRlcyBhIHBhcnNlciBpbnN0YW5jZSwgd2l0aCBhbiBhdHRhY2hlZCBET00gaGFuZGxlci5cbiAqXG4gKiBAcGFyYW0gY2IgQSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIG9uY2UgcGFyc2luZyBoYXMgYmVlbiBjb21wbGV0ZWQuXG4gKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25hbCBvcHRpb25zIGZvciB0aGUgcGFyc2VyIGFuZCBET00gYnVpbGRlci5cbiAqIEBwYXJhbSBlbGVtZW50Q2IgQW4gb3B0aW9uYWwgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCBldmVyeSB0aW1lIGEgdGFnIGhhcyBiZWVuIGNvbXBsZXRlZCBpbnNpZGUgb2YgdGhlIERPTS5cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRG9tU3RyZWFtKGNiLCBvcHRpb25zLCBlbGVtZW50Q2IpIHtcbiAgICB2YXIgaGFuZGxlciA9IG5ldyBkb21oYW5kbGVyXzEuRG9tSGFuZGxlcihjYiwgb3B0aW9ucywgZWxlbWVudENiKTtcbiAgICByZXR1cm4gbmV3IFBhcnNlcl8xLlBhcnNlcihoYW5kbGVyLCBvcHRpb25zKTtcbn1cbmV4cG9ydHMuY3JlYXRlRG9tU3RyZWFtID0gY3JlYXRlRG9tU3RyZWFtO1xudmFyIFRva2VuaXplcl8xID0gcmVxdWlyZShcIi4vVG9rZW5pemVyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiVG9rZW5pemVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBfX2ltcG9ydERlZmF1bHQoVG9rZW5pemVyXzEpLmRlZmF1bHQ7IH0gfSk7XG52YXIgRWxlbWVudFR5cGUgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImRvbWVsZW1lbnR0eXBlXCIpKTtcbmV4cG9ydHMuRWxlbWVudFR5cGUgPSBFbGVtZW50VHlwZTtcbi8qXG4gKiBBbGwgb2YgdGhlIGZvbGxvd2luZyBleHBvcnRzIGV4aXN0IGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbiAqIFRoZXkgc2hvdWxkIHByb2JhYmx5IGJlIHJlbW92ZWQgZXZlbnR1YWxseS5cbiAqL1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL0ZlZWRIYW5kbGVyXCIpLCBleHBvcnRzKTtcbmV4cG9ydHMuRG9tVXRpbHMgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcImRvbXV0aWxzXCIpKTtcbnZhciBGZWVkSGFuZGxlcl8xID0gcmVxdWlyZShcIi4vRmVlZEhhbmRsZXJcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJSc3NIYW5kbGVyXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBGZWVkSGFuZGxlcl8xLkZlZWRIYW5kbGVyOyB9IH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG4vKiFcbiAqIGlzLXBsYWluLW9iamVjdCA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvaXMtcGxhaW4tb2JqZWN0PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNC0yMDE3LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG5mdW5jdGlvbiBpc09iamVjdChvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KG8pIHtcbiAgdmFyIGN0b3IscHJvdDtcblxuICBpZiAoaXNPYmplY3QobykgPT09IGZhbHNlKSByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgaGFzIG1vZGlmaWVkIGNvbnN0cnVjdG9yXG4gIGN0b3IgPSBvLmNvbnN0cnVjdG9yO1xuICBpZiAoY3RvciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZTtcblxuICAvLyBJZiBoYXMgbW9kaWZpZWQgcHJvdG90eXBlXG4gIHByb3QgPSBjdG9yLnByb3RvdHlwZTtcbiAgaWYgKGlzT2JqZWN0KHByb3QpID09PSBmYWxzZSkgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIGNvbnN0cnVjdG9yIGRvZXMgbm90IGhhdmUgYW4gT2JqZWN0LXNwZWNpZmljIG1ldGhvZFxuICBpZiAocHJvdC5oYXNPd25Qcm9wZXJ0eSgnaXNQcm90b3R5cGVPZicpID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIE1vc3QgbGlrZWx5IGEgcGxhaW4gT2JqZWN0XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnRzLmlzUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0O1xuIiwiLyoqXG4gKiBTcmNzZXQgUGFyc2VyXG4gKlxuICogQnkgQWxleCBCZWxsIHwgIE1JVCBMaWNlbnNlXG4gKlxuICogSlMgUGFyc2VyIGZvciB0aGUgc3RyaW5nIHZhbHVlIHRoYXQgYXBwZWFycyBpbiBtYXJrdXAgPGltZyBzcmNzZXQ9XCJoZXJlXCI+XG4gKlxuICogQHJldHVybnMgQXJyYXkgW3t1cmw6IF8sIGQ6IF8sIHc6IF8sIGg6X30sIC4uLl1cbiAqXG4gKiBCYXNlZCBzdXBlciBkdXBlciBjbG9zZWx5IG9uIHRoZSByZWZlcmVuY2UgYWxnb3JpdGhtIGF0OlxuICogaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvZW1iZWRkZWQtY29udGVudC5odG1sI3BhcnNlLWEtc3Jjc2V0LWF0dHJpYnV0ZVxuICpcbiAqIE1vc3QgY29tbWVudHMgYXJlIGNvcGllZCBpbiBkaXJlY3RseSBmcm9tIHRoZSBzcGVjXG4gKiAoZXhjZXB0IGZvciBjb21tZW50cyBpbiBwYXJlbnMpLlxuICovXG5cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcblx0XHQvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcblx0XHQvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcblx0XHQvLyBsaWtlIE5vZGUuXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdH0gZWxzZSB7XG5cdFx0Ly8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcblx0XHRyb290LnBhcnNlU3Jjc2V0ID0gZmFjdG9yeSgpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcblxuXHQvLyAxLiBMZXQgaW5wdXQgYmUgdGhlIHZhbHVlIHBhc3NlZCB0byB0aGlzIGFsZ29yaXRobS5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbnB1dCkge1xuXG5cdFx0Ly8gVVRJTElUWSBGVU5DVElPTlNcblxuXHRcdC8vIE1hbnVhbCBpcyBmYXN0ZXIgdGhhbiBSZWdFeFxuXHRcdC8vIGh0dHA6Ly9iam9ybi50aXBsaW5nLmNvbS9zdGF0ZS1hbmQtcmVndWxhci1leHByZXNzaW9ucy1pbi1qYXZhc2NyaXB0XG5cdFx0Ly8gaHR0cDovL2pzcGVyZi5jb20vd2hpdGVzcGFjZS1jaGFyYWN0ZXIvNVxuXHRcdGZ1bmN0aW9uIGlzU3BhY2UoYykge1xuXHRcdFx0cmV0dXJuIChjID09PSBcIlxcdTAwMjBcIiB8fCAvLyBzcGFjZVxuXHRcdFx0YyA9PT0gXCJcXHUwMDA5XCIgfHwgLy8gaG9yaXpvbnRhbCB0YWJcblx0XHRcdGMgPT09IFwiXFx1MDAwQVwiIHx8IC8vIG5ldyBsaW5lXG5cdFx0XHRjID09PSBcIlxcdTAwMENcIiB8fCAvLyBmb3JtIGZlZWRcblx0XHRcdGMgPT09IFwiXFx1MDAwRFwiKTsgIC8vIGNhcnJpYWdlIHJldHVyblxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGNvbGxlY3RDaGFyYWN0ZXJzKHJlZ0V4KSB7XG5cdFx0XHR2YXIgY2hhcnMsXG5cdFx0XHRcdG1hdGNoID0gcmVnRXguZXhlYyhpbnB1dC5zdWJzdHJpbmcocG9zKSk7XG5cdFx0XHRpZiAobWF0Y2gpIHtcblx0XHRcdFx0Y2hhcnMgPSBtYXRjaFsgMCBdO1xuXHRcdFx0XHRwb3MgKz0gY2hhcnMubGVuZ3RoO1xuXHRcdFx0XHRyZXR1cm4gY2hhcnM7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuXG5cdFx0XHQvLyAoRG9uJ3QgdXNlIFxccywgdG8gYXZvaWQgbWF0Y2hpbmcgbm9uLWJyZWFraW5nIHNwYWNlKVxuXHRcdFx0cmVnZXhMZWFkaW5nU3BhY2VzID0gL15bIFxcdFxcblxcclxcdTAwMGNdKy8sXG5cdFx0XHRyZWdleExlYWRpbmdDb21tYXNPclNwYWNlcyA9IC9eWywgXFx0XFxuXFxyXFx1MDAwY10rLyxcblx0XHRcdHJlZ2V4TGVhZGluZ05vdFNwYWNlcyA9IC9eW14gXFx0XFxuXFxyXFx1MDAwY10rLyxcblx0XHRcdHJlZ2V4VHJhaWxpbmdDb21tYXMgPSAvWyxdKyQvLFxuXHRcdFx0cmVnZXhOb25OZWdhdGl2ZUludGVnZXIgPSAvXlxcZCskLyxcblxuXHRcdFx0Ly8gKCBQb3NpdGl2ZSBvciBuZWdhdGl2ZSBvciB1bnNpZ25lZCBpbnRlZ2VycyBvciBkZWNpbWFscywgd2l0aG91dCBvciB3aXRob3V0IGV4cG9uZW50cy5cblx0XHRcdC8vIE11c3QgaW5jbHVkZSBhdCBsZWFzdCBvbmUgZGlnaXQuXG5cdFx0XHQvLyBBY2NvcmRpbmcgdG8gc3BlYyB0ZXN0cyBhbnkgZGVjaW1hbCBwb2ludCBtdXN0IGJlIGZvbGxvd2VkIGJ5IGEgZGlnaXQuXG5cdFx0XHQvLyBObyBsZWFkaW5nIHBsdXMgc2lnbiBpcyBhbGxvd2VkLilcblx0XHRcdC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZnJhc3RydWN0dXJlLmh0bWwjdmFsaWQtZmxvYXRpbmctcG9pbnQtbnVtYmVyXG5cdFx0XHRyZWdleEZsb2F0aW5nUG9pbnQgPSAvXi0/KD86WzAtOV0rfFswLTldKlxcLlswLTldKykoPzpbZUVdWystXT9bMC05XSspPyQvLFxuXG5cdFx0XHR1cmwsXG5cdFx0XHRkZXNjcmlwdG9ycyxcblx0XHRcdGN1cnJlbnREZXNjcmlwdG9yLFxuXHRcdFx0c3RhdGUsXG5cdFx0XHRjLFxuXG5cdFx0XHQvLyAyLiBMZXQgcG9zaXRpb24gYmUgYSBwb2ludGVyIGludG8gaW5wdXQsIGluaXRpYWxseSBwb2ludGluZyBhdCB0aGUgc3RhcnRcblx0XHRcdC8vICAgIG9mIHRoZSBzdHJpbmcuXG5cdFx0XHRwb3MgPSAwLFxuXG5cdFx0XHQvLyAzLiBMZXQgY2FuZGlkYXRlcyBiZSBhbiBpbml0aWFsbHkgZW1wdHkgc291cmNlIHNldC5cblx0XHRcdGNhbmRpZGF0ZXMgPSBbXTtcblxuXHRcdC8vIDQuIFNwbGl0dGluZyBsb29wOiBDb2xsZWN0IGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyB0aGF0IGFyZSBzcGFjZVxuXHRcdC8vICAgIGNoYXJhY3RlcnMgb3IgVSswMDJDIENPTU1BIGNoYXJhY3RlcnMuIElmIGFueSBVKzAwMkMgQ09NTUEgY2hhcmFjdGVyc1xuXHRcdC8vICAgIHdlcmUgY29sbGVjdGVkLCB0aGF0IGlzIGEgcGFyc2UgZXJyb3IuXG5cdFx0d2hpbGUgKHRydWUpIHtcblx0XHRcdGNvbGxlY3RDaGFyYWN0ZXJzKHJlZ2V4TGVhZGluZ0NvbW1hc09yU3BhY2VzKTtcblxuXHRcdFx0Ly8gNS4gSWYgcG9zaXRpb24gaXMgcGFzdCB0aGUgZW5kIG9mIGlucHV0LCByZXR1cm4gY2FuZGlkYXRlcyBhbmQgYWJvcnQgdGhlc2Ugc3RlcHMuXG5cdFx0XHRpZiAocG9zID49IGlucHV0TGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiBjYW5kaWRhdGVzOyAvLyAod2UncmUgZG9uZSwgdGhpcyBpcyB0aGUgc29sZSByZXR1cm4gcGF0aClcblx0XHRcdH1cblxuXHRcdFx0Ly8gNi4gQ29sbGVjdCBhIHNlcXVlbmNlIG9mIGNoYXJhY3RlcnMgdGhhdCBhcmUgbm90IHNwYWNlIGNoYXJhY3RlcnMsXG5cdFx0XHQvLyAgICBhbmQgbGV0IHRoYXQgYmUgdXJsLlxuXHRcdFx0dXJsID0gY29sbGVjdENoYXJhY3RlcnMocmVnZXhMZWFkaW5nTm90U3BhY2VzKTtcblxuXHRcdFx0Ly8gNy4gTGV0IGRlc2NyaXB0b3JzIGJlIGEgbmV3IGVtcHR5IGxpc3QuXG5cdFx0XHRkZXNjcmlwdG9ycyA9IFtdO1xuXG5cdFx0XHQvLyA4LiBJZiB1cmwgZW5kcyB3aXRoIGEgVSswMDJDIENPTU1BIGNoYXJhY3RlciAoLCksIGZvbGxvdyB0aGVzZSBzdWJzdGVwczpcblx0XHRcdC8vXHRcdCgxKS4gUmVtb3ZlIGFsbCB0cmFpbGluZyBVKzAwMkMgQ09NTUEgY2hhcmFjdGVycyBmcm9tIHVybC4gSWYgdGhpcyByZW1vdmVkXG5cdFx0XHQvLyAgICAgICAgIG1vcmUgdGhhbiBvbmUgY2hhcmFjdGVyLCB0aGF0IGlzIGEgcGFyc2UgZXJyb3IuXG5cdFx0XHRpZiAodXJsLnNsaWNlKC0xKSA9PT0gXCIsXCIpIHtcblx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UocmVnZXhUcmFpbGluZ0NvbW1hcywgXCJcIik7XG5cdFx0XHRcdC8vIChKdW1wIGFoZWFkIHRvIHN0ZXAgOSB0byBza2lwIHRva2VuaXphdGlvbiBhbmQganVzdCBwdXNoIHRoZSBjYW5kaWRhdGUpLlxuXHRcdFx0XHRwYXJzZURlc2NyaXB0b3JzKCk7XG5cblx0XHRcdFx0Ly9cdE90aGVyd2lzZSwgZm9sbG93IHRoZXNlIHN1YnN0ZXBzOlxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dG9rZW5pemUoKTtcblx0XHRcdH0gLy8gKGNsb3NlIGVsc2Ugb2Ygc3RlcCA4KVxuXG5cdFx0XHQvLyAxNi4gUmV0dXJuIHRvIHRoZSBzdGVwIGxhYmVsZWQgc3BsaXR0aW5nIGxvb3AuXG5cdFx0fSAvLyAoQ2xvc2Ugb2YgYmlnIHdoaWxlIGxvb3AuKVxuXG5cdFx0LyoqXG5cdFx0ICogVG9rZW5pemVzIGRlc2NyaXB0b3IgcHJvcGVydGllcyBwcmlvciB0byBwYXJzaW5nXG5cdFx0ICogUmV0dXJucyB1bmRlZmluZWQuXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gdG9rZW5pemUoKSB7XG5cblx0XHRcdC8vIDguMS4gRGVzY3JpcHRvciB0b2tlbmlzZXI6IFNraXAgd2hpdGVzcGFjZVxuXHRcdFx0Y29sbGVjdENoYXJhY3RlcnMocmVnZXhMZWFkaW5nU3BhY2VzKTtcblxuXHRcdFx0Ly8gOC4yLiBMZXQgY3VycmVudCBkZXNjcmlwdG9yIGJlIHRoZSBlbXB0eSBzdHJpbmcuXG5cdFx0XHRjdXJyZW50RGVzY3JpcHRvciA9IFwiXCI7XG5cblx0XHRcdC8vIDguMy4gTGV0IHN0YXRlIGJlIGluIGRlc2NyaXB0b3IuXG5cdFx0XHRzdGF0ZSA9IFwiaW4gZGVzY3JpcHRvclwiO1xuXG5cdFx0XHR3aGlsZSAodHJ1ZSkge1xuXG5cdFx0XHRcdC8vIDguNC4gTGV0IGMgYmUgdGhlIGNoYXJhY3RlciBhdCBwb3NpdGlvbi5cblx0XHRcdFx0YyA9IGlucHV0LmNoYXJBdChwb3MpO1xuXG5cdFx0XHRcdC8vICBEbyB0aGUgZm9sbG93aW5nIGRlcGVuZGluZyBvbiB0aGUgdmFsdWUgb2Ygc3RhdGUuXG5cdFx0XHRcdC8vICBGb3IgdGhlIHB1cnBvc2Ugb2YgdGhpcyBzdGVwLCBcIkVPRlwiIGlzIGEgc3BlY2lhbCBjaGFyYWN0ZXIgcmVwcmVzZW50aW5nXG5cdFx0XHRcdC8vICB0aGF0IHBvc2l0aW9uIGlzIHBhc3QgdGhlIGVuZCBvZiBpbnB1dC5cblxuXHRcdFx0XHQvLyBJbiBkZXNjcmlwdG9yXG5cdFx0XHRcdGlmIChzdGF0ZSA9PT0gXCJpbiBkZXNjcmlwdG9yXCIpIHtcblx0XHRcdFx0XHQvLyBEbyB0aGUgZm9sbG93aW5nLCBkZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGM6XG5cblx0XHRcdFx0XHQvLyBTcGFjZSBjaGFyYWN0ZXJcblx0XHRcdFx0XHQvLyBJZiBjdXJyZW50IGRlc2NyaXB0b3IgaXMgbm90IGVtcHR5LCBhcHBlbmQgY3VycmVudCBkZXNjcmlwdG9yIHRvXG5cdFx0XHRcdFx0Ly8gZGVzY3JpcHRvcnMgYW5kIGxldCBjdXJyZW50IGRlc2NyaXB0b3IgYmUgdGhlIGVtcHR5IHN0cmluZy5cblx0XHRcdFx0XHQvLyBTZXQgc3RhdGUgdG8gYWZ0ZXIgZGVzY3JpcHRvci5cblx0XHRcdFx0XHRpZiAoaXNTcGFjZShjKSkge1xuXHRcdFx0XHRcdFx0aWYgKGN1cnJlbnREZXNjcmlwdG9yKSB7XG5cdFx0XHRcdFx0XHRcdGRlc2NyaXB0b3JzLnB1c2goY3VycmVudERlc2NyaXB0b3IpO1xuXHRcdFx0XHRcdFx0XHRjdXJyZW50RGVzY3JpcHRvciA9IFwiXCI7XG5cdFx0XHRcdFx0XHRcdHN0YXRlID0gXCJhZnRlciBkZXNjcmlwdG9yXCI7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdC8vIFUrMDAyQyBDT01NQSAoLClcblx0XHRcdFx0XHRcdC8vIEFkdmFuY2UgcG9zaXRpb24gdG8gdGhlIG5leHQgY2hhcmFjdGVyIGluIGlucHV0LiBJZiBjdXJyZW50IGRlc2NyaXB0b3Jcblx0XHRcdFx0XHRcdC8vIGlzIG5vdCBlbXB0eSwgYXBwZW5kIGN1cnJlbnQgZGVzY3JpcHRvciB0byBkZXNjcmlwdG9ycy4gSnVtcCB0byB0aGUgc3RlcFxuXHRcdFx0XHRcdFx0Ly8gbGFiZWxlZCBkZXNjcmlwdG9yIHBhcnNlci5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGMgPT09IFwiLFwiKSB7XG5cdFx0XHRcdFx0XHRwb3MgKz0gMTtcblx0XHRcdFx0XHRcdGlmIChjdXJyZW50RGVzY3JpcHRvcikge1xuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKGN1cnJlbnREZXNjcmlwdG9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHBhcnNlRGVzY3JpcHRvcnMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRcdFx0Ly8gVSswMDI4IExFRlQgUEFSRU5USEVTSVMgKCgpXG5cdFx0XHRcdFx0XHQvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuIFNldCBzdGF0ZSB0byBpbiBwYXJlbnMuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjID09PSBcIlxcdTAwMjhcIikge1xuXHRcdFx0XHRcdFx0Y3VycmVudERlc2NyaXB0b3IgPSBjdXJyZW50RGVzY3JpcHRvciArIGM7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFwiaW4gcGFyZW5zXCI7XG5cblx0XHRcdFx0XHRcdC8vIEVPRlxuXHRcdFx0XHRcdFx0Ly8gSWYgY3VycmVudCBkZXNjcmlwdG9yIGlzIG5vdCBlbXB0eSwgYXBwZW5kIGN1cnJlbnQgZGVzY3JpcHRvciB0b1xuXHRcdFx0XHRcdFx0Ly8gZGVzY3JpcHRvcnMuIEp1bXAgdG8gdGhlIHN0ZXAgbGFiZWxlZCBkZXNjcmlwdG9yIHBhcnNlci5cblx0XHRcdFx0XHR9IGVsc2UgaWYgKGMgPT09IFwiXCIpIHtcblx0XHRcdFx0XHRcdGlmIChjdXJyZW50RGVzY3JpcHRvcikge1xuXHRcdFx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKGN1cnJlbnREZXNjcmlwdG9yKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHBhcnNlRGVzY3JpcHRvcnMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZVxuXHRcdFx0XHRcdFx0Ly8gQXBwZW5kIGMgdG8gY3VycmVudCBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly8gKGVuZCBcImluIGRlc2NyaXB0b3JcIlxuXG5cdFx0XHRcdFx0Ly8gSW4gcGFyZW5zXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiaW4gcGFyZW5zXCIpIHtcblxuXHRcdFx0XHRcdC8vIFUrMDAyOSBSSUdIVCBQQVJFTlRIRVNJUyAoKSlcblx0XHRcdFx0XHQvLyBBcHBlbmQgYyB0byBjdXJyZW50IGRlc2NyaXB0b3IuIFNldCBzdGF0ZSB0byBpbiBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdGlmIChjID09PSBcIilcIikge1xuXHRcdFx0XHRcdFx0Y3VycmVudERlc2NyaXB0b3IgPSBjdXJyZW50RGVzY3JpcHRvciArIGM7XG5cdFx0XHRcdFx0XHRzdGF0ZSA9IFwiaW4gZGVzY3JpcHRvclwiO1xuXG5cdFx0XHRcdFx0XHQvLyBFT0Zcblx0XHRcdFx0XHRcdC8vIEFwcGVuZCBjdXJyZW50IGRlc2NyaXB0b3IgdG8gZGVzY3JpcHRvcnMuIEp1bXAgdG8gdGhlIHN0ZXAgbGFiZWxlZFxuXHRcdFx0XHRcdFx0Ly8gZGVzY3JpcHRvciBwYXJzZXIuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRkZXNjcmlwdG9ycy5wdXNoKGN1cnJlbnREZXNjcmlwdG9yKTtcblx0XHRcdFx0XHRcdHBhcnNlRGVzY3JpcHRvcnMoKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblxuXHRcdFx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZVxuXHRcdFx0XHRcdFx0Ly8gQXBwZW5kIGMgdG8gY3VycmVudCBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50RGVzY3JpcHRvciA9IGN1cnJlbnREZXNjcmlwdG9yICsgYztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBBZnRlciBkZXNjcmlwdG9yXG5cdFx0XHRcdH0gZWxzZSBpZiAoc3RhdGUgPT09IFwiYWZ0ZXIgZGVzY3JpcHRvclwiKSB7XG5cblx0XHRcdFx0XHQvLyBEbyB0aGUgZm9sbG93aW5nLCBkZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGM6XG5cdFx0XHRcdFx0Ly8gU3BhY2UgY2hhcmFjdGVyOiBTdGF5IGluIHRoaXMgc3RhdGUuXG5cdFx0XHRcdFx0aWYgKGlzU3BhY2UoYykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRU9GOiBKdW1wIHRvIHRoZSBzdGVwIGxhYmVsZWQgZGVzY3JpcHRvciBwYXJzZXIuXG5cdFx0XHRcdFx0fSBlbHNlIGlmIChjID09PSBcIlwiKSB7XG5cdFx0XHRcdFx0XHRwYXJzZURlc2NyaXB0b3JzKCk7XG5cdFx0XHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdFx0XHRcdC8vIEFueXRoaW5nIGVsc2Vcblx0XHRcdFx0XHRcdC8vIFNldCBzdGF0ZSB0byBpbiBkZXNjcmlwdG9yLiBTZXQgcG9zaXRpb24gdG8gdGhlIHByZXZpb3VzIGNoYXJhY3RlciBpbiBpbnB1dC5cblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0c3RhdGUgPSBcImluIGRlc2NyaXB0b3JcIjtcblx0XHRcdFx0XHRcdHBvcyAtPSAxO1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gQWR2YW5jZSBwb3NpdGlvbiB0byB0aGUgbmV4dCBjaGFyYWN0ZXIgaW4gaW5wdXQuXG5cdFx0XHRcdHBvcyArPSAxO1xuXG5cdFx0XHRcdC8vIFJlcGVhdCB0aGlzIHN0ZXAuXG5cdFx0XHR9IC8vIChjbG9zZSB3aGlsZSB0cnVlIGxvb3ApXG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQWRkcyBkZXNjcmlwdG9yIHByb3BlcnRpZXMgdG8gYSBjYW5kaWRhdGUsIHB1c2hlcyB0byB0aGUgY2FuZGlkYXRlcyBhcnJheVxuXHRcdCAqIEByZXR1cm4gdW5kZWZpbmVkXG5cdFx0ICovXG5cdFx0Ly8gRGVjbGFyZWQgb3V0c2lkZSBvZiB0aGUgd2hpbGUgbG9vcCBzbyB0aGF0IGl0J3Mgb25seSBjcmVhdGVkIG9uY2UuXG5cdFx0ZnVuY3Rpb24gcGFyc2VEZXNjcmlwdG9ycygpIHtcblxuXHRcdFx0Ly8gOS4gRGVzY3JpcHRvciBwYXJzZXI6IExldCBlcnJvciBiZSBuby5cblx0XHRcdHZhciBwRXJyb3IgPSBmYWxzZSxcblxuXHRcdFx0XHQvLyAxMC4gTGV0IHdpZHRoIGJlIGFic2VudC5cblx0XHRcdFx0Ly8gMTEuIExldCBkZW5zaXR5IGJlIGFic2VudC5cblx0XHRcdFx0Ly8gMTIuIExldCBmdXR1cmUtY29tcGF0LWggYmUgYWJzZW50LiAoV2UncmUgaW1wbGVtZW50aW5nIGl0IG5vdyBhcyBoKVxuXHRcdFx0XHR3LCBkLCBoLCBpLFxuXHRcdFx0XHRjYW5kaWRhdGUgPSB7fSxcblx0XHRcdFx0ZGVzYywgbGFzdENoYXIsIHZhbHVlLCBpbnRWYWwsIGZsb2F0VmFsO1xuXG5cdFx0XHQvLyAxMy4gRm9yIGVhY2ggZGVzY3JpcHRvciBpbiBkZXNjcmlwdG9ycywgcnVuIHRoZSBhcHByb3ByaWF0ZSBzZXQgb2Ygc3RlcHNcblx0XHRcdC8vIGZyb20gdGhlIGZvbGxvd2luZyBsaXN0OlxuXHRcdFx0Zm9yIChpID0gMCA7IGkgPCBkZXNjcmlwdG9ycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRkZXNjID0gZGVzY3JpcHRvcnNbIGkgXTtcblxuXHRcdFx0XHRsYXN0Q2hhciA9IGRlc2NbIGRlc2MubGVuZ3RoIC0gMSBdO1xuXHRcdFx0XHR2YWx1ZSA9IGRlc2Muc3Vic3RyaW5nKDAsIGRlc2MubGVuZ3RoIC0gMSk7XG5cdFx0XHRcdGludFZhbCA9IHBhcnNlSW50KHZhbHVlLCAxMCk7XG5cdFx0XHRcdGZsb2F0VmFsID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGRlc2NyaXB0b3IgY29uc2lzdHMgb2YgYSB2YWxpZCBub24tbmVnYXRpdmUgaW50ZWdlciBmb2xsb3dlZCBieVxuXHRcdFx0XHQvLyBhIFUrMDA3NyBMQVRJTiBTTUFMTCBMRVRURVIgVyBjaGFyYWN0ZXJcblx0XHRcdFx0aWYgKHJlZ2V4Tm9uTmVnYXRpdmVJbnRlZ2VyLnRlc3QodmFsdWUpICYmIChsYXN0Q2hhciA9PT0gXCJ3XCIpKSB7XG5cblx0XHRcdFx0XHQvLyBJZiB3aWR0aCBhbmQgZGVuc2l0eSBhcmUgbm90IGJvdGggYWJzZW50LCB0aGVuIGxldCBlcnJvciBiZSB5ZXMuXG5cdFx0XHRcdFx0aWYgKHcgfHwgZCkge3BFcnJvciA9IHRydWU7fVxuXG5cdFx0XHRcdFx0Ly8gQXBwbHkgdGhlIHJ1bGVzIGZvciBwYXJzaW5nIG5vbi1uZWdhdGl2ZSBpbnRlZ2VycyB0byB0aGUgZGVzY3JpcHRvci5cblx0XHRcdFx0XHQvLyBJZiB0aGUgcmVzdWx0IGlzIHplcm8sIGxldCBlcnJvciBiZSB5ZXMuXG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlLCBsZXQgd2lkdGggYmUgdGhlIHJlc3VsdC5cblx0XHRcdFx0XHRpZiAoaW50VmFsID09PSAwKSB7cEVycm9yID0gdHJ1ZTt9IGVsc2Uge3cgPSBpbnRWYWw7fVxuXG5cdFx0XHRcdFx0Ly8gSWYgdGhlIGRlc2NyaXB0b3IgY29uc2lzdHMgb2YgYSB2YWxpZCBmbG9hdGluZy1wb2ludCBudW1iZXIgZm9sbG93ZWQgYnlcblx0XHRcdFx0XHQvLyBhIFUrMDA3OCBMQVRJTiBTTUFMTCBMRVRURVIgWCBjaGFyYWN0ZXJcblx0XHRcdFx0fSBlbHNlIGlmIChyZWdleEZsb2F0aW5nUG9pbnQudGVzdCh2YWx1ZSkgJiYgKGxhc3RDaGFyID09PSBcInhcIikpIHtcblxuXHRcdFx0XHRcdC8vIElmIHdpZHRoLCBkZW5zaXR5IGFuZCBmdXR1cmUtY29tcGF0LWggYXJlIG5vdCBhbGwgYWJzZW50LCB0aGVuIGxldCBlcnJvclxuXHRcdFx0XHRcdC8vIGJlIHllcy5cblx0XHRcdFx0XHRpZiAodyB8fCBkIHx8IGgpIHtwRXJyb3IgPSB0cnVlO31cblxuXHRcdFx0XHRcdC8vIEFwcGx5IHRoZSBydWxlcyBmb3IgcGFyc2luZyBmbG9hdGluZy1wb2ludCBudW1iZXIgdmFsdWVzIHRvIHRoZSBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdC8vIElmIHRoZSByZXN1bHQgaXMgbGVzcyB0aGFuIHplcm8sIGxldCBlcnJvciBiZSB5ZXMuIE90aGVyd2lzZSwgbGV0IGRlbnNpdHlcblx0XHRcdFx0XHQvLyBiZSB0aGUgcmVzdWx0LlxuXHRcdFx0XHRcdGlmIChmbG9hdFZhbCA8IDApIHtwRXJyb3IgPSB0cnVlO30gZWxzZSB7ZCA9IGZsb2F0VmFsO31cblxuXHRcdFx0XHRcdC8vIElmIHRoZSBkZXNjcmlwdG9yIGNvbnNpc3RzIG9mIGEgdmFsaWQgbm9uLW5lZ2F0aXZlIGludGVnZXIgZm9sbG93ZWQgYnlcblx0XHRcdFx0XHQvLyBhIFUrMDA2OCBMQVRJTiBTTUFMTCBMRVRURVIgSCBjaGFyYWN0ZXJcblx0XHRcdFx0fSBlbHNlIGlmIChyZWdleE5vbk5lZ2F0aXZlSW50ZWdlci50ZXN0KHZhbHVlKSAmJiAobGFzdENoYXIgPT09IFwiaFwiKSkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgaGVpZ2h0IGFuZCBkZW5zaXR5IGFyZSBub3QgYm90aCBhYnNlbnQsIHRoZW4gbGV0IGVycm9yIGJlIHllcy5cblx0XHRcdFx0XHRpZiAoaCB8fCBkKSB7cEVycm9yID0gdHJ1ZTt9XG5cblx0XHRcdFx0XHQvLyBBcHBseSB0aGUgcnVsZXMgZm9yIHBhcnNpbmcgbm9uLW5lZ2F0aXZlIGludGVnZXJzIHRvIHRoZSBkZXNjcmlwdG9yLlxuXHRcdFx0XHRcdC8vIElmIHRoZSByZXN1bHQgaXMgemVybywgbGV0IGVycm9yIGJlIHllcy4gT3RoZXJ3aXNlLCBsZXQgZnV0dXJlLWNvbXBhdC1oXG5cdFx0XHRcdFx0Ly8gYmUgdGhlIHJlc3VsdC5cblx0XHRcdFx0XHRpZiAoaW50VmFsID09PSAwKSB7cEVycm9yID0gdHJ1ZTt9IGVsc2Uge2ggPSBpbnRWYWw7fVxuXG5cdFx0XHRcdFx0Ly8gQW55dGhpbmcgZWxzZSwgTGV0IGVycm9yIGJlIHllcy5cblx0XHRcdFx0fSBlbHNlIHtwRXJyb3IgPSB0cnVlO31cblx0XHRcdH0gLy8gKGNsb3NlIHN0ZXAgMTMgZm9yIGxvb3ApXG5cblx0XHRcdC8vIDE1LiBJZiBlcnJvciBpcyBzdGlsbCBubywgdGhlbiBhcHBlbmQgYSBuZXcgaW1hZ2Ugc291cmNlIHRvIGNhbmRpZGF0ZXMgd2hvc2Vcblx0XHRcdC8vIFVSTCBpcyB1cmwsIGFzc29jaWF0ZWQgd2l0aCBhIHdpZHRoIHdpZHRoIGlmIG5vdCBhYnNlbnQgYW5kIGEgcGl4ZWxcblx0XHRcdC8vIGRlbnNpdHkgZGVuc2l0eSBpZiBub3QgYWJzZW50LiBPdGhlcndpc2UsIHRoZXJlIGlzIGEgcGFyc2UgZXJyb3IuXG5cdFx0XHRpZiAoIXBFcnJvcikge1xuXHRcdFx0XHRjYW5kaWRhdGUudXJsID0gdXJsO1xuXHRcdFx0XHRpZiAodykgeyBjYW5kaWRhdGUudyA9IHc7fVxuXHRcdFx0XHRpZiAoZCkgeyBjYW5kaWRhdGUuZCA9IGQ7fVxuXHRcdFx0XHRpZiAoaCkgeyBjYW5kaWRhdGUuaCA9IGg7fVxuXHRcdFx0XHRjYW5kaWRhdGVzLnB1c2goY2FuZGlkYXRlKTtcblx0XHRcdH0gZWxzZSBpZiAoY29uc29sZSAmJiBjb25zb2xlLmxvZykge1xuXHRcdFx0XHRjb25zb2xlLmxvZyhcIkludmFsaWQgc3Jjc2V0IGRlc2NyaXB0b3IgZm91bmQgaW4gJ1wiICtcblx0XHRcdFx0XHRpbnB1dCArIFwiJyBhdCAnXCIgKyBkZXNjICsgXCInLlwiKTtcblx0XHRcdH1cblx0XHR9IC8vIChjbG9zZSBwYXJzZURlc2NyaXB0b3JzIGZuKVxuXG5cdH1cbn0pKTtcbiIsInZhciB4PVN0cmluZztcbnZhciBjcmVhdGU9ZnVuY3Rpb24oKSB7cmV0dXJuIHtpc0NvbG9yU3VwcG9ydGVkOmZhbHNlLHJlc2V0OngsYm9sZDp4LGRpbTp4LGl0YWxpYzp4LHVuZGVybGluZTp4LGludmVyc2U6eCxoaWRkZW46eCxzdHJpa2V0aHJvdWdoOngsYmxhY2s6eCxyZWQ6eCxncmVlbjp4LHllbGxvdzp4LGJsdWU6eCxtYWdlbnRhOngsY3lhbjp4LHdoaXRlOngsZ3JheTp4LGJnQmxhY2s6eCxiZ1JlZDp4LGJnR3JlZW46eCxiZ1llbGxvdzp4LGJnQmx1ZTp4LGJnTWFnZW50YTp4LGJnQ3lhbjp4LGJnV2hpdGU6eH19O1xubW9kdWxlLmV4cG9ydHM9Y3JlYXRlKCk7XG5tb2R1bGUuZXhwb3J0cy5jcmVhdGVDb2xvcnMgPSBjcmVhdGU7XG4iLCIndXNlIHN0cmljdCdcblxubGV0IENvbnRhaW5lciA9IHJlcXVpcmUoJy4vY29udGFpbmVyJylcblxuY2xhc3MgQXRSdWxlIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgY29uc3RydWN0b3IoZGVmYXVsdHMpIHtcbiAgICBzdXBlcihkZWZhdWx0cylcbiAgICB0aGlzLnR5cGUgPSAnYXRydWxlJ1xuICB9XG5cbiAgYXBwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKCF0aGlzLnByb3h5T2Yubm9kZXMpIHRoaXMubm9kZXMgPSBbXVxuICAgIHJldHVybiBzdXBlci5hcHBlbmQoLi4uY2hpbGRyZW4pXG4gIH1cblxuICBwcmVwZW5kKC4uLmNoaWxkcmVuKSB7XG4gICAgaWYgKCF0aGlzLnByb3h5T2Yubm9kZXMpIHRoaXMubm9kZXMgPSBbXVxuICAgIHJldHVybiBzdXBlci5wcmVwZW5kKC4uLmNoaWxkcmVuKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQXRSdWxlXG5BdFJ1bGUuZGVmYXVsdCA9IEF0UnVsZVxuXG5Db250YWluZXIucmVnaXN0ZXJBdFJ1bGUoQXRSdWxlKVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJylcblxuY2xhc3MgQ29tbWVudCBleHRlbmRzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0cykge1xuICAgIHN1cGVyKGRlZmF1bHRzKVxuICAgIHRoaXMudHlwZSA9ICdjb21tZW50J1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tbWVudFxuQ29tbWVudC5kZWZhdWx0ID0gQ29tbWVudFxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCB7IGlzQ2xlYW4sIG15IH0gPSByZXF1aXJlKCcuL3N5bWJvbHMnKVxubGV0IERlY2xhcmF0aW9uID0gcmVxdWlyZSgnLi9kZWNsYXJhdGlvbicpXG5sZXQgQ29tbWVudCA9IHJlcXVpcmUoJy4vY29tbWVudCcpXG5sZXQgTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpXG5cbmxldCBwYXJzZSwgUnVsZSwgQXRSdWxlXG5cbmZ1bmN0aW9uIGNsZWFuU291cmNlKG5vZGVzKSB7XG4gIHJldHVybiBub2Rlcy5tYXAoaSA9PiB7XG4gICAgaWYgKGkubm9kZXMpIGkubm9kZXMgPSBjbGVhblNvdXJjZShpLm5vZGVzKVxuICAgIGRlbGV0ZSBpLnNvdXJjZVxuICAgIHJldHVybiBpXG4gIH0pXG59XG5cbmZ1bmN0aW9uIG1hcmtEaXJ0eVVwKG5vZGUpIHtcbiAgbm9kZVtpc0NsZWFuXSA9IGZhbHNlXG4gIGlmIChub2RlLnByb3h5T2Yubm9kZXMpIHtcbiAgICBmb3IgKGxldCBpIG9mIG5vZGUucHJveHlPZi5ub2Rlcykge1xuICAgICAgbWFya0RpcnR5VXAoaSlcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgQ29udGFpbmVyIGV4dGVuZHMgTm9kZSB7XG4gIHB1c2goY2hpbGQpIHtcbiAgICBjaGlsZC5wYXJlbnQgPSB0aGlzXG4gICAgdGhpcy5wcm94eU9mLm5vZGVzLnB1c2goY2hpbGQpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGVhY2goY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMucHJveHlPZi5ub2RlcykgcmV0dXJuIHVuZGVmaW5lZFxuICAgIGxldCBpdGVyYXRvciA9IHRoaXMuZ2V0SXRlcmF0b3IoKVxuXG4gICAgbGV0IGluZGV4LCByZXN1bHRcbiAgICB3aGlsZSAodGhpcy5pbmRleGVzW2l0ZXJhdG9yXSA8IHRoaXMucHJveHlPZi5ub2Rlcy5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gdGhpcy5pbmRleGVzW2l0ZXJhdG9yXVxuICAgICAgcmVzdWx0ID0gY2FsbGJhY2sodGhpcy5wcm94eU9mLm5vZGVzW2luZGV4XSwgaW5kZXgpXG4gICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkgYnJlYWtcblxuICAgICAgdGhpcy5pbmRleGVzW2l0ZXJhdG9yXSArPSAxXG4gICAgfVxuXG4gICAgZGVsZXRlIHRoaXMuaW5kZXhlc1tpdGVyYXRvcl1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICB3YWxrKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaCgoY2hpbGQsIGkpID0+IHtcbiAgICAgIGxldCByZXN1bHRcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrKGNoaWxkLCBpKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyBjaGlsZC5hZGRUb0Vycm9yKGUpXG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0ICE9PSBmYWxzZSAmJiBjaGlsZC53YWxrKSB7XG4gICAgICAgIHJlc3VsdCA9IGNoaWxkLndhbGsoY2FsbGJhY2spXG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHRcbiAgICB9KVxuICB9XG5cbiAgd2Fsa0RlY2xzKHByb3AsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sgPSBwcm9wXG4gICAgICByZXR1cm4gdGhpcy53YWxrKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2RlY2wnKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAocHJvcCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuIHRoaXMud2FsaygoY2hpbGQsIGkpID0+IHtcbiAgICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdkZWNsJyAmJiBwcm9wLnRlc3QoY2hpbGQucHJvcCkpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLndhbGsoKGNoaWxkLCBpKSA9PiB7XG4gICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2RlY2wnICYmIGNoaWxkLnByb3AgPT09IHByb3ApIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB3YWxrUnVsZXMoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sgPSBzZWxlY3RvclxuXG4gICAgICByZXR1cm4gdGhpcy53YWxrKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ3J1bGUnKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIHJldHVybiB0aGlzLndhbGsoKGNoaWxkLCBpKSA9PiB7XG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSAncnVsZScgJiYgc2VsZWN0b3IudGVzdChjaGlsZC5zZWxlY3RvcikpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLndhbGsoKGNoaWxkLCBpKSA9PiB7XG4gICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ3J1bGUnICYmIGNoaWxkLnNlbGVjdG9yID09PSBzZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHdhbGtBdFJ1bGVzKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2sgPSBuYW1lXG4gICAgICByZXR1cm4gdGhpcy53YWxrKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIGlmIChuYW1lIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICByZXR1cm4gdGhpcy53YWxrKChjaGlsZCwgaSkgPT4ge1xuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gJ2F0cnVsZScgJiYgbmFtZS50ZXN0KGNoaWxkLm5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy53YWxrKChjaGlsZCwgaSkgPT4ge1xuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdhdHJ1bGUnICYmIGNoaWxkLm5hbWUgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNoaWxkLCBpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB3YWxrQ29tbWVudHMoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy53YWxrKChjaGlsZCwgaSkgPT4ge1xuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdjb21tZW50Jykge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soY2hpbGQsIGkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFwcGVuZCguLi5jaGlsZHJlbikge1xuICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XG4gICAgICBsZXQgbm9kZXMgPSB0aGlzLm5vcm1hbGl6ZShjaGlsZCwgdGhpcy5sYXN0KVxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2RlcykgdGhpcy5wcm94eU9mLm5vZGVzLnB1c2gobm9kZSlcbiAgICB9XG5cbiAgICB0aGlzLm1hcmtEaXJ0eSgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHJlcGVuZCguLi5jaGlsZHJlbikge1xuICAgIGNoaWxkcmVuID0gY2hpbGRyZW4ucmV2ZXJzZSgpXG4gICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgIGxldCBub2RlcyA9IHRoaXMubm9ybWFsaXplKGNoaWxkLCB0aGlzLmZpcnN0LCAncHJlcGVuZCcpLnJldmVyc2UoKVxuICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2RlcykgdGhpcy5wcm94eU9mLm5vZGVzLnVuc2hpZnQobm9kZSlcbiAgICAgIGZvciAobGV0IGlkIGluIHRoaXMuaW5kZXhlcykge1xuICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gdGhpcy5pbmRleGVzW2lkXSArIG5vZGVzLmxlbmd0aFxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWFya0RpcnR5KClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBjbGVhblJhd3Moa2VlcEJldHdlZW4pIHtcbiAgICBzdXBlci5jbGVhblJhd3Moa2VlcEJldHdlZW4pXG4gICAgaWYgKHRoaXMubm9kZXMpIHtcbiAgICAgIGZvciAobGV0IG5vZGUgb2YgdGhpcy5ub2Rlcykgbm9kZS5jbGVhblJhd3Moa2VlcEJldHdlZW4pXG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0QmVmb3JlKGV4aXN0LCBhZGQpIHtcbiAgICBleGlzdCA9IHRoaXMuaW5kZXgoZXhpc3QpXG5cbiAgICBsZXQgdHlwZSA9IGV4aXN0ID09PSAwID8gJ3ByZXBlbmQnIDogZmFsc2VcbiAgICBsZXQgbm9kZXMgPSB0aGlzLm5vcm1hbGl6ZShhZGQsIHRoaXMucHJveHlPZi5ub2Rlc1tleGlzdF0sIHR5cGUpLnJldmVyc2UoKVxuICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHRoaXMucHJveHlPZi5ub2Rlcy5zcGxpY2UoZXhpc3QsIDAsIG5vZGUpXG5cbiAgICBsZXQgaW5kZXhcbiAgICBmb3IgKGxldCBpZCBpbiB0aGlzLmluZGV4ZXMpIHtcbiAgICAgIGluZGV4ID0gdGhpcy5pbmRleGVzW2lkXVxuICAgICAgaWYgKGV4aXN0IDw9IGluZGV4KSB7XG4gICAgICAgIHRoaXMuaW5kZXhlc1tpZF0gPSBpbmRleCArIG5vZGVzLmxlbmd0aFxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMubWFya0RpcnR5KClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBpbnNlcnRBZnRlcihleGlzdCwgYWRkKSB7XG4gICAgZXhpc3QgPSB0aGlzLmluZGV4KGV4aXN0KVxuXG4gICAgbGV0IG5vZGVzID0gdGhpcy5ub3JtYWxpemUoYWRkLCB0aGlzLnByb3h5T2Yubm9kZXNbZXhpc3RdKS5yZXZlcnNlKClcbiAgICBmb3IgKGxldCBub2RlIG9mIG5vZGVzKSB0aGlzLnByb3h5T2Yubm9kZXMuc3BsaWNlKGV4aXN0ICsgMSwgMCwgbm9kZSlcblxuICAgIGxldCBpbmRleFxuICAgIGZvciAobGV0IGlkIGluIHRoaXMuaW5kZXhlcykge1xuICAgICAgaW5kZXggPSB0aGlzLmluZGV4ZXNbaWRdXG4gICAgICBpZiAoZXhpc3QgPCBpbmRleCkge1xuICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gaW5kZXggKyBub2Rlcy5sZW5ndGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1hcmtEaXJ0eSgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcmVtb3ZlQ2hpbGQoY2hpbGQpIHtcbiAgICBjaGlsZCA9IHRoaXMuaW5kZXgoY2hpbGQpXG4gICAgdGhpcy5wcm94eU9mLm5vZGVzW2NoaWxkXS5wYXJlbnQgPSB1bmRlZmluZWRcbiAgICB0aGlzLnByb3h5T2Yubm9kZXMuc3BsaWNlKGNoaWxkLCAxKVxuXG4gICAgbGV0IGluZGV4XG4gICAgZm9yIChsZXQgaWQgaW4gdGhpcy5pbmRleGVzKSB7XG4gICAgICBpbmRleCA9IHRoaXMuaW5kZXhlc1tpZF1cbiAgICAgIGlmIChpbmRleCA+PSBjaGlsZCkge1xuICAgICAgICB0aGlzLmluZGV4ZXNbaWRdID0gaW5kZXggLSAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tYXJrRGlydHkoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJlbW92ZUFsbCgpIHtcbiAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMucHJveHlPZi5ub2Rlcykgbm9kZS5wYXJlbnQgPSB1bmRlZmluZWRcbiAgICB0aGlzLnByb3h5T2Yubm9kZXMgPSBbXVxuXG4gICAgdGhpcy5tYXJrRGlydHkoKVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJlcGxhY2VWYWx1ZXMocGF0dGVybiwgb3B0cywgY2FsbGJhY2spIHtcbiAgICBpZiAoIWNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdHNcbiAgICAgIG9wdHMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMud2Fsa0RlY2xzKGRlY2wgPT4ge1xuICAgICAgaWYgKG9wdHMucHJvcHMgJiYgIW9wdHMucHJvcHMuaW5jbHVkZXMoZGVjbC5wcm9wKSkgcmV0dXJuXG4gICAgICBpZiAob3B0cy5mYXN0ICYmICFkZWNsLnZhbHVlLmluY2x1ZGVzKG9wdHMuZmFzdCkpIHJldHVyblxuXG4gICAgICBkZWNsLnZhbHVlID0gZGVjbC52YWx1ZS5yZXBsYWNlKHBhdHRlcm4sIGNhbGxiYWNrKVxuICAgIH0pXG5cbiAgICB0aGlzLm1hcmtEaXJ0eSgpXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgZXZlcnkoY29uZGl0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMubm9kZXMuZXZlcnkoY29uZGl0aW9uKVxuICB9XG5cbiAgc29tZShjb25kaXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5ub2Rlcy5zb21lKGNvbmRpdGlvbilcbiAgfVxuXG4gIGluZGV4KGNoaWxkKSB7XG4gICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ251bWJlcicpIHJldHVybiBjaGlsZFxuICAgIGlmIChjaGlsZC5wcm94eU9mKSBjaGlsZCA9IGNoaWxkLnByb3h5T2ZcbiAgICByZXR1cm4gdGhpcy5wcm94eU9mLm5vZGVzLmluZGV4T2YoY2hpbGQpXG4gIH1cblxuICBnZXQgZmlyc3QoKSB7XG4gICAgaWYgKCF0aGlzLnByb3h5T2Yubm9kZXMpIHJldHVybiB1bmRlZmluZWRcbiAgICByZXR1cm4gdGhpcy5wcm94eU9mLm5vZGVzWzBdXG4gIH1cblxuICBnZXQgbGFzdCgpIHtcbiAgICBpZiAoIXRoaXMucHJveHlPZi5ub2RlcykgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLnByb3h5T2Yubm9kZXNbdGhpcy5wcm94eU9mLm5vZGVzLmxlbmd0aCAtIDFdXG4gIH1cblxuICBub3JtYWxpemUobm9kZXMsIHNhbXBsZSkge1xuICAgIGlmICh0eXBlb2Ygbm9kZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBub2RlcyA9IGNsZWFuU291cmNlKHBhcnNlKG5vZGVzKS5ub2RlcylcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkobm9kZXMpKSB7XG4gICAgICBub2RlcyA9IG5vZGVzLnNsaWNlKDApXG4gICAgICBmb3IgKGxldCBpIG9mIG5vZGVzKSB7XG4gICAgICAgIGlmIChpLnBhcmVudCkgaS5wYXJlbnQucmVtb3ZlQ2hpbGQoaSwgJ2lnbm9yZScpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2Rlcy50eXBlID09PSAncm9vdCcgJiYgdGhpcy50eXBlICE9PSAnZG9jdW1lbnQnKSB7XG4gICAgICBub2RlcyA9IG5vZGVzLm5vZGVzLnNsaWNlKDApXG4gICAgICBmb3IgKGxldCBpIG9mIG5vZGVzKSB7XG4gICAgICAgIGlmIChpLnBhcmVudCkgaS5wYXJlbnQucmVtb3ZlQ2hpbGQoaSwgJ2lnbm9yZScpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChub2Rlcy50eXBlKSB7XG4gICAgICBub2RlcyA9IFtub2Rlc11cbiAgICB9IGVsc2UgaWYgKG5vZGVzLnByb3ApIHtcbiAgICAgIGlmICh0eXBlb2Ygbm9kZXMudmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVmFsdWUgZmllbGQgaXMgbWlzc2VkIGluIG5vZGUgY3JlYXRpb24nKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygbm9kZXMudmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIG5vZGVzLnZhbHVlID0gU3RyaW5nKG5vZGVzLnZhbHVlKVxuICAgICAgfVxuICAgICAgbm9kZXMgPSBbbmV3IERlY2xhcmF0aW9uKG5vZGVzKV1cbiAgICB9IGVsc2UgaWYgKG5vZGVzLnNlbGVjdG9yKSB7XG4gICAgICBub2RlcyA9IFtuZXcgUnVsZShub2RlcyldXG4gICAgfSBlbHNlIGlmIChub2Rlcy5uYW1lKSB7XG4gICAgICBub2RlcyA9IFtuZXcgQXRSdWxlKG5vZGVzKV1cbiAgICB9IGVsc2UgaWYgKG5vZGVzLnRleHQpIHtcbiAgICAgIG5vZGVzID0gW25ldyBDb21tZW50KG5vZGVzKV1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG5vZGUgdHlwZSBpbiBub2RlIGNyZWF0aW9uJylcbiAgICB9XG5cbiAgICBsZXQgcHJvY2Vzc2VkID0gbm9kZXMubWFwKGkgPT4ge1xuICAgICAgLyogYzggaWdub3JlIG5leHQgKi9cbiAgICAgIGlmICghaVtteV0pIENvbnRhaW5lci5yZWJ1aWxkKGkpXG4gICAgICBpID0gaS5wcm94eU9mXG4gICAgICBpZiAoaS5wYXJlbnQpIGkucGFyZW50LnJlbW92ZUNoaWxkKGkpXG4gICAgICBpZiAoaVtpc0NsZWFuXSkgbWFya0RpcnR5VXAoaSlcbiAgICAgIGlmICh0eXBlb2YgaS5yYXdzLmJlZm9yZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKHNhbXBsZSAmJiB0eXBlb2Ygc2FtcGxlLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGkucmF3cy5iZWZvcmUgPSBzYW1wbGUucmF3cy5iZWZvcmUucmVwbGFjZSgvXFxTL2csICcnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpLnBhcmVudCA9IHRoaXNcbiAgICAgIHJldHVybiBpXG4gICAgfSlcblxuICAgIHJldHVybiBwcm9jZXNzZWRcbiAgfVxuXG4gIGdldFByb3h5UHJvY2Vzc29yKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZXQobm9kZSwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKG5vZGVbcHJvcF0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZVxuICAgICAgICBub2RlW3Byb3BdID0gdmFsdWVcbiAgICAgICAgaWYgKHByb3AgPT09ICduYW1lJyB8fCBwcm9wID09PSAncGFyYW1zJyB8fCBwcm9wID09PSAnc2VsZWN0b3InKSB7XG4gICAgICAgICAgbm9kZS5tYXJrRGlydHkoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9LFxuXG4gICAgICBnZXQobm9kZSwgcHJvcCkge1xuICAgICAgICBpZiAocHJvcCA9PT0gJ3Byb3h5T2YnKSB7XG4gICAgICAgICAgcmV0dXJuIG5vZGVcbiAgICAgICAgfSBlbHNlIGlmICghbm9kZVtwcm9wXSkge1xuICAgICAgICAgIHJldHVybiBub2RlW3Byb3BdXG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgcHJvcCA9PT0gJ2VhY2gnIHx8XG4gICAgICAgICAgKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJyAmJiBwcm9wLnN0YXJ0c1dpdGgoJ3dhbGsnKSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZVtwcm9wXShcbiAgICAgICAgICAgICAgLi4uYXJncy5tYXAoaSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gKGNoaWxkLCBpbmRleCkgPT4gaShjaGlsZC50b1Byb3h5KCksIGluZGV4KVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gaVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2V2ZXJ5JyB8fCBwcm9wID09PSAnc29tZScpIHtcbiAgICAgICAgICByZXR1cm4gY2IgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIG5vZGVbcHJvcF0oKGNoaWxkLCAuLi5vdGhlcikgPT5cbiAgICAgICAgICAgICAgY2IoY2hpbGQudG9Qcm94eSgpLCAuLi5vdGhlcilcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ3Jvb3QnKSB7XG4gICAgICAgICAgcmV0dXJuICgpID0+IG5vZGUucm9vdCgpLnRvUHJveHkoKVxuICAgICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICdub2RlcycpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZS5ub2Rlcy5tYXAoaSA9PiBpLnRvUHJveHkoKSlcbiAgICAgICAgfSBlbHNlIGlmIChwcm9wID09PSAnZmlyc3QnIHx8IHByb3AgPT09ICdsYXN0Jykge1xuICAgICAgICAgIHJldHVybiBub2RlW3Byb3BdLnRvUHJveHkoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBub2RlW3Byb3BdXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRJdGVyYXRvcigpIHtcbiAgICBpZiAoIXRoaXMubGFzdEVhY2gpIHRoaXMubGFzdEVhY2ggPSAwXG4gICAgaWYgKCF0aGlzLmluZGV4ZXMpIHRoaXMuaW5kZXhlcyA9IHt9XG5cbiAgICB0aGlzLmxhc3RFYWNoICs9IDFcbiAgICBsZXQgaXRlcmF0b3IgPSB0aGlzLmxhc3RFYWNoXG4gICAgdGhpcy5pbmRleGVzW2l0ZXJhdG9yXSA9IDBcblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG59XG5cbkNvbnRhaW5lci5yZWdpc3RlclBhcnNlID0gZGVwZW5kYW50ID0+IHtcbiAgcGFyc2UgPSBkZXBlbmRhbnRcbn1cblxuQ29udGFpbmVyLnJlZ2lzdGVyUnVsZSA9IGRlcGVuZGFudCA9PiB7XG4gIFJ1bGUgPSBkZXBlbmRhbnRcbn1cblxuQ29udGFpbmVyLnJlZ2lzdGVyQXRSdWxlID0gZGVwZW5kYW50ID0+IHtcbiAgQXRSdWxlID0gZGVwZW5kYW50XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGFpbmVyXG5Db250YWluZXIuZGVmYXVsdCA9IENvbnRhaW5lclxuXG4vKiBjOCBpZ25vcmUgc3RhcnQgKi9cbkNvbnRhaW5lci5yZWJ1aWxkID0gbm9kZSA9PiB7XG4gIGlmIChub2RlLnR5cGUgPT09ICdhdHJ1bGUnKSB7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG5vZGUsIEF0UnVsZS5wcm90b3R5cGUpXG4gIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSAncnVsZScpIHtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yobm9kZSwgUnVsZS5wcm90b3R5cGUpXG4gIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSAnZGVjbCcpIHtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yobm9kZSwgRGVjbGFyYXRpb24ucHJvdG90eXBlKVxuICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ2NvbW1lbnQnKSB7XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG5vZGUsIENvbW1lbnQucHJvdG90eXBlKVxuICB9XG5cbiAgbm9kZVtteV0gPSB0cnVlXG5cbiAgaWYgKG5vZGUubm9kZXMpIHtcbiAgICBub2RlLm5vZGVzLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgQ29udGFpbmVyLnJlYnVpbGQoY2hpbGQpXG4gICAgfSlcbiAgfVxufVxuLyogYzggaWdub3JlIHN0b3AgKi9cbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgcGljbyA9IHJlcXVpcmUoJ3BpY29jb2xvcnMnKVxuXG5sZXQgdGVybWluYWxIaWdobGlnaHQgPSByZXF1aXJlKCcuL3Rlcm1pbmFsLWhpZ2hsaWdodCcpXG5cbmNsYXNzIENzc1N5bnRheEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBsaW5lLCBjb2x1bW4sIHNvdXJjZSwgZmlsZSwgcGx1Z2luKSB7XG4gICAgc3VwZXIobWVzc2FnZSlcbiAgICB0aGlzLm5hbWUgPSAnQ3NzU3ludGF4RXJyb3InXG4gICAgdGhpcy5yZWFzb24gPSBtZXNzYWdlXG5cbiAgICBpZiAoZmlsZSkge1xuICAgICAgdGhpcy5maWxlID0gZmlsZVxuICAgIH1cbiAgICBpZiAoc291cmNlKSB7XG4gICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICAgIH1cbiAgICBpZiAocGx1Z2luKSB7XG4gICAgICB0aGlzLnBsdWdpbiA9IHBsdWdpblxuICAgIH1cbiAgICBpZiAodHlwZW9mIGxpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBjb2x1bW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodHlwZW9mIGxpbmUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmVcbiAgICAgICAgdGhpcy5jb2x1bW4gPSBjb2x1bW5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGluZSA9IGxpbmUubGluZVxuICAgICAgICB0aGlzLmNvbHVtbiA9IGxpbmUuY29sdW1uXG4gICAgICAgIHRoaXMuZW5kTGluZSA9IGNvbHVtbi5saW5lXG4gICAgICAgIHRoaXMuZW5kQ29sdW1uID0gY29sdW1uLmNvbHVtblxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0TWVzc2FnZSgpXG5cbiAgICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIENzc1N5bnRheEVycm9yKVxuICAgIH1cbiAgfVxuXG4gIHNldE1lc3NhZ2UoKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gdGhpcy5wbHVnaW4gPyB0aGlzLnBsdWdpbiArICc6ICcgOiAnJ1xuICAgIHRoaXMubWVzc2FnZSArPSB0aGlzLmZpbGUgPyB0aGlzLmZpbGUgOiAnPGNzcyBpbnB1dD4nXG4gICAgaWYgKHR5cGVvZiB0aGlzLmxpbmUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLm1lc3NhZ2UgKz0gJzonICsgdGhpcy5saW5lICsgJzonICsgdGhpcy5jb2x1bW5cbiAgICB9XG4gICAgdGhpcy5tZXNzYWdlICs9ICc6ICcgKyB0aGlzLnJlYXNvblxuICB9XG5cbiAgc2hvd1NvdXJjZUNvZGUoY29sb3IpIHtcbiAgICBpZiAoIXRoaXMuc291cmNlKSByZXR1cm4gJydcblxuICAgIGxldCBjc3MgPSB0aGlzLnNvdXJjZVxuICAgIGlmIChjb2xvciA9PSBudWxsKSBjb2xvciA9IHBpY28uaXNDb2xvclN1cHBvcnRlZFxuICAgIGlmICh0ZXJtaW5hbEhpZ2hsaWdodCkge1xuICAgICAgaWYgKGNvbG9yKSBjc3MgPSB0ZXJtaW5hbEhpZ2hsaWdodChjc3MpXG4gICAgfVxuXG4gICAgbGV0IGxpbmVzID0gY3NzLnNwbGl0KC9cXHI/XFxuLylcbiAgICBsZXQgc3RhcnQgPSBNYXRoLm1heCh0aGlzLmxpbmUgLSAzLCAwKVxuICAgIGxldCBlbmQgPSBNYXRoLm1pbih0aGlzLmxpbmUgKyAyLCBsaW5lcy5sZW5ndGgpXG5cbiAgICBsZXQgbWF4V2lkdGggPSBTdHJpbmcoZW5kKS5sZW5ndGhcblxuICAgIGxldCBtYXJrLCBhc2lkZVxuICAgIGlmIChjb2xvcikge1xuICAgICAgbGV0IHsgYm9sZCwgcmVkLCBncmF5IH0gPSBwaWNvLmNyZWF0ZUNvbG9ycyh0cnVlKVxuICAgICAgbWFyayA9IHRleHQgPT4gYm9sZChyZWQodGV4dCkpXG4gICAgICBhc2lkZSA9IHRleHQgPT4gZ3JheSh0ZXh0KVxuICAgIH0gZWxzZSB7XG4gICAgICBtYXJrID0gYXNpZGUgPSBzdHIgPT4gc3RyXG4gICAgfVxuXG4gICAgcmV0dXJuIGxpbmVzXG4gICAgICAuc2xpY2Uoc3RhcnQsIGVuZClcbiAgICAgIC5tYXAoKGxpbmUsIGluZGV4KSA9PiB7XG4gICAgICAgIGxldCBudW1iZXIgPSBzdGFydCArIDEgKyBpbmRleFxuICAgICAgICBsZXQgZ3V0dGVyID0gJyAnICsgKCcgJyArIG51bWJlcikuc2xpY2UoLW1heFdpZHRoKSArICcgfCAnXG4gICAgICAgIGlmIChudW1iZXIgPT09IHRoaXMubGluZSkge1xuICAgICAgICAgIGxldCBzcGFjaW5nID1cbiAgICAgICAgICAgIGFzaWRlKGd1dHRlci5yZXBsYWNlKC9cXGQvZywgJyAnKSkgK1xuICAgICAgICAgICAgbGluZS5zbGljZSgwLCB0aGlzLmNvbHVtbiAtIDEpLnJlcGxhY2UoL1teXFx0XS9nLCAnICcpXG4gICAgICAgICAgcmV0dXJuIG1hcmsoJz4nKSArIGFzaWRlKGd1dHRlcikgKyBsaW5lICsgJ1xcbiAnICsgc3BhY2luZyArIG1hcmsoJ14nKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnICcgKyBhc2lkZShndXR0ZXIpICsgbGluZVxuICAgICAgfSlcbiAgICAgIC5qb2luKCdcXG4nKVxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgbGV0IGNvZGUgPSB0aGlzLnNob3dTb3VyY2VDb2RlKClcbiAgICBpZiAoY29kZSkge1xuICAgICAgY29kZSA9ICdcXG5cXG4nICsgY29kZSArICdcXG4nXG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5hbWUgKyAnOiAnICsgdGhpcy5tZXNzYWdlICsgY29kZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ3NzU3ludGF4RXJyb3JcbkNzc1N5bnRheEVycm9yLmRlZmF1bHQgPSBDc3NTeW50YXhFcnJvclxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJylcblxuY2xhc3MgRGVjbGFyYXRpb24gZXh0ZW5kcyBOb2RlIHtcbiAgY29uc3RydWN0b3IoZGVmYXVsdHMpIHtcbiAgICBpZiAoXG4gICAgICBkZWZhdWx0cyAmJlxuICAgICAgdHlwZW9mIGRlZmF1bHRzLnZhbHVlICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgdHlwZW9mIGRlZmF1bHRzLnZhbHVlICE9PSAnc3RyaW5nJ1xuICAgICkge1xuICAgICAgZGVmYXVsdHMgPSB7IC4uLmRlZmF1bHRzLCB2YWx1ZTogU3RyaW5nKGRlZmF1bHRzLnZhbHVlKSB9XG4gICAgfVxuICAgIHN1cGVyKGRlZmF1bHRzKVxuICAgIHRoaXMudHlwZSA9ICdkZWNsJ1xuICB9XG5cbiAgZ2V0IHZhcmlhYmxlKCkge1xuICAgIHJldHVybiB0aGlzLnByb3Auc3RhcnRzV2l0aCgnLS0nKSB8fCB0aGlzLnByb3BbMF0gPT09ICckJ1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRGVjbGFyYXRpb25cbkRlY2xhcmF0aW9uLmRlZmF1bHQgPSBEZWNsYXJhdGlvblxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBDb250YWluZXIgPSByZXF1aXJlKCcuL2NvbnRhaW5lcicpXG5cbmxldCBMYXp5UmVzdWx0LCBQcm9jZXNzb3JcblxuY2xhc3MgRG9jdW1lbnQgZXh0ZW5kcyBDb250YWluZXIge1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0cykge1xuICAgIC8vIHR5cGUgbmVlZHMgdG8gYmUgcGFzc2VkIHRvIHN1cGVyLCBvdGhlcndpc2UgY2hpbGQgcm9vdHMgd29uJ3QgYmUgbm9ybWFsaXplZCBjb3JyZWN0bHlcbiAgICBzdXBlcih7IHR5cGU6ICdkb2N1bWVudCcsIC4uLmRlZmF1bHRzIH0pXG5cbiAgICBpZiAoIXRoaXMubm9kZXMpIHtcbiAgICAgIHRoaXMubm9kZXMgPSBbXVxuICAgIH1cbiAgfVxuXG4gIHRvUmVzdWx0KG9wdHMgPSB7fSkge1xuICAgIGxldCBsYXp5ID0gbmV3IExhenlSZXN1bHQobmV3IFByb2Nlc3NvcigpLCB0aGlzLCBvcHRzKVxuXG4gICAgcmV0dXJuIGxhenkuc3RyaW5naWZ5KClcbiAgfVxufVxuXG5Eb2N1bWVudC5yZWdpc3RlckxhenlSZXN1bHQgPSBkZXBlbmRhbnQgPT4ge1xuICBMYXp5UmVzdWx0ID0gZGVwZW5kYW50XG59XG5cbkRvY3VtZW50LnJlZ2lzdGVyUHJvY2Vzc29yID0gZGVwZW5kYW50ID0+IHtcbiAgUHJvY2Vzc29yID0gZGVwZW5kYW50XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnRcbkRvY3VtZW50LmRlZmF1bHQgPSBEb2N1bWVudFxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBEZWNsYXJhdGlvbiA9IHJlcXVpcmUoJy4vZGVjbGFyYXRpb24nKVxubGV0IFByZXZpb3VzTWFwID0gcmVxdWlyZSgnLi9wcmV2aW91cy1tYXAnKVxubGV0IENvbW1lbnQgPSByZXF1aXJlKCcuL2NvbW1lbnQnKVxubGV0IEF0UnVsZSA9IHJlcXVpcmUoJy4vYXQtcnVsZScpXG5sZXQgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0JylcbmxldCBSb290ID0gcmVxdWlyZSgnLi9yb290JylcbmxldCBSdWxlID0gcmVxdWlyZSgnLi9ydWxlJylcblxuZnVuY3Rpb24gZnJvbUpTT04oanNvbiwgaW5wdXRzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGpzb24pKSByZXR1cm4ganNvbi5tYXAobiA9PiBmcm9tSlNPTihuKSlcblxuICBsZXQgeyBpbnB1dHM6IG93bklucHV0cywgLi4uZGVmYXVsdHMgfSA9IGpzb25cbiAgaWYgKG93bklucHV0cykge1xuICAgIGlucHV0cyA9IFtdXG4gICAgZm9yIChsZXQgaW5wdXQgb2Ygb3duSW5wdXRzKSB7XG4gICAgICBsZXQgaW5wdXRIeWRyYXRlZCA9IHsgLi4uaW5wdXQsIF9fcHJvdG9fXzogSW5wdXQucHJvdG90eXBlIH1cbiAgICAgIGlmIChpbnB1dEh5ZHJhdGVkLm1hcCkge1xuICAgICAgICBpbnB1dEh5ZHJhdGVkLm1hcCA9IHtcbiAgICAgICAgICAuLi5pbnB1dEh5ZHJhdGVkLm1hcCxcbiAgICAgICAgICBfX3Byb3RvX186IFByZXZpb3VzTWFwLnByb3RvdHlwZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpbnB1dHMucHVzaChpbnB1dEh5ZHJhdGVkKVxuICAgIH1cbiAgfVxuICBpZiAoZGVmYXVsdHMubm9kZXMpIHtcbiAgICBkZWZhdWx0cy5ub2RlcyA9IGpzb24ubm9kZXMubWFwKG4gPT4gZnJvbUpTT04obiwgaW5wdXRzKSlcbiAgfVxuICBpZiAoZGVmYXVsdHMuc291cmNlKSB7XG4gICAgbGV0IHsgaW5wdXRJZCwgLi4uc291cmNlIH0gPSBkZWZhdWx0cy5zb3VyY2VcbiAgICBkZWZhdWx0cy5zb3VyY2UgPSBzb3VyY2VcbiAgICBpZiAoaW5wdXRJZCAhPSBudWxsKSB7XG4gICAgICBkZWZhdWx0cy5zb3VyY2UuaW5wdXQgPSBpbnB1dHNbaW5wdXRJZF1cbiAgICB9XG4gIH1cbiAgaWYgKGRlZmF1bHRzLnR5cGUgPT09ICdyb290Jykge1xuICAgIHJldHVybiBuZXcgUm9vdChkZWZhdWx0cylcbiAgfSBlbHNlIGlmIChkZWZhdWx0cy50eXBlID09PSAnZGVjbCcpIHtcbiAgICByZXR1cm4gbmV3IERlY2xhcmF0aW9uKGRlZmF1bHRzKVxuICB9IGVsc2UgaWYgKGRlZmF1bHRzLnR5cGUgPT09ICdydWxlJykge1xuICAgIHJldHVybiBuZXcgUnVsZShkZWZhdWx0cylcbiAgfSBlbHNlIGlmIChkZWZhdWx0cy50eXBlID09PSAnY29tbWVudCcpIHtcbiAgICByZXR1cm4gbmV3IENvbW1lbnQoZGVmYXVsdHMpXG4gIH0gZWxzZSBpZiAoZGVmYXVsdHMudHlwZSA9PT0gJ2F0cnVsZScpIHtcbiAgICByZXR1cm4gbmV3IEF0UnVsZShkZWZhdWx0cylcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbm9kZSB0eXBlOiAnICsganNvbi50eXBlKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnJvbUpTT05cbmZyb21KU09OLmRlZmF1bHQgPSBmcm9tSlNPTlxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCB7IFNvdXJjZU1hcENvbnN1bWVyLCBTb3VyY2VNYXBHZW5lcmF0b3IgfSA9IHJlcXVpcmUoJ3NvdXJjZS1tYXAtanMnKVxubGV0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9ID0gcmVxdWlyZSgndXJsJylcbmxldCB7IHJlc29sdmUsIGlzQWJzb2x1dGUgfSA9IHJlcXVpcmUoJ3BhdGgnKVxubGV0IHsgbmFub2lkIH0gPSByZXF1aXJlKCduYW5vaWQvbm9uLXNlY3VyZScpXG5cbmxldCB0ZXJtaW5hbEhpZ2hsaWdodCA9IHJlcXVpcmUoJy4vdGVybWluYWwtaGlnaGxpZ2h0JylcbmxldCBDc3NTeW50YXhFcnJvciA9IHJlcXVpcmUoJy4vY3NzLXN5bnRheC1lcnJvcicpXG5sZXQgUHJldmlvdXNNYXAgPSByZXF1aXJlKCcuL3ByZXZpb3VzLW1hcCcpXG5cbmxldCBmcm9tT2Zmc2V0Q2FjaGUgPSBTeW1ib2woJ2Zyb21PZmZzZXRDYWNoZScpXG5cbmxldCBzb3VyY2VNYXBBdmFpbGFibGUgPSBCb29sZWFuKFNvdXJjZU1hcENvbnN1bWVyICYmIFNvdXJjZU1hcEdlbmVyYXRvcilcbmxldCBwYXRoQXZhaWxhYmxlID0gQm9vbGVhbihyZXNvbHZlICYmIGlzQWJzb2x1dGUpXG5cbmNsYXNzIElucHV0IHtcbiAgY29uc3RydWN0b3IoY3NzLCBvcHRzID0ge30pIHtcbiAgICBpZiAoXG4gICAgICBjc3MgPT09IG51bGwgfHxcbiAgICAgIHR5cGVvZiBjc3MgPT09ICd1bmRlZmluZWQnIHx8XG4gICAgICAodHlwZW9mIGNzcyA9PT0gJ29iamVjdCcgJiYgIWNzcy50b1N0cmluZylcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUG9zdENTUyByZWNlaXZlZCAke2Nzc30gaW5zdGVhZCBvZiBDU1Mgc3RyaW5nYClcbiAgICB9XG5cbiAgICB0aGlzLmNzcyA9IGNzcy50b1N0cmluZygpXG5cbiAgICBpZiAodGhpcy5jc3NbMF0gPT09ICdcXHVGRUZGJyB8fCB0aGlzLmNzc1swXSA9PT0gJ1xcdUZGRkUnKSB7XG4gICAgICB0aGlzLmhhc0JPTSA9IHRydWVcbiAgICAgIHRoaXMuY3NzID0gdGhpcy5jc3Muc2xpY2UoMSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXNCT00gPSBmYWxzZVxuICAgIH1cblxuICAgIGlmIChvcHRzLmZyb20pIHtcbiAgICAgIGlmIChcbiAgICAgICAgIXBhdGhBdmFpbGFibGUgfHxcbiAgICAgICAgL15cXHcrOlxcL1xcLy8udGVzdChvcHRzLmZyb20pIHx8XG4gICAgICAgIGlzQWJzb2x1dGUob3B0cy5mcm9tKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZmlsZSA9IG9wdHMuZnJvbVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maWxlID0gcmVzb2x2ZShvcHRzLmZyb20pXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhdGhBdmFpbGFibGUgJiYgc291cmNlTWFwQXZhaWxhYmxlKSB7XG4gICAgICBsZXQgbWFwID0gbmV3IFByZXZpb3VzTWFwKHRoaXMuY3NzLCBvcHRzKVxuICAgICAgaWYgKG1hcC50ZXh0KSB7XG4gICAgICAgIHRoaXMubWFwID0gbWFwXG4gICAgICAgIGxldCBmaWxlID0gbWFwLmNvbnN1bWVyKCkuZmlsZVxuICAgICAgICBpZiAoIXRoaXMuZmlsZSAmJiBmaWxlKSB0aGlzLmZpbGUgPSB0aGlzLm1hcFJlc29sdmUoZmlsZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuZmlsZSkge1xuICAgICAgdGhpcy5pZCA9ICc8aW5wdXQgY3NzICcgKyBuYW5vaWQoNikgKyAnPidcbiAgICB9XG4gICAgaWYgKHRoaXMubWFwKSB0aGlzLm1hcC5maWxlID0gdGhpcy5mcm9tXG4gIH1cblxuICBmcm9tT2Zmc2V0KG9mZnNldCkge1xuICAgIGxldCBsYXN0TGluZSwgbGluZVRvSW5kZXhcbiAgICBpZiAoIXRoaXNbZnJvbU9mZnNldENhY2hlXSkge1xuICAgICAgbGV0IGxpbmVzID0gdGhpcy5jc3Muc3BsaXQoJ1xcbicpXG4gICAgICBsaW5lVG9JbmRleCA9IG5ldyBBcnJheShsaW5lcy5sZW5ndGgpXG4gICAgICBsZXQgcHJldkluZGV4ID0gMFxuXG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGxpbmVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBsaW5lVG9JbmRleFtpXSA9IHByZXZJbmRleFxuICAgICAgICBwcmV2SW5kZXggKz0gbGluZXNbaV0ubGVuZ3RoICsgMVxuICAgICAgfVxuXG4gICAgICB0aGlzW2Zyb21PZmZzZXRDYWNoZV0gPSBsaW5lVG9JbmRleFxuICAgIH0gZWxzZSB7XG4gICAgICBsaW5lVG9JbmRleCA9IHRoaXNbZnJvbU9mZnNldENhY2hlXVxuICAgIH1cbiAgICBsYXN0TGluZSA9IGxpbmVUb0luZGV4W2xpbmVUb0luZGV4Lmxlbmd0aCAtIDFdXG5cbiAgICBsZXQgbWluID0gMFxuICAgIGlmIChvZmZzZXQgPj0gbGFzdExpbmUpIHtcbiAgICAgIG1pbiA9IGxpbmVUb0luZGV4Lmxlbmd0aCAtIDFcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG1heCA9IGxpbmVUb0luZGV4Lmxlbmd0aCAtIDJcbiAgICAgIGxldCBtaWRcbiAgICAgIHdoaWxlIChtaW4gPCBtYXgpIHtcbiAgICAgICAgbWlkID0gbWluICsgKChtYXggLSBtaW4pID4+IDEpXG4gICAgICAgIGlmIChvZmZzZXQgPCBsaW5lVG9JbmRleFttaWRdKSB7XG4gICAgICAgICAgbWF4ID0gbWlkIC0gMVxuICAgICAgICB9IGVsc2UgaWYgKG9mZnNldCA+PSBsaW5lVG9JbmRleFttaWQgKyAxXSkge1xuICAgICAgICAgIG1pbiA9IG1pZCArIDFcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtaW4gPSBtaWRcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBsaW5lOiBtaW4gKyAxLFxuICAgICAgY29sOiBvZmZzZXQgLSBsaW5lVG9JbmRleFttaW5dICsgMVxuICAgIH1cbiAgfVxuXG4gIGVycm9yKG1lc3NhZ2UsIGxpbmUsIGNvbHVtbiwgb3B0cyA9IHt9KSB7XG4gICAgbGV0IHJlc3VsdCwgZW5kTGluZSwgZW5kQ29sdW1uXG5cbiAgICBpZiAobGluZSAmJiB0eXBlb2YgbGluZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxldCBzdGFydCA9IGxpbmVcbiAgICAgIGxldCBlbmQgPSBjb2x1bW5cbiAgICAgIGlmICh0eXBlb2YgbGluZS5vZmZzZXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmZyb21PZmZzZXQoc3RhcnQub2Zmc2V0KVxuICAgICAgICBsaW5lID0gcG9zLmxpbmVcbiAgICAgICAgY29sdW1uID0gcG9zLmNvbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGluZSA9IHN0YXJ0LmxpbmVcbiAgICAgICAgY29sdW1uID0gc3RhcnQuY29sdW1uXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGVuZC5vZmZzZXQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLmZyb21PZmZzZXQoZW5kLm9mZnNldClcbiAgICAgICAgZW5kTGluZSA9IHBvcy5saW5lXG4gICAgICAgIGVuZENvbHVtbiA9IHBvcy5jb2xcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVuZExpbmUgPSBlbmQubGluZVxuICAgICAgICBlbmRDb2x1bW4gPSBlbmQuY29sdW1uXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghY29sdW1uKSB7XG4gICAgICBsZXQgcG9zID0gdGhpcy5mcm9tT2Zmc2V0KGxpbmUpXG4gICAgICBsaW5lID0gcG9zLmxpbmVcbiAgICAgIGNvbHVtbiA9IHBvcy5jb2xcbiAgICB9XG5cbiAgICBsZXQgb3JpZ2luID0gdGhpcy5vcmlnaW4obGluZSwgY29sdW1uLCBlbmRMaW5lLCBlbmRDb2x1bW4pXG4gICAgaWYgKG9yaWdpbikge1xuICAgICAgcmVzdWx0ID0gbmV3IENzc1N5bnRheEVycm9yKFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBvcmlnaW4uZW5kTGluZSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyBvcmlnaW4ubGluZVxuICAgICAgICAgIDogeyBsaW5lOiBvcmlnaW4ubGluZSwgY29sdW1uOiBvcmlnaW4uY29sdW1uIH0sXG4gICAgICAgIG9yaWdpbi5lbmRMaW5lID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IG9yaWdpbi5jb2x1bW5cbiAgICAgICAgICA6IHsgbGluZTogb3JpZ2luLmVuZExpbmUsIGNvbHVtbjogb3JpZ2luLmVuZENvbHVtbiB9LFxuICAgICAgICBvcmlnaW4uc291cmNlLFxuICAgICAgICBvcmlnaW4uZmlsZSxcbiAgICAgICAgb3B0cy5wbHVnaW5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzdWx0ID0gbmV3IENzc1N5bnRheEVycm9yKFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBlbmRMaW5lID09PSB1bmRlZmluZWQgPyBsaW5lIDogeyBsaW5lLCBjb2x1bW4gfSxcbiAgICAgICAgZW5kTGluZSA9PT0gdW5kZWZpbmVkID8gY29sdW1uIDogeyBsaW5lOiBlbmRMaW5lLCBjb2x1bW46IGVuZENvbHVtbiB9LFxuICAgICAgICB0aGlzLmNzcyxcbiAgICAgICAgdGhpcy5maWxlLFxuICAgICAgICBvcHRzLnBsdWdpblxuICAgICAgKVxuICAgIH1cblxuICAgIHJlc3VsdC5pbnB1dCA9IHsgbGluZSwgY29sdW1uLCBlbmRMaW5lLCBlbmRDb2x1bW4sIHNvdXJjZTogdGhpcy5jc3MgfVxuICAgIGlmICh0aGlzLmZpbGUpIHtcbiAgICAgIGlmIChwYXRoVG9GaWxlVVJMKSB7XG4gICAgICAgIHJlc3VsdC5pbnB1dC51cmwgPSBwYXRoVG9GaWxlVVJMKHRoaXMuZmlsZSkudG9TdHJpbmcoKVxuICAgICAgfVxuICAgICAgcmVzdWx0LmlucHV0LmZpbGUgPSB0aGlzLmZpbGVcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBvcmlnaW4obGluZSwgY29sdW1uLCBlbmRMaW5lLCBlbmRDb2x1bW4pIHtcbiAgICBpZiAoIXRoaXMubWFwKSByZXR1cm4gZmFsc2VcbiAgICBsZXQgY29uc3VtZXIgPSB0aGlzLm1hcC5jb25zdW1lcigpXG5cbiAgICBsZXQgZnJvbSA9IGNvbnN1bWVyLm9yaWdpbmFsUG9zaXRpb25Gb3IoeyBsaW5lLCBjb2x1bW4gfSlcbiAgICBpZiAoIWZyb20uc291cmNlKSByZXR1cm4gZmFsc2VcblxuICAgIGxldCB0b1xuICAgIGlmICh0eXBlb2YgZW5kTGluZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRvID0gY29uc3VtZXIub3JpZ2luYWxQb3NpdGlvbkZvcih7IGxpbmU6IGVuZExpbmUsIGNvbHVtbjogZW5kQ29sdW1uIH0pXG4gICAgfVxuXG4gICAgbGV0IGZyb21VcmxcblxuICAgIGlmIChpc0Fic29sdXRlKGZyb20uc291cmNlKSkge1xuICAgICAgZnJvbVVybCA9IHBhdGhUb0ZpbGVVUkwoZnJvbS5zb3VyY2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZyb21VcmwgPSBuZXcgVVJMKFxuICAgICAgICBmcm9tLnNvdXJjZSxcbiAgICAgICAgdGhpcy5tYXAuY29uc3VtZXIoKS5zb3VyY2VSb290IHx8IHBhdGhUb0ZpbGVVUkwodGhpcy5tYXAubWFwRmlsZSlcbiAgICAgIClcbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgdXJsOiBmcm9tVXJsLnRvU3RyaW5nKCksXG4gICAgICBsaW5lOiBmcm9tLmxpbmUsXG4gICAgICBjb2x1bW46IGZyb20uY29sdW1uLFxuICAgICAgZW5kTGluZTogdG8gJiYgdG8ubGluZSxcbiAgICAgIGVuZENvbHVtbjogdG8gJiYgdG8uY29sdW1uXG4gICAgfVxuXG4gICAgaWYgKGZyb21VcmwucHJvdG9jb2wgPT09ICdmaWxlOicpIHtcbiAgICAgIGlmIChmaWxlVVJMVG9QYXRoKSB7XG4gICAgICAgIHJlc3VsdC5maWxlID0gZmlsZVVSTFRvUGF0aChmcm9tVXJsKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLyogYzggaWdub3JlIG5leHQgMiAqL1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZpbGU6IHByb3RvY29sIGlzIG5vdCBhdmFpbGFibGUgaW4gdGhpcyBQb3N0Q1NTIGJ1aWxkYClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc291cmNlID0gY29uc3VtZXIuc291cmNlQ29udGVudEZvcihmcm9tLnNvdXJjZSlcbiAgICBpZiAoc291cmNlKSByZXN1bHQuc291cmNlID0gc291cmNlXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBtYXBSZXNvbHZlKGZpbGUpIHtcbiAgICBpZiAoL15cXHcrOlxcL1xcLy8udGVzdChmaWxlKSkge1xuICAgICAgcmV0dXJuIGZpbGVcbiAgICB9XG4gICAgcmV0dXJuIHJlc29sdmUodGhpcy5tYXAuY29uc3VtZXIoKS5zb3VyY2VSb290IHx8IHRoaXMubWFwLnJvb3QgfHwgJy4nLCBmaWxlKVxuICB9XG5cbiAgZ2V0IGZyb20oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsZSB8fCB0aGlzLmlkXG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgbGV0IGpzb24gPSB7fVxuICAgIGZvciAobGV0IG5hbWUgb2YgWydoYXNCT00nLCAnY3NzJywgJ2ZpbGUnLCAnaWQnXSkge1xuICAgICAgaWYgKHRoaXNbbmFtZV0gIT0gbnVsbCkge1xuICAgICAgICBqc29uW25hbWVdID0gdGhpc1tuYW1lXVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5tYXApIHtcbiAgICAgIGpzb24ubWFwID0geyAuLi50aGlzLm1hcCB9XG4gICAgICBpZiAoanNvbi5tYXAuY29uc3VtZXJDYWNoZSkge1xuICAgICAgICBqc29uLm1hcC5jb25zdW1lckNhY2hlID0gdW5kZWZpbmVkXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBqc29uXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFxuSW5wdXQuZGVmYXVsdCA9IElucHV0XG5cbmlmICh0ZXJtaW5hbEhpZ2hsaWdodCAmJiB0ZXJtaW5hbEhpZ2hsaWdodC5yZWdpc3RlcklucHV0KSB7XG4gIHRlcm1pbmFsSGlnaGxpZ2h0LnJlZ2lzdGVySW5wdXQoSW5wdXQpXG59XG4iLCIndXNlIHN0cmljdCdcblxubGV0IHsgaXNDbGVhbiwgbXkgfSA9IHJlcXVpcmUoJy4vc3ltYm9scycpXG5sZXQgTWFwR2VuZXJhdG9yID0gcmVxdWlyZSgnLi9tYXAtZ2VuZXJhdG9yJylcbmxldCBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpXG5sZXQgQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jb250YWluZXInKVxubGV0IERvY3VtZW50ID0gcmVxdWlyZSgnLi9kb2N1bWVudCcpXG5sZXQgd2Fybk9uY2UgPSByZXF1aXJlKCcuL3dhcm4tb25jZScpXG5sZXQgUmVzdWx0ID0gcmVxdWlyZSgnLi9yZXN1bHQnKVxubGV0IHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpXG5sZXQgUm9vdCA9IHJlcXVpcmUoJy4vcm9vdCcpXG5cbmNvbnN0IFRZUEVfVE9fQ0xBU1NfTkFNRSA9IHtcbiAgZG9jdW1lbnQ6ICdEb2N1bWVudCcsXG4gIHJvb3Q6ICdSb290JyxcbiAgYXRydWxlOiAnQXRSdWxlJyxcbiAgcnVsZTogJ1J1bGUnLFxuICBkZWNsOiAnRGVjbGFyYXRpb24nLFxuICBjb21tZW50OiAnQ29tbWVudCdcbn1cblxuY29uc3QgUExVR0lOX1BST1BTID0ge1xuICBwb3N0Y3NzUGx1Z2luOiB0cnVlLFxuICBwcmVwYXJlOiB0cnVlLFxuICBPbmNlOiB0cnVlLFxuICBEb2N1bWVudDogdHJ1ZSxcbiAgUm9vdDogdHJ1ZSxcbiAgRGVjbGFyYXRpb246IHRydWUsXG4gIFJ1bGU6IHRydWUsXG4gIEF0UnVsZTogdHJ1ZSxcbiAgQ29tbWVudDogdHJ1ZSxcbiAgRGVjbGFyYXRpb25FeGl0OiB0cnVlLFxuICBSdWxlRXhpdDogdHJ1ZSxcbiAgQXRSdWxlRXhpdDogdHJ1ZSxcbiAgQ29tbWVudEV4aXQ6IHRydWUsXG4gIFJvb3RFeGl0OiB0cnVlLFxuICBEb2N1bWVudEV4aXQ6IHRydWUsXG4gIE9uY2VFeGl0OiB0cnVlXG59XG5cbmNvbnN0IE5PVF9WSVNJVE9SUyA9IHtcbiAgcG9zdGNzc1BsdWdpbjogdHJ1ZSxcbiAgcHJlcGFyZTogdHJ1ZSxcbiAgT25jZTogdHJ1ZVxufVxuXG5jb25zdCBDSElMRFJFTiA9IDBcblxuZnVuY3Rpb24gaXNQcm9taXNlKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG9iai50aGVuID09PSAnZnVuY3Rpb24nXG59XG5cbmZ1bmN0aW9uIGdldEV2ZW50cyhub2RlKSB7XG4gIGxldCBrZXkgPSBmYWxzZVxuICBsZXQgdHlwZSA9IFRZUEVfVE9fQ0xBU1NfTkFNRVtub2RlLnR5cGVdXG4gIGlmIChub2RlLnR5cGUgPT09ICdkZWNsJykge1xuICAgIGtleSA9IG5vZGUucHJvcC50b0xvd2VyQ2FzZSgpXG4gIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSAnYXRydWxlJykge1xuICAgIGtleSA9IG5vZGUubmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBpZiAoa2V5ICYmIG5vZGUuYXBwZW5kKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHR5cGUsXG4gICAgICB0eXBlICsgJy0nICsga2V5LFxuICAgICAgQ0hJTERSRU4sXG4gICAgICB0eXBlICsgJ0V4aXQnLFxuICAgICAgdHlwZSArICdFeGl0LScgKyBrZXlcbiAgICBdXG4gIH0gZWxzZSBpZiAoa2V5KSB7XG4gICAgcmV0dXJuIFt0eXBlLCB0eXBlICsgJy0nICsga2V5LCB0eXBlICsgJ0V4aXQnLCB0eXBlICsgJ0V4aXQtJyArIGtleV1cbiAgfSBlbHNlIGlmIChub2RlLmFwcGVuZCkge1xuICAgIHJldHVybiBbdHlwZSwgQ0hJTERSRU4sIHR5cGUgKyAnRXhpdCddXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFt0eXBlLCB0eXBlICsgJ0V4aXQnXVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvU3RhY2sobm9kZSkge1xuICBsZXQgZXZlbnRzXG4gIGlmIChub2RlLnR5cGUgPT09ICdkb2N1bWVudCcpIHtcbiAgICBldmVudHMgPSBbJ0RvY3VtZW50JywgQ0hJTERSRU4sICdEb2N1bWVudEV4aXQnXVxuICB9IGVsc2UgaWYgKG5vZGUudHlwZSA9PT0gJ3Jvb3QnKSB7XG4gICAgZXZlbnRzID0gWydSb290JywgQ0hJTERSRU4sICdSb290RXhpdCddXG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzID0gZ2V0RXZlbnRzKG5vZGUpXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5vZGUsXG4gICAgZXZlbnRzLFxuICAgIGV2ZW50SW5kZXg6IDAsXG4gICAgdmlzaXRvcnM6IFtdLFxuICAgIHZpc2l0b3JJbmRleDogMCxcbiAgICBpdGVyYXRvcjogMFxuICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFuTWFya3Mobm9kZSkge1xuICBub2RlW2lzQ2xlYW5dID0gZmFsc2VcbiAgaWYgKG5vZGUubm9kZXMpIG5vZGUubm9kZXMuZm9yRWFjaChpID0+IGNsZWFuTWFya3MoaSkpXG4gIHJldHVybiBub2RlXG59XG5cbmxldCBwb3N0Y3NzID0ge31cblxuY2xhc3MgTGF6eVJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHByb2Nlc3NvciwgY3NzLCBvcHRzKSB7XG4gICAgdGhpcy5zdHJpbmdpZmllZCA9IGZhbHNlXG4gICAgdGhpcy5wcm9jZXNzZWQgPSBmYWxzZVxuXG4gICAgbGV0IHJvb3RcbiAgICBpZiAoXG4gICAgICB0eXBlb2YgY3NzID09PSAnb2JqZWN0JyAmJlxuICAgICAgY3NzICE9PSBudWxsICYmXG4gICAgICAoY3NzLnR5cGUgPT09ICdyb290JyB8fCBjc3MudHlwZSA9PT0gJ2RvY3VtZW50JylcbiAgICApIHtcbiAgICAgIHJvb3QgPSBjbGVhbk1hcmtzKGNzcylcbiAgICB9IGVsc2UgaWYgKGNzcyBpbnN0YW5jZW9mIExhenlSZXN1bHQgfHwgY3NzIGluc3RhbmNlb2YgUmVzdWx0KSB7XG4gICAgICByb290ID0gY2xlYW5NYXJrcyhjc3Mucm9vdClcbiAgICAgIGlmIChjc3MubWFwKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0cy5tYXAgPT09ICd1bmRlZmluZWQnKSBvcHRzLm1hcCA9IHt9XG4gICAgICAgIGlmICghb3B0cy5tYXAuaW5saW5lKSBvcHRzLm1hcC5pbmxpbmUgPSBmYWxzZVxuICAgICAgICBvcHRzLm1hcC5wcmV2ID0gY3NzLm1hcFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcGFyc2VyID0gcGFyc2VcbiAgICAgIGlmIChvcHRzLnN5bnRheCkgcGFyc2VyID0gb3B0cy5zeW50YXgucGFyc2VcbiAgICAgIGlmIChvcHRzLnBhcnNlcikgcGFyc2VyID0gb3B0cy5wYXJzZXJcbiAgICAgIGlmIChwYXJzZXIucGFyc2UpIHBhcnNlciA9IHBhcnNlci5wYXJzZVxuXG4gICAgICB0cnkge1xuICAgICAgICByb290ID0gcGFyc2VyKGNzcywgb3B0cylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc2VkID0gdHJ1ZVxuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3JcbiAgICAgIH1cblxuICAgICAgaWYgKHJvb3QgJiYgIXJvb3RbbXldKSB7XG4gICAgICAgIC8qIGM4IGlnbm9yZSBuZXh0IDIgKi9cbiAgICAgICAgQ29udGFpbmVyLnJlYnVpbGQocm9vdClcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnJlc3VsdCA9IG5ldyBSZXN1bHQocHJvY2Vzc29yLCByb290LCBvcHRzKVxuICAgIHRoaXMuaGVscGVycyA9IHsgLi4ucG9zdGNzcywgcmVzdWx0OiB0aGlzLnJlc3VsdCwgcG9zdGNzcyB9XG4gICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wcm9jZXNzb3IucGx1Z2lucy5tYXAocGx1Z2luID0+IHtcbiAgICAgIGlmICh0eXBlb2YgcGx1Z2luID09PSAnb2JqZWN0JyAmJiBwbHVnaW4ucHJlcGFyZSkge1xuICAgICAgICByZXR1cm4geyAuLi5wbHVnaW4sIC4uLnBsdWdpbi5wcmVwYXJlKHRoaXMucmVzdWx0KSB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcGx1Z2luXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gJ0xhenlSZXN1bHQnXG4gIH1cblxuICBnZXQgcHJvY2Vzc29yKCkge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdC5wcm9jZXNzb3JcbiAgfVxuXG4gIGdldCBvcHRzKCkge1xuICAgIHJldHVybiB0aGlzLnJlc3VsdC5vcHRzXG4gIH1cblxuICBnZXQgY3NzKCkge1xuICAgIHJldHVybiB0aGlzLnN0cmluZ2lmeSgpLmNzc1xuICB9XG5cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5naWZ5KCkuY29udGVudFxuICB9XG5cbiAgZ2V0IG1hcCgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoKS5tYXBcbiAgfVxuXG4gIGdldCByb290KCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMoKS5yb290XG4gIH1cblxuICBnZXQgbWVzc2FnZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3luYygpLm1lc3NhZ2VzXG4gIH1cblxuICB3YXJuaW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy5zeW5jKCkud2FybmluZ3MoKVxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3NzXG4gIH1cblxuICB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmICghKCdmcm9tJyBpbiB0aGlzLm9wdHMpKSB7XG4gICAgICAgIHdhcm5PbmNlKFxuICAgICAgICAgICdXaXRob3V0IGBmcm9tYCBvcHRpb24gUG9zdENTUyBjb3VsZCBnZW5lcmF0ZSB3cm9uZyBzb3VyY2UgbWFwICcgK1xuICAgICAgICAgICAgJ2FuZCB3aWxsIG5vdCBmaW5kIEJyb3dzZXJzbGlzdCBjb25maWcuIFNldCBpdCB0byBDU1MgZmlsZSBwYXRoICcgK1xuICAgICAgICAgICAgJ29yIHRvIGB1bmRlZmluZWRgIHRvIHByZXZlbnQgdGhpcyB3YXJuaW5nLidcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5hc3luYygpLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gIH1cblxuICBjYXRjaChvblJlamVjdGVkKSB7XG4gICAgcmV0dXJuIHRoaXMuYXN5bmMoKS5jYXRjaChvblJlamVjdGVkKVxuICB9XG5cbiAgZmluYWxseShvbkZpbmFsbHkpIHtcbiAgICByZXR1cm4gdGhpcy5hc3luYygpLnRoZW4ob25GaW5hbGx5LCBvbkZpbmFsbHkpXG4gIH1cblxuICBhc3luYygpIHtcbiAgICBpZiAodGhpcy5lcnJvcikgcmV0dXJuIFByb21pc2UucmVqZWN0KHRoaXMuZXJyb3IpXG4gICAgaWYgKHRoaXMucHJvY2Vzc2VkKSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMucmVzdWx0KVxuICAgIGlmICghdGhpcy5wcm9jZXNzaW5nKSB7XG4gICAgICB0aGlzLnByb2Nlc3NpbmcgPSB0aGlzLnJ1bkFzeW5jKClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJvY2Vzc2luZ1xuICB9XG5cbiAgc3luYygpIHtcbiAgICBpZiAodGhpcy5lcnJvcikgdGhyb3cgdGhpcy5lcnJvclxuICAgIGlmICh0aGlzLnByb2Nlc3NlZCkgcmV0dXJuIHRoaXMucmVzdWx0XG4gICAgdGhpcy5wcm9jZXNzZWQgPSB0cnVlXG5cbiAgICBpZiAodGhpcy5wcm9jZXNzaW5nKSB7XG4gICAgICB0aHJvdyB0aGlzLmdldEFzeW5jRXJyb3IoKVxuICAgIH1cblxuICAgIGZvciAobGV0IHBsdWdpbiBvZiB0aGlzLnBsdWdpbnMpIHtcbiAgICAgIGxldCBwcm9taXNlID0gdGhpcy5ydW5PblJvb3QocGx1Z2luKVxuICAgICAgaWYgKGlzUHJvbWlzZShwcm9taXNlKSkge1xuICAgICAgICB0aHJvdyB0aGlzLmdldEFzeW5jRXJyb3IoKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJlcGFyZVZpc2l0b3JzKClcbiAgICBpZiAodGhpcy5oYXNMaXN0ZW5lcikge1xuICAgICAgbGV0IHJvb3QgPSB0aGlzLnJlc3VsdC5yb290XG4gICAgICB3aGlsZSAoIXJvb3RbaXNDbGVhbl0pIHtcbiAgICAgICAgcm9vdFtpc0NsZWFuXSA9IHRydWVcbiAgICAgICAgdGhpcy53YWxrU3luYyhyb290KVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubGlzdGVuZXJzLk9uY2VFeGl0KSB7XG4gICAgICAgIGlmIChyb290LnR5cGUgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgICBmb3IgKGxldCBzdWJSb290IG9mIHJvb3Qubm9kZXMpIHtcbiAgICAgICAgICAgIHRoaXMudmlzaXRTeW5jKHRoaXMubGlzdGVuZXJzLk9uY2VFeGl0LCBzdWJSb290KVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnZpc2l0U3luYyh0aGlzLmxpc3RlbmVycy5PbmNlRXhpdCwgcm9vdClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlc3VsdFxuICB9XG5cbiAgc3RyaW5naWZ5KCkge1xuICAgIGlmICh0aGlzLmVycm9yKSB0aHJvdyB0aGlzLmVycm9yXG4gICAgaWYgKHRoaXMuc3RyaW5naWZpZWQpIHJldHVybiB0aGlzLnJlc3VsdFxuICAgIHRoaXMuc3RyaW5naWZpZWQgPSB0cnVlXG5cbiAgICB0aGlzLnN5bmMoKVxuXG4gICAgbGV0IG9wdHMgPSB0aGlzLnJlc3VsdC5vcHRzXG4gICAgbGV0IHN0ciA9IHN0cmluZ2lmeVxuICAgIGlmIChvcHRzLnN5bnRheCkgc3RyID0gb3B0cy5zeW50YXguc3RyaW5naWZ5XG4gICAgaWYgKG9wdHMuc3RyaW5naWZpZXIpIHN0ciA9IG9wdHMuc3RyaW5naWZpZXJcbiAgICBpZiAoc3RyLnN0cmluZ2lmeSkgc3RyID0gc3RyLnN0cmluZ2lmeVxuXG4gICAgbGV0IG1hcCA9IG5ldyBNYXBHZW5lcmF0b3Ioc3RyLCB0aGlzLnJlc3VsdC5yb290LCB0aGlzLnJlc3VsdC5vcHRzKVxuICAgIGxldCBkYXRhID0gbWFwLmdlbmVyYXRlKClcbiAgICB0aGlzLnJlc3VsdC5jc3MgPSBkYXRhWzBdXG4gICAgdGhpcy5yZXN1bHQubWFwID0gZGF0YVsxXVxuXG4gICAgcmV0dXJuIHRoaXMucmVzdWx0XG4gIH1cblxuICB3YWxrU3luYyhub2RlKSB7XG4gICAgbm9kZVtpc0NsZWFuXSA9IHRydWVcbiAgICBsZXQgZXZlbnRzID0gZ2V0RXZlbnRzKG5vZGUpXG4gICAgZm9yIChsZXQgZXZlbnQgb2YgZXZlbnRzKSB7XG4gICAgICBpZiAoZXZlbnQgPT09IENISUxEUkVOKSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVzKSB7XG4gICAgICAgICAgbm9kZS5lYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGlmICghY2hpbGRbaXNDbGVhbl0pIHRoaXMud2Fsa1N5bmMoY2hpbGQpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHZpc2l0b3JzID0gdGhpcy5saXN0ZW5lcnNbZXZlbnRdXG4gICAgICAgIGlmICh2aXNpdG9ycykge1xuICAgICAgICAgIGlmICh0aGlzLnZpc2l0U3luYyh2aXNpdG9ycywgbm9kZS50b1Byb3h5KCkpKSByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHZpc2l0U3luYyh2aXNpdG9ycywgbm9kZSkge1xuICAgIGZvciAobGV0IFtwbHVnaW4sIHZpc2l0b3JdIG9mIHZpc2l0b3JzKSB7XG4gICAgICB0aGlzLnJlc3VsdC5sYXN0UGx1Z2luID0gcGx1Z2luXG4gICAgICBsZXQgcHJvbWlzZVxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvbWlzZSA9IHZpc2l0b3Iobm9kZSwgdGhpcy5oZWxwZXJzKVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB0aGlzLmhhbmRsZUVycm9yKGUsIG5vZGUucHJveHlPZilcbiAgICAgIH1cbiAgICAgIGlmIChub2RlLnR5cGUgIT09ICdyb290JyAmJiBub2RlLnR5cGUgIT09ICdkb2N1bWVudCcgJiYgIW5vZGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICBpZiAoaXNQcm9taXNlKHByb21pc2UpKSB7XG4gICAgICAgIHRocm93IHRoaXMuZ2V0QXN5bmNFcnJvcigpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcnVuT25Sb290KHBsdWdpbikge1xuICAgIHRoaXMucmVzdWx0Lmxhc3RQbHVnaW4gPSBwbHVnaW5cbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdvYmplY3QnICYmIHBsdWdpbi5PbmNlKSB7XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdC5yb290LnR5cGUgPT09ICdkb2N1bWVudCcpIHtcbiAgICAgICAgICBsZXQgcm9vdHMgPSB0aGlzLnJlc3VsdC5yb290Lm5vZGVzLm1hcChyb290ID0+XG4gICAgICAgICAgICBwbHVnaW4uT25jZShyb290LCB0aGlzLmhlbHBlcnMpXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgaWYgKGlzUHJvbWlzZShyb290c1swXSkpIHtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChyb290cylcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gcm9vdHNcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwbHVnaW4uT25jZSh0aGlzLnJlc3VsdC5yb290LCB0aGlzLmhlbHBlcnMpXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwbHVnaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHBsdWdpbih0aGlzLnJlc3VsdC5yb290LCB0aGlzLnJlc3VsdClcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgdGhyb3cgdGhpcy5oYW5kbGVFcnJvcihlcnJvcilcbiAgICB9XG4gIH1cblxuICBnZXRBc3luY0Vycm9yKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVXNlIHByb2Nlc3MoY3NzKS50aGVuKGNiKSB0byB3b3JrIHdpdGggYXN5bmMgcGx1Z2lucycpXG4gIH1cblxuICBoYW5kbGVFcnJvcihlcnJvciwgbm9kZSkge1xuICAgIGxldCBwbHVnaW4gPSB0aGlzLnJlc3VsdC5sYXN0UGx1Z2luXG4gICAgdHJ5IHtcbiAgICAgIGlmIChub2RlKSBub2RlLmFkZFRvRXJyb3IoZXJyb3IpXG4gICAgICB0aGlzLmVycm9yID0gZXJyb3JcbiAgICAgIGlmIChlcnJvci5uYW1lID09PSAnQ3NzU3ludGF4RXJyb3InICYmICFlcnJvci5wbHVnaW4pIHtcbiAgICAgICAgZXJyb3IucGx1Z2luID0gcGx1Z2luLnBvc3Rjc3NQbHVnaW5cbiAgICAgICAgZXJyb3Iuc2V0TWVzc2FnZSgpXG4gICAgICB9IGVsc2UgaWYgKHBsdWdpbi5wb3N0Y3NzVmVyc2lvbikge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIGxldCBwbHVnaW5OYW1lID0gcGx1Z2luLnBvc3Rjc3NQbHVnaW5cbiAgICAgICAgICBsZXQgcGx1Z2luVmVyID0gcGx1Z2luLnBvc3Rjc3NWZXJzaW9uXG4gICAgICAgICAgbGV0IHJ1bnRpbWVWZXIgPSB0aGlzLnJlc3VsdC5wcm9jZXNzb3IudmVyc2lvblxuICAgICAgICAgIGxldCBhID0gcGx1Z2luVmVyLnNwbGl0KCcuJylcbiAgICAgICAgICBsZXQgYiA9IHJ1bnRpbWVWZXIuc3BsaXQoJy4nKVxuXG4gICAgICAgICAgaWYgKGFbMF0gIT09IGJbMF0gfHwgcGFyc2VJbnQoYVsxXSkgPiBwYXJzZUludChiWzFdKSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICdVbmtub3duIGVycm9yIGZyb20gUG9zdENTUyBwbHVnaW4uIFlvdXIgY3VycmVudCBQb3N0Q1NTICcgK1xuICAgICAgICAgICAgICAgICd2ZXJzaW9uIGlzICcgK1xuICAgICAgICAgICAgICAgIHJ1bnRpbWVWZXIgK1xuICAgICAgICAgICAgICAgICcsIGJ1dCAnICtcbiAgICAgICAgICAgICAgICBwbHVnaW5OYW1lICtcbiAgICAgICAgICAgICAgICAnIHVzZXMgJyArXG4gICAgICAgICAgICAgICAgcGx1Z2luVmVyICtcbiAgICAgICAgICAgICAgICAnLiBQZXJoYXBzIHRoaXMgaXMgdGhlIHNvdXJjZSBvZiB0aGUgZXJyb3IgYmVsb3cuJ1xuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLyogYzggaWdub3JlIG5leHQgMyAqL1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGUuZXJyb3IpIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgIH1cbiAgICByZXR1cm4gZXJyb3JcbiAgfVxuXG4gIGFzeW5jIHJ1bkFzeW5jKCkge1xuICAgIHRoaXMucGx1Z2luID0gMFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5wbHVnaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgcGx1Z2luID0gdGhpcy5wbHVnaW5zW2ldXG4gICAgICBsZXQgcHJvbWlzZSA9IHRoaXMucnVuT25Sb290KHBsdWdpbilcbiAgICAgIGlmIChpc1Byb21pc2UocHJvbWlzZSkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCBwcm9taXNlXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgdGhyb3cgdGhpcy5oYW5kbGVFcnJvcihlcnJvcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucHJlcGFyZVZpc2l0b3JzKClcbiAgICBpZiAodGhpcy5oYXNMaXN0ZW5lcikge1xuICAgICAgbGV0IHJvb3QgPSB0aGlzLnJlc3VsdC5yb290XG4gICAgICB3aGlsZSAoIXJvb3RbaXNDbGVhbl0pIHtcbiAgICAgICAgcm9vdFtpc0NsZWFuXSA9IHRydWVcbiAgICAgICAgbGV0IHN0YWNrID0gW3RvU3RhY2socm9vdCldXG4gICAgICAgIHdoaWxlIChzdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbGV0IHByb21pc2UgPSB0aGlzLnZpc2l0VGljayhzdGFjaylcbiAgICAgICAgICBpZiAoaXNQcm9taXNlKHByb21pc2UpKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBhd2FpdCBwcm9taXNlXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGxldCBub2RlID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV0ubm9kZVxuICAgICAgICAgICAgICB0aHJvdyB0aGlzLmhhbmRsZUVycm9yKGUsIG5vZGUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmxpc3RlbmVycy5PbmNlRXhpdCkge1xuICAgICAgICBmb3IgKGxldCBbcGx1Z2luLCB2aXNpdG9yXSBvZiB0aGlzLmxpc3RlbmVycy5PbmNlRXhpdCkge1xuICAgICAgICAgIHRoaXMucmVzdWx0Lmxhc3RQbHVnaW4gPSBwbHVnaW5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHJvb3QudHlwZSA9PT0gJ2RvY3VtZW50Jykge1xuICAgICAgICAgICAgICBsZXQgcm9vdHMgPSByb290Lm5vZGVzLm1hcChzdWJSb290ID0+XG4gICAgICAgICAgICAgICAgdmlzaXRvcihzdWJSb290LCB0aGlzLmhlbHBlcnMpXG4gICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChyb290cylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGF3YWl0IHZpc2l0b3Iocm9vdCwgdGhpcy5oZWxwZXJzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IHRoaXMuaGFuZGxlRXJyb3IoZSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnByb2Nlc3NlZCA9IHRydWVcbiAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoKVxuICB9XG5cbiAgcHJlcGFyZVZpc2l0b3JzKCkge1xuICAgIHRoaXMubGlzdGVuZXJzID0ge31cbiAgICBsZXQgYWRkID0gKHBsdWdpbiwgdHlwZSwgY2IpID0+IHtcbiAgICAgIGlmICghdGhpcy5saXN0ZW5lcnNbdHlwZV0pIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gW11cbiAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdLnB1c2goW3BsdWdpbiwgY2JdKVxuICAgIH1cbiAgICBmb3IgKGxldCBwbHVnaW4gb2YgdGhpcy5wbHVnaW5zKSB7XG4gICAgICBpZiAodHlwZW9mIHBsdWdpbiA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgZm9yIChsZXQgZXZlbnQgaW4gcGx1Z2luKSB7XG4gICAgICAgICAgaWYgKCFQTFVHSU5fUFJPUFNbZXZlbnRdICYmIC9eW0EtWl0vLnRlc3QoZXZlbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgIGBVbmtub3duIGV2ZW50ICR7ZXZlbnR9IGluICR7cGx1Z2luLnBvc3Rjc3NQbHVnaW59LiBgICtcbiAgICAgICAgICAgICAgICBgVHJ5IHRvIHVwZGF0ZSBQb3N0Q1NTICgke3RoaXMucHJvY2Vzc29yLnZlcnNpb259IG5vdykuYFxuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIU5PVF9WSVNJVE9SU1tldmVudF0pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGx1Z2luW2V2ZW50XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgZmlsdGVyIGluIHBsdWdpbltldmVudF0pIHtcbiAgICAgICAgICAgICAgICBpZiAoZmlsdGVyID09PSAnKicpIHtcbiAgICAgICAgICAgICAgICAgIGFkZChwbHVnaW4sIGV2ZW50LCBwbHVnaW5bZXZlbnRdW2ZpbHRlcl0pXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGFkZChcbiAgICAgICAgICAgICAgICAgICAgcGx1Z2luLFxuICAgICAgICAgICAgICAgICAgICBldmVudCArICctJyArIGZpbHRlci50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICBwbHVnaW5bZXZlbnRdW2ZpbHRlcl1cbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHBsdWdpbltldmVudF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgYWRkKHBsdWdpbiwgZXZlbnQsIHBsdWdpbltldmVudF0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaGFzTGlzdGVuZXIgPSBPYmplY3Qua2V5cyh0aGlzLmxpc3RlbmVycykubGVuZ3RoID4gMFxuICB9XG5cbiAgdmlzaXRUaWNrKHN0YWNrKSB7XG4gICAgbGV0IHZpc2l0ID0gc3RhY2tbc3RhY2subGVuZ3RoIC0gMV1cbiAgICBsZXQgeyBub2RlLCB2aXNpdG9ycyB9ID0gdmlzaXRcblxuICAgIGlmIChub2RlLnR5cGUgIT09ICdyb290JyAmJiBub2RlLnR5cGUgIT09ICdkb2N1bWVudCcgJiYgIW5vZGUucGFyZW50KSB7XG4gICAgICBzdGFjay5wb3AoKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHZpc2l0b3JzLmxlbmd0aCA+IDAgJiYgdmlzaXQudmlzaXRvckluZGV4IDwgdmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgICBsZXQgW3BsdWdpbiwgdmlzaXRvcl0gPSB2aXNpdG9yc1t2aXNpdC52aXNpdG9ySW5kZXhdXG4gICAgICB2aXNpdC52aXNpdG9ySW5kZXggKz0gMVxuICAgICAgaWYgKHZpc2l0LnZpc2l0b3JJbmRleCA9PT0gdmlzaXRvcnMubGVuZ3RoKSB7XG4gICAgICAgIHZpc2l0LnZpc2l0b3JzID0gW11cbiAgICAgICAgdmlzaXQudmlzaXRvckluZGV4ID0gMFxuICAgICAgfVxuICAgICAgdGhpcy5yZXN1bHQubGFzdFBsdWdpbiA9IHBsdWdpblxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHZpc2l0b3Iobm9kZS50b1Byb3h5KCksIHRoaXMuaGVscGVycylcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgdGhpcy5oYW5kbGVFcnJvcihlLCBub2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2aXNpdC5pdGVyYXRvciAhPT0gMCkge1xuICAgICAgbGV0IGl0ZXJhdG9yID0gdmlzaXQuaXRlcmF0b3JcbiAgICAgIGxldCBjaGlsZFxuICAgICAgd2hpbGUgKChjaGlsZCA9IG5vZGUubm9kZXNbbm9kZS5pbmRleGVzW2l0ZXJhdG9yXV0pKSB7XG4gICAgICAgIG5vZGUuaW5kZXhlc1tpdGVyYXRvcl0gKz0gMVxuICAgICAgICBpZiAoIWNoaWxkW2lzQ2xlYW5dKSB7XG4gICAgICAgICAgY2hpbGRbaXNDbGVhbl0gPSB0cnVlXG4gICAgICAgICAgc3RhY2sucHVzaCh0b1N0YWNrKGNoaWxkKSlcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlzaXQuaXRlcmF0b3IgPSAwXG4gICAgICBkZWxldGUgbm9kZS5pbmRleGVzW2l0ZXJhdG9yXVxuICAgIH1cblxuICAgIGxldCBldmVudHMgPSB2aXNpdC5ldmVudHNcbiAgICB3aGlsZSAodmlzaXQuZXZlbnRJbmRleCA8IGV2ZW50cy5sZW5ndGgpIHtcbiAgICAgIGxldCBldmVudCA9IGV2ZW50c1t2aXNpdC5ldmVudEluZGV4XVxuICAgICAgdmlzaXQuZXZlbnRJbmRleCArPSAxXG4gICAgICBpZiAoZXZlbnQgPT09IENISUxEUkVOKSB7XG4gICAgICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUubm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgbm9kZVtpc0NsZWFuXSA9IHRydWVcbiAgICAgICAgICB2aXNpdC5pdGVyYXRvciA9IG5vZGUuZ2V0SXRlcmF0b3IoKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuICAgICAgfSBlbHNlIGlmICh0aGlzLmxpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgdmlzaXQudmlzaXRvcnMgPSB0aGlzLmxpc3RlbmVyc1tldmVudF1cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgfVxuICAgIHN0YWNrLnBvcCgpXG4gIH1cbn1cblxuTGF6eVJlc3VsdC5yZWdpc3RlclBvc3Rjc3MgPSBkZXBlbmRhbnQgPT4ge1xuICBwb3N0Y3NzID0gZGVwZW5kYW50XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTGF6eVJlc3VsdFxuTGF6eVJlc3VsdC5kZWZhdWx0ID0gTGF6eVJlc3VsdFxuXG5Sb290LnJlZ2lzdGVyTGF6eVJlc3VsdChMYXp5UmVzdWx0KVxuRG9jdW1lbnQucmVnaXN0ZXJMYXp5UmVzdWx0KExhenlSZXN1bHQpXG4iLCIndXNlIHN0cmljdCdcblxubGV0IGxpc3QgPSB7XG4gIHNwbGl0KHN0cmluZywgc2VwYXJhdG9ycywgbGFzdCkge1xuICAgIGxldCBhcnJheSA9IFtdXG4gICAgbGV0IGN1cnJlbnQgPSAnJ1xuICAgIGxldCBzcGxpdCA9IGZhbHNlXG5cbiAgICBsZXQgZnVuYyA9IDBcbiAgICBsZXQgcXVvdGUgPSBmYWxzZVxuICAgIGxldCBlc2NhcGUgPSBmYWxzZVxuXG4gICAgZm9yIChsZXQgbGV0dGVyIG9mIHN0cmluZykge1xuICAgICAgaWYgKGVzY2FwZSkge1xuICAgICAgICBlc2NhcGUgPSBmYWxzZVxuICAgICAgfSBlbHNlIGlmIChsZXR0ZXIgPT09ICdcXFxcJykge1xuICAgICAgICBlc2NhcGUgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHF1b3RlKSB7XG4gICAgICAgIGlmIChsZXR0ZXIgPT09IHF1b3RlKSB7XG4gICAgICAgICAgcXVvdGUgPSBmYWxzZVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGxldHRlciA9PT0gJ1wiJyB8fCBsZXR0ZXIgPT09IFwiJ1wiKSB7XG4gICAgICAgIHF1b3RlID0gbGV0dGVyXG4gICAgICB9IGVsc2UgaWYgKGxldHRlciA9PT0gJygnKSB7XG4gICAgICAgIGZ1bmMgKz0gMVxuICAgICAgfSBlbHNlIGlmIChsZXR0ZXIgPT09ICcpJykge1xuICAgICAgICBpZiAoZnVuYyA+IDApIGZ1bmMgLT0gMVxuICAgICAgfSBlbHNlIGlmIChmdW5jID09PSAwKSB7XG4gICAgICAgIGlmIChzZXBhcmF0b3JzLmluY2x1ZGVzKGxldHRlcikpIHNwbGl0ID0gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAoc3BsaXQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQgIT09ICcnKSBhcnJheS5wdXNoKGN1cnJlbnQudHJpbSgpKVxuICAgICAgICBjdXJyZW50ID0gJydcbiAgICAgICAgc3BsaXQgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudCArPSBsZXR0ZXJcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobGFzdCB8fCBjdXJyZW50ICE9PSAnJykgYXJyYXkucHVzaChjdXJyZW50LnRyaW0oKSlcbiAgICByZXR1cm4gYXJyYXlcbiAgfSxcblxuICBzcGFjZShzdHJpbmcpIHtcbiAgICBsZXQgc3BhY2VzID0gWycgJywgJ1xcbicsICdcXHQnXVxuICAgIHJldHVybiBsaXN0LnNwbGl0KHN0cmluZywgc3BhY2VzKVxuICB9LFxuXG4gIGNvbW1hKHN0cmluZykge1xuICAgIHJldHVybiBsaXN0LnNwbGl0KHN0cmluZywgWycsJ10sIHRydWUpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsaXN0XG5saXN0LmRlZmF1bHQgPSBsaXN0XG4iLCIndXNlIHN0cmljdCdcblxubGV0IHsgU291cmNlTWFwQ29uc3VtZXIsIFNvdXJjZU1hcEdlbmVyYXRvciB9ID0gcmVxdWlyZSgnc291cmNlLW1hcC1qcycpXG5sZXQgeyBkaXJuYW1lLCByZXNvbHZlLCByZWxhdGl2ZSwgc2VwIH0gPSByZXF1aXJlKCdwYXRoJylcbmxldCB7IHBhdGhUb0ZpbGVVUkwgfSA9IHJlcXVpcmUoJ3VybCcpXG5cbmxldCBJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXQnKVxuXG5sZXQgc291cmNlTWFwQXZhaWxhYmxlID0gQm9vbGVhbihTb3VyY2VNYXBDb25zdW1lciAmJiBTb3VyY2VNYXBHZW5lcmF0b3IpXG5sZXQgcGF0aEF2YWlsYWJsZSA9IEJvb2xlYW4oZGlybmFtZSAmJiByZXNvbHZlICYmIHJlbGF0aXZlICYmIHNlcClcblxuY2xhc3MgTWFwR2VuZXJhdG9yIHtcbiAgY29uc3RydWN0b3Ioc3RyaW5naWZ5LCByb290LCBvcHRzLCBjc3NTdHJpbmcpIHtcbiAgICB0aGlzLnN0cmluZ2lmeSA9IHN0cmluZ2lmeVxuICAgIHRoaXMubWFwT3B0cyA9IG9wdHMubWFwIHx8IHt9XG4gICAgdGhpcy5yb290ID0gcm9vdFxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLmNzcyA9IGNzc1N0cmluZ1xuICB9XG5cbiAgaXNNYXAoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdHMubWFwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuICEhdGhpcy5vcHRzLm1hcFxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91cygpLmxlbmd0aCA+IDBcbiAgfVxuXG4gIHByZXZpb3VzKCkge1xuICAgIGlmICghdGhpcy5wcmV2aW91c01hcHMpIHtcbiAgICAgIHRoaXMucHJldmlvdXNNYXBzID0gW11cbiAgICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgdGhpcy5yb290LndhbGsobm9kZSA9PiB7XG4gICAgICAgICAgaWYgKG5vZGUuc291cmNlICYmIG5vZGUuc291cmNlLmlucHV0Lm1hcCkge1xuICAgICAgICAgICAgbGV0IG1hcCA9IG5vZGUuc291cmNlLmlucHV0Lm1hcFxuICAgICAgICAgICAgaWYgKCF0aGlzLnByZXZpb3VzTWFwcy5pbmNsdWRlcyhtYXApKSB7XG4gICAgICAgICAgICAgIHRoaXMucHJldmlvdXNNYXBzLnB1c2gobWFwKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBpbnB1dCA9IG5ldyBJbnB1dCh0aGlzLmNzcywgdGhpcy5vcHRzKVxuICAgICAgICBpZiAoaW5wdXQubWFwKSB0aGlzLnByZXZpb3VzTWFwcy5wdXNoKGlucHV0Lm1hcClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcmV2aW91c01hcHNcbiAgfVxuXG4gIGlzSW5saW5lKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5tYXBPcHRzLmlubGluZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcE9wdHMuaW5saW5lXG4gICAgfVxuXG4gICAgbGV0IGFubm90YXRpb24gPSB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvblxuICAgIGlmICh0eXBlb2YgYW5ub3RhdGlvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgYW5ub3RhdGlvbiAhPT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJldmlvdXMoKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkuc29tZShpID0+IGkuaW5saW5lKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaXNTb3VyY2VzQ29udGVudCgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMubWFwT3B0cy5zb3VyY2VzQ29udGVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcE9wdHMuc291cmNlc0NvbnRlbnRcbiAgICB9XG4gICAgaWYgKHRoaXMucHJldmlvdXMoKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnByZXZpb3VzKCkuc29tZShpID0+IGkud2l0aENvbnRlbnQoKSlcbiAgICB9XG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGNsZWFyQW5ub3RhdGlvbigpIHtcbiAgICBpZiAodGhpcy5tYXBPcHRzLmFubm90YXRpb24gPT09IGZhbHNlKSByZXR1cm5cblxuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgIGxldCBub2RlXG4gICAgICBmb3IgKGxldCBpID0gdGhpcy5yb290Lm5vZGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIG5vZGUgPSB0aGlzLnJvb3Qubm9kZXNbaV1cbiAgICAgICAgaWYgKG5vZGUudHlwZSAhPT0gJ2NvbW1lbnQnKSBjb250aW51ZVxuICAgICAgICBpZiAobm9kZS50ZXh0LmluZGV4T2YoJyMgc291cmNlTWFwcGluZ1VSTD0nKSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMucm9vdC5yZW1vdmVDaGlsZChpKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0aGlzLmNzcykge1xuICAgICAgdGhpcy5jc3MgPSB0aGlzLmNzcy5yZXBsYWNlKC8oXFxuKT9cXC9cXCojW1xcU1xcc10qP1xcKlxcLyQvZ20sICcnKVxuICAgIH1cbiAgfVxuXG4gIHNldFNvdXJjZXNDb250ZW50KCkge1xuICAgIGxldCBhbHJlYWR5ID0ge31cbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICB0aGlzLnJvb3Qud2Fsayhub2RlID0+IHtcbiAgICAgICAgaWYgKG5vZGUuc291cmNlKSB7XG4gICAgICAgICAgbGV0IGZyb20gPSBub2RlLnNvdXJjZS5pbnB1dC5mcm9tXG4gICAgICAgICAgaWYgKGZyb20gJiYgIWFscmVhZHlbZnJvbV0pIHtcbiAgICAgICAgICAgIGFscmVhZHlbZnJvbV0gPSB0cnVlXG4gICAgICAgICAgICB0aGlzLm1hcC5zZXRTb3VyY2VDb250ZW50KFxuICAgICAgICAgICAgICB0aGlzLnRvVXJsKHRoaXMucGF0aChmcm9tKSksXG4gICAgICAgICAgICAgIG5vZGUuc291cmNlLmlucHV0LmNzc1xuICAgICAgICAgICAgKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3NzKSB7XG4gICAgICBsZXQgZnJvbSA9IHRoaXMub3B0cy5mcm9tXG4gICAgICAgID8gdGhpcy50b1VybCh0aGlzLnBhdGgodGhpcy5vcHRzLmZyb20pKVxuICAgICAgICA6ICc8bm8gc291cmNlPidcbiAgICAgIHRoaXMubWFwLnNldFNvdXJjZUNvbnRlbnQoZnJvbSwgdGhpcy5jc3MpXG4gICAgfVxuICB9XG5cbiAgYXBwbHlQcmV2TWFwcygpIHtcbiAgICBmb3IgKGxldCBwcmV2IG9mIHRoaXMucHJldmlvdXMoKSkge1xuICAgICAgbGV0IGZyb20gPSB0aGlzLnRvVXJsKHRoaXMucGF0aChwcmV2LmZpbGUpKVxuICAgICAgbGV0IHJvb3QgPSBwcmV2LnJvb3QgfHwgZGlybmFtZShwcmV2LmZpbGUpXG4gICAgICBsZXQgbWFwXG5cbiAgICAgIGlmICh0aGlzLm1hcE9wdHMuc291cmNlc0NvbnRlbnQgPT09IGZhbHNlKSB7XG4gICAgICAgIG1hcCA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcihwcmV2LnRleHQpXG4gICAgICAgIGlmIChtYXAuc291cmNlc0NvbnRlbnQpIHtcbiAgICAgICAgICBtYXAuc291cmNlc0NvbnRlbnQgPSBtYXAuc291cmNlc0NvbnRlbnQubWFwKCgpID0+IG51bGwpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcCA9IHByZXYuY29uc3VtZXIoKVxuICAgICAgfVxuXG4gICAgICB0aGlzLm1hcC5hcHBseVNvdXJjZU1hcChtYXAsIGZyb20sIHRoaXMudG9VcmwodGhpcy5wYXRoKHJvb3QpKSlcbiAgICB9XG4gIH1cblxuICBpc0Fubm90YXRpb24oKSB7XG4gICAgaWYgKHRoaXMuaXNJbmxpbmUoKSkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvblxuICAgIH1cbiAgICBpZiAodGhpcy5wcmV2aW91cygpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJldmlvdXMoKS5zb21lKGkgPT4gaS5hbm5vdGF0aW9uKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgdG9CYXNlNjQoc3RyKSB7XG4gICAgaWYgKEJ1ZmZlcikge1xuICAgICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHN0cikudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB3aW5kb3cuYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoc3RyKSkpXG4gICAgfVxuICB9XG5cbiAgYWRkQW5ub3RhdGlvbigpIHtcbiAgICBsZXQgY29udGVudFxuXG4gICAgaWYgKHRoaXMuaXNJbmxpbmUoKSkge1xuICAgICAgY29udGVudCA9XG4gICAgICAgICdkYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LCcgKyB0aGlzLnRvQmFzZTY0KHRoaXMubWFwLnRvU3RyaW5nKCkpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdGhpcy5tYXBPcHRzLmFubm90YXRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZW50ID0gdGhpcy5tYXBPcHRzLmFubm90YXRpb25cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLm1hcE9wdHMuYW5ub3RhdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29udGVudCA9IHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uKHRoaXMub3B0cy50bywgdGhpcy5yb290KVxuICAgIH0gZWxzZSB7XG4gICAgICBjb250ZW50ID0gdGhpcy5vdXRwdXRGaWxlKCkgKyAnLm1hcCdcbiAgICB9XG4gICAgbGV0IGVvbCA9ICdcXG4nXG4gICAgaWYgKHRoaXMuY3NzLmluY2x1ZGVzKCdcXHJcXG4nKSkgZW9sID0gJ1xcclxcbidcblxuICAgIHRoaXMuY3NzICs9IGVvbCArICcvKiMgc291cmNlTWFwcGluZ1VSTD0nICsgY29udGVudCArICcgKi8nXG4gIH1cblxuICBvdXRwdXRGaWxlKCkge1xuICAgIGlmICh0aGlzLm9wdHMudG8pIHtcbiAgICAgIHJldHVybiB0aGlzLnBhdGgodGhpcy5vcHRzLnRvKVxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRzLmZyb20pIHtcbiAgICAgIHJldHVybiB0aGlzLnBhdGgodGhpcy5vcHRzLmZyb20pXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAndG8uY3NzJ1xuICAgIH1cbiAgfVxuXG4gIGdlbmVyYXRlTWFwKCkge1xuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVTdHJpbmcoKVxuICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2aW91cygpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGV0IHByZXYgPSB0aGlzLnByZXZpb3VzKClbMF0uY29uc3VtZXIoKVxuICAgICAgcHJldi5maWxlID0gdGhpcy5vdXRwdXRGaWxlKClcbiAgICAgIHRoaXMubWFwID0gU291cmNlTWFwR2VuZXJhdG9yLmZyb21Tb3VyY2VNYXAocHJldilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXAgPSBuZXcgU291cmNlTWFwR2VuZXJhdG9yKHsgZmlsZTogdGhpcy5vdXRwdXRGaWxlKCkgfSlcbiAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcoe1xuICAgICAgICBzb3VyY2U6IHRoaXMub3B0cy5mcm9tXG4gICAgICAgICAgPyB0aGlzLnRvVXJsKHRoaXMucGF0aCh0aGlzLm9wdHMuZnJvbSkpXG4gICAgICAgICAgOiAnPG5vIHNvdXJjZT4nLFxuICAgICAgICBnZW5lcmF0ZWQ6IHsgbGluZTogMSwgY29sdW1uOiAwIH0sXG4gICAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IDEsIGNvbHVtbjogMCB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzU291cmNlc0NvbnRlbnQoKSkgdGhpcy5zZXRTb3VyY2VzQ29udGVudCgpXG4gICAgaWYgKHRoaXMucm9vdCAmJiB0aGlzLnByZXZpb3VzKCkubGVuZ3RoID4gMCkgdGhpcy5hcHBseVByZXZNYXBzKClcbiAgICBpZiAodGhpcy5pc0Fubm90YXRpb24oKSkgdGhpcy5hZGRBbm5vdGF0aW9uKClcblxuICAgIGlmICh0aGlzLmlzSW5saW5lKCkpIHtcbiAgICAgIHJldHVybiBbdGhpcy5jc3NdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbdGhpcy5jc3MsIHRoaXMubWFwXVxuICAgIH1cbiAgfVxuXG4gIHBhdGgoZmlsZSkge1xuICAgIGlmIChmaWxlLmluZGV4T2YoJzwnKSA9PT0gMCkgcmV0dXJuIGZpbGVcbiAgICBpZiAoL15cXHcrOlxcL1xcLy8udGVzdChmaWxlKSkgcmV0dXJuIGZpbGVcbiAgICBpZiAodGhpcy5tYXBPcHRzLmFic29sdXRlKSByZXR1cm4gZmlsZVxuXG4gICAgbGV0IGZyb20gPSB0aGlzLm9wdHMudG8gPyBkaXJuYW1lKHRoaXMub3B0cy50bykgOiAnLidcblxuICAgIGlmICh0eXBlb2YgdGhpcy5tYXBPcHRzLmFubm90YXRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICBmcm9tID0gZGlybmFtZShyZXNvbHZlKGZyb20sIHRoaXMubWFwT3B0cy5hbm5vdGF0aW9uKSlcbiAgICB9XG5cbiAgICBmaWxlID0gcmVsYXRpdmUoZnJvbSwgZmlsZSlcbiAgICByZXR1cm4gZmlsZVxuICB9XG5cbiAgdG9VcmwocGF0aCkge1xuICAgIGlmIChzZXAgPT09ICdcXFxcJykge1xuICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpXG4gICAgfVxuICAgIHJldHVybiBlbmNvZGVVUkkocGF0aCkucmVwbGFjZSgvWyM/XS9nLCBlbmNvZGVVUklDb21wb25lbnQpXG4gIH1cblxuICBzb3VyY2VQYXRoKG5vZGUpIHtcbiAgICBpZiAodGhpcy5tYXBPcHRzLmZyb20pIHtcbiAgICAgIHJldHVybiB0aGlzLnRvVXJsKHRoaXMubWFwT3B0cy5mcm9tKVxuICAgIH0gZWxzZSBpZiAodGhpcy5tYXBPcHRzLmFic29sdXRlKSB7XG4gICAgICBpZiAocGF0aFRvRmlsZVVSTCkge1xuICAgICAgICByZXR1cm4gcGF0aFRvRmlsZVVSTChub2RlLnNvdXJjZS5pbnB1dC5mcm9tKS50b1N0cmluZygpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ2BtYXAuYWJzb2x1dGVgIG9wdGlvbiBpcyBub3QgYXZhaWxhYmxlIGluIHRoaXMgUG9zdENTUyBidWlsZCdcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy50b1VybCh0aGlzLnBhdGgobm9kZS5zb3VyY2UuaW5wdXQuZnJvbSkpXG4gICAgfVxuICB9XG5cbiAgZ2VuZXJhdGVTdHJpbmcoKSB7XG4gICAgdGhpcy5jc3MgPSAnJ1xuICAgIHRoaXMubWFwID0gbmV3IFNvdXJjZU1hcEdlbmVyYXRvcih7IGZpbGU6IHRoaXMub3V0cHV0RmlsZSgpIH0pXG5cbiAgICBsZXQgbGluZSA9IDFcbiAgICBsZXQgY29sdW1uID0gMVxuXG4gICAgbGV0IG5vU291cmNlID0gJzxubyBzb3VyY2U+J1xuICAgIGxldCBtYXBwaW5nID0ge1xuICAgICAgc291cmNlOiAnJyxcbiAgICAgIGdlbmVyYXRlZDogeyBsaW5lOiAwLCBjb2x1bW46IDAgfSxcbiAgICAgIG9yaWdpbmFsOiB7IGxpbmU6IDAsIGNvbHVtbjogMCB9XG4gICAgfVxuXG4gICAgbGV0IGxpbmVzLCBsYXN0XG4gICAgdGhpcy5zdHJpbmdpZnkodGhpcy5yb290LCAoc3RyLCBub2RlLCB0eXBlKSA9PiB7XG4gICAgICB0aGlzLmNzcyArPSBzdHJcblxuICAgICAgaWYgKG5vZGUgJiYgdHlwZSAhPT0gJ2VuZCcpIHtcbiAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWQubGluZSA9IGxpbmVcbiAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWQuY29sdW1uID0gY29sdW1uIC0gMVxuICAgICAgICBpZiAobm9kZS5zb3VyY2UgJiYgbm9kZS5zb3VyY2Uuc3RhcnQpIHtcbiAgICAgICAgICBtYXBwaW5nLnNvdXJjZSA9IHRoaXMuc291cmNlUGF0aChub2RlKVxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWwubGluZSA9IG5vZGUuc291cmNlLnN0YXJ0LmxpbmVcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsLmNvbHVtbiA9IG5vZGUuc291cmNlLnN0YXJ0LmNvbHVtbiAtIDFcbiAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKG1hcHBpbmcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSBub1NvdXJjZVxuICAgICAgICAgIG1hcHBpbmcub3JpZ2luYWwubGluZSA9IDFcbiAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsLmNvbHVtbiA9IDBcbiAgICAgICAgICB0aGlzLm1hcC5hZGRNYXBwaW5nKG1hcHBpbmcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZXMgPSBzdHIubWF0Y2goL1xcbi9nKVxuICAgICAgaWYgKGxpbmVzKSB7XG4gICAgICAgIGxpbmUgKz0gbGluZXMubGVuZ3RoXG4gICAgICAgIGxhc3QgPSBzdHIubGFzdEluZGV4T2YoJ1xcbicpXG4gICAgICAgIGNvbHVtbiA9IHN0ci5sZW5ndGggLSBsYXN0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2x1bW4gKz0gc3RyLmxlbmd0aFxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZSAmJiB0eXBlICE9PSAnc3RhcnQnKSB7XG4gICAgICAgIGxldCBwID0gbm9kZS5wYXJlbnQgfHwgeyByYXdzOiB7fSB9XG4gICAgICAgIGlmIChub2RlLnR5cGUgIT09ICdkZWNsJyB8fCBub2RlICE9PSBwLmxhc3QgfHwgcC5yYXdzLnNlbWljb2xvbikge1xuICAgICAgICAgIGlmIChub2RlLnNvdXJjZSAmJiBub2RlLnNvdXJjZS5lbmQpIHtcbiAgICAgICAgICAgIG1hcHBpbmcuc291cmNlID0gdGhpcy5zb3VyY2VQYXRoKG5vZGUpXG4gICAgICAgICAgICBtYXBwaW5nLm9yaWdpbmFsLmxpbmUgPSBub2RlLnNvdXJjZS5lbmQubGluZVxuICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbC5jb2x1bW4gPSBub2RlLnNvdXJjZS5lbmQuY29sdW1uIC0gMVxuICAgICAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWQubGluZSA9IGxpbmVcbiAgICAgICAgICAgIG1hcHBpbmcuZ2VuZXJhdGVkLmNvbHVtbiA9IGNvbHVtbiAtIDJcbiAgICAgICAgICAgIHRoaXMubWFwLmFkZE1hcHBpbmcobWFwcGluZylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFwcGluZy5zb3VyY2UgPSBub1NvdXJjZVxuICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbC5saW5lID0gMVxuICAgICAgICAgICAgbWFwcGluZy5vcmlnaW5hbC5jb2x1bW4gPSAwXG4gICAgICAgICAgICBtYXBwaW5nLmdlbmVyYXRlZC5saW5lID0gbGluZVxuICAgICAgICAgICAgbWFwcGluZy5nZW5lcmF0ZWQuY29sdW1uID0gY29sdW1uIC0gMVxuICAgICAgICAgICAgdGhpcy5tYXAuYWRkTWFwcGluZyhtYXBwaW5nKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZW5lcmF0ZSgpIHtcbiAgICB0aGlzLmNsZWFyQW5ub3RhdGlvbigpXG4gICAgaWYgKHBhdGhBdmFpbGFibGUgJiYgc291cmNlTWFwQXZhaWxhYmxlICYmIHRoaXMuaXNNYXAoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVNYXAoKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgcmVzdWx0ID0gJydcbiAgICAgIHRoaXMuc3RyaW5naWZ5KHRoaXMucm9vdCwgaSA9PiB7XG4gICAgICAgIHJlc3VsdCArPSBpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIFtyZXN1bHRdXG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwR2VuZXJhdG9yXG4iLCIndXNlIHN0cmljdCdcblxubGV0IE1hcEdlbmVyYXRvciA9IHJlcXVpcmUoJy4vbWFwLWdlbmVyYXRvcicpXG5sZXQgc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnknKVxubGV0IHdhcm5PbmNlID0gcmVxdWlyZSgnLi93YXJuLW9uY2UnKVxubGV0IHBhcnNlID0gcmVxdWlyZSgnLi9wYXJzZScpXG5jb25zdCBSZXN1bHQgPSByZXF1aXJlKCcuL3Jlc3VsdCcpXG5cbmNsYXNzIE5vV29ya1Jlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHByb2Nlc3NvciwgY3NzLCBvcHRzKSB7XG4gICAgY3NzID0gY3NzLnRvU3RyaW5nKClcbiAgICB0aGlzLnN0cmluZ2lmaWVkID0gZmFsc2VcblxuICAgIHRoaXMuX3Byb2Nlc3NvciA9IHByb2Nlc3NvclxuICAgIHRoaXMuX2NzcyA9IGNzc1xuICAgIHRoaXMuX29wdHMgPSBvcHRzXG4gICAgdGhpcy5fbWFwID0gdW5kZWZpbmVkXG4gICAgbGV0IHJvb3RcblxuICAgIGxldCBzdHIgPSBzdHJpbmdpZnlcbiAgICB0aGlzLnJlc3VsdCA9IG5ldyBSZXN1bHQodGhpcy5fcHJvY2Vzc29yLCByb290LCB0aGlzLl9vcHRzKVxuICAgIHRoaXMucmVzdWx0LmNzcyA9IGNzc1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMucmVzdWx0LCAncm9vdCcsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYucm9vdFxuICAgICAgfVxuICAgIH0pXG5cbiAgICBsZXQgbWFwID0gbmV3IE1hcEdlbmVyYXRvcihzdHIsIHJvb3QsIHRoaXMuX29wdHMsIGNzcylcbiAgICBpZiAobWFwLmlzTWFwKCkpIHtcbiAgICAgIGxldCBbZ2VuZXJhdGVkQ1NTLCBnZW5lcmF0ZWRNYXBdID0gbWFwLmdlbmVyYXRlKClcbiAgICAgIGlmIChnZW5lcmF0ZWRDU1MpIHtcbiAgICAgICAgdGhpcy5yZXN1bHQuY3NzID0gZ2VuZXJhdGVkQ1NTXG4gICAgICB9XG4gICAgICBpZiAoZ2VuZXJhdGVkTWFwKSB7XG4gICAgICAgIHRoaXMucmVzdWx0Lm1hcCA9IGdlbmVyYXRlZE1hcFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICByZXR1cm4gJ05vV29ya1Jlc3VsdCdcbiAgfVxuXG4gIGdldCBwcm9jZXNzb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0LnByb2Nlc3NvclxuICB9XG5cbiAgZ2V0IG9wdHMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0Lm9wdHNcbiAgfVxuXG4gIGdldCBjc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0LmNzc1xuICB9XG5cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzdWx0LmNzc1xuICB9XG5cbiAgZ2V0IG1hcCgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXN1bHQubWFwXG4gIH1cblxuICBnZXQgcm9vdCgpIHtcbiAgICBpZiAodGhpcy5fcm9vdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3Jvb3RcbiAgICB9XG5cbiAgICBsZXQgcm9vdFxuICAgIGxldCBwYXJzZXIgPSBwYXJzZVxuXG4gICAgdHJ5IHtcbiAgICAgIHJvb3QgPSBwYXJzZXIodGhpcy5fY3NzLCB0aGlzLl9vcHRzKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aGlzLmVycm9yID0gZXJyb3JcbiAgICB9XG5cbiAgICB0aGlzLl9yb290ID0gcm9vdFxuXG4gICAgcmV0dXJuIHJvb3RcbiAgfVxuXG4gIGdldCBtZXNzYWdlcygpIHtcbiAgICByZXR1cm4gW11cbiAgfVxuXG4gIHdhcm5pbmdzKCkge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Nzc1xuICB9XG5cbiAgdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBpZiAoISgnZnJvbScgaW4gdGhpcy5fb3B0cykpIHtcbiAgICAgICAgd2Fybk9uY2UoXG4gICAgICAgICAgJ1dpdGhvdXQgYGZyb21gIG9wdGlvbiBQb3N0Q1NTIGNvdWxkIGdlbmVyYXRlIHdyb25nIHNvdXJjZSBtYXAgJyArXG4gICAgICAgICAgICAnYW5kIHdpbGwgbm90IGZpbmQgQnJvd3NlcnNsaXN0IGNvbmZpZy4gU2V0IGl0IHRvIENTUyBmaWxlIHBhdGggJyArXG4gICAgICAgICAgICAnb3IgdG8gYHVuZGVmaW5lZGAgdG8gcHJldmVudCB0aGlzIHdhcm5pbmcuJ1xuICAgICAgICApXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuYXN5bmMoKS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICB9XG5cbiAgY2F0Y2gob25SZWplY3RlZCkge1xuICAgIHJldHVybiB0aGlzLmFzeW5jKCkuY2F0Y2gob25SZWplY3RlZClcbiAgfVxuXG4gIGZpbmFsbHkob25GaW5hbGx5KSB7XG4gICAgcmV0dXJuIHRoaXMuYXN5bmMoKS50aGVuKG9uRmluYWxseSwgb25GaW5hbGx5KVxuICB9XG5cbiAgYXN5bmMoKSB7XG4gICAgaWYgKHRoaXMuZXJyb3IpIHJldHVybiBQcm9taXNlLnJlamVjdCh0aGlzLmVycm9yKVxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5yZXN1bHQpXG4gIH1cblxuICBzeW5jKCkge1xuICAgIGlmICh0aGlzLmVycm9yKSB0aHJvdyB0aGlzLmVycm9yXG4gICAgcmV0dXJuIHRoaXMucmVzdWx0XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBOb1dvcmtSZXN1bHRcbk5vV29ya1Jlc3VsdC5kZWZhdWx0ID0gTm9Xb3JrUmVzdWx0XG4iLCIndXNlIHN0cmljdCdcblxubGV0IHsgaXNDbGVhbiwgbXkgfSA9IHJlcXVpcmUoJy4vc3ltYm9scycpXG5sZXQgQ3NzU3ludGF4RXJyb3IgPSByZXF1aXJlKCcuL2Nzcy1zeW50YXgtZXJyb3InKVxubGV0IFN0cmluZ2lmaWVyID0gcmVxdWlyZSgnLi9zdHJpbmdpZmllcicpXG5sZXQgc3RyaW5naWZ5ID0gcmVxdWlyZSgnLi9zdHJpbmdpZnknKVxuXG5mdW5jdGlvbiBjbG9uZU5vZGUob2JqLCBwYXJlbnQpIHtcbiAgbGV0IGNsb25lZCA9IG5ldyBvYmouY29uc3RydWN0b3IoKVxuXG4gIGZvciAobGV0IGkgaW4gb2JqKSB7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBpKSkge1xuICAgICAgLyogYzggaWdub3JlIG5leHQgMiAqL1xuICAgICAgY29udGludWVcbiAgICB9XG4gICAgaWYgKGkgPT09ICdwcm94eUNhY2hlJykgY29udGludWVcbiAgICBsZXQgdmFsdWUgPSBvYmpbaV1cbiAgICBsZXQgdHlwZSA9IHR5cGVvZiB2YWx1ZVxuXG4gICAgaWYgKGkgPT09ICdwYXJlbnQnICYmIHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAocGFyZW50KSBjbG9uZWRbaV0gPSBwYXJlbnRcbiAgICB9IGVsc2UgaWYgKGkgPT09ICdzb3VyY2UnKSB7XG4gICAgICBjbG9uZWRbaV0gPSB2YWx1ZVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNsb25lZFtpXSA9IHZhbHVlLm1hcChqID0+IGNsb25lTm9kZShqLCBjbG9uZWQpKVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwpIHZhbHVlID0gY2xvbmVOb2RlKHZhbHVlKVxuICAgICAgY2xvbmVkW2ldID0gdmFsdWVcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY2xvbmVkXG59XG5cbmNsYXNzIE5vZGUge1xuICBjb25zdHJ1Y3RvcihkZWZhdWx0cyA9IHt9KSB7XG4gICAgdGhpcy5yYXdzID0ge31cbiAgICB0aGlzW2lzQ2xlYW5dID0gZmFsc2VcbiAgICB0aGlzW215XSA9IHRydWVcblxuICAgIGZvciAobGV0IG5hbWUgaW4gZGVmYXVsdHMpIHtcbiAgICAgIGlmIChuYW1lID09PSAnbm9kZXMnKSB7XG4gICAgICAgIHRoaXMubm9kZXMgPSBbXVxuICAgICAgICBmb3IgKGxldCBub2RlIG9mIGRlZmF1bHRzW25hbWVdKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlLmNsb25lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZChub2RlLmNsb25lKCkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kKG5vZGUpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW25hbWVdID0gZGVmYXVsdHNbbmFtZV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnJvcihtZXNzYWdlLCBvcHRzID0ge30pIHtcbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgIGxldCB7IHN0YXJ0LCBlbmQgfSA9IHRoaXMucmFuZ2VCeShvcHRzKVxuICAgICAgcmV0dXJuIHRoaXMuc291cmNlLmlucHV0LmVycm9yKFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICB7IGxpbmU6IHN0YXJ0LmxpbmUsIGNvbHVtbjogc3RhcnQuY29sdW1uIH0sXG4gICAgICAgIHsgbGluZTogZW5kLmxpbmUsIGNvbHVtbjogZW5kLmNvbHVtbiB9LFxuICAgICAgICBvcHRzXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBuZXcgQ3NzU3ludGF4RXJyb3IobWVzc2FnZSlcbiAgfVxuXG4gIHdhcm4ocmVzdWx0LCB0ZXh0LCBvcHRzKSB7XG4gICAgbGV0IGRhdGEgPSB7IG5vZGU6IHRoaXMgfVxuICAgIGZvciAobGV0IGkgaW4gb3B0cykgZGF0YVtpXSA9IG9wdHNbaV1cbiAgICByZXR1cm4gcmVzdWx0Lndhcm4odGV4dCwgZGF0YSlcbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMpXG4gICAgfVxuICAgIHRoaXMucGFyZW50ID0gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHRvU3RyaW5nKHN0cmluZ2lmaWVyID0gc3RyaW5naWZ5KSB7XG4gICAgaWYgKHN0cmluZ2lmaWVyLnN0cmluZ2lmeSkgc3RyaW5naWZpZXIgPSBzdHJpbmdpZmllci5zdHJpbmdpZnlcbiAgICBsZXQgcmVzdWx0ID0gJydcbiAgICBzdHJpbmdpZmllcih0aGlzLCBpID0+IHtcbiAgICAgIHJlc3VsdCArPSBpXG4gICAgfSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBhc3NpZ24ob3ZlcnJpZGVzID0ge30pIHtcbiAgICBmb3IgKGxldCBuYW1lIGluIG92ZXJyaWRlcykge1xuICAgICAgdGhpc1tuYW1lXSA9IG92ZXJyaWRlc1tuYW1lXVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgY2xvbmUob3ZlcnJpZGVzID0ge30pIHtcbiAgICBsZXQgY2xvbmVkID0gY2xvbmVOb2RlKHRoaXMpXG4gICAgZm9yIChsZXQgbmFtZSBpbiBvdmVycmlkZXMpIHtcbiAgICAgIGNsb25lZFtuYW1lXSA9IG92ZXJyaWRlc1tuYW1lXVxuICAgIH1cbiAgICByZXR1cm4gY2xvbmVkXG4gIH1cblxuICBjbG9uZUJlZm9yZShvdmVycmlkZXMgPSB7fSkge1xuICAgIGxldCBjbG9uZWQgPSB0aGlzLmNsb25lKG92ZXJyaWRlcylcbiAgICB0aGlzLnBhcmVudC5pbnNlcnRCZWZvcmUodGhpcywgY2xvbmVkKVxuICAgIHJldHVybiBjbG9uZWRcbiAgfVxuXG4gIGNsb25lQWZ0ZXIob3ZlcnJpZGVzID0ge30pIHtcbiAgICBsZXQgY2xvbmVkID0gdGhpcy5jbG9uZShvdmVycmlkZXMpXG4gICAgdGhpcy5wYXJlbnQuaW5zZXJ0QWZ0ZXIodGhpcywgY2xvbmVkKVxuICAgIHJldHVybiBjbG9uZWRcbiAgfVxuXG4gIHJlcGxhY2VXaXRoKC4uLm5vZGVzKSB7XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBsZXQgYm9va21hcmsgPSB0aGlzXG4gICAgICBsZXQgZm91bmRTZWxmID0gZmFsc2VcbiAgICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgaWYgKG5vZGUgPT09IHRoaXMpIHtcbiAgICAgICAgICBmb3VuZFNlbGYgPSB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAoZm91bmRTZWxmKSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQuaW5zZXJ0QWZ0ZXIoYm9va21hcmssIG5vZGUpXG4gICAgICAgICAgYm9va21hcmsgPSBub2RlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQuaW5zZXJ0QmVmb3JlKGJvb2ttYXJrLCBub2RlKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmRTZWxmKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgbmV4dCgpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50KSByZXR1cm4gdW5kZWZpbmVkXG4gICAgbGV0IGluZGV4ID0gdGhpcy5wYXJlbnQuaW5kZXgodGhpcylcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQubm9kZXNbaW5kZXggKyAxXVxuICB9XG5cbiAgcHJldigpIHtcbiAgICBpZiAoIXRoaXMucGFyZW50KSByZXR1cm4gdW5kZWZpbmVkXG4gICAgbGV0IGluZGV4ID0gdGhpcy5wYXJlbnQuaW5kZXgodGhpcylcbiAgICByZXR1cm4gdGhpcy5wYXJlbnQubm9kZXNbaW5kZXggLSAxXVxuICB9XG5cbiAgYmVmb3JlKGFkZCkge1xuICAgIHRoaXMucGFyZW50Lmluc2VydEJlZm9yZSh0aGlzLCBhZGQpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIGFmdGVyKGFkZCkge1xuICAgIHRoaXMucGFyZW50Lmluc2VydEFmdGVyKHRoaXMsIGFkZClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcm9vdCgpIHtcbiAgICBsZXQgcmVzdWx0ID0gdGhpc1xuICAgIHdoaWxlIChyZXN1bHQucGFyZW50ICYmIHJlc3VsdC5wYXJlbnQudHlwZSAhPT0gJ2RvY3VtZW50Jykge1xuICAgICAgcmVzdWx0ID0gcmVzdWx0LnBhcmVudFxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICByYXcocHJvcCwgZGVmYXVsdFR5cGUpIHtcbiAgICBsZXQgc3RyID0gbmV3IFN0cmluZ2lmaWVyKClcbiAgICByZXR1cm4gc3RyLnJhdyh0aGlzLCBwcm9wLCBkZWZhdWx0VHlwZSlcbiAgfVxuXG4gIGNsZWFuUmF3cyhrZWVwQmV0d2Vlbikge1xuICAgIGRlbGV0ZSB0aGlzLnJhd3MuYmVmb3JlXG4gICAgZGVsZXRlIHRoaXMucmF3cy5hZnRlclxuICAgIGlmICgha2VlcEJldHdlZW4pIGRlbGV0ZSB0aGlzLnJhd3MuYmV0d2VlblxuICB9XG5cbiAgdG9KU09OKF8sIGlucHV0cykge1xuICAgIGxldCBmaXhlZCA9IHt9XG4gICAgbGV0IGVtaXRJbnB1dHMgPSBpbnB1dHMgPT0gbnVsbFxuICAgIGlucHV0cyA9IGlucHV0cyB8fCBuZXcgTWFwKClcbiAgICBsZXQgaW5wdXRzTmV4dEluZGV4ID0gMFxuXG4gICAgZm9yIChsZXQgbmFtZSBpbiB0aGlzKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLCBuYW1lKSkge1xuICAgICAgICAvKiBjOCBpZ25vcmUgbmV4dCAyICovXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG4gICAgICBpZiAobmFtZSA9PT0gJ3BhcmVudCcgfHwgbmFtZSA9PT0gJ3Byb3h5Q2FjaGUnKSBjb250aW51ZVxuICAgICAgbGV0IHZhbHVlID0gdGhpc1tuYW1lXVxuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgZml4ZWRbbmFtZV0gPSB2YWx1ZS5tYXAoaSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpID09PSAnb2JqZWN0JyAmJiBpLnRvSlNPTikge1xuICAgICAgICAgICAgcmV0dXJuIGkudG9KU09OKG51bGwsIGlucHV0cylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUudG9KU09OKSB7XG4gICAgICAgIGZpeGVkW25hbWVdID0gdmFsdWUudG9KU09OKG51bGwsIGlucHV0cylcbiAgICAgIH0gZWxzZSBpZiAobmFtZSA9PT0gJ3NvdXJjZScpIHtcbiAgICAgICAgbGV0IGlucHV0SWQgPSBpbnB1dHMuZ2V0KHZhbHVlLmlucHV0KVxuICAgICAgICBpZiAoaW5wdXRJZCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5wdXRJZCA9IGlucHV0c05leHRJbmRleFxuICAgICAgICAgIGlucHV0cy5zZXQodmFsdWUuaW5wdXQsIGlucHV0c05leHRJbmRleClcbiAgICAgICAgICBpbnB1dHNOZXh0SW5kZXgrK1xuICAgICAgICB9XG4gICAgICAgIGZpeGVkW25hbWVdID0ge1xuICAgICAgICAgIGlucHV0SWQsXG4gICAgICAgICAgc3RhcnQ6IHZhbHVlLnN0YXJ0LFxuICAgICAgICAgIGVuZDogdmFsdWUuZW5kXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpeGVkW25hbWVdID0gdmFsdWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZW1pdElucHV0cykge1xuICAgICAgZml4ZWQuaW5wdXRzID0gWy4uLmlucHV0cy5rZXlzKCldLm1hcChpbnB1dCA9PiBpbnB1dC50b0pTT04oKSlcbiAgICB9XG5cbiAgICByZXR1cm4gZml4ZWRcbiAgfVxuXG4gIHBvc2l0aW9uSW5zaWRlKGluZGV4KSB7XG4gICAgbGV0IHN0cmluZyA9IHRoaXMudG9TdHJpbmcoKVxuICAgIGxldCBjb2x1bW4gPSB0aGlzLnNvdXJjZS5zdGFydC5jb2x1bW5cbiAgICBsZXQgbGluZSA9IHRoaXMuc291cmNlLnN0YXJ0LmxpbmVcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xuICAgICAgaWYgKHN0cmluZ1tpXSA9PT0gJ1xcbicpIHtcbiAgICAgICAgY29sdW1uID0gMVxuICAgICAgICBsaW5lICs9IDFcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbHVtbiArPSAxXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbGluZSwgY29sdW1uIH1cbiAgfVxuXG4gIHBvc2l0aW9uQnkob3B0cykge1xuICAgIGxldCBwb3MgPSB0aGlzLnNvdXJjZS5zdGFydFxuICAgIGlmIChvcHRzLmluZGV4KSB7XG4gICAgICBwb3MgPSB0aGlzLnBvc2l0aW9uSW5zaWRlKG9wdHMuaW5kZXgpXG4gICAgfSBlbHNlIGlmIChvcHRzLndvcmQpIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMudG9TdHJpbmcoKS5pbmRleE9mKG9wdHMud29yZClcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHBvcyA9IHRoaXMucG9zaXRpb25JbnNpZGUoaW5kZXgpXG4gICAgfVxuICAgIHJldHVybiBwb3NcbiAgfVxuXG4gIHJhbmdlQnkob3B0cykge1xuICAgIGxldCBzdGFydCA9IHtcbiAgICAgIGxpbmU6IHRoaXMuc291cmNlLnN0YXJ0LmxpbmUsXG4gICAgICBjb2x1bW46IHRoaXMuc291cmNlLnN0YXJ0LmNvbHVtblxuICAgIH1cbiAgICBsZXQgZW5kID0gdGhpcy5zb3VyY2UuZW5kXG4gICAgICA/IHtcbiAgICAgICAgICBsaW5lOiB0aGlzLnNvdXJjZS5lbmQubGluZSxcbiAgICAgICAgICBjb2x1bW46IHRoaXMuc291cmNlLmVuZC5jb2x1bW4gKyAxXG4gICAgICAgIH1cbiAgICAgIDoge1xuICAgICAgICAgIGxpbmU6IHN0YXJ0LmxpbmUsXG4gICAgICAgICAgY29sdW1uOiBzdGFydC5jb2x1bW4gKyAxXG4gICAgICAgIH1cblxuICAgIGlmIChvcHRzLndvcmQpIHtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMudG9TdHJpbmcoKS5pbmRleE9mKG9wdHMud29yZClcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgc3RhcnQgPSB0aGlzLnBvc2l0aW9uSW5zaWRlKGluZGV4KVxuICAgICAgICBlbmQgPSB0aGlzLnBvc2l0aW9uSW5zaWRlKGluZGV4ICsgb3B0cy53b3JkLmxlbmd0aClcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9wdHMuc3RhcnQpIHtcbiAgICAgICAgc3RhcnQgPSB7XG4gICAgICAgICAgbGluZTogb3B0cy5zdGFydC5saW5lLFxuICAgICAgICAgIGNvbHVtbjogb3B0cy5zdGFydC5jb2x1bW5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvcHRzLmluZGV4KSB7XG4gICAgICAgIHN0YXJ0ID0gdGhpcy5wb3NpdGlvbkluc2lkZShvcHRzLmluZGV4KVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0cy5lbmQpIHtcbiAgICAgICAgZW5kID0ge1xuICAgICAgICAgIGxpbmU6IG9wdHMuZW5kLmxpbmUsXG4gICAgICAgICAgY29sdW1uOiBvcHRzLmVuZC5jb2x1bW5cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChvcHRzLmVuZEluZGV4KSB7XG4gICAgICAgIGVuZCA9IHRoaXMucG9zaXRpb25JbnNpZGUob3B0cy5lbmRJbmRleClcbiAgICAgIH0gZWxzZSBpZiAob3B0cy5pbmRleCkge1xuICAgICAgICBlbmQgPSB0aGlzLnBvc2l0aW9uSW5zaWRlKG9wdHMuaW5kZXggKyAxKVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGVuZC5saW5lIDwgc3RhcnQubGluZSB8fFxuICAgICAgKGVuZC5saW5lID09PSBzdGFydC5saW5lICYmIGVuZC5jb2x1bW4gPD0gc3RhcnQuY29sdW1uKVxuICAgICkge1xuICAgICAgZW5kID0geyBsaW5lOiBzdGFydC5saW5lLCBjb2x1bW46IHN0YXJ0LmNvbHVtbiArIDEgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHN0YXJ0LCBlbmQgfVxuICB9XG5cbiAgZ2V0UHJveHlQcm9jZXNzb3IoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNldChub2RlLCBwcm9wLCB2YWx1ZSkge1xuICAgICAgICBpZiAobm9kZVtwcm9wXSA9PT0gdmFsdWUpIHJldHVybiB0cnVlXG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgcHJvcCA9PT0gJ3Byb3AnIHx8XG4gICAgICAgICAgcHJvcCA9PT0gJ3ZhbHVlJyB8fFxuICAgICAgICAgIHByb3AgPT09ICduYW1lJyB8fFxuICAgICAgICAgIHByb3AgPT09ICdwYXJhbXMnIHx8XG4gICAgICAgICAgcHJvcCA9PT0gJ2ltcG9ydGFudCcgfHxcbiAgICAgICAgICAvKiBjOCBpZ25vcmUgbmV4dCAqL1xuICAgICAgICAgIHByb3AgPT09ICd0ZXh0J1xuICAgICAgICApIHtcbiAgICAgICAgICBub2RlLm1hcmtEaXJ0eSgpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0sXG5cbiAgICAgIGdldChub2RlLCBwcm9wKSB7XG4gICAgICAgIGlmIChwcm9wID09PSAncHJveHlPZicpIHtcbiAgICAgICAgICByZXR1cm4gbm9kZVxuICAgICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICdyb290Jykge1xuICAgICAgICAgIHJldHVybiAoKSA9PiBub2RlLnJvb3QoKS50b1Byb3h5KClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbm9kZVtwcm9wXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9Qcm94eSgpIHtcbiAgICBpZiAoIXRoaXMucHJveHlDYWNoZSkge1xuICAgICAgdGhpcy5wcm94eUNhY2hlID0gbmV3IFByb3h5KHRoaXMsIHRoaXMuZ2V0UHJveHlQcm9jZXNzb3IoKSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucHJveHlDYWNoZVxuICB9XG5cbiAgYWRkVG9FcnJvcihlcnJvcikge1xuICAgIGVycm9yLnBvc3Rjc3NOb2RlID0gdGhpc1xuICAgIGlmIChlcnJvci5zdGFjayAmJiB0aGlzLnNvdXJjZSAmJiAvXFxuXFxzezR9YXQgLy50ZXN0KGVycm9yLnN0YWNrKSkge1xuICAgICAgbGV0IHMgPSB0aGlzLnNvdXJjZVxuICAgICAgZXJyb3Iuc3RhY2sgPSBlcnJvci5zdGFjay5yZXBsYWNlKFxuICAgICAgICAvXFxuXFxzezR9YXQgLyxcbiAgICAgICAgYCQmJHtzLmlucHV0LmZyb219OiR7cy5zdGFydC5saW5lfToke3Muc3RhcnQuY29sdW1ufSQmYFxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gZXJyb3JcbiAgfVxuXG4gIG1hcmtEaXJ0eSgpIHtcbiAgICBpZiAodGhpc1tpc0NsZWFuXSkge1xuICAgICAgdGhpc1tpc0NsZWFuXSA9IGZhbHNlXG4gICAgICBsZXQgbmV4dCA9IHRoaXNcbiAgICAgIHdoaWxlICgobmV4dCA9IG5leHQucGFyZW50KSkge1xuICAgICAgICBuZXh0W2lzQ2xlYW5dID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXQgcHJveHlPZigpIHtcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9kZVxuTm9kZS5kZWZhdWx0ID0gTm9kZVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBDb250YWluZXIgPSByZXF1aXJlKCcuL2NvbnRhaW5lcicpXG5sZXQgUGFyc2VyID0gcmVxdWlyZSgnLi9wYXJzZXInKVxubGV0IElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpXG5cbmZ1bmN0aW9uIHBhcnNlKGNzcywgb3B0cykge1xuICBsZXQgaW5wdXQgPSBuZXcgSW5wdXQoY3NzLCBvcHRzKVxuICBsZXQgcGFyc2VyID0gbmV3IFBhcnNlcihpbnB1dClcbiAgdHJ5IHtcbiAgICBwYXJzZXIucGFyc2UoKVxuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChlLm5hbWUgPT09ICdDc3NTeW50YXhFcnJvcicgJiYgb3B0cyAmJiBvcHRzLmZyb20pIHtcbiAgICAgICAgaWYgKC9cXC5zY3NzJC9pLnRlc3Qob3B0cy5mcm9tKSkge1xuICAgICAgICAgIGUubWVzc2FnZSArPVxuICAgICAgICAgICAgJ1xcbllvdSB0cmllZCB0byBwYXJzZSBTQ1NTIHdpdGggJyArXG4gICAgICAgICAgICAndGhlIHN0YW5kYXJkIENTUyBwYXJzZXI7ICcgK1xuICAgICAgICAgICAgJ3RyeSBhZ2FpbiB3aXRoIHRoZSBwb3N0Y3NzLXNjc3MgcGFyc2VyJ1xuICAgICAgICB9IGVsc2UgaWYgKC9cXC5zYXNzL2kudGVzdChvcHRzLmZyb20pKSB7XG4gICAgICAgICAgZS5tZXNzYWdlICs9XG4gICAgICAgICAgICAnXFxuWW91IHRyaWVkIHRvIHBhcnNlIFNhc3Mgd2l0aCAnICtcbiAgICAgICAgICAgICd0aGUgc3RhbmRhcmQgQ1NTIHBhcnNlcjsgJyArXG4gICAgICAgICAgICAndHJ5IGFnYWluIHdpdGggdGhlIHBvc3Rjc3Mtc2FzcyBwYXJzZXInXG4gICAgICAgIH0gZWxzZSBpZiAoL1xcLmxlc3MkL2kudGVzdChvcHRzLmZyb20pKSB7XG4gICAgICAgICAgZS5tZXNzYWdlICs9XG4gICAgICAgICAgICAnXFxuWW91IHRyaWVkIHRvIHBhcnNlIExlc3Mgd2l0aCAnICtcbiAgICAgICAgICAgICd0aGUgc3RhbmRhcmQgQ1NTIHBhcnNlcjsgJyArXG4gICAgICAgICAgICAndHJ5IGFnYWluIHdpdGggdGhlIHBvc3Rjc3MtbGVzcyBwYXJzZXInXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgZVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlci5yb290XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGFyc2VcbnBhcnNlLmRlZmF1bHQgPSBwYXJzZVxuXG5Db250YWluZXIucmVnaXN0ZXJQYXJzZShwYXJzZSlcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgRGVjbGFyYXRpb24gPSByZXF1aXJlKCcuL2RlY2xhcmF0aW9uJylcbmxldCB0b2tlbml6ZXIgPSByZXF1aXJlKCcuL3Rva2VuaXplJylcbmxldCBDb21tZW50ID0gcmVxdWlyZSgnLi9jb21tZW50JylcbmxldCBBdFJ1bGUgPSByZXF1aXJlKCcuL2F0LXJ1bGUnKVxubGV0IFJvb3QgPSByZXF1aXJlKCcuL3Jvb3QnKVxubGV0IFJ1bGUgPSByZXF1aXJlKCcuL3J1bGUnKVxuXG5jbGFzcyBQYXJzZXIge1xuICBjb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgIHRoaXMuaW5wdXQgPSBpbnB1dFxuXG4gICAgdGhpcy5yb290ID0gbmV3IFJvb3QoKVxuICAgIHRoaXMuY3VycmVudCA9IHRoaXMucm9vdFxuICAgIHRoaXMuc3BhY2VzID0gJydcbiAgICB0aGlzLnNlbWljb2xvbiA9IGZhbHNlXG4gICAgdGhpcy5jdXN0b21Qcm9wZXJ0eSA9IGZhbHNlXG5cbiAgICB0aGlzLmNyZWF0ZVRva2VuaXplcigpXG4gICAgdGhpcy5yb290LnNvdXJjZSA9IHsgaW5wdXQsIHN0YXJ0OiB7IG9mZnNldDogMCwgbGluZTogMSwgY29sdW1uOiAxIH0gfVxuICB9XG5cbiAgY3JlYXRlVG9rZW5pemVyKCkge1xuICAgIHRoaXMudG9rZW5pemVyID0gdG9rZW5pemVyKHRoaXMuaW5wdXQpXG4gIH1cblxuICBwYXJzZSgpIHtcbiAgICBsZXQgdG9rZW5cbiAgICB3aGlsZSAoIXRoaXMudG9rZW5pemVyLmVuZE9mRmlsZSgpKSB7XG4gICAgICB0b2tlbiA9IHRoaXMudG9rZW5pemVyLm5leHRUb2tlbigpXG5cbiAgICAgIHN3aXRjaCAodG9rZW5bMF0pIHtcbiAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgIHRoaXMuc3BhY2VzICs9IHRva2VuWzFdXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICc7JzpcbiAgICAgICAgICB0aGlzLmZyZWVTZW1pY29sb24odG9rZW4pXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBjYXNlICd9JzpcbiAgICAgICAgICB0aGlzLmVuZCh0b2tlbilcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgICAgIHRoaXMuY29tbWVudCh0b2tlbilcbiAgICAgICAgICBicmVha1xuXG4gICAgICAgIGNhc2UgJ2F0LXdvcmQnOlxuICAgICAgICAgIHRoaXMuYXRydWxlKHRva2VuKVxuICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgdGhpcy5lbXB0eVJ1bGUodG9rZW4pXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMub3RoZXIodG9rZW4pXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5lbmRGaWxlKClcbiAgfVxuXG4gIGNvbW1lbnQodG9rZW4pIHtcbiAgICBsZXQgbm9kZSA9IG5ldyBDb21tZW50KClcbiAgICB0aGlzLmluaXQobm9kZSwgdG9rZW5bMl0pXG4gICAgbm9kZS5zb3VyY2UuZW5kID0gdGhpcy5nZXRQb3NpdGlvbih0b2tlblszXSB8fCB0b2tlblsyXSlcblxuICAgIGxldCB0ZXh0ID0gdG9rZW5bMV0uc2xpY2UoMiwgLTIpXG4gICAgaWYgKC9eXFxzKiQvLnRlc3QodGV4dCkpIHtcbiAgICAgIG5vZGUudGV4dCA9ICcnXG4gICAgICBub2RlLnJhd3MubGVmdCA9IHRleHRcbiAgICAgIG5vZGUucmF3cy5yaWdodCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBtYXRjaCA9IHRleHQubWF0Y2goL14oXFxzKikoW15dKlxcUykoXFxzKikkLylcbiAgICAgIG5vZGUudGV4dCA9IG1hdGNoWzJdXG4gICAgICBub2RlLnJhd3MubGVmdCA9IG1hdGNoWzFdXG4gICAgICBub2RlLnJhd3MucmlnaHQgPSBtYXRjaFszXVxuICAgIH1cbiAgfVxuXG4gIGVtcHR5UnVsZSh0b2tlbikge1xuICAgIGxldCBub2RlID0gbmV3IFJ1bGUoKVxuICAgIHRoaXMuaW5pdChub2RlLCB0b2tlblsyXSlcbiAgICBub2RlLnNlbGVjdG9yID0gJydcbiAgICBub2RlLnJhd3MuYmV0d2VlbiA9ICcnXG4gICAgdGhpcy5jdXJyZW50ID0gbm9kZVxuICB9XG5cbiAgb3RoZXIoc3RhcnQpIHtcbiAgICBsZXQgZW5kID0gZmFsc2VcbiAgICBsZXQgdHlwZSA9IG51bGxcbiAgICBsZXQgY29sb24gPSBmYWxzZVxuICAgIGxldCBicmFja2V0ID0gbnVsbFxuICAgIGxldCBicmFja2V0cyA9IFtdXG4gICAgbGV0IGN1c3RvbVByb3BlcnR5ID0gc3RhcnRbMV0uc3RhcnRzV2l0aCgnLS0nKVxuXG4gICAgbGV0IHRva2VucyA9IFtdXG4gICAgbGV0IHRva2VuID0gc3RhcnRcbiAgICB3aGlsZSAodG9rZW4pIHtcbiAgICAgIHR5cGUgPSB0b2tlblswXVxuICAgICAgdG9rZW5zLnB1c2godG9rZW4pXG5cbiAgICAgIGlmICh0eXBlID09PSAnKCcgfHwgdHlwZSA9PT0gJ1snKSB7XG4gICAgICAgIGlmICghYnJhY2tldCkgYnJhY2tldCA9IHRva2VuXG4gICAgICAgIGJyYWNrZXRzLnB1c2godHlwZSA9PT0gJygnID8gJyknIDogJ10nKVxuICAgICAgfSBlbHNlIGlmIChjdXN0b21Qcm9wZXJ0eSAmJiBjb2xvbiAmJiB0eXBlID09PSAneycpIHtcbiAgICAgICAgaWYgKCFicmFja2V0KSBicmFja2V0ID0gdG9rZW5cbiAgICAgICAgYnJhY2tldHMucHVzaCgnfScpXG4gICAgICB9IGVsc2UgaWYgKGJyYWNrZXRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAodHlwZSA9PT0gJzsnKSB7XG4gICAgICAgICAgaWYgKGNvbG9uKSB7XG4gICAgICAgICAgICB0aGlzLmRlY2wodG9rZW5zLCBjdXN0b21Qcm9wZXJ0eSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAneycpIHtcbiAgICAgICAgICB0aGlzLnJ1bGUodG9rZW5zKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICd9Jykge1xuICAgICAgICAgIHRoaXMudG9rZW5pemVyLmJhY2sodG9rZW5zLnBvcCgpKVxuICAgICAgICAgIGVuZCA9IHRydWVcbiAgICAgICAgICBicmVha1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICc6Jykge1xuICAgICAgICAgIGNvbG9uID0gdHJ1ZVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IGJyYWNrZXRzW2JyYWNrZXRzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGJyYWNrZXRzLnBvcCgpXG4gICAgICAgIGlmIChicmFja2V0cy5sZW5ndGggPT09IDApIGJyYWNrZXQgPSBudWxsXG4gICAgICB9XG5cbiAgICAgIHRva2VuID0gdGhpcy50b2tlbml6ZXIubmV4dFRva2VuKClcbiAgICB9XG5cbiAgICBpZiAodGhpcy50b2tlbml6ZXIuZW5kT2ZGaWxlKCkpIGVuZCA9IHRydWVcbiAgICBpZiAoYnJhY2tldHMubGVuZ3RoID4gMCkgdGhpcy51bmNsb3NlZEJyYWNrZXQoYnJhY2tldClcblxuICAgIGlmIChlbmQgJiYgY29sb24pIHtcbiAgICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoKSB7XG4gICAgICAgIHRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXVswXVxuICAgICAgICBpZiAodG9rZW4gIT09ICdzcGFjZScgJiYgdG9rZW4gIT09ICdjb21tZW50JykgYnJlYWtcbiAgICAgICAgdGhpcy50b2tlbml6ZXIuYmFjayh0b2tlbnMucG9wKCkpXG4gICAgICB9XG4gICAgICB0aGlzLmRlY2wodG9rZW5zLCBjdXN0b21Qcm9wZXJ0eSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51bmtub3duV29yZCh0b2tlbnMpXG4gICAgfVxuICB9XG5cbiAgcnVsZSh0b2tlbnMpIHtcbiAgICB0b2tlbnMucG9wKClcblxuICAgIGxldCBub2RlID0gbmV3IFJ1bGUoKVxuICAgIHRoaXMuaW5pdChub2RlLCB0b2tlbnNbMF1bMl0pXG5cbiAgICBub2RlLnJhd3MuYmV0d2VlbiA9IHRoaXMuc3BhY2VzQW5kQ29tbWVudHNGcm9tRW5kKHRva2VucylcbiAgICB0aGlzLnJhdyhub2RlLCAnc2VsZWN0b3InLCB0b2tlbnMpXG4gICAgdGhpcy5jdXJyZW50ID0gbm9kZVxuICB9XG5cbiAgZGVjbCh0b2tlbnMsIGN1c3RvbVByb3BlcnR5KSB7XG4gICAgbGV0IG5vZGUgPSBuZXcgRGVjbGFyYXRpb24oKVxuICAgIHRoaXMuaW5pdChub2RlLCB0b2tlbnNbMF1bMl0pXG5cbiAgICBsZXQgbGFzdCA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV1cbiAgICBpZiAobGFzdFswXSA9PT0gJzsnKSB7XG4gICAgICB0aGlzLnNlbWljb2xvbiA9IHRydWVcbiAgICAgIHRva2Vucy5wb3AoKVxuICAgIH1cbiAgICBub2RlLnNvdXJjZS5lbmQgPSB0aGlzLmdldFBvc2l0aW9uKGxhc3RbM10gfHwgbGFzdFsyXSlcblxuICAgIHdoaWxlICh0b2tlbnNbMF1bMF0gIT09ICd3b3JkJykge1xuICAgICAgaWYgKHRva2Vucy5sZW5ndGggPT09IDEpIHRoaXMudW5rbm93bldvcmQodG9rZW5zKVxuICAgICAgbm9kZS5yYXdzLmJlZm9yZSArPSB0b2tlbnMuc2hpZnQoKVsxXVxuICAgIH1cbiAgICBub2RlLnNvdXJjZS5zdGFydCA9IHRoaXMuZ2V0UG9zaXRpb24odG9rZW5zWzBdWzJdKVxuXG4gICAgbm9kZS5wcm9wID0gJydcbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCkge1xuICAgICAgbGV0IHR5cGUgPSB0b2tlbnNbMF1bMF1cbiAgICAgIGlmICh0eXBlID09PSAnOicgfHwgdHlwZSA9PT0gJ3NwYWNlJyB8fCB0eXBlID09PSAnY29tbWVudCcpIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIG5vZGUucHJvcCArPSB0b2tlbnMuc2hpZnQoKVsxXVxuICAgIH1cblxuICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gJydcblxuICAgIGxldCB0b2tlblxuICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoKSB7XG4gICAgICB0b2tlbiA9IHRva2Vucy5zaGlmdCgpXG5cbiAgICAgIGlmICh0b2tlblswXSA9PT0gJzonKSB7XG4gICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuICs9IHRva2VuWzFdXG4gICAgICAgIGJyZWFrXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodG9rZW5bMF0gPT09ICd3b3JkJyAmJiAvXFx3Ly50ZXN0KHRva2VuWzFdKSkge1xuICAgICAgICAgIHRoaXMudW5rbm93bldvcmQoW3Rva2VuXSlcbiAgICAgICAgfVxuICAgICAgICBub2RlLnJhd3MuYmV0d2VlbiArPSB0b2tlblsxXVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlLnByb3BbMF0gPT09ICdfJyB8fCBub2RlLnByb3BbMF0gPT09ICcqJykge1xuICAgICAgbm9kZS5yYXdzLmJlZm9yZSArPSBub2RlLnByb3BbMF1cbiAgICAgIG5vZGUucHJvcCA9IG5vZGUucHJvcC5zbGljZSgxKVxuICAgIH1cbiAgICBsZXQgZmlyc3RTcGFjZXMgPSB0aGlzLnNwYWNlc0FuZENvbW1lbnRzRnJvbVN0YXJ0KHRva2VucylcbiAgICB0aGlzLnByZWNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2VucylcblxuICAgIGZvciAobGV0IGkgPSB0b2tlbnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRva2VuID0gdG9rZW5zW2ldXG4gICAgICBpZiAodG9rZW5bMV0udG9Mb3dlckNhc2UoKSA9PT0gJyFpbXBvcnRhbnQnKSB7XG4gICAgICAgIG5vZGUuaW1wb3J0YW50ID0gdHJ1ZVxuICAgICAgICBsZXQgc3RyaW5nID0gdGhpcy5zdHJpbmdGcm9tKHRva2VucywgaSlcbiAgICAgICAgc3RyaW5nID0gdGhpcy5zcGFjZXNGcm9tRW5kKHRva2VucykgKyBzdHJpbmdcbiAgICAgICAgaWYgKHN0cmluZyAhPT0gJyAhaW1wb3J0YW50Jykgbm9kZS5yYXdzLmltcG9ydGFudCA9IHN0cmluZ1xuICAgICAgICBicmVha1xuICAgICAgfSBlbHNlIGlmICh0b2tlblsxXS50b0xvd2VyQ2FzZSgpID09PSAnaW1wb3J0YW50Jykge1xuICAgICAgICBsZXQgY2FjaGUgPSB0b2tlbnMuc2xpY2UoMClcbiAgICAgICAgbGV0IHN0ciA9ICcnXG4gICAgICAgIGZvciAobGV0IGogPSBpOyBqID4gMDsgai0tKSB7XG4gICAgICAgICAgbGV0IHR5cGUgPSBjYWNoZVtqXVswXVxuICAgICAgICAgIGlmIChzdHIudHJpbSgpLmluZGV4T2YoJyEnKSA9PT0gMCAmJiB0eXBlICE9PSAnc3BhY2UnKSB7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBzdHIgPSBjYWNoZS5wb3AoKVsxXSArIHN0clxuICAgICAgICB9XG4gICAgICAgIGlmIChzdHIudHJpbSgpLmluZGV4T2YoJyEnKSA9PT0gMCkge1xuICAgICAgICAgIG5vZGUuaW1wb3J0YW50ID0gdHJ1ZVxuICAgICAgICAgIG5vZGUucmF3cy5pbXBvcnRhbnQgPSBzdHJcbiAgICAgICAgICB0b2tlbnMgPSBjYWNoZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0b2tlblswXSAhPT0gJ3NwYWNlJyAmJiB0b2tlblswXSAhPT0gJ2NvbW1lbnQnKSB7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IGhhc1dvcmQgPSB0b2tlbnMuc29tZShpID0+IGlbMF0gIT09ICdzcGFjZScgJiYgaVswXSAhPT0gJ2NvbW1lbnQnKVxuICAgIHRoaXMucmF3KG5vZGUsICd2YWx1ZScsIHRva2VucylcbiAgICBpZiAoaGFzV29yZCkge1xuICAgICAgbm9kZS5yYXdzLmJldHdlZW4gKz0gZmlyc3RTcGFjZXNcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS52YWx1ZSA9IGZpcnN0U3BhY2VzICsgbm9kZS52YWx1ZVxuICAgIH1cblxuICAgIGlmIChub2RlLnZhbHVlLmluY2x1ZGVzKCc6JykgJiYgIWN1c3RvbVByb3BlcnR5KSB7XG4gICAgICB0aGlzLmNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2VucylcbiAgICB9XG4gIH1cblxuICBhdHJ1bGUodG9rZW4pIHtcbiAgICBsZXQgbm9kZSA9IG5ldyBBdFJ1bGUoKVxuICAgIG5vZGUubmFtZSA9IHRva2VuWzFdLnNsaWNlKDEpXG4gICAgaWYgKG5vZGUubmFtZSA9PT0gJycpIHtcbiAgICAgIHRoaXMudW5uYW1lZEF0cnVsZShub2RlLCB0b2tlbilcbiAgICB9XG4gICAgdGhpcy5pbml0KG5vZGUsIHRva2VuWzJdKVxuXG4gICAgbGV0IHR5cGVcbiAgICBsZXQgcHJldlxuICAgIGxldCBzaGlmdFxuICAgIGxldCBsYXN0ID0gZmFsc2VcbiAgICBsZXQgb3BlbiA9IGZhbHNlXG4gICAgbGV0IHBhcmFtcyA9IFtdXG4gICAgbGV0IGJyYWNrZXRzID0gW11cblxuICAgIHdoaWxlICghdGhpcy50b2tlbml6ZXIuZW5kT2ZGaWxlKCkpIHtcbiAgICAgIHRva2VuID0gdGhpcy50b2tlbml6ZXIubmV4dFRva2VuKClcbiAgICAgIHR5cGUgPSB0b2tlblswXVxuXG4gICAgICBpZiAodHlwZSA9PT0gJygnIHx8IHR5cGUgPT09ICdbJykge1xuICAgICAgICBicmFja2V0cy5wdXNoKHR5cGUgPT09ICcoJyA/ICcpJyA6ICddJylcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3snICYmIGJyYWNrZXRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYnJhY2tldHMucHVzaCgnfScpXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT09IGJyYWNrZXRzW2JyYWNrZXRzLmxlbmd0aCAtIDFdKSB7XG4gICAgICAgIGJyYWNrZXRzLnBvcCgpXG4gICAgICB9XG5cbiAgICAgIGlmIChicmFja2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgaWYgKHR5cGUgPT09ICc7Jykge1xuICAgICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHRoaXMuZ2V0UG9zaXRpb24odG9rZW5bMl0pXG4gICAgICAgICAgdGhpcy5zZW1pY29sb24gPSB0cnVlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAneycpIHtcbiAgICAgICAgICBvcGVuID0gdHJ1ZVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ30nKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBzaGlmdCA9IHBhcmFtcy5sZW5ndGggLSAxXG4gICAgICAgICAgICBwcmV2ID0gcGFyYW1zW3NoaWZ0XVxuICAgICAgICAgICAgd2hpbGUgKHByZXYgJiYgcHJldlswXSA9PT0gJ3NwYWNlJykge1xuICAgICAgICAgICAgICBwcmV2ID0gcGFyYW1zWy0tc2hpZnRdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJldikge1xuICAgICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgPSB0aGlzLmdldFBvc2l0aW9uKHByZXZbM10gfHwgcHJldlsyXSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5lbmQodG9rZW4pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJhbXMucHVzaCh0b2tlbilcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyYW1zLnB1c2godG9rZW4pXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLnRva2VuaXplci5lbmRPZkZpbGUoKSkge1xuICAgICAgICBsYXN0ID0gdHJ1ZVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gdGhpcy5zcGFjZXNBbmRDb21tZW50c0Zyb21FbmQocGFyYW1zKVxuICAgIGlmIChwYXJhbXMubGVuZ3RoKSB7XG4gICAgICBub2RlLnJhd3MuYWZ0ZXJOYW1lID0gdGhpcy5zcGFjZXNBbmRDb21tZW50c0Zyb21TdGFydChwYXJhbXMpXG4gICAgICB0aGlzLnJhdyhub2RlLCAncGFyYW1zJywgcGFyYW1zKVxuICAgICAgaWYgKGxhc3QpIHtcbiAgICAgICAgdG9rZW4gPSBwYXJhbXNbcGFyYW1zLmxlbmd0aCAtIDFdXG4gICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHRoaXMuZ2V0UG9zaXRpb24odG9rZW5bM10gfHwgdG9rZW5bMl0pXG4gICAgICAgIHRoaXMuc3BhY2VzID0gbm9kZS5yYXdzLmJldHdlZW5cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSAnJ1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBub2RlLnJhd3MuYWZ0ZXJOYW1lID0gJydcbiAgICAgIG5vZGUucGFyYW1zID0gJydcbiAgICB9XG5cbiAgICBpZiAob3Blbikge1xuICAgICAgbm9kZS5ub2RlcyA9IFtdXG4gICAgICB0aGlzLmN1cnJlbnQgPSBub2RlXG4gICAgfVxuICB9XG5cbiAgZW5kKHRva2VuKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudC5ub2RlcyAmJiB0aGlzLmN1cnJlbnQubm9kZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmN1cnJlbnQucmF3cy5zZW1pY29sb24gPSB0aGlzLnNlbWljb2xvblxuICAgIH1cbiAgICB0aGlzLnNlbWljb2xvbiA9IGZhbHNlXG5cbiAgICB0aGlzLmN1cnJlbnQucmF3cy5hZnRlciA9ICh0aGlzLmN1cnJlbnQucmF3cy5hZnRlciB8fCAnJykgKyB0aGlzLnNwYWNlc1xuICAgIHRoaXMuc3BhY2VzID0gJydcblxuICAgIGlmICh0aGlzLmN1cnJlbnQucGFyZW50KSB7XG4gICAgICB0aGlzLmN1cnJlbnQuc291cmNlLmVuZCA9IHRoaXMuZ2V0UG9zaXRpb24odG9rZW5bMl0pXG4gICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQucGFyZW50XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudW5leHBlY3RlZENsb3NlKHRva2VuKVxuICAgIH1cbiAgfVxuXG4gIGVuZEZpbGUoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudC5wYXJlbnQpIHRoaXMudW5jbG9zZWRCbG9jaygpXG4gICAgaWYgKHRoaXMuY3VycmVudC5ub2RlcyAmJiB0aGlzLmN1cnJlbnQubm9kZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmN1cnJlbnQucmF3cy5zZW1pY29sb24gPSB0aGlzLnNlbWljb2xvblxuICAgIH1cbiAgICB0aGlzLmN1cnJlbnQucmF3cy5hZnRlciA9ICh0aGlzLmN1cnJlbnQucmF3cy5hZnRlciB8fCAnJykgKyB0aGlzLnNwYWNlc1xuICB9XG5cbiAgZnJlZVNlbWljb2xvbih0b2tlbikge1xuICAgIHRoaXMuc3BhY2VzICs9IHRva2VuWzFdXG4gICAgaWYgKHRoaXMuY3VycmVudC5ub2Rlcykge1xuICAgICAgbGV0IHByZXYgPSB0aGlzLmN1cnJlbnQubm9kZXNbdGhpcy5jdXJyZW50Lm5vZGVzLmxlbmd0aCAtIDFdXG4gICAgICBpZiAocHJldiAmJiBwcmV2LnR5cGUgPT09ICdydWxlJyAmJiAhcHJldi5yYXdzLm93blNlbWljb2xvbikge1xuICAgICAgICBwcmV2LnJhd3Mub3duU2VtaWNvbG9uID0gdGhpcy5zcGFjZXNcbiAgICAgICAgdGhpcy5zcGFjZXMgPSAnJ1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEhlbHBlcnNcblxuICBnZXRQb3NpdGlvbihvZmZzZXQpIHtcbiAgICBsZXQgcG9zID0gdGhpcy5pbnB1dC5mcm9tT2Zmc2V0KG9mZnNldClcbiAgICByZXR1cm4ge1xuICAgICAgb2Zmc2V0LFxuICAgICAgbGluZTogcG9zLmxpbmUsXG4gICAgICBjb2x1bW46IHBvcy5jb2xcbiAgICB9XG4gIH1cblxuICBpbml0KG5vZGUsIG9mZnNldCkge1xuICAgIHRoaXMuY3VycmVudC5wdXNoKG5vZGUpXG4gICAgbm9kZS5zb3VyY2UgPSB7XG4gICAgICBzdGFydDogdGhpcy5nZXRQb3NpdGlvbihvZmZzZXQpLFxuICAgICAgaW5wdXQ6IHRoaXMuaW5wdXRcbiAgICB9XG4gICAgbm9kZS5yYXdzLmJlZm9yZSA9IHRoaXMuc3BhY2VzXG4gICAgdGhpcy5zcGFjZXMgPSAnJ1xuICAgIGlmIChub2RlLnR5cGUgIT09ICdjb21tZW50JykgdGhpcy5zZW1pY29sb24gPSBmYWxzZVxuICB9XG5cbiAgcmF3KG5vZGUsIHByb3AsIHRva2Vucykge1xuICAgIGxldCB0b2tlbiwgdHlwZVxuICAgIGxldCBsZW5ndGggPSB0b2tlbnMubGVuZ3RoXG4gICAgbGV0IHZhbHVlID0gJydcbiAgICBsZXQgY2xlYW4gPSB0cnVlXG4gICAgbGV0IG5leHQsIHByZXZcbiAgICBsZXQgcGF0dGVybiA9IC9eKFsjLnxdKT8oXFx3KSsvaVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgdG9rZW4gPSB0b2tlbnNbaV1cbiAgICAgIHR5cGUgPSB0b2tlblswXVxuXG4gICAgICBpZiAodHlwZSA9PT0gJ2NvbW1lbnQnICYmIG5vZGUudHlwZSA9PT0gJ3J1bGUnKSB7XG4gICAgICAgIHByZXYgPSB0b2tlbnNbaSAtIDFdXG4gICAgICAgIG5leHQgPSB0b2tlbnNbaSArIDFdXG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByZXZbMF0gIT09ICdzcGFjZScgJiZcbiAgICAgICAgICBuZXh0WzBdICE9PSAnc3BhY2UnICYmXG4gICAgICAgICAgcGF0dGVybi50ZXN0KHByZXZbMV0pICYmXG4gICAgICAgICAgcGF0dGVybi50ZXN0KG5leHRbMV0pXG4gICAgICAgICkge1xuICAgICAgICAgIHZhbHVlICs9IHRva2VuWzFdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xlYW4gPSBmYWxzZVxuICAgICAgICB9XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgPT09ICdjb21tZW50JyB8fCAodHlwZSA9PT0gJ3NwYWNlJyAmJiBpID09PSBsZW5ndGggLSAxKSkge1xuICAgICAgICBjbGVhbiA9IGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSArPSB0b2tlblsxXVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIWNsZWFuKSB7XG4gICAgICBsZXQgcmF3ID0gdG9rZW5zLnJlZHVjZSgoYWxsLCBpKSA9PiBhbGwgKyBpWzFdLCAnJylcbiAgICAgIG5vZGUucmF3c1twcm9wXSA9IHsgdmFsdWUsIHJhdyB9XG4gICAgfVxuICAgIG5vZGVbcHJvcF0gPSB2YWx1ZVxuICB9XG5cbiAgc3BhY2VzQW5kQ29tbWVudHNGcm9tRW5kKHRva2Vucykge1xuICAgIGxldCBsYXN0VG9rZW5UeXBlXG4gICAgbGV0IHNwYWNlcyA9ICcnXG4gICAgd2hpbGUgKHRva2Vucy5sZW5ndGgpIHtcbiAgICAgIGxhc3RUb2tlblR5cGUgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdWzBdXG4gICAgICBpZiAobGFzdFRva2VuVHlwZSAhPT0gJ3NwYWNlJyAmJiBsYXN0VG9rZW5UeXBlICE9PSAnY29tbWVudCcpIGJyZWFrXG4gICAgICBzcGFjZXMgPSB0b2tlbnMucG9wKClbMV0gKyBzcGFjZXNcbiAgICB9XG4gICAgcmV0dXJuIHNwYWNlc1xuICB9XG5cbiAgc3BhY2VzQW5kQ29tbWVudHNGcm9tU3RhcnQodG9rZW5zKSB7XG4gICAgbGV0IG5leHRcbiAgICBsZXQgc3BhY2VzID0gJydcbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCkge1xuICAgICAgbmV4dCA9IHRva2Vuc1swXVswXVxuICAgICAgaWYgKG5leHQgIT09ICdzcGFjZScgJiYgbmV4dCAhPT0gJ2NvbW1lbnQnKSBicmVha1xuICAgICAgc3BhY2VzICs9IHRva2Vucy5zaGlmdCgpWzFdXG4gICAgfVxuICAgIHJldHVybiBzcGFjZXNcbiAgfVxuXG4gIHNwYWNlc0Zyb21FbmQodG9rZW5zKSB7XG4gICAgbGV0IGxhc3RUb2tlblR5cGVcbiAgICBsZXQgc3BhY2VzID0gJydcbiAgICB3aGlsZSAodG9rZW5zLmxlbmd0aCkge1xuICAgICAgbGFzdFRva2VuVHlwZSA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV1bMF1cbiAgICAgIGlmIChsYXN0VG9rZW5UeXBlICE9PSAnc3BhY2UnKSBicmVha1xuICAgICAgc3BhY2VzID0gdG9rZW5zLnBvcCgpWzFdICsgc3BhY2VzXG4gICAgfVxuICAgIHJldHVybiBzcGFjZXNcbiAgfVxuXG4gIHN0cmluZ0Zyb20odG9rZW5zLCBmcm9tKSB7XG4gICAgbGV0IHJlc3VsdCA9ICcnXG4gICAgZm9yIChsZXQgaSA9IGZyb207IGkgPCB0b2tlbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdCArPSB0b2tlbnNbaV1bMV1cbiAgICB9XG4gICAgdG9rZW5zLnNwbGljZShmcm9tLCB0b2tlbnMubGVuZ3RoIC0gZnJvbSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBjb2xvbih0b2tlbnMpIHtcbiAgICBsZXQgYnJhY2tldHMgPSAwXG4gICAgbGV0IHRva2VuLCB0eXBlLCBwcmV2XG4gICAgZm9yIChsZXQgW2ksIGVsZW1lbnRdIG9mIHRva2Vucy5lbnRyaWVzKCkpIHtcbiAgICAgIHRva2VuID0gZWxlbWVudFxuICAgICAgdHlwZSA9IHRva2VuWzBdXG5cbiAgICAgIGlmICh0eXBlID09PSAnKCcpIHtcbiAgICAgICAgYnJhY2tldHMgKz0gMVxuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09ICcpJykge1xuICAgICAgICBicmFja2V0cyAtPSAxXG4gICAgICB9XG4gICAgICBpZiAoYnJhY2tldHMgPT09IDAgJiYgdHlwZSA9PT0gJzonKSB7XG4gICAgICAgIGlmICghcHJldikge1xuICAgICAgICAgIHRoaXMuZG91YmxlQ29sb24odG9rZW4pXG4gICAgICAgIH0gZWxzZSBpZiAocHJldlswXSA9PT0gJ3dvcmQnICYmIHByZXZbMV0gPT09ICdwcm9naWQnKSB7XG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gaVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHByZXYgPSB0b2tlblxuICAgIH1cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIC8vIEVycm9yc1xuXG4gIHVuY2xvc2VkQnJhY2tldChicmFja2V0KSB7XG4gICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcihcbiAgICAgICdVbmNsb3NlZCBicmFja2V0JyxcbiAgICAgIHsgb2Zmc2V0OiBicmFja2V0WzJdIH0sXG4gICAgICB7IG9mZnNldDogYnJhY2tldFsyXSArIDEgfVxuICAgIClcbiAgfVxuXG4gIHVua25vd25Xb3JkKHRva2Vucykge1xuICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoXG4gICAgICAnVW5rbm93biB3b3JkJyxcbiAgICAgIHsgb2Zmc2V0OiB0b2tlbnNbMF1bMl0gfSxcbiAgICAgIHsgb2Zmc2V0OiB0b2tlbnNbMF1bMl0gKyB0b2tlbnNbMF1bMV0ubGVuZ3RoIH1cbiAgICApXG4gIH1cblxuICB1bmV4cGVjdGVkQ2xvc2UodG9rZW4pIHtcbiAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKFxuICAgICAgJ1VuZXhwZWN0ZWQgfScsXG4gICAgICB7IG9mZnNldDogdG9rZW5bMl0gfSxcbiAgICAgIHsgb2Zmc2V0OiB0b2tlblsyXSArIDEgfVxuICAgIClcbiAgfVxuXG4gIHVuY2xvc2VkQmxvY2soKSB7XG4gICAgbGV0IHBvcyA9IHRoaXMuY3VycmVudC5zb3VyY2Uuc3RhcnRcbiAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmNsb3NlZCBibG9jaycsIHBvcy5saW5lLCBwb3MuY29sdW1uKVxuICB9XG5cbiAgZG91YmxlQ29sb24odG9rZW4pIHtcbiAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKFxuICAgICAgJ0RvdWJsZSBjb2xvbicsXG4gICAgICB7IG9mZnNldDogdG9rZW5bMl0gfSxcbiAgICAgIHsgb2Zmc2V0OiB0b2tlblsyXSArIHRva2VuWzFdLmxlbmd0aCB9XG4gICAgKVxuICB9XG5cbiAgdW5uYW1lZEF0cnVsZShub2RlLCB0b2tlbikge1xuICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoXG4gICAgICAnQXQtcnVsZSB3aXRob3V0IG5hbWUnLFxuICAgICAgeyBvZmZzZXQ6IHRva2VuWzJdIH0sXG4gICAgICB7IG9mZnNldDogdG9rZW5bMl0gKyB0b2tlblsxXS5sZW5ndGggfVxuICAgIClcbiAgfVxuXG4gIHByZWNoZWNrTWlzc2VkU2VtaWNvbG9uKC8qIHRva2VucyAqLykge1xuICAgIC8vIEhvb2sgZm9yIFNhZmUgUGFyc2VyXG4gIH1cblxuICBjaGVja01pc3NlZFNlbWljb2xvbih0b2tlbnMpIHtcbiAgICBsZXQgY29sb24gPSB0aGlzLmNvbG9uKHRva2VucylcbiAgICBpZiAoY29sb24gPT09IGZhbHNlKSByZXR1cm5cblxuICAgIGxldCBmb3VuZGVkID0gMFxuICAgIGxldCB0b2tlblxuICAgIGZvciAobGV0IGogPSBjb2xvbiAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICB0b2tlbiA9IHRva2Vuc1tqXVxuICAgICAgaWYgKHRva2VuWzBdICE9PSAnc3BhY2UnKSB7XG4gICAgICAgIGZvdW5kZWQgKz0gMVxuICAgICAgICBpZiAoZm91bmRlZCA9PT0gMikgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgLy8gSWYgdGhlIHRva2VuIGlzIGEgd29yZCwgZS5nLiBgIWltcG9ydGFudGAsIGByZWRgIG9yIGFueSBvdGhlciB2YWxpZCBwcm9wZXJ0eSdzIHZhbHVlLlxuICAgIC8vIFRoZW4gd2UgbmVlZCB0byByZXR1cm4gdGhlIGNvbG9uIGFmdGVyIHRoYXQgd29yZCB0b2tlbi4gWzNdIGlzIHRoZSBcImVuZFwiIGNvbG9uIG9mIHRoYXQgd29yZC5cbiAgICAvLyBBbmQgYmVjYXVzZSB3ZSBuZWVkIGl0IGFmdGVyIHRoYXQgb25lIHdlIGRvICsxIHRvIGdldCB0aGUgbmV4dCBvbmUuXG4gICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcihcbiAgICAgICdNaXNzZWQgc2VtaWNvbG9uJyxcbiAgICAgIHRva2VuWzBdID09PSAnd29yZCcgPyB0b2tlblszXSArIDEgOiB0b2tlblsyXVxuICAgIClcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlclxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBDc3NTeW50YXhFcnJvciA9IHJlcXVpcmUoJy4vY3NzLXN5bnRheC1lcnJvcicpXG5sZXQgRGVjbGFyYXRpb24gPSByZXF1aXJlKCcuL2RlY2xhcmF0aW9uJylcbmxldCBMYXp5UmVzdWx0ID0gcmVxdWlyZSgnLi9sYXp5LXJlc3VsdCcpXG5sZXQgQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jb250YWluZXInKVxubGV0IFByb2Nlc3NvciA9IHJlcXVpcmUoJy4vcHJvY2Vzc29yJylcbmxldCBzdHJpbmdpZnkgPSByZXF1aXJlKCcuL3N0cmluZ2lmeScpXG5sZXQgZnJvbUpTT04gPSByZXF1aXJlKCcuL2Zyb21KU09OJylcbmxldCBEb2N1bWVudCA9IHJlcXVpcmUoJy4vZG9jdW1lbnQnKVxubGV0IFdhcm5pbmcgPSByZXF1aXJlKCcuL3dhcm5pbmcnKVxubGV0IENvbW1lbnQgPSByZXF1aXJlKCcuL2NvbW1lbnQnKVxubGV0IEF0UnVsZSA9IHJlcXVpcmUoJy4vYXQtcnVsZScpXG5sZXQgUmVzdWx0ID0gcmVxdWlyZSgnLi9yZXN1bHQuanMnKVxubGV0IElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dCcpXG5sZXQgcGFyc2UgPSByZXF1aXJlKCcuL3BhcnNlJylcbmxldCBsaXN0ID0gcmVxdWlyZSgnLi9saXN0JylcbmxldCBSdWxlID0gcmVxdWlyZSgnLi9ydWxlJylcbmxldCBSb290ID0gcmVxdWlyZSgnLi9yb290JylcbmxldCBOb2RlID0gcmVxdWlyZSgnLi9ub2RlJylcblxuZnVuY3Rpb24gcG9zdGNzcyguLi5wbHVnaW5zKSB7XG4gIGlmIChwbHVnaW5zLmxlbmd0aCA9PT0gMSAmJiBBcnJheS5pc0FycmF5KHBsdWdpbnNbMF0pKSB7XG4gICAgcGx1Z2lucyA9IHBsdWdpbnNbMF1cbiAgfVxuICByZXR1cm4gbmV3IFByb2Nlc3NvcihwbHVnaW5zKVxufVxuXG5wb3N0Y3NzLnBsdWdpbiA9IGZ1bmN0aW9uIHBsdWdpbihuYW1lLCBpbml0aWFsaXplcikge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUud2FybihcbiAgICAgIG5hbWUgK1xuICAgICAgICAnOiBwb3N0Y3NzLnBsdWdpbiB3YXMgZGVwcmVjYXRlZC4gTWlncmF0aW9uIGd1aWRlOlxcbicgK1xuICAgICAgICAnaHR0cHM6Ly9ldmlsbWFydGlhbnMuY29tL2Nocm9uaWNsZXMvcG9zdGNzcy04LXBsdWdpbi1taWdyYXRpb24nXG4gICAgKVxuICAgIGlmIChwcm9jZXNzLmVudi5MQU5HICYmIHByb2Nlc3MuZW52LkxBTkcuc3RhcnRzV2l0aCgnY24nKSkge1xuICAgICAgLyogYzggaWdub3JlIG5leHQgNyAqL1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgbmFtZSArXG4gICAgICAgICAgJzog6YeM6Z2iIHBvc3Rjc3MucGx1Z2luIOiiq+W8g+eUqC4g6L+B56e75oyH5Y2XOlxcbicgK1xuICAgICAgICAgICdodHRwczovL3d3dy53M2N0ZWNoLmNvbS90b3BpYy8yMjI2J1xuICAgICAgKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjcmVhdG9yKC4uLmFyZ3MpIHtcbiAgICBsZXQgdHJhbnNmb3JtZXIgPSBpbml0aWFsaXplciguLi5hcmdzKVxuICAgIHRyYW5zZm9ybWVyLnBvc3Rjc3NQbHVnaW4gPSBuYW1lXG4gICAgdHJhbnNmb3JtZXIucG9zdGNzc1ZlcnNpb24gPSBuZXcgUHJvY2Vzc29yKCkudmVyc2lvblxuICAgIHJldHVybiB0cmFuc2Zvcm1lclxuICB9XG5cbiAgbGV0IGNhY2hlXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdG9yLCAncG9zdGNzcycsIHtcbiAgICBnZXQoKSB7XG4gICAgICBpZiAoIWNhY2hlKSBjYWNoZSA9IGNyZWF0b3IoKVxuICAgICAgcmV0dXJuIGNhY2hlXG4gICAgfVxuICB9KVxuXG4gIGNyZWF0b3IucHJvY2VzcyA9IGZ1bmN0aW9uIChjc3MsIHByb2Nlc3NPcHRzLCBwbHVnaW5PcHRzKSB7XG4gICAgcmV0dXJuIHBvc3Rjc3MoW2NyZWF0b3IocGx1Z2luT3B0cyldKS5wcm9jZXNzKGNzcywgcHJvY2Vzc09wdHMpXG4gIH1cblxuICByZXR1cm4gY3JlYXRvclxufVxuXG5wb3N0Y3NzLnN0cmluZ2lmeSA9IHN0cmluZ2lmeVxucG9zdGNzcy5wYXJzZSA9IHBhcnNlXG5wb3N0Y3NzLmZyb21KU09OID0gZnJvbUpTT05cbnBvc3Rjc3MubGlzdCA9IGxpc3RcblxucG9zdGNzcy5jb21tZW50ID0gZGVmYXVsdHMgPT4gbmV3IENvbW1lbnQoZGVmYXVsdHMpXG5wb3N0Y3NzLmF0UnVsZSA9IGRlZmF1bHRzID0+IG5ldyBBdFJ1bGUoZGVmYXVsdHMpXG5wb3N0Y3NzLmRlY2wgPSBkZWZhdWx0cyA9PiBuZXcgRGVjbGFyYXRpb24oZGVmYXVsdHMpXG5wb3N0Y3NzLnJ1bGUgPSBkZWZhdWx0cyA9PiBuZXcgUnVsZShkZWZhdWx0cylcbnBvc3Rjc3Mucm9vdCA9IGRlZmF1bHRzID0+IG5ldyBSb290KGRlZmF1bHRzKVxucG9zdGNzcy5kb2N1bWVudCA9IGRlZmF1bHRzID0+IG5ldyBEb2N1bWVudChkZWZhdWx0cylcblxucG9zdGNzcy5Dc3NTeW50YXhFcnJvciA9IENzc1N5bnRheEVycm9yXG5wb3N0Y3NzLkRlY2xhcmF0aW9uID0gRGVjbGFyYXRpb25cbnBvc3Rjc3MuQ29udGFpbmVyID0gQ29udGFpbmVyXG5wb3N0Y3NzLlByb2Nlc3NvciA9IFByb2Nlc3NvclxucG9zdGNzcy5Eb2N1bWVudCA9IERvY3VtZW50XG5wb3N0Y3NzLkNvbW1lbnQgPSBDb21tZW50XG5wb3N0Y3NzLldhcm5pbmcgPSBXYXJuaW5nXG5wb3N0Y3NzLkF0UnVsZSA9IEF0UnVsZVxucG9zdGNzcy5SZXN1bHQgPSBSZXN1bHRcbnBvc3Rjc3MuSW5wdXQgPSBJbnB1dFxucG9zdGNzcy5SdWxlID0gUnVsZVxucG9zdGNzcy5Sb290ID0gUm9vdFxucG9zdGNzcy5Ob2RlID0gTm9kZVxuXG5MYXp5UmVzdWx0LnJlZ2lzdGVyUG9zdGNzcyhwb3N0Y3NzKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc3Rjc3NcbnBvc3Rjc3MuZGVmYXVsdCA9IHBvc3Rjc3NcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgeyBTb3VyY2VNYXBDb25zdW1lciwgU291cmNlTWFwR2VuZXJhdG9yIH0gPSByZXF1aXJlKCdzb3VyY2UtbWFwLWpzJylcbmxldCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9ID0gcmVxdWlyZSgnZnMnKVxubGV0IHsgZGlybmFtZSwgam9pbiB9ID0gcmVxdWlyZSgncGF0aCcpXG5cbmZ1bmN0aW9uIGZyb21CYXNlNjQoc3RyKSB7XG4gIGlmIChCdWZmZXIpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20oc3RyLCAnYmFzZTY0JykudG9TdHJpbmcoKVxuICB9IGVsc2Uge1xuICAgIC8qIGM4IGlnbm9yZSBuZXh0IDIgKi9cbiAgICByZXR1cm4gd2luZG93LmF0b2Ioc3RyKVxuICB9XG59XG5cbmNsYXNzIFByZXZpb3VzTWFwIHtcbiAgY29uc3RydWN0b3IoY3NzLCBvcHRzKSB7XG4gICAgaWYgKG9wdHMubWFwID09PSBmYWxzZSkgcmV0dXJuXG4gICAgdGhpcy5sb2FkQW5ub3RhdGlvbihjc3MpXG4gICAgdGhpcy5pbmxpbmUgPSB0aGlzLnN0YXJ0V2l0aCh0aGlzLmFubm90YXRpb24sICdkYXRhOicpXG5cbiAgICBsZXQgcHJldiA9IG9wdHMubWFwID8gb3B0cy5tYXAucHJldiA6IHVuZGVmaW5lZFxuICAgIGxldCB0ZXh0ID0gdGhpcy5sb2FkTWFwKG9wdHMuZnJvbSwgcHJldilcbiAgICBpZiAoIXRoaXMubWFwRmlsZSAmJiBvcHRzLmZyb20pIHtcbiAgICAgIHRoaXMubWFwRmlsZSA9IG9wdHMuZnJvbVxuICAgIH1cbiAgICBpZiAodGhpcy5tYXBGaWxlKSB0aGlzLnJvb3QgPSBkaXJuYW1lKHRoaXMubWFwRmlsZSlcbiAgICBpZiAodGV4dCkgdGhpcy50ZXh0ID0gdGV4dFxuICB9XG5cbiAgY29uc3VtZXIoKSB7XG4gICAgaWYgKCF0aGlzLmNvbnN1bWVyQ2FjaGUpIHtcbiAgICAgIHRoaXMuY29uc3VtZXJDYWNoZSA9IG5ldyBTb3VyY2VNYXBDb25zdW1lcih0aGlzLnRleHQpXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnN1bWVyQ2FjaGVcbiAgfVxuXG4gIHdpdGhDb250ZW50KCkge1xuICAgIHJldHVybiAhIShcbiAgICAgIHRoaXMuY29uc3VtZXIoKS5zb3VyY2VzQ29udGVudCAmJlxuICAgICAgdGhpcy5jb25zdW1lcigpLnNvdXJjZXNDb250ZW50Lmxlbmd0aCA+IDBcbiAgICApXG4gIH1cblxuICBzdGFydFdpdGgoc3RyaW5nLCBzdGFydCkge1xuICAgIGlmICghc3RyaW5nKSByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gc3RyaW5nLnN1YnN0cigwLCBzdGFydC5sZW5ndGgpID09PSBzdGFydFxuICB9XG5cbiAgZ2V0QW5ub3RhdGlvblVSTChzb3VyY2VNYXBTdHJpbmcpIHtcbiAgICByZXR1cm4gc291cmNlTWFwU3RyaW5nLnJlcGxhY2UoL15cXC9cXCpcXHMqIyBzb3VyY2VNYXBwaW5nVVJMPS8sICcnKS50cmltKClcbiAgfVxuXG4gIGxvYWRBbm5vdGF0aW9uKGNzcykge1xuICAgIGxldCBjb21tZW50cyA9IGNzcy5tYXRjaCgvXFwvXFwqXFxzKiMgc291cmNlTWFwcGluZ1VSTD0vZ20pXG4gICAgaWYgKCFjb21tZW50cykgcmV0dXJuXG5cbiAgICAvLyBzb3VyY2VNYXBwaW5nVVJMcyBmcm9tIGNvbW1lbnRzLCBzdHJpbmdzLCBldGMuXG4gICAgbGV0IHN0YXJ0ID0gY3NzLmxhc3RJbmRleE9mKGNvbW1lbnRzLnBvcCgpKVxuICAgIGxldCBlbmQgPSBjc3MuaW5kZXhPZignKi8nLCBzdGFydClcblxuICAgIGlmIChzdGFydCA+IC0xICYmIGVuZCA+IC0xKSB7XG4gICAgICAvLyBMb2NhdGUgdGhlIGxhc3Qgc291cmNlTWFwcGluZ1VSTCB0byBhdm9pZCBwaWNraW5cbiAgICAgIHRoaXMuYW5ub3RhdGlvbiA9IHRoaXMuZ2V0QW5ub3RhdGlvblVSTChjc3Muc3Vic3RyaW5nKHN0YXJ0LCBlbmQpKVxuICAgIH1cbiAgfVxuXG4gIGRlY29kZUlubGluZSh0ZXh0KSB7XG4gICAgbGV0IGJhc2VDaGFyc2V0VXJpID0gL15kYXRhOmFwcGxpY2F0aW9uXFwvanNvbjtjaGFyc2V0PXV0Zi0/ODtiYXNlNjQsL1xuICAgIGxldCBiYXNlVXJpID0gL15kYXRhOmFwcGxpY2F0aW9uXFwvanNvbjtiYXNlNjQsL1xuICAgIGxldCBjaGFyc2V0VXJpID0gL15kYXRhOmFwcGxpY2F0aW9uXFwvanNvbjtjaGFyc2V0PXV0Zi0/OCwvXG4gICAgbGV0IHVyaSA9IC9eZGF0YTphcHBsaWNhdGlvblxcL2pzb24sL1xuXG4gICAgaWYgKGNoYXJzZXRVcmkudGVzdCh0ZXh0KSB8fCB1cmkudGVzdCh0ZXh0KSkge1xuICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh0ZXh0LnN1YnN0cihSZWdFeHAubGFzdE1hdGNoLmxlbmd0aCkpXG4gICAgfVxuXG4gICAgaWYgKGJhc2VDaGFyc2V0VXJpLnRlc3QodGV4dCkgfHwgYmFzZVVyaS50ZXN0KHRleHQpKSB7XG4gICAgICByZXR1cm4gZnJvbUJhc2U2NCh0ZXh0LnN1YnN0cihSZWdFeHAubGFzdE1hdGNoLmxlbmd0aCkpXG4gICAgfVxuXG4gICAgbGV0IGVuY29kaW5nID0gdGV4dC5tYXRjaCgvZGF0YTphcHBsaWNhdGlvblxcL2pzb247KFteLF0rKSwvKVsxXVxuICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgc291cmNlIG1hcCBlbmNvZGluZyAnICsgZW5jb2RpbmcpXG4gIH1cblxuICBsb2FkRmlsZShwYXRoKSB7XG4gICAgdGhpcy5yb290ID0gZGlybmFtZShwYXRoKVxuICAgIGlmIChleGlzdHNTeW5jKHBhdGgpKSB7XG4gICAgICB0aGlzLm1hcEZpbGUgPSBwYXRoXG4gICAgICByZXR1cm4gcmVhZEZpbGVTeW5jKHBhdGgsICd1dGYtOCcpLnRvU3RyaW5nKCkudHJpbSgpXG4gICAgfVxuICB9XG5cbiAgbG9hZE1hcChmaWxlLCBwcmV2KSB7XG4gICAgaWYgKHByZXYgPT09IGZhbHNlKSByZXR1cm4gZmFsc2VcblxuICAgIGlmIChwcmV2KSB7XG4gICAgICBpZiAodHlwZW9mIHByZXYgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiBwcmV2XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcmV2ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxldCBwcmV2UGF0aCA9IHByZXYoZmlsZSlcbiAgICAgICAgaWYgKHByZXZQYXRoKSB7XG4gICAgICAgICAgbGV0IG1hcCA9IHRoaXMubG9hZEZpbGUocHJldlBhdGgpXG4gICAgICAgICAgaWYgKCFtYXApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgJ1VuYWJsZSB0byBsb2FkIHByZXZpb3VzIHNvdXJjZSBtYXA6ICcgKyBwcmV2UGF0aC50b1N0cmluZygpXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBtYXBcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwcmV2IGluc3RhbmNlb2YgU291cmNlTWFwQ29uc3VtZXIpIHtcbiAgICAgICAgcmV0dXJuIFNvdXJjZU1hcEdlbmVyYXRvci5mcm9tU291cmNlTWFwKHByZXYpLnRvU3RyaW5nKClcbiAgICAgIH0gZWxzZSBpZiAocHJldiBpbnN0YW5jZW9mIFNvdXJjZU1hcEdlbmVyYXRvcikge1xuICAgICAgICByZXR1cm4gcHJldi50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuaXNNYXAocHJldikpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHByZXYpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1Vuc3VwcG9ydGVkIHByZXZpb3VzIHNvdXJjZSBtYXAgZm9ybWF0OiAnICsgcHJldi50b1N0cmluZygpXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuaW5saW5lKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWNvZGVJbmxpbmUodGhpcy5hbm5vdGF0aW9uKVxuICAgIH0gZWxzZSBpZiAodGhpcy5hbm5vdGF0aW9uKSB7XG4gICAgICBsZXQgbWFwID0gdGhpcy5hbm5vdGF0aW9uXG4gICAgICBpZiAoZmlsZSkgbWFwID0gam9pbihkaXJuYW1lKGZpbGUpLCBtYXApXG4gICAgICByZXR1cm4gdGhpcy5sb2FkRmlsZShtYXApXG4gICAgfVxuICB9XG5cbiAgaXNNYXAobWFwKSB7XG4gICAgaWYgKHR5cGVvZiBtYXAgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gKFxuICAgICAgdHlwZW9mIG1hcC5tYXBwaW5ncyA9PT0gJ3N0cmluZycgfHxcbiAgICAgIHR5cGVvZiBtYXAuX21hcHBpbmdzID09PSAnc3RyaW5nJyB8fFxuICAgICAgQXJyYXkuaXNBcnJheShtYXAuc2VjdGlvbnMpXG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJldmlvdXNNYXBcblByZXZpb3VzTWFwLmRlZmF1bHQgPSBQcmV2aW91c01hcFxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBOb1dvcmtSZXN1bHQgPSByZXF1aXJlKCcuL25vLXdvcmstcmVzdWx0JylcbmxldCBMYXp5UmVzdWx0ID0gcmVxdWlyZSgnLi9sYXp5LXJlc3VsdCcpXG5sZXQgRG9jdW1lbnQgPSByZXF1aXJlKCcuL2RvY3VtZW50JylcbmxldCBSb290ID0gcmVxdWlyZSgnLi9yb290JylcblxuY2xhc3MgUHJvY2Vzc29yIHtcbiAgY29uc3RydWN0b3IocGx1Z2lucyA9IFtdKSB7XG4gICAgdGhpcy52ZXJzaW9uID0gJzguNC41J1xuICAgIHRoaXMucGx1Z2lucyA9IHRoaXMubm9ybWFsaXplKHBsdWdpbnMpXG4gIH1cblxuICB1c2UocGx1Z2luKSB7XG4gICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wbHVnaW5zLmNvbmNhdCh0aGlzLm5vcm1hbGl6ZShbcGx1Z2luXSkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHByb2Nlc3MoY3NzLCBvcHRzID0ge30pIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLnBsdWdpbnMubGVuZ3RoID09PSAwICYmXG4gICAgICB0eXBlb2Ygb3B0cy5wYXJzZXIgPT09ICd1bmRlZmluZWQnICYmXG4gICAgICB0eXBlb2Ygb3B0cy5zdHJpbmdpZmllciA9PT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIHR5cGVvZiBvcHRzLnN5bnRheCA9PT0gJ3VuZGVmaW5lZCdcbiAgICApIHtcbiAgICAgIHJldHVybiBuZXcgTm9Xb3JrUmVzdWx0KHRoaXMsIGNzcywgb3B0cylcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5ldyBMYXp5UmVzdWx0KHRoaXMsIGNzcywgb3B0cylcbiAgICB9XG4gIH1cblxuICBub3JtYWxpemUocGx1Z2lucykge1xuICAgIGxldCBub3JtYWxpemVkID0gW11cbiAgICBmb3IgKGxldCBpIG9mIHBsdWdpbnMpIHtcbiAgICAgIGlmIChpLnBvc3Rjc3MgPT09IHRydWUpIHtcbiAgICAgICAgaSA9IGkoKVxuICAgICAgfSBlbHNlIGlmIChpLnBvc3Rjc3MpIHtcbiAgICAgICAgaSA9IGkucG9zdGNzc1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGkgPT09ICdvYmplY3QnICYmIEFycmF5LmlzQXJyYXkoaS5wbHVnaW5zKSkge1xuICAgICAgICBub3JtYWxpemVkID0gbm9ybWFsaXplZC5jb25jYXQoaS5wbHVnaW5zKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaSA9PT0gJ29iamVjdCcgJiYgaS5wb3N0Y3NzUGx1Z2luKSB7XG4gICAgICAgIG5vcm1hbGl6ZWQucHVzaChpKVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBub3JtYWxpemVkLnB1c2goaSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGkgPT09ICdvYmplY3QnICYmIChpLnBhcnNlIHx8IGkuc3RyaW5naWZ5KSkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdQb3N0Q1NTIHN5bnRheGVzIGNhbm5vdCBiZSB1c2VkIGFzIHBsdWdpbnMuIEluc3RlYWQsIHBsZWFzZSB1c2UgJyArXG4gICAgICAgICAgICAgICdvbmUgb2YgdGhlIHN5bnRheC9wYXJzZXIvc3RyaW5naWZpZXIgb3B0aW9ucyBhcyBvdXRsaW5lZCAnICtcbiAgICAgICAgICAgICAgJ2luIHlvdXIgUG9zdENTUyBydW5uZXIgZG9jdW1lbnRhdGlvbi4nXG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoaSArICcgaXMgbm90IGEgUG9zdENTUyBwbHVnaW4nKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9ybWFsaXplZFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvY2Vzc29yXG5Qcm9jZXNzb3IuZGVmYXVsdCA9IFByb2Nlc3NvclxuXG5Sb290LnJlZ2lzdGVyUHJvY2Vzc29yKFByb2Nlc3NvcilcbkRvY3VtZW50LnJlZ2lzdGVyUHJvY2Vzc29yKFByb2Nlc3NvcilcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgV2FybmluZyA9IHJlcXVpcmUoJy4vd2FybmluZycpXG5cbmNsYXNzIFJlc3VsdCB7XG4gIGNvbnN0cnVjdG9yKHByb2Nlc3Nvciwgcm9vdCwgb3B0cykge1xuICAgIHRoaXMucHJvY2Vzc29yID0gcHJvY2Vzc29yXG4gICAgdGhpcy5tZXNzYWdlcyA9IFtdXG4gICAgdGhpcy5yb290ID0gcm9vdFxuICAgIHRoaXMub3B0cyA9IG9wdHNcbiAgICB0aGlzLmNzcyA9IHVuZGVmaW5lZFxuICAgIHRoaXMubWFwID0gdW5kZWZpbmVkXG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5jc3NcbiAgfVxuXG4gIHdhcm4odGV4dCwgb3B0cyA9IHt9KSB7XG4gICAgaWYgKCFvcHRzLnBsdWdpbikge1xuICAgICAgaWYgKHRoaXMubGFzdFBsdWdpbiAmJiB0aGlzLmxhc3RQbHVnaW4ucG9zdGNzc1BsdWdpbikge1xuICAgICAgICBvcHRzLnBsdWdpbiA9IHRoaXMubGFzdFBsdWdpbi5wb3N0Y3NzUGx1Z2luXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHdhcm5pbmcgPSBuZXcgV2FybmluZyh0ZXh0LCBvcHRzKVxuICAgIHRoaXMubWVzc2FnZXMucHVzaCh3YXJuaW5nKVxuXG4gICAgcmV0dXJuIHdhcm5pbmdcbiAgfVxuXG4gIHdhcm5pbmdzKCkge1xuICAgIHJldHVybiB0aGlzLm1lc3NhZ2VzLmZpbHRlcihpID0+IGkudHlwZSA9PT0gJ3dhcm5pbmcnKVxuICB9XG5cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3NzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSZXN1bHRcblJlc3VsdC5kZWZhdWx0ID0gUmVzdWx0XG4iLCIndXNlIHN0cmljdCdcblxubGV0IENvbnRhaW5lciA9IHJlcXVpcmUoJy4vY29udGFpbmVyJylcblxubGV0IExhenlSZXN1bHQsIFByb2Nlc3NvclxuXG5jbGFzcyBSb290IGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgY29uc3RydWN0b3IoZGVmYXVsdHMpIHtcbiAgICBzdXBlcihkZWZhdWx0cylcbiAgICB0aGlzLnR5cGUgPSAncm9vdCdcbiAgICBpZiAoIXRoaXMubm9kZXMpIHRoaXMubm9kZXMgPSBbXVxuICB9XG5cbiAgcmVtb3ZlQ2hpbGQoY2hpbGQsIGlnbm9yZSkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuaW5kZXgoY2hpbGQpXG5cbiAgICBpZiAoIWlnbm9yZSAmJiBpbmRleCA9PT0gMCAmJiB0aGlzLm5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMubm9kZXNbMV0ucmF3cy5iZWZvcmUgPSB0aGlzLm5vZGVzW2luZGV4XS5yYXdzLmJlZm9yZVxuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5yZW1vdmVDaGlsZChjaGlsZClcbiAgfVxuXG4gIG5vcm1hbGl6ZShjaGlsZCwgc2FtcGxlLCB0eXBlKSB7XG4gICAgbGV0IG5vZGVzID0gc3VwZXIubm9ybWFsaXplKGNoaWxkKVxuXG4gICAgaWYgKHNhbXBsZSkge1xuICAgICAgaWYgKHR5cGUgPT09ICdwcmVwZW5kJykge1xuICAgICAgICBpZiAodGhpcy5ub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgc2FtcGxlLnJhd3MuYmVmb3JlID0gdGhpcy5ub2Rlc1sxXS5yYXdzLmJlZm9yZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBzYW1wbGUucmF3cy5iZWZvcmVcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmZpcnN0ICE9PSBzYW1wbGUpIHtcbiAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgIG5vZGUucmF3cy5iZWZvcmUgPSBzYW1wbGUucmF3cy5iZWZvcmVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBub2Rlc1xuICB9XG5cbiAgdG9SZXN1bHQob3B0cyA9IHt9KSB7XG4gICAgbGV0IGxhenkgPSBuZXcgTGF6eVJlc3VsdChuZXcgUHJvY2Vzc29yKCksIHRoaXMsIG9wdHMpXG4gICAgcmV0dXJuIGxhenkuc3RyaW5naWZ5KClcbiAgfVxufVxuXG5Sb290LnJlZ2lzdGVyTGF6eVJlc3VsdCA9IGRlcGVuZGFudCA9PiB7XG4gIExhenlSZXN1bHQgPSBkZXBlbmRhbnRcbn1cblxuUm9vdC5yZWdpc3RlclByb2Nlc3NvciA9IGRlcGVuZGFudCA9PiB7XG4gIFByb2Nlc3NvciA9IGRlcGVuZGFudFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJvb3RcblJvb3QuZGVmYXVsdCA9IFJvb3RcbiIsIid1c2Ugc3RyaWN0J1xuXG5sZXQgQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jb250YWluZXInKVxubGV0IGxpc3QgPSByZXF1aXJlKCcuL2xpc3QnKVxuXG5jbGFzcyBSdWxlIGV4dGVuZHMgQ29udGFpbmVyIHtcbiAgY29uc3RydWN0b3IoZGVmYXVsdHMpIHtcbiAgICBzdXBlcihkZWZhdWx0cylcbiAgICB0aGlzLnR5cGUgPSAncnVsZSdcbiAgICBpZiAoIXRoaXMubm9kZXMpIHRoaXMubm9kZXMgPSBbXVxuICB9XG5cbiAgZ2V0IHNlbGVjdG9ycygpIHtcbiAgICByZXR1cm4gbGlzdC5jb21tYSh0aGlzLnNlbGVjdG9yKVxuICB9XG5cbiAgc2V0IHNlbGVjdG9ycyh2YWx1ZXMpIHtcbiAgICBsZXQgbWF0Y2ggPSB0aGlzLnNlbGVjdG9yID8gdGhpcy5zZWxlY3Rvci5tYXRjaCgvLFxccyovKSA6IG51bGxcbiAgICBsZXQgc2VwID0gbWF0Y2ggPyBtYXRjaFswXSA6ICcsJyArIHRoaXMucmF3KCdiZXR3ZWVuJywgJ2JlZm9yZU9wZW4nKVxuICAgIHRoaXMuc2VsZWN0b3IgPSB2YWx1ZXMuam9pbihzZXApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSdWxlXG5SdWxlLmRlZmF1bHQgPSBSdWxlXG5cbkNvbnRhaW5lci5yZWdpc3RlclJ1bGUoUnVsZSlcbiIsIid1c2Ugc3RyaWN0J1xuXG5jb25zdCBERUZBVUxUX1JBVyA9IHtcbiAgY29sb246ICc6ICcsXG4gIGluZGVudDogJyAgICAnLFxuICBiZWZvcmVEZWNsOiAnXFxuJyxcbiAgYmVmb3JlUnVsZTogJ1xcbicsXG4gIGJlZm9yZU9wZW46ICcgJyxcbiAgYmVmb3JlQ2xvc2U6ICdcXG4nLFxuICBiZWZvcmVDb21tZW50OiAnXFxuJyxcbiAgYWZ0ZXI6ICdcXG4nLFxuICBlbXB0eUJvZHk6ICcnLFxuICBjb21tZW50TGVmdDogJyAnLFxuICBjb21tZW50UmlnaHQ6ICcgJyxcbiAgc2VtaWNvbG9uOiBmYWxzZVxufVxuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHN0cikge1xuICByZXR1cm4gc3RyWzBdLnRvVXBwZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSlcbn1cblxuY2xhc3MgU3RyaW5naWZpZXIge1xuICBjb25zdHJ1Y3RvcihidWlsZGVyKSB7XG4gICAgdGhpcy5idWlsZGVyID0gYnVpbGRlclxuICB9XG5cbiAgc3RyaW5naWZ5KG5vZGUsIHNlbWljb2xvbikge1xuICAgIC8qIGM4IGlnbm9yZSBzdGFydCAqL1xuICAgIGlmICghdGhpc1tub2RlLnR5cGVdKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdVbmtub3duIEFTVCBub2RlIHR5cGUgJyArXG4gICAgICAgICAgbm9kZS50eXBlICtcbiAgICAgICAgICAnLiAnICtcbiAgICAgICAgICAnTWF5YmUgeW91IG5lZWQgdG8gY2hhbmdlIFBvc3RDU1Mgc3RyaW5naWZpZXIuJ1xuICAgICAgKVxuICAgIH1cbiAgICAvKiBjOCBpZ25vcmUgc3RvcCAqL1xuICAgIHRoaXNbbm9kZS50eXBlXShub2RlLCBzZW1pY29sb24pXG4gIH1cblxuICBkb2N1bWVudChub2RlKSB7XG4gICAgdGhpcy5ib2R5KG5vZGUpXG4gIH1cblxuICByb290KG5vZGUpIHtcbiAgICB0aGlzLmJvZHkobm9kZSlcbiAgICBpZiAobm9kZS5yYXdzLmFmdGVyKSB0aGlzLmJ1aWxkZXIobm9kZS5yYXdzLmFmdGVyKVxuICB9XG5cbiAgY29tbWVudChub2RlKSB7XG4gICAgbGV0IGxlZnQgPSB0aGlzLnJhdyhub2RlLCAnbGVmdCcsICdjb21tZW50TGVmdCcpXG4gICAgbGV0IHJpZ2h0ID0gdGhpcy5yYXcobm9kZSwgJ3JpZ2h0JywgJ2NvbW1lbnRSaWdodCcpXG4gICAgdGhpcy5idWlsZGVyKCcvKicgKyBsZWZ0ICsgbm9kZS50ZXh0ICsgcmlnaHQgKyAnKi8nLCBub2RlKVxuICB9XG5cbiAgZGVjbChub2RlLCBzZW1pY29sb24pIHtcbiAgICBsZXQgYmV0d2VlbiA9IHRoaXMucmF3KG5vZGUsICdiZXR3ZWVuJywgJ2NvbG9uJylcbiAgICBsZXQgc3RyaW5nID0gbm9kZS5wcm9wICsgYmV0d2VlbiArIHRoaXMucmF3VmFsdWUobm9kZSwgJ3ZhbHVlJylcblxuICAgIGlmIChub2RlLmltcG9ydGFudCkge1xuICAgICAgc3RyaW5nICs9IG5vZGUucmF3cy5pbXBvcnRhbnQgfHwgJyAhaW1wb3J0YW50J1xuICAgIH1cblxuICAgIGlmIChzZW1pY29sb24pIHN0cmluZyArPSAnOydcbiAgICB0aGlzLmJ1aWxkZXIoc3RyaW5nLCBub2RlKVxuICB9XG5cbiAgcnVsZShub2RlKSB7XG4gICAgdGhpcy5ibG9jayhub2RlLCB0aGlzLnJhd1ZhbHVlKG5vZGUsICdzZWxlY3RvcicpKVxuICAgIGlmIChub2RlLnJhd3Mub3duU2VtaWNvbG9uKSB7XG4gICAgICB0aGlzLmJ1aWxkZXIobm9kZS5yYXdzLm93blNlbWljb2xvbiwgbm9kZSwgJ2VuZCcpXG4gICAgfVxuICB9XG5cbiAgYXRydWxlKG5vZGUsIHNlbWljb2xvbikge1xuICAgIGxldCBuYW1lID0gJ0AnICsgbm9kZS5uYW1lXG4gICAgbGV0IHBhcmFtcyA9IG5vZGUucGFyYW1zID8gdGhpcy5yYXdWYWx1ZShub2RlLCAncGFyYW1zJykgOiAnJ1xuXG4gICAgaWYgKHR5cGVvZiBub2RlLnJhd3MuYWZ0ZXJOYW1lICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgbmFtZSArPSBub2RlLnJhd3MuYWZ0ZXJOYW1lXG4gICAgfSBlbHNlIGlmIChwYXJhbXMpIHtcbiAgICAgIG5hbWUgKz0gJyAnXG4gICAgfVxuXG4gICAgaWYgKG5vZGUubm9kZXMpIHtcbiAgICAgIHRoaXMuYmxvY2sobm9kZSwgbmFtZSArIHBhcmFtcylcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGVuZCA9IChub2RlLnJhd3MuYmV0d2VlbiB8fCAnJykgKyAoc2VtaWNvbG9uID8gJzsnIDogJycpXG4gICAgICB0aGlzLmJ1aWxkZXIobmFtZSArIHBhcmFtcyArIGVuZCwgbm9kZSlcbiAgICB9XG4gIH1cblxuICBib2R5KG5vZGUpIHtcbiAgICBsZXQgbGFzdCA9IG5vZGUubm9kZXMubGVuZ3RoIC0gMVxuICAgIHdoaWxlIChsYXN0ID4gMCkge1xuICAgICAgaWYgKG5vZGUubm9kZXNbbGFzdF0udHlwZSAhPT0gJ2NvbW1lbnQnKSBicmVha1xuICAgICAgbGFzdCAtPSAxXG4gICAgfVxuXG4gICAgbGV0IHNlbWljb2xvbiA9IHRoaXMucmF3KG5vZGUsICdzZW1pY29sb24nKVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZS5ub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNoaWxkID0gbm9kZS5ub2Rlc1tpXVxuICAgICAgbGV0IGJlZm9yZSA9IHRoaXMucmF3KGNoaWxkLCAnYmVmb3JlJylcbiAgICAgIGlmIChiZWZvcmUpIHRoaXMuYnVpbGRlcihiZWZvcmUpXG4gICAgICB0aGlzLnN0cmluZ2lmeShjaGlsZCwgbGFzdCAhPT0gaSB8fCBzZW1pY29sb24pXG4gICAgfVxuICB9XG5cbiAgYmxvY2sobm9kZSwgc3RhcnQpIHtcbiAgICBsZXQgYmV0d2VlbiA9IHRoaXMucmF3KG5vZGUsICdiZXR3ZWVuJywgJ2JlZm9yZU9wZW4nKVxuICAgIHRoaXMuYnVpbGRlcihzdGFydCArIGJldHdlZW4gKyAneycsIG5vZGUsICdzdGFydCcpXG5cbiAgICBsZXQgYWZ0ZXJcbiAgICBpZiAobm9kZS5ub2RlcyAmJiBub2RlLm5vZGVzLmxlbmd0aCkge1xuICAgICAgdGhpcy5ib2R5KG5vZGUpXG4gICAgICBhZnRlciA9IHRoaXMucmF3KG5vZGUsICdhZnRlcicpXG4gICAgfSBlbHNlIHtcbiAgICAgIGFmdGVyID0gdGhpcy5yYXcobm9kZSwgJ2FmdGVyJywgJ2VtcHR5Qm9keScpXG4gICAgfVxuXG4gICAgaWYgKGFmdGVyKSB0aGlzLmJ1aWxkZXIoYWZ0ZXIpXG4gICAgdGhpcy5idWlsZGVyKCd9Jywgbm9kZSwgJ2VuZCcpXG4gIH1cblxuICByYXcobm9kZSwgb3duLCBkZXRlY3QpIHtcbiAgICBsZXQgdmFsdWVcbiAgICBpZiAoIWRldGVjdCkgZGV0ZWN0ID0gb3duXG5cbiAgICAvLyBBbHJlYWR5IGhhZFxuICAgIGlmIChvd24pIHtcbiAgICAgIHZhbHVlID0gbm9kZS5yYXdzW293bl1cbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSByZXR1cm4gdmFsdWVcbiAgICB9XG5cbiAgICBsZXQgcGFyZW50ID0gbm9kZS5wYXJlbnRcblxuICAgIGlmIChkZXRlY3QgPT09ICdiZWZvcmUnKSB7XG4gICAgICAvLyBIYWNrIGZvciBmaXJzdCBydWxlIGluIENTU1xuICAgICAgaWYgKCFwYXJlbnQgfHwgKHBhcmVudC50eXBlID09PSAncm9vdCcgJiYgcGFyZW50LmZpcnN0ID09PSBub2RlKSkge1xuICAgICAgICByZXR1cm4gJydcbiAgICAgIH1cblxuICAgICAgLy8gYHJvb3RgIG5vZGVzIGluIGBkb2N1bWVudGAgc2hvdWxkIHVzZSBvbmx5IHRoZWlyIG93biByYXdzXG4gICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50eXBlID09PSAnZG9jdW1lbnQnKSB7XG4gICAgICAgIHJldHVybiAnJ1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEZsb2F0aW5nIGNoaWxkIHdpdGhvdXQgcGFyZW50XG4gICAgaWYgKCFwYXJlbnQpIHJldHVybiBERUZBVUxUX1JBV1tkZXRlY3RdXG5cbiAgICAvLyBEZXRlY3Qgc3R5bGUgYnkgb3RoZXIgbm9kZXNcbiAgICBsZXQgcm9vdCA9IG5vZGUucm9vdCgpXG4gICAgaWYgKCFyb290LnJhd0NhY2hlKSByb290LnJhd0NhY2hlID0ge31cbiAgICBpZiAodHlwZW9mIHJvb3QucmF3Q2FjaGVbZGV0ZWN0XSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiByb290LnJhd0NhY2hlW2RldGVjdF1cbiAgICB9XG5cbiAgICBpZiAoZGV0ZWN0ID09PSAnYmVmb3JlJyB8fCBkZXRlY3QgPT09ICdhZnRlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLmJlZm9yZUFmdGVyKG5vZGUsIGRldGVjdClcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG1ldGhvZCA9ICdyYXcnICsgY2FwaXRhbGl6ZShkZXRlY3QpXG4gICAgICBpZiAodGhpc1ttZXRob2RdKSB7XG4gICAgICAgIHZhbHVlID0gdGhpc1ttZXRob2RdKHJvb3QsIG5vZGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb290LndhbGsoaSA9PiB7XG4gICAgICAgICAgdmFsdWUgPSBpLnJhd3Nbb3duXVxuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSByZXR1cm4gZmFsc2VcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykgdmFsdWUgPSBERUZBVUxUX1JBV1tkZXRlY3RdXG5cbiAgICByb290LnJhd0NhY2hlW2RldGVjdF0gPSB2YWx1ZVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgcmF3U2VtaWNvbG9uKHJvb3QpIHtcbiAgICBsZXQgdmFsdWVcbiAgICByb290LndhbGsoaSA9PiB7XG4gICAgICBpZiAoaS5ub2RlcyAmJiBpLm5vZGVzLmxlbmd0aCAmJiBpLmxhc3QudHlwZSA9PT0gJ2RlY2wnKSB7XG4gICAgICAgIHZhbHVlID0gaS5yYXdzLnNlbWljb2xvblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHJhd0VtcHR5Qm9keShyb290KSB7XG4gICAgbGV0IHZhbHVlXG4gICAgcm9vdC53YWxrKGkgPT4ge1xuICAgICAgaWYgKGkubm9kZXMgJiYgaS5ub2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFsdWUgPSBpLnJhd3MuYWZ0ZXJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICByYXdJbmRlbnQocm9vdCkge1xuICAgIGlmIChyb290LnJhd3MuaW5kZW50KSByZXR1cm4gcm9vdC5yYXdzLmluZGVudFxuICAgIGxldCB2YWx1ZVxuICAgIHJvb3Qud2FsayhpID0+IHtcbiAgICAgIGxldCBwID0gaS5wYXJlbnRcbiAgICAgIGlmIChwICYmIHAgIT09IHJvb3QgJiYgcC5wYXJlbnQgJiYgcC5wYXJlbnQgPT09IHJvb3QpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIGxldCBwYXJ0cyA9IGkucmF3cy5iZWZvcmUuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgdmFsdWUgPSBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXVxuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxTL2csICcnKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHJhd0JlZm9yZUNvbW1lbnQocm9vdCwgbm9kZSkge1xuICAgIGxldCB2YWx1ZVxuICAgIHJvb3Qud2Fsa0NvbW1lbnRzKGkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBpLnJhd3MuYmVmb3JlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZWZvcmVcbiAgICAgICAgaWYgKHZhbHVlLmluY2x1ZGVzKCdcXG4nKSkge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXG5dKyQvLCAnJylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVEZWNsJylcbiAgICB9IGVsc2UgaWYgKHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcUy9nLCAnJylcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICByYXdCZWZvcmVEZWNsKHJvb3QsIG5vZGUpIHtcbiAgICBsZXQgdmFsdWVcbiAgICByb290LndhbGtEZWNscyhpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgaS5yYXdzLmJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmVmb3JlXG4gICAgICAgIGlmICh2YWx1ZS5pbmNsdWRlcygnXFxuJykpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxuXSskLywgJycpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlUnVsZScpXG4gICAgfSBlbHNlIGlmICh2YWx1ZSkge1xuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXFMvZywgJycpXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgcmF3QmVmb3JlUnVsZShyb290KSB7XG4gICAgbGV0IHZhbHVlXG4gICAgcm9vdC53YWxrKGkgPT4ge1xuICAgICAgaWYgKGkubm9kZXMgJiYgKGkucGFyZW50ICE9PSByb290IHx8IHJvb3QuZmlyc3QgIT09IGkpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaS5yYXdzLmJlZm9yZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5iZWZvcmVcbiAgICAgICAgICBpZiAodmFsdWUuaW5jbHVkZXMoJ1xcbicpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxuXSskLywgJycpXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAodmFsdWUpIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXFxTL2csICcnKVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgcmF3QmVmb3JlQ2xvc2Uocm9vdCkge1xuICAgIGxldCB2YWx1ZVxuICAgIHJvb3Qud2FsayhpID0+IHtcbiAgICAgIGlmIChpLm5vZGVzICYmIGkubm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAodHlwZW9mIGkucmF3cy5hZnRlciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB2YWx1ZSA9IGkucmF3cy5hZnRlclxuICAgICAgICAgIGlmICh2YWx1ZS5pbmNsdWRlcygnXFxuJykpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvW15cXG5dKyQvLCAnJylcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICh2YWx1ZSkgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXFMvZywgJycpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICByYXdCZWZvcmVPcGVuKHJvb3QpIHtcbiAgICBsZXQgdmFsdWVcbiAgICByb290LndhbGsoaSA9PiB7XG4gICAgICBpZiAoaS50eXBlICE9PSAnZGVjbCcpIHtcbiAgICAgICAgdmFsdWUgPSBpLnJhd3MuYmV0d2VlblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIHJhd0NvbG9uKHJvb3QpIHtcbiAgICBsZXQgdmFsdWVcbiAgICByb290LndhbGtEZWNscyhpID0+IHtcbiAgICAgIGlmICh0eXBlb2YgaS5yYXdzLmJldHdlZW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbHVlID0gaS5yYXdzLmJldHdlZW4ucmVwbGFjZSgvW15cXHM6XS9nLCAnJylcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIGJlZm9yZUFmdGVyKG5vZGUsIGRldGVjdCkge1xuICAgIGxldCB2YWx1ZVxuICAgIGlmIChub2RlLnR5cGUgPT09ICdkZWNsJykge1xuICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlRGVjbCcpXG4gICAgfSBlbHNlIGlmIChub2RlLnR5cGUgPT09ICdjb21tZW50Jykge1xuICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlQ29tbWVudCcpXG4gICAgfSBlbHNlIGlmIChkZXRlY3QgPT09ICdiZWZvcmUnKSB7XG4gICAgICB2YWx1ZSA9IHRoaXMucmF3KG5vZGUsIG51bGwsICdiZWZvcmVSdWxlJylcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSB0aGlzLnJhdyhub2RlLCBudWxsLCAnYmVmb3JlQ2xvc2UnKVxuICAgIH1cblxuICAgIGxldCBidWYgPSBub2RlLnBhcmVudFxuICAgIGxldCBkZXB0aCA9IDBcbiAgICB3aGlsZSAoYnVmICYmIGJ1Zi50eXBlICE9PSAncm9vdCcpIHtcbiAgICAgIGRlcHRoICs9IDFcbiAgICAgIGJ1ZiA9IGJ1Zi5wYXJlbnRcbiAgICB9XG5cbiAgICBpZiAodmFsdWUuaW5jbHVkZXMoJ1xcbicpKSB7XG4gICAgICBsZXQgaW5kZW50ID0gdGhpcy5yYXcobm9kZSwgbnVsbCwgJ2luZGVudCcpXG4gICAgICBpZiAoaW5kZW50Lmxlbmd0aCkge1xuICAgICAgICBmb3IgKGxldCBzdGVwID0gMDsgc3RlcCA8IGRlcHRoOyBzdGVwKyspIHZhbHVlICs9IGluZGVudFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgcmF3VmFsdWUobm9kZSwgcHJvcCkge1xuICAgIGxldCB2YWx1ZSA9IG5vZGVbcHJvcF1cbiAgICBsZXQgcmF3ID0gbm9kZS5yYXdzW3Byb3BdXG4gICAgaWYgKHJhdyAmJiByYXcudmFsdWUgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gcmF3LnJhd1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RyaW5naWZpZXJcblN0cmluZ2lmaWVyLmRlZmF1bHQgPSBTdHJpbmdpZmllclxuIiwiJ3VzZSBzdHJpY3QnXG5cbmxldCBTdHJpbmdpZmllciA9IHJlcXVpcmUoJy4vc3RyaW5naWZpZXInKVxuXG5mdW5jdGlvbiBzdHJpbmdpZnkobm9kZSwgYnVpbGRlcikge1xuICBsZXQgc3RyID0gbmV3IFN0cmluZ2lmaWVyKGJ1aWxkZXIpXG4gIHN0ci5zdHJpbmdpZnkobm9kZSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHJpbmdpZnlcbnN0cmluZ2lmeS5kZWZhdWx0ID0gc3RyaW5naWZ5XG4iLCIndXNlIHN0cmljdCdcblxubW9kdWxlLmV4cG9ydHMuaXNDbGVhbiA9IFN5bWJvbCgnaXNDbGVhbicpXG5cbm1vZHVsZS5leHBvcnRzLm15ID0gU3ltYm9sKCdteScpXG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgU0lOR0xFX1FVT1RFID0gXCInXCIuY2hhckNvZGVBdCgwKVxuY29uc3QgRE9VQkxFX1FVT1RFID0gJ1wiJy5jaGFyQ29kZUF0KDApXG5jb25zdCBCQUNLU0xBU0ggPSAnXFxcXCcuY2hhckNvZGVBdCgwKVxuY29uc3QgU0xBU0ggPSAnLycuY2hhckNvZGVBdCgwKVxuY29uc3QgTkVXTElORSA9ICdcXG4nLmNoYXJDb2RlQXQoMClcbmNvbnN0IFNQQUNFID0gJyAnLmNoYXJDb2RlQXQoMClcbmNvbnN0IEZFRUQgPSAnXFxmJy5jaGFyQ29kZUF0KDApXG5jb25zdCBUQUIgPSAnXFx0Jy5jaGFyQ29kZUF0KDApXG5jb25zdCBDUiA9ICdcXHInLmNoYXJDb2RlQXQoMClcbmNvbnN0IE9QRU5fU1FVQVJFID0gJ1snLmNoYXJDb2RlQXQoMClcbmNvbnN0IENMT1NFX1NRVUFSRSA9ICddJy5jaGFyQ29kZUF0KDApXG5jb25zdCBPUEVOX1BBUkVOVEhFU0VTID0gJygnLmNoYXJDb2RlQXQoMClcbmNvbnN0IENMT1NFX1BBUkVOVEhFU0VTID0gJyknLmNoYXJDb2RlQXQoMClcbmNvbnN0IE9QRU5fQ1VSTFkgPSAneycuY2hhckNvZGVBdCgwKVxuY29uc3QgQ0xPU0VfQ1VSTFkgPSAnfScuY2hhckNvZGVBdCgwKVxuY29uc3QgU0VNSUNPTE9OID0gJzsnLmNoYXJDb2RlQXQoMClcbmNvbnN0IEFTVEVSSVNLID0gJyonLmNoYXJDb2RlQXQoMClcbmNvbnN0IENPTE9OID0gJzonLmNoYXJDb2RlQXQoMClcbmNvbnN0IEFUID0gJ0AnLmNoYXJDb2RlQXQoMClcblxuY29uc3QgUkVfQVRfRU5EID0gL1tcXHRcXG5cXGZcXHIgXCIjJygpLztbXFxcXFxcXXt9XS9nXG5jb25zdCBSRV9XT1JEX0VORCA9IC9bXFx0XFxuXFxmXFxyICFcIiMnKCk6O0BbXFxcXFxcXXt9XXxcXC8oPz1cXCopL2dcbmNvbnN0IFJFX0JBRF9CUkFDS0VUID0gLy5bXFxuXCInKC9cXFxcXS9cbmNvbnN0IFJFX0hFWF9FU0NBUEUgPSAvW1xcZGEtZl0vaVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHRva2VuaXplcihpbnB1dCwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBjc3MgPSBpbnB1dC5jc3MudmFsdWVPZigpXG4gIGxldCBpZ25vcmUgPSBvcHRpb25zLmlnbm9yZUVycm9yc1xuXG4gIGxldCBjb2RlLCBuZXh0LCBxdW90ZSwgY29udGVudCwgZXNjYXBlXG4gIGxldCBlc2NhcGVkLCBlc2NhcGVQb3MsIHByZXYsIG4sIGN1cnJlbnRUb2tlblxuXG4gIGxldCBsZW5ndGggPSBjc3MubGVuZ3RoXG4gIGxldCBwb3MgPSAwXG4gIGxldCBidWZmZXIgPSBbXVxuICBsZXQgcmV0dXJuZWQgPSBbXVxuXG4gIGZ1bmN0aW9uIHBvc2l0aW9uKCkge1xuICAgIHJldHVybiBwb3NcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuY2xvc2VkKHdoYXQpIHtcbiAgICB0aHJvdyBpbnB1dC5lcnJvcignVW5jbG9zZWQgJyArIHdoYXQsIHBvcylcbiAgfVxuXG4gIGZ1bmN0aW9uIGVuZE9mRmlsZSgpIHtcbiAgICByZXR1cm4gcmV0dXJuZWQubGVuZ3RoID09PSAwICYmIHBvcyA+PSBsZW5ndGhcbiAgfVxuXG4gIGZ1bmN0aW9uIG5leHRUb2tlbihvcHRzKSB7XG4gICAgaWYgKHJldHVybmVkLmxlbmd0aCkgcmV0dXJuIHJldHVybmVkLnBvcCgpXG4gICAgaWYgKHBvcyA+PSBsZW5ndGgpIHJldHVyblxuXG4gICAgbGV0IGlnbm9yZVVuY2xvc2VkID0gb3B0cyA/IG9wdHMuaWdub3JlVW5jbG9zZWQgOiBmYWxzZVxuXG4gICAgY29kZSA9IGNzcy5jaGFyQ29kZUF0KHBvcylcblxuICAgIHN3aXRjaCAoY29kZSkge1xuICAgICAgY2FzZSBORVdMSU5FOlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgIGNhc2UgVEFCOlxuICAgICAgY2FzZSBDUjpcbiAgICAgIGNhc2UgRkVFRDoge1xuICAgICAgICBuZXh0ID0gcG9zXG4gICAgICAgIGRvIHtcbiAgICAgICAgICBuZXh0ICs9IDFcbiAgICAgICAgICBjb2RlID0gY3NzLmNoYXJDb2RlQXQobmV4dClcbiAgICAgICAgfSB3aGlsZSAoXG4gICAgICAgICAgY29kZSA9PT0gU1BBQ0UgfHxcbiAgICAgICAgICBjb2RlID09PSBORVdMSU5FIHx8XG4gICAgICAgICAgY29kZSA9PT0gVEFCIHx8XG4gICAgICAgICAgY29kZSA9PT0gQ1IgfHxcbiAgICAgICAgICBjb2RlID09PSBGRUVEXG4gICAgICAgIClcblxuICAgICAgICBjdXJyZW50VG9rZW4gPSBbJ3NwYWNlJywgY3NzLnNsaWNlKHBvcywgbmV4dCldXG4gICAgICAgIHBvcyA9IG5leHQgLSAxXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgT1BFTl9TUVVBUkU6XG4gICAgICBjYXNlIENMT1NFX1NRVUFSRTpcbiAgICAgIGNhc2UgT1BFTl9DVVJMWTpcbiAgICAgIGNhc2UgQ0xPU0VfQ1VSTFk6XG4gICAgICBjYXNlIENPTE9OOlxuICAgICAgY2FzZSBTRU1JQ09MT046XG4gICAgICBjYXNlIENMT1NFX1BBUkVOVEhFU0VTOiB7XG4gICAgICAgIGxldCBjb250cm9sQ2hhciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoY29kZSlcbiAgICAgICAgY3VycmVudFRva2VuID0gW2NvbnRyb2xDaGFyLCBjb250cm9sQ2hhciwgcG9zXVxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIE9QRU5fUEFSRU5USEVTRVM6IHtcbiAgICAgICAgcHJldiA9IGJ1ZmZlci5sZW5ndGggPyBidWZmZXIucG9wKClbMV0gOiAnJ1xuICAgICAgICBuID0gY3NzLmNoYXJDb2RlQXQocG9zICsgMSlcbiAgICAgICAgaWYgKFxuICAgICAgICAgIHByZXYgPT09ICd1cmwnICYmXG4gICAgICAgICAgbiAhPT0gU0lOR0xFX1FVT1RFICYmXG4gICAgICAgICAgbiAhPT0gRE9VQkxFX1FVT1RFICYmXG4gICAgICAgICAgbiAhPT0gU1BBQ0UgJiZcbiAgICAgICAgICBuICE9PSBORVdMSU5FICYmXG4gICAgICAgICAgbiAhPT0gVEFCICYmXG4gICAgICAgICAgbiAhPT0gRkVFRCAmJlxuICAgICAgICAgIG4gIT09IENSXG4gICAgICAgICkge1xuICAgICAgICAgIG5leHQgPSBwb3NcbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBlc2NhcGVkID0gZmFsc2VcbiAgICAgICAgICAgIG5leHQgPSBjc3MuaW5kZXhPZignKScsIG5leHQgKyAxKVxuICAgICAgICAgICAgaWYgKG5leHQgPT09IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChpZ25vcmUgfHwgaWdub3JlVW5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBuZXh0ID0gcG9zXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1bmNsb3NlZCgnYnJhY2tldCcpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVzY2FwZVBvcyA9IG5leHRcbiAgICAgICAgICAgIHdoaWxlIChjc3MuY2hhckNvZGVBdChlc2NhcGVQb3MgLSAxKSA9PT0gQkFDS1NMQVNIKSB7XG4gICAgICAgICAgICAgIGVzY2FwZVBvcyAtPSAxXG4gICAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gd2hpbGUgKGVzY2FwZWQpXG5cbiAgICAgICAgICBjdXJyZW50VG9rZW4gPSBbJ2JyYWNrZXRzJywgY3NzLnNsaWNlKHBvcywgbmV4dCArIDEpLCBwb3MsIG5leHRdXG5cbiAgICAgICAgICBwb3MgPSBuZXh0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV4dCA9IGNzcy5pbmRleE9mKCcpJywgcG9zICsgMSlcbiAgICAgICAgICBjb250ZW50ID0gY3NzLnNsaWNlKHBvcywgbmV4dCArIDEpXG5cbiAgICAgICAgICBpZiAobmV4dCA9PT0gLTEgfHwgUkVfQkFEX0JSQUNLRVQudGVzdChjb250ZW50KSkge1xuICAgICAgICAgICAgY3VycmVudFRva2VuID0gWycoJywgJygnLCBwb3NdXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGN1cnJlbnRUb2tlbiA9IFsnYnJhY2tldHMnLCBjb250ZW50LCBwb3MsIG5leHRdXG4gICAgICAgICAgICBwb3MgPSBuZXh0XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cblxuICAgICAgY2FzZSBTSU5HTEVfUVVPVEU6XG4gICAgICBjYXNlIERPVUJMRV9RVU9URToge1xuICAgICAgICBxdW90ZSA9IGNvZGUgPT09IFNJTkdMRV9RVU9URSA/IFwiJ1wiIDogJ1wiJ1xuICAgICAgICBuZXh0ID0gcG9zXG4gICAgICAgIGRvIHtcbiAgICAgICAgICBlc2NhcGVkID0gZmFsc2VcbiAgICAgICAgICBuZXh0ID0gY3NzLmluZGV4T2YocXVvdGUsIG5leHQgKyAxKVxuICAgICAgICAgIGlmIChuZXh0ID09PSAtMSkge1xuICAgICAgICAgICAgaWYgKGlnbm9yZSB8fCBpZ25vcmVVbmNsb3NlZCkge1xuICAgICAgICAgICAgICBuZXh0ID0gcG9zICsgMVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdW5jbG9zZWQoJ3N0cmluZycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVzY2FwZVBvcyA9IG5leHRcbiAgICAgICAgICB3aGlsZSAoY3NzLmNoYXJDb2RlQXQoZXNjYXBlUG9zIC0gMSkgPT09IEJBQ0tTTEFTSCkge1xuICAgICAgICAgICAgZXNjYXBlUG9zIC09IDFcbiAgICAgICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZFxuICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoZXNjYXBlZClcblxuICAgICAgICBjdXJyZW50VG9rZW4gPSBbJ3N0cmluZycsIGNzcy5zbGljZShwb3MsIG5leHQgKyAxKSwgcG9zLCBuZXh0XVxuICAgICAgICBwb3MgPSBuZXh0XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG5cbiAgICAgIGNhc2UgQVQ6IHtcbiAgICAgICAgUkVfQVRfRU5ELmxhc3RJbmRleCA9IHBvcyArIDFcbiAgICAgICAgUkVfQVRfRU5ELnRlc3QoY3NzKVxuICAgICAgICBpZiAoUkVfQVRfRU5ELmxhc3RJbmRleCA9PT0gMCkge1xuICAgICAgICAgIG5leHQgPSBjc3MubGVuZ3RoIC0gMVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5leHQgPSBSRV9BVF9FTkQubGFzdEluZGV4IC0gMlxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFRva2VuID0gWydhdC13b3JkJywgY3NzLnNsaWNlKHBvcywgbmV4dCArIDEpLCBwb3MsIG5leHRdXG5cbiAgICAgICAgcG9zID0gbmV4dFxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBjYXNlIEJBQ0tTTEFTSDoge1xuICAgICAgICBuZXh0ID0gcG9zXG4gICAgICAgIGVzY2FwZSA9IHRydWVcbiAgICAgICAgd2hpbGUgKGNzcy5jaGFyQ29kZUF0KG5leHQgKyAxKSA9PT0gQkFDS1NMQVNIKSB7XG4gICAgICAgICAgbmV4dCArPSAxXG4gICAgICAgICAgZXNjYXBlID0gIWVzY2FwZVxuICAgICAgICB9XG4gICAgICAgIGNvZGUgPSBjc3MuY2hhckNvZGVBdChuZXh0ICsgMSlcbiAgICAgICAgaWYgKFxuICAgICAgICAgIGVzY2FwZSAmJlxuICAgICAgICAgIGNvZGUgIT09IFNMQVNIICYmXG4gICAgICAgICAgY29kZSAhPT0gU1BBQ0UgJiZcbiAgICAgICAgICBjb2RlICE9PSBORVdMSU5FICYmXG4gICAgICAgICAgY29kZSAhPT0gVEFCICYmXG4gICAgICAgICAgY29kZSAhPT0gQ1IgJiZcbiAgICAgICAgICBjb2RlICE9PSBGRUVEXG4gICAgICAgICkge1xuICAgICAgICAgIG5leHQgKz0gMVxuICAgICAgICAgIGlmIChSRV9IRVhfRVNDQVBFLnRlc3QoY3NzLmNoYXJBdChuZXh0KSkpIHtcbiAgICAgICAgICAgIHdoaWxlIChSRV9IRVhfRVNDQVBFLnRlc3QoY3NzLmNoYXJBdChuZXh0ICsgMSkpKSB7XG4gICAgICAgICAgICAgIG5leHQgKz0gMVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNzcy5jaGFyQ29kZUF0KG5leHQgKyAxKSA9PT0gU1BBQ0UpIHtcbiAgICAgICAgICAgICAgbmV4dCArPSAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudFRva2VuID0gWyd3b3JkJywgY3NzLnNsaWNlKHBvcywgbmV4dCArIDEpLCBwb3MsIG5leHRdXG5cbiAgICAgICAgcG9zID0gbmV4dFxuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0OiB7XG4gICAgICAgIGlmIChjb2RlID09PSBTTEFTSCAmJiBjc3MuY2hhckNvZGVBdChwb3MgKyAxKSA9PT0gQVNURVJJU0spIHtcbiAgICAgICAgICBuZXh0ID0gY3NzLmluZGV4T2YoJyovJywgcG9zICsgMikgKyAxXG4gICAgICAgICAgaWYgKG5leHQgPT09IDApIHtcbiAgICAgICAgICAgIGlmIChpZ25vcmUgfHwgaWdub3JlVW5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgbmV4dCA9IGNzcy5sZW5ndGhcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHVuY2xvc2VkKCdjb21tZW50JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyZW50VG9rZW4gPSBbJ2NvbW1lbnQnLCBjc3Muc2xpY2UocG9zLCBuZXh0ICsgMSksIHBvcywgbmV4dF1cbiAgICAgICAgICBwb3MgPSBuZXh0XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgUkVfV09SRF9FTkQubGFzdEluZGV4ID0gcG9zICsgMVxuICAgICAgICAgIFJFX1dPUkRfRU5ELnRlc3QoY3NzKVxuICAgICAgICAgIGlmIChSRV9XT1JEX0VORC5sYXN0SW5kZXggPT09IDApIHtcbiAgICAgICAgICAgIG5leHQgPSBjc3MubGVuZ3RoIC0gMVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXh0ID0gUkVfV09SRF9FTkQubGFzdEluZGV4IC0gMlxuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRUb2tlbiA9IFsnd29yZCcsIGNzcy5zbGljZShwb3MsIG5leHQgKyAxKSwgcG9zLCBuZXh0XVxuICAgICAgICAgIGJ1ZmZlci5wdXNoKGN1cnJlbnRUb2tlbilcbiAgICAgICAgICBwb3MgPSBuZXh0XG4gICAgICAgIH1cblxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cblxuICAgIHBvcysrXG4gICAgcmV0dXJuIGN1cnJlbnRUb2tlblxuICB9XG5cbiAgZnVuY3Rpb24gYmFjayh0b2tlbikge1xuICAgIHJldHVybmVkLnB1c2godG9rZW4pXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGJhY2ssXG4gICAgbmV4dFRva2VuLFxuICAgIGVuZE9mRmlsZSxcbiAgICBwb3NpdGlvblxuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4ndXNlIHN0cmljdCdcblxubGV0IHByaW50ZWQgPSB7fVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdhcm5PbmNlKG1lc3NhZ2UpIHtcbiAgaWYgKHByaW50ZWRbbWVzc2FnZV0pIHJldHVyblxuICBwcmludGVkW21lc3NhZ2VdID0gdHJ1ZVxuXG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZS53YXJuKSB7XG4gICAgY29uc29sZS53YXJuKG1lc3NhZ2UpXG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBXYXJuaW5nIHtcbiAgY29uc3RydWN0b3IodGV4dCwgb3B0cyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gJ3dhcm5pbmcnXG4gICAgdGhpcy50ZXh0ID0gdGV4dFxuXG4gICAgaWYgKG9wdHMubm9kZSAmJiBvcHRzLm5vZGUuc291cmNlKSB7XG4gICAgICBsZXQgcmFuZ2UgPSBvcHRzLm5vZGUucmFuZ2VCeShvcHRzKVxuICAgICAgdGhpcy5saW5lID0gcmFuZ2Uuc3RhcnQubGluZVxuICAgICAgdGhpcy5jb2x1bW4gPSByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgIHRoaXMuZW5kTGluZSA9IHJhbmdlLmVuZC5saW5lXG4gICAgICB0aGlzLmVuZENvbHVtbiA9IHJhbmdlLmVuZC5jb2x1bW5cbiAgICB9XG5cbiAgICBmb3IgKGxldCBvcHQgaW4gb3B0cykgdGhpc1tvcHRdID0gb3B0c1tvcHRdXG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBpZiAodGhpcy5ub2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy5ub2RlLmVycm9yKHRoaXMudGV4dCwge1xuICAgICAgICBwbHVnaW46IHRoaXMucGx1Z2luLFxuICAgICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgICAgd29yZDogdGhpcy53b3JkXG4gICAgICB9KS5tZXNzYWdlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGx1Z2luKSB7XG4gICAgICByZXR1cm4gdGhpcy5wbHVnaW4gKyAnOiAnICsgdGhpcy50ZXh0XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMudGV4dFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gV2FybmluZ1xuV2FybmluZy5kZWZhdWx0ID0gV2FybmluZ1xuIiwiY29uc3QgaHRtbHBhcnNlciA9IHJlcXVpcmUoJ2h0bWxwYXJzZXIyJyk7XG5jb25zdCBlc2NhcGVTdHJpbmdSZWdleHAgPSByZXF1aXJlKCdlc2NhcGUtc3RyaW5nLXJlZ2V4cCcpO1xuY29uc3QgeyBpc1BsYWluT2JqZWN0IH0gPSByZXF1aXJlKCdpcy1wbGFpbi1vYmplY3QnKTtcbmNvbnN0IGRlZXBtZXJnZSA9IHJlcXVpcmUoJ2RlZXBtZXJnZScpO1xuY29uc3QgcGFyc2VTcmNzZXQgPSByZXF1aXJlKCdwYXJzZS1zcmNzZXQnKTtcbmNvbnN0IHsgcGFyc2U6IHBvc3Rjc3NQYXJzZSB9ID0gcmVxdWlyZSgncG9zdGNzcycpO1xuLy8gVGFncyB0aGF0IGNhbiBjb25jZWl2YWJseSByZXByZXNlbnQgc3RhbmQtYWxvbmUgbWVkaWEuXG5jb25zdCBtZWRpYVRhZ3MgPSBbXG4gICdpbWcnLCAnYXVkaW8nLCAndmlkZW8nLCAncGljdHVyZScsICdzdmcnLFxuICAnb2JqZWN0JywgJ21hcCcsICdpZnJhbWUnLCAnZW1iZWQnXG5dO1xuLy8gVGFncyB0aGF0IGFyZSBpbmhlcmVudGx5IHZ1bG5lcmFibGUgdG8gYmVpbmcgdXNlZCBpbiBYU1MgYXR0YWNrcy5cbmNvbnN0IHZ1bG5lcmFibGVUYWdzID0gWyAnc2NyaXB0JywgJ3N0eWxlJyBdO1xuXG5mdW5jdGlvbiBlYWNoKG9iaiwgY2IpIHtcbiAgaWYgKG9iaikge1xuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBjYihvYmpba2V5XSwga2V5KTtcbiAgICB9KTtcbiAgfVxufVxuXG4vLyBBdm9pZCBmYWxzZSBwb3NpdGl2ZXMgd2l0aCAuX19wcm90b19fLCAuaGFzT3duUHJvcGVydHksIGV0Yy5cbmZ1bmN0aW9uIGhhcyhvYmosIGtleSkge1xuICByZXR1cm4gKHt9KS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KTtcbn1cblxuLy8gUmV0dXJucyB0aG9zZSBlbGVtZW50cyBvZiBgYWAgZm9yIHdoaWNoIGBjYihhKWAgcmV0dXJucyB0cnV0aHlcbmZ1bmN0aW9uIGZpbHRlcihhLCBjYikge1xuICBjb25zdCBuID0gW107XG4gIGVhY2goYSwgZnVuY3Rpb24odikge1xuICAgIGlmIChjYih2KSkge1xuICAgICAgbi5wdXNoKHYpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBuO1xufVxuXG5mdW5jdGlvbiBpc0VtcHR5T2JqZWN0KG9iaikge1xuICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcbiAgICBpZiAoaGFzKG9iaiwga2V5KSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5U3Jjc2V0KHBhcnNlZFNyY3NldCkge1xuICByZXR1cm4gcGFyc2VkU3Jjc2V0Lm1hcChmdW5jdGlvbihwYXJ0KSB7XG4gICAgaWYgKCFwYXJ0LnVybCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUkwgbWlzc2luZycpO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICBwYXJ0LnVybCArXG4gICAgICAocGFydC53ID8gYCAke3BhcnQud313YCA6ICcnKSArXG4gICAgICAocGFydC5oID8gYCAke3BhcnQuaH1oYCA6ICcnKSArXG4gICAgICAocGFydC5kID8gYCAke3BhcnQuZH14YCA6ICcnKVxuICAgICk7XG4gIH0pLmpvaW4oJywgJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2FuaXRpemVIdG1sO1xuXG4vLyBBIHZhbGlkIGF0dHJpYnV0ZSBuYW1lLlxuLy8gV2UgdXNlIGEgdG9sZXJhbnQgZGVmaW5pdGlvbiBiYXNlZCBvbiB0aGUgc2V0IG9mIHN0cmluZ3MgZGVmaW5lZCBieVxuLy8gaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3BhcnNpbmcuaHRtbCNiZWZvcmUtYXR0cmlidXRlLW5hbWUtc3RhdGVcbi8vIGFuZCBodG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvcGFyc2luZy5odG1sI2F0dHJpYnV0ZS1uYW1lLXN0YXRlIC5cbi8vIFRoZSBjaGFyYWN0ZXJzIGFjY2VwdGVkIGFyZSBvbmVzIHdoaWNoIGNhbiBiZSBhcHBlbmRlZCB0byB0aGUgYXR0cmlidXRlXG4vLyBuYW1lIGJ1ZmZlciB3aXRob3V0IHRyaWdnZXJpbmcgYSBwYXJzZSBlcnJvcjpcbi8vICAgKiB1bmV4cGVjdGVkLWVxdWFscy1zaWduLWJlZm9yZS1hdHRyaWJ1dGUtbmFtZVxuLy8gICAqIHVuZXhwZWN0ZWQtbnVsbC1jaGFyYWN0ZXJcbi8vICAgKiB1bmV4cGVjdGVkLWNoYXJhY3Rlci1pbi1hdHRyaWJ1dGUtbmFtZVxuLy8gV2UgZXhjbHVkZSB0aGUgZW1wdHkgc3RyaW5nIGJlY2F1c2UgaXQncyBpbXBvc3NpYmxlIHRvIGdldCB0byB0aGUgYWZ0ZXJcbi8vIGF0dHJpYnV0ZSBuYW1lIHN0YXRlIHdpdGggYW4gZW1wdHkgYXR0cmlidXRlIG5hbWUgYnVmZmVyLlxuY29uc3QgVkFMSURfSFRNTF9BVFRSSUJVVEVfTkFNRSA9IC9eW15cXDBcXHRcXG5cXGZcXHIgLzw9Pl0rJC87XG5cbi8vIElnbm9yZSB0aGUgX3JlY3Vyc2luZyBmbGFnOyBpdCdzIHRoZXJlIGZvciByZWN1cnNpdmVcbi8vIGludm9jYXRpb24gYXMgYSBndWFyZCBhZ2FpbnN0IHRoaXMgZXhwbG9pdDpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mYjU1L2h0bWxwYXJzZXIyL2lzc3Vlcy8xMDVcblxuZnVuY3Rpb24gc2FuaXRpemVIdG1sKGh0bWwsIG9wdGlvbnMsIF9yZWN1cnNpbmcpIHtcbiAgaWYgKGh0bWwgPT0gbnVsbCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIGxldCByZXN1bHQgPSAnJztcbiAgLy8gVXNlZCBmb3IgaG90IHN3YXBwaW5nIHRoZSByZXN1bHQgdmFyaWFibGUgd2l0aCBhbiBlbXB0eSBzdHJpbmcgaW4gb3JkZXIgdG8gXCJjYXB0dXJlXCIgdGhlIHRleHQgd3JpdHRlbiB0byBpdC5cbiAgbGV0IHRlbXBSZXN1bHQgPSAnJztcblxuICBmdW5jdGlvbiBGcmFtZSh0YWcsIGF0dHJpYnMpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICB0aGlzLnRhZyA9IHRhZztcbiAgICB0aGlzLmF0dHJpYnMgPSBhdHRyaWJzIHx8IHt9O1xuICAgIHRoaXMudGFnUG9zaXRpb24gPSByZXN1bHQubGVuZ3RoO1xuICAgIHRoaXMudGV4dCA9ICcnOyAvLyBOb2RlIGlubmVyIHRleHRcbiAgICB0aGlzLm1lZGlhQ2hpbGRyZW4gPSBbXTtcblxuICAgIHRoaXMudXBkYXRlUGFyZW50Tm9kZVRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgcGFyZW50RnJhbWUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgICAgcGFyZW50RnJhbWUudGV4dCArPSB0aGF0LnRleHQ7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlUGFyZW50Tm9kZU1lZGlhQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzdGFjay5sZW5ndGggJiYgbWVkaWFUYWdzLmluY2x1ZGVzKHRoaXMudGFnKSkge1xuICAgICAgICBjb25zdCBwYXJlbnRGcmFtZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICBwYXJlbnRGcmFtZS5tZWRpYUNoaWxkcmVuLnB1c2godGhpcy50YWcpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgc2FuaXRpemVIdG1sLmRlZmF1bHRzLCBvcHRpb25zKTtcbiAgb3B0aW9ucy5wYXJzZXIgPSBPYmplY3QuYXNzaWduKHt9LCBodG1sUGFyc2VyRGVmYXVsdHMsIG9wdGlvbnMucGFyc2VyKTtcblxuICAvLyB2dWxuZXJhYmxlVGFnc1xuICB2dWxuZXJhYmxlVGFncy5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICBpZiAoXG4gICAgICBvcHRpb25zLmFsbG93ZWRUYWdzICYmIG9wdGlvbnMuYWxsb3dlZFRhZ3MuaW5kZXhPZih0YWcpID4gLTEgJiZcbiAgICAgICFvcHRpb25zLmFsbG93VnVsbmVyYWJsZVRhZ3NcbiAgICApIHtcbiAgICAgIGNvbnNvbGUud2FybihgXFxuXFxu4pqg77iPIFlvdXIgXFxgYWxsb3dlZFRhZ3NcXGAgb3B0aW9uIGluY2x1ZGVzLCBcXGAke3RhZ31cXGAsIHdoaWNoIGlzIGluaGVyZW50bHlcXG52dWxuZXJhYmxlIHRvIFhTUyBhdHRhY2tzLiBQbGVhc2UgcmVtb3ZlIGl0IGZyb20gXFxgYWxsb3dlZFRhZ3NcXGAuXFxuT3IsIHRvIGRpc2FibGUgdGhpcyB3YXJuaW5nLCBhZGQgdGhlIFxcYGFsbG93VnVsbmVyYWJsZVRhZ3NcXGAgb3B0aW9uXFxuYW5kIGVuc3VyZSB5b3UgYXJlIGFjY291bnRpbmcgZm9yIHRoaXMgcmlzay5cXG5cXG5gKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIFRhZ3MgdGhhdCBjb250YWluIHNvbWV0aGluZyBvdGhlciB0aGFuIEhUTUwsIG9yIHdoZXJlIGRpc2NhcmRpbmdcbiAgLy8gdGhlIHRleHQgd2hlbiB0aGUgdGFnIGlzIGRpc2FsbG93ZWQgbWFrZXMgc2Vuc2UgZm9yIG90aGVyIHJlYXNvbnMuXG4gIC8vIElmIHdlIGFyZSBub3QgYWxsb3dpbmcgdGhlc2UgdGFncywgd2Ugc2hvdWxkIGRyb3AgdGhlaXIgY29udGVudCB0b28uXG4gIC8vIEZvciBvdGhlciB0YWdzIHlvdSB3b3VsZCBkcm9wIHRoZSB0YWcgYnV0IGtlZXAgaXRzIGNvbnRlbnQuXG4gIGNvbnN0IG5vblRleHRUYWdzQXJyYXkgPSBvcHRpb25zLm5vblRleHRUYWdzIHx8IFtcbiAgICAnc2NyaXB0JyxcbiAgICAnc3R5bGUnLFxuICAgICd0ZXh0YXJlYScsXG4gICAgJ29wdGlvbidcbiAgXTtcbiAgbGV0IGFsbG93ZWRBdHRyaWJ1dGVzTWFwO1xuICBsZXQgYWxsb3dlZEF0dHJpYnV0ZXNHbG9iTWFwO1xuICBpZiAob3B0aW9ucy5hbGxvd2VkQXR0cmlidXRlcykge1xuICAgIGFsbG93ZWRBdHRyaWJ1dGVzTWFwID0ge307XG4gICAgYWxsb3dlZEF0dHJpYnV0ZXNHbG9iTWFwID0ge307XG4gICAgZWFjaChvcHRpb25zLmFsbG93ZWRBdHRyaWJ1dGVzLCBmdW5jdGlvbihhdHRyaWJ1dGVzLCB0YWcpIHtcbiAgICAgIGFsbG93ZWRBdHRyaWJ1dGVzTWFwW3RhZ10gPSBbXTtcbiAgICAgIGNvbnN0IGdsb2JSZWdleCA9IFtdO1xuICAgICAgYXR0cmlidXRlcy5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgICAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmluZGV4T2YoJyonKSA+PSAwKSB7XG4gICAgICAgICAgZ2xvYlJlZ2V4LnB1c2goZXNjYXBlU3RyaW5nUmVnZXhwKG9iaikucmVwbGFjZSgvXFxcXFxcKi9nLCAnLionKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYWxsb3dlZEF0dHJpYnV0ZXNNYXBbdGFnXS5wdXNoKG9iaik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKGdsb2JSZWdleC5sZW5ndGgpIHtcbiAgICAgICAgYWxsb3dlZEF0dHJpYnV0ZXNHbG9iTWFwW3RhZ10gPSBuZXcgUmVnRXhwKCdeKCcgKyBnbG9iUmVnZXguam9pbignfCcpICsgJykkJyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgY29uc3QgYWxsb3dlZENsYXNzZXNNYXAgPSB7fTtcbiAgY29uc3QgYWxsb3dlZENsYXNzZXNHbG9iTWFwID0ge307XG4gIGNvbnN0IGFsbG93ZWRDbGFzc2VzUmVnZXhNYXAgPSB7fTtcbiAgZWFjaChvcHRpb25zLmFsbG93ZWRDbGFzc2VzLCBmdW5jdGlvbihjbGFzc2VzLCB0YWcpIHtcbiAgICAvLyBJbXBsaWNpdGx5IGFsbG93cyB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICAgaWYgKGFsbG93ZWRBdHRyaWJ1dGVzTWFwKSB7XG4gICAgICBpZiAoIWhhcyhhbGxvd2VkQXR0cmlidXRlc01hcCwgdGFnKSkge1xuICAgICAgICBhbGxvd2VkQXR0cmlidXRlc01hcFt0YWddID0gW107XG4gICAgICB9XG4gICAgICBhbGxvd2VkQXR0cmlidXRlc01hcFt0YWddLnB1c2goJ2NsYXNzJyk7XG4gICAgfVxuXG4gICAgYWxsb3dlZENsYXNzZXNNYXBbdGFnXSA9IFtdO1xuICAgIGFsbG93ZWRDbGFzc2VzUmVnZXhNYXBbdGFnXSA9IFtdO1xuICAgIGNvbnN0IGdsb2JSZWdleCA9IFtdO1xuICAgIGNsYXNzZXMuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyAmJiBvYmouaW5kZXhPZignKicpID49IDApIHtcbiAgICAgICAgZ2xvYlJlZ2V4LnB1c2goZXNjYXBlU3RyaW5nUmVnZXhwKG9iaikucmVwbGFjZSgvXFxcXFxcKi9nLCAnLionKSk7XG4gICAgICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICBhbGxvd2VkQ2xhc3Nlc1JlZ2V4TWFwW3RhZ10ucHVzaChvYmopO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsb3dlZENsYXNzZXNNYXBbdGFnXS5wdXNoKG9iaik7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKGdsb2JSZWdleC5sZW5ndGgpIHtcbiAgICAgIGFsbG93ZWRDbGFzc2VzR2xvYk1hcFt0YWddID0gbmV3IFJlZ0V4cCgnXignICsgZ2xvYlJlZ2V4LmpvaW4oJ3wnKSArICcpJCcpO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgdHJhbnNmb3JtVGFnc01hcCA9IHt9O1xuICBsZXQgdHJhbnNmb3JtVGFnc0FsbDtcbiAgZWFjaChvcHRpb25zLnRyYW5zZm9ybVRhZ3MsIGZ1bmN0aW9uKHRyYW5zZm9ybSwgdGFnKSB7XG4gICAgbGV0IHRyYW5zRnVuO1xuICAgIGlmICh0eXBlb2YgdHJhbnNmb3JtID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0cmFuc0Z1biA9IHRyYW5zZm9ybTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0cmFuc2Zvcm0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cmFuc0Z1biA9IHNhbml0aXplSHRtbC5zaW1wbGVUcmFuc2Zvcm0odHJhbnNmb3JtKTtcbiAgICB9XG4gICAgaWYgKHRhZyA9PT0gJyonKSB7XG4gICAgICB0cmFuc2Zvcm1UYWdzQWxsID0gdHJhbnNGdW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zZm9ybVRhZ3NNYXBbdGFnXSA9IHRyYW5zRnVuO1xuICAgIH1cbiAgfSk7XG5cbiAgbGV0IGRlcHRoO1xuICBsZXQgc3RhY2s7XG4gIGxldCBza2lwTWFwO1xuICBsZXQgdHJhbnNmb3JtTWFwO1xuICBsZXQgc2tpcFRleHQ7XG4gIGxldCBza2lwVGV4dERlcHRoO1xuICBsZXQgYWRkZWRUZXh0ID0gZmFsc2U7XG5cbiAgaW5pdGlhbGl6ZVN0YXRlKCk7XG5cbiAgY29uc3QgcGFyc2VyID0gbmV3IGh0bWxwYXJzZXIuUGFyc2VyKHtcbiAgICBvbm9wZW50YWc6IGZ1bmN0aW9uKG5hbWUsIGF0dHJpYnMpIHtcbiAgICAgIC8vIElmIGBlbmZvcmNlSHRtbEJvdW5kYXJ5YCBpcyBgdHJ1ZWAgYW5kIHRoaXMgaGFzIGZvdW5kIHRoZSBvcGVuaW5nXG4gICAgICAvLyBgaHRtbGAgdGFnLCByZXNldCB0aGUgc3RhdGUuXG4gICAgICBpZiAob3B0aW9ucy5lbmZvcmNlSHRtbEJvdW5kYXJ5ICYmIG5hbWUgPT09ICdodG1sJykge1xuICAgICAgICBpbml0aWFsaXplU3RhdGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNraXBUZXh0KSB7XG4gICAgICAgIHNraXBUZXh0RGVwdGgrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZnJhbWUgPSBuZXcgRnJhbWUobmFtZSwgYXR0cmlicyk7XG4gICAgICBzdGFjay5wdXNoKGZyYW1lKTtcblxuICAgICAgbGV0IHNraXAgPSBmYWxzZTtcbiAgICAgIGNvbnN0IGhhc1RleHQgPSAhIWZyYW1lLnRleHQ7XG4gICAgICBsZXQgdHJhbnNmb3JtZWRUYWc7XG4gICAgICBpZiAoaGFzKHRyYW5zZm9ybVRhZ3NNYXAsIG5hbWUpKSB7XG4gICAgICAgIHRyYW5zZm9ybWVkVGFnID0gdHJhbnNmb3JtVGFnc01hcFtuYW1lXShuYW1lLCBhdHRyaWJzKTtcblxuICAgICAgICBmcmFtZS5hdHRyaWJzID0gYXR0cmlicyA9IHRyYW5zZm9ybWVkVGFnLmF0dHJpYnM7XG5cbiAgICAgICAgaWYgKHRyYW5zZm9ybWVkVGFnLnRleHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGZyYW1lLmlubmVyVGV4dCA9IHRyYW5zZm9ybWVkVGFnLnRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmFtZSAhPT0gdHJhbnNmb3JtZWRUYWcudGFnTmFtZSkge1xuICAgICAgICAgIGZyYW1lLm5hbWUgPSBuYW1lID0gdHJhbnNmb3JtZWRUYWcudGFnTmFtZTtcbiAgICAgICAgICB0cmFuc2Zvcm1NYXBbZGVwdGhdID0gdHJhbnNmb3JtZWRUYWcudGFnTmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRyYW5zZm9ybVRhZ3NBbGwpIHtcbiAgICAgICAgdHJhbnNmb3JtZWRUYWcgPSB0cmFuc2Zvcm1UYWdzQWxsKG5hbWUsIGF0dHJpYnMpO1xuXG4gICAgICAgIGZyYW1lLmF0dHJpYnMgPSBhdHRyaWJzID0gdHJhbnNmb3JtZWRUYWcuYXR0cmlicztcbiAgICAgICAgaWYgKG5hbWUgIT09IHRyYW5zZm9ybWVkVGFnLnRhZ05hbWUpIHtcbiAgICAgICAgICBmcmFtZS5uYW1lID0gbmFtZSA9IHRyYW5zZm9ybWVkVGFnLnRhZ05hbWU7XG4gICAgICAgICAgdHJhbnNmb3JtTWFwW2RlcHRoXSA9IHRyYW5zZm9ybWVkVGFnLnRhZ05hbWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKChvcHRpb25zLmFsbG93ZWRUYWdzICYmIG9wdGlvbnMuYWxsb3dlZFRhZ3MuaW5kZXhPZihuYW1lKSA9PT0gLTEpIHx8IChvcHRpb25zLmRpc2FsbG93ZWRUYWdzTW9kZSA9PT0gJ3JlY3Vyc2l2ZUVzY2FwZScgJiYgIWlzRW1wdHlPYmplY3Qoc2tpcE1hcCkpIHx8IChvcHRpb25zLm5lc3RpbmdMaW1pdCAhPSBudWxsICYmIGRlcHRoID49IG9wdGlvbnMubmVzdGluZ0xpbWl0KSkge1xuICAgICAgICBza2lwID0gdHJ1ZTtcbiAgICAgICAgc2tpcE1hcFtkZXB0aF0gPSB0cnVlO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXNhbGxvd2VkVGFnc01vZGUgPT09ICdkaXNjYXJkJykge1xuICAgICAgICAgIGlmIChub25UZXh0VGFnc0FycmF5LmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgICAgICBza2lwVGV4dCA9IHRydWU7XG4gICAgICAgICAgICBza2lwVGV4dERlcHRoID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2tpcE1hcFtkZXB0aF0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgZGVwdGgrKztcbiAgICAgIGlmIChza2lwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLmRpc2FsbG93ZWRUYWdzTW9kZSA9PT0gJ2Rpc2NhcmQnKSB7XG4gICAgICAgICAgLy8gV2Ugd2FudCB0aGUgY29udGVudHMgYnV0IG5vdCB0aGlzIHRhZ1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0ZW1wUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgICByZXN1bHQgPSAnJztcbiAgICAgIH1cbiAgICAgIHJlc3VsdCArPSAnPCcgKyBuYW1lO1xuXG4gICAgICBpZiAobmFtZSA9PT0gJ3NjcmlwdCcpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMuYWxsb3dlZFNjcmlwdEhvc3RuYW1lcyB8fCBvcHRpb25zLmFsbG93ZWRTY3JpcHREb21haW5zKSB7XG4gICAgICAgICAgZnJhbWUuaW5uZXJUZXh0ID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFhbGxvd2VkQXR0cmlidXRlc01hcCB8fCBoYXMoYWxsb3dlZEF0dHJpYnV0ZXNNYXAsIG5hbWUpIHx8IGFsbG93ZWRBdHRyaWJ1dGVzTWFwWycqJ10pIHtcbiAgICAgICAgZWFjaChhdHRyaWJzLCBmdW5jdGlvbih2YWx1ZSwgYSkge1xuICAgICAgICAgIGlmICghVkFMSURfSFRNTF9BVFRSSUJVVEVfTkFNRS50ZXN0KGEpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIHByZXZlbnRzIHBhcnQgb2YgYW4gYXR0cmlidXRlIG5hbWUgaW4gdGhlIG91dHB1dCBmcm9tIGJlaW5nXG4gICAgICAgICAgICAvLyBpbnRlcnByZXRlZCBhcyB0aGUgZW5kIG9mIGFuIGF0dHJpYnV0ZSwgb3IgZW5kIG9mIGEgdGFnLlxuICAgICAgICAgICAgZGVsZXRlIGZyYW1lLmF0dHJpYnNbYV07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGxldCBwYXJzZWQ7XG4gICAgICAgICAgLy8gY2hlY2sgYWxsb3dlZEF0dHJpYnV0ZXNNYXAgZm9yIHRoZSBlbGVtZW50IGFuZCBhdHRyaWJ1dGUgYW5kIG1vZGlmeSB0aGUgdmFsdWVcbiAgICAgICAgICAvLyBhcyBuZWNlc3NhcnkgaWYgdGhlcmUgYXJlIHNwZWNpZmljIHZhbHVlcyBkZWZpbmVkLlxuICAgICAgICAgIGxldCBwYXNzZWRBbGxvd2VkQXR0cmlidXRlc01hcENoZWNrID0gZmFsc2U7XG4gICAgICAgICAgaWYgKCFhbGxvd2VkQXR0cmlidXRlc01hcCB8fFxuICAgICAgICAgICAgKGhhcyhhbGxvd2VkQXR0cmlidXRlc01hcCwgbmFtZSkgJiYgYWxsb3dlZEF0dHJpYnV0ZXNNYXBbbmFtZV0uaW5kZXhPZihhKSAhPT0gLTEpIHx8XG4gICAgICAgICAgICAoYWxsb3dlZEF0dHJpYnV0ZXNNYXBbJyonXSAmJiBhbGxvd2VkQXR0cmlidXRlc01hcFsnKiddLmluZGV4T2YoYSkgIT09IC0xKSB8fFxuICAgICAgICAgICAgKGhhcyhhbGxvd2VkQXR0cmlidXRlc0dsb2JNYXAsIG5hbWUpICYmIGFsbG93ZWRBdHRyaWJ1dGVzR2xvYk1hcFtuYW1lXS50ZXN0KGEpKSB8fFxuICAgICAgICAgICAgKGFsbG93ZWRBdHRyaWJ1dGVzR2xvYk1hcFsnKiddICYmIGFsbG93ZWRBdHRyaWJ1dGVzR2xvYk1hcFsnKiddLnRlc3QoYSkpKSB7XG4gICAgICAgICAgICBwYXNzZWRBbGxvd2VkQXR0cmlidXRlc01hcENoZWNrID0gdHJ1ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsbG93ZWRBdHRyaWJ1dGVzTWFwICYmIGFsbG93ZWRBdHRyaWJ1dGVzTWFwW25hbWVdKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IG8gb2YgYWxsb3dlZEF0dHJpYnV0ZXNNYXBbbmFtZV0pIHtcbiAgICAgICAgICAgICAgaWYgKGlzUGxhaW5PYmplY3QobykgJiYgby5uYW1lICYmIChvLm5hbWUgPT09IGEpKSB7XG4gICAgICAgICAgICAgICAgcGFzc2VkQWxsb3dlZEF0dHJpYnV0ZXNNYXBDaGVjayA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IG5ld1ZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgaWYgKG8ubXVsdGlwbGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgIC8vIHZlcmlmeSB0aGUgdmFsdWVzIHRoYXQgYXJlIGFsbG93ZWRcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHNwbGl0U3RyQXJyYXkgPSB2YWx1ZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBzIG9mIHNwbGl0U3RyQXJyYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG8udmFsdWVzLmluZGV4T2YocykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSBzO1xuICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSArPSAnICcgKyBzO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoby52YWx1ZXMuaW5kZXhPZih2YWx1ZSkgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgLy8gdmVyaWZpZWQgYW4gYWxsb3dlZCB2YWx1ZSBtYXRjaGVzIHRoZSBlbnRpcmUgYXR0cmlidXRlIHZhbHVlXG4gICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwYXNzZWRBbGxvd2VkQXR0cmlidXRlc01hcENoZWNrKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5hbGxvd2VkU2NoZW1lc0FwcGxpZWRUb0F0dHJpYnV0ZXMuaW5kZXhPZihhKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgaWYgKG5hdWdodHlIcmVmKG5hbWUsIHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBmcmFtZS5hdHRyaWJzW2FdO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gJ3NjcmlwdCcgJiYgYSA9PT0gJ3NyYycpIHtcblxuICAgICAgICAgICAgICBsZXQgYWxsb3dlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBuZXcgVVJMKHZhbHVlKTtcblxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmFsbG93ZWRTY3JpcHRIb3N0bmFtZXMgfHwgb3B0aW9ucy5hbGxvd2VkU2NyaXB0RG9tYWlucykge1xuICAgICAgICAgICAgICAgICAgY29uc3QgYWxsb3dlZEhvc3RuYW1lID0gKG9wdGlvbnMuYWxsb3dlZFNjcmlwdEhvc3RuYW1lcyB8fCBbXSkuZmluZChmdW5jdGlvbiAoaG9zdG5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGhvc3RuYW1lID09PSBwYXJzZWQuaG9zdG5hbWU7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbG93ZWREb21haW4gPSAob3B0aW9ucy5hbGxvd2VkU2NyaXB0RG9tYWlucyB8fCBbXSkuZmluZChmdW5jdGlvbihkb21haW4pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlZC5ob3N0bmFtZSA9PT0gZG9tYWluIHx8IHBhcnNlZC5ob3N0bmFtZS5lbmRzV2l0aChgLiR7ZG9tYWlufWApO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBhbGxvd2VkID0gYWxsb3dlZEhvc3RuYW1lIHx8IGFsbG93ZWREb21haW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxsb3dlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCFhbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGZyYW1lLmF0dHJpYnNbYV07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuYW1lID09PSAnaWZyYW1lJyAmJiBhID09PSAnc3JjJykge1xuICAgICAgICAgICAgICBsZXQgYWxsb3dlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hyb21lIGFjY2VwdHMgXFwgYXMgYSBzdWJzdGl0dXRlIGZvciAvIGluIHRoZSAvLyBhdCB0aGVcbiAgICAgICAgICAgICAgICAvLyBzdGFydCBvZiBhIFVSTCwgc28gcmV3cml0ZSBhY2NvcmRpbmdseSB0byBwcmV2ZW50IGV4cGxvaXQuXG4gICAgICAgICAgICAgICAgLy8gQWxzbyBkcm9wIGFueSB3aGl0ZXNwYWNlIGF0IHRoYXQgcG9pbnQgaW4gdGhlIFVSTFxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXihcXHcrOik/XFxzKltcXFxcL11cXHMqW1xcXFwvXS8sICckMS8vJyk7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLnN0YXJ0c1dpdGgoJ3JlbGF0aXZlOicpKSB7XG4gICAgICAgICAgICAgICAgICAvLyBBbiBhdHRlbXB0IHRvIGV4cGxvaXQgb3VyIHdvcmthcm91bmQgZm9yIGJhc2UgVVJMcyBiZWluZ1xuICAgICAgICAgICAgICAgICAgLy8gbWFuZGF0b3J5IGZvciByZWxhdGl2ZSBVUkwgdmFsaWRhdGlvbiBpbiB0aGUgV0hBVFdHXG4gICAgICAgICAgICAgICAgICAvLyBVUkwgcGFyc2VyLCByZWplY3QgaXRcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigncmVsYXRpdmU6IGV4cGxvaXQgYXR0ZW1wdCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBuYXVnaHR5SHJlZiBpcyBpbiBjaGFyZ2Ugb2Ygd2hldGhlciBwcm90b2NvbCByZWxhdGl2ZSBVUkxzXG4gICAgICAgICAgICAgICAgLy8gYXJlIGNvb2wuIEhlcmUgd2UgYXJlIGNvbmNlcm5lZCBqdXN0IHdpdGggYWxsb3dlZCBob3N0bmFtZXMgYW5kXG4gICAgICAgICAgICAgICAgLy8gd2hldGhlciB0byBhbGxvdyByZWxhdGl2ZSBVUkxzLlxuICAgICAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAgICAgLy8gQnVpbGQgYSBwbGFjZWhvbGRlciBcImJhc2UgVVJMXCIgYWdhaW5zdCB3aGljaCBhbnkgcmVhc29uYWJsZVxuICAgICAgICAgICAgICAgIC8vIHJlbGF0aXZlIFVSTCBtYXkgYmUgcGFyc2VkIHN1Y2Nlc3NmdWxseVxuICAgICAgICAgICAgICAgIGxldCBiYXNlID0gJ3JlbGF0aXZlOi8vcmVsYXRpdmUtc2l0ZSc7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IChpIDwgMTAwKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBiYXNlICs9IGAvJHtpfWA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IG5ldyBVUkwodmFsdWUsIGJhc2UpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzUmVsYXRpdmVVcmwgPSBwYXJzZWQgJiYgcGFyc2VkLmhvc3RuYW1lID09PSAncmVsYXRpdmUtc2l0ZScgJiYgcGFyc2VkLnByb3RvY29sID09PSAncmVsYXRpdmU6JztcbiAgICAgICAgICAgICAgICBpZiAoaXNSZWxhdGl2ZVVybCkge1xuICAgICAgICAgICAgICAgICAgLy8gZGVmYXVsdCB2YWx1ZSBvZiBhbGxvd0lmcmFtZVJlbGF0aXZlVXJscyBpcyB0cnVlXG4gICAgICAgICAgICAgICAgICAvLyB1bmxlc3MgYWxsb3dlZElmcmFtZUhvc3RuYW1lcyBvciBhbGxvd2VkSWZyYW1lRG9tYWlucyBzcGVjaWZpZWRcbiAgICAgICAgICAgICAgICAgIGFsbG93ZWQgPSBoYXMob3B0aW9ucywgJ2FsbG93SWZyYW1lUmVsYXRpdmVVcmxzJylcbiAgICAgICAgICAgICAgICAgICAgPyBvcHRpb25zLmFsbG93SWZyYW1lUmVsYXRpdmVVcmxzXG4gICAgICAgICAgICAgICAgICAgIDogKCFvcHRpb25zLmFsbG93ZWRJZnJhbWVIb3N0bmFtZXMgJiYgIW9wdGlvbnMuYWxsb3dlZElmcmFtZURvbWFpbnMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbGxvd2VkSWZyYW1lSG9zdG5hbWVzIHx8IG9wdGlvbnMuYWxsb3dlZElmcmFtZURvbWFpbnMpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbG93ZWRIb3N0bmFtZSA9IChvcHRpb25zLmFsbG93ZWRJZnJhbWVIb3N0bmFtZXMgfHwgW10pLmZpbmQoZnVuY3Rpb24gKGhvc3RuYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBob3N0bmFtZSA9PT0gcGFyc2VkLmhvc3RuYW1lO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBhbGxvd2VkRG9tYWluID0gKG9wdGlvbnMuYWxsb3dlZElmcmFtZURvbWFpbnMgfHwgW10pLmZpbmQoZnVuY3Rpb24oZG9tYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZWQuaG9zdG5hbWUgPT09IGRvbWFpbiB8fCBwYXJzZWQuaG9zdG5hbWUuZW5kc1dpdGgoYC4ke2RvbWFpbn1gKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgYWxsb3dlZCA9IGFsbG93ZWRIb3N0bmFtZSB8fCBhbGxvd2VkRG9tYWluO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIFVucGFyc2VhYmxlIGlmcmFtZSBzcmNcbiAgICAgICAgICAgICAgICBhbGxvd2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFhbGxvd2VkKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGZyYW1lLmF0dHJpYnNbYV07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYSA9PT0gJ3NyY3NldCcpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBwYXJzZWQgPSBwYXJzZVNyY3NldCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgcGFyc2VkLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChuYXVnaHR5SHJlZignc3Jjc2V0JywgdmFsdWUudXJsKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZS5ldmlsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBwYXJzZWQgPSBmaWx0ZXIocGFyc2VkLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gIXYuZXZpbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcnNlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmcmFtZS5hdHRyaWJzW2FdO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICB2YWx1ZSA9IHN0cmluZ2lmeVNyY3NldChmaWx0ZXIocGFyc2VkLCBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhdi5ldmlsO1xuICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgZnJhbWUuYXR0cmlic1thXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIFVucGFyc2VhYmxlIHNyY3NldFxuICAgICAgICAgICAgICAgIGRlbGV0ZSBmcmFtZS5hdHRyaWJzW2FdO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEgPT09ICdjbGFzcycpIHtcbiAgICAgICAgICAgICAgY29uc3QgYWxsb3dlZFNwZWNpZmljQ2xhc3NlcyA9IGFsbG93ZWRDbGFzc2VzTWFwW25hbWVdO1xuICAgICAgICAgICAgICBjb25zdCBhbGxvd2VkV2lsZGNhcmRDbGFzc2VzID0gYWxsb3dlZENsYXNzZXNNYXBbJyonXTtcbiAgICAgICAgICAgICAgY29uc3QgYWxsb3dlZFNwZWNpZmljQ2xhc3Nlc0dsb2IgPSBhbGxvd2VkQ2xhc3Nlc0dsb2JNYXBbbmFtZV07XG4gICAgICAgICAgICAgIGNvbnN0IGFsbG93ZWRTcGVjaWZpY0NsYXNzZXNSZWdleCA9IGFsbG93ZWRDbGFzc2VzUmVnZXhNYXBbbmFtZV07XG4gICAgICAgICAgICAgIGNvbnN0IGFsbG93ZWRXaWxkY2FyZENsYXNzZXNHbG9iID0gYWxsb3dlZENsYXNzZXNHbG9iTWFwWycqJ107XG4gICAgICAgICAgICAgIGNvbnN0IGFsbG93ZWRDbGFzc2VzR2xvYnMgPSBbXG4gICAgICAgICAgICAgICAgYWxsb3dlZFNwZWNpZmljQ2xhc3Nlc0dsb2IsXG4gICAgICAgICAgICAgICAgYWxsb3dlZFdpbGRjYXJkQ2xhc3Nlc0dsb2JcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIC5jb25jYXQoYWxsb3dlZFNwZWNpZmljQ2xhc3Nlc1JlZ2V4KVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBpZiAoYWxsb3dlZFNwZWNpZmljQ2xhc3NlcyAmJiBhbGxvd2VkV2lsZGNhcmRDbGFzc2VzKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBmaWx0ZXJDbGFzc2VzKHZhbHVlLCBkZWVwbWVyZ2UoYWxsb3dlZFNwZWNpZmljQ2xhc3NlcywgYWxsb3dlZFdpbGRjYXJkQ2xhc3NlcyksIGFsbG93ZWRDbGFzc2VzR2xvYnMpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gZmlsdGVyQ2xhc3Nlcyh2YWx1ZSwgYWxsb3dlZFNwZWNpZmljQ2xhc3NlcyB8fCBhbGxvd2VkV2lsZGNhcmRDbGFzc2VzLCBhbGxvd2VkQ2xhc3Nlc0dsb2JzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBmcmFtZS5hdHRyaWJzW2FdO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGEgPT09ICdzdHlsZScpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBhYnN0cmFjdFN5bnRheFRyZWUgPSBwb3N0Y3NzUGFyc2UobmFtZSArICcgeycgKyB2YWx1ZSArICd9Jyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsdGVyZWRBU1QgPSBmaWx0ZXJDc3MoYWJzdHJhY3RTeW50YXhUcmVlLCBvcHRpb25zLmFsbG93ZWRTdHlsZXMpO1xuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzdHJpbmdpZnlTdHlsZUF0dHJpYnV0ZXMoZmlsdGVyZWRBU1QpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgZGVsZXRlIGZyYW1lLmF0dHJpYnNbYV07XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIGZyYW1lLmF0dHJpYnNbYV07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgKz0gJyAnICsgYTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ICs9ICc9XCInICsgZXNjYXBlSHRtbCh2YWx1ZSwgdHJ1ZSkgKyAnXCInO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgZnJhbWUuYXR0cmlic1thXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc2VsZkNsb3NpbmcuaW5kZXhPZihuYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgcmVzdWx0ICs9ICcgLz4nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0ICs9ICc+JztcbiAgICAgICAgaWYgKGZyYW1lLmlubmVyVGV4dCAmJiAhaGFzVGV4dCAmJiAhb3B0aW9ucy50ZXh0RmlsdGVyKSB7XG4gICAgICAgICAgcmVzdWx0ICs9IGVzY2FwZUh0bWwoZnJhbWUuaW5uZXJUZXh0KTtcbiAgICAgICAgICBhZGRlZFRleHQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc2tpcCkge1xuICAgICAgICByZXN1bHQgPSB0ZW1wUmVzdWx0ICsgZXNjYXBlSHRtbChyZXN1bHQpO1xuICAgICAgICB0ZW1wUmVzdWx0ID0gJyc7XG4gICAgICB9XG4gICAgfSxcbiAgICBvbnRleHQ6IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgIGlmIChza2lwVGV4dCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBsYXN0RnJhbWUgPSBzdGFja1tzdGFjay5sZW5ndGggLSAxXTtcbiAgICAgIGxldCB0YWc7XG5cbiAgICAgIGlmIChsYXN0RnJhbWUpIHtcbiAgICAgICAgdGFnID0gbGFzdEZyYW1lLnRhZztcbiAgICAgICAgLy8gSWYgaW5uZXIgdGV4dCB3YXMgc2V0IGJ5IHRyYW5zZm9ybSBmdW5jdGlvbiB0aGVuIGxldCdzIHVzZSBpdFxuICAgICAgICB0ZXh0ID0gbGFzdEZyYW1lLmlubmVyVGV4dCAhPT0gdW5kZWZpbmVkID8gbGFzdEZyYW1lLmlubmVyVGV4dCA6IHRleHQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmRpc2FsbG93ZWRUYWdzTW9kZSA9PT0gJ2Rpc2NhcmQnICYmICgodGFnID09PSAnc2NyaXB0JykgfHwgKHRhZyA9PT0gJ3N0eWxlJykpKSB7XG4gICAgICAgIC8vIGh0bWxwYXJzZXIyIGdpdmVzIHVzIHRoZXNlIGFzLWlzLiBFc2NhcGluZyB0aGVtIHJ1aW5zIHRoZSBjb250ZW50LiBBbGxvd2luZ1xuICAgICAgICAvLyBzY3JpcHQgdGFncyBpcywgYnkgZGVmaW5pdGlvbiwgZ2FtZSBvdmVyIGZvciBYU1MgcHJvdGVjdGlvbiwgc28gaWYgdGhhdCdzXG4gICAgICAgIC8vIHlvdXIgY29uY2VybiwgZG9uJ3QgYWxsb3cgdGhlbS4gVGhlIHNhbWUgaXMgZXNzZW50aWFsbHkgdHJ1ZSBmb3Igc3R5bGUgdGFnc1xuICAgICAgICAvLyB3aGljaCBoYXZlIHRoZWlyIG93biBjb2xsZWN0aW9uIG9mIFhTUyB2ZWN0b3JzLlxuICAgICAgICByZXN1bHQgKz0gdGV4dDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVzY2FwZWQgPSBlc2NhcGVIdG1sKHRleHQsIGZhbHNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMudGV4dEZpbHRlciAmJiAhYWRkZWRUZXh0KSB7XG4gICAgICAgICAgcmVzdWx0ICs9IG9wdGlvbnMudGV4dEZpbHRlcihlc2NhcGVkLCB0YWcpO1xuICAgICAgICB9IGVsc2UgaWYgKCFhZGRlZFRleHQpIHtcbiAgICAgICAgICByZXN1bHQgKz0gZXNjYXBlZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN0YWNrLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBmcmFtZSA9IHN0YWNrW3N0YWNrLmxlbmd0aCAtIDFdO1xuICAgICAgICBmcmFtZS50ZXh0ICs9IHRleHQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBvbmNsb3NldGFnOiBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgIGlmIChza2lwVGV4dCkge1xuICAgICAgICBza2lwVGV4dERlcHRoLS07XG4gICAgICAgIGlmICghc2tpcFRleHREZXB0aCkge1xuICAgICAgICAgIHNraXBUZXh0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZyYW1lID0gc3RhY2sucG9wKCk7XG4gICAgICBpZiAoIWZyYW1lKSB7XG4gICAgICAgIC8vIERvIG5vdCBjcmFzaCBvbiBiYWQgbWFya3VwXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHNraXBUZXh0ID0gb3B0aW9ucy5lbmZvcmNlSHRtbEJvdW5kYXJ5ID8gbmFtZSA9PT0gJ2h0bWwnIDogZmFsc2U7XG4gICAgICBkZXB0aC0tO1xuICAgICAgY29uc3Qgc2tpcCA9IHNraXBNYXBbZGVwdGhdO1xuICAgICAgaWYgKHNraXApIHtcbiAgICAgICAgZGVsZXRlIHNraXBNYXBbZGVwdGhdO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXNhbGxvd2VkVGFnc01vZGUgPT09ICdkaXNjYXJkJykge1xuICAgICAgICAgIGZyYW1lLnVwZGF0ZVBhcmVudE5vZGVUZXh0KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRlbXBSZXN1bHQgPSByZXN1bHQ7XG4gICAgICAgIHJlc3VsdCA9ICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAodHJhbnNmb3JtTWFwW2RlcHRoXSkge1xuICAgICAgICBuYW1lID0gdHJhbnNmb3JtTWFwW2RlcHRoXTtcbiAgICAgICAgZGVsZXRlIHRyYW5zZm9ybU1hcFtkZXB0aF07XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmV4Y2x1c2l2ZUZpbHRlciAmJiBvcHRpb25zLmV4Y2x1c2l2ZUZpbHRlcihmcmFtZSkpIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnN1YnN0cigwLCBmcmFtZS50YWdQb3NpdGlvbik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZnJhbWUudXBkYXRlUGFyZW50Tm9kZU1lZGlhQ2hpbGRyZW4oKTtcbiAgICAgIGZyYW1lLnVwZGF0ZVBhcmVudE5vZGVUZXh0KCk7XG5cbiAgICAgIGlmIChvcHRpb25zLnNlbGZDbG9zaW5nLmluZGV4T2YobmFtZSkgIT09IC0xKSB7XG4gICAgICAgIC8vIEFscmVhZHkgb3V0cHV0IC8+XG4gICAgICAgIGlmIChza2lwKSB7XG4gICAgICAgICAgcmVzdWx0ID0gdGVtcFJlc3VsdDtcbiAgICAgICAgICB0ZW1wUmVzdWx0ID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICByZXN1bHQgKz0gJzwvJyArIG5hbWUgKyAnPic7XG4gICAgICBpZiAoc2tpcCkge1xuICAgICAgICByZXN1bHQgPSB0ZW1wUmVzdWx0ICsgZXNjYXBlSHRtbChyZXN1bHQpO1xuICAgICAgICB0ZW1wUmVzdWx0ID0gJyc7XG4gICAgICB9XG4gICAgICBhZGRlZFRleHQgPSBmYWxzZTtcbiAgICB9XG4gIH0sIG9wdGlvbnMucGFyc2VyKTtcbiAgcGFyc2VyLndyaXRlKGh0bWwpO1xuICBwYXJzZXIuZW5kKCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcblxuICBmdW5jdGlvbiBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgcmVzdWx0ID0gJyc7XG4gICAgZGVwdGggPSAwO1xuICAgIHN0YWNrID0gW107XG4gICAgc2tpcE1hcCA9IHt9O1xuICAgIHRyYW5zZm9ybU1hcCA9IHt9O1xuICAgIHNraXBUZXh0ID0gZmFsc2U7XG4gICAgc2tpcFRleHREZXB0aCA9IDA7XG4gIH1cblxuICBmdW5jdGlvbiBlc2NhcGVIdG1sKHMsIHF1b3RlKSB7XG4gICAgaWYgKHR5cGVvZiAocykgIT09ICdzdHJpbmcnKSB7XG4gICAgICBzID0gcyArICcnO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5wYXJzZXIuZGVjb2RlRW50aXRpZXMpIHtcbiAgICAgIHMgPSBzLnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgICAgIGlmIChxdW90ZSkge1xuICAgICAgICBzID0gcy5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFRPRE86IHRoaXMgaXMgaW5hZGVxdWF0ZSBiZWNhdXNlIGl0IHdpbGwgcGFzcyBgJjA7YC4gVGhpcyBhcHByb2FjaFxuICAgIC8vIHdpbGwgbm90IHdvcmssIGVhY2ggJiBtdXN0IGJlIGNvbnNpZGVyZWQgd2l0aCByZWdhcmQgdG8gd2hldGhlciBpdFxuICAgIC8vIGlzIGZvbGxvd2VkIGJ5IGEgMTAwJSBzeW50YWN0aWNhbGx5IHZhbGlkIGVudGl0eSBvciBub3QsIGFuZCBlc2NhcGVkXG4gICAgLy8gaWYgaXQgaXMgbm90LiBJZiB0aGlzIGJvdGhlcnMgeW91LCBkb24ndCBzZXQgcGFyc2VyLmRlY29kZUVudGl0aWVzXG4gICAgLy8gdG8gZmFsc2UuIChUaGUgZGVmYXVsdCBpcyB0cnVlLilcbiAgICBzID0gcy5yZXBsYWNlKC8mKD8hW2EtekEtWjAtOSNdezEsMjB9OykvZywgJyZhbXA7JykgLy8gTWF0Y2ggYW1wZXJzYW5kcyBub3QgcGFydCBvZiBleGlzdGluZyBIVE1MIGVudGl0eVxuICAgICAgLnJlcGxhY2UoLzwvZywgJyZsdDsnKVxuICAgICAgLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgICBpZiAocXVvdGUpIHtcbiAgICAgIHMgPSBzLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKTtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICBmdW5jdGlvbiBuYXVnaHR5SHJlZihuYW1lLCBocmVmKSB7XG4gICAgLy8gQnJvd3NlcnMgaWdub3JlIGNoYXJhY3RlciBjb2RlcyBvZiAzMiAoc3BhY2UpIGFuZCBiZWxvdyBpbiBhIHN1cnByaXNpbmdcbiAgICAvLyBudW1iZXIgb2Ygc2l0dWF0aW9ucy4gU3RhcnQgcmVhZGluZyBoZXJlOlxuICAgIC8vIGh0dHBzOi8vd3d3Lm93YXNwLm9yZy9pbmRleC5waHAvWFNTX0ZpbHRlcl9FdmFzaW9uX0NoZWF0X1NoZWV0I0VtYmVkZGVkX3RhYlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb250cm9sLXJlZ2V4XG4gICAgaHJlZiA9IGhyZWYucmVwbGFjZSgvW1xceDAwLVxceDIwXSsvZywgJycpO1xuICAgIC8vIENsb2JiZXIgYW55IGNvbW1lbnRzIGluIFVSTHMsIHdoaWNoIHRoZSBicm93c2VyIG1pZ2h0XG4gICAgLy8gaW50ZXJwcmV0IGluc2lkZSBhbiBYTUwgZGF0YSBpc2xhbmQsIGFsbG93aW5nXG4gICAgLy8gYSBqYXZhc2NyaXB0OiBVUkwgdG8gYmUgc251Y2sgdGhyb3VnaFxuICAgIGhyZWYgPSBocmVmLnJlcGxhY2UoLzwhLS0uKj8tLT4vZywgJycpO1xuICAgIC8vIENhc2UgaW5zZW5zaXRpdmUgc28gd2UgZG9uJ3QgZ2V0IGZha2VkIG91dCBieSBKQVZBU0NSSVBUICMxXG4gICAgLy8gQWxsb3cgbW9yZSBjaGFyYWN0ZXJzIGFmdGVyIHRoZSBmaXJzdCBzbyB3ZSBkb24ndCBnZXQgZmFrZWRcbiAgICAvLyBvdXQgYnkgY2VydGFpbiBzY2hlbWVzIGJyb3dzZXJzIGFjY2VwdFxuICAgIGNvbnN0IG1hdGNoZXMgPSBocmVmLm1hdGNoKC9eKFthLXpBLVpdW2EtekEtWjAtOS5cXC0rXSopOi8pO1xuICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgLy8gUHJvdG9jb2wtcmVsYXRpdmUgVVJMIHN0YXJ0aW5nIHdpdGggYW55IGNvbWJpbmF0aW9uIG9mICcvJyBhbmQgJ1xcJ1xuICAgICAgaWYgKGhyZWYubWF0Y2goL15bL1xcXFxdezJ9LykpIHtcbiAgICAgICAgcmV0dXJuICFvcHRpb25zLmFsbG93UHJvdG9jb2xSZWxhdGl2ZTtcbiAgICAgIH1cblxuICAgICAgLy8gTm8gc2NoZW1lXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHNjaGVtZSA9IG1hdGNoZXNbMV0udG9Mb3dlckNhc2UoKTtcblxuICAgIGlmIChoYXMob3B0aW9ucy5hbGxvd2VkU2NoZW1lc0J5VGFnLCBuYW1lKSkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuYWxsb3dlZFNjaGVtZXNCeVRhZ1tuYW1lXS5pbmRleE9mKHNjaGVtZSkgPT09IC0xO1xuICAgIH1cblxuICAgIHJldHVybiAhb3B0aW9ucy5hbGxvd2VkU2NoZW1lcyB8fCBvcHRpb25zLmFsbG93ZWRTY2hlbWVzLmluZGV4T2Yoc2NoZW1lKSA9PT0gLTE7XG4gIH1cblxuICAvKipcbiAgICogRmlsdGVycyB1c2VyIGlucHV0IGNzcyBwcm9wZXJ0aWVzIGJ5IGFsbG93bGlzdGVkIHJlZ2V4IGF0dHJpYnV0ZXMuXG4gICAqIE1vZGlmaWVzIHRoZSBhYnN0cmFjdFN5bnRheFRyZWUgb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gYWJzdHJhY3RTeW50YXhUcmVlICAtIE9iamVjdCByZXByZXNlbnRhdGlvbiBvZiBDU1MgYXR0cmlidXRlcy5cbiAgICogQHByb3BlcnR5IHthcnJheVtEZWNsYXJhdGlvbl19IGFic3RyYWN0U3ludGF4VHJlZS5ub2Rlc1swXSAtIEVhY2ggb2JqZWN0IGNvaW50YWlucyBwcm9wIGFuZCB2YWx1ZSBrZXksIGkuZSB7IHByb3A6ICdjb2xvcicsIHZhbHVlOiAncmVkJyB9LlxuICAgKiBAcGFyYW0ge29iamVjdH0gYWxsb3dlZFN0eWxlcyAgICAgICAtIEtleXMgYXJlIHByb3BlcnRpZXMgKGkuZSBjb2xvciksIHZhbHVlIGlzIGxpc3Qgb2YgcGVybWl0dGVkIHJlZ2V4IHJ1bGVzIChpLmUgL2dyZWVuL2kpLlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgICAtIFRoZSBtb2RpZmllZCB0cmVlLlxuICAgKi9cbiAgZnVuY3Rpb24gZmlsdGVyQ3NzKGFic3RyYWN0U3ludGF4VHJlZSwgYWxsb3dlZFN0eWxlcykge1xuICAgIGlmICghYWxsb3dlZFN0eWxlcykge1xuICAgICAgcmV0dXJuIGFic3RyYWN0U3ludGF4VHJlZTtcbiAgICB9XG5cbiAgICBjb25zdCBhc3RSdWxlcyA9IGFic3RyYWN0U3ludGF4VHJlZS5ub2Rlc1swXTtcbiAgICBsZXQgc2VsZWN0ZWRSdWxlO1xuXG4gICAgLy8gTWVyZ2UgZ2xvYmFsIGFuZCB0YWctc3BlY2lmaWMgc3R5bGVzIGludG8gbmV3IEFTVC5cbiAgICBpZiAoYWxsb3dlZFN0eWxlc1thc3RSdWxlcy5zZWxlY3Rvcl0gJiYgYWxsb3dlZFN0eWxlc1snKiddKSB7XG4gICAgICBzZWxlY3RlZFJ1bGUgPSBkZWVwbWVyZ2UoXG4gICAgICAgIGFsbG93ZWRTdHlsZXNbYXN0UnVsZXMuc2VsZWN0b3JdLFxuICAgICAgICBhbGxvd2VkU3R5bGVzWycqJ11cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkUnVsZSA9IGFsbG93ZWRTdHlsZXNbYXN0UnVsZXMuc2VsZWN0b3JdIHx8IGFsbG93ZWRTdHlsZXNbJyonXTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZWN0ZWRSdWxlKSB7XG4gICAgICBhYnN0cmFjdFN5bnRheFRyZWUubm9kZXNbMF0ubm9kZXMgPSBhc3RSdWxlcy5ub2Rlcy5yZWR1Y2UoZmlsdGVyRGVjbGFyYXRpb25zKHNlbGVjdGVkUnVsZSksIFtdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWJzdHJhY3RTeW50YXhUcmVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3RzIHRoZSBzdHlsZSBhdHRyaWJ1dGVzIGZyb20gYW4gQWJzdHJhY3RTeW50YXhUcmVlIGFuZCBmb3JtYXRzIHRob3NlXG4gICAqIHZhbHVlcyBpbiB0aGUgaW5saW5lIHN0eWxlIGF0dHJpYnV0ZSBmb3JtYXQuXG4gICAqXG4gICAqIEBwYXJhbSAge0Fic3RyYWN0U3ludGF4VHJlZX0gZmlsdGVyZWRBU1RcbiAgICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgICAtIEV4YW1wbGU6IFwiY29sb3I6eWVsbG93O3RleHQtYWxpZ246Y2VudGVyICFpbXBvcnRhbnQ7Zm9udC1mYW1pbHk6aGVsdmV0aWNhO1wiXG4gICAqL1xuICBmdW5jdGlvbiBzdHJpbmdpZnlTdHlsZUF0dHJpYnV0ZXMoZmlsdGVyZWRBU1QpIHtcbiAgICByZXR1cm4gZmlsdGVyZWRBU1Qubm9kZXNbMF0ubm9kZXNcbiAgICAgIC5yZWR1Y2UoZnVuY3Rpb24oZXh0cmFjdGVkQXR0cmlidXRlcywgYXR0ck9iamVjdCkge1xuICAgICAgICBleHRyYWN0ZWRBdHRyaWJ1dGVzLnB1c2goXG4gICAgICAgICAgYCR7YXR0ck9iamVjdC5wcm9wfToke2F0dHJPYmplY3QudmFsdWV9JHthdHRyT2JqZWN0LmltcG9ydGFudCA/ICcgIWltcG9ydGFudCcgOiAnJ31gXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBleHRyYWN0ZWRBdHRyaWJ1dGVzO1xuICAgICAgfSwgW10pXG4gICAgICAuam9pbignOycpO1xuICB9XG5cbiAgLyoqXG4gICAgKiBGaWx0ZXJzIHRoZSBleGlzdGluZyBhdHRyaWJ1dGVzIGZvciB0aGUgZ2l2ZW4gcHJvcGVydHkuIERpc2NhcmRzIGFueSBhdHRyaWJ1dGVzXG4gICAgKiB3aGljaCBkb24ndCBtYXRjaCB0aGUgYWxsb3dsaXN0LlxuICAgICpcbiAgICAqIEBwYXJhbSAge29iamVjdH0gc2VsZWN0ZWRSdWxlICAgICAgICAgICAgIC0gRXhhbXBsZTogeyBjb2xvcjogcmVkLCBmb250LWZhbWlseTogaGVsdmV0aWNhIH1cbiAgICAqIEBwYXJhbSAge2FycmF5fSBhbGxvd2VkRGVjbGFyYXRpb25zTGlzdCAgIC0gTGlzdCBvZiBkZWNsYXJhdGlvbnMgd2hpY2ggcGFzcyB0aGUgYWxsb3dsaXN0LlxuICAgICogQHBhcmFtICB7b2JqZWN0fSBhdHRyaWJ1dGVPYmplY3QgICAgICAgICAgLSBPYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IGNzcyBwcm9wZXJ0eS5cbiAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhdHRyaWJ1dGVPYmplY3QudHlwZSAgIC0gVHlwaWNhbGx5ICdkZWNsYXJhdGlvbicuXG4gICAgKiBAcHJvcGVydHkge3N0cmluZ30gYXR0cmlidXRlT2JqZWN0LnByb3AgICAtIFRoZSBDU1MgcHJvcGVydHksIGkuZSAnY29sb3InLlxuICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGF0dHJpYnV0ZU9iamVjdC52YWx1ZSAgLSBUaGUgY29ycmVzcG9uZGluZyB2YWx1ZSB0byB0aGUgY3NzIHByb3BlcnR5LCBpLmUgJ3JlZCcuXG4gICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gICAgICAgICAgICAgICAgICAgICAgICAtIFdoZW4gdXNlZCBpbiBBcnJheS5yZWR1Y2UsIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIERlY2xhcmF0aW9uIG9iamVjdHNcbiAgICAqL1xuICBmdW5jdGlvbiBmaWx0ZXJEZWNsYXJhdGlvbnMoc2VsZWN0ZWRSdWxlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhbGxvd2VkRGVjbGFyYXRpb25zTGlzdCwgYXR0cmlidXRlT2JqZWN0KSB7XG4gICAgICAvLyBJZiB0aGlzIHByb3BlcnR5IGlzIGFsbG93bGlzdGVkLi4uXG4gICAgICBpZiAoaGFzKHNlbGVjdGVkUnVsZSwgYXR0cmlidXRlT2JqZWN0LnByb3ApKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXNSZWdleCA9IHNlbGVjdGVkUnVsZVthdHRyaWJ1dGVPYmplY3QucHJvcF0uc29tZShmdW5jdGlvbihyZWd1bGFyRXhwcmVzc2lvbikge1xuICAgICAgICAgIHJldHVybiByZWd1bGFyRXhwcmVzc2lvbi50ZXN0KGF0dHJpYnV0ZU9iamVjdC52YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChtYXRjaGVzUmVnZXgpIHtcbiAgICAgICAgICBhbGxvd2VkRGVjbGFyYXRpb25zTGlzdC5wdXNoKGF0dHJpYnV0ZU9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhbGxvd2VkRGVjbGFyYXRpb25zTGlzdDtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gZmlsdGVyQ2xhc3NlcyhjbGFzc2VzLCBhbGxvd2VkLCBhbGxvd2VkR2xvYnMpIHtcbiAgICBpZiAoIWFsbG93ZWQpIHtcbiAgICAgIC8vIFRoZSBjbGFzcyBhdHRyaWJ1dGUgaXMgYWxsb3dlZCB3aXRob3V0IGZpbHRlcmluZyBvbiB0aGlzIHRhZ1xuICAgICAgcmV0dXJuIGNsYXNzZXM7XG4gICAgfVxuICAgIGNsYXNzZXMgPSBjbGFzc2VzLnNwbGl0KC9cXHMrLyk7XG4gICAgcmV0dXJuIGNsYXNzZXMuZmlsdGVyKGZ1bmN0aW9uKGNsc3MpIHtcbiAgICAgIHJldHVybiBhbGxvd2VkLmluZGV4T2YoY2xzcykgIT09IC0xIHx8IGFsbG93ZWRHbG9icy5zb21lKGZ1bmN0aW9uKGdsb2IpIHtcbiAgICAgICAgcmV0dXJuIGdsb2IudGVzdChjbHNzKTtcbiAgICAgIH0pO1xuICAgIH0pLmpvaW4oJyAnKTtcbiAgfVxufVxuXG4vLyBEZWZhdWx0cyBhcmUgYWNjZXNzaWJsZSB0byB5b3Ugc28gdGhhdCB5b3UgY2FuIHVzZSB0aGVtIGFzIGEgc3RhcnRpbmcgcG9pbnRcbi8vIHByb2dyYW1tYXRpY2FsbHkgaWYgeW91IHdpc2hcblxuY29uc3QgaHRtbFBhcnNlckRlZmF1bHRzID0ge1xuICBkZWNvZGVFbnRpdGllczogdHJ1ZVxufTtcbnNhbml0aXplSHRtbC5kZWZhdWx0cyA9IHtcbiAgYWxsb3dlZFRhZ3M6IFtcbiAgICAvLyBTZWN0aW9ucyBkZXJpdmVkIGZyb20gTUROIGVsZW1lbnQgY2F0ZWdvcmllcyBhbmQgbGltaXRlZCB0byB0aGUgbW9yZVxuICAgIC8vIGJlbmlnbiBjYXRlZ29yaWVzLlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUTUwvRWxlbWVudFxuICAgIC8vIENvbnRlbnQgc2VjdGlvbmluZ1xuICAgICdhZGRyZXNzJywgJ2FydGljbGUnLCAnYXNpZGUnLCAnZm9vdGVyJywgJ2hlYWRlcicsXG4gICAgJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ2hncm91cCcsXG4gICAgJ21haW4nLCAnbmF2JywgJ3NlY3Rpb24nLFxuICAgIC8vIFRleHQgY29udGVudFxuICAgICdibG9ja3F1b3RlJywgJ2RkJywgJ2RpdicsICdkbCcsICdkdCcsICdmaWdjYXB0aW9uJywgJ2ZpZ3VyZScsXG4gICAgJ2hyJywgJ2xpJywgJ21haW4nLCAnb2wnLCAncCcsICdwcmUnLCAndWwnLFxuICAgIC8vIElubGluZSB0ZXh0IHNlbWFudGljc1xuICAgICdhJywgJ2FiYnInLCAnYicsICdiZGknLCAnYmRvJywgJ2JyJywgJ2NpdGUnLCAnY29kZScsICdkYXRhJywgJ2RmbicsXG4gICAgJ2VtJywgJ2knLCAna2JkJywgJ21hcmsnLCAncScsXG4gICAgJ3JiJywgJ3JwJywgJ3J0JywgJ3J0YycsICdydWJ5JyxcbiAgICAncycsICdzYW1wJywgJ3NtYWxsJywgJ3NwYW4nLCAnc3Ryb25nJywgJ3N1YicsICdzdXAnLCAndGltZScsICd1JywgJ3ZhcicsICd3YnInLFxuICAgIC8vIFRhYmxlIGNvbnRlbnRcbiAgICAnY2FwdGlvbicsICdjb2wnLCAnY29sZ3JvdXAnLCAndGFibGUnLCAndGJvZHknLCAndGQnLCAndGZvb3QnLCAndGgnLFxuICAgICd0aGVhZCcsICd0cidcbiAgXSxcbiAgZGlzYWxsb3dlZFRhZ3NNb2RlOiAnZGlzY2FyZCcsXG4gIGFsbG93ZWRBdHRyaWJ1dGVzOiB7XG4gICAgYTogWyAnaHJlZicsICduYW1lJywgJ3RhcmdldCcgXSxcbiAgICAvLyBXZSBkb24ndCBjdXJyZW50bHkgYWxsb3cgaW1nIGl0c2VsZiBieSBkZWZhdWx0LCBidXQgdGhpc1xuICAgIC8vIHdvdWxkIG1ha2Ugc2Vuc2UgaWYgd2UgZGlkLiBZb3UgY291bGQgYWRkIHNyY3NldCBoZXJlLFxuICAgIC8vIGFuZCBpZiB5b3UgZG8gdGhlIFVSTCBpcyBjaGVja2VkIGZvciBzYWZldHlcbiAgICBpbWc6IFsgJ3NyYycgXVxuICB9LFxuICAvLyBMb3RzIG9mIHRoZXNlIHdvbid0IGNvbWUgdXAgYnkgZGVmYXVsdCBiZWNhdXNlIHdlIGRvbid0IGFsbG93IHRoZW1cbiAgc2VsZkNsb3Npbmc6IFsgJ2ltZycsICdicicsICdocicsICdhcmVhJywgJ2Jhc2UnLCAnYmFzZWZvbnQnLCAnaW5wdXQnLCAnbGluaycsICdtZXRhJyBdLFxuICAvLyBVUkwgc2NoZW1lcyB3ZSBwZXJtaXRcbiAgYWxsb3dlZFNjaGVtZXM6IFsgJ2h0dHAnLCAnaHR0cHMnLCAnZnRwJywgJ21haWx0bycsICd0ZWwnIF0sXG4gIGFsbG93ZWRTY2hlbWVzQnlUYWc6IHt9LFxuICBhbGxvd2VkU2NoZW1lc0FwcGxpZWRUb0F0dHJpYnV0ZXM6IFsgJ2hyZWYnLCAnc3JjJywgJ2NpdGUnIF0sXG4gIGFsbG93UHJvdG9jb2xSZWxhdGl2ZTogdHJ1ZSxcbiAgZW5mb3JjZUh0bWxCb3VuZGFyeTogZmFsc2Vcbn07XG5cbnNhbml0aXplSHRtbC5zaW1wbGVUcmFuc2Zvcm0gPSBmdW5jdGlvbihuZXdUYWdOYW1lLCBuZXdBdHRyaWJzLCBtZXJnZSkge1xuICBtZXJnZSA9IChtZXJnZSA9PT0gdW5kZWZpbmVkKSA/IHRydWUgOiBtZXJnZTtcbiAgbmV3QXR0cmlicyA9IG5ld0F0dHJpYnMgfHwge307XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKHRhZ05hbWUsIGF0dHJpYnMpIHtcbiAgICBsZXQgYXR0cmliO1xuICAgIGlmIChtZXJnZSkge1xuICAgICAgZm9yIChhdHRyaWIgaW4gbmV3QXR0cmlicykge1xuICAgICAgICBhdHRyaWJzW2F0dHJpYl0gPSBuZXdBdHRyaWJzW2F0dHJpYl07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0dHJpYnMgPSBuZXdBdHRyaWJzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0YWdOYW1lOiBuZXdUYWdOYW1lLFxuICAgICAgYXR0cmliczogYXR0cmlic1xuICAgIH07XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHN0cmluZyA9PiB7XG5cdGlmICh0eXBlb2Ygc3RyaW5nICE9PSAnc3RyaW5nJykge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG5cdH1cblxuXHQvLyBFc2NhcGUgY2hhcmFjdGVycyB3aXRoIHNwZWNpYWwgbWVhbmluZyBlaXRoZXIgaW5zaWRlIG9yIG91dHNpZGUgY2hhcmFjdGVyIHNldHMuXG5cdC8vIFVzZSBhIHNpbXBsZSBiYWNrc2xhc2ggZXNjYXBlIHdoZW4gaXTigJlzIGFsd2F5cyB2YWxpZCwgYW5kIGEgXFx1bm5ubiBlc2NhcGUgd2hlbiB0aGUgc2ltcGxlciBmb3JtIHdvdWxkIGJlIGRpc2FsbG93ZWQgYnkgVW5pY29kZSBwYXR0ZXJuc+KAmSBzdHJpY3RlciBncmFtbWFyLlxuXHRyZXR1cm4gc3RyaW5nXG5cdFx0LnJlcGxhY2UoL1t8XFxcXHt9KClbXFxdXiQrKj8uXS9nLCAnXFxcXCQmJylcblx0XHQucmVwbGFjZSgvLS9nLCAnXFxcXHgyZCcpO1xufTtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iLCJsZXQgdXJsQWxwaGFiZXQgPVxuICAndXNlYW5kb20tMjZUMTk4MzQwUFg3NXB4SkFDS1ZFUllNSU5EQlVTSFdPTEZfR1FaYmZnaGprbHF2d3l6cmljdCdcbmxldCBjdXN0b21BbHBoYWJldCA9IChhbHBoYWJldCwgc2l6ZSkgPT4ge1xuICByZXR1cm4gKCkgPT4ge1xuICAgIGxldCBpZCA9ICcnXG4gICAgbGV0IGkgPSBzaXplXG4gICAgd2hpbGUgKGktLSkge1xuICAgICAgaWQgKz0gYWxwaGFiZXRbKE1hdGgucmFuZG9tKCkgKiBhbHBoYWJldC5sZW5ndGgpIHwgMF1cbiAgICB9XG4gICAgcmV0dXJuIGlkXG4gIH1cbn1cbmxldCBuYW5vaWQgPSAoc2l6ZSA9IDIxKSA9PiB7XG4gIGxldCBpZCA9ICcnXG4gIGxldCBpID0gc2l6ZVxuICB3aGlsZSAoaS0tKSB7XG4gICAgaWQgKz0gdXJsQWxwaGFiZXRbKE1hdGgucmFuZG9tKCkgKiA2NCkgfCAwXVxuICB9XG4gIHJldHVybiBpZFxufVxubW9kdWxlLmV4cG9ydHMgPSB7IG5hbm9pZCwgY3VzdG9tQWxwaGFiZXQgfVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9Uby1Eby1MaXN0L1wiOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwicmVxdWlyZSgnLi9pbmRleC5odG1sJylcclxuaW1wb3J0IHN0eWxlIGZyb20gXCIuL3N0eWxlL3N0eWxlLmNzc1wiO1xyXG5pbXBvcnQgeyBydW5HYW1lTG9vcCB9IGZyb20gXCIuL21vZHVsZXMvZ2FtZUxvb3AuanNcIjtcclxuXHJcblxyXG5ydW5HYW1lTG9vcCgpOyJdLCJuYW1lcyI6WyJpbml0aWFsaXplUGxheWVycyIsImRpc3BsYXlTdGFydE1lbnUiLCJib2R5IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibWFpbiIsInN0YXJ0TWVudSIsImNyZWF0ZUVsZW1lbnQiLCJuYW1lUHJvbXB0Iiwic3RhcnRCdXR0b24iLCJzdHlsZSIsImRpc3BsYXkiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsImlubmVySFRNTCIsInNldEF0dHJpYnV0ZSIsImlubmVyVGV4dCIsImluc2VydEJlZm9yZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVTdGFydE1lbnUiLCJlIiwibmFtZSIsInZhbHVlIiwicHJldmVudERlZmF1bHQiLCJsZW5ndGgiLCJtYXRjaCIsImFsZXJ0IiwicmVtb3ZlIiwiZGlzcGxheVNlbGVjdGlvbk1lbnUiLCJjb250YWluZXIiLCJzZWxlY3Rpb25EaXYiLCJkaXJlY3Rpb25zIiwicm90YXRlQnRuIiwidGV4dENvbnRlbnQiLCJzaGlwU2VsZWN0aW9uIiwiY3JlYXRlR3JpZCIsInBhcmVudENvbnRhaW5lciIsIngiLCJ5IiwiY2VsbCIsInByZXZpZXdQbGFjZW1lbnQiLCJhdHRlbXB0UGxhY2VtZW50IiwicmVzZXRTZWxlY3Rpb24iLCJzYW5pdGl6ZUh0bWwiLCJwbGF5ZXIiLCJwbGF5ZXJOYW1lIiwiaXNDdXJyZW50bHlQbGF5aW5nIiwiYXR0YWNrIiwiY29vcmRzIiwiYm9hcmQiLCJ0dXJuIiwicmVjZWl2ZUF0dGFjayIsImdldE5hbWUiLCJpc0h1bWFuIiwiQUkiLCJnZXRSYW5kb21Db29yZGluYXRlIiwicmFuZG9tWCIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsInJhbmRvbVkiLCJzbWFydERldGVjdGlvbiIsImh1bWFuUGxyIiwiQUlQbHIiLCJydW5HYW1lTG9vcCIsInBsckhlYWRpbmciLCJzdGFydEdhbWUiLCJyZXF1aXJlIl0sInNvdXJjZVJvb3QiOiIifQ==