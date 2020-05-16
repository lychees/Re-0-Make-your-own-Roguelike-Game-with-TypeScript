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
	menu: any;
	
	constructor() {
		this.opened = false;
	}

	open(p: Creature) {
		let t = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
		t.animate({opacity: 1}, 200, 'linear');
	
		t.css('width', 1200);
	
		$('<div>').addClass('eventTitle').text(p.name).appendTo(t);
	
		let detail = p.abilities_detail();
		
		let hp = $('<div>').attr('id', 'HP').addClass('perkRow');
		$('<div>').addClass('row_key').text("HP:" + p.hp + "/" + p.HP).appendTo(hp);
		$('<div>').addClass('tooltip bottom right').text(detail.hp.join("\n")).appendTo(hp);
		hp.appendTo(t);	
	
		let mp = $('<div>').attr('id', 'MP').addClass('perkRow');
		$('<div>').addClass('row_key').text("MP:" + p.mp + "/" + p.MP).appendTo(mp);
		$('<div>').addClass('tooltip bottom right').text(detail.mp.join("\n")).appendTo(mp);
		mp.appendTo(t);	
	
		let sp = $('<div>').attr('id', 'SP').addClass('perkRow');
		$('<div>').addClass('row_key').text("SP:" + p.sp + "/" + p.SP).appendTo(sp);
		$('<div>').addClass('tooltip bottom right').text(detail.sp.join("\n")).appendTo(sp);
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
		$('<div>').addClass('tooltip bottom right').text(detail.str.join("\n")).appendTo(str);
		str.appendTo(t);	
	
		let dex = $('<div>').attr('id', 'DEX').addClass('perkRow');
		$('<div>').addClass('row_key').text("DEX:" + p.dex).appendTo(dex);
		$('<div>').addClass('tooltip bottom right').text(detail.dex.join("\n")).appendTo(dex);
		dex.appendTo(t);	
		
		let con = $('<div>').attr('id', 'con').addClass('perkRow');
		$('<div>').addClass('row_key').text("CON:" + p.con).appendTo(con);
		$('<div>').addClass('tooltip bottom right').text(detail.con.join("\n")).appendTo(con);
		con.appendTo(t);	
		
		let int = $('<div>').attr('id', 'int').addClass('perkRow');
		$('<div>').addClass('row_key').text("INT:" + p.int).appendTo(int);
		$('<div>').addClass('tooltip bottom right').text(detail.int.join("\n")).appendTo(int);
		int.appendTo(t);	
		
		let wis = $('<div>').attr('id', 'wis').addClass('perkRow');
		$('<div>').addClass('row_key').text("WIS:" + p.wis).appendTo(wis);
		$('<div>').addClass('tooltip bottom right').text(detail.wis.join("\n")).appendTo(wis);
		wis.appendTo(t);	
		
		let cha = $('<div>').attr('id', 'cha').addClass('perkRow');
		$('<div>').addClass('row_key').text("CHA:" + p.cha).appendTo(cha);
		$('<div>').addClass('tooltip bottom right').text(detail.cha.join("\n")).appendTo(cha);
		cha.appendTo(t);
		$('#wrapper').append(t);
		this.menu = t;
		this.opened = true;
		game.SE.playSE("Wolf RPG Maker/[01S]cursor.ogg");
	}
	close() {
		this.menu.remove();
		this.opened = false;
		game.SE.playSE("Wolf RPG Maker/[01S]cancel.ogg");
	}
	toggle(p: Creature) {
		if (this.opened) {
			this.close(); 
		} else {
			this.open(p);
		}
	}
}


export function openCharacterMenu(p: Creature) {

	/*
	let z = {
		title: null,
		scenes: null
	};

	z.title = p.name;
	z.scenes = {
        'start': {
            text: [
                'test'
            ],
            buttons: {
                'open': {
                    text: '123',
                    nextScene: {1: 'open'}
                },
                'destroy': {
                    text: '暴力破壞',
                    nextScene: {1: 'destory'}
                },
                'leave': {
                    text: '離開它，這或許是一個陷阱。',
                    nextScene: 'end'
                }
            }
		}
	}
	return z;
	*/




/*

	$("#DEF > .row_key").text("DEF:" + this.player.def);
	$("#DEF > .tooltip").text(this.player.parse_def_buffs());

	$("#STR > .row_key").text("STR:" + this.player.str);
	$("#STR > .tooltip").text(detail.str.join("\n"));
	$("#DEX > .row_key").text("DEX:" + this.player.dex);
	$("#DEX > .tooltip").text(detail.dex.join("\n"));
	$("#CON > .row_key").text("CON:" + this.player.con);
	$("#CON > .tooltip").text(detail.con.join("\n"));
	$("#INT > .row_key").text("INT:" + this.player.int);
	$("#INT > .tooltip").text(detail.int.join("\n"));
	$("#WIS > .row_key").text("WIS:" + this.player.wis);
	$("#WIS > .tooltip").text(detail.wis.join("\n"));
	$("#CHA > .row_key").text("CHA:" + this.player.cha);
	$("#CHA > .tooltip").text(detail.cha.join("\n"));	*/


	/*
	$('<div>').attr('id', 'description').appendTo(Events.eventPanel());
	$('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
	Events.loadScene('start');*/

}