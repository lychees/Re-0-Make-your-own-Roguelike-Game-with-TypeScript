import * as ROT from "rot-js";
import * as inventory from "./inventory";
import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";
import { game, rand, dice } from "../main";

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

// 食物
// 食物通常是可以更廉价的恢复方案，
// 但是需要花费更长的时间食用，且会占据饱腹感，太饱则无法产生效果。

export class Food extends Item {
    hp: number;
    mp: number;
    sp: number;
    /**
	 * @class 食物
	 */    
    constructor() {
        super();
    }
    eat() {
        this.db -= 1;
        let hp = this.owner.hp_healing(Math.floor(ROT.RNG.getUniform() * this.hp / this.DB));
        let mp = this.owner.mp_healing(Math.floor(ROT.RNG.getUniform() * this.mp / this.DB));
        let sp = this.owner.sp_healing(Math.floor(ROT.RNG.getUniform() * this.sp / this.DB));

        let logs = this.owner.name + " 吃了一口 " + this.name + "\n";

        if (hp > 0 || mp > 0 || sp > 0) {
            logs += "恢復了";
            if (hp > 0) logs += " " + hp + "點生命";
            if (mp > 0) logs += " " + mp + "點魔法";
            if (sp > 0) logs += " " + sp + "點體力";
            logs += "\n";   
        }
        this.owner.logs.notify(logs);

        if (this.db <= 0) {
            this.drop();
        }
    }
}

export class Apple extends Food {    
    eat() {
        super.eat();
        game.SE.playSE("吃.wav");
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "蘋果";
        this.ch = "o";
        this.color = "#f22";        
        this.hp = 3;
        this.mp = 1;
        this.sp = 1;
        this.db = 2;        
        this.description = "一個蘋果";
    }
}