import * as ROT from "rot-js";
import * as Utils from "../utils/utils";
import { game, event as eventt } from "../main";
import * as follow from "../AI/follow";

import * as Elf from "./elf";
import * as Item from "../item/item";
import * as Buff from "../buff";
import * as Particle from "../particle/particle";
import * as Corpse from "../tile/corpse";
import * as AI from "../AI/AI";

import { attack, Creature } from "./creature";

// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript


export class Player extends Elf.Isabella {
    shift_react: () => void;

    constructor(x: number, y: number) {
        super(x, y);

        (new Buff.Cheating()).append(this);
        this.inventory.push(new Item.Equip.Weapon.Axes());    
        let t = new Item.Equip.Weapon.Sword();
        this.inventory.push(t);
        t.equip();

        this.inventory.push(new Item.Equip.Armor.Light_Armor());
        this.inventory.push(new Item.Equip.Accessory.HP_Ring());
        this.inventory.push(new Item.Equip.Accessory.MP_Ring());
        this.inventory.push(new Item.Food.Apple());
        this.inventory.push(new Item.Food.Banana());
        this.inventory.push(new Item.Potion.HP_Potion());
        this.inventory.push(new Item.Potion.MP_Potion());
        this.inventory.push(new Item.Potion.SP_Potion());
    }
}

