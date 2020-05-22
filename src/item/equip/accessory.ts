import * as Utils from "../../utils/utils";
import { Equip } from "./equip";
import { Buff } from "../../buff";

let dice = Utils.dice;

export class Accessory extends Equip {
    cd: number;    
    parse_atk() : string {
        let z = "";        
        for (let a in this.buff.atk) {
            z += this.buff.atk[a] + "d" + a + "\n";
        }
        return z;
    }
    unequip() {
        this.buff.remove();
        this.owner.equipment.accessory = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.equipment.accessory != null) {
            this.owner.equipment.accessory.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.equipment.accessory = this;
        this.equipped = true;        
    }   
    constructor() {
        super();
        this.name = "飾品";        
        this.description = "一件飾品";  
    }    
}

export class Necklace extends Accessory {
    constructor() {
        super();
        this.name = "藍寶石項鏈";
        this.description = "雕刻有美人女在石礁上唱歌的藍寶石項鏈";          
    }
}

export class HP_Ring extends Accessory {
    constructor() {
        super();
        this.name = "生命戒指";
        this.description = "能夠激發生命潛力的戒指\n";

        let b = new Buff();
        b.name = "生命戒指";                
        b.hp = 3;
        b.description = "這個單位裝備了生命戒指\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();       
    }
}

export class MP_Ring extends Accessory {
    constructor() {
        super();
        this.name = "魔法戒指";
        this.description = "能夠增加法術潛力的戒指\n";

        let b = new Buff();
        b.name = "魔法戒指";                
        b.mp = 3;
        b.description = "這個單位裝備了魔法戒指\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}