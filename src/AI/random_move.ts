import * as ROT from "rot-js";
import { game, rand } from "../main";

export function random_move() {
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
}