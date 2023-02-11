import { AddHtmlElements } from "./classes/AddHtmlElements";
import { BoardGameSingleton } from "./classes/BoardGameSingleton";
import { Draw } from "./classes/Draw";
import { AdvanceStrategy } from "./classes/effects/buff/AdvanceStrategy";
import { ExtraRollStrategy } from "./classes/effects/buff/ExtraRollStrategy";
import { BackStrategy } from "./classes/effects/debuff/BackStrategy";
import { Player } from "./classes/Player";

window.addEventListener("DOMContentLoaded", () => {
    const buttonPullDice: Element = <Element>document.querySelector(".rollDice");
    const formItemUsed: Element = <Element>document.querySelector(".items-form");
    const boardGame: BoardGameSingleton = BoardGameSingleton.getInstance();

    const playerAmount: string = prompt("ingrese la cantidad de jugadores: min. 2 y max. 4") || "2";
    const numberPlayerAmount: number =  parseInt(playerAmount);

    if(numberPlayerAmount == undefined)
        boardGame.addPlayers(2);

    if(numberPlayerAmount)
        boardGame.addPlayers(numberPlayerAmount);

    let currentPlayer: Player = boardGame.currentPlayer();

    Draw.paintBoard();
    Draw.paintPlayers(boardGame.getPlayers());
    Draw.paintPlayerName(currentPlayer.getName());
    
    const removeEventClick = () => {
        
        const diceResult: number = boardGame.playerPullDice(currentPlayer);
        Draw.repaintPlayer(currentPlayer, diceResult);
        boardGame.updatePosition(currentPlayer, diceResult);
        let endGame: boolean = boardGame.verifyEndGame(currentPlayer);

        //Esta variable la uso para guardar una referencia de la posicion del jugador antes de
        //que se le aplique un efecto que altera su posicion.
        const currentPositionBeforeEffect: number = currentPlayer.getCurrentPostion();

        if(endGame){
            buttonPullDice.removeEventListener("click", removeEventClick);
            AddHtmlElements.spanToMatchInfo(`El ganador es el jugador: ${currentPlayer.getName()}`);
            setTimeout(()=>{
                window.location.reload();
            }, 10000);
            return;
        }

        const effect = boardGame.verifyEffect(currentPlayer);

        if(effect instanceof BackStrategy || effect instanceof AdvanceStrategy || effect instanceof ExtraRollStrategy){
            Draw.repaintPlayer(currentPlayer, 0, currentPositionBeforeEffect);
        }

        boardGame.nextRound();

        currentPlayer = boardGame.currentPlayer();

        if(boardGame.verifyLoseTurn(currentPlayer)){
            currentPlayer.updateDebuff(false);
            boardGame.nextRound();
            currentPlayer = boardGame.currentPlayer();
        }

        Draw.paintPlayerName(currentPlayer.getName());
        Draw.paintItems(currentPlayer);
    }

    buttonPullDice.addEventListener("click", removeEventClick);

    formItemUsed.addEventListener("submit", e => {
        e.preventDefault();
        const itemChosen = e.target[0].value;
        const enemyChosen: string = <string>prompt(`Elige el ID de algun player contra el que usar el objeto:\n${boardGame.getPlayersName()}` || "-1");
        const enemyChosenId: number = parseInt(enemyChosen);
        const enemyPlayer: Player | undefined = boardGame.getPlayer(enemyChosenId);

        if(enemyPlayer){
            const currentPositionEnemy: number = enemyPlayer.getCurrentPostion();

            const wasUsed = boardGame.useItem(currentPlayer, itemChosen, enemyPlayer);

            if(wasUsed){
                const itemsElem: Element = <Element>formItemUsed.querySelector(".items");
                itemsElem.innerHTML = "";
            }

            if(wasUsed && itemChosen == "hook")
                Draw.repaintPlayer(enemyPlayer, 0, currentPositionEnemy);
                
        }

        AddHtmlElements.spanToMatchInfo(`El enemigo seleccionado no existe`);

    });

})
