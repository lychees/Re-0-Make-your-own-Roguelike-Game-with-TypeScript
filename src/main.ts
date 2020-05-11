import * as ROT from "rot-js";
import * as $ from "jquery";

const MAP_WIDTH = 60;
const MAP_HEIGHT = 30;
const DISPLAY_WIDTH = 40;
const DISPLAY_HEIGHT = 25;

function pop_random(A: Array<[number, number]>): [number, number] {
    var index = Math.floor(ROT.RNG.getUniform() * A.length);    
    return A[0];
}

class Camera {
    x: number;
    y: number;
    ox: number;
    oy: number;

    constructor() {        
        const o = game.map.display.getOptions();
        const w = o.width, h = o.height;
        this.x = game.player.x;
        this.y = game.player.y;
        this.ox = Math.floor(w/2)
        this.oy = Math.floor(h/2);        
        this.adjust();
    }

    adjust() {
    	const o = game.map.display.getOptions();
        const w = o.width, h = o.height;

        if (this.x - this.ox < 0) this.ox += this.x - this.ox;    	
        if (game.map.width - this.x + this.ox < w) this.ox -= (game.map.width - this.x + this.ox) - w + 1;
            	
    	if (this.y - this.oy < 0) this.oy += this.y - this.oy;        
    	if (game.map.height - this.y + this.oy < h) this.oy -= (game.map.height - this.y + this.oy) - h + 1;  
    }    

    move(dx:number, dy:number) {
    	this.x += dx; this.y += dy;
        const o = game.map.display.getOptions();
        const w = o.width, h = o.height;
        const ww = Math.floor(w/2);
        const hh = Math.floor(h/2);

        if (dx > 0 && this.x < ww || dx < 0 && this.x > game.map.width - ww) {
        	this.ox += dx; 
        } else if (dy > 0 && this.y < hh || dy < 0 && this.y > game.map.height - hh){
        	this.oy += dy;
        } else {
        	this.adjust();	
        }
    }
}

class Player {
    x: number;
    y: number;
    ch: string;
    color: string;
    dir: number;

    constructor(x: number, y: number) {        
        this.x = x;
        this.y = y;
        this.ch = "伊";
        this.color = "#0be";
        this.dir = 1;
    }
    draw() {
        game.map.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, this.color);        
    }
    act() {
        game.engine.lock();
        window.addEventListener("keydown", this);
    }     
    handleEvent(e) {
        var keyMap = {};
        keyMap[38] = 0;
        keyMap[33] = 1;
        keyMap[39] = 2;
        keyMap[34] = 3;
        keyMap[40] = 4;
        keyMap[35] = 5;
        keyMap[37] = 6;
        keyMap[36] = 7;
        var code = e.keyCode;
        if (!(code in keyMap)) {
            return;
        }
        let new_dir = keyMap[code];
        if (this.dir !== new_dir) {
            Logs.notify("你向四处张望。");
            this.dir = new_dir;
        } else {
            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];        
            if (!((xx + "," + yy) in game.map.layer)) return;        
            game.camera.move(d[0], d[1]);
            this.x = xx;
            this.y = yy;
        }
        window.removeEventListener("keydown", this);
        game.engine.unlock();
        game.draw();
    }    
}

class Map {
    display: any;
    width: number;
    height: number;
    layer: {};
    shadow: {};

    constructor() {
        this.display = new ROT.Display({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            fontSize: 24,            
            fontFamily: 'sans-serif',
        });
        document.body.appendChild(this.display.getContainer());
        
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        this.shadow = {};
        let free_cells = [];
        let digger = new ROT.Map.Digger(this.width, this.height);
        digger.create((x, y, value) => {
            if (value) return; 
            var key = x + "," + y;
            this.layer[key] = "　";
            free_cells.push([x, y]);
        });

        let p = pop_random(free_cells);
        game.player = new Player(p[0], p[1]);
    }
    light(key) {        
        let t = this.layer[key];
        return t === "　";        
    }
    gen_shadow(p: Player, color: string) {
        let fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
            const key = x+','+y; 
            return this.light(key);
        });

        fov.compute180(p.x, p.y, 9, p.dir, (x, y, r, visibility) => {            
            const key = x+','+y;   
            this.shadow[key] = color;
        });
    }
    draw_tile_at(x, y, key) {
        if (this.layer[key] === '　') {
            this.display.draw(x, y, this.layer[key]);
        } else {
            if (this.shadow[key]) {
                this.display.draw(x, y, "墻", this.shadow[key]);
            } else {
                this.display.draw(x, y, null);
            }
        }
    }    
    draw() {
        const o = this.display.getOptions(); 
        let w = o.width, h = o.height; 
        this.gen_shadow(game.player, '#fff');
        for (let x=0;x<w;++x) {
        	for (let y=0;y<h;++y) {
                let xx = x + game.camera.x - game.camera.ox;
                let yy = y + game.camera.y - game.camera.oy;
                let key = xx+','+yy;
                this.draw_tile_at(x, y, key);
        	}
        }
        this.gen_shadow(game.player, '#555');
    }
}

class Game {
    
    map: Map;
    player: Player;
    engine: any;
    camera: Camera;

    init() {
        this.map = new Map();                     
        this.camera = new Camera();

        let scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();

        this.draw();
    }
    draw() {     
        this.map.draw();
        this.player.draw();
    }
};

let game = new Game();
game.init();

let Logs = {
	
	init: function() {
        var elem = $('<div>').attr({
            id: 'logs',
            class: 'logs'
        });    
        $('<div>').attr('id', 'logs_gradient').appendTo(elem);        
        //elem.appendTo($("#logs")); 
	},
	
	logs: [],			
	notifyQueue: {},
		
	notify: function(text) {      
        console.log(text)  ;
        this.logs.push(text);
        this.printMessage(text);
	},
	
	clearHidden: function() {
		var bottom = $('#logs_gradient').position().top + $('#logs_gradient').outerHeight(true);		
		$('.logs').each(function() {		
			if($(this).position().top > bottom){
				$(this).remove();
			}		
		});		
	},
	
	printMessage: function(t) {
		var text = $('<div>').addClass('logs').css('opacity', '0').text(t).prependTo('div#logs');
		text.animate({opacity: 1}, 500, 'linear', () => {
			this.clearHidden();
		});
	},
};

Logs.init();