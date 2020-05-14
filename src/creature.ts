import * as ROT from "rot-js";

import { game, rand, dice } from "./main";
import { add_shadow } from "./map";

import { Logs } from "./logs";
import { Inventory, Apple, Water_Mirror, Necklace } from "./inventory";
import { hostile } from "./AI/hostile";
import { slime_hostile } from "./AI/slime_hostile";

// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript

function attack(alice, bob) {    

    if (bob.hp <= 0) return;
    let dice = rand;

    let miss = dice(6) + dice(6) + 2;

    console.log(miss, bob.dex);

    if (miss < bob.dex) {
        game.SE.playSE("Wolf RPG Maker/[Action]Swing1_Komori.ogg");        
        alice.logs.notify(bob.name + '躲開了' + alice.name + '的攻擊');
        bob.logs.notify(bob.name + '躲開了' + alice.name + '的攻擊');
        return; 
    }


    let dmg = alice.base_atk();

    console.log(dmg);

    

    if (alice.str > bob.str) dmg += dice(alice.str - bob.str);

    if (alice == game.player) dmg = dice(6) + dice(6); 
    game.SE.playSE("Wolf RPG Maker/[Effect]Attack5_panop.ogg");
   
    if (bob.hp >= bob.HP*0.7 && bob.hp - dmg < bob.HP*0.7) {
        bob.injured(1);
    }
    bob.hp -= dmg; 
    alice.logs.notify(alice.name + '對' + bob.name + '造成了' + dmg + '點傷害'); 
    bob.logs.notify(alice.name + '對' + bob.name + '造成了' + dmg + '點傷害'); 
    if (bob.hp <= 0) {
        bob.dead(alice);
    }
}

class Creature {
    name: string;
    x: number;
    y: number;
    z: number;
    ch: string;
    color: string;
    dir: number;
    
    hp: number; HP: number;
    mp: number; MP: number;
    sp: number; SP: number;

    str: number; dex: number; con: number;
    int: number; wis: number; cha: number;

    logs: Logs;
    inventory: Inventory;
    abilities : Array<Ability>;

    constructor(x: number, y: number) {
        this.name = "生物";
        this.x = x;
        this.y = y;
        this.ch = "生";
        this.color = "#fff";
        this.dir = 1;
        this.z = 1;
        
        this.hp = 0; this.HP = 0;
        this.mp = 0; this.MP = 0;
        this.sp = 0; this.SP = 0;

        this.str = 0; this.dex = 0; this.con = 0;
        this.int = 0; this.wis = 0; this.cha = 0;        
        this.logs = new Logs();
        this.inventory = new Inventory(); this.inventory.owner = this;
        this.abilities = new Array<Ability>();
    }
    /*
    base_attack() {
        return dice(this.str) + dice(this.str);
    }*/
    modify_HP(d: number) {
        this.hp += d; this.HP += d;
    }
    modify_MP(d: number) {
        this.mp += d; this.MP += d;
    }
    modify_SP(d: number) {
        this.sp += d; this.SP += d;
    }
    modify_str(d: number) {
        this.str += d;
        this.modify_HP(d);
    }
    modify_con(d: number) {
        this.con += d;
        this.modify_HP(d*5);
        this.modify_SP(d);
    }
    modify_int(d: number) {
        this.int += d;
        for (let i=0;i<this.abilities.length;++i) {
            if (this.abilities[i].modify_int) {
                this.abilities[i].modify_int(d);
            }
        }
    } 
    
    hp_healing(d: number): number {
        d = Math.min(d, this.HP - this.hp);
        this.hp += d;
        return d;
    }
    mp_healing(d: number): number {
        d = Math.min(d, this.MP - this.mp);
        this.mp += d;
        return d;
    }
    sp_healing(d: number): number {
        d = Math.min(d, this.SP - this.sp);
        this.sp += d;
        return d;
    }
    injured(d: number) {
        this.logs.notify(this.name + "受傷了");
        this.abilities.push(new Injured(this, d));        
    }
    draw() {
        let s = game.map.shadow[this.x+','+this.y];        
        if (s === '#fff') {
            game.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, this.color);
        } else if (s === '#555') {
            game.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, add_shadow(this.color));
        }
    }
    dead(murderer: any) {        
        this.logs.push(this.name + '被' + murderer.name + "殺死了"); 
        this.color = '#222';
        this.z = 0;
    }
    moveTo(x: number, y: number) {
        if (game.map.pass(x, y)) {
            this.x = x;
            this.y = y;
        }
    }
    moveBy(dx :number, dy: number) {
        this.moveTo(this.x + dx, this.y + dy);
    }
    moveTo_or_attack(x: number, y: number) {        
        if (x == game.player.x && y == game.player.y) {
            attack(this, game.player);            
        }
        else {
            this.moveTo(x, y);
        }
    }
    abilities_detail() {
        let detail = {
            hp: ['生命值'],
            mp: ['魔法值'],
            sp: ['體力值'],
            str: ['力量代表肌肉力量、運動訓練、及能發揮多少肉體潛能'],
            dex: ['敏捷代表機敏度、反射速度、平衡力'],
            con: ['體魄代表健康、耐力、生命力'],
            int: ['智力代表思考速度、記憶力、邏輯能力'],
            wis: ['感知代表你對外在環境的觸覺，反映觀察力和洞察力'],
            cha: ['魅力量度你跟他人有效地交流的能力。它代表了信心、口才，也能代表迷人或有力的個性'],
        };

        detail.hp.push("+" + this.con*5 + " 來自 體質");
        detail.sp.push("+" + this.con*1 + " 來自 體質");

        for (let i=0;i<this.abilities.length;++i) {
            let a = this.abilities[i];
            if (a.hp() !== "") {
                detail.str.push(a.hp());
            }
            if (a.mp() !== "") {
                detail.mp.push(a.mp());   
            }
            if (a.sp() !== "") {
                detail.sp.push(a.sp());
            }
            if (a.str() !== "") {
                detail.str.push(a.str());   
            }
            if (a.dex() !== "") {
                detail.dex.push(a.dex());   
            }
            if (a.con() !== "") {
                detail.con.push(a.con());   
            }
            if (a.int() !== "") {
                detail.int.push(a.int());   
            }
            if (a.wis() !== "") {
                detail.wis.push(a.wis());   
            }
            if (a.cha() !== "") {
                detail.cha.push(a.cha());   
            }
        }
        return detail;
    }
    act() {

    }
}

export class Enemy extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.act = hostile.bind(this);
    }
    base_atk() {
        return dice(this.str) + dice(this.str);
    }
}

export class Rat extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "碩鼠";        
        this.str = 1; this.dex = 6;
        this.wis = 6; this.cha = 5;
        this.modify_con(1);
        this.ch = "鼠";
        this.color = "#777";
    }
}

export class Snake extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "蛇";
        this.str = 2; this.dex = 7;
        this.modify_con(1);
        this.ch = "蛇";        
        this.color = "#191";
    }
}

//Orc infantry
export class Orc extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "獸人步兵";
        this.hp = 25; this.HP = 25;
        this.str = 8; this.dex = 6;
        this.modify_con(5);
        this.ch = "獸";
        this.color = "#4e4";        
    }
}

export class Slime extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "史萊姆";
        this.hp = 10; this.HP = 10;
        this.str = 2; this.dex = 6;
        this.modify_con(4);
        this.ch = "姆";
        this.color = "#559";
        this.act = slime_hostile.bind(this);
    }
}

class Ability {
    name: string;
    description: string;    
    owner: Creature;
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

    constructor(owner: Creature) {        
        this.owner = owner;
        this.name = "???";
        this.description = "???";
    }
}

