import * as ROT from "rot-js";
import { game, rand } from "../main";

export function random_move() {
    if (this.hp <= 0) return;
    game.scheduler.setDuration( 20 / this.dex );
    let new_dir = rand(4);
    this.dir = new_dir;

    let d = ROT.DIRS[4][new_dir];    
    this.moveBy(d[0], d[1]);
}