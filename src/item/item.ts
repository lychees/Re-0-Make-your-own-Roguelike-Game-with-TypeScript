import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";

//export * as Equip from "./equip/equip";

import { game } from "../main";

export * as Food from "./food";
import * as Buff from "../buff";
import { Equip } from "./equip/equip";

export class Item extends Utils.Thing {
    
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
export * as Equip from "./equip/equip";