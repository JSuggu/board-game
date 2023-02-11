import { IEffect } from "../../../interfaces/IEffect";
import { AddHtmlElements } from "../../AddHtmlElements";
import { Player } from "../../Player";

export class LoseTurnStrategy implements IEffect{

    public activeEffect(player: Player): void {
        AddHtmlElements.spanToMatchInfo(`${player.getName()} pierde su siguente turno`);
        player.updateDebuff(true);
    }
}