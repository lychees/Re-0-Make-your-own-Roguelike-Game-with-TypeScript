
import { Creature } from "./creature";
import * as Buff from "../buff";
import * as Item from "../item/inventory";
import { hostile } from "../AI/hostile";

export class Human extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "人類";
        this.ch = "人";
        (new Buff.Human_Race()).append(this);
    }
}
