
import { Creature } from "./creature";
import * as Buff from "../buff";
//import * as Item from "../item/inventory";
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
        (new Buff.Human_Race()).append(this);
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
                        '...',
                    ],
                    buttons: btns
                },
                'talk': {
                    text: [
                        '我是阿卡拉, 目盲之眼这个修女会的高等女教士. 欢迎你们来到我们的营地, 但恐怕我们只能在这些危壁之中, 提供简陋的避风之处',
                    ],   
                    buttons: {
                        'see you': {
                            text: '再見',
                        },
                    }             
                }
            }
        };

        event.startEvent(options);
    }
}

export class 恰西 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "恰西";
        this.ch = "恰";
        this.color = "#dd0";
        (new Buff.Human_Race()).append(this);
    }
}

export class 卡夏 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "卡夏";
        this.ch = "卡";
        this.color = "#d11";
        (new Buff.Human_Race()).append(this);
    }
}

export class 瓦瑞夫 extends Human {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "瓦瑞夫";
        this.ch = "瓦";
        this.color = "#33d";
        (new Buff.Human_Race()).append(this);
    }
}
