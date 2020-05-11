[程序基础] Re:0 从 0 开始打造你的 Roguelike 游戏
==========

[连载地址](http://www.gamecreator.com.cn/forum.php?mod=viewthread&tid=238&page=1&extra=#pid1026)

### 如何编译
- `npm install -g typescript` 安装 [TypeScript](https://www.typescriptlang.org/) 
- `npm install rot-js` 安装 [rot.js](https://github.com/ondras/rot.js)
- `tsc` 编译 
- 删掉目标文件里的 `var ROT = require("rot-js");`
- 双击 `index.html` 运行