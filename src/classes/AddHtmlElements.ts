export abstract class AddHtmlElements {
    public static spanToMatchInfo(text: string): void{
        const matchInfoElement: Element = <Element>document.querySelector(".match-info");
        const spanElement = document.createElement("span");
        spanElement.innerHTML = text;
        matchInfoElement.appendChild(spanElement);
    }
}