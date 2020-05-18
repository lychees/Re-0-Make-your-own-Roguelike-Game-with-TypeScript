import * as ROT from "rot-js";

import { game, rand, dice } from "./main";
import { add_shadow } from "./map";

import { Creature } from "./creature"

export function parse_atk(atk: any) {
    let z = "";
    for (let a in atk) {
        if (z != "") z += ",";
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

    parse_atk(no_atk?: boolean) : string {
        let z = parse_atk(this.atk);
        if (z == "") return z;
        if (!no_atk) z += " ATK";
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
        //owner.con += this.con;
        //owner.int += this.int;
        owner.modify_con(this.con);
        owner.modify_int(this.int);
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
        //owner.con -= this.con;
        //owner.int -= this.int;
        owner.modify_con(-this.con);
        owner.modify_int(-this.int);
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

export class MP_Talent extends Buff {        
    constructor(lv: number) {
        super();
        this.mp = lv;
        this.name = "魔法天賦";
        this.description = "這個單位擁有與生俱來的魔法天賦";
    }
}

export class Int_Talent extends Buff {    
    lv: number;
    constructor(lv: number) {
        super();
        this.lv = lv;
        this.int = lv;
        if (lv > 0) {
            this.name = "天資聰穎";
            this.description = "這個單位的智力異於常人\n";
        } else {
            this.name = "頭腦簡單";
            this.description = "這個單位的智力弱於常人\n";
        }        
        this.description += this.parse();
    }
}

export class Dex_Talent extends Buff {
    lv: number;
    constructor(lv: number) {
        super();
        this.lv = lv;
        this.dex = lv;
        if (lv > 0) {
            this.name = "身輕如燕";
            this.description = "這個單位的敏捷異於常人\n";
        } else {
            this.name = "四肢僵硬";
            this.description = "這個單位的敏捷弱於常人\n";
        }        
        this.description += this.parse();
    }    
}

export class Sickly extends Buff {
    lv : number;
    constructor(lv: number) {
        super();
        this.lv = lv;        
        this.str = -lv;
        this.con = -lv;
        this.name = "體弱多病";
        this.description = "這個單位從小體弱多病\n";
        this.description += this.parse();
    }
}

export class Injured extends Buff {
    lv : number;
    constructor(lv: number) {
        super();
        this.name = "轻傷"; 
        this.lv = lv;
        this.str = -rand(lv+1);
        this.dex = -(lv+this.str);
        this.description = "這個單位受傷了\n";
        this.description += this.parse();
    }
}

export class Elf_Race extends Buff {    
    constructor() {
        super();
        this.name = "精靈";
        this.str = 4; this.dex = 6; this.con = 4;
        this.int = 5; this.wis = 6; this.cha = 6; 
        this.description = "精靈是帶超凡氣質的魔法民族，活在世上但又不完全屬世。他們居於飄逸之地，在古代森林之中或在閃耀妖火的銀色尖塔之中，柔和音樂乘風而轉，輕柔芳香隨風飄盪。精靈喜歡自然與魔法、美術與藝術、詩詞與歌賦、及世上一切美好之事\n";
        this.description += this.parse();
    }
}

export class Human_Race extends Buff {    
    constructor() {
        super();
        this.name = "人類";
        this.str = 5; this.dex = 5; this.con = 5;
        this.int = 5; this.wis = 5; this.cha = 5; 
        this.description = "普通的人類\n";
        this.description += this.parse();
    }
}


/*
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
*/