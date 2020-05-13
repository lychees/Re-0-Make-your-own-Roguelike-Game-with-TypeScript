import * as ROT from "rot-js";

import { game, rand } from "./main";
import { add_shadow } from "./map";

import { Logs } from "./logs";
import { Inventory, Apple, Water_Mirror, Necklace } from "./inventory";
import { hostile } from "./AI/hostile";

// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript

function attack(alice, bob) {    

    if (bob.hp <= 0) return;
    let dice = rand;

    let miss = dice(6) + dice(6);
    if (miss < bob.dex) {
        game.SE.playSE("Wolf RPG Maker/[Action]Swing1_Komori.ogg");        
        alice.logs.notify(bob.name + '躲開了' + alice.name + '的攻擊');
        bob.logs.notify(bob.name + '躲開了' + alice.name + '的攻擊');
        return; 
    }

    let dmg = dice(alice.str) + dice(alice.str);
    if (alice == game.player) dmg = dice(6) + dice(6); 
    game.SE.playSE("Wolf RPG Maker/[Effect]Attack5_panop.ogg");
   
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
    
    hp: number; HP: number; _HP: number;
    mp: number; MP: number; _MP: number;
    sp: number; SP: number; _SP: number;

    str: number; dex: number; con: number;
    int: number; wis: number; cha: number;

    logs: Logs;
    inventory: Inventory;

    constructor(x: number, y: number) {
        this.name = "生物";
        this.x = x;
        this.y = y;
        this.ch = "生";
        this.color = "#fff";
        this.dir = 1;
        this.z = 1;

        this.str = 5; this.dex = 5; this.con = 5;
        this.int = 5; this.wis = 5; this.cha = 5;

        this.hp = 1; this.HP = 1; this._HP = 1;
        this.mp = 1; this.MP = 1; this._MP = 1;
        this.sp = 1; this.SP = 1; this._SP = 1;

        this.logs = new Logs();
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
    act() {

    }
}

export class Enemy extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.act = hostile.bind(this);
    }
    move(x: number, y: number) {
        let block = false;

        if (x == game.player.x && y == game.player.y) {
            attack(this, game.player);
            block = true;
        }
        if (!block) {
            for (let i=0;i<game.map.agents.length;++i) {
                let a = game.map.agents[i];
                if (x == a.x && y == a.y && a.hp > 0) {
                    block = true;
                    break;
                }
            }    
        }     
        if (!block){
            this.x = x; this.y = y;            
        }
    }
}

export class Rat extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "碩鼠";
        this.ch = "鼠";
        this.str = 2;
        this.dex = 6;
        this.color = "#777";
    }
}

export class Snake extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "蛇";
        this.str = 3;
        this.dex = 7;
        this.ch = "蛇";
        this.color = "#191";
    }
}

export class Orc extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.hp = 25; this.HP = 25; this._HP = 25;
        this.dex = 4;
        this.str = 6;
        this.name = "獸人步兵";
        this.ch = "獸";
        this.color = "#4e4";
    }
}

export class Player extends Creature {

    constructor(x: number, y: number) {
        super(x, y);
        this.name = "伊莎貝拉";
        this.ch = "伊";
        this.color = "#0be";
        this.hp = 10; this.HP = 10; this._HP = 10;        
        this.mp = 10; this.MP = 10; this._MP = 10;
        this.sp = 5; this.SP = 5; this._SP = 5;
        this.str = 2; this.dex = 7; this.con = 3;
        this.int = 6; this.wis = 7; this.cha = 7;
        this.z = 100;
        this.inventory = new Inventory();
        this.inventory.owner = this;
        this.inventory.push(new Apple());
        this.inventory.push(new Water_Mirror());
        this.inventory.push(new Necklace());
    }

    act() {
        game.draw();
        game.engine.lock();
        window.addEventListener("keydown", this);
    }     
    handleEvent(e) {
        
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