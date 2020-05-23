import * as ROT from "rot-js";
import * as Utils from "../utils/utils"
import { game } from "../main";
import { Map, Box, Tile, add_shadow } from "../map";
import * as Undead from "../creature/monster/undead";
import * as Creature from "../creature/creature";

const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;


class Wall extends Tile {
    constructor() {
        super();        
        this.ch = "墻"
        this.color = "#fff";
        this.pass = false;
        this.light = false;
    }
}

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
        this.name = "階梯";
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
//            this.target.map = new Map0();
            let p = Utils.pop_random(this.target.map.free_cells);
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
//            this.target.map = new Map0();
            let p = Utils.pop_random(this.target.map.free_cells);
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
        let w = 50 + Utils.dice(150);
        let h = 40 + Utils.dice(120);
        super(w, h);
        this.free_cells = [];

        let dungeon = new ROT.Map.Digger(this.width, this.height);
        dungeon.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key].push(new Stone());
            this.free_cells.push([x, y]);
        });

        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {
                let key = x+','+y;
                if (this.layer[key].length == 0) {
                    this.layer[key].push(new Wall());
                } else if (this.isDoor(x, y) && Utils.dice(6) < 3) {                    
                    this.layer[key].push(new Door());
                }
            }
        }

        // Close all doors at the beginning
        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {
                let key = x + "," + y;
                let t = this.layer[key][this.layer[key].length - 1];
                if (t.ch == "門") t.trigger('god');
                // Light the dungeon for debug
                this.shadow[key] = '#fff';
            }
        }

        for (let i=0;i<5;++i) {
            let p = Utils.pop_random(this.free_cells);
            let r = new Undead.Skeleton(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<Utils.dice(5);++i) {
            let p = Utils.pop_random(this.free_cells);
            let r = new Undead.Walking_Dead(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<Utils.dice(5);++i) {
            let p = Utils.pop_random(this.free_cells);
            let r = new Undead.Zombie(p[0], p[1]);
            this.agents.push(r);
        }        

        let p = Utils.pop_random(this.free_cells);
        let r = new Undead.Corpsefire(p[0], p[1]);
        this.agents.push(r);
        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });

        for (let i=0;i<2;++i) {
            let p = Utils.pop_random(this.free_cells);
            let t = new Upstair();
            let key = p[0]+','+p[1];
            this.layer[key] = t;
        }

        for (let i=0;i<5;++i) {
            let p = Utils.pop_random(this.free_cells);
            let t = new Box();
            let key = p[0]+','+p[1];
            this.layer[key].push(t);
        }
    }

}


export class Rogue_Encampment extends Map {

    dungeon: Map;
    free_cells: Array<[number, number]>;

    constructor() {
        let w = MAP_WIDTH;
        let h = MAP_HEIGHT;
        super(w, h);

        this.free_cells = [];
        let forest = new ROT.Map.Cellular(this.width, this.height);
        forest.randomize(0.35);

        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {            
                let key = x + ',' + y;
                this.layer[key].push(new Tree());
            }
        }
        
        for (let i=0; i<3; i++) {
            forest.create(); 
        }        

        forest.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = [];
            this.layer[key].push(new Grass());
            this.free_cells.push([x, y]);
            this.shadow[key] = '#fff';
        });

        // Camp

        let lx = w / 2 - w / 4;
        let rx = w / 2 + w / 4;
        let ly = 0;
        let ry = h/2;
        let dn = 5;

        for (let x=lx;x<=rx;++x) {
            for (let y=ly;y<=ry;++y) {            
                let key = x + ',' + y;
                this.layer[key] = [];            
                if ((x == lx || x == rx || y == ly || y == ry)) {
                    if (y == ry && w/2-dn < x && x < w/2+dn || (x == lx || x == rx) && h/4-dn < y && y < h/4+dn) {
                        this.layer[key].push(new Stone());
                    } else {
                        this.layer[key].push(new Wall());
                    }
                } else {
                    this.layer[key].push(new Stone());
                }
            }
        }



        this.agents = Array<any>();

        let 阿卡拉 = new Creature.Human.阿卡拉(rx-4, 3);
        this.agents.push(阿卡拉);
        let 恰西 = new Creature.Human.恰西(lx+7, 5);
        this.agents.push(恰西);
        let 卡夏 = new Creature.Human.卡夏(lx+13, 14);
        this.agents.push(卡夏);
        let 瓦瑞夫 = new Creature.Human.瓦瑞夫(lx+15, 12);
        this.agents.push(瓦瑞夫);    
        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });

                
        this.dungeon = new Dungeon();                
    
        for (let i=0;i<2;++i) {
            let p = Utils.pop_random(this.free_cells);
            let key = p[0]+','+p[1];

            let d = this.dungeon.layer[key][this.dungeon.layer[key].length - 1];
            if (d.ch != '.') {
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

            this.layer[key].push(down);
            this.dungeon.layer[key].push(up); 
        }

        
        for (let i=0;i<5;++i) {
            let p = Utils.pop_random(this.free_cells);
            let t = new Box();
            let key = p[0]+','+p[1];
            this.layer[key].push(t);
        }
    }
}
