import * as Creature from "../creature";
import * as Map from "../map";
import { game } from "../main";

export function add_shadow(c1) {
    if (c1[0] !== '#') {
        return c1;
    }    
    let r = c1.charCodeAt(1); if (r >= 97) r -= 97 - 10; else r -= 48;
    let g = c1.charCodeAt(2); if (g >= 97) g -= 97 - 10; else g -= 48;
    let b = c1.charCodeAt(3); if (b >= 97) b -= 97 - 10; else b -= 48;
    r = Math.floor(r / 2) + 48;
    g = Math.floor(g / 2) + 48;
    b = Math.floor(b / 2) + 48;
    let c2 = '#' + String.fromCharCode(r) + String.fromCharCode(g) + String.fromCharCode(b);    
    return c2;
}

export class Particle {
    name: string;
    ch: string;
    color: string;
    bg: string;
    caster: Creature.Creature;
    x: number; y: number;
    dx: number; dy: number;    
    energy: number; 
    dmg: number;    
    map: Map.Map;
    constructor () {
    }
    disappear() {                
        let p = this.map.particles;
        let idx = p.findIndex((e) => e == this);
        p.splice(idx, 1);
    
        game.scheduler.remove(this);
    }
    draw() {
        let x = Math.floor(this.x);
        let y = Math.floor(this.y);
        let s = game.map.shadow[x+','+y];
        if (s === '#fff') {
            game.display.draw(x - game.camera.x + game.camera.ox, y - game.camera.y + game.camera.oy, '火', '#fe2');
        } else if (s === '#555') {
            game.display.draw(x - game.camera.x + game.camera.ox, y - game.camera.y + game.camera.oy, '火', add_shadow('#fe2'));            
        }
    }
    act() {
        //game.scheduler.setDuration( 1000 );
        //return ;
        /*if (this.dx < 0) {
            this.x - Math.floor(this.x)
        }*/

        game.scheduler.setDuration( 1000 );

        this.x += this.dx;
        this.y += this.dy;
        this.energy -= Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        let x = Math.floor(this.x);
        let y = Math.floor(this.y);        

        for (let a of this.map.agents) {
            if (a.x == x && a.y == y && a != this.caster) {
                a.hp -= this.dmg;
                this.caster.logs.notify(this.name + ' 對 ' + a.name + ' 造成了 ' + this.dmg + ' 點傷害');
                if (a.hp <= 0) a.dead(this.caster);
            }
        }
        
        if (!this.map.pass_without_agents(x, y) || this.energy < 0) {
            this.disappear();
        }
    }
}

export class Fireball extends Particle{



    constructor(caster, x, y, dx, dy, energy, dmg) {
        super();
        this.name = '火球術';
        this.ch = '火';
        this.map = game.map;
        this.caster = caster;
        this.x = x; this.y = y;
        this.dx = dx; this.dy = dy;
        this.energy = energy;
        this.dmg = dmg;

        game.scheduler.add(this, true, 0);        
    }
    act() {
        super.act();
    }
}