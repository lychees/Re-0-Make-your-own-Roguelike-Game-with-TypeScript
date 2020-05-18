import * as ROT from "rot-js";
import { game, pop_random, dice, rand } from "../main";
import { Player, Rat, Snake, Orc, Slime } from "../creature";
import { Map, Box, Tile, add_shadow } from "../map";
import * as Undead from "../monster/undead";

const MAP_WIDTH = 80;
const MAP_HEIGHT = 60;

class Stone extends Tile {
    constructor() {
        super();
        this.ch = "."
        this.color = "#666";
        this.pass = true;
        this.light = true;
    }
}

class Grass extends Tile {
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
            if (who == game.player) game.SE.playSE("魔王魂/[魔王]ドア開.ogg");
            if (who && who.logs) who.logs.notify("你打開了門");
            this.ch = "門";
            this.pass = true;
            this.light = true;
        } else {
            if (who == game.player) game.SE.playSE("魔王魂/[魔王]ドア強閉.ogg");
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

class Tree extends Tile {
    constructor() {
        super();
        this.ch = "樹"
        this.color = "#1f1";
        this.pass = false;
        this.light = false;
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
            game.score += 1;
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

export class Dungeon extends Map {

    free_cells: Array<[number, number]>;

    getDeg(x: number, y: number) : number {
        let deg = 0;
        for (let i=0;i<4;++i) {
            let xx = x + ROT.DIRS[4][i][0];
            let yy = y + ROT.DIRS[4][i][1];            
            if (this.pass(xx, yy)) {
                deg += 1;
            }
        }
        return deg;
    }

    isDoor(x: number, y: number) : boolean {

        //console.log(this.getDeg(x, y));
        
        if (this.getDeg(x, y) != 2) return false;

        let degs = [];
        let dirs = [];
        for (let i=0;i<4;++i) {
            let xx = x + ROT.DIRS[4][i][0];
            let yy = y + ROT.DIRS[4][i][1];            
            if (this.pass(xx, yy)) {
                degs.push(this.getDeg(xx,yy));
                dirs.push(i);
            }
        }

        if ((dirs[0] + dirs[1]) & 1) return false;

        if (degs[0] > degs[1]) {
            let t = degs[0];
            degs[0] = degs[1];
            degs[1] = t;
        }

        //console.log(degs);

        return degs[0] == 2 && degs[1] > 2;
    }

    constructor() {
        super();       
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        this.shadow = {};
        this.free_cells = [];

        let dungeon = new ROT.Map.Digger(this.width, this.height);
        dungeon.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = new Stone();
            this.free_cells.push([x, y]);
        });

        for (let x=0;x<this.width;++x) {
            for (let y=0;y<this.height;++y) {
                if (this.isDoor(x, y) && dice(6) < 3) {
                    let key = x+','+y;
                    this.layer[key] = new Door();
                }
            }
        }

        for (let x=0;x<this.width;++x) {
            for (let y=0;y<this.height;++y) {
                let key = x + "," + y;
                if (this.layer[key] && this.layer[key].ch == "門") {
                    this.layer[key].trigger('god');
                }
                this.shadow[key] = '#fff';
            }
        }

        this.agents = Array<any>();

        for (let i=0;i<dice(15);++i) {            
            let p = pop_random(this.free_cells);
            let r = new Rat(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<dice(5);++i) {            
            let p = pop_random(this.free_cells);
            let r = new Snake(p[0], p[1]);
            this.agents.push(r);
        }

        for (let i=0;i<dice(2);++i) {
            let p = pop_random(this.free_cells);
            let r = new Orc(p[0], p[1]);
            this.agents.push(r);
        }
        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });

        for (let i=0;i<2;++i) {
            let p = pop_random(this.free_cells);
            let t = new Upstair();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }

        for (let i=0;i<5;++i) {
            let p = pop_random(this.free_cells);
            let t = new Box();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }
    }

}


export class Map0 extends Map {

    free_cells: Array<[number, number]>;
    dungeon: Map;

    constructor() {
        super();       

        this.dungeon = new Dungeon();

        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        this.shadow = {};
        this.free_cells = [];
        let forest = new ROT.Map.Arena(this.width, this.height);
        forest.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = new Grass();
            this.free_cells.push([x, y]);
        });

        for (let i=0;i<10+rand(40);++i) {            
            let p = pop_random(this.free_cells);                        
            let key = p[0]+','+p[1];
            this.layer[key] = new Tree();
        }

        this.agents = Array<any>();

        /*
        for (let i=0;i<dice(7);++i) {            
            let p = pop_random(this.free_cells);
            let r = new Rat(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<dice(5);++i) {            
            let p = pop_random(this.free_cells);
            let r = new Snake(p[0], p[1]);
            this.agents.push(r);
        }

        for (let i=0;i<dice(2);++i) {
            let p = pop_random(this.free_cells);
            let r = new Orc(p[0], p[1]);
            this.agents.push(r);
        }*/

        for (let i=0;i<10;++i) {
            let p = pop_random(this.free_cells);
            let r = new Undead.Skeleton(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<10;++i) {
            let p = pop_random(this.free_cells);
            let r = new Undead.Walking_Dead(p[0], p[1]);
            this.agents.push(r);
        }

        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });

        for (let i=0;i<5;++i) {
            let p = pop_random(this.free_cells);
            let key = p[0]+','+p[1];
            if (this.dungeon.layer[key] == null) {
                --i;
                continue;
            }

            let down = new Downstair();
            down.target = {};
            down.target.map = this.dungeon;
            down.target.x = p[0];
            down.target.y = p[1];
            let up = new Upstair();
            up.target = {}; 
            up.target.map = this;
            up.target.x = p[0];
            up.target.y = p[1];

            this.layer[key] = down;
            this.dungeon.layer[key] = up;            
        }

        for (let i=0;i<5;++i) {
            let p = pop_random(this.free_cells);
            let t = new Box();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }
    }
}
