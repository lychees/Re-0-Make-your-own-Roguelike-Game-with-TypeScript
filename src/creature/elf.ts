
import { Creature } from "./creature";
import * as Buff from "../buff";
import * as Item from "../item/item";
import { hostile } from "../AI/hostile";
import { game, event as eventt } from "../main";
import * as AI from "../AI/AI";

export class Elf extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "精靈";
        this.ch = "精";
        (new Buff.Elf_Race()).append(this);
    }
}

export class Elf_Guard extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "衛兵";
        this.ch = "衛";
        this.color = "#c11";        
        this.z = 3;
        /*let t = new Item.Equip.Weapon.Sword();
        this.inventory.push(t);
        t.equip();*/
        this.act = hostile.bind(this);
    }
}

export class Lee extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "李貝爾";
        this.ch = "李";
        this.color = "#ca3";        
        this.z = 3;
        /*let t = new Item.Equip.Weapon.Sword();
        this.inventory.push(t);
        t.equip();*/
    }
}

export class Isabella extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "伊莎貝拉";
        this.ch = "伊";
        this.color = "#0be";        
        this.z = 100;

        (new Buff.Dex_Talent(1)).append(this);
        (new Buff.Int_Talent(1)).append(this);              
        (new Buff.MP_Talent(10)).append(this);        
        (new Buff.Sickly(1)).append(this);        
    }
    injured(d: number) {
        game.SE.playSE("madofaza/aya_e.ogg");
        super.injured(d);
    }    
    dead(murderer: any) {
        super.dead(murderer);
        this.logs.notify("眼前一片漆黑，你掛了");
        game.SE.playSE("madofaza/aya_dead.ogg");
    }    

    talk() {
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
                            onChoose: () => {
                                AI.follow(this, game.player);
                                //this.act = follow.follow.bind(this);
                                //this.shift_react = this.react;                                
                                //this.react = follow.swap.bind(this, game.player);
                            }
                        },
                        {
                            text: '待命',
                            onChoose: () => {
                                this.act = AI.stand_by.bind(this);
                            }
                        },
                        {
                            text: '委任',
                            onChoose: () => {
                                this.act = AI.stand_by.bind(this);
                            }
                        },
                        {
                            text: '多人同機',
                            onChoose: () => {
                                AI.local_player.bind(this);
                            }
                        },
                        {
                            text: '網絡通信',
                            onChoose: () => {

                            }
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
                        '嗯？'
                    ],  
                    buttons: [
                        {
                            text: '。。。',
                            onChoose: this.modify_alignment_good.bind(game.player, 1)
                        },
                        {
                            text: '哦。',
                            onChoose: this.modify_alignment_good_to.bind(game.player, 0)
                        },
                        {
                            text: '今天天气不错。',
                            onChoose: this.modify_alignment_good.bind(game.player, -1)
                        },
                    ]          
                }
            }
        };  

        eventt.startEvent(options);        
    }    
}

export class Luna extends Elf {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "璐娜";
        this.ch = "璐";
        this.color = "#1ad";        
        this.z = 100;

        (new Buff.Dex_Talent(1)).append(this);
        (new Buff.MP_Talent(20)).append(this);
    }
}