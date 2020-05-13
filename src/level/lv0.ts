import * as ROT from "rot-js";
import { game, pop_random } from "../main";
import { Player, Rat, Snake } from "../creature";
import { _Map, add_shadow } from "../map";

const MAP_WIDTH = 50;
const MAP_HEIGHT = 30;

class Tile {
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

class Stair extends Tile {

    target: any;

    constructor() {
        super();
        this.color = "#bbf";
        this.pass = true;
        this.light = true;
    }    
    enter(who: any) {
        game.map.move(who, this.target);        
    }
}

class Downstair extends Stair {
    constructor() {
        super();
        this.ch = "下";
    }
    enter(who: any) {
        if (!this.target) {
            this.target = {};
            this.target.map = new Map0();
            let p = pop_random(this.target.map.free_cells);
            this.target.x = p[0];
            this.target.y = p[1];
            this.target.map.layer[p[0]+','+p[1]] = new Upstair();
            this.target.map.layer[p[0]+','+p[1]].target.map = game.map;
            this.target.map.layer[p[0]+','+p[1]].target.x = who.x;
            this.target.map.layer[p[0]+','+p[1]].target.y = who.y;
        }
        super.enter(who);
    }
}

class Upstair extends Stair {
    constructor() {
        super();
        this.ch = "上";
    }
    enter(who: any) {
        if (!this.target) {
            this.target = {};
            this.target.map = new Map0();
            let p = pop_random(this.target.map.free_cells);
            this.target.x = p[0];
            this.target.y = p[1];
            this.target.map.layer[p[0]+','+p[1]] = new Downstair();
            this.target.map.layer[p[0]+','+p[1]].target = {};
            this.target.map.layer[p[0]+','+p[1]].target.map = game.map;
            this.target.map.layer[p[0]+','+p[1]].target.x = who.x;
            this.target.map.layer[p[0]+','+p[1]].target.y = who.y;
        }
        super.enter(who);
    }
}

class Box extends Tile {

    item: any;

    constructor() {
        super();
        this.color = "#ff3";
        this.pass = true;
        this.light = true;
    }    
    enter(who: any) {
        //who.inv
    }    
}

export class Map0 extends _Map {

    free_cells: Array<[number, number]>;

    constructor() {
        super();       
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        this.shadow = {};
        this.free_cells = [];
        let digger = new ROT.Map.Digger(this.width, this.height);
        digger.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = "　";
            this.free_cells.push([x, y]);
        });

        
        this.agents = Array<any>();

        for (let i=0;i<5;++i) {            
            let p = pop_random(this.free_cells);
            let r = new Rat(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<3;++i) {            
            let p = pop_random(this.free_cells);
            let r = new Snake(p[0], p[1]);
            this.agents.push(r);
        }
        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });

        for (let i=0;i<20;++i) {
            let p = pop_random(this.free_cells);
            let t = new Upstair();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }
    }
}
