import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";

//export * as Equip from "./equip/equip";

import { game, rand, dice } from "../main";

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






export class Weapon extends Equip {
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
        this.owner.equipment.weapon = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.equipment.weapon != null) {
            this.owner.equipment.weapon.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.equipment.weapon = this;
        this.equipped = true;        
    }    
    constructor() {
        super();        
        this.cd = 20;
        this.name = "武器";        
        this.description = "一把武器";      
    }    
}




export class Axes extends Weapon {    
    constructor() {
        super();        
        this.cd = 30;
        this.name = "斧";
        this.ch = "斧";
        this.description = "一把斧頭\n";

        let b = new Buff.Buff();
        b.name = "斧";
        b.hp = 1;
        b.atk['d13'] = 1;
        b.description = "這個單位裝備了一把斧頭\n";
        b.description += b.parse();
        this.buff = b;        

        if (dice(3) <= 2) {
            this.name += ' 鋒利的';
            b.atk['d1'] = dice(3);
        }
        
        if (dice(3) <= 2) {
            this.name += ' 狂戰士的';
            b.atk['d2'] = dice(5);
        }

        if (dice(3) <= 2) {
            this.name += ' 矮人的';
            b.hp = dice(5);
        }

        this.description += b.parse();
    }    
}

export class Sword extends Weapon {
    constructor() {
        super();        
        this.cd = 30;
        this.name = "短劍";
        this.ch = "劍";
        this.description = "一把短劍\n";
        
        //this.ability = new Ability();
        //this.ability.name = this.name;

        let b = new Buff.Buff();
        b.name = "短劍";        
        b.atk['d6'] = 2;
        b.description = "這個單位裝備了一把短劍\n";
        b.description += b.parse();
        this.buff = b;

        if (dice(3) <= 2) {
            this.name += ' 鋒利的';
            b.atk['d1'] = dice(3);
        }

        if (dice(3) <= 2) {
            this.name += ' 矮人的';
            b.hp = dice(5);
        }        

        this.description += b.parse();
    }        
}

export class Water_Mirror extends Sword {
    constructor() {                
        super();
        this.name = "水鏡";
        this.description = "少女慣用的愛劍";        
    }
};

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



