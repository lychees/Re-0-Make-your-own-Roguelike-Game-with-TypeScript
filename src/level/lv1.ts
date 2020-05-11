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

    init() {
        this.map = new Map();             
        this.draw();
    }
    draw() {        
        this.map.draw();
        this.player.draw();
    }
};

let game = new Game();
game.init();