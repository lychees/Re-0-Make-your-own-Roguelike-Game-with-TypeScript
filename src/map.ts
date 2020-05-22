import * as ROT from "rot-js";
import { game, event, pop_random } from "./main";
import { Player, Rat, Snake, Creature } from "./creature/creature";
import { Apple } from "./inventory";
import * as Particle from "./particle/particle"

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
    draw(x: number, y: number, s: string, bg?: string){
        if (!bg) bg = '#000';
        if (s === '#fff') {
            game.display.draw(x, y, this.ch, this.color, bg);
        } else if (s === '#555') {
            game.display.draw(x, y, this.ch, add_shadow(this.color), bg);
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
    particles: Array<Particle.Particle>;
    
    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;        
        this.layer = {};        
        for (let i=0;i<w;++i) {
            for (let j=0;j<h;++j) {
                let key = i+','+j;
                this.layer[key] = [];
            }
        }
        this.shadow = {};
        this.agents = new Array<any>();
        this.particles = new Array<Particle.Particle>();
    }

    enter(x: number, y: number, p: Creature) {        
        let l = this.layer[x+','+y];        
        let e = [];
        for (let i=0;i<l.length;++i){            
            if (l[i].enter) e.push(i);
        }

        if (e.length == 0) {
            return;
        }
        if (e.length == 1) {
            l[e[0]].enter(p);
            return;
        }        
        //alert("to be test: multi events");

        let btns = {};

        for (let i=0;i<e.length;++i){            
            btns[i] = {
                text: l[e[i]].name,
                onChoose: l[e[i]].enter.bind(l[e[i]], p)
            }
        }

        let options = {
            title: p.name,
            scenes: {
                'start': {
                    text: [
                        '...',
                    ],
                    buttons: btns
                },       
            }
        };

        event.startEvent(options);
    }
    touch() {

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
        for (let t of this.layer[key]) {
            if (!t.pass) return false;
        }
        return true;
    }

    outside(x: number, y: number) {        
        return x < 0 || y < 0 || x >= this.width || y >= this.height;
    }
    
    pass(x: number, y: number) {        
        if (this.outside(x, y)) return false;
        for (let i=0;i<this.agents.length;++i) {
            let a = this.agents[i];
            if (a.x === x && a.y === y  && a.hp > 0) {
                return false;
            }
        }
        return this.pass_without_agents(x, y);
    }

    light(x: number, y: number) {     
        if (this.outside(x, y)) return false;
        let key = x+','+y;
        for (let t of this.layer[key]) {
            if (!t.light) return false;
        }
        return true;
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
    draw_tile_at(x: number, y: number, key: string, bg?: string) {
        game.display.draw(x, y, null);        
        this.layer[key][this.layer[key].length - 1].draw(x, y, this.shadow[key]);
    }

    draw_tile_at2(x: number, y: number, key: string, bg?: string) {
        game.display.draw(x, y, null);
        console.log(x, y, key, bg);
        //if (this.layer[key].length == 0) return;
        console.log(this.layer[key]);
        this.layer[key][this.layer[key].length - 1].draw(x, y, this.shadow[key], '#aaa');
    }

    draw() {
        const o = game.display.getOptions(); 
        let w = o.width, h = o.height; 
        this.gen_shadow(game.player, '#fff');
        for (let x=0;x<w;++x) {
        	for (let y=0;y<h;++y) {
                let xx = x + game.camera.x - game.camera.ox;
                let yy = y + game.camera.y - game.camera.oy;
                if (this.outside(xx, yy)) continue;
                let key = xx+','+yy;
                this.draw_tile_at(x, y, key);
        	}
        }        
        for (let a of this.agents) {
            a.draw();
        }
        for (let p of this.particles) {
            p.draw();            
        }
        this.gen_shadow(game.player, '#555');
    }
}