"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ROT = require("rot-js");
var MAP_WIDTH = 60;
var MAP_HEIGHT = 30;
var DISPLAY_WIDTH = 40;
var DISPLAY_HEIGHT = 25;
function pop_random(A) {
    var index = Math.floor(ROT.RNG.getUniform() * A.length);
    return A[0];
}
var Camera = /** @class */ (function () {
    function Camera() {
        var o = game.map.display.getOptions();
        var w = o.width, h = o.height;
        this.x = game.player.x;
        this.y = game.player.y;
        this.ox = Math.floor(w / 2);
        this.oy = Math.floor(h / 2);
        this.adjust();
    }
    Camera.prototype.adjust = function () {
        var o = game.map.display.getOptions();
        var w = o.width, h = o.height;
        if (this.x - this.ox < 0)
            this.ox += this.x - this.ox;
        if (game.map.width - this.x + this.ox < w)
            this.ox -= (game.map.width - this.x + this.ox) - w + 1;
        if (this.y - this.oy < 0)
            this.oy += this.y - this.oy;
        if (game.map.height - this.y + this.oy < h)
            this.oy -= (game.map.height - this.y + this.oy) - h + 1;
    };
    Camera.prototype.move = function (dx, dy) {
        this.x += dx;
        this.y += dy;
        var o = game.map.display.getOptions();
        var w = o.width, h = o.height;
        var ww = Math.floor(w / 2);
        var hh = Math.floor(h / 2);
        if (dx > 0 && this.x < ww || dx < 0 && this.x > game.map.width - ww) {
            this.ox += dx;
        }
        else if (dy > 0 && this.y < hh || dy < 0 && this.y > game.map.height - hh) {
            this.oy += dy;
        }
        else {
            this.adjust();
        }
    };
    return Camera;
}());
var Player = /** @class */ (function () {
    function Player(x, y) {
        this.x = x;
        this.y = y;
        this.ch = "伊";
        this.color = "#0be";
    }
    Player.prototype.draw = function () {
        game.map.display.draw(this.x - game.camera.x + game.camera.ox, this.y - game.camera.y + game.camera.oy, this.ch, this.color);
        // game.map.display.draw(this.x, this.y, this.ch, this.color);
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
        game.camera.move(d[0], d[1]);
        if (!((xx + "," + yy) in game.map.layer)) {
            return;
        }
        this.x = xx;
        this.y = yy;
        window.removeEventListener("keydown", this);
        game.engine.unlock();
        game.draw();
    };
    return Player;
}());
var Map = /** @class */ (function () {
    function Map() {
        var _this = this;
        this.display = new ROT.Display({
            width: DISPLAY_WIDTH,
            height: DISPLAY_HEIGHT,
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
    Map.prototype.drawTileAt = function (x, y, key) {
        if (this.layer[key] === '　') {
            this.display.draw(x, y, this.layer[key]);
        }
        else {
            this.display.draw(x, y, "墻");
        }
    };
    Map.prototype.draw = function () {
        /*let w = this.width;
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
        }*/
        var o = this.display.getOptions();
        var w = o.width, h = o.height;
        for (var x = 0; x < w; ++x) {
            for (var y = 0; y < h; ++y) {
                var xx = x + game.camera.x - game.camera.ox;
                var yy = y + game.camera.y - game.camera.oy;
                var key = xx + ',' + yy;
                this.drawTileAt(x, y, key);
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
        this.camera = new Camera();
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
