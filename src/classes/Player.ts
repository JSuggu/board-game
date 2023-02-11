import { IEffect } from "../interfaces/IEffect";
import { AddHtmlElements } from "./AddHtmlElements";
import { DiceSingleton } from "./DiceSingleton";

export class Player {
    private id: string;
    private name: string;
    private currentPosition: number;
    private isBuffed: boolean;
    private isDebuffed: boolean;
    private items:Map<string, IEffect>;

    constructor(name: string, id: number){
        this.id = `p${id}`;
        this.name = name;
        this.currentPosition = 0;
        this.isBuffed = false;
        this.isDebuffed = false;
        this.items = new Map<string, IEffect>();
    }

    public pullDice (dice: DiceSingleton): number{
        AddHtmlElements.spanToMatchInfo(`El jugador ${this.name} lanza sus dados...`);
        const result: number = dice.getNumber();
        AddHtmlElements.spanToMatchInfo(`Obtuviste un ${result}`);
        return result;
    }

    public move(number: number): void{
        this.currentPosition = number;
        AddHtmlElements.spanToMatchInfo(`la posicion ahora es ${number}`);
    }

    public addItem(name: string, effect: IEffect): void {
        this.items.set(name, effect);
    }

    public getItem(name: string): IEffect | undefined {
        return this.items.get(name);
    }

    public getAllItems(): Map<string, IEffect> {
        return this.items;
    }

    public getAllItemsName(): string {
        const IterableKeys = this.items.keys();
        let itemsName = "";
        for(let itemName of IterableKeys){
            itemsName += `${itemName}, `
        }

        return itemsName;
    }

    public removeItem(name: string): void {
        this.items.delete(name);
    }

    public updateBuff(buffed: boolean): void {
        this.isBuffed = buffed;
    }

    public updateDebuff(debuffed: boolean): void {
        this.isDebuffed = debuffed;
    }

    //GETTERS
    public getId(): string {
        return this.id;
    }

    public getName(): string{
        return this.name;
    }

    public getCurrentPostion(): number {
        return this.currentPosition;
    }

    public getIsBuffed(): boolean {
        return this.isBuffed;
    }

    public getIsdebuffed(): boolean {
        return this.isDebuffed;
    }

    public toString(): string {
        return `Nombre: ${this.name} | posicion: ${this.currentPosition}`;
    }
}
