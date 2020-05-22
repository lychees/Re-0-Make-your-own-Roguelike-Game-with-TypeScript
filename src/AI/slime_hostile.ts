import * as ROT from "rot-js";
import { game, dice } from "../main";
import { random_move } from "./random_move";
import { Slime } from "../creature/creature";


export function copy() {    
    game.scheduler.setDuration( 20 / this.dex );
    for (let i=0;i<4;++i) {        
        let d = ROT.DIRS[4][i];    
        let x = this.x + d[0];
        let y = this.y + d[0];
        if (game.map.pass(x, y)) {
            let slime = new Slime(x, y);
            game.map.agents.push(slime);
            game.scheduler.add(slime, true);
            return;
        }
    }
}

export function slime_hostile() {
    if (this.hp <= 0) return;

    // console.log("??");

    /*if (this.hp != this.HP) {
        if (dice(6) == 1) {
            this.act = random_move.bind(this);
            this.act();
        }
        return;
    }*/

    if (dice(6) == 1) {
        copy.bind(this)();
        return;
    }

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