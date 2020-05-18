import { Sword, Shield } from "../inventory";
import { Enemy, Creature } from "../creature";
import { hostile } from "../AI/hostile";
import { game, rand, dice } from "../main";

export class Undead extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "骷髅";
        this.ch = "骷";
        this.color = "#eee"; 
        this.z = 1;        
        this.act = hostile.bind(this);
        this.str = 5; this.dex = 5; this.modify_con(5);
        this.wis = 5; this.cha = 5; this.modify_int(5);
    }
    get_atk() {
        return dice(this.str) + dice(this.str);
    }    
}

export class Skeleton extends Undead {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "骷髅";
        this.ch = "骷";
        this.color = "#eee";        
        this.z = 1;
        let sword = new Sword();
        this.inventory.push(sword);
        sword.equip();
        let shield = new Shield();
        this.inventory.push(shield);
        shield.equip();
    }
}

export class Walking_Dead extends Undead {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "行尸";
        this.ch = "尸";
        this.color = "#23c";
        this.z = 1;
        this.modify_con(2);
        let sword = new Sword();
        this.inventory.push(sword);
        sword.equip();
        let shield = new Shield();
        this.inventory.push(shield);
        shield.equip();
    }
}