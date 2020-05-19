import * as ROT from "rot-js";
import { game, pop_random, dice, rand } from "../main";
import { Player, Rat, Snake, Orc, Slime, Elf_Guard, Lee } from "../creature";
import { Map, Box, Tile, add_shadow } from "../map";
import { _, Events } from "../event";

import { hostile } from "../AI/hostile";


const MAP_WIDTH = 20;
const MAP_HEIGHT = 80;

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
            if (who && who == game.player) game.SE.playSE("魔王魂/[魔王]ドア開.ogg");
            if (who && who.logs) who.logs.notify("你打開了門");
            this.ch = "門";
            this.pass = true;
            this.light = true;
        } else {
            if (who && who == game.player) game.SE.playSE("魔王魂/[魔王]ドア強閉.ogg");
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

/*
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
}*/

export class Ch0_Boss extends Map {

    free_cells: Array<[number, number]>;

    constructor() {
        let w = MAP_WIDTH;
        let h = MAP_HEIGHT;
        super(w, h);
            
        this.free_cells = [];
        let forest = new ROT.Map.Cellular(this.width, this.height);

        forest.randomize(0.3);

        for (let x=0;x<this.width;++x) {
            for (let y=0;y<this.height;++y) {            
                let key = x + ',' + y;
                this.layer[key] = new Tree();
            }
        }
        

        forest.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = new Grass();
            this.free_cells.push([x, y]);
            this.shadow[key] = '#fff';
        });


        for (let x=0;x<this.width;++x) {
            let y = 5;
            this.layer[x+','+y] = new Tree();
        }
        let y = 5;
        this.layer[5+','+y] = new Door(); this.layer[5+','+y].trigger();
        this.layer[6+','+y] = new Door(); this.layer[6+','+y].trigger();
        this.layer[7+','+y] = new Door(); this.layer[7+','+y].trigger();

        this.agents = Array<any>();
        let lee = new Lee(7, 6);
        this.layer[7+','+6] = new Grass();

        lee.act = function(){ // wait Isabella
            game.scheduler.setDuration( 5000 );
            console.log('wait');
            if (game.player && Events && Math.abs(this.x - game.player.x) + Math.abs(this.y - game.player.y) <= 9) {
                
                let juqing = {
                    title: _('伊莎貝拉'),
                    scenes: {
                        'start': {
                            text: [
                                _('到此為止吧，伊莎貝拉殿下。'),
                            ],
                            buttons: {
                                'open': {
                                    text: _('繼續'),
                                    nextScene: 'p0'
                                },
                            }
                        },
                        'p0': {
                            text: [
                                _('李、李貝爾隊長，為什麼連你也會在這裏。'),
                            ],
                            buttons: {
                                'open': {
                                    text: _('繼續'),
                                    nextScene: 'p1'
                                },
                            }
                        },
                        'p1': {
                            text: [
                                _('你的亂來已經給安琪拉造成很多困擾了，現在必須把你抓回去。'),
                            ],
                            buttons: {
                                'p21': {
                                    text: _('1. 安琪拉是我生長的地方，無論如何我也不想離開。'),
                                    nextScene: 'p21'
                                },
                                'p22': {
                                    text: _('2. 我已經不是當初的那個小女孩了，我的劍可不會手下留情。'),
                                    nextScene: 'p22'
                                },                
                            }
                        },        
                        'p21': {
                            text: [
                                _('為了安琪拉的未來，只有讓公主委屈一下了。'),
                            ],
                            buttons: {
                                'leave': {
                                    text: '結束'
                                }            
                            }
                        },           
                        'p22': {
                            text: [
                                _('那就讓我來檢驗一下公主殿下的成長吧。'),
                            ],
                            buttons: {
                                'leave': {
                                    text: '結束'
                                }            
                            }
                        },           
                    }
                };
                
                //.startEvent(juqing);   
                this.act = hostile.bind(this);
            }
        }.bind(lee);

        for (let i=0;i<dice(3);++i) {
            let p = pop_random(this.free_cells);
            let r = new Elf_Guard(p[0], p[1]);
            this.agents.push(r);
        }
        this.agents.push(lee);
        
        this.agents.sort(function(a: any, b: any): number {
            if (a.z < b.z) return -1;
            if (a.z > b.z) return 1;
            return 0;
        });
    }
}