class Injured extends Ability {
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
        if (this.str_penalty > 0) this.description += "，力量 - " + this.str_penalty;
        if (this.dex_penalty > 0) this.description += "，力量 - " + this.dex_penalty;        
    }
}

class Human_Race extends Ability {   
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

class Elf_Race extends Ability {    
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


class Magic_Talent extends Ability {
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

class Int_Talent extends Ability {
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

class Dex_Talent extends Ability {    
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

class Sickly extends Ability {
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

/*
export class Orc extends Creature {
}*/

export class Human extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "人類";
        this.ch = "人";
        this.abilities.push(new Human_Race(this));
    }
}

export class Elf extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "精靈";
        this.ch = "精";
        this.abilities.push(new Elf_Race(this));
    }
}

export class Player extends Elf {

    constructor(x: number, y: number) {
        super(x, y);
        this.name = "伊莎貝拉";
        this.ch = "伊";
        this.color = "#0be";
        
        /*
        this.hp = 5; this.HP = 5;
        this.str = 2; this.dex = 7; 
        this.wis = 7; this.cha = 7;
        this.modify_con(3); this.modify_int(6);
        */
    
        this.z = 100;

        this.abilities.push(new Dex_Talent(this, 1));
        this.abilities.push(new Int_Talent(this, 1));        
        this.abilities.push(new Magic_Talent(this, 3));
        this.abilities.push(new Sickly(this, 1));
        
        this.inventory.push(new Apple());
        this.inventory.push(new Water_Mirror());
        this.inventory.push(new Necklace());
    }
    base_atk() {
        return dice(6) + dice(6);
    }
    dead(murderer: any) {
        super.dead(murderer);
        this.logs.notify("眼前一片漆黑，你掛了")
        game.SE.playSE("狂父/[びたちー]少女（悲鳴）.ogg");
    }
    act() {
        game.draw();
        game.engine.lock();
        window.addEventListener("keydown", this);
    }
    handleEvent(e) {

        event.preventDefault();
        
        let keyMap = {};
        let code = e.keyCode;

        if (code == 73 || code == 105) {
            window.removeEventListener("keydown", this);
            this.inventory.open();
            return;
        }

        if (code == 13 || code == 32) {
            var key = this.x + "," + this.y;

            let t = game.map.layer[key];                       
            if (t) {
                if (t.enter) {
                    t.enter(this);
                } else {
                }
            }
            return;
        }


        keyMap[ROT.KEYS.VK_UP] = 0; 
        keyMap[33] = 1;
        keyMap[ROT.KEYS.VK_RIGHT] = 2;
        keyMap[34] = 3;
        keyMap[ROT.KEYS.VK_DOWN] = 4;
        keyMap[35] = 5;
        keyMap[ROT.KEYS.VK_LEFT] = 6;
        keyMap[36] = 7;

        keyMap[ROT.KEYS.VK_W] = 0;
        keyMap[ROT.KEYS.VK_D] = 2;
        keyMap[ROT.KEYS.VK_S] = 4;
        keyMap[ROT.KEYS.VK_A] = 6;

        if (!(code in keyMap)) {
            return;
        }
        let new_dir = keyMap[code];
        this.dir = new_dir;

        if (e.shiftKey) {                    
            this.logs.notify("你向四处张望。");
            game.scheduler.setDuration( 5 / this.dex );
        } else {
            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];        
            game.scheduler.setDuration( 10 / this.dex );

            let attacked = false;
            for (let i=0;i<game.map.agents.length;++i) {
                let a = game.map.agents[i];
                if (a.x === xx && a.y === yy && a.hp > 0) {
                    attack(this, a);
                    attacked = true;
                    game.player.logs.printMessage
                    break;
                }
            }

            if (!attacked) {
                if (game.map.pass(xx, yy)) {
                    game.camera.move(d[0], d[1]);
                    this.x = xx;
                    this.y = yy;
                }
            }
        }
        window.removeEventListener("keydown", this);
        game.engine.unlock();
    }    
}