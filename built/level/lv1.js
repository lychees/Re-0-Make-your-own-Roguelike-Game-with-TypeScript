"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var ROT = require("rot-js");
var MAP_WIDTH = 40;
var MAP_HEIGHT = 25;
function pop_random(A) {
    var index = Math.floor(ROT.RNG.getUniform() * A.length);
    return A[0];
}
var Player = /** @class */ (function () {
    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.ch = "伊";
        this.color = "#0be";
    }
    Player.prototype.draw = function () {
        game.map.display.draw(this.x, this.y, this.ch, this.color);
    };
    Player.prototype.act = function () {
        game.engine.lock();
        window.addEventListener("keydown", this);
    };
    Player.prototype.handleEvent = function (e) {
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
        var d = ROT.DIRS[8][keyMap[code]];
        var xx = this.x + d[0];
        var yy = this.y + d[1];
        if (!((xx + "," + yy) in game.map.layer)) {
            return;
        }
        game.map.display.draw(this.x, this.y, game.map.layer[this.x + "," + this.y]);
        this.x = xx;
        this.y = yy;
        this.draw();
        window.removeEventListener("keydown", this);
        game.engine.unlock();
    };
    return Player;
}());
var Map = /** @class */ (function () {
    function Map() {
        var _this = this;
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
        var free_cells = [];
        var digger = new ROT.Map.Digger(this.width, this.height);
        digger.create(function (x, y, value) {
            if (value)
                return;
            var key = x + "," + y;
            _this.layer[key] = "　";
            free_cells.push([x, y]);
        });
        var p = pop_random(free_cells);
        game.player = new Player(p[0], p[1]);
    }
    Map.prototype.draw = function () {
        var w = this.width;
        var h = this.height;
        for (var x = 0; x < w; ++x) {
            for (var y = 0; y < h; ++y) {
                var key = x + "," + y;
                if (this.layer[key] === '　') {
                    this.display.draw(x, y, this.layer[key]);
                }
                else {
                    this.display.draw(x, y, "墻");
                }
            }
        }
    };
    return Map;
}());
var Game = /** @class */ (function () {
    function Game() {
    }
    Game.prototype.init = function () {
        this.map = new Map();
        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
        this.draw();
    };
    Game.prototype.draw = function () {
        this.map.draw();
        this.player.draw();
    };
    return Game;
}());
;
var game = new Game();
game.init();
