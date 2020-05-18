import * as ROT from "rot-js";
import $ from "jquery";
import { game, rand, dice } from "./main";
import { Buff } from "./buff";
import { Menu } from "./UI/character";

export class ItemMenu extends Menu {
	parent: any;
	constructor() {
		super();
	}
	init(item: Item) {

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

        if (item instanceof Apple) {
            info.push({
                title: "吃",
                click: item.eat.bind(item)
            });
        }

        info.push({
            title: "丟棄",
            click: item.drop.bind(item)
        });

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
        this.close();           
    }	
}


export class Item {
    name: string;
    description: string;
    value: number;
    weight: number;
    durability: number;        
    ch: string;
    color: string;
    owner: any;

    drop() {
        if (this.owner) {
            let idx = this.owner.inventory.items.findIndex((e: Item) => e==this);            
            this.owner.inventory.items.splice(idx, 1);                        
            this.owner = null;
        }
    }

    constructor() {
        this.name = "？？？";
        this.description = "";
        this.value = 0;
        this.weight = 0;
        this.durability = 1;
        this.ch = "物";
        this.color = "#fff";
    }
}



export class Equip extends Item {
    equipped: boolean;    
    buff: Buff;
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
    }
}

export class Armor extends Equip {            
    unequip() {
        this.buff.remove();
        this.owner.equipment.armor = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.equipment.armor != null) {
            this.owner.equipment.armor.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.equipment.armor = this;
        this.equipped = true;        
    }
    constructor() {
        super();        
        this.name = "護甲";        
        this.description = "一件護甲";      
    }    
}

export class Accessory extends Equip {        
    unequip() {
        this.buff.remove();
        this.owner.equipment.accessory = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.equipment.accessory != null) {
            this.owner.equipment.accessory.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.equipment.accessory = this;
        this.equipped = true;        
    }
    constructor() {
        super();        
        this.name = "飾品";        
        this.description = "一件飾品";
    }    
}

export class Weapon extends Equip {    
    cd: number;    
    parse_atk() : string {
        let z = "";        
        for (let a in this.buff.atk) {
            z += this.buff.atk[a] + "d" + a + "\n";
        }
        return z;
    }
    unequip() {
        this.buff.remove();
        this.owner.equipment.weapon = null;
        this.equipped = false;     
    }
    equip() {
        if (this.owner.equipment.weapon != null) {
            this.owner.equipment.weapon.unequip();            
        }
        this.buff.append(this.owner);
        this.owner.equipment.weapon = this;
        this.equipped = true;        
    }    
    constructor() {
        super();        
        this.cd = 20;
        this.name = "武器";        
        this.description = "一把武器";      
    }    
}



export class Apple extends Item {    
    eat() {
        //game.SE.playSE("Wolf RPG Maker/[Effect]Healing3_default.ogg");           
        this.use(this.owner);
    }
    use(who: any) {
        //game.SE.playSE("Wolf RPG Maker/[Effect]Healing3_default.ogg");
        game.SE.playSE("吃.wav");
        let d_hp = who.hp_healing(1+rand(2));
        let d_sp = who.sp_healing(1+rand(2));
        who.logs.notify(who.name + "吃下了" + this.name + "，恢復了" + d_hp + "點生命和" + d_sp + "點體力。");
        this.durability -= 1;
        //console.log(this.durability);
        game.draw();
    }
    constructor() {
        super();
        this.name = "蘋果";
        this.durability = 1;
        this.description = "一個蘋果，每口 1/5 的概率，恢復 1d2 點 HP 和 1d2 點 SP";
    }
}

export class Axes extends Weapon {    
    constructor() {
        super();        
        this.cd = 30;
        this.name = "斧";
        this.ch = "斧";
        this.description = "一把斧頭\n";

        let b = new Buff();
        b.name = "斧";
        b.hp = 1;
        b.atk['d13'] = 1;
        b.description = "這個單位裝備了一把斧頭\n";
        b.description += b.parse();
        this.buff = b;        

        if (dice(3) <= 2) {
            this.name += ' 鋒利的';
            b.atk['d1'] = dice(3);
        }
        
        if (dice(3) <= 2) {
            this.name += ' 狂戰士的';
            b.atk['d2'] = dice(5);
        }

        if (dice(3) <= 2) {
            this.name += ' 矮人的';
            b.hp = dice(5);
        }

        this.description += b.parse();
    }    
}

export class Sword extends Weapon {
    constructor() {
        super();        
        this.cd = 30;
        this.name = "短劍";
        this.ch = "劍";
        this.description = "一把短劍\n";
        
        //this.ability = new Ability();
        //this.ability.name = this.name;

        let b = new Buff();
        b.name = "短劍";        
        b.atk['d6'] = 2;
        b.description = "這個單位裝備了一把短劍\n";
        b.description += b.parse();
        this.buff = b;

        if (dice(3) <= 2) {
            this.name += ' 鋒利的';
            b.atk['d1'] = dice(3);
        }

        if (dice(3) <= 2) {
            this.name += ' 矮人的';
            b.hp = dice(5);
        }        

        this.description += b.parse();
    }        
}

export class Water_Mirror extends Sword {
    constructor() {                
        super();
        this.name = "水鏡";
        this.description = "少女慣用的愛劍";        
    }
};

export class Necklace extends Equip {
    constructor() {
        super();
        this.name = "藍寶石項鏈";
        this.description = "雕刻有美人女在石礁上唱歌的藍寶石項鏈";          
    }
}

export class HP_Ring extends Accessory {
    constructor() {
        super();
        this.name = "生命戒指";
        this.description = "能夠激發生命潛力的戒指\n";

        let b = new Buff();
        b.name = "生命戒指";                
        b.hp = 3;
        b.description = "這個單位裝備了生命戒指\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();       
    }
}

export class MP_Ring extends Accessory {
    constructor() {
        super();
        this.name = "魔法戒指";
        this.description = "能夠增加法術潛力的戒指\n";

        let b = new Buff();
        b.name = "魔法戒指";                
        b.mp = 3;
        b.description = "這個單位裝備了魔法戒指\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}

export class Shield extends Armor {
    constructor() {
        super();
        this.name = "盾牌";
        this.description = "提供輕便防御的盾牌\n";

        let b = new Buff();
        b.name = "盾牌";                
        b.def = 1;
        b.description = "這個單位裝備了盾牌\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
    }
}



export class Light_Armor extends Armor {
    constructor() {
        super();
        this.name = "輕甲";
        this.description = "提供輕便防禦的護甲\n";

        let b = new Buff();
        b.name = "輕甲";                
        b.def = 1;
        b.description = "這個單位裝備了輕甲\n";
        b.description += b.parse();
        this.buff = b;
        this.description += b.parse();         
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
    }
}