import * as Creature from "../../creature/creature";
import * as Utils from "../../utils/utils";
import { game } from "../../main";
import * as Item from "../item";
import { Buff } from "../../buff";
import { Accessory } from "./accessory";

export class Equip extends Item.Item {
    equipped: boolean;    
    buff: Buff;

    take(taker: Creature.Creature) {
        if (this.equipped) this.unequip();
        super.take(taker);
    }
    drop() {
        if (this.equipped) this.unequip();
        super.drop();        
    }
    unequip() {
        this.buff.remove();
        this.owner.weapon = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.weapon != null) {
            this.owner.weapon.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.weapon = this;
        this.equipped = true;        
    }
    use() {
        if (this.equipped) {
            this.unequip();
        } else {
            this.equip();
        }
        if (this.owner == game.player) game.draw();
    }
    constructor() {
        super();
        this.name = "裝備";        
        this.ch = "(";
        this.description = "一件裝備";
        this.w = 10000;
        this.value = 1000;   
        this.DB = 10;
    }
}

export * as Weapon from "./weapon";
export * as Armor from "./armor";
export * as Accessory from "./accessory";