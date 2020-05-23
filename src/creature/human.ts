
import { Creature } from "./creature";
import * as Buff from "../buff";
import * as Item from "../item/inventory";
import { hostile } from "../AI/hostile";

export class Human extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "人類";
        this.ch = "人";
        (new Buff.Human_Race()).append(this);
    }
}

export class 阿卡拉 extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "阿卡拉";
        this.ch = "阿";
        this.color = "#d0d";
        (new Buff.Human_Race()).append(this);
    }
}

export class 恰西 extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "恰西";
        this.ch = "恰";
        this.color = "#dd0";
        (new Buff.Human_Race()).append(this);
    }
}

export class 卡夏 extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "卡夏";
        this.ch = "卡";
        this.color = "#d11";
        (new Buff.Human_Race()).append(this);
    }
}

export class 瓦瑞夫 extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "瓦瑞夫";
        this.ch = "瓦";
        this.color = "#33d";
        (new Buff.Human_Race()).append(this);
    }
}
