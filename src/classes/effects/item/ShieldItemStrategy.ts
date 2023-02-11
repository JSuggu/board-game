import { IEffect } from "../../../interfaces/IEffect";
import { IItem } from "../../../interfaces/IItem";
import { AddHtmlElements } from "../../AddHtmlElements";
import { Player } from "../../Player";

export class ShieldItemStrategy implements IEffect, IItem {
    
    public activeEffect(player: Player): void {
        player.addItem("shield", new ShieldItemStrategy);
        AddHtmlElements.spanToMatchInfo(`Item "Shield" añadido a ${player.getName()}`);
    }

    public use(player: Player): void {
        player.updateBuff(true);
        AddHtmlElements.spanToMatchInfo(`El jugador uso el "Shield" en ${player.getName()}`);
    }
}