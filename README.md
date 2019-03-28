# Battleship

这是一个用JavaScript写的小游戏，来源是《Head first JavaScript》。
我稍微按照自己的想法修改了一下，但基本的代码还是从这本书里抄来的。

## 规则

游戏在网页加载后，会创建3个船队，每个船队由3艘船组成。船队都是3艘船连在一起的，方向是水平或者垂直。
输入：玩家猜测并在右下方输入船队的坐标，按回车或者点击按钮开火。
输出：

1. 如果击中船，左上方会显示“Hit”，而且射击位置会显示一艘船；
2. 如果击沉一个船队，左上方会显示“You sank enemy's battleship!”；
3. 如果击沉了3个船队，左上方会显示“You sank all my battleships, in %d guesses. ”；
4. 如果没击中，左上方会显示“Miss”，射击位置会显示一个“Miss”的标记。