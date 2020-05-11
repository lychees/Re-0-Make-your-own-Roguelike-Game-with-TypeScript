import * as ROT from "rot-js";
import { game } from "./main.ts";
import { Player } from "./creature.ts";

const MAP_WIDTH = 60;
const MAP_HEIGHT = 30;
const DISPLAY_WIDTH = 40;
const DISPLAY_HEIGHT = 25;

export function pop_random(A: Array<[number, number]>): [number, number] {
    var index = Math.floor(ROT.RNG.getUniform() * A.length);    
    return A[0];
}

export class Map {
    display: any;
    width: number;
    height: number;
    layer: {};
    shadow: {};

    constructor() {
        this.display = new ROT.Display({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            fontSize: 24,            
            fontFamily: 'sans-serif',
        });
        document.body.appendChild(this.display.getContainer());
        
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        this.shadow = {};
        let free_cells = [];
        let digger = new ROT.Map.Digger(this.width, this.height);
        digger.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = "　";
            free_cells.push([x, y]);
        });

        let p = pop_random(free_cells);
        game.player = new Player(p[0], p[1]);
    }
    light(key) {        
        let t = this.layer[key];
        return t === "　";        
    }
    gen_shadow(p: Player, color: string) {
        let fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
            const key = x+','+y; 
            return this.light(key);
        });

        fov.compute90(p.x, p.y, 9, p.dir, (x, y, r, visibility) => {            
            const key = x+','+y;   
            this.shadow[key] = color;
        });
    }
    draw_tile_at(x, y, key) {
        if (this.layer[key] === '　') {
            this.display.draw(x, y, this.layer[key]);
        } else {
            if (this.shadow[key]) {
                this.display.draw(x, y, "墻", this.shadow[key]);
            } else {
                this.display.draw(x, y, null);
            }
        }
    }    
    draw() {
        const o = this.display.getOptions(); 
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
        this.gen_shadow(game.player, '#555');
    }
}
