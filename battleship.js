/* 辅助函数 */
// 判断玩家输入是否正确
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2)
        alert("Oops, please enter a letter and a number on the board.");
    else{
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if(isNaN(row) || isNaN(column))
            alert("Oops, that isn't on the board. ");
        else if (row < 0 || row >= model.boardSizeRow || column < 0 || column >= model.boardSizeColunm)
            alert("Oops, that's off the board! ");
        else
            return row + column;
    }
    return null;
}

// 事件处理程序：点击fire
function init() {
    /* 按键事件 */
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    /* enter事件 */
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    /* 部署战舰 */
    model.generateShipLocations();
}

// handleFireButton
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);         /* 把输入交给controller */
    guessInput.value = "";                  /* 清除输入框 */
}

// handleKeyPress
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if(e.keyCode === 13){
        fireButton.click();                 /* 调用handleFireButton了，因为操作都一样 */
        return false;
    }
}

window.onload = init;                       /* 加载完网页，浏览器就会启动init函数 */

/* 对象 */
// 显示信息
var view = {
    displayMessage: function(msg){
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

// 记录游戏状态
var model = {
    boardSizeColunm: 10,
    boardSizeRow: 7,
    numShips: 3,            /* 船的数量 */
    shipLength: 3,          /* 船占的格子 */
    shipsSunk: 0,

    // 船的位置&状态
    ships: [{locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]},
            {locations: [0, 0, 0], hits: ["", "", ""]}],
    
    // 开火：hit || miss
    fire: function(guess) {
        for(var i = 0; i < this.numShips; i++)
        {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0)
            {
                ship.hits[index] = "hit";
                view.displayHit(guess);     /* 显示击中船的图标 */
                view.displayMessage("Hit!");/* 显示击中船的提示 */
                if(this.isSunk(ship))
                {
                    this.shipsSunk++;
                    view.displayMessage("You sank enemy's battleship! ");   /* 显示击沉船队的信息 */
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Miss!");
        return false;
    },

    // 击沉？
    isSunk: function(ship) {
        for(var i = 0; i < this.shipLength; i++){
            if(ship.hits[i] != "hit")
                return false;
        }
        return true;
    },

    // 新建ships数组
    generateShipLocations: function(){
        var locations;
        for(var i = 0; i < this.numShips; i++){
            do{locations = this.generateShip();}while(this.collision(locations));
            this.ships[i].locations = locations;
        }
    },

    // 创建一首battleship，并指定其在游戏板中的位置
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;

        if(direction === 1){
            // 生成水平战舰的起始位置
            row = Math.floor(Math.random() * this.boardSizeRow);
            col = Math.floor(Math.random() * (this.boardSizeColunm - this.shipLength));
        }else{
            // 生成垂直战舰的起始位置
            col = Math.floor(Math.random() * this.boardSizeColunm);
            row = Math.floor(Math.random() * (this.boardSizeRow - this.shipLength));
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++){
            if(direction === 1){
                // 在水平战舰的位置数组中添加位置
                newShipLocations.push(row + "" + (col + i));
            }else{
                // 在垂直战舰的位置数组中添加位置
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    // 判断一艘船是否和已有的船重合
    collision: function(locations) {
        for(var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++){
                if(ship.locations.indexOf(locations[j]) >= 0)   /* 在location中查看是否有已有的船的位置 */
                    return true;
            }
        }
        return false;
    }
};

// 控制器
var controller = {
    guesses: 0,

    processGuess: function(guess) {
        var location = parseGuess(guess);       /* 只有玩家输入的是合法的才返回true */
        if(location) {
            this.guesses++;
            var hit = model.fire(location);     /* 开火 */
            if(hit && model.shipsSunk === model.numShips) {         /* 如果船全部沉了，游戏结束 */
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses. ");
            }
        }
    }
};
