import * as ROT from "rot-js";
import * as $ from "jquery";
import { Camera } from "./camera";
import { Player } from "./creature";
import { Map } from "./map";
import { Sound } from "./sound";

export function rand(n: number): number {
    return Math.floor(ROT.RNG.getUniform() * n);    
}

export function pop_random(A: Array<[number, number]>): [number, number] {
    var index = rand(A.length);
    return A[index];
}

class Game {
    
    map: Map;
    player: Player;    
    camera: Camera;
    SE: Sound;

    scheduler: any;
    engine: any;

    init() {
        this.map = new Map();
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
        console.log($("#HP > .row_key"));
        $("#HP > .row_key").text("HP:" + this.player.hp + "/" + this.player.HP);
        $("#MP > .row_key").text("MP:" + this.player.mp + "/" + this.player.MP);
        $("#SP > .row_key").text("SP:" + this.player.sp + "/" + this.player.SP);
        $("#STR > .row_key").text("STR:" + this.player.str);
        $("#DEX > .row_key").text("DEX:" + this.player.dex);
        $("#CON > .row_key").text("CON:" + this.player.con);
        $("#INT > .row_key").text("INT:" + this.player.int);
        $("#WIS > .row_key").text("WIS:" + this.player.wis);
        $("#CHA > .row_key").text("CHA:" + this.player.cha);
    }
};

export let game = new Game();
game.init();