
import { Creature } from "./creature";
import * as Buff from "../buff";
import * as Item from "../item/item";
import { hostile } from "../AI/hostile";
import { game, event } from "../main";

export class Human extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "人類";
        this.ch = "人";
        (new Buff.Human_Race()).append(this);
    }
}

export class 阿卡拉 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "阿卡拉";
        this.ch = "阿";
        this.color = "#d0d";
        this.inventory.push(new Item.Equip.Accessory.HP_Ring());
        this.inventory.push(new Item.Equip.Accessory.MP_Ring());
        this.inventory.push(new Item.Food.Apple());
        this.inventory.push(new Item.Food.Banana());
        for (let i=0;i<3;++i) this.inventory.push(new Item.Potion.HP_Potion());
        for (let i=0;i<3;++i) this.inventory.push(new Item.Potion.MP_Potion());     
    }
    react() {
        let btns = [
            {
                text: "对话",
                nextScene: 'talk',
            },
            {
                text: "交易",
                onChoose: game.characterMenu.toggle.bind(game.characterMenu, this)
            },
            {
                text: '再見',                
            },
        ];
      
        let options = {
            title: this.name,
            scenes: {
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

        event.startEvent(options);
    }
}

export class 恰西 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "恰西";
        this.ch = "恰";
        this.color = "#dd0";
    }
}

export class 卡夏 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "卡夏";
        this.ch = "卡";
        this.color = "#d11";
    }
}

export class 瓦瑞夫 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "瓦瑞夫";
        this.ch = "瓦";
        this.color = "#33d";
    }
}
