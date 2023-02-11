export class Box {
    private effect: string;

    constructor(effect = "empty") {
        this.effect = effect;
    }

    public getEffect(): string {
        return this.effect;
    }
}