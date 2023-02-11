import {IDice} from "../interfaces/IDice";

export class DiceSingleton implements IDice {
    private static instance: DiceSingleton;
    private faces: number;

    private constructor(){
        this.faces = 12;
    }

    public static getInstance(): DiceSingleton {
        if(this.instance == null)
            this.instance = new DiceSingleton();
        return this.instance;
    }

    public getNumber(): number {
        const randomNumber: number = Math.floor(Math.random()*this.faces+1);
        return randomNumber;
    }
}