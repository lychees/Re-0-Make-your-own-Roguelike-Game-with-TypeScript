import * as ROT from "rot-js";
import { Logs } from "./logs.ts";
import { game, rand } from "./main.ts";


// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript
function add_shadow(c1) {
    if (c1[0] !== '#') {
        return c1;
    }    
    let r = c1.charCodeAt(1); if (r >= 97) r -= 97 - 10; else r -= 48;
    let g = c1.charCodeAt(2); if (g >= 97) g -= 97 - 10; else g -= 48;
    let b = c1.charCodeAt(3); if (b >= 97) b -= 97 - 10; else b -= 48;
    r = Math.floor(r / 2) + 48;
    g = Math.floor(g / 2) + 48;
    b = Math.floor(b / 2) + 48;
    let c2 = '#' + String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b);    
    return c2;
}

class Creature {
    x: number;
    y: number;
    ch: string;
    color: string;
    dir: number;
    
    str: number; dex: number; con: number;
    int: number; wis: number; cha: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.ch = "生";
        this.color = "#fff";
        this.dir = 1;

        this.str = 5; this.dex = 5; this.con = 5;
        this.int = 5; this.wis = 5; this.cha = 5;
    }
    draw() {
        let s = game.map.shadow[this.x+','+this.y];
        if (s === '#fff') {
            game.map.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, this.color);
        } else if (s === '#555') {
            game.map.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, add_shadow(this.color));
        }
    }
}

export class Enemy extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
    }
    act() {
        let new_dir = rand(4);
        this.dir = new_dir;

        let d = ROT.DIRS[4][new_dir];
        let xx = this.x + d[0];
        let yy = this.y + d[1];            
        if (((xx + "," + yy) in game.map.layer)) {
            this.x = xx;
            this.y = yy;
        }
    }
}

export class Rat extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.ch = "鼠";
        this.color = "#191";
    }
}

export class Snake extends Enemy {
    constructor(x: number, y: number) {
        super(x, y);
        this.ch = "蛇";
        this.color = "#191";
    }
}

export class Player extends Creature {
    x: number;
    y: number;
    ch: string;
    color: string;
    dir: number;
    logs: Logs;

    constructor(x: number, y: number) {
        super(x, y);
        this.ch = "伊";
        this.color = "#0be";        
        this.logs = new Logs();
    }

    act() {
        game.engine.lock();
        window.addEventListener("keydown", this);
    }     
    handleEvent(e) {
        var keyMap = {};
        keyMap[38] = 0;
        keyMap[33] = 1;
        keyMap[39] = 2;
        keyMap[34] = 3;
        keyMap[40] = 4;
        keyMap[35] = 5;
        keyMap[37] = 6;
        keyMap[36] = 7;
        var code = e.keyCode;
        if (!(code in keyMap)) {
            return;
        }
        let new_dir = keyMap[code];
        this.dir = new_dir;

        if (e.shiftKey) {                    
            this.logs.notify("你向四处张望。");                        
        } else {
            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];            
            if (((xx + "," + yy) in game.map.layer)) {
                game.camera.move(d[0], d[1]);
                this.x = xx;
                this.y = yy;
            }
        }
        window.removeEventListener("keydown", this);
        game.engine.unlock();
        game.draw();
    }    
}