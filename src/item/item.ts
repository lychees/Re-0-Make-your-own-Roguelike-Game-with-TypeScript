import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";

/**
 * 物品
 *
 * @param owner 擁有者（不一定是 Creature，也有可能屬於箱子什麼的）
 * @param value 價值（不同的商品在不同的地區，不同的時間，對不同的人來收縮價值應該不同，這裡時一個賣給 NPC 時的底價，這個數值會順便產生對稀有度的估計）
 * @param w 重量，單位為克 
 * @param db 耐久度
 * @param DB 耐久度上限
 */
export class Item extends Utils.Element {

    owner: any;
    value: number;    
    w: number; 
    db: number; DB: number;
    
    /**
	 * @class 物品类
	 */
    constructor() {
        super();
        this.ch = "。";
        this.color = "#fff";
        this.db = 1; this.DB = 1; 
        this.value = 0; this.w = 1;        
    }
    /** 
     * 磨損
     * 
     * @param d [[fix]] is the counterpart.
     */
    abrasion(d: number) {
        this.db -= d;
        if (this.db <= 0) {
            this.drop();
        }
    }
    // 修复
    fix(d: number) {
        this.db = this.DB;        
    }

    /** 
     * 丟棄
     */
    drop() {
        if (this.owner != undefined) {
            let idx = this.owner.inventory.items.findIndex((e: Item) => e==this);            
            this.owner.inventory.items.splice(idx, 1);                        
            this.owner.w -= this.w;
            this.owner = null;            
        }
    }

    // TODO:(minakokojima) 寄放東西？
    /** 
     * 拿走
     */
    take(taker: Creature.Creature) {
        this.drop();
        taker.logs.notify(taker.name + " 從 " + this.owner.name + " 身上拿走了 " + this.name);        
        taker.inventory.push(this);
    }

    sell() {
        alert('買不起');
    }
}
/**
 * @class 安琪拉區域的金幣，很重
 */
export class Aquaria_Copper_Coin extends Item {
    constructor() {
        super();
        this.name = "安琪拉銅幣";
        this.db = 1; this.DB = 1;
        this.ch = "。";
        this.color = "#dc9";
        this.w = 30;
        this.value = 1;
    }
}

export class Aquaria_Silver_Coin extends Aquaria_Copper_Coin {
    constructor() {
        super();
        this.name = "安琪拉銀幣";
        this.db = 1; this.DB = 1;
        this.ch = "。";
        this.color = "#ddd";
        this.w = 40;
        this.value *= 1000;
    }
}
export class Aquaria_Gold_Coin extends  Aquaria_Silver_Coin {
    constructor() {
        super();
        this.name = "安琪拉金幣";
        this.db = 1; this.DB = 1;
        this.ch = "。";
        this.color = "#ff3";
        this.w = 50;
        this.value *= 1000;
    }
}

export * as Equip from "./equip/equip";
export * as Food from "./food";
export * as Potion from "./potion";