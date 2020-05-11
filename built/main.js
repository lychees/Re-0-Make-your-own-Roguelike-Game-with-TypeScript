"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//var ROT = require("rot-js");
var MAP_WIDTH = 40;
var MAP_HEIGHT = 25;
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
            free_cells.push(key);
        });
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
        this.draw();
    };
    Game.prototype.draw = function () {
        this.map.draw();
    };
    return Game;
}());
;
var game = new Game();
game.init();
