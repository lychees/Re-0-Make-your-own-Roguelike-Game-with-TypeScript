import * as Utils from "../utils/utils";
import { game } from "../main";
import * as Item from "./item";
import * as Buff from "../buff";

// 食物
// 食物通常是可以更廉价的恢复方案，
// 但是需要花费更长的时间食用，且会占据饱腹感，太饱则无法产生效果。

export class Potion extends Item.Item {
    hp: number;
    mp: number;
    sp: number;
    /**
	 * @class 食物
	 */    
    constructor() {
        super();
        this.db = 2; this.DB = 2;
        this.hp = 0; this.mp = 0; this.sp = 0;
    }
    eat() {        
        game.SE.playSE("Diablo/drink.wav");
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

export class HP_Potion extends Potion {    
    eat() {
        super.eat();
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "生命藥劑";
        this.ch = "o";
        this.color = "#f22";        
        this.hp = 10;
        this.description = "一瓶" + this.name;
    }
}

export class MP_Potion extends Potion {    
    eat() {
        super.eat();
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "魔法藥劑";
        this.ch = "o";
        this.color = "#f22";        
        this.mp = 10;
        this.description = "一瓶" + this.name;
    }
}

export class SP_Potion extends Potion {    
    eat() {
        super.eat();
    }
    use() {
        this.eat();
    }
    constructor() {
        super();
        this.name = "體力藥劑";
        this.ch = "o";
        this.color = "#f22";        
        this.sp = 5;
        this.description = "一瓶" + this.name;
    }
}