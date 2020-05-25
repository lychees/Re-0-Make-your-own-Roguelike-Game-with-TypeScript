import * as ROT from "rot-js";
import * as Utils from "./utils/utils";
import $ from "jquery";
import { Camera } from "./utils/camera";
import { Player } from "./creature/creature";
//import { Map0 } from "./level/lv0";
import { Map0 } from "./level/arena";
import { Ch0_Boss } from "./level/lv0";

import { Sound } from "./utils/sound";
import { CharacterMenu, Menu } from "./UI/character";
import { Chat } from "./chat";


import { _, Events } from "./utils/event";
import { Rogue_Encampment } from "./map/Rogue_Encampment";
import { Linzh } from "./creature/human";

const DISPLAY_WIDTH = 40;
const DISPLAY_HEIGHT = 25;

class Game {
    
    display: any;
    map: any;
    player: Player;    
    camera: Camera;
    SE: Sound;
    score: number;

    scheduler: any;
    engine: any;
    
    characterMenu: any;

    chat: Chat;

    constructor() {
        this.chat = new Chat();
    }

    init() {

        game.display = new ROT.Display({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            fontSize: 24,            
            fontFamily: 'sans-serif',
        });
        document.body.replaceChild(game.display.getContainer(), document.getElementById('canvas'));
        this.SE = new Sound();
        this.characterMenu = new CharacterMenu();
        
        //this.map = new Map();
        //this.map = new Map0();

        this.map = new Rogue_Encampment();
         //this.map = new Ch0_Boss();
        this.score = 0;
     //   let p = Utils.pop_random(this.map.free_cells);
//        game.player = new Player(p[0], p[1]);
        
        game.player = new Player(40, 10);
        this.characterMenu.parent = game.player;
        this.map.agents.push(game.player);

        let linzh = new Linzh(39, 11);
        this.map.agents.push(linzh);

        game.player.team = 
        linzh.team = "player";

        this.camera = new Camera();

        this.chat.initialize();

        this.scheduler = new ROT.Scheduler.Action();
        for (let i=0;i<this.map.agents.length;++i) {
            this.scheduler.add(this.map.agents[i], true);
        }
        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
        this.draw();
    }
    reschedule() {
        this.scheduler.clear();
        for (let i=0;i<this.map.agents.length;++i) {
            this.scheduler.add(this.map.agents[i], true);
        }
    }
    draw_abilities(p: any) {
        $('#abilities div').each(function() {            
            $(this).remove();					
        });

        for (let i=0;i<p.buffs.length;++i) {
            let b = p.buffs[i];
            let dom = $('<div>').addClass('inventoryRow').addClass('abilitiesRow');
            let name =$('<div>').addClass('row_key').text(b.name);
            let tip = $('<div>').addClass("tooltip bottom right").text(b.description);
            tip.appendTo(dom);
            name.appendTo(dom);            
            dom.appendTo('div#abilities');
        }        
    }

    draw_attributes(p: any) {
        $("#HP > .row_key").text("HP:" + this.player.hp + "/" + this.player.HP);
        $("#HP > .tooltip").text(p.parse_hp_buffs());
        $("#MP > .row_key").text("MP:" + this.player.mp + "/" + this.player.MP);
        $("#MP > .tooltip").text(p.parse_mp_buffs());
        $("#SP > .row_key").text("SP:" + this.player.sp + "/" + this.player.SP);
        $("#SP > .tooltip").text(p.parse_sp_buffs()); 
    }

    draw() {     
        this.map.draw();

        this.draw_attributes(this.player);
        
        /*
        let d = new Date();
        d.setTime(Math.floor(this.scheduler.getTime()));
        $("#TIME > .row_key").text(d.toUTCString());
        $("#SCORE > .row_key").text("SCORE:" + game.score);
        */
    }


    saveGame() {
        if(typeof Storage != 'undefined' && localStorage) {

/*            if(Engine._saveTimer != null) {
                clearTimeout(Engine._saveTimer);
            }
            if(typeof Engine._lastNotify == 'undefined' || Date.now() - Engine._lastNotify > Engine.SAVE_DISPLAY){
                $('#saveNotify').css('opacity', 1).animate({opacity: 0}, 1000, 'linear');
                Engine._lastNotify = Date.now();
            }*/
//            console.log(game.player);            
  //          localStorage.gameState = JSON.stringify(game.player);
            localStorage.gameState = JSON.stringify(game.player.logs);  
            return localStorage.gameState;
        }
        return "?";    
    }

    loadGame() {
        try {
            /*var savedState = JSON.parse(localStorage.gameState);
            if(savedState) {
                State = savedState;
                $SM.updateOldState();
                Engine.log("loaded save!");
            }*/
        } catch(e) {
            /*
            State = {};
            $SM.set('version', Engine.VERSION);
            Engine.event('progress', 'new game');
            */
        }
    }    
};

export let game = new Game();

game.init();
export let event = new Events();
event.init();

//openCharacterMenu(game.player);

$( "#character" ).click(function() {    
    game.characterMenu.toggle(game.player);
});

$( "#inventory" ).click(function() {
    game.characterMenu.toggle(game.player);
});

$( "#save" ).click(function() {

        event.startEvent({
            title: _('Export / Import'),
            scenes: {
                start: {
                    text: [
                        _('export or import save data, for backing up'),
                        _('or migrating computers')
                    ],
                    buttons: {
                        'export': {
                            text: _('export'),
                            nextScene: 'inputExport'
                        },
                        'import': {
                            text: _('import'),
                            nextScene: 'confirm'
                        },
                        'cancel': {
                            text: _('cancel')
                        }
                    }
                },
                'inputExport': {
                    text: [_('save this.')],
                    textarea: game.saveGame, //Engine.export64(),
                    onLoad: function() {
                    //     Engine.event('progress', 'export');
                        alert(123)
                    },
                    readonly: true,
                    buttons: {
                        'done': {
                            text: _('got it'),
                            onChoose: alert(123)
                        }
                    }
                },
                'confirm': {
                    text: [
                        _('are you sure?'),
                        _('if the code is invalid, all data will be lost.'),
                        _('this is irreversible.')
                    ],
                    buttons: {
                        'yes': {
                            text: _('yes'),
                            nextScene: 'inputImport',
                            onChoose: alert(123)
                        },
                        'no': {
                            text: _('no'),
                            nextScene:  'start'
                        }
                    }
                },
                'inputImport': {
                    text: [_('put the save code here.')],
                    textarea: '',
                    buttons: {
                        'okay': {
                            text: _('import'),
                            onChoose: alert(123)
                        },
                        'cancel': {
                            text: _('cancel')
                        }
                    }
                }
            }
        });
});

        /*
    let juqing = {
        title: _('伊莎貝拉'),
        scenes: {
            'start': {
                text: [
                    _('到此為止吧，伊莎貝拉殿下。'),
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
                    _('李、李貝爾隊長，為什麼連你也會在這裏。'),
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
                    _('你的亂來已經給安琪拉造成很多困擾了，現在必須把你抓回去。'),
                ],
                buttons: {
                    'p21': {
                        text: _('1. 安琪拉是我生長的地方，無論如何我也不想離開。'),
                        nextScene: 'p21'
                    },
                    'p22': {
                        text: _('2. 我已經不是當初的那個小女孩了，我的劍可不會手下留情。'),
                        nextScene: 'p22'
                    },                
                }
            },        
            'p21': {
                text: [
                    _('為了安琪拉的未來，只有讓公主委屈一下了。'),
                ],
                buttons: {
                    'leave': {
                        text: '結束'
                    }            
                }
            },           
            'p22': {
                text: [
                    _('那就讓我來檢驗一下公主殿下的成長吧。'),
                ],
                buttons: {
                    'leave': {
                        text: '結束'
                    }            
                }
            },           
        }
    };
    event.startEvent(juqing); */
//});


let quest = {
    title: _('邪惡洞窟'),
    scenes: {
        'start': {
            text: [
                _('在荒地中有一个极度邪恶的地方。卡夏的萝格斥候已经告诉我们那个洞穴附近到处都是影子般的生物。以及从坟墓中爬出来的怪物。'),
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
                _('我害怕这些生物会群聚并攻击我们的营地。如果你真的要帮助我们，找到这个黑暗的迷宫并摧毁所有邪恶的怪物。愿伟大之眼眷顾你们。'),
            ],
            buttons: {
                'leave': {
                    text: _('結束'),
                },
            }
        },            
    }
};

event.startEvent(quest);


/*
$( "#character" ).click(function() {
    game.characterMenu.toggle(game.player);
});
*/

//import { genCharacterUI } from "./UI/character"
//Events.startEvent(genCharacterUI(game.player));



/*
Events.startEvent({
    title: _('伊莎貝拉'),
    scenes: {
        'start': {
            text: [
                _('你發現地上有一個上鎖的金色寶箱。'),
            ],
            buttons: {
                'open': {
                    text: _('用鑰匙打開'),
                    nextScene: {1: 'open'}
                },
                'destroy': {
                    text: _('暴力破壞'),
                    nextScene: {1: 'destory'}
                },
                'leave': {
                    text: _('離開它，這或許是一個陷阱。'),
                    nextScene: 'end'
                }
            }
        },
        'open': {
            text: [
                _('沒有鑰匙。'),
            ],
            buttons: {
                'leave': {
                    text: _('leave'),
                    nextScene: 'end'
                }
            }
        },
        'destory': {
            text: [
                _("一番努力之後，你打開了箱子，獲得了一把斧頭。"),
            ],
            onLoad: function() {
                game.player.inventory.push(new Axes());
            },            
            buttons: {
                'leave': {
                    text: _('leave'),
                    nextScene: 'end'
                }
            }
        }
    }
});
*/

       /*
let juqing = {
    title: _('伊莎貝拉'),
    scenes: {
        'start': {
            text: [
                _('到此為止吧，伊莎貝拉殿下。'),
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
                _('李、李貝爾隊長，為什麼連你也會在這裏。'),
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
                _('你的亂來已經給安琪拉造成很多困擾了，現在必須把你抓回去。'),
            ],
            buttons: {
                'p21': {
                    text: _('1. 安琪拉是我生長的地方，無論如何我也不想離開。'),
                    nextScene: 'p21'
                },
                'p22': {
                    text: _('2. 我已經不是當初的那個小女孩了，我的劍可不會手下留情。'),
                    nextScene: 'p22'
                },                
            }
        },        
        'p21': {
            text: [
                _('為了安琪拉的未來，只有讓公主委屈一下了。'),
            ],
            buttons: {
                'leave': {
                    text: '結束'
                }            
            }
        },           
        'p22': {
            text: [
                _('那就讓我來檢驗一下公主殿下的成長吧。'),
            ],
            buttons: {
                'leave': {
                    text: '結束'
                }            
            }
        },           
    }
};

event.startEvent(juqing);*/