import * as ROT from "rot-js";
import $ from "jquery";
import { game, rand, dice } from "../main";
import { add_shadow } from "../map";

import { Logs } from "../logs";
import { Inventory, Apple, Water_Mirror, Necklace, Axes, Sword, Weapon, Armor, Accessory, Shield, Light_Armor, HP_Ring, MP_Ring } from "../inventory";
import { hostile } from "../AI/hostile";
import { slime_hostile } from "../AI/slime_hostile";

import { Injured } from "../buff";
import * as Elf from "./elf";
import * as Buff from "../buff";
import * as Particle from "../particle/particle";
import * as Corpse from "../tile/corpse"

// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript

function attack(alice, bob) {    

    game.scheduler.setDuration(5000);

    if (bob.hp <= 0) return;
    let dice = rand;

    let miss = dice(6) + dice(6) + 2;

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


export class Equipment {
    weapon: Weapon;
    armor: Armor;
    accessory: Accessory;
    owner: any;

    getDom() {
        let z = $('<div>').addClass('equipment');            
        let weapon_dom = $('<div>').addClass('inventoryRow');
        let weapon_name =$('<div>').addClass('row_key').text('武器 ' + (this.weapon ? this.weapon.name : "無"));
        let weapon_tip = $('<div>').addClass("tooltip bottom right").text(this.weapon ? this.weapon.description : "");
        weapon_tip.appendTo(weapon_dom);
        weapon_name.appendTo(weapon_dom);            
        weapon_dom.appendTo(z);

        let armor_dom = $('<div>').addClass('inventoryRow');                
        let armor_name =$('<div>').addClass('row_key').text('護甲 ' + (this.armor ? this.armor.name : "無"));
        let armor_tip = $('<div>').addClass("tooltip bottom right").text(this.armor ? this.armor.description : "");
        armor_tip.appendTo(armor_dom);
        armor_name.appendTo(armor_dom);            
        armor_dom.appendTo(z);

        let accessory_dom = $('<div>').addClass('inventoryRow');                
        let accessory_name =$('<div>').addClass('row_key').text('飾品 ' + (this.accessory ? this.accessory.name : "無"));
        let accessory_tip = $('<div>').addClass("tooltip bottom right").text(this.accessory ? this.accessory.description : "");
        accessory_tip.appendTo(accessory_dom);
        accessory_name.appendTo(accessory_dom);            
        accessory_dom.appendTo(z);        
        
        return z;        
    }

    constructor() {
        this.weapon = null;
        this.armor = null;
        this.accessory = null;
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
    equipment: Equipment;
    //abilities : Array<Ability>;
    buffs : Array<Buff.Buff>;

    run_buff: Buff.Buff;
        
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
        this.equipment = new Equipment(); this.equipment.owner = this;

        //this.abilities = new Array<Ability>();
        this.buffs = new Array<Buff.Buff>();
        this.run_buff = new Buff.Buff();
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
                
        z += "+" + (this.con * 5) + " HP 來自 體質\n";
        
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
        z += "+" + (this.con) + " SP 來自 體質\n";
        for (const b of this.buffs) {
            let t = b.parse_sp();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }

    parse_str_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_str();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }

    parse_dex_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_dex();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }
    
    parse_con_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_con();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
                z += t;
            }
        }
        return z;
    }
    
    parse_int_buffs() {
        let z = "";
        for (const b of this.buffs) {
            let t = b.parse_int();
            if (t != "") {
                t += " 來自 " + b.name + "\n";
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
        /*for (let i=0;i<this.abilities.length;++i) {
            if (this.abilities[i].modify_int) {
                this.abilities[i].modify_int(d);
            }
        }*/
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
        //this.abilities.push(new Injured(this, d));
        (new Injured(d)).append(this);
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

        let agents = game.map.agents;
        let idx = agents.findIndex((e) => e == this);
        agents.splice(idx, 1);
        game.scheduler.remove(this);

        let layer = game.map.layer[this.x+','+this.y];

        layer.push(new Corpse.Corpse(this));
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

    act() {

    }

    handleEvent(e) {
        
    }
}

export class Enemy extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.act = hostile.bind(this);
    }
}

export class Rat extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "老鼠";
        this.ch = "鼠";
        this.color = "#777";

        let Rat_Race = new Buff.Buff();            
        Rat_Race.name = "鼠類";
        Rat_Race.description = "這種鼠類是地下城中的常客\n";
        Rat_Race.atk['d4'] = 1;
        Rat_Race.str = 3; Rat_Race.dex = 3; Rat_Race.con = 2;
        Rat_Race.int = 2; Rat_Race.wis = 5; Rat_Race.cha = 4;
        Rat_Race.description += Rat_Race.parse();
        Rat_Race.append(this);

        if (dice(2) == 1) {
            (new Buff.Dex_Talent(1)).append(this);
        }
        if (dice(2) == 1) {
            (new Buff.Con_Talent(1)).append(this);
        }
        if (dice(3) == 1) {
            let t = new Buff.Buff();
            t.name = "尖牙利爪";
            t.description = "這個單位的攻擊被加強了\n";
            t.atk['d2'] = dice(3);
            t.description += t.parse();
        }
        
    }
}

export class Snake extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "蛇";        
        this.ch = "蛇";        
        this.color = "#191";

        let Snake_Race = new Buff.Buff();            
        Snake_Race.name = "蛇類";
        Snake_Race.description = "這種蛇類是地下城中的常客\n";
        Snake_Race.atk['d6'] = 1;
        Snake_Race.str = 3; Snake_Race.dex = 4; Snake_Race.con = 3;
        Snake_Race.int = 4; Snake_Race.wis = 6; Snake_Race.cha = 6;
        Snake_Race.description += Snake_Race.parse();
        Snake_Race.append(this);

        if (dice(2) == 1) {
            (new Buff.Dex_Talent(1)).append(this);
        }
        if (dice(2) == 1) {
            (new Buff.Con_Talent(1)).append(this);
        }
        if (dice(3) == 1) {
            let t = new Buff.Buff();
            t.name = "尖牙";
            t.description = "這個單位的攻擊被加強了\n";
            t.atk['d2'] = dice(3);
            t.description += this.parse_buffs();
        }
    }
}

//Orc infantry
export class Orc extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "半獸人";        
        this.ch = "獸";
        this.color = "#4e4";       
        
        let Orc_Race = new Buff.Buff();            
        Orc_Race.name = "半獸人";
        Orc_Race.description = "為了部落\n";
        Orc_Race.atk['d1'] = 1;
        Orc_Race.str = 6; Orc_Race.dex = 5; Orc_Race.con = 6;
        Orc_Race.int = 4; Orc_Race.wis = 4; Orc_Race.cha = 4;
        Orc_Race.description += Orc_Race.parse();
        Orc_Race.append(this);

        
        if (dice(6) == 1) {
            let sword = new Sword();
            this.inventory.push(sword);
            sword.equip();
        }
                
        if (dice(3) == 1) {
            let axes = new Axes();
            this.inventory.push(axes);
            axes.equip();
        }

        if (dice(3) == 1) {
            let shield = new Shield();
            this.inventory.push(shield);
            shield.equip();
        }
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

export { Player } from "./Player";
export * as Human from "./human";
export * as Elf from "./elf";
