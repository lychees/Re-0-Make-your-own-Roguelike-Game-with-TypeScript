Re:0 从 0 开始打造你的 Roguelike 游戏
==========
## 在线试玩
[itch](https://minakokojima.itch.io/uminouta)

## 如何操作
- 移動/攻擊 WASD 上下左右
- 原地轉向 shift + 移動
- 走路/跑步 R 鍵切換，跑步有 1/10 的概率消耗一點體力，體力為 0 時無法跑步
- 裝備/道具 I 鍵打開道具欄（沒做 UI），然後 abcde 使用對應的道具，現在只能吃蘋果和裝備武器 


## 如何運行
[webpack](https://webpack.js.org/) 不香麼？
- `npm run start`

## 如何发布
- `npm run build`

## 屬性
本作角色系統參考了 [D&D 5E 中文規則書](https://trpgtdnd.weebly.com/25216330212017132057.html)，安琪拉大陸上的所有生物遵循統一的規則。

### 力量 Strength
- 力量將會影響角色的近戰傷害，所有近戰攻擊的攻擊力將會增加一個 力量差（如果為正）傷害的骰子
- 力量將會影響角色的負重

### 敏捷 Dexterity
- 敏捷決定角色的閃避成功概率，用於做攻擊命中時的難度檢定
- 敏捷決定角色的行動力的恢復速度，2 dex 的單位的所有行動速度，將會是 1 dex 單位的兩倍

### 體魄 Constitution
- 每點體魄增加角色 5 點生命值
- 每點體魄增加角色 1 點體力值

### 智力 Intelligence
- 每點智力增加角色 魔法天賦 點魔法值。
- 智力影響角色閱讀某些書記時的效果。

### 感知 Wisdom
- 玩家失去生物的視野之後，將會投擲一個感知數的骰子，決定該生物繼續顯示在地圖裡的時間，如果該生物移動到一個未被探索的迷霧中，則立即丟失視野

### 魅力 Charisma
- 尚未實裝。

## 種族
### 人類
[5,5,5,5,5,5]

### 精靈
[4,6,4,5,6,5]

### 獸人
[7,4,6,3,5,4]

## FAQ

### 什麼是 Roguelike？
[Gadio Pro, Roguelike 是什么？：我们一起在过去和现在的游戏中寻找Roguelike](https://www.gcores.com/radios/121523)

### Int 和 Wis 有什麼區別？
- [https://www.quora.com/What-is-the-difference-between-wisdom-and-intelligence-in-Dungeons-and-Dragons](https://www.quora.com/What-is-the-difference-between-wisdom-and-intelligence-in-Dungeons-and-Dragons)

### 如何播放音效？
隔壁 [Untrusted](https://github.com/lychees/untrusted/blob/master/scripts/sound.js) 使用的 Jplayer 好像有點 old dated，這裡使用的是 [Howlerjs](https://howlerjs.com/)。

### 如何實現日誌框的漸隱效果？
參考隔壁 [小黑屋](https://github.com/doublespeakgames/adarkroom/blob/master/script/notifications.js)。

### 我們需要更多的裝備。
- [http://wiki.d.163.com/diablo/index.htm](http://wiki.d.163.com/diablo/index.htm)
- [https://nethackwiki.com/wiki/Weapon](https://nethackwiki.com/wiki/Weapon)

## 教程连载？
[地址](http://www.gamecreator.com.cn/forum.php?mod=viewthread&tid=238&page=1&extra=#pid1026)
