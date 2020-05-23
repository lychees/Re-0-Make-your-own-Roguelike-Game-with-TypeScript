
import { Creature } from "./creature";
import * as Buff from "../buff";
import * as Item from "../item/item";
import { hostile } from "../AI/hostile";

export class Elf extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "精靈";
        this.ch = "精";
        (new Buff.Elf_Race()).append(this);
    }
}

export class Elf_Guard extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "衛兵";
        this.ch = "衛";
        this.color = "#c11";        
        this.z = 3;
        /*let t = new Item.Equip.Weapon.Sword();
        this.inventory.push(t);
        t.equip();*/
        this.act = hostile.bind(this);
    }
}

export class Lee extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "李貝爾";
        this.ch = "李";
        this.color = "#ca3";        
        this.z = 3;
        /*let t = new Item.Equip.Weapon.Sword();
        this.inventory.push(t);
        t.equip();*/
    }
}

export class Isabella extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "伊莎貝拉";
        this.ch = "伊";
        this.color = "#0be";        
        this.z = 100;

        (new Buff.Dex_Talent(1)).append(this);
        (new Buff.Int_Talent(1)).append(this);              
        (new Buff.MP_Talent(10)).append(this);        
        (new Buff.Sickly(1)).append(this);
        
        
        
    }
}