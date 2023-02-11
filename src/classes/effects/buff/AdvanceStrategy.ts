import { IEffect } from "../../../interfaces/IEffect";
import { AddHtmlElements } from "../../AddHtmlElements";
import { Player } from "../../Player";

export class AdvanceStrategy implements IEffect {
    public activeEffect(player: Player): void {
        const playerName: string = player.getName();
        AddHtmlElements.spanToMatchInfo(`${playerName} avanza 3 casilleros mas`);
        const result: number = player.getCurrentPostion() + 3;
        player.move(result);
        AddHtmlElements.spanToMatchInfo(`La posicion de ${playerName} ahora es: ${result}`);
    }
}