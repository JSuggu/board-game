import {Player} from "../classes/Player";

export interface IEffect{
    activeEffect(player: Player): void;
}