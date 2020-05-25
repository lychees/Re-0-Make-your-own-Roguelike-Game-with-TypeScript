import * as ROT from "rot-js";
import * as Utils from "../utils/utils"
import { game } from "../main";
import { Map, Box } from "../map";
import * as Undead from "../creature/monster/undead";
import * as Creature from "../creature/creature";
import * as Tile from "../tile/tile";

const MAP_WIDTH = 60;
const MAP_HEIGHT = 40;

class Stair extends Tile.Tile {

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

        if (this.target.map instanceof Dungeon && this.target.map.next_level == undefined) {
            this.target.map.generate_next_level();
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

    level: number;
    free_cells: Array<[number, number]>;
    next_level: Dungeon;

    getDeg(x: number, y: number) : number {
        let deg = 0;
        for (let i=0;i<4;++i) {
            let xx = x + ROT.DIRS[4][i][0];
            let yy = y + ROT.DIRS[4][i][1];
            if (this.pass_without_agents(xx, yy)) {
                deg += 1;
            }
        }
        return deg;
    }

    isDoor(x: number, y: number) : boolean {
        
        if (!this.pass(x, y)) return false;

        if (this.getDeg(x, y) != 2) {            
            return false;
        }

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

        return degs[0] >= 2 && degs[1] >= 4;
    }

    constructor() {
        let w = 50 + Utils.dice(150);
        let h = 40 + Utils.dice(120);
        super(w, h);
        this.free_cells = [];

        let dungeon = new ROT.Map.Digger(this.width, this.height);
        //let dungeon = new ROT.Map.Arena(this.width, this.height);
        dungeon.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key].push(new Tile.Stone());
            this.free_cells.push([x, y]);
        });

        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {                
                let key = x+','+y;
                if (this.layer[key].length == 0) {
                    this.layer[key].push(new Tile.Wall());
                }
            }
        }        

        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {
                let key = x+','+y;
                if (Utils.dice(6) <= 2 && this.isDoor(x, y)) {                                        
                    this.layer[key].push(new Tile.Door());
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
               // this.shadow[key] = '#fff';
            }
        }
            
        for (let i=0;i<Utils.dice(Math.floor(w*h/5));++i) {
            let p = Utils.pop_random(this.free_cells);
            let r = new Undead.Skeleton(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<Utils.dice(Math.floor(w*h/10));++i) {
            let p = Utils.pop_random(this.free_cells);
            let r = new Undead.Walking_Dead(p[0], p[1]);
            this.agents.push(r);
        }
        for (let i=0;i<Utils.dice(Math.floor(w*h/20));++i) {
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
    
        for (let i=0;i<5;++i) {
            let p = Utils.pop_random(this.free_cells);
            let t = new Box();
            let key = p[0]+','+p[1];
            this.layer[key].push(t);
        }
    }

    generate_next_level() {         
        
        this.next_level = new Dungeon();
        this.next_level.level = this.level + 1;
        this.next_level.name = "地下城 Level " + this.next_level.level;

        for (let i=0;i<Utils.dice(100);++i) {
            let p = Utils.pop_random(this.free_cells);
            let key = p[0]+','+p[1];

            if (this.next_level.outside(p[0],p[1]) || this.next_level.layer[key][this.next_level.layer[key].length - 1].ch != '.') {
                --i;
                continue;
            }

            let down = new Downstair();
            down.target = {};
            down.target.map = this.next_level;
            down.target.x = p[0];
            down.target.y = p[1];
            let up = new Upstair();
            up.target = {}; 
            up.target.map = this;
            up.target.x = p[0];
            up.target.y = p[1];

            this.layer[key].push(down);
            this.next_level.layer[key].push(up); 
        }
    }

}


export class Rogue_Encampment extends Map {

    dungeon: Dungeon;
    free_cells: Array<[number, number]>;

    constructor() {
        let w = MAP_WIDTH;
        let h = MAP_HEIGHT;
        super(w, h);
        this.name = "羅格營地";

        this.free_cells = [];
        let forest = new ROT.Map.Cellular(this.width, this.height);
        forest.randomize(0.35);

        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {            
                let key = x + ',' + y;
                this.layer[key].push(new Tile.Tree());
            }
        }
        
        for (let i=0; i<3; i++) {
            forest.create(); 
        }        

        forest.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = [];
            this.layer[key].push(new Tile.Grass());
            this.free_cells.push([x, y]);
           // this.shadow[key] = '#fff';
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
                        this.layer[key].push(new Tile.Stone());
                    } else {
                        this.layer[key].push(new Tile.Wall());
                    }
                } else {
                    this.layer[key].push(new Tile.Stone());
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
        this.dungeon.level = 1;            
        this.dungeon.name = "地下城 Level " + this.dungeon.level;
    
        for (let i=0;i<2;++i) {
            let p = Utils.pop_random(this.free_cells);
            let key = p[0]+','+p[1];

            if (this.dungeon.outside(p[0],p[1]) || this.dungeon.layer[key][this.dungeon.layer[key].length - 1].ch != '.') {            
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

        game.player = new Creature.Player(40, 10);
        game.characterMenu.parent = game.player;
        this.agents.push(game.player);

        let linzh = new Creature.Human.Linzh(40, 11);
        this.agents.push(linzh);

        linzh.act = game.player.act.bind(linzh);
        linzh.handleEvent = game.player.handleEvent.bind(linzh);

        game.player.team = "player";
        linzh.team = "player";

        game.team = [];
        game.team.push(game.player);
        game.team.push(linzh);
    }
}
