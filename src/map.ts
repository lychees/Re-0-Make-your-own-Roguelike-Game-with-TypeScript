import * as ROT from "rot-js";
import { game, pop_random } from "./main";
import { Player, Rat, Snake } from "./creature";
import { Apple } from "./inventory";

const MAP_WIDTH = 15;
const MAP_HEIGHT = 15;

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

export class Tile {
    name: string;
    ch: string;
    color: string;
    pass: any;
    light: any;

    constructor() {        
    }
    draw(x: number, y: number, s: string){
        if (s === '#fff') {
            game.display.draw(x, y, this.ch, this.color);
        } else if (s === '#555') {
            game.display.draw(x, y, this.ch, add_shadow(this.color));
        }
    }
}

export class Box extends Tile {

    item: any;

    constructor() {
        super();
        this.ch = "箱";
        this.color = "#ee1";
        this.pass = true;
        this.light = true;
        this.item = new Apple();
    }    
    enter(who: any) {
        if (this.item != null) {
            game.SE.playSE("Wolf RPG Maker/[System]Get2_wolf.ogg"); 
            who.inventory.push(this.item);
            this.color = "#555";
            who.logs.notify(who.name + "得到了" + this.item.name);
            this.item = null;            
        }
    }
}

export class Map {
    
    width: number;
    height: number;
    layer: {};
    shadow: {};
    agents: Array<any>;
    
    constructor() {

    }

    move(agent: any, target: any) {                
        let idx = this.agents.findIndex((a)=>{
            return a === agent;
        });

        this.agents.splice(idx, 1);            
        target.map.agents.push(agent);
        agent.x = target.x; agent.y = target.y;
        if (agent.ch === "伊") {
            game.SE.playSE("Wolf RPG Maker/[Action]Steps1_Isooki.ogg");                          
            game.player.x = target.x;
            game.player.y = target.y;
            game.player.logs.notify("你进入了" + target.map.name);
            game.map = target.map;
            game.camera.reload();
            game.reschedule();
            game.draw();
        }
    }

    pass_without_agents(x: number, y: number) {
        let key = x+','+y;


        if (typeof(this.layer[key]) === "object") {
            let t = this.layer[key];
            return t.pass;
        }


        if (this.layer[key] !== "　") return false;
        return true;
    }    
    
    pass(x: number, y: number) {
        let key = x+','+y;

        for (let i=0;i<this.agents.length;++i) {
            let a = this.agents[i];
            if (a.x === x && a.y === y  && a.hp > 0) {
                return false;
            }
        }

        if (typeof(this.layer[key]) === "object") {
            let t = this.layer[key];
            return t.pass;
        }


        if (this.layer[key] !== "　") return false;
        return true;
    }

    light(x: number, y: number) {     
        let key = x+','+y;  

        if (typeof(this.layer[key]) === "object") {
            let t = this.layer[key];
            return t.light;
        }

        let t = this.layer[key];
        return t === "　";        
    }
    gen_shadow(p: Player, color: string) {
        let fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
            return this.light(x, y);
        });

        fov.compute90(p.x, p.y, 9, p.dir, (x, y, r, visibility) => {            
            const key = x+','+y;   
            this.shadow[key] = color;
        });
    }
    draw_tile_at(x: number, y: number, key: string) {

        game.display.draw(x, y, null);

        if (typeof(this.layer[key]) === "object") {            
            let t = this.layer[key];
            this.layer[key].draw(x, y, this.shadow[key]);
            return;
        }

        if (this.layer[key] === '　') {
            game.display.draw(x, y, this.layer[key]);
        } else {
            if (this.shadow[key]) {
                game.display.draw(x, y, "牆", this.shadow[key]);
            } else {
                game.display.draw(x, y, null);
            }
        }
    }    
    draw() {
        const o = game.display.getOptions(); 
        let w = o.width, h = o.height; 
        this.gen_shadow(game.player, '#fff');
        for (let x=0;x<w;++x) {
        	for (let y=0;y<h;++y) {
                let xx = x + game.camera.x - game.camera.ox;
                let yy = y + game.camera.y - game.camera.oy;
                let key = xx+','+yy;
                this.draw_tile_at(x, y, key);
        	}
        }
        for (let i=0;i<this.agents.length;++i) {
            this.agents[i].draw();
        }
        this.gen_shadow(game.player, '#555');
    }
}