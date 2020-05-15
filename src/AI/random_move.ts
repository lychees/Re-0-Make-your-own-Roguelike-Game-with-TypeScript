import * as ROT from "rot-js";
import { game, rand } from "../main";

export function random_move() {
    game.scheduler.setDuration( 4000 );
    if (this.hp <= 0) return;    
    let new_dir = rand(4);
    this.dir = new_dir;

    let d = ROT.DIRS[4][new_dir];    
    this.moveBy(d[0], d[1]);
}