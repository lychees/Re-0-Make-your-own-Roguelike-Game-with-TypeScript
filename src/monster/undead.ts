import { Sword, Shield } from "../inventory";
import { Enemy, Creature } from "../creature";
import { hostile } from "../AI/hostile";
import { game, event, rand, dice } from "../main";
import { _, Events } from "../event";

export class Undead extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "骷髅";
        this.ch = "骷";
        this.color = "#eee"; 
        this.z = 1;        
        this.act = hostile.bind(this);
        this.str = 5; this.dex = 5; this.modify_con(5);
        this.wis = 5; this.cha = 5; this.modify_int(5);
    }
    get_atk() {
        return dice(this.str) + dice(this.str);
    }    
}

export class Skeleton extends Undead {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "骷髅";
        this.ch = "骷";
        this.color = "#eee";        
        this.z = 1;
        let sword = new Sword();
        this.inventory.push(sword);
        sword.equip();
        let shield = new Shield();
        this.inventory.push(shield);
        shield.equip();
    }
}

export class Walking_Dead extends Undead {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "行尸";
        this.ch = "尸";
        this.color = "#23c";
        this.z = 1;
        this.modify_con(2);
        let sword = new Sword();
        this.inventory.push(sword);
        sword.equip();
        let shield = new Shield();
        this.inventory.push(shield);
        shield.equip();
    }
}

export class Zombie extends Undead {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "僵尸";
        this.ch = "尸";
        this.color = "#4c5";
        this.z = 1;
        this.modify_con(3);
        let sword = new Sword();
        this.inventory.push(sword);
        sword.equip();
        let shield = new Shield();
        this.inventory.push(shield);
        shield.equip();
    }
}

export class Corpsefire extends Zombie {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "尸體發火";
        this.ch = "尸";
        this.color = "#469";
        this.z = 1;
        this.modify_con(3);
        let sword = new Sword();
        this.inventory.push(sword);
        sword.equip();
        let shield = new Shield();
        this.inventory.push(shield);
        shield.equip();

        this.act = ()=>{ // wait Isabella
            game.scheduler.setDuration( 5000 );
            
            if (game.player && event && Math.abs(this.x - game.player.x) + Math.abs(this.y - game.player.y) <= 1000) {                
                let dialog = {
                    title: _('伊莎貝拉'),
                    scenes: {
                        'start': {
                            text: [
                                _('眼前的這具僵尸周身散發著寒冷的藍色閃光，似乎被施加了某種屬性增強的魔法'),
                            ],
                            buttons: {
                                'continue': {
                                    text: _('繼續'),
                                    nextScene: 'p0'
                                },
                            }
                        },
                        'p0': {
                            text: [
                                _('它一定就是 尸體發火 了'),
                            ],
                            buttons: {
                                'continue': {
                                    text: _('繼續'),
                                    nextScene: 'p1'
                                },
                            }
                        },
                        'p1': {
                            text: [
                                _('只要和它保持距離，我一定能夠取勝'),
                            ],
                            buttons: {
                                'leave': {
                                    text: '結束'
                                }            
                            }
                        },                  
                    }
                };
                //window.removeEventListener()
                event.startEvent(dialog);
                this.act = hostile.bind(this);
            }
        };

    }
}