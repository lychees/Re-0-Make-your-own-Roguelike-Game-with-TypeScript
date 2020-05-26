import { game } from "../main";

export function add_shadow(c1) {
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


/**
 * @class Tile, 地砖， Roguelike 是一个 tile-based 游戏 https://en.wikipedia.org/wiki/Roguelike 
 * @param {ROT.Scheduler} scheduler
 */
export class Tile {
    name: string;
    ch: string;
    color: string;
    bg: string;
    pass: any;
    light: any;

    constructor() {        
    }
    draw(x: number, y: number, s: string, bg?: string){
        if (!bg) bg = '#000';
        if (s === '#fff') {
            game.display.draw(x, y, this.ch, this.color, bg);
        } else if (s === '#555') {
            game.display.draw(x, y, this.ch, add_shadow(this.color), bg);
        }
    }
}


export class Wall extends Tile {
    constructor() {
        super();        
        this.ch = "墻"
        this.color = "#fff";
        this.pass = false;
        this.light = false;
    }
}

export class Stone extends Tile {
    constructor() {
        super();
        this.ch = "."
        this.color = "#666";
        this.pass = true;
        this.light = true;
    }
}

export class Grass extends Tile {
    constructor() {
        super();        
        this.ch = "."
        this.color = "#2f2";
        this.pass = true;
        this.light = true;
    }
}

export class Door extends Tile {
    name: string;
    ch: string;
    color: string;
    pass: any;
    light: any;

    trigger(who?: any) {
        if (this.pass == false) {            
            if (who == game.player) game.SE.playSEs(["maoudamashii/door_open.ogg","On-Jin/door_open.ogg","On-Jin/door_open2.ogg"]);
            if (who && who.logs) who.logs.notify("你打開了門");
            this.ch = "門";
            this.pass = true;
            this.light = true;
        } else {
            if (who == game.player) game.SE.playSEs(["maoudamashii/door_close.ogg","On-Jin/door_close.ogg","On-Jin/door_close2.ogg","On-Jin/door_close3.ogg"]);
            if (who && who.logs) who.logs.notify("你關上了門");
            this.ch = "關";
            this.pass = false;
            this.light = false;
        }
    }
    constructor() {      
        super();  
        this.ch = "門";
        this.color = "#eee";
        this.pass = true;
        this.light = true;
    }    
}

export class Tree extends Tile {
    constructor() {
        super();
        this.ch = "樹"
        this.color = "#1f1";
        this.pass = false;
        this.light = false;
    }
}