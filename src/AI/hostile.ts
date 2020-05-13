import * as ROT from "rot-js";
import { game, rand } from "../main";
import { random_move } from "./random_move";

export function hostile() {
    if (this.hp <= 0) return;

    game.scheduler.setDuration( 20 / this.dex );
    let new_dir = rand(4);
    this.dir = new_dir;

    let d = ROT.DIRS[4][new_dir];
    let xx = this.x + d[0];
    let yy = this.y + d[1];    
            
    if ((game.map.pass(xx, yy))) {
        this.x = xx;
        this.y = yy;
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
    // console.log(path); // ???
    if (!path || path.length === 0) {     
        //attack(this, MyGame.player);   
        //alert("遊戲結束，你被活捉了！");
        //MyGame.engine.lock();        
    } else {
        this.move(path[0][0], path[0][1]);  
    }
}