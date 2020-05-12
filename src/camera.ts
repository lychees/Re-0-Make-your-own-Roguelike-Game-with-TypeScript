import { game } from "./main";

export class Camera {
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