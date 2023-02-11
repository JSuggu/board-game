"use strict";
(() => {
  // src/classes/AddHtmlElements.ts
  var AddHtmlElements = class {
    static spanToMatchInfo(text) {
      const matchInfoElement = document.querySelector(".match-info");
      const spanElement = document.createElement("span");
      spanElement.innerHTML = text;
      matchInfoElement.appendChild(spanElement);
    }
  };

  // src/classes/Box.ts
  var Box = class {
    constructor(effect = "empty") {
      this.effect = effect;
    }
    getEffect() {
      return this.effect;
    }
  };

  // src/classes/DiceSingleton.ts
  var DiceSingleton = class {
    constructor() {
      this.faces = 12;
    }
    static getInstance() {
      if (this.instance == null)
        this.instance = new DiceSingleton();
      return this.instance;
    }
    getNumber() {
      const randomNumber = Math.floor(Math.random() * this.faces + 1);
      return randomNumber;
    }
  };

  // src/classes/Player.ts
  var Player = class {
    constructor(name, id) {
      this.id = `p${id}`;
      this.name = name;
      this.currentPosition = 0;
      this.isBuffed = false;
      this.isDebuffed = false;
      this.items = /* @__PURE__ */ new Map();
    }
    pullDice(dice) {
      AddHtmlElements.spanToMatchInfo(`El jugador ${this.name} lanza sus dados...`);
      const result = dice.getNumber();
      AddHtmlElements.spanToMatchInfo(`Obtuviste un ${result}`);
      return result;
    }
    move(number) {
      this.currentPosition = number;
      AddHtmlElements.spanToMatchInfo(`la posicion ahora es ${number}`);
    }
    addItem(name, effect) {
      this.items.set(name, effect);
    }
    getItem(name) {
      return this.items.get(name);
    }
    getAllItems() {
      return this.items;
    }
    getAllItemsName() {
      const IterableKeys = this.items.keys();
      let itemsName = "";
      for (let itemName of IterableKeys) {
        itemsName += `${itemName}, `;
      }
      return itemsName;
    }
    removeItem(name) {
      this.items.delete(name);
    }
    updateBuff(buffed) {
      this.isBuffed = buffed;
    }
    updateDebuff(debuffed) {
      this.isDebuffed = debuffed;
    }
    //GETTERS
    getId() {
      return this.id;
    }
    getName() {
      return this.name;
    }
    getCurrentPostion() {
      return this.currentPosition;
    }
    getIsBuffed() {
      return this.isBuffed;
    }
    getIsdebuffed() {
      return this.isDebuffed;
    }
    toString() {
      return `Nombre: ${this.name} | posicion: ${this.currentPosition}`;
    }
  };

  // src/classes/effects/buff/AdvanceStrategy.ts
  var AdvanceStrategy = class {
    activeEffect(player) {
      const playerName = player.getName();
      AddHtmlElements.spanToMatchInfo(`${playerName} avanza 3 casilleros mas`);
      const result = player.getCurrentPostion() + 3;
      player.move(result);
      AddHtmlElements.spanToMatchInfo(`La posicion de ${playerName} ahora es: ${result}`);
    }
  };

  // src/classes/effects/buff/ExtraRollStrategy.ts
  var ExtraRollStrategy = class {
    constructor() {
      this.dice = DiceSingleton.getInstance();
    }
    activeEffect(player) {
      AddHtmlElements.spanToMatchInfo(`${player.getName()} puede lanzar nuevamente su dado`);
      const result = player.pullDice(this.dice);
      player.move(player.getCurrentPostion() + result);
    }
  };

  // src/classes/effects/debuff/BackStrategy.ts
  var BackStrategy = class {
    activeEffect(player) {
      const playerName = player.getName();
      AddHtmlElements.spanToMatchInfo(`${playerName} retrocede 3 casilleros`);
      const result = player.getCurrentPostion() - 3;
      player.move(result);
      AddHtmlElements.spanToMatchInfo(`La posicion de ${playerName} ahora es: ${result}`);
    }
  };

  // src/classes/effects/debuff/LoseTurnStrategy.ts
  var LoseTurnStrategy = class {
    activeEffect(player) {
      AddHtmlElements.spanToMatchInfo(`${player.getName()} pierde su siguente turno`);
      player.updateDebuff(true);
    }
  };

  // src/classes/effects/item/BubbleItemStrategy.ts
  var BubbleItemStrategy = class {
    activeEffect(player) {
      player.addItem("bubble", new BubbleItemStrategy());
      AddHtmlElements.spanToMatchInfo(`Item "Bubble" a\xF1adido a ${player.getName()}`);
    }
    use(player) {
      player.updateDebuff(true);
      AddHtmlElements.spanToMatchInfo(`El jugador uso "Bubble" contra ${player.getName()} y perdera su siguiente turno`);
    }
  };

  // src/classes/effects/item/HookItemStrategy.ts
  var HookItemStrategy = class {
    activeEffect(player) {
      player.addItem("hook", new HookItemStrategy());
      AddHtmlElements.spanToMatchInfo(`Item "Hook" a\xF1adido a ${player.getName()}`);
    }
    use(player) {
      const enemyPosition = player.getCurrentPostion();
      player.move(enemyPosition - 7);
      AddHtmlElements.spanToMatchInfo(`El jugador uso el "Hook" contra ${player.getName()} y lo hizo retroceder 7 casilleros`);
    }
  };

  // src/classes/effects/item/ShieldItemStrategy.ts
  var ShieldItemStrategy = class {
    activeEffect(player) {
      player.addItem("shield", new ShieldItemStrategy());
      AddHtmlElements.spanToMatchInfo(`Item "Shield" a\xF1adido a ${player.getName()}`);
    }
    use(player) {
      player.updateBuff(true);
      AddHtmlElements.spanToMatchInfo(`El jugador uso el "Shield" en ${player.getName()}`);
    }
  };

  // src/classes/Events.ts
  var Events = class {
    //FUNCION PARA GENERAR UN NUMERO RANDOM DEPENDIENDO DE LA CANTIDAD DE EFECTOS
    static generateRandomNumberForEffects(effectType) {
      const effectsMap = /* @__PURE__ */ new Map();
      effectsMap.set("buff", 2);
      effectsMap.set("debuff", 2);
      effectsMap.set("predict", 1);
      effectsMap.set("item", 3);
      const getAmountFromEffect = effectsMap.get(effectType) || -1;
      const randomNumber = Math.floor(Math.random() * getAmountFromEffect + 1);
      return randomNumber;
    }
    static applyEffect(currentPlayer, boxes) {
      const playerPosition = currentPlayer.getCurrentPostion();
      const actualBox = boxes.get(playerPosition);
      const boxEffect = actualBox.getEffect();
      let result;
      if (boxEffect == "buff") {
        result = this.generateRandomNumberForEffects("buff");
        if (result == 1)
          return new AdvanceStrategy();
        if (result == 2)
          return new ExtraRollStrategy();
      }
      if (boxEffect == "debuff") {
        result = this.generateRandomNumberForEffects("debuff");
        if (result == 1)
          return new BackStrategy();
        if (result == 2)
          return new LoseTurnStrategy();
      }
      if (boxEffect == "item") {
        result = this.generateRandomNumberForEffects("item");
        if (result == 1)
          return new HookItemStrategy();
        if (result == 2)
          return new BubbleItemStrategy();
        if (result == 3)
          return new ShieldItemStrategy();
      }
      return void 0;
    }
    //Si el jugador posee items se le pregunta si quiere usarlos y contra que enemigo quiere usarlo
    static itemUsed(currentPlayer, enemyPlayer, itemChosen) {
      const currentPlayerItems = currentPlayer.getAllItems();
      if (!currentPlayerItems.has(itemChosen))
        return false;
      const enemyPlayerName = enemyPlayer.getName();
      AddHtmlElements.spanToMatchInfo(`has usado el objeto ${itemChosen}`);
      if (itemChosen == "bubble") {
        const bubble = currentPlayerItems.get("bubble");
        if (enemyPlayer.getIsBuffed()) {
          AddHtmlElements.spanToMatchInfo(`El ${enemyPlayerName} tenia un escudo y no se aplico el efecto`);
          currentPlayer.removeItem("bubble");
          enemyPlayer.updateBuff(false);
          return true;
        }
        bubble.use(enemyPlayer);
        currentPlayer.removeItem("bubble");
        return true;
      }
      if (itemChosen == "hook") {
        const hook = currentPlayerItems.get("hook");
        if (enemyPlayer.getIsBuffed()) {
          AddHtmlElements.spanToMatchInfo(`El ${enemyPlayerName} tenia un escudo y no se aplico el efecto`);
          currentPlayer.removeItem("hook");
          enemyPlayer.updateBuff(false);
          return true;
        }
        hook.use(enemyPlayer);
        currentPlayer.removeItem("hook");
        return true;
      }
      if (itemChosen == "shield") {
        const shield = currentPlayerItems.get("shield");
        if (enemyPlayer.getIsBuffed()) {
          AddHtmlElements.spanToMatchInfo(`El ${enemyPlayerName} tenia un escudo y no se aplico el efecto`);
          currentPlayer.removeItem("shield");
          enemyPlayer.updateBuff(false);
          return true;
        }
        shield.use(enemyPlayer);
        currentPlayer.removeItem("shield");
        return true;
      }
      return false;
    }
    static finishGame(actualPlayer) {
      if (actualPlayer.getCurrentPostion() >= 120)
        return true;
      return false;
    }
  };

  // src/classes/BoardGameSingleton.ts
  var BoardGameSingleton = class {
    constructor() {
      this.boxes = /* @__PURE__ */ new Map();
      this.buffBoxes = /* @__PURE__ */ new Set([7, 20, 35, 53, 68, 78, 84, 100]);
      this.debuffBoxes = /* @__PURE__ */ new Set([10, 28, 44, 68, 79, 92, 110, 119]);
      this.predictBoxes = /* @__PURE__ */ new Set([33, 70, 95]);
      this.itemBoxes = /* @__PURE__ */ new Set([16, 32, 52, 60, 82, 97]);
      this.dice = DiceSingleton.getInstance();
      this.players = /* @__PURE__ */ new Map();
      this.round = 1;
      this.diceRollOrder = 1;
      this.endGame = false;
      this.addBoxes();
    }
    addBoxes() {
      let box;
      for (let i = 0; i < 120; i++) {
        if (this.buffBoxes.has(i)) {
          box = new Box("buff");
          this.boxes.set(i, box);
          continue;
        }
        if (this.debuffBoxes.has(i)) {
          box = new Box("debuff");
          this.boxes.set(i, box);
          continue;
        }
        if (this.itemBoxes.has(i)) {
          box = new Box("item");
          this.boxes.set(i, box);
          continue;
        }
        if (this.predictBoxes.has(i)) {
          box = new Box("predict");
          this.boxes.set(i, box);
          continue;
        }
        box = new Box();
        this.boxes.set(i, box);
      }
    }
    addPlayers(playersNumber) {
      if (playersNumber < 2)
        playersNumber = 2;
      if (playersNumber > 4)
        playersNumber = 4;
      for (let i = 1; i <= playersNumber; i++) {
        const newPlayer = new Player(`player ${i}`, i);
        this.players.set(i, newPlayer);
      }
    }
    currentPlayer() {
      return this.players.get(this.diceRollOrder);
    }
    playerPullDice(currentPlayer) {
      const diceResult = currentPlayer.pullDice(this.dice);
      return diceResult;
    }
    updatePosition(currentPlayer, diceResult) {
      currentPlayer.move(currentPlayer.getCurrentPostion() + diceResult);
    }
    verifyLoseTurn(currentPlayer) {
      return currentPlayer.getIsdebuffed();
    }
    useItem(currentPlayer, itemChosen, enemyPlayer) {
      if (!currentPlayer.getAllItems().has(itemChosen)) {
        return false;
      }
      const wasUsed = Events.itemUsed(currentPlayer, enemyPlayer, itemChosen);
      return wasUsed;
    }
    verifyEffect(currentPlayer) {
      this.effect = Events.applyEffect(currentPlayer, this.boxes);
      if (this.effect != void 0) {
        this.effect.activeEffect(currentPlayer);
        return this.effect;
      }
      return void 0;
    }
    nextRound() {
      this.diceRollOrder += 1;
      if (this.diceRollOrder > this.players.size)
        this.diceRollOrder = 1;
      this.round += 1;
    }
    verifyEndGame(currentPlayer) {
      if (this.endGame) {
        return true;
      }
      this.endGame = Events.finishGame(currentPlayer);
      if (this.endGame) {
        return true;
      }
      return false;
    }
    static getInstance() {
      if (this.instance == null)
        return this.instance = new BoardGameSingleton();
      return this.instance;
    }
    //GETTERS
    getBuffBoxes() {
      return this.buffBoxes;
    }
    getDebuffBoxes() {
      return this.debuffBoxes;
    }
    getItemBoxes() {
      return this.itemBoxes;
    }
    getPlayers() {
      return this.players;
    }
    getPlayersName() {
      let playersName = "";
      this.players.forEach((value, key) => {
        playersName += `ID: ${key} | ${value.toString()}
`;
      });
      return playersName;
    }
    getPlayer(id) {
      return this.players.get(id);
    }
    getRound() {
      return this.round;
    }
  };

  // src/classes/Draw.ts
  var boardGame = BoardGameSingleton.getInstance();
  var Draw = class {
    static paintPlayerName(name) {
      const playerNameElement = document.querySelector(".current-player");
      playerNameElement.innerHTML = name;
    }
    static paintItems(player) {
      const itemsElement = document.querySelector(".items");
      itemsElement.innerHTML = "";
      const itemsNameIterable = player.getAllItems().keys();
      for (let itemName of itemsNameIterable) {
        const optionElement = document.createElement("option");
        optionElement.setAttribute("value", itemName);
        optionElement.innerHTML = itemName;
        itemsElement.append(optionElement);
      }
    }
    static paintBox(id, effect) {
      const sectionElement = document.createElement("section");
      sectionElement.setAttribute("class", "box");
      sectionElement.setAttribute("id", `box${id}`);
      if (effect != void 0) {
        if (effect === "buff") {
          sectionElement.style.backgroundColor = "rgb(150, 220, 100)";
          return sectionElement;
        }
        if (effect === "debuff") {
          sectionElement.style.backgroundColor = "rgb(220, 85, 75)";
          return sectionElement;
        }
        if (effect === "item") {
          sectionElement.style.backgroundColor = "rgb(235, 220, 80)";
          return sectionElement;
        }
      }
      return sectionElement;
    }
    static paintBoard() {
      const topBoxesContainer = document.querySelector(".top-boxes");
      const rightBoxesContainer = document.querySelector(".right-boxes");
      const bottomBoxesContainer = document.querySelector(".bottom-boxes");
      const leftBoxesContainer = document.querySelector(".left-boxes");
      const buffBoxes = boardGame.getBuffBoxes();
      const debuffBoxes = boardGame.getDebuffBoxes();
      const itemsBoxes = boardGame.getItemBoxes();
      for (let i = 0; i < 120; i++) {
        if (buffBoxes.has(i)) {
          if (i < 40) {
            topBoxesContainer.append(this.paintBox(i, "buff"));
            continue;
          }
          if (i >= 40 && i < 60) {
            rightBoxesContainer.append(this.paintBox(i, "buff"));
            continue;
          }
          if (i >= 60 && i < 100) {
            bottomBoxesContainer.append(this.paintBox(i, "buff"));
            continue;
          }
          if (i >= 100) {
            leftBoxesContainer.append(this.paintBox(i, "buff"));
            continue;
          }
        }
        if (debuffBoxes.has(i)) {
          if (i < 40) {
            topBoxesContainer.append(this.paintBox(i, "debuff"));
            continue;
          }
          if (i >= 40 && i < 60) {
            rightBoxesContainer.append(this.paintBox(i, "debuff"));
            continue;
          }
          if (i >= 60 && i < 100) {
            bottomBoxesContainer.append(this.paintBox(i, "debuff"));
            continue;
          }
          if (i >= 100) {
            leftBoxesContainer.append(this.paintBox(i, "debuff"));
            continue;
          }
        }
        if (itemsBoxes.has(i)) {
          if (i < 40) {
            topBoxesContainer.append(this.paintBox(i, "item"));
            continue;
          }
          if (i >= 40 && i < 60) {
            rightBoxesContainer.append(this.paintBox(i, "item"));
            continue;
          }
          if (i >= 60 && i < 100) {
            bottomBoxesContainer.append(this.paintBox(i, "item"));
            continue;
          }
          if (i >= 100) {
            leftBoxesContainer.append(this.paintBox(i, "item"));
            continue;
          }
        }
        if (i < 40) {
          topBoxesContainer.append(this.paintBox(i));
          continue;
        }
        if (i >= 40 && i < 60) {
          rightBoxesContainer.append(this.paintBox(i));
          continue;
        }
        if (i >= 60 && i < 100) {
          bottomBoxesContainer.append(this.paintBox(i));
          continue;
        }
        if (i >= 100) {
          leftBoxesContainer.append(this.paintBox(i));
          continue;
        }
      }
    }
    static paintPlayers(players) {
      const boardElement = document.querySelector(".board");
      const playersBoxElement = document.querySelector(".players-box");
      const startBox = boardElement.querySelector("#box0");
      players.forEach((value, key) => {
        const playerNameElement = document.createElement("span");
        playerNameElement.innerHTML = `${value.getName()}`;
        const playerElementStatic = document.createElement("div");
        playerElementStatic.setAttribute("class", "player");
        playerElementStatic.setAttribute("id", `ps${key}`);
        playerElementStatic.appendChild(playerNameElement);
        const playerContainer = document.createElement("section");
        playerContainer.setAttribute("class", "player-container");
        playerContainer.appendChild(playerElementStatic);
        playerContainer.appendChild(playerNameElement);
        playersBoxElement.appendChild(playerContainer);
        const playerElement = document.createElement("div");
        playerElement.setAttribute("class", "player");
        playerElement.setAttribute("id", `p${key}`);
        startBox.appendChild(playerElement);
      });
    }
    static repaintPlayer(player, diceResult, beforeCurrentPostion = -1) {
      const boardElement = document.querySelector(".board");
      const playerPosition = player.getCurrentPostion();
      const playerId = player.getId();
      const playerElementClone = document.createElement("div");
      playerElementClone.setAttribute("class", "player");
      playerElementClone.setAttribute("id", playerId);
      if (beforeCurrentPostion != -1) {
        const playerCurrentBox2 = boardElement.querySelector(`#box${beforeCurrentPostion}`);
        const playerElement2 = playerCurrentBox2.querySelector(`#${playerId}`);
        const playerNewBox2 = boardElement.querySelector(`#box${playerPosition}`);
        playerNewBox2.appendChild(playerElementClone);
        playerElement2.remove();
        return;
      }
      const playerCurrentBox = boardElement.querySelector(`#box${playerPosition}`);
      const playerElement = playerCurrentBox.querySelector(`#${playerId}`);
      if (playerPosition + diceResult >= 120) {
        const winnerBoxElement = boardElement.querySelector(".winner-box");
        winnerBoxElement.appendChild(playerElementClone);
        const winnerNameElement = boardElement.querySelector(".winner-name");
        winnerNameElement.innerHTML = `El ganador es ${player.getName()}<br>El juego se reiniciara en 10 segundos`;
        playerElement.remove();
        return;
      }
      const playerNewBox = boardElement.querySelector(`#box${playerPosition + diceResult}`);
      playerNewBox.appendChild(playerElementClone);
      playerElement.remove();
      return;
    }
  };

  // src/index.ts
  window.addEventListener("DOMContentLoaded", () => {
    const buttonPullDice = document.querySelector(".rollDice");
    const formItemUsed = document.querySelector(".items-form");
    const boardGame2 = BoardGameSingleton.getInstance();
    const playerAmount = prompt("ingrese la cantidad de jugadores: min. 2 y max. 4") || "2";
    const numberPlayerAmount = parseInt(playerAmount);
    if (numberPlayerAmount == void 0)
      boardGame2.addPlayers(2);
    if (numberPlayerAmount)
      boardGame2.addPlayers(numberPlayerAmount);
    let currentPlayer = boardGame2.currentPlayer();
    Draw.paintBoard();
    Draw.paintPlayers(boardGame2.getPlayers());
    Draw.paintPlayerName(currentPlayer.getName());
    const removeEventClick = () => {
      const diceResult = boardGame2.playerPullDice(currentPlayer);
      Draw.repaintPlayer(currentPlayer, diceResult);
      boardGame2.updatePosition(currentPlayer, diceResult);
      let endGame = boardGame2.verifyEndGame(currentPlayer);
      const currentPositionBeforeEffect = currentPlayer.getCurrentPostion();
      if (endGame) {
        buttonPullDice.removeEventListener("click", removeEventClick);
        AddHtmlElements.spanToMatchInfo(`El ganador es el jugador: ${currentPlayer.getName()}`);
        setTimeout(() => {
          window.location.reload();
        }, 1e4);
        return;
      }
      const effect = boardGame2.verifyEffect(currentPlayer);
      if (effect instanceof BackStrategy || effect instanceof AdvanceStrategy || effect instanceof ExtraRollStrategy) {
        Draw.repaintPlayer(currentPlayer, 0, currentPositionBeforeEffect);
      }
      boardGame2.nextRound();
      currentPlayer = boardGame2.currentPlayer();
      if (boardGame2.verifyLoseTurn(currentPlayer)) {
        currentPlayer.updateDebuff(false);
        boardGame2.nextRound();
        currentPlayer = boardGame2.currentPlayer();
      }
      Draw.paintPlayerName(currentPlayer.getName());
      Draw.paintItems(currentPlayer);
    };
    buttonPullDice.addEventListener("click", removeEventClick);
    formItemUsed.addEventListener("submit", (e) => {
      e.preventDefault();
      const itemChosen = e.target[0].value;
      const enemyChosen = prompt(`Elige el ID de algun player contra el que usar el objeto:
${boardGame2.getPlayersName()}` || "-1");
      const enemyChosenId = parseInt(enemyChosen);
      const enemyPlayer = boardGame2.getPlayer(enemyChosenId);
      if (enemyPlayer) {
        const currentPositionEnemy = enemyPlayer.getCurrentPostion();
        const wasUsed = boardGame2.useItem(currentPlayer, itemChosen, enemyPlayer);
        if (wasUsed) {
          const itemsElem = formItemUsed.querySelector(".items");
          itemsElem.innerHTML = "";
        }
        if (wasUsed && itemChosen == "hook")
          Draw.repaintPlayer(enemyPlayer, 0, currentPositionEnemy);
      }
      AddHtmlElements.spanToMatchInfo(`El enemigo seleccionado no existe`);
    });
  });
})();
//# sourceMappingURL=index.js.map
