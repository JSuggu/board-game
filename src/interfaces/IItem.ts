import { Player } from "../classes/Player";

export interface IItem {
    use(player: Player): void;
}