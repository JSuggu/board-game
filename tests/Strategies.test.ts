import { AdvanceStrategy } from "../src/classes/effects/buff/AdvanceStrategy";
import { ExtraRollStrategy } from "../src/classes/effects/buff/ExtraRollStrategy";
import { BackStrategy } from "../src/classes/effects/debuff/BackStrategy";
import { LoseTurnStrategy } from "../src/classes/effects/debuff/LoseTurnStrategy";
import { BubbleItemStrategy } from "../src/classes/effects/item/BubbleItemStrategy";
import { HookItemStrategy } from "../src/classes/effects/item/HookItemStrategy";
import { ShieldItemStrategy } from "../src/classes/effects/item/ShieldItemStrategy";
import { Player } from "../src/classes/Player";

const player1 = new Player("player1", 1);

const player2 = new Player("player2", 2);
player2.move(50);

const enemyPlayer = new Player("player3", 3);
enemyPlayer.move(30);

const advanceStrategy: AdvanceStrategy = new AdvanceStrategy();
const extraRollStrategy: ExtraRollStrategy = new ExtraRollStrategy();
const backStrategy: BackStrategy = new BackStrategy();
const loseTurnStrategy: LoseTurnStrategy = new LoseTurnStrategy();
const bubbleItemStrategy: BubbleItemStrategy = new BubbleItemStrategy();
const hookItemStrategy: HookItemStrategy = new HookItemStrategy();
const shieldItemStrategy: ShieldItemStrategy = new ShieldItemStrategy();

describe("Strategies", () => {
    test("define AdvanceStrategy activeEffect()", () =>{
        const playerPositionWouldBe = player1.getCurrentPostion() + 3;
        advanceStrategy.activeEffect(player1);

        expect(player1.getCurrentPostion()).toBe(playerPositionWouldBe);
    });

    test("define extraRollStrategy activeEffect()", () =>{
        const playerActualPosition = player1.getCurrentPostion();
        extraRollStrategy.activeEffect(player1);

        expect(player1.getCurrentPostion()).toBeGreaterThan(playerActualPosition);
    });

    test("define backStrategy activeEffect()", () =>{
        const playerPositionWouldBe = player2.getCurrentPostion() -3;
        backStrategy.activeEffect(player2);

        expect(player2.getCurrentPostion()).toBe(playerPositionWouldBe);
    });

    test("define loseTurnStrategy activeEffect()", () =>{
        loseTurnStrategy.activeEffect(player1);

        expect(player1.getIsdebuffed).toBeTruthy();
    });

    test("define bubbleItemStrategy activeEffect()", () =>{
        bubbleItemStrategy.activeEffect(player1);
        const playerItems = player1.getAllItems().keys();

        expect(playerItems).toContain("bubble");
    });

    test("define hookItemStrategy activeEffect()", () =>{
        hookItemStrategy.activeEffect(player2);
        const playerItems = player2.getAllItems().keys();

        expect(playerItems).toContain("hook");
    });

    test("define shieldItemStrategy activeEffect()", () =>{
        shieldItemStrategy.activeEffect(player1);
        const playerItems = player1.getAllItems().keys();

        expect(playerItems).toContain("shield");
    });

    test("define bubbleItemStrategy use()", () =>{
        bubbleItemStrategy.use(enemyPlayer);

        expect(enemyPlayer.getIsdebuffed).toBeTruthy();
    });

    test("define hookItemStrategy use()", () =>{
        const enemyPlayerPositionWouldBe = enemyPlayer.getCurrentPostion() - 7;
        hookItemStrategy.use(enemyPlayer);

        expect(enemyPlayer.getCurrentPostion()).toBe(enemyPlayerPositionWouldBe);
    });

    test("define shieldItemStrategy use()", () =>{
        shieldItemStrategy.use(enemyPlayer);

        expect(enemyPlayer.getIsBuffed).toBeTruthy();
    });
})
