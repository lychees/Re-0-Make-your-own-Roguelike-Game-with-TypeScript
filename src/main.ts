import * as ROT from "rot-js";
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
    }
};

export let game = new Game();
game.init();