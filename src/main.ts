import * as ROT from "rot-js";
import { Camera } from "./camera.ts";
import { Player } from "./creature.ts";
import { Map } from "./map.ts";

class Game {
    
    map: Map;
    player: Player;
    engine: any;
    camera: Camera;

    init() {
        this.map = new Map();                     
        this.camera = new Camera();

        let scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();

        this.draw();
    }
    draw() {     
        this.map.draw();
        this.player.draw();
    }
};

export let game = new Game();
game.init();