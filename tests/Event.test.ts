import { Events } from "../src/classes/Events"; 
import { Player } from "../src/classes/Player";
import { Box } from "../src/classes/Box";
import { BubbleItemStrategy } from "../src/classes/effects/item/BubbleItemStrategy";
import { ShieldItemStrategy } from "../src/classes/effects/item/ShieldItemStrategy";

const player1 = new Player("player1", 1);

const player2 = new Player("player2", 2);
player2.move(1);
player2.addItem("bubble", new BubbleItemStrategy());

const player3 = new Player("player3", 3);
player3.move(2);

const player4 = new Player("player4", 4);
player4.move(3);
player4.addItem("shield", new ShieldItemStrategy());

const player5 = new Player("player5", 5);
player5.move(125);

const boxesMap = new Map<number,Box>([[0, new Box("empty")], [1, new Box("buff")], [2, new Box("debuff")], [3, new Box("item")]]);


describe("Events", () => {
    test("define applyEffect() => undefined", () => {
        const result = Events.applyEffect(player1, boxesMap);
        expect(result).toBeUndefined();
    });

    test("define applyEffect() => buff object IEffect", () => {
        const result = Events.applyEffect(player2, boxesMap);
        expect(typeof result).toBe("object");
    });

    test("define applyEffect() => debuff object IEffect", () => {
        const result = Events.applyEffect(player3, boxesMap);
        expect(typeof result).toBe("object");

    });

    test("define applyEffect() => item object IEffect", () => {
        const result = Events.applyEffect(player4, boxesMap);
        expect(typeof result).toBe("object");
    });

    test("define itemUsed() => true", () => {
        const result = Events.itemUsed(player2, player3, "bubble");
        expect(result).toBeTruthy();
    });

    test("define itemUsed() => true", () => {
        const result = Events.itemUsed(player4, player4, "shield");
        expect(result).toBeTruthy();
    });

    test("define itemUsed() => false", () => {
        const result = Events.itemUsed(player2, player3, "hook");
        expect(result).toBeFalsy();
    });

    test("define finishGame() => false", () => {
        const result = Events.finishGame(player1);
        expect(result).toBeFalsy();
    });

    test("define finishGame() => true", () => {
        const result = Events.finishGame(player5);
        expect(result).toBeTruthy();
    });
});
