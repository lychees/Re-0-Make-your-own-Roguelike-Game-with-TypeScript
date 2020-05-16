import * as ROT from "rot-js";

import { game, rand, dice } from "./main";
import { add_shadow } from "./map";

import { Logs } from "./logs";
import { Inventory, Apple, Water_Mirror, Necklace, Axes, Sword, Weapon } from "./inventory";
import { hostile } from "./AI/hostile";
import { slime_hostile } from "./AI/slime_hostile";

import { Buff, Ability, Elf_Race, Human_Race, Injured } from "./buff";

// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript

function attack(alice, bob) {    

    game.scheduler.setDuration(5000);

    if (bob.hp <= 0) return;
    let dice = rand;

    let miss = dice(6) + dice(6) + 2;

    //console.log(miss, bob.dex);

    if (miss < bob.dex) {
        game.SE.playSE("Wolf RPG Maker/[Action]Swing1_Komori.ogg");        
        alice.logs.notify(bob.name + '躲開了' + alice.name + '的攻擊');
        bob.logs.notify(bob.name + '躲開了' + alice.name + '的攻擊');
        return; 
    }

    let dmg = alice.get_atk();
    if (alice.str > bob.str) dmg += dice(alice.str - bob.str);
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

export class Creature {
    name: string;
    x: number;
    y: number;
    z: number;
    ch: string;
    color: string;
    dir: number;
    
    atk: {}; 
    def: number;

    hp: number; HP: number;
    mp: number; MP: number;
    sp: number; SP: number;

    str: number; dex: number; con: number;
    int: number; wis: number; cha: number;

    logs: Logs;
    inventory: Inventory;
    abilities : Array<Ability>;
    buffs : Array<Buff>;

    run_buff: Buff;
    weapon: Weapon;
    
    constructor(x: number, y: number) {
        this.name = "生物";
        this.x = x;
        this.y = y;
        this.ch = "生";
        this.color = "#fff";
        this.dir = 1;
        this.z = 1;

        this.atk = {}; 
        this.def = 0;
        
        this.hp = 0; this.HP = 0;
        this.mp = 0; this.MP = 0;
        this.sp = 0; this.SP = 0;

        this.str = 0; this.dex = 0; this.con = 0;
        this.int = 0; this.wis = 0; this.cha = 0;        
        this.logs = new Logs();
        this.inventory = new Inventory(); this.inventory.owner = this;
        this.abilities = new Array<Ability>();
        this.buffs = new Array<Buff>();
        this.run_buff = new Buff();
        this.run_buff.name = "跑";
        this.run_buff.description = "移動速度加快 4 倍，但每次移動有 10% 的概率消耗一點體力，當沒有體力時此狀態無效。";
    }

    get_atk() {
        let z = 0;
        for (const a in this.atk) {
            if (a[0] == 'd') {
                let t = this.atk[a];
                while (t--) {
                    z += dice(parseInt(a.substr(1)));
                }
            }        
        }
        return z;
    }    

    parse_atk_buffs() {
        let z = "攻擊力\n";
        for (const b of this.buffs) {
            let t = b.parse_atk(true);
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }

    parse_def_buffs() {
        let z = "防禦力\n";
        for (const b of this.buffs) {
            let t = b.parse_def();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }

    parse_hp_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_hp();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }

    parse_mp_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_mp();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }
    
    parse_sp_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_sp();
            if (t != "") {
                t += " 來自 " + b.name;
                z += t;
            }
        }
        return z;
    }    

    parse_buffs() {
        let z = "";
        for (let i=0;i<this.buffs.length;++i) {
            let b = this.buffs[i];
            z += b.parse();
        }
        return z;
    }

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
    
    run() {        
        let idx = this.buffs.findIndex((a) => a == this.run_buff);
        if (idx == -1) {
            this.run_buff.append(this);
        } else {
            this.run_buff.remove();
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
    get_atk() {
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

export class Dog extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "狗";
        this.hp = 10; this.HP = 10;
        this.str = 2; this.dex = 6;
        this.modify_con(4);
        this.ch = "狗";
        this.color = "#aa1";
        this.act = hostile.bind(this);
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
        (new Elf_Race()).append(this);        
    }
}

export class Elf_Guard extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "衛兵";
        this.ch = "衛";
        this.color = "#c11";        
        this.z = 3;
        let t = new Sword();
        this.inventory.push(t);
        t.equip();
        this.act = hostile.bind(this);
    }
}

export class Lee extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "李貝爾";
        this.ch = "李";
        this.color = "#ca3";        
        this.z = 3;
        let t = new Sword();
        this.inventory.push(t);
        t.equip();
    }
}

export class Player extends Elf {

    constructor(x: number, y: number) {
        super(x, y);
        this.name = "伊莎貝拉";
        this.ch = "伊";
        this.color = "#0be";        
        this.z = 100;

        /*this.abilities.push(new Dex_Talent(this, 1));
        this.abilities.push(new Int_Talent(this, 1));        
        this.abilities.push(new Magic_Talent(this, 3));
        this.abilities.push(new Sickly(this, 1));*/       
        //this.inventory.push(new Apple());
        //this.inventory.push(new Water_Mirror());
        //this.inventory.push(new Necklace());
        
        this.inventory.push(new Axes());
        let t = new Sword();
        this.inventory.push(t);
        t.equip();
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

        if (game.characterMenu.opened == true) {
            game.characterMenu.close();
            return;
        }
        
        let keyMap = {};
        let code = e.keyCode;

        if (code == 73 || code == 105) {
            window.removeEventListener("keydown", this);
            this.inventory.open();
            return;
        }

        if (code == ROT.KEYS.VK_R) {
            this.run();
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
        
        if (e.shiftKey) {                    

            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];
            let door = game.map.layer[xx+','+yy];
            if (door && (door.ch == "門" || door.ch == "關")) {
                door.trigger(this);
                game.scheduler.setDuration( 2000 );
            } else {
                this.logs.notify("你向四處張望");
                if (rand(5) == 0) this.sp_healing(1);            
                game.scheduler.setDuration( 1000 );
            }
        } else {
            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];
            
            
            game.scheduler.setDuration( 4000 );

            if (this.run_buff.owner == this && this.sp > 0) {
                if (this.dir == new_dir) {
                    game.scheduler.setDuration( 1000 );
                } else {
                    game.scheduler.setDuration( 2000 );
                }
                if (rand(10) == 0) this.sp -= 1;
            } else {                
                if (rand(10) == 0) this.sp_healing(1);
            }

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

        this.dir = new_dir;
        window.removeEventListener("keydown", this);
        game.engine.unlock();
    }    
}