
import * as ROT from "rot-js";
import { game, dice } from "../main";
import { random_move } from "./random_move";

export function hostile() {
    if (this.hp <= 0) return;

   /*if (this.hp != this.HP) {
        if (dice(6) == 1) {
            this.act = random_move.bind(this);
            this.act();
        }
        return;
    }*/

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
        random_move.bind(this)();
        return;
    }

    game.scheduler.setDuration( 20 / this.dex );

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
        random_move.bind(this)(); 
    } else {        
        this.moveTo_or_attack(path[0][0], path[0][1]);        
    }
}