import * as ROT from "rot-js";
import { game } from "../main";
import { Tile } from "../map"
import * as Creature from "../creature"

export class Corpse extends Tile {
    corpse: Creature.Creature;
    constructor(c: Creature.Creature) {
        super();
        this.corpse = c;
        this.ch = c.ch;
        this.color = c.color;
        this.pass = true;
        this.light = true;        
    }
    enter(who: any) {
        alert(123);
        who.logs.notify("你看了眼地上的尸體");
    }
}