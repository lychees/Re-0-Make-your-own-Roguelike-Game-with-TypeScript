import * as ROT from "rot-js";
import * as $ from "jquery";
import { Camera } from "./camera";
import { Player } from "./creature";
import { Map } from "./map";
import { Map0 } from "./level/lv0";
import { Sound } from "./sound";

export function rand(n: number): number {
    return Math.floor(ROT.RNG.getUniform() * n);    
}

export function pop_random(A: Array<[number, number]>): [number, number] {
    var index = rand(A.length);
    return A[index];
}

const DISPLAY_WIDTH = 40;
const DISPLAY_HEIGHT = 25;

class Game {
    
    display: any;
    map: any;
    player: Player;    
    camera: Camera;
    SE: Sound;

    scheduler: any;
    engine: any;

    init() {

        game.display = new ROT.Display({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
            fontSize: 24,            
            fontFamily: 'sans-serif',
        });
        document.body.replaceChild(game.display.getContainer(), document.getElementById('canvas'));    

        //this.map = new Map();
        this.map = new Map0();
        let p = pop_random(this.map.free_cells);
        game.player = new Player(p[0], p[1]);
        this.map.agents.push(game.player);

        this.camera = new Camera();
        this.SE = new Sound();

        this.scheduler = new ROT.Scheduler.Action();
        for (let i=0;i<this.map.agents.length;++i) {
            this.scheduler.add(this.map.agents[i], true);
        }
        this.engine = new ROT.Engine(this.scheduler);
        this.engine.start();
        this.draw();
    }
    draw() {     
        this.map.draw();
        $("#HP > .row_key").text("HP:" + this.player.hp + "/" + this.player.HP);
        $("#MP > .row_key").text("MP:" + this.player.mp + "/" + this.player.MP);
        $("#SP > .row_key").text("SP:" + this.player.sp + "/" + this.player.SP);
        $("#STR > .row_key").text("STR:" + this.player.str);
        $("#DEX > .row_key").text("DEX:" + this.player.dex);
        $("#CON > .row_key").text("CON:" + this.player.con);
        $("#INT > .row_key").text("INT:" + this.player.int);
        $("#WIS > .row_key").text("WIS:" + this.player.wis);
        $("#CHA > .row_key").text("CHA:" + this.player.cha);
        $("#TIME > .row_key").text("TIME:" + this.scheduler.getTime());

        this.player.inventory.draw();

        /*
            <div id="i0" class="perkRow"><div class="row_key">蘋果</div><div class="tooltip bottom right">一個蘋果，食用隨機恢復 1d3 點 HP 和 1d3 點 SP。</div></div>
			<div id="i1" class="perkRow"><div class="row_key">水鏡</div><div class="tooltip bottom right">少女慣用的愛劍，攻擊力 2d6。</div></div>
            <div id="i2" class="perkRow"><div class="row_key">藍寶石項鏈</div><div class="tooltip bottom right">雕刻有美人女在石礁上唱歌的藍寶石項鏈。</div></div>
        */
    }
};

export let game = new Game();
game.init();