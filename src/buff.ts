import * as ROT from "rot-js";

import { game, rand, dice } from "./main";
import { add_shadow } from "./map";

import { Creature } from "./creature"

export function parse_atk(atk: any) {
    let z = "";
    for (let a in atk) {
        if (z != "") z += ", ";
        z += atk[a] > 0 ? "+" : "";
        z += atk[a] + a;
    }
    return z;
}

export class Buff {
    
    name: string;
    description: string;
    owner: any;
            
    atk: {};
    def: number;
    hp: number;
    mp: number;
    sp: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
    
    parse() : string {
        let z = [];
        z.push(this.parse_atk());
        z.push(this.parse_def());
        z.push(this.parse_hp());
        z.push(this.parse_mp());
        z.push(this.parse_sp());
        z.push(this.parse_str());
        z.push(this.parse_dex());
        z.push(this.parse_con());
        z.push(this.parse_int());
        z.push(this.parse_wis());
        z.push(this.parse_cha());        
        return z.filter(i => i !== "").join("\n");
    }

    parse_atk() : string {
        let z = parse_atk(this.atk);
        if (z == "") return z;
        z += " ATK";
        return z;
    }
    parse_def() : string {        
        if (this.def == 0) return "";
        return (this.def > 0 ? "+" : "") + this.def + " DEF";
    }
    parse_hp() : string {
        if (this.hp == 0) return "";
        return (this.hp > 0 ? "+" : "") + this.hp + " HP";
    }
    parse_mp() : string {
        if (this.mp == 0) return "";
        return (this.mp > 0 ? "+" : "") + this.mp + " MP";
    }
    parse_sp() : string {
        if (this.sp == 0) return "";
        return (this.sp > 0 ? "+" : "") + this.sp + " SP";
    }
    parse_str() : string {        
        if (this.str == 0) return "";
        return (this.str > 0 ? "+" : "") + this.str + " STR";
    }  
    parse_dex() : string {
        if (this.dex == 0) return "";
        return (this.dex > 0 ? "+" : "") + this.dex + " DEX";
    }      
    parse_con() : string {
        if (this.con == 0) return "";
        return (this.con > 0 ? "+" : "") + this.con + " CON";
    }            
    parse_int() : string {
        if (this.int == 0) return "";
        return (this.int > 0 ? "+" : "") + this.int + " INT";
    }
    parse_wis() : string {
        if (this.wis == 0) return "";
        return (this.wis > 0 ? "+" : "") + this.wis + " WIS";
    }            
    parse_cha() : string {
        if (this.cha == 0) return "";
        return (this.cha > 0 ? "+" : "") + this.cha + " CHA";
    }

    append(owner: any) {
        this.owner = owner;
        owner.buffs.push(this);
        
        owner.HP += this.hp; if (owner.hp > owner.HP) owner.hp = owner.HP;
        owner.MP += this.mp; if (owner.mp > owner.MP) owner.mp = owner.MP;
        owner.SP += this.sp; if (owner.sp > owner.SP) owner.sp = owner.SP;

        for(let a in this.atk) {
            if (owner.atk[a] == undefined) owner.atk[a] = 0;
            owner.atk[a] += this.atk[a];
        }
        owner.def += this.def;

        owner.str += this.str;
        owner.dex += this.dex;
        owner.con += this.con;
        owner.int += this.str;
        owner.wis += this.wis;
        owner.cha += this.cha;                
    }
    remove() {
        let owner = this.owner;
        let idx = owner.buffs.findIndex((a) => a == this);        
        owner.buffs.splice(idx, 1);
        owner.HP -= this.hp; if (owner.hp > owner.HP) owner.hp = owner.HP;
        owner.MP -= this.mp; if (owner.mp > owner.MP) owner.mp = owner.MP;
        owner.SP -= this.sp; if (owner.sp > owner.SP) owner.sp = owner.SP;

        for(let a in this.atk) owner.atk[a] -= this.atk[a];
        owner.def -= this.def;

        owner.str -= this.str;
        owner.dex -= this.dex;
        owner.con -= this.con;
        owner.int -= this.str;
        owner.wis -= this.wis;
        owner.cha -= this.cha;
        this.owner = null;           
    }
    constructor() {
        this.name = "???";
        this.description = "???";
        this.atk = {};
        this.def = 0;
        this.hp = 0;
        this.mp = 0;
        this.sp = 0;
        this.str = 0;
        this.dex = 0;
        this.con = 0;
        this.int = 0;
        this.wis = 0;
        this.cha = 0;
    }
}



export class Ability {
    name: string;
    description: string;    
    owner: Creature;

    atk = {};

    parse_atk() : string {
        return "";
    }
    parse_def() : string {
        return "";
    }
    modify_int(d: number) {
    }
    hp() : string {
        return "";
    }
    mp() : string {
        return "";        
    }
    sp() : string {
        return "";        
    }
    str() : string {        
        return "";
    }  
    dex() : string {
        return "";
    }      
    con() : string {
        return "";
    }            
    int() : string {
        return "";
    }
    wis() : string {
        return "";
    }            
    cha() : string {
        return "";
    }

    append(owner: any) {
        this.owner = owner;
        owner.abilities.push(this);
    }
    remove() {
        let idx = this.owner.abilities.findIndex((a) => a == this);        
        this.owner.abilities.splice(idx, 1);
    }

    constructor(owner?: Creature) {        
        this.owner = owner;
        this.name = "???";
        this.description = "???";
    }
}

export class Injured extends Ability {
    lv : number;
    str_penalty: number;
    dex_penalty: number;

    str() : string {
        if (this.str_penalty == 0) return;
        return "-" + this.str_penalty + " 來自 " + this.name;
    }  
    dex() : string {
        if (this.dex_penalty == 0) return;
        return "-" + this.dex_penalty + " 來自 " + this.name;
    }
    constructor(owner: Creature, lv: number) {
        super(owner);
        this.name = "受傷"; 
        this.lv = lv;
        this.str_penalty = rand(lv+1);
        this.dex_penalty = lv - this.str_penalty;
        owner.str -= this.str_penalty;
        owner.dex -= this.dex_penalty;
        this.description = "這個單位受傷了";
        if (this.str_penalty > 0) this.description += "，力量 -" + this.str_penalty;
        if (this.dex_penalty > 0) this.description += "，力量 -" + this.dex_penalty;        
    }
}

export class Human_Race extends Ability {   
    str() : string {
        return "+" + 5 + " 來自 " + this.name;
    }  
    dex() : string {
        return "+" + 5 + " 來自 " + this.name;
    }      
    con() : string {
        return "+" + 5 + " 來自 " + this.name;
    }            
    int() : string {
        return "+" + 5 + " 來自 " + this.name;
    }
    wis() : string {
        return "+" + 5 + " 來自 " + this.name;
    }            
    cha() : string {
        return "+" + 5 + " 來自 " + this.name;
    }   
    constructor(owner: Creature) {
        super(owner);
        this.name = "人類"; 
        owner.str += 5; owner.dex += 5; owner.modify_con(5);
        owner.wis += 5; owner.cha += 5; owner.modify_int(5);        
        this.description = "在大部分世界的創世史裡，人類都是最年輕的常見種族，姍姍來遲兼且比矮人、精靈、巨龍都要短壽。也許是因為他們的有限歲月，他們會盡力燃燒僅存的有限年日。又或者也許他們覺得需要證明自己給宗祖種族看，為此用搶掠和貿易建立強大的王國。不論是甚麼原因，人類是眾世界的革新者、登峰者、先驅者。";
    }
}

export class Elf_Race extends Ability {    
    str() : string {
        return "+" + 4 + " 來自 " + this.name;
    }  
    dex() : string {
        return "+" + 6 + " 來自 " + this.name;
    }      
    con() : string {
        return "+" + 4 + " 來自 " + this.name;
    }            
    int() : string {
        return "+" + 5 + " 來自 " + this.name;
    }
    wis() : string {
        return "+" + 6 + " 來自 " + this.name;
    }            
    cha() : string {
        return "+" + 6 + " 來自 " + this.name;
    }   
    constructor(owner: Creature) {
        super(owner);
        this.name = "精靈";
        owner.str += 4; owner.dex += 6; owner.modify_con(4);
        owner.wis += 6; owner.cha += 6; owner.modify_int(5);
        this.description = "精靈是帶超凡氣質的魔法民族，活在世上但又不完全屬世。他們居於飄逸之地，在古代森林之中或在閃耀妖火的銀色尖塔之中，柔和音樂乘風而轉，輕柔芳香隨風飄盪。精靈喜歡自然與魔法、美術與藝術、詩詞與歌賦、及世上一切美好之事。";
    }
}


export class Magic_Talent extends Ability {
    lv : number;
    modify_int(d: number) {
        this.owner.modify_MP(this.lv*d);
    }
    mp() : string {
        return "+" + this.lv*this.owner.int + " 來自 " + this.name;
    }
    constructor(owner: Creature, lv: number) {
        super(owner);
        this.lv = lv;
        this.name = "魔法天賦";
        this.description = "這個單位擁有與生俱來的魔法天賦，每點智力增加 " + lv + " 點魔法";
        let int = owner.int; 
        owner.modify_int(-int);
        owner.modify_int(int);
        this.modify_int(int);
    }
}

export class Int_Talent extends Ability {
    lv : number;
    
    int() : string {
        return "+" + this.lv + " 來自 " + this.name;
    }
    constructor(owner: Creature, lv: number) {
        super(owner);
        this.lv = lv;
        this.name = "天資聰穎";
        this.description = "這個單位的領悟能力異於常人，增加 " + lv + " 點智力";        
        owner.modify_int(lv);
    }
}


export class Dex_Talent extends Ability {    
    lv: number;
    dex() : string {
        return "+" + this.lv + " 來自 " + this.name;
    }
    constructor(owner: Creature, lv: number) {
        super(owner);
        this.lv = lv;
        this.name = "身輕如燕";                
        this.description = "這個單位的敏捷異於常人，增加 " + lv + " 點敏捷";
        owner.dex += lv;
    }
}

export class Sickly extends Ability {
    lv : number;
    
    str() : string {
        return "-" + this.lv + " 來自 " + this.name;
    }
    con() : string {
        return "-" + this.lv + " 來自 " + this.name;
    }
    constructor(owner: Creature, lv: number) {
        super(owner);
        this.lv = lv;
        this.name = "體弱多病";
        this.description = "這個單位身嬌體弱，減少 " + lv + " 點力量與體質";        
        owner.str -= lv;
        owner.modify_con(lv);
    }
}
