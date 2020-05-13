import * as ROT from "rot-js";
import { game, rand } from "../main";
import { random_move } from "./random_move";

export function run_away() {
    if (this.hp <= 0) return;
    game.scheduler.setDuration( 20 / this.dex );
    
    random_move.bind(this)();
}