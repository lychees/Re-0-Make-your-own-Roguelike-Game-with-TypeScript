import * as ROT from "rot-js";
import $ from "jquery";
import { game } from "../main";
import { Creature } from "../creature";

export function get_avg_atk(atk: any) {
    let z = 0;
    for (const a in atk) {
        if (a[0] == 'd') {
            z += atk[a] * (1 + parseInt(a.substr(1))) / 2;
        }        
    }
    return z;
}

export class CharacterMenu {

	opened: boolean;
	owner: Creature;
	menu: any;
	
	constructor() {
		this.opened = false;
	}

	draw() {
		let p = this.owner;
		if (this.menu) {
			this.menu.remove();
		}		
		
		let t = $('<div>').attr('id', 'characterMenu').addClass('characterMenu').css('opacity', '0');
		t.animate({opacity: 1}, 200, 'linear');
	
		t.css('width', 800);
	
		$('<div>').addClass('characterMenuTitle').text(p.name).appendTo(t);
	
		
		let hp = $('<div>').attr('id', 'HP').addClass('perkRow');
		$('<div>').addClass('row_key').text("HP:" + p.hp + "/" + p.HP).appendTo(hp);
		$('<div>').addClass('tooltip bottom right').text(p.parse_hp_buffs()).appendTo(hp);
		hp.appendTo(t);	
	
		let mp = $('<div>').attr('id', 'MP').addClass('perkRow');
		$('<div>').addClass('row_key').text("MP:" + p.mp + "/" + p.MP).appendTo(mp);
		$('<div>').addClass('tooltip bottom right').text(p.parse_mp_buffs()).appendTo(mp);
		mp.appendTo(t);	
	
		let sp = $('<div>').attr('id', 'SP').addClass('perkRow');
		$('<div>').addClass('row_key').text("SP:" + p.sp + "/" + p.SP).appendTo(sp);
		$('<div>').addClass('tooltip bottom right').text(p.parse_sp_buffs()).appendTo(sp);
		sp.appendTo(t);	
	
		let atk = $('<div>').attr('id', 'ATK').addClass('perkRow');
		$('<div>').addClass('row_key').text("ATK:" + get_avg_atk(p.atk)).appendTo(atk);
		$('<div>').addClass('tooltip bottom right').text(p.parse_atk_buffs()).appendTo(atk);
		atk.appendTo(t);	
			
		let def = $('<div>').attr('id', 'DEF').addClass('perkRow');
		$('<div>').addClass('row_key').text("DEF:" + p.def).appendTo(def);
		$('<div>').addClass('tooltip bottom right').text(p.parse_def_buffs()).appendTo(def);
		def.appendTo(t);

		let str = $('<div>').attr('id', 'STR').addClass('perkRow');
		$('<div>').addClass('row_key').text("STR:" + p.str).appendTo(str);
		$('<div>').addClass('tooltip bottom right').text(p.parse_str_buffs()).appendTo(str);
		str.appendTo(t);	
	
		let dex = $('<div>').attr('id', 'DEX').addClass('perkRow');
		$('<div>').addClass('row_key').text("DEX:" + p.dex).appendTo(dex);
		$('<div>').addClass('tooltip bottom right').text(p.parse_dex_buffs()).appendTo(dex);
		dex.appendTo(t);	
		
		let con = $('<div>').attr('id', 'con').addClass('perkRow');
		$('<div>').addClass('row_key').text("CON:" + p.con).appendTo(con);
		$('<div>').addClass('tooltip bottom right').text(p.parse_con_buffs()).appendTo(con);
		con.appendTo(t);	
		
		let int = $('<div>').attr('id', 'int').addClass('perkRow');
		$('<div>').addClass('row_key').text("INT:" + p.int).appendTo(int);
		$('<div>').addClass('tooltip bottom right').text(p.parse_int_buffs()).appendTo(int);
		int.appendTo(t);	
		
		/*let wis = $('<div>').attr('id', 'wis').addClass('perkRow');
		$('<div>').addClass('row_key').text("WIS:" + p.wis).appendTo(wis);
		$('<div>').addClass('tooltip bottom right').text(detail.wis.join("\n")).appendTo(wis);
		wis.appendTo(t);	
		
		let cha = $('<div>').attr('id', 'cha').addClass('perkRow');
		$('<div>').addClass('row_key').text("CHA:" + p.cha).appendTo(cha);
		$('<div>').addClass('tooltip bottom right').text(detail.cha.join("\n")).appendTo(cha);
		cha.appendTo(t);*/

		let abi = $('<div>').addClass('abilitiesMenu');		
		$('<div>').addClass('abilitiesMenuTitle').text('能力').appendTo(abi);
		let abiBox = $('<div>').css('top', '-20px');
		//let abiBox = $('<div>');

		//<div id="abilities" class="menu" data-legend="">
//			<div class="inventoryRow abilitiesRow"><div class="tooltip bottom right">精靈是帶超凡氣質的魔法民族，活在世上但又不完全屬世。他們居於飄逸之地，在古代森林之中或在閃耀妖火的銀色尖塔之中，柔和音樂乘風而轉，輕柔芳香隨風飄盪。精靈喜歡自然與魔法、美術與藝術、詩詞與歌賦、及世上一切美好之事。

        for (let i=0;i<p.buffs.length;++i) {
            let b = p.buffs[i];
            let dom = $('<div>').addClass('inventoryRow').addClass('abilitiesRow');
            let name =$('<div>').addClass('row_key').text(b.name);
            let tip = $('<div>').addClass("tooltip bottom right").text(b.description);
            tip.appendTo(dom);
            name.appendTo(dom);            
            dom.appendTo(abiBox);
		}      
		
		$(abi).append(abiBox);
	
		
		$(t).append(abi);


		$(t).append($('</br>'));

		let equ = $('<div>').addClass('equipmentMenu');
		$('<div>').addClass('abilitiesMenuTitle').text('裝備').appendTo(equ);
		let equBox = $('<div>').css('top', '-20px');
		p.equipment.getDom().appendTo(equBox);
		$(equ).append(equBox);
		$(t).append(equ);				

		$(t).append($('</br>'));

		let inv = $('<div>').addClass('inventoryMenu');
		$('<div>').addClass('abilitiesMenuTitle').text('物品').appendTo(inv);
		let invBox = $('<div>').css('top', '-20px');
		p.inventory.getDom().appendTo(invBox);

		$(inv).append(invBox);
		$(t).append(inv);

		$('#wrapper').append(t);
		this.menu = t;
	}

	open(p: Creature) {
		this.owner = p;
		this.draw();
		this.opened = true;
		//game.SE.playSE("Wolf RPG Maker/[01S]cursor.ogg");
		game.SE.playSE("Wolf RPG Maker/[System]Enter02_Koya.ogg");

		window.removeEventListener("keydown", game.player);
		window.addEventListener("keydown", this);			
	}
	close() {
		this.menu.remove();
		this.opened = false;
		game.SE.playSE("Wolf RPG Maker/[01S]cancel.ogg");
		window.removeEventListener("keydown", this);
        window.addEventListener("keydown", game.player);        
	}

    handleEvent(e: any) {
        let code = e.keyCode;
        if (ROT.KEYS.VK_A <= code && code <= ROT.KEYS.VK_Z) {            
			let idx = code - ROT.KEYS.VK_A;
			if (idx < this.owner.inventory.items.length) {
            	let item = this.owner.inventory.items[idx];
				item.use(this.owner);
				if (item.durability == 0) {                
					this.owner.inventory.items.splice(idx, 1);                
				}
			}
            
        }
        this.close();        
    }

	toggle(p: Creature) {
		if (this.opened) {
			this.close(); 
		} else {
			
			this.open(p);
		}
	}
}