import { IEffect } from "../interfaces/IEffect";
import { Box } from "./Box";
import { DiceSingleton } from "./DiceSingleton";
import { Player } from "./Player";
import { Events } from "./Events";

export class BoardGameSingleton {
    private static instance: BoardGameSingleton;
    private boxes: Map<number, Box>;
    private buffBoxes: Set<number>;
    private debuffBoxes: Set<number>;
    private predictBoxes: Set<number>;
    private itemBoxes: Set<number>;
    private dice: DiceSingleton;
    private players: Map<number, Player>;
    private round: number;
    private effect: IEffect | undefined;
    private endGame: boolean;
    private diceRollOrder: number;

    private constructor(){
        this.boxes = new Map<number, Box>();
        this.buffBoxes = new Set<number>([7,20,35,53,68,78,84,100]);
        this.debuffBoxes = new Set<number>([10,28,44,68,79,92,110,119]);
        this.predictBoxes = new Set<number>([33,70,95]);
        this.itemBoxes = new Set<number>([16,32,52,60,82,97]);
        this.dice = DiceSingleton.getInstance();
        this.players = new Map<number, Player>();
        this.round = 1;
        this.diceRollOrder = 1;
        this.endGame = false;

        this.addBoxes();
    }

    private addBoxes(): void{
        let box: Box;
        for(let i:number = 0; i<120; i++){
            if (this.buffBoxes.has(i)){
                box = new Box("buff");
                this.boxes.set(i, box);
                continue;
            }

            if(this.debuffBoxes.has(i)){
                box = new Box("debuff");
                this.boxes.set(i, box);
                continue;
            }

            if(this.itemBoxes.has(i)){
                box = new Box("item");
                this.boxes.set(i, box);
                continue;
            }

            if(this.predictBoxes.has(i)){
                box = new Box("predict");
                this.boxes.set(i, box);
                continue;
            }

            box = new Box();
            this.boxes.set(i,box);
        }
    }

    public addPlayers(playersNumber: number): void{
        if(playersNumber<2)
            playersNumber = 2;
        if(playersNumber>4)
            playersNumber = 4;

        for(let i:number = 1; i<=playersNumber; i++){
            const newPlayer: Player = new Player(`player ${i}`, i);
            this.players.set(i, newPlayer);
        }
    }

    public currentPlayer(): Player {
        return <Player>this.players.get(this.diceRollOrder);
    }
    
    public playerPullDice (currentPlayer: Player): number {
        const diceResult: number = currentPlayer.pullDice(this.dice);
        return diceResult;
    }

    public updatePosition(currentPlayer: Player, diceResult: number): void{
        currentPlayer.move(currentPlayer.getCurrentPostion()+diceResult);
    }

    public verifyLoseTurn(currentPlayer: Player): boolean {
        return currentPlayer.getIsdebuffed();
    }

    public useItem(currentPlayer: Player, itemChosen: string, enemyPlayer: Player): boolean{

        if(!currentPlayer.getAllItems().has(itemChosen)){
            return false;
        }

        const wasUsed: boolean = Events.itemUsed(currentPlayer, enemyPlayer, itemChosen);
        return wasUsed
    }

    public verifyEffect(currentPlayer: Player): IEffect | undefined {

        this.effect = Events.applyEffect(currentPlayer, this.boxes);

        if(this.effect != undefined){               
            this.effect.activeEffect(currentPlayer);
            return this.effect;
        }
        return undefined;
    }

    public nextRound(): void {
        this.diceRollOrder += 1;

        if(this.diceRollOrder > this.players.size)
            this.diceRollOrder = 1;

        this.round += 1;
    }

    public verifyEndGame(currentPlayer: Player): boolean{

        if(this.endGame){
            return true;
        }

        this.endGame = Events.finishGame(currentPlayer);

        if(this.endGame){
            return true;
        }

        return false;
    }

    public static getInstance(): BoardGameSingleton{
        if(this.instance == null)
            return this.instance = new BoardGameSingleton;
        
        return this.instance;
    }

    //GETTERS
    public getBuffBoxes(): Set<number>{
        return this.buffBoxes;
    }

    public getDebuffBoxes(): Set<number>{
        return this.debuffBoxes;
    }

    public getItemBoxes(): Set<number>{
        return this.itemBoxes;
    } 

    public getPlayers(): Map<number, Player> {
        return this.players;
    }

    public getPlayersName(): string {
        let playersName = "";
        this.players.forEach((value, key) => {
            playersName+= `ID: ${key} | ${value.toString()}\n`
        });

        return playersName;
    }

    public getPlayer(id: number): Player | undefined {
        return this.players.get(id);
    }

    public getRound(): number {
        return this.round;
    }

}