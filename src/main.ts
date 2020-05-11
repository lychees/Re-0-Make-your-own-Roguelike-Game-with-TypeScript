import * as ROT from "rot-js";
import { Camera } from "./camera.ts";
import { Player } from "./creature.ts";
import { Map } from "./map.ts";

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
    engine: any;
    camera: Camera;

    init() {
        this.map = new Map();
        this.camera = new Camera();

        let scheduler = new ROT.Scheduler.Simple();
        for (let i=0;i<this.map.agents.length;++i) {
            scheduler.add(this.map.agents[i], true);
        }        
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();

        this.draw();
    }
    draw() {     
        this.map.draw();
    }
};

export let game = new Game();
game.init();