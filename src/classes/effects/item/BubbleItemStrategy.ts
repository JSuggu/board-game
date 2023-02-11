import { IEffect } from "../../../interfaces/IEffect";
import { IItem } from "../../../interfaces/IItem"
import { AddHtmlElements } from "../../AddHtmlElements";
import { Player } from "../../Player";

export class BubbleItemStrategy implements IEffect, IItem {

    public activeEffect(player: Player): void {
        player.addItem("bubble", new BubbleItemStrategy());
        AddHtmlElements.spanToMatchInfo(`Item "Bubble" añadido a ${player.getName()}`);
    }

    public use(player: Player): void {
        player.updateDebuff(true);
        AddHtmlElements.spanToMatchInfo(`El jugador uso "Bubble" contra ${player.getName()} y perdera su siguiente turno`);
    }
}