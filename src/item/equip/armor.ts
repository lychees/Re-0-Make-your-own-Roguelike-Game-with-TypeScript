import * as Utils from "../../utils/utils";
import { Equip } from "./equip";
import { Buff } from "../../buff";

let dice = Utils.dice;

export class Armor extends Equip {
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
        this.owner.equipment.armor = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.equipment.armor != null) {
            this.owner.equipment.armor.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.equipment.armor = this;
        this.equipped = true;        
    }
    constructor() {
        super();        
        this.name = "護甲";        
        this.description = "一件護甲";      
    }      
}

export class Shield extends Armor {
    constructor() {
        super();
        this.name = "盾牌";
        this.description = "提供輕便防御的盾牌\n";

        let b = new Buff();
        b.name = "盾牌";                
        b.def = 1;
        b.description = "這個單位裝備了盾牌\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}

export class Light_Armor extends Armor {
    constructor() {
        super();
        this.name = "輕甲";
        this.description = "提供輕便防禦的護甲\n";

        let b = new Buff();
        b.name = "輕甲";                
        b.def = 1;
        b.description = "這個單位裝備了輕甲\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}