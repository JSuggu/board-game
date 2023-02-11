import { IEffect } from "../../../interfaces/IEffect";
import { IItem } from "../../../interfaces/IItem";
import { AddHtmlElements } from "../../AddHtmlElements";
import { Player } from "../../Player";

export class HookItemStrategy implements IEffect, IItem {

    public activeEffect(player: Player): void {
        player.addItem("hook", new HookItemStrategy());
        AddHtmlElements.spanToMatchInfo(`Item "Hook" añadido a ${player.getName()}`);
    }

    public use(player: Player): void {
        const enemyPosition: number = player.getCurrentPostion();
        player.move(enemyPosition - 7);
        AddHtmlElements.spanToMatchInfo(`El jugador uso el "Hook" contra ${player.getName()} y lo hizo retroceder 7 casilleros`);
    }
}