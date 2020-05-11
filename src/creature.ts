import * as ROT from "rot-js";
import { Logs } from "./logs.ts";
import { game } from "./main.ts";

export class Player {
    x: number;
    y: number;
    ch: string;
    color: string;
    dir: number;
    logs: Logs;

    constructor(x: number, y: number) {        
        this.x = x;
        this.y = y;
        this.ch = "伊";
        this.color = "#0be";
        this.dir = 1;
        this.logs = new Logs();
    }
    draw() {
        game.map.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, this.color);        
    }
    act() {
        game.engine.lock();
        window.addEventListener("keydown", this);
    }     
    handleEvent(e) {
        var keyMap = {};
        keyMap[38] = 0;
        keyMap[33] = 1;
        keyMap[39] = 2;
        keyMap[34] = 3;
        keyMap[40] = 4;
        keyMap[35] = 5;
        keyMap[37] = 6;
        keyMap[36] = 7;
        var code = e.keyCode;
        if (!(code in keyMap)) {
            return;
        }
        let new_dir = keyMap[code];
        this.dir = new_dir;

        if (e.shiftKey) {                    
            this.logs.notify("你向四处张望。");                        
        } else {
            let d = ROT.DIRS[8][new_dir];
            let xx = this.x + d[0];
            let yy = this.y + d[1];            
            if (((xx + "," + yy) in game.map.layer)) {
                game.camera.move(d[0], d[1]);
                this.x = xx;
                this.y = yy;
            }
        }
        window.removeEventListener("keydown", this);
        game.engine.unlock();
        game.draw();
    }    
}