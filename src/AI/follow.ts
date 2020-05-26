
import * as ROT from "rot-js";
import { game } from "../main";
import { random_move } from "./random_move";
import { Creature } from "../creature/creature";


export function swap(p: any) {
    let t = this.x;
    this.x = p.x;
    p.x = t;

    t = this.y;
    this.y = p.y;
    p.y = t;

    game.draw();
    game.scheduler.setDuration( 4000 );
}

export function act() {
    game.scheduler.setDuration( 4000 );

    let fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
        return game.map.light(x, y);
    });

    let visible = {};

    fov.compute(this.x, this.y, 9, function(x, y, r, visibility) {
        const key = x+','+y;   
        visible[key] = true;
    });

    const x = this.x, y = this.y;


    for (let dd=0;dd<4;++dd) {
        let d = ROT.DIRS[4][dd];    
        let xx = x + d[0];
        let yy = y + d[1];
        if (xx == game.player_last_x && yy == game.player_last_y) {    
            this.moveBy(d[0], d[1]);
            return;        
        }
    }

    let key = x+','+y;
    if (!visible[key]) {
        // random_move.bind(this)();
        return;
    }

    var passableCallback = function(x, y) {
        return game.map.pass_without_agents(x, y);
    }
    var astar = new ROT.Path.AStar(game.player.x, game.player.y, passableCallback, {topology:4});

    var path = [];
    var pathCallback = function(x, y) {
        path.push([x, y]);
    }
    astar.compute(x, y, pathCallback);    

    path.shift();
    if (!path || path.length === 0) {      
        //random_move.bind(this)(); 
    } else {        
        this.moveTo(path[0][0], path[0][1]);
    }
}

export function follow(a: Creature, b: Creature) {
    a.act = act.bind(a, b);
    a.react = swap.bind(a, b);
    a.shift_react = a.talk;
}