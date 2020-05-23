import * as ROT from "rot-js";
import * as inventory from "./inventory";
import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";
import { game } from "../main";
import * as Item from "./item";
import * as Buff from "../buff";

// 食物
// 食物通常是可以更廉价的恢复方案，
// 但是需要花费更长的时间食用，且会占据饱腹感，太饱则无法产生效果。

export class Food extends Item.Item {
    hp: number;
    mp: number;
    sp: number;
    /**
	 * @class 食物
	 */    
    constructor() {
        super();
        this.db = 2; this.DB = 2;
    }
    eat() {
        this.db -= 1;
        let hp = this.owner.hp_healing(Utils.rand(this.hp));
        let mp = this.owner.mp_healing(Utils.rand(this.mp));
        let sp = this.owner.sp_healing(Utils.rand(this.sp));

        let logs = this.owner.name + " 吃了一口 " + this.name + "\n";

        if (hp > 0 || mp > 0 || sp > 0) {
            logs += "恢復了";
            if (hp > 0) logs += " " + hp + " 點生命";
            if (mp > 0) logs += " " + mp + " 點魔法";
            if (sp > 0) logs += " " + sp + " 點體力";
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
        this.hp = 4;
        this.mp = 2;
        this.sp = 2;
        this.description = "一個蘋果";
    }
}

export class Banana extends Food {    
    eat() {
        super.eat();
        game.SE.playSE("吃.wav");
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "香蕉";
        this.ch = "o";
        this.color = "#ee4";        
        this.hp = 2;
        this.mp = 4;
        this.sp = 2;
        this.description = "一個香蕉";
    }
}

export class Orange extends Food {    
    eat() {
        super.eat();
        game.SE.playSE("吃.wav");
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "橘子";
        this.ch = "o";
        this.color = "#ee4";        
        this.hp = 1;
        this.mp = 1;
        this.sp = 3;
        this.description = "一個橘子";
    }
}

export class Drink extends Food {
    eat() {
        super.eat();
        game.SE.playSE("吃.wav");
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "水";
        this.ch = "u";
        this.color = "#ee4";                
        this.description = "一瓶水";
    }
}

export class Cola extends Drink {    
    eat() {
        super.eat();
        game.SE.playSE("吃.wav");
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "可乐";        
        this.color = "#f45";
        this.hp = 5;
        this.mp = 5;
        this.sp = 5;
        this.description = "一瓶可乐";
    }
}