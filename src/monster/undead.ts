import { Sword, Shield } from "../inventory";
import { Enemy, Creature } from "../creature";
import { hostile } from "../AI/hostile";
import { game, event, rand, dice } from "../main";
import { _, Events } from "../event";
import * as Buff from "../buff";

export class Undead extends Creature {
    constructor(x: number, y: number) {
        super(x, y);
        this.name = "骷髅";
        this.ch = "骷";
        this.color = "#eee";         
        this.act = hostile.bind(this);

        let Undead_Race = new Buff.Buff();            
        Undead_Race.name = "不死";
        Undead_Race.description = "這個單位是不死亡靈\n";        
        Undead_Race.hp = 2; Undead_Race.wis = -1; Undead_Race.cha = -1; 
        Undead_Race.description += this.parse_buffs();
        Undead_Race.append(this);
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

        let Skeleton_Race = new Buff.Buff();            
        Skeleton_Race.name = "骷髏";
        Skeleton_Race.description = "骷髏是墓園中的一級生物\n";
        Skeleton_Race.atk['d1'] = 1;
        Skeleton_Race.str = 2; Skeleton_Race.dex = 2; Skeleton_Race.con = 2;
        Skeleton_Race.int = 2; Skeleton_Race.wis = 2; Skeleton_Race.cha = 2;
        Skeleton_Race.description += Skeleton_Race.parse();
        Skeleton_Race.append(this);

        if (dice(6) == 1) {
            (new Buff.Dex_Talent(1)).append(this);
        }
        if (dice(6) == 1) {
            (new Buff.Con_Talent(1)).append(this);
        }        

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
        
        let Walking_Dead_Race = new Buff.Buff();            
        Walking_Dead_Race.name = "行尸";
        Walking_Dead_Race.description = "行尸是墓園中的二級生物\n";
        Walking_Dead_Race.atk['d1'] = 1;
        Walking_Dead_Race.hp = 5;
        Walking_Dead_Race.str = 2; Walking_Dead_Race.dex = 3; Walking_Dead_Race.con = 3;
        Walking_Dead_Race.int = 3; Walking_Dead_Race.wis = 3; Walking_Dead_Race.cha = 3;
        Walking_Dead_Race.description += Walking_Dead_Race.parse();
        Walking_Dead_Race.append(this);

        if (dice(6) == 1) {
            (new Buff.Dex_Talent(1)).append(this);
        }
        if (dice(3) == 1) {
            (new Buff.Con_Talent(1)).append(this);
        }        

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

        let Zombie_Race = new Buff.Buff();            
        Zombie_Race.name = "僵尸";
        Zombie_Race.description = "僵尸是墓園中的二級生物\n";
        Zombie_Race.atk['d1'] = 1;
        Zombie_Race.hp = 10;        
        Zombie_Race.str = 3; Zombie_Race.dex = 3; Zombie_Race.con = 4;
        Zombie_Race.int = 3; Zombie_Race.wis = 3; Zombie_Race.cha = 3;
        Zombie_Race.description += Zombie_Race.parse();
        Zombie_Race.append(this);

        if (dice(6) == 1) {
            (new Buff.Dex_Talent(1)).append(this);
        }
        if (dice(3) == 1) {
            (new Buff.Con_Talent(1)).append(this);
        }        

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

        let Boss_Buff = new Buff.Buff();            
        Boss_Buff.name = "尸體發火";
        Boss_Buff.description = "據說迪亞布羅創造了這個邪惡的生物\n";
        Boss_Buff.atk['d6'] = 2;
        Boss_Buff.hp = 20;
        Boss_Buff.append(this);
        
        this.act = ()=>{ // wait Isabella
            game.scheduler.setDuration( 5000 );
            
            if (game.player && event && Math.abs(this.x - game.player.x) + Math.abs(this.y - game.player.y) <= 7) {                
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