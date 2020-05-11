import * as ROT from "rot-js";

const MAP_WIDTH = 40;
const MAP_HEIGHT = 25;

function pop_random(A: Array<[number, number]>): [number, number] {
    var index = Math.floor(ROT.RNG.getUniform() * A.length);    
    return A[0];
}

class Player {
    x: number;
    y: number;
    ch: string;
    color: string;
    constructor(x: number, y: number) {        
        this.x = x;
        this.y = y;
        this.ch = "伊";
        this.color = "#0be";
    }
    draw() {
        game.map.display.draw(this.x, this.y, this.ch, this.color);
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
        if (!(code in keyMap)) { return; }
     
        var d = ROT.DIRS[8][keyMap[code]];
        var xx = this.x + d[0];
        var yy = this.y + d[1];     
        if (!((xx+","+yy) in game.map.layer)) { return; }
        game.map.display.draw(this.x, this.y, game.map.layer[this.x+","+this.y]);
        this.x = xx;
        this.y = yy;
        this.draw();
        window.removeEventListener("keydown", this);
        game.engine.unlock();        
    }    
}

class Map {
    display: any;
    width: number;
    height: number;
    layer: {};

    constructor() {
        this.display = new ROT.Display({
            width: MAP_WIDTH,
            height: MAP_HEIGHT,
            fontSize: 24,            
            fontFamily: 'sans-serif',
        });
        document.body.appendChild(this.display.getContainer());
        
        this.width = MAP_WIDTH;
        this.height = MAP_HEIGHT;
        this.layer = {};
        let free_cells = [];
        let digger = new ROT.Map.Digger(this.width, this.height);
        digger.create((x, y, value) => {
            if (value) return;
            var key = x + "," + y;
            this.layer[key] = "　";
            free_cells.push([x, y]);
        });

        let p = pop_random(free_cells);
        game.player = new Player(p[0], p[1]);
    }
    draw() {
        let w = this.width;
        let h = this.height;
        for (let x=0;x<w;++x) {
            for (let y=0;y<h;++y) {
                let key = x + "," + y;
                if (this.layer[key] === '　') {
                    this.display.draw(x, y, this.layer[key]);
                } else {
                    this.display.draw(x, y, "墻");
                }
            }
        }
    }
}

class Game {
    
    map: Map;
    player: Player;
    engine: any;

    init() {
        this.map = new Map();                     
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

let game = new Game();
game.init();