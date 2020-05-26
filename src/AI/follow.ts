
import * as ROT from "rot-js";
import { game } from "../main";
import { random_move } from "./random_move";


export function swap(p: any) {
    let t = this.x;
    this.x = p.x;
    p.x = t;

    t = this.y;
    this.y = p.y;
    p.y = t;

    game.scheduler.setDuration( 4000 );
}

export function follow() {
    if (this.hp <= 0) return;

    let fov = new ROT.FOV.PreciseShadowcasting(function(x, y) {
        return game.map.light(x, y);
    });

    let visible = {};

    fov.compute(this.x, this.y, 9, function(x, y, r, visibility) {
        const key = x+','+y;   
        visible[key] = true;
    });

    const x = game.player.x, y = game.player.y;

    let key = x+','+y;
    if (!visible[key]) {
        // random_move.bind(this)();
        return;
    }

    game.scheduler.setDuration( 4000 );

    var passableCallback = function(x, y) {
        return game.map.pass_without_agents(x, y);
    }
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

    var path = [];
    var pathCallback = function(x, y) {
        path.push([x, y]);
    }
    astar.compute(this.x, this.y, pathCallback);    

    path.shift();
    if (!path || path.length === 0) {      
        //random_move.bind(this)(); 
    } else {        
        this.moveTo(path[0][0], path[0][1]);
    }
}