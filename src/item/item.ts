import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";

//export * as Equip from "./equip/equip";

import { game } from "../main";

export * as Food from "./food";
import * as Buff from "../buff";



export class Item extends Utils.Thing{
    
    value: number;    
    weight: number; 
    db: number; DB: number;
    owner: any;
    
    /**
	 * @class 物品类
	 */
    constructor() {
        super();
        this.db = 1;
        this.ch = "。";
        this.color = "#fff";
    }
    // 磨损 
    abrasion(d: number) {
        this.db -= d;
        if (this.db <= 0) {
            this.drop();
        }
    }
    // 修复
    fix(d: number) {
        this.db = this.DB;        
    }    
    // 丢弃
    drop() {
        if (this.owner) {
            let idx = this.owner.inventory.items.findIndex((e: Item) => e==this);            
            this.owner.inventory.items.splice(idx, 1);                        
            this.owner = null;
        }
    }

    // 拿走
    take(taker: Creature.Creature) {
        if (this.owner) {
            let idx = this.owner.inventory.items.findIndex((e: Item) => e==this);            
            this.owner.inventory.items.splice(idx, 1);                                    
        }
        taker.logs.notify(taker.name + " 從 " + this.owner.name + " 身上拿走了 " + this.name);        
        taker.inventory.push(this);
    }    
} 


export class Equip extends Item {
    equipped: boolean;    
    buff: Buff.Buff;

    take(taker: Creature.Creature) {
        if (this.equipped) this.unequip();
        super.take(taker);
    }
    drop() {
        if (this.equipped) this.unequip();
        super.drop();        
    }
    unequip() {
        this.buff.remove();
        this.owner.weapon = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.weapon != null) {
            this.owner.weapon.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.weapon = this;
        this.equipped = true;        
    }
    use() {
        if (this.equipped) {
            this.unequip();
        } else {
            this.equip();
        }
        if (this.owner == game.player) game.draw();
    }
    constructor() {
        super();
    }
}

export class Accessory extends Equip {        
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

        let b = new Buff.Buff();
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

        let b = new Buff.Buff();
        b.name = "魔法戒指";                
        b.mp = 3;
        b.description = "這個單位裝備了魔法戒指\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}


export class Armor extends Equip {            
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

        let b = new Buff.Buff();
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

        let b = new Buff.Buff();
        b.name = "輕甲";                
        b.def = 1;
        b.description = "這個單位裝備了輕甲\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}


export * as Weapon from "./weapon";
