import { IEffect } from "../../../interfaces/IEffect";
import { AddHtmlElements } from "../../AddHtmlElements";
import { DiceSingleton } from "../../DiceSingleton"
import { Player } from "../../Player";

export class ExtraRollStrategy implements IEffect{
    private dice: DiceSingleton;

    constructor(){
        this.dice = DiceSingleton.getInstance();
    }

    public activeEffect(player: Player): void {
        AddHtmlElements.spanToMatchInfo(`${player.getName()} puede lanzar nuevamente su dado`);
        const result: number = player.pullDice(this.dice);
        player.move(player.getCurrentPostion() + result);
    }
}