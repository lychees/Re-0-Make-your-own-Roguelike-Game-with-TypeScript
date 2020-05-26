import * as ROT from "rot-js";
import * as Utils from "../utils/utils";
import { game, event as eventt } from "../main";
import { follow } from "../AI/follow";

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
        this.inventory.push(new Item.Potion.HP_Potion());
        this.inventory.push(new Item.Potion.MP_Potion());
        this.inventory.push(new Item.Potion.SP_Potion());
    }
    dead(murderer: any) {
        super.dead(murderer);
        this.logs.notify("眼前一片漆黑，你掛了")
        game.SE.playSE("狂父/[びたちー]少女（悲鳴）.ogg");
    }

    react() {
        let btns = [
            {
                text: "对话",
                nextScene: 'talk',
            },
            {
                text: "交換",
                onChoose: game.characterMenu.toggle.bind(game.characterMenu, this)
            },            {
                text: "命令",
                nextScene: 'command',
            },
            {
                text: '再見',                
            },
        ];
      
        let options = {
            title: this.name,
            scenes: {
                'command': {
                    text: [
                        '那麼接下來？'
                    ],  
                    buttons: [
                        {
                            text: '跟隨',
                            onChoose: this.act = follow.bind(this)
                        },
                        {
                            text: '待命',
                            onChoose: this.modify_alignment_good_to.bind(game.player, 0)
                        },
                        {
                            text: '委任',
                            onChoose: this.modify_alignment_good.bind(game.player, -1)
                        },
                        {
                            text: '多人同機',
                            onChoose: this.modify_alignment_good.bind(game.player, -1)
                        },
                        {
                            text: '網絡通信',
                            onChoose: this.modify_alignment_good.bind(game.player, -1)
                        },
                    ]  
                },
                'start': {
                    text: [
                        '你好，陌生人。',
                    ],
                    buttons: btns
                },
                'talk': {
                    text: [
                        '我是阿卡拉，目盲之眼这个修女会的高等女教士。欢迎你们来到我们的营地, 但恐怕我们只能在这些危壁之中, 提供简陋的避风之处。\
                        你可以看到，我们古老的修女会已经陷入奇怪的诅咒中。我们用来看守通往东方大门的伟大城塞, 已经被邪恶的女恶魔 —— 安达利尔所占领。',
                        '我到现在还无法相信…但是她把许多曾经是我们姊妹的萝格们变成我们的敌人，并把我们赶出祖先留下来的家园。现在，最后一个修女会的守护者，可能早就死亡或是在荒野中倒下了。\
                        我恳求你，陌生人，请你帮助我们。找到一个方法去除这个可怕的诅咒, 我们就以对你不变的忠诚为代价。'
                    ],  
                    buttons: [
                        {
                            text: '應允',
                            onChoose: this.modify_alignment_good.bind(game.player, 1)
                        },
                        {
                            text: '沈默',
                            onChoose: this.modify_alignment_good_to.bind(game.player, 0)
                        },
                        {
                            text: '拒絕',
                            onChoose: this.modify_alignment_good.bind(game.player, -1)
                        },
                    ]          
                }
            }
        };

        /*
        buttons: {
            'see you': {
                text: '再見',
            },
        }     */     

        eventt.startEvent(options);
    }
    
    act() {
        console.log(this.name);
        game.draw();
        game.active_player = this;        
        game.player = this;
        this.focus();
        game.draw();
        game.engine.lock();        
        window.addEventListener("keydown", this);
    }
    handleEvent(e) {

        console.log(this.name, this.x, this.y);
        
        event.preventDefault();
        
        let code = e.keyCode;        
        let keyMap = {};
        
        keyMap[ROT.KEYS.VK_UP] = 0; 
        keyMap[33] = 1;
        keyMap[ROT.KEYS.VK_RIGHT] = 2;
        keyMap[34] = 3;
        keyMap[ROT.KEYS.VK_DOWN] = 4;
        keyMap[35] = 5;
        keyMap[ROT.KEYS.VK_LEFT] = 6;
        keyMap[36] = 7;

        if (code == ROT.KEYS.VK_Q) {
            window.removeEventListener("keydown", this);
            game.engine.unlock();

            return;                  
        }
        

        if (game.player != game.active_player || code == ROT.KEYS.VK_TAB) {
            game.player = game.next_player();
            game.player.focus();
            game.draw();
            game.SE.playSE("select.wav");
            return;                  
        }

        if (game.characterMenu.opened == true) {
            game.characterMenu.close();
            return;
        }
        
        if (code == ROT.KEYS.VK_I) { 
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
            game.map.enter(this.x, this.y, this);            
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

//        console.log(this.name, this.x, this.y);
        
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
                        //game.player.logs.printMessage;
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

