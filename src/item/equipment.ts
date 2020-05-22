import * as ROT from "rot-js";
import $ from "jquery";
import { game } from "../main";
import { Buff } from "../buff";
import { Menu } from "../UI/character";
import { Creature } from "../creature/creature";
import * as Item from "./item";
import { Equip } from "./item";


export class Equipment {
    weapon: Item.Weapon.Weapon;
    armor: Item.Armor;
    accessory: Item.Accessory;
    owner: Creature;

    getDom() {
        let z = $('<div>').addClass('equipment');            
        let weapon_dom = $('<div>').addClass('inventoryRow');
        let weapon_name =$('<div>').addClass('row_key').text('武器 ' + (this.weapon ? this.weapon.name : "無"));
        let weapon_tip = $('<div>').addClass("tooltip bottom right").text(this.weapon ? this.weapon.description : "");
        weapon_tip.appendTo(weapon_dom);
        weapon_name.appendTo(weapon_dom);            
        weapon_dom.appendTo(z);

        let armor_dom = $('<div>').addClass('inventoryRow');                
        let armor_name =$('<div>').addClass('row_key').text('護甲 ' + (this.armor ? this.armor.name : "無"));
        let armor_tip = $('<div>').addClass("tooltip bottom right").text(this.armor ? this.armor.description : "");
        armor_tip.appendTo(armor_dom);
        armor_name.appendTo(armor_dom);            
        armor_dom.appendTo(z);

        let accessory_dom = $('<div>').addClass('inventoryRow');                
        let accessory_name =$('<div>').addClass('row_key').text('飾品 ' + (this.accessory ? this.accessory.name : "無"));
        let accessory_tip = $('<div>').addClass("tooltip bottom right").text(this.accessory ? this.accessory.description : "");
        accessory_tip.appendTo(accessory_dom);
        accessory_name.appendTo(accessory_dom);            
        accessory_dom.appendTo(z);                
        return z;
    }

    constructor() {
        this.weapon = null;
        this.armor = null;
        this.accessory = null;
    }
}