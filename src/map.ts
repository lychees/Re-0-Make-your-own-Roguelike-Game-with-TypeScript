import * as ROT from "rot-js";
import { game, event } from "./main";
import { Creature } from "./creature/creature";
import { Apple } from "./item/food";
import * as Particle from "./particle/particle"
import { Tile } from "./tile/tile"
import { dice } from "./utils/utils";
import { Aquaria_Gold_Coin, Aquaria_Silver_Coin } from "./item/item";
export { Tile } from "./tile/tile"

export class Box extends Tile {

    item: any;

    constructor() {
        super();
        this.ch = "箱";
        this.color = "#ee1";
        this.pass = true;
        this.light = true;
        if (dice(6) < 2) {
            this.item = new Apple();
        } else {
            this.item = new Aquaria_Silver_Coin();
        }
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
        
    name: string;

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
        if (agent == game.active_player) {
            game.SE.playSE("Wolf RPG Maker/[Action]Steps1_Isooki.ogg");                          
            game.player.x = target.x;
            game.player.y = target.y;
            game.player.logs.notify("你进入了" + target.map.name);
            game.map = target.map;
            game.player.focus();
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
    gen_shadow(p: Creature, color: string) {
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

        if (this.layer[key].length == 0) {            
            return;
        }
        //console.log(x, y, key);
        this.layer[key][this.layer[key].length - 1].draw(x, y, this.shadow[key]);
    }

    draw_tile_at2(x: number, y: number, key: string, bg?: string) {
        game.display.draw(x, y, null);
        //console.log(x, y, key, bg);
        if (this.layer[key].length == 0) return;
        //console.log(this.layer[key]);
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
                if (this.outside(xx, yy)) {
                    game.display.draw(x, y, null);  
                } else {
                    let key = xx+','+yy;
                    this.draw_tile_at(x, y, key);
                }
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