import * as ROT from "rot-js";
import * as Utils from "../utils/utils";
import { game } from "../main";

import * as Elf from "./elf";
import * as Item from "../item/item";
import * as Buff from "../buff";
import * as Particle from "../particle/particle";
import * as Corpse from "../tile/corpse";

import { attack, Creature } from "./creature";

// https://stackoverflow.com/questions/12143544/how-to-multiply-two-colors-in-javascript

export class Skill {
    hp: number;
    mp: number;
    sp: number;
    ready_duration: number;
    launch_duration: number;
    caster: Creature;
    constructor() {
    }
}

export class Fireball extends Skill {
    cacheHandleEvent: any;
    handleEvent(e) {

        let keyMap = {};

        keyMap[ROT.KEYS.VK_UP] = 0; 
//        keyMap[33] = 1;
        keyMap[ROT.KEYS.VK_RIGHT] = 2;
  //      keyMap[34] = 3;
        keyMap[ROT.KEYS.VK_DOWN] = 4;
    //    keyMap[35] = 5;
        keyMap[ROT.KEYS.VK_LEFT] = 6;
      //  keyMap[36] = 7;

        keyMap[ROT.KEYS.VK_W] = 0;
        keyMap[ROT.KEYS.VK_D] = 2;
        keyMap[ROT.KEYS.VK_S] = 4;
        keyMap[ROT.KEYS.VK_A] = 6;

        let code = e.keyCode;

        if (!(code in keyMap)) {
            this.caster.handleEvent = this.cacheHandleEvent.bind(this.caster);
            return;
        }

        let dir = keyMap[code];
        let d = ROT.DIRS[8][dir];
        let alice = this.caster;
        let x = alice.x;
        let y = alice.y;

        alice.dir = dir;
        game.SE.playSE("Wolf RPG Maker/[Effect]Fire1_panop.ogg");
        alice.logs.notify(alice.name + "施放了火球術");

        game.map.particles.push(new Particle.Fireball(alice, x+0.5, y+0.5, d[0], d[1], 12, 1000));
        this.caster.handleEvent = this.cacheHandleEvent.bind(this.caster);     
        game.draw();
    }
}


export class Player extends Elf.Isabella {

    constructor(x: number, y: number) {
        super(x, y);

        (new Buff.Cheating()).append(this);
        this.inventory.push(new Item.Equip.Weapon.Axes());    
        let t = new Item.Equip.Weapon.Sword();
        this.inventory.push(t);
        t.equip();

        this.inventory.push(new Item.Equip.Armor.Light_Armor());
        this.inventory.push(new Item.Equip.Accessory.HP_Ring());
        this.inventory.push(new Item.Equip.Accessory.MP_Ring());
        this.inventory.push(new Item.Food.Apple());
        this.inventory.push(new Item.Food.Banana());
    }
    dead(murderer: any) {
        super.dead(murderer);
        this.logs.notify("眼前一片漆黑，你掛了")
        game.SE.playSE("狂父/[びたちー]少女（悲鳴）.ogg");
    }
    act() {
        game.draw();
        game.engine.lock();
        window.addEventListener("keydown", this);
    }
    handleEvent(e) {
        let keyMap = {};

        keyMap[ROT.KEYS.VK_UP] = 0; 
        keyMap[33] = 1;
        keyMap[ROT.KEYS.VK_RIGHT] = 2;
        keyMap[34] = 3;
        keyMap[ROT.KEYS.VK_DOWN] = 4;
        keyMap[35] = 5;
        keyMap[ROT.KEYS.VK_LEFT] = 6;
        keyMap[36] = 7;
        


        let code = e.keyCode;
       
        if (keyMap[code] != undefined) {
            event.preventDefault();
        }

        if (game.characterMenu.opened == true) {
            game.characterMenu.close();
            return;
        }
        
        if (code == ROT.KEYS.VK_I) {                        
            // this.inventory.open();
            game.characterMenu.toggle(game.player);
            return;
        }

        if (code == ROT.KEYS.VK_R) {
            this.run();
            return;
        }

        if (code == ROT.KEYS.VK_F) {
            let t = new Fireball();
            t.caster = this;
            game.SE.playSE("Wolf RPG Maker/[Effect]Mystic1_panop.ogg");
            t.cacheHandleEvent = this.handleEvent;
            this.handleEvent = t.handleEvent.bind(t);
            return;
        }        


        if (code == 13 || code == 32) {
            //var key = this.x + "," + this.y;
            //let t = game.map.layer[key];
            game.map.enter(this.x, this.y, this);
            /*if (t) {                
                if (t.enter) {
                    t.enter(this);
                } else {
                }
            }*/
            return;
        }

        keyMap[ROT.KEYS.VK_W] = 0;
        keyMap[ROT.KEYS.VK_D] = 2;
        keyMap[ROT.KEYS.VK_S] = 4;
        keyMap[ROT.KEYS.VK_A] = 6;

        if (!(code in keyMap)) {
            return;
        }
        
        let new_dir = keyMap[code];
        
        if (e.shiftKey) {                    

            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];
            let layer = game.map.layer[xx+','+yy];
            let door = layer[layer.length - 1];
            if (door.ch == "門" || door.ch == "關") {
                door.trigger(this);
                game.scheduler.setDuration( 2000 );
            } else {
                this.logs.notify("你向四處張望");
                if (Utils.rand(5) == 0) this.sp_healing(1);            
                game.scheduler.setDuration( 1000 );
            }
        } else {
            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];
            
            
            game.scheduler.setDuration( 4000 );

            if (this.run_buff.owner == this && this.sp > 0) {
                if (this.dir == new_dir) {
                    game.scheduler.setDuration( 1000 );
                } else {
                    game.scheduler.setDuration( 2000 );
                }
                if (Utils.rand(10) == 0) this.sp -= 1;
            } else {                
                if (Utils.rand(10) == 0) this.sp_healing(1);
            }

            let attacked = false;
            for (let i=0;i<game.map.agents.length;++i) {
                let a = game.map.agents[i];
                if (a.x === xx && a.y === yy && a.hp > 0) {

                    if (a.react) {
                        a.react();
                    } else {                    
                        attack(this, a);
                        game.player.logs.printMessage;
                    }
                    attacked = true;                    
                    break;
                }
            }

            if (!attacked) {
                if (game.map.pass(xx, yy)) {
                    game.camera.move(d[0], d[1]);
                    this.x = xx;
                    this.y = yy;
                }
            }
        }

        this.dir = new_dir;
        window.removeEventListener("keydown", this);
        game.engine.unlock();
    }    
}

