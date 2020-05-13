import { game } from "./main";

export class Item {

}

export class Apple extends Item {
    eat() {
        game.SE.playSE("Wolf RPG Maker/[Effect]Healing3_default.ogg");           
    }
}

export class Inventory {
    items: Array<any>;

    constructor() {
        this.items = []; 
    }

    push(item: any) {
        this.items.push(item);
    }

    draw() {        
        console.log(this.items);
    }

    handleEvent(e) {
        let code = e.keyCode;
        if (code == 49) {
            this.items[0].use();
        }
        game.SE.playSE("Wolf RPG Maker/[01S]cancel.ogg");
        window.removeEventListener("keydown", this);
        window.addEventListener("keydown", game.player);        
    }

}