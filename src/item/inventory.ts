import * as ROT from "rot-js";
import $ from "jquery";
import { game, rand, dice } from "../main";
import { Buff } from "../buff";
import { Menu } from "../UI/character";
import * as Creature from "../creature/creature";
import * as Item from "./item";
import { Equip } from "./item";

export class ItemMenu extends Menu {
	parent: any;
	constructor() {
		super();
	}
	init(item: Item.Item) {

        let info = [];
    
        if (item instanceof Equip) {
            if (item.equipped) {
                info.push({
                    title: "卸下",
                    click: item.unequip.bind(item)
                });
            } else {
                info.push({
                    title: "裝備",
                    click: item.equip.bind(item)
                });
            }
        }

        if (item instanceof Item.Food.Food) {
            info.push({
                title: "吃",
                click: item.eat.bind(item)
            });
        }

        info.push({
            title: "丟棄",
            click: item.drop.bind(item)
        });

        
        if (item.owner !== game.player && item.owner.hp <= 0) {
            info.push({
                title: "拿走",
                click: item.take.bind(item, game.player)
            });
        }

        let dom = $('<div>').addClass('inventory').addClass('inventory_sub_menu');            
        for (let i of info) {
            let button = $('<div>').addClass('button');
            button.text(i.title);
            button.click(()=>{
                i.click();
                this.menu.remove();
                this.close();                
                this.parent.refresh();
            });
            button.appendTo(dom);
        }
        //dom.text(text);
        this.menu = dom;
	}
    handleEvent(e) {
        
    }	
}
export class Inventory {
    items: Array<any>;
    owner: any;

    constructor() {
        this.items = []; 
    }

    push(item: any) {
        item.owner = this.owner;
        this.items.push(item);
        this.draw();
    }

    getDom() {
        let z = $('<div>').addClass('inventory');
//        $('<div>').addClass('characterMenuTitle').text("物品").appendTo(z);
        for (let i=0;i<this.items.length;++i) {
            let item = this.items[i];            
            let dom = $('<div>').addClass('inventoryRow');
            let name =$('<div>').addClass('row_key').text(item.name + (item.equipped ?  "*" : ""));
            let tip = $('<div>').addClass("tooltip bottom right").text(item.description);
            tip.appendTo(dom);
            name.appendTo(dom);

            let sub_menu = new ItemMenu(); 
            sub_menu.init(item);
            sub_menu.parent = game.characterMenu;
            sub_menu.menu.appendTo(dom);
        
            dom.click(function() {
                sub_menu.open();                
            });

            dom.appendTo(z);
        }
        return z;
    }

    draw() {        
        $('#inventory div').each(function() {
			$(this).remove();					
        });

        for (let i=0;i<this.items.length;++i) {
            let item = this.items[i];            
            let dom = $('<div>').addClass('inventoryRow');
            let name =$('<div>').addClass('row_key').text(item.name + (item.equipped ?  "*" : ""));
            let tip = $('<div>').addClass("tooltip bottom right").text(item.description);

            tip.appendTo(dom);
            name.appendTo(dom);            
            dom.appendTo('div#inventory');
        }

        /*let p = game.player;
        if (p) {
            let weapon_name = p.weapon ? p.weapon.name : "無";
            let weapon_description = p.weapon ? p.weapon.description : "";
            $("#weapon > .row_key").text("武器 " + weapon_name);
            $("#weapon > .tooltip").text(weapon_description);
        }*/
    }



    open() {        
        
    }

    handleEvent(e: any) {
        /*
        let code = e.keyCode;
        if (ROT.KEYS.VK_A <= code && code <= ROT.KEYS.VK_Z) {            
            let idx = code - ROT.KEYS.VK_A;
            let item = this.items[idx];
            item.use(this.owner);
            if (item.durability == 0) {                
                this.items.splice(idx, 1);
                this.draw();
            }
        }        
        window.removeEventListener("keydown", this);
        window.addEventListener("keydown", game.player);        
        */
    }
}