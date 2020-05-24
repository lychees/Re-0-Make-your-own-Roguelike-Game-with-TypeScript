import $ from "jquery";
import { game } from "../main";
import { Menu } from "../UI/character";
import * as Item from "./item";
import { Equip } from "./equip/equip";

export class ItemMenu extends Menu {
	parent: any;
	constructor() {
		super();
	}
	init(item: Item.Item) {

        let info = [];
        
        if (item.owner.team == 'NPC') {
            info.push({
                title: "買",
                click: item.sell.bind(item, game.player)
            });
        }
        else {
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
        }

        
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
        for (let i=0;i<this.items.length;++i) {
            let item = this.items[i];            
            let dom = $('<div>').addClass('inventoryRow');
            let name =$('<div>').addClass('row_key').text(item.name + (item.equipped ?  "*" : "") + "  " + item.db + "/" + item.DB);
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
    }



    open() {                
    }

    handleEvent(e: any) {        
        // TODO(minakokojima): trigger 菜单事件
    }
}

