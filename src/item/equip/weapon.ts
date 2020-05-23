import * as Utils from "../../utils/utils";
import { Equip } from "./equip";
import { Buff } from "../../buff";

let dice = Utils.dice;

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
        this.name = "武器";        
        this.DB = 40;
        this.cd = 4000;
    }
}


function gen_suffix() {
    
    let b = this.buff;

    let t = dice(10);
    if (t >= 8) {
        this.name += ' 鋒利的';
        b.atk['d1'] += Utils.dice(3);
    } else if (t <= 3) {
        this.name += ' 鈍的';
        b.atk['d1'] -= Utils.dice(3);
    }

    t = dice(10);
    if (t >= 7) {        
        this.DB += dice(10);    
    } else if (t <= 4) {
        this.DB -= dice(10);    
    }

    if (Utils.dice(3) <= 2) {
        this.name += ' 矮人的';
        b.hp += Utils.dice(5);
    } else {
        if (Utils.dice(3) <= 2) {
            this.name += ' 狂戰士的';
            b.atk['d2'] += Utils.dice(5);
        }
    }

    t = Utils.dice(6);
    if (t == 1) {
        this.name += ' 木製的';
        b.atk['d1'] -= dice(6);
        this.weight = Math.floor(this.weight/5);
        this.DB = Math.floor(this.DB/5);
        this.value = Math.floor(this.value/10);        
    } if (t == 2) {
        this.name += ' 青銅的';
        b.atk['d1'] -= dice(2);
        this.weight = Math.floor(this.weight/2);
        this.DB = Math.floor(this.DB/2);
        this.value = Math.floor(this.value/2);        
    } else if (t == 3) {
        this.name += ' 鐵的';
    } else if (t == 4) {
        this.name += ' 鋼的';
        b.atk['d1'] += dice(6);
        this.DB = Math.floor(this.DB*1.2);
        this.value = Math.floor(this.value*1.2);        
    } else if (t == 5) {
        this.name += ' 銀的';
        b.atk['d6'] += dice(4);
        this.DB = Math.floor(this.DB*1.4);
        this.value = Math.floor(this.value*10);
    } else if (t == 6) {
        this.name += ' 玄鐵的';
        b.atk['d8'] += dice(6);
        this.DB = Math.floor(this.DB*5);
        this.value = Math.floor(this.value*5);
    }
}





export class Sword extends Weapon {
    constructor() {
        super();        
        this.name = "短劍";
        this.ch = "༒";
        this.cd = 30;
        this.weight = 10000;
        this.value = 1000;
        this.description = "一把短劍\n";

        let b = new Buff();
        b.name = "短劍";        
        b.atk['d6'] = 2;
        b.description = "這個單位裝備了一把短劍\n";
        b.description += b.parse();
        this.buff = b;
        
        gen_suffix.bind(this)();
        this.db = dice(this.DB);        
        this.description += b.parse();
    }        
}

export class Long_Sword extends Sword {
    constructor() {
        super();                
        this.name = "長劍";
        this.description = "一把長劍\n";
        this.weight = 12000;        

        let b = new Buff();
        b.name = "長劍";
        b.atk['d11'] = 1;
        b.description = "這個單位裝備了一把長劍\n";
        b.description += b.parse();
        this.buff = b;

        this.value = 1200;

        gen_suffix.bind(this)();

        this.db = dice(this.DB);
        this.description += b.parse();
    }        
}

export class Board_Sword extends Sword {
    constructor() {
        super();                
        this.name = "闊劍";
        this.description = "一把闊劍\n";
        this.weight = 20000;
        this.value = 2000;
        
        let b = new Buff();
        b.name = "闊";
        b.atk['d20'] = 1;
        b.description = "這個單位裝備了一把闊劍\n";
        b.description += b.parse();
        this.buff = b;
                
        gen_suffix.bind(this)();
        this.db = dice(this.DB);
        this.description += b.parse();
    }        
}


export class Water_Mirror extends Sword {
    constructor() {                
        super();
        this.name = "水鏡";
        this.description = "少女慣用的愛劍";        
    }
}


export class Spear extends Weapon {    
    constructor() {
        super();           
        this.name = "|";
        this.ch = "槍";
        this.description = "一把槍\n";
        this.weight = 20000;    
        this.value = 1000;      
        this.cd = 40; 

        let b = new Buff();
        b.name = "槍";
        b.hp = 1;
        b.atk['d30'] = 1;
        b.description = "這個單位裝備了一把槍\n";
        b.description += b.parse();
        this.buff = b;        

        gen_suffix.bind(this)();
        this.description += b.parse();
    }    
}




export class Axes extends Weapon {    
    constructor() {
        super();        
        this.cd = 30;
        this.name = "斧";
        this.ch = "斧";
        this.description = "一把斧頭\n";

        let b = new Buff();
        b.name = "斧";
        b.hp = 1;
        b.atk['d13'] = 1;
        b.description = "這個單位裝備了一把斧頭\n";
        b.description += b.parse();
        this.buff = b;        

        gen_suffix.bind(this)();
        this.description += b.parse();
    }    
}



export class Dagger extends Weapon {    
	/**
	 * @class 匕首
	 * @param 匕首是快速且致命的武器。
	 */
    constructor() {
        super();        
        this.name = "匕首";
        this.ch = "🗡️";
        this.description = "一把匕首\n";
        this.weight = 2000;
        this.value = 500;
        this.cd = 10;

        let b = new Buff();
        b.name = "匕首";
        b.atk['d2'] = 2;
        b.description = "這個單位裝備了一把匕首\n";
        b.description += b.parse();
        this.buff = b;        

        gen_suffix.bind(this)();
        this.description += b.parse();
    }    
}


export class Dirk extends Dagger {    
    constructor() {
        super(); 
        this.name = "长匕首";
        this.ch = "🗡️";
        this.description = "一把長匕首\n";
        this.weight = 2000;
        this.value = 500;
        this.cd = 15;

        let b = new Buff();
        b.name = this.name;
        b.atk['d3'] = 2;
        b.description = "這個單位裝備了一把" + this.name + "\n";
        b.description += b.parse();
        this.buff = b;        

        gen_suffix.bind(this)();
        this.description += b.parse();
    }    
}


