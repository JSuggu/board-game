import { BoardGameSingleton } from "./BoardGameSingleton";
import { Player } from "./Player";

const boardGame: BoardGameSingleton = BoardGameSingleton.getInstance();

export abstract class Draw {
    
    public static paintPlayerName(name: string): void{
        const playerNameElement: Element = <Element> document.querySelector(".current-player");
        playerNameElement.innerHTML = name;
    }

    public static paintItems(player: Player): void{
        const itemsElement: Element = <Element> document.querySelector(".items");

        itemsElement.innerHTML = "";

        const itemsNameIterable: Iterable<string> = player.getAllItems().keys();

        for(let itemName of itemsNameIterable){
            const optionElement = document.createElement("option");
            optionElement.setAttribute("value", itemName);
            optionElement.innerHTML = itemName;

            itemsElement.append(optionElement);
        }
    }

    private static paintBox(id: number, effect?: string): HTMLElement{
        const sectionElement = document.createElement("section");
        sectionElement.setAttribute("class", "box");
        sectionElement.setAttribute("id", `box${id}`);

        if(effect != undefined) {
            if(effect === "buff"){
                sectionElement.style.backgroundColor = "rgb(150, 220, 100)";
                return sectionElement;
            }

            if(effect === "debuff"){
                sectionElement.style.backgroundColor = "rgb(220, 85, 75)";
                return sectionElement;
            }
                
            if(effect === "item"){
                sectionElement.style.backgroundColor = "rgb(235, 220, 80)";
                return sectionElement
            }
        }
            
        return sectionElement;
    }

    public static paintBoard(): void{
        const topBoxesContainer:Element = <Element>document.querySelector(".top-boxes");
        const rightBoxesContainer:Element = <Element>document.querySelector(".right-boxes");
        const bottomBoxesContainer:Element = <Element>document.querySelector(".bottom-boxes");
        const leftBoxesContainer:Element = <Element>document.querySelector(".left-boxes");

        const buffBoxes: Set<number> = boardGame.getBuffBoxes();
        const debuffBoxes: Set<number> = boardGame.getDebuffBoxes();
        const itemsBoxes: Set<number> = boardGame.getItemBoxes();

        for(let i = 0; i<120; i++){

            if(buffBoxes.has(i)){

                if(i<40){
                    topBoxesContainer.append(this.paintBox(i, "buff"));
                    continue;
                }
                
                if(i>=40 && i<60){
                    rightBoxesContainer.append(this.paintBox(i, "buff"));
                    continue;
                }
    
                if(i>=60 && i<100){
                    bottomBoxesContainer.append(this.paintBox(i, "buff"));
                    continue;
                }
    
                if(i>=100){
                    leftBoxesContainer.append(this.paintBox(i, "buff"));
                    continue;
                }  
                
            }

            if(debuffBoxes.has(i)){

                if(i<40){
                    topBoxesContainer.append(this.paintBox(i, "debuff"));
                    continue;
                }
                
                if(i>=40 && i<60){
                    rightBoxesContainer.append(this.paintBox(i, "debuff"));
                    continue;
                } 
    
                if(i>=60 && i<100){
                    bottomBoxesContainer.append(this.paintBox(i, "debuff"));
                    continue;
                }
    
                if(i>=100){
                    leftBoxesContainer.append(this.paintBox(i, "debuff"));
                    continue;
                }  
                
            }

            if(itemsBoxes.has(i)){

                if(i<40){
                    topBoxesContainer.append(this.paintBox(i, "item"));
                    continue;
                }
                    
                if(i>=40 && i<60){
                    rightBoxesContainer.append(this.paintBox(i, "item"));
                    continue;
                }
                    
                if(i>=60 && i<100){
                    bottomBoxesContainer.append(this.paintBox(i, "item"));
                    continue;
                }
                   
                if(i>=100){
                    leftBoxesContainer.append(this.paintBox(i, "item"));
                    continue;
                }  
                
            }

            if(i<40){
                topBoxesContainer.append(this.paintBox(i));
                continue;
            }
                
            
            if(i>=40 && i<60){
                rightBoxesContainer.append(this.paintBox(i));
                continue;
            }
                

            if(i>=60 && i<100){
                bottomBoxesContainer.append(this.paintBox(i));
                continue;
            }
               

            if(i>=100){
                leftBoxesContainer.append(this.paintBox(i));
                continue;
            } 
              
        }
    }

    public static paintPlayers(players: Map<number, Player>): void{
        const boardElement: Element = <Element> document.querySelector(".board");
        const playersBoxElement: Element = <Element> document.querySelector(".players-box");
        const startBox: Element = <Element> boardElement.querySelector("#box0");

        players.forEach((value, key) => {
            const playerNameElement: Element = document.createElement("span");
            playerNameElement.innerHTML =  `${value.getName()}`;

            const playerElementStatic: Element = document.createElement("div");
            playerElementStatic.setAttribute("class", "player");
            playerElementStatic.setAttribute("id", `ps${key}`);
            playerElementStatic.appendChild(playerNameElement);

            const playerContainer: Element = document.createElement("section");
            playerContainer.setAttribute("class", "player-container");
            playerContainer.appendChild(playerElementStatic);
            playerContainer.appendChild(playerNameElement);

            playersBoxElement.appendChild(playerContainer);

            const playerElement: Element = document.createElement("div");
            playerElement.setAttribute("class", "player");
            playerElement.setAttribute("id", `p${key}`);
            startBox.appendChild(playerElement);

        });
    }

    public static repaintPlayer(player: Player, diceResult: number, beforeCurrentPostion: number = -1): void {
        const boardElement: Element = <Element>document.querySelector(".board");
        //Si se aplica un efecto que altera la posicion del jugador, esta variable guarda la pocision despues de que el efecto se haya aplicado.
        const playerPosition = player.getCurrentPostion();
        const playerId: string = player.getId();

        const playerElementClone = document.createElement("div");
        playerElementClone.setAttribute("class", "player");
        playerElementClone.setAttribute("id", playerId);

        if(beforeCurrentPostion != -1){
            const playerCurrentBox: Element = <Element>boardElement.querySelector(`#box${beforeCurrentPostion}`);
            const playerElement: Element = <Element> playerCurrentBox.querySelector(`#${playerId}`);
            const playerNewBox: Element = <Element>boardElement.querySelector(`#box${playerPosition}`);
        
            playerNewBox.appendChild(playerElementClone);
            playerElement.remove();
            return;
        }

        const playerCurrentBox: Element = <Element>boardElement.querySelector(`#box${playerPosition}`);
        const playerElement: Element = <Element> playerCurrentBox.querySelector(`#${playerId}`);

        if(playerPosition + diceResult >= 120){
            const winnerBoxElement: Element = <Element>boardElement.querySelector(".winner-box");
            winnerBoxElement.appendChild(playerElementClone);
            const winnerNameElement: Element = <Element>boardElement.querySelector(".winner-name");
            winnerNameElement.innerHTML = `El ganador es ${player.getName()}<br>El juego se reiniciara en 10 segundos`;
            playerElement.remove();
            return;
        }

        const playerNewBox: Element = <Element>boardElement.querySelector(`#box${playerPosition+diceResult}`);
        
        playerNewBox.appendChild(playerElementClone);
        playerElement.remove();
        return;
    }   
}