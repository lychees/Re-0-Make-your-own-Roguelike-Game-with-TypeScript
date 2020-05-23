import * as Creature from "../creature/creature";
import * as Utils from "../utils/utils";
export * as Food from "./food";

/**
 * 物品
 *
 * @param owner 擁有者（不一定是 Creature，也有可能屬於箱子什麼的）
 * @param value 價值（不同的商品在不同的地區，不同的時間，對不同的人來收縮價值應該不同，這裡時一個賣給 NPC 時的底價，這個數值會順便產生對稀有度的估計）
 * @param weight 重量，單位為克 
 * @param db 耐久度
 * @param DB 耐久度上限
 */
export class Item extends Utils.Element {

    owner: any;
    value: number;    
    weight: number; 
    db: number; DB: number;
    
    /**
	 * @class 物品类
	 */
    constructor() {
        super();
        this.db = 1;
        this.ch = "。";
        this.color = "#fff";
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
        if (this.owner) {
            let idx = this.owner.inventory.items.findIndex((e: Item) => e==this);            
            this.owner.inventory.items.splice(idx, 1);                        
            this.owner = null;
        }
    }

    // TODO:(minakokojima) 寄放東西？
    /** 
     * 拿走
     */
    take(taker: Creature.Creature) {
        if (this.owner) {
            let idx = this.owner.inventory.items.findIndex((e: Item) => e==this);            
            this.owner.inventory.items.splice(idx, 1);                                    
        }
        taker.logs.notify(taker.name + " 從 " + this.owner.name + " 身上拿走了 " + this.name);        
        taker.inventory.push(this);
    }    
}

export * as Equip from "./equip/equip";