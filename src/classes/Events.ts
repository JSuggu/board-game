import { IEffect } from "../interfaces/IEffect";
import { AddHtmlElements } from "./AddHtmlElements";
import { Box } from "./Box";
import { AdvanceStrategy } from "./effects/buff/AdvanceStrategy";
import { ExtraRollStrategy } from "./effects/buff/ExtraRollStrategy";
import { BackStrategy } from "./effects/debuff/BackStrategy";
import { LoseTurnStrategy } from "./effects/debuff/LoseTurnStrategy";
import { BubbleItemStrategy } from "./effects/item/BubbleItemStrategy";
import { HookItemStrategy } from "./effects/item/HookItemStrategy";
import { ShieldItemStrategy } from "./effects/item/ShieldItemStrategy";
import { Player } from "./Player";

export abstract class Events {

    //FUNCION PARA GENERAR UN NUMERO RANDOM DEPENDIENDO DE LA CANTIDAD DE EFECTOS
    private static generateRandomNumberForEffects (effectType: string): number{
        const effectsMap: Map<string, number> = new Map<string, number>();
        effectsMap.set("buff", 2);
        effectsMap.set("debuff", 2);
        effectsMap.set("predict", 1);
        effectsMap.set("item", 3);

        const getAmountFromEffect = effectsMap.get(effectType) || -1;
        const randomNumber: number = Math.floor(Math.random()*getAmountFromEffect+1);
        return randomNumber;
    }

    public static applyEffect(currentPlayer: Player, boxes: Map<number, Box>): IEffect | undefined{
        const playerPosition: number = currentPlayer.getCurrentPostion();
        const actualBox: Box = <Box> boxes.get(playerPosition);
        const boxEffect: string = actualBox.getEffect();

        let result: number;

        if(boxEffect == "buff"){
            result = this.generateRandomNumberForEffects("buff");
            if(result == 1)
                return new AdvanceStrategy();
            if(result == 2)
                return new ExtraRollStrategy();
        }

        if(boxEffect == "debuff"){
            result = this.generateRandomNumberForEffects("debuff");
            if(result == 1)
                return new BackStrategy();
            if(result == 2)
                return new LoseTurnStrategy();
        }

        if(boxEffect == "item"){
            result = this.generateRandomNumberForEffects("item");
            if(result == 1)
                return new HookItemStrategy();
            if(result == 2)
                return new BubbleItemStrategy();
            if(result == 3)
                return new ShieldItemStrategy();
        }

        return undefined;
    }

    //Si el jugador posee items se le pregunta si quiere usarlos y contra que enemigo quiere usarlo
    public static itemUsed(currentPlayer: Player, enemyPlayer: Player, itemChosen: string): boolean{
        const currentPlayerItems: Map<string, IEffect> = currentPlayer.getAllItems();

        if(!currentPlayerItems.has(itemChosen))
            return false;

        const enemyPlayerName = enemyPlayer.getName();

        AddHtmlElements.spanToMatchInfo(`has usado el objeto ${itemChosen}`);

        if(itemChosen == "bubble"){
            const bubble: BubbleItemStrategy = <BubbleItemStrategy> currentPlayerItems.get("bubble");
            
            if(enemyPlayer.getIsBuffed()){
                AddHtmlElements.spanToMatchInfo(`El ${enemyPlayerName} tenia un escudo y no se aplico el efecto`);
                currentPlayer.removeItem("bubble");
                enemyPlayer.updateBuff(false);
                return true;
            }

            bubble.use(enemyPlayer);
            currentPlayer.removeItem("bubble");  
            return true;              
        }

        if(itemChosen == "hook"){
            const hook: HookItemStrategy = <HookItemStrategy> currentPlayerItems.get("hook");
            
            if(enemyPlayer.getIsBuffed()){
                AddHtmlElements.spanToMatchInfo(`El ${enemyPlayerName} tenia un escudo y no se aplico el efecto`);
                currentPlayer.removeItem("hook");
                enemyPlayer.updateBuff(false);
                return true;
            }

            hook.use(enemyPlayer);
            currentPlayer.removeItem("hook"); 
            return true;               
        }

        if(itemChosen == "shield"){
            const shield: ShieldItemStrategy = <ShieldItemStrategy> currentPlayerItems.get("shield");
            
            if(enemyPlayer.getIsBuffed()){
                AddHtmlElements.spanToMatchInfo(`El ${enemyPlayerName} tenia un escudo y no se aplico el efecto`);
                currentPlayer.removeItem("shield");
                enemyPlayer.updateBuff(false);
                return true;
            }

            shield.use(enemyPlayer);
            currentPlayer.removeItem("shield");
            return true;           
        }

        return false;
    }

    public static finishGame (actualPlayer: Player): boolean {
        if(actualPlayer.getCurrentPostion() >= 120)
            return true;
        return false;
    }

}