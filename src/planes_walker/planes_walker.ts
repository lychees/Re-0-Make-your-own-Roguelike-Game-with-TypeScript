import { game } from "../main";
import $ from "jquery";
import { Creature } from "../creature/creature";
import * as Utils from "../utils/utils";
import { Tile } from "../tile/tile";
import DiscreteShadowcasting from "rot-js/lib/fov/discrete-shadowcasting";

export class Card extends Tile {

	description: string;
	owner: Creature;

    constructor() {
		super();
		this.name = '旅法牌';
		this.description = "Yet another 旅法牌";
		this.ch = '�';
    }
}

export class Normal_Attack extends Card {

	atk: {};

	constructor() {
		super();
		this.atk = {};
		this.atk['d1'] = 2;
		this.name = '普攻';
		this.description = "普通攻击是全体二连击，这样的妈妈你喜欢吗？";
	}
}

export class Fireball extends Normal_Attack {

	constructor() {
		super();
		this.atk['d1'] = 4;
		this.name = '火球術';
		this.description = "Horo！";
	}
}

export class Run extends Card {

	constructor() {
		super();
		this.name = '疾跑';
		this.description = "Horo！";
	}
}

export class Thinking extends Card {

	constructor() {
		super();
		this.name = '沉思';
		this.description = "思考";
	}
}



export class Menu {
	parent: any;
	active: Number;
	constructor() {
		this.active = 0;
	}
	open() {
		this.draw();
	}
	close() {
		this.parent.draw();
	}
	draw() {

	}
}


export class Deck extends Menu {
	list = [];
	constructor() {
		super();
		this.list = [];
		this.onmouse = () => {
			this.close();
		}
	}
	onmouse() {

	}
	open() {
		this.draw();		
	}
	draw() {
		const o = game.display.getOptions(); 
		//let w = o.width, h = ; 
		let w = 32, h = 7;
		let x0 = 1, y0 = o.height-h-1;
		
		//game.display.draw(9, 5, '┌─', '#fff');
		for (let x=x0;x<x0+w;++x) {
			for (let y=y0;y<y0+h;++y) {
				let ch = null;
				if (x == x0 || x == x0+w-1) {
					ch = '│';
					if (x == x0) {
						if (y == y0) ch = '┌';
						else if (y == y0+h-1) ch = '└';
					} else {
						if (y == y0) ch = '┐';
						else if (y == y0+h-1) ch = '┘';
					}
				} else if (y == y0 || y == y0+h-1) {
					ch = '──';
				}            
				game.display.draw(x, y, ch, '#fff');
			}
		}

		for (let i=0;i<this.list.length;++i) {
			let x0 = 1, y0 = o.height-h;
			let x = x0 + Math.floor(i/5)*5; let y = y0 + (i % 5);
			if (this.active == i) {
				game.display.drawText(x, y, "%c{#fff}%b{#111}" + this.list[i].name, 32);
			} else {
				game.display.drawText(x, y, this.list[i].name, 32); 
			}
		}
	}
};
export class Hand extends Deck {
	owner: Creature;
	constructor() {
		super();
	}
};

export class Player {
	p: Creature;
	hand: Hand;
	deck: Deck;	
	constructor(p: Creature) {
		this.p = p;
		this.deck = new Deck();
		this.hand = new Hand();		

		this.deck.parent = this;
		let d = this.deck.list;
		d.push(new Normal_Attack()) ;
		d.push(new Normal_Attack()) ;
		d.push(new Normal_Attack()) ;
		d.push(new Normal_Attack()) ;
		
		d.push(new Fireball());
		d.push(new Fireball());
		d.push(new Fireball());
		d.push(new Fireball());
		
		d.push(new Thinking());		
		d.push(new Thinking());
		d.push(new Run());
		
	}

	draw_status() {
		if (this.p == game.player) {

			const o = game.display.getOptions(); 
			//let w = o.width, h = ; 
			let w = 10, h = 5;
			let x0 = 1, y0 = o.height-h-1;
			
			//game.display.draw(9, 5, '┌─', '#fff');
			for (let x=x0;x<x0+w;++x) {
				for (let y=y0;y<y0+h;++y) {
					let ch = null;
					if (x == x0 || x == x0+w-1) {
						ch = '│';
						if (x == x0) {
							if (y == y0) ch = '┌';
							else if (y == y0+h-1) ch = '└';
						} else {
							if (y == y0) ch = '┐';
							else if (y == y0+h-1) ch = '┘';
						}
					} else if (y == y0 || y == y0+h-1) {
						ch = '──';
					}            
					game.display.draw(x, y, ch, '#fff');
				}
			}
			game.display.draw(x0+1, y0, null, '#fff');
			game.display.draw(x0+2, y0, null, '#fff');
			game.display.draw(x0+3, y0, null, '#fff');
			game.display.draw(x0+4, y0, null, '#fff');
			game.display.draw(x0+5, y0, '─', '#fff');
			game.display.draw(x0+3-0.5, y0, this.p.name);

			game.display.drawText(x0+7, y0, ''+this.deck.list.length);

			game.display.drawText(x0+1, y0+1, '%c{red}HP:' + this.p.hp + '/' + this.p.HP); 
			game.display.drawText(x0+1, y0+2, '%c{blue}MP:' + this.p.mp + '/' + this.p.MP);
			game.display.drawText(x0+1, y0+3, '%c{green}SP:' + this.p.sp + '/' + this.p.SP);
			
		} else {

		}

	}

	draw_hand() {
		/*
		const o = game.display.getOptions(); 
		//let w = o.width, h = ; 
		let w = 24, h = 5;
		let x0 = 12, y0 = o.height-h-1;

		
		//game.display.draw(9, 5, '┌─', '#fff');
		for (let x=x0;x<x0+w;++x) {
			for (let y=y0;y<y0+h;++y) {
				let ch = null;
				if (x == x0 || x == x0+w-1) {
					ch = '│';
					if (x == x0) {
						if (y == y0) ch = '┌';
						else if (y == y0+h-1) ch = '└';
					} else {
						if (y == y0) ch = '┐';
						else if (y == y0+h-1) ch = '┘';
					}
				} else if (y == y0 || y == y0+h-1) {
					ch = '──';
				}            
				game.display.draw(x, y, ch, '#fff');
			}
		}

		for (let i=0;i<this.hand.list.length;++i) {
			let x0 = 14, y0 = o.height-h;
			let x = x0 + Math.floor(i/3)*5; let y = y0 + (i % 3);
			if (this.active == i) {
				game.display.drawText(x, y, this.hand.list[i].name, '#222');
			} else {
				game.display.drawText(x, y, this.hand.list[i].name); 
			}
		}*/
	}

	draw_deck() {
		// alert(123);
	}

	draw() {

		this.draw_status();
		this.draw_hand();

        //game.display.drawText(10, 5, "----- %c{red}伊莎貝拉", 18);
        /*game.display.drawText(10, 6, "│                           │", 16);
        game.display.drawText(10, 7, "│                           │", 16);
        game.display.drawText(10, 8, "│                           │", 16);
        game.display.drawText(10, 9, "└───────────────────────────┘", 16);*/

        /*
        let d = new Date();
        d.setTime(Math.floor(this.scheduler.getTime()));
        $("#TIME > .row_key").text(d.toUTCString());
        $("#SCORE > .row_key").text("SCORE:" + game.score);
        */

	}
}

export class Battle extends Menu {

	p1: Player;
	p2: Player;

	deck: Menu;
	
	constructor(p1: Creature, p2: Creature) {
		super();
		this.p1 = new Player(p1);
		this.p2 = new Player(p2);

		$('#ROT>canvas').off('mousedown');

        $('#ROT>canvas').mousedown((e) => {
            let y = e.offsetY;
            let x = e.offsetX ; 
            x /= 24; x = Math.floor(x); x += game.camera.x - game.camera.ox; x += 1;
            y /= 24; y = Math.floor(y); y += game.camera.y - game.camera.oy;
            //let l = game.map.layer[x+','+y];
			//alert(x + ',' + y + ',' + l[l.length-1].ch);
			
			//this.p1.draw_deck();
			this.p1.deck.open();
		});
	}
	draw() {
		this.p1.draw();
		this.p2.draw();		
	}

	/*onmouse() {

	}
*/
}



/*
export class Logs {

    logs: Array<string>;

    constructor() {
		this.logs = Array<string>();
		if (fb) {
			this.init();
			fb = false;
		}
    }
	
	init() {		
        var elem = $('<div>').attr({
            id: 'logs',
            class: 'logs'
        });    
        $('<div>').attr('id', 'logs_gradient').appendTo(elem);        
        elem.appendTo($("div#wrapper"));        
	}
		
	push(text: string) {      
        this.logs.push(text);
    }
    
    notify(text: string) {              
		this.push(text);
		if (this === game.player.logs) {
			this.printMessage(text);
		}
	}
	
	clearHidden() {
		var bottom = $('#logs_gradient').position().top + $('#logs_gradient').outerHeight(true);		
		$('.logs').each(function() {		
			if($(this).position().top > bottom){
				$(this).remove();
			}		
		});		
	}
	
	printMessage(t: string) {
		let text = $('<div>').addClass('logs').css('opacity', '0').text(t).prependTo('div#logs');
		text.animate({opacity: 1}, 500, 'linear', () => {
			this.clearHidden();
		});
	}
};
*/