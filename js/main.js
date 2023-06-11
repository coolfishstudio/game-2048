var board = [];//游戏数据
var score = 0;//游戏分数
var highScore = 0;//最高分
var hasConflicted = [];

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

const isInMicroApp = window.__POWERED_BY_QIANKUN__;

const render = () => {
  $(document).ready(function () {
		prepareForMobile();
    newGame();
  });
  return Promise.resolve();
};

(global => {
  global['gamePanel'] = {
    bootstrap: () => {
      return Promise.resolve();
    },
    mount: () => {
      return render();
    },
    unmount: () => {
      return Promise.resolve();
    },
  };
})(window);

if (!isInMicroApp) {
  //入口
	$(document).ready(function(){
		prepareForMobile();
		newGame();
	});
} else {
  var gamePanelHeader = document.getElementById('gamePanel').getElementsByTagName('header')[0];
  gamePanelHeader.style.display = 'flex';
  gamePanelHeader.style.alignItems = 'center';
  gamePanelHeader.style.padding = 0;
  gamePanelHeader.getElementsByTagName('h1')[0].style.flex = 1;
  gamePanelHeader.getElementsByTagName('a')[0].style.flex = 1;
  gamePanelHeader.getElementsByTagName('p')[0].style.flex = 1;
}

var documentWidth = isInMicroApp ? 0 : window.screen.availWidth;
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.18 * documentWidth;
var cellSpace = 0.04 * documentWidth;

function prepareForMobile(){
	documentWidth = document.getElementById('gamePanel').clientWidth;
	gridContainerWidth = 0.92 * documentWidth;
	cellSideLength = 0.123 * documentWidth;
	cellSpace = 0.026 * documentWidth;
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSideLength = 100;
		cellSpace = 20;
	}

	$('#grid-container').css({
		'width' : gridContainerWidth - 2 * cellSpace,
		'height' : gridContainerWidth - 2 * cellSpace,
		'padding' : cellSpace,
		'border-radius' : 0.02 * gridContainerWidth
	});

    $('.grid-cell').css({
    	'width' : cellSideLength,
    	'height' : cellSideLength,
    	'border-radius' : 0.02 * cellSideLength
	});

}

function newGame(){
	//初始化棋盘格
	init();
	//随机生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			var gridCell = $('#grid-cell-' + i + '-' + j);
			gridCell.css('top', getPosTop(i, j));
			gridCell.css('left', getPosLeft(i, j));
		}
	}

	for(var i = 0; i < 4; i++){
		board[i] = [];
		hasConflicted[i] = [];
		for(var j = 0; j < 4; j++){
			board[i][j] = 0;
			hasConflicted[i][j] = false;
		}
	}

	updateBoardView();
	score = 0;
	highScore = getStorage() || 0;
	updateScore(score);
}

//根据board对前端number-cell操作
function updateBoardView(){
	$('.number-cell').remove();

	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			$('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
			var theNumberCell = $('#number-cell-' + i + '-' + j);

			if(board[i][j] == 0){
				theNumberCell.css({
					'width' : '0px',
					'height' : '0px',
					'top' : getPosTop(i, j) + cellSideLength / 2,
					'left' : getPosLeft(i, j) + cellSideLength / 2
				});
			}else{
				var fontSize = (`${board[i][j]}`.length / 2);
				fontSize = fontSize <= 1 ? 1 : fontSize;
				theNumberCell.css({
					'width' : cellSideLength,
					'height' : cellSideLength,
					'top' : getPosTop(i, j),
					'left' : getPosLeft(i, j),
					'background-color' : getNumberBackgroundColor(board[i][j]),
					'font-size' : (0.6 * cellSideLength) / fontSize + 'px'
				});
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
	$('.number-cell').css({
		'line-height' : cellSideLength + 'px',
	});
}

function generateOneNumber(){
	if(nospace(board)){//判断是否有空间
		return false;
	}else{
		//可以生成随机数
		//1.随机位
		var randx = parseInt(Math.floor(Math.random() * 4));//0、1、2、3
		var randy = parseInt(Math.floor(Math.random() * 4));

		var times = 0;
		while(true < 50){
			if(board[randx][randy] == 0){
				break;
			}
			randx = parseInt(Math.floor(Math.random() * 4));
			randy = parseInt(Math.floor(Math.random() * 4));
			times ++;
		}

		if(times == 50){
			for(var i = 0; i < 4; i++){
				for(var j = 0; j < 4; j++){
					if(board[i][j] == 0){
						randx = i;
						randy = j;
					}
				}
			}
		}


		//2.随机数
		var randNumber = Math.random() < 0.5 ? 2 : 4;

		//3.随机位显示随机数
		board[randx][randy] = randNumber;
		showNumberWithAnimation(randx, randy, randNumber);

		return true;
	}
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37 : //left
			event.preventDefault();
			if(moveLeft()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
			break;
		case 38 : //up
			event.preventDefault();
			if(moveUp()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
			break;
		case 39 : //right
			event.preventDefault();
			if(moveRight()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
			break;
		case 40 : //down
			event.preventDefault();
			if(moveDown()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
			break;
		default : //default
			break;
	}
});

function mousedown(event, isTouch) {
	startX = isTouch ? event.touches[0].pageX : event.pageX;
	startY = isTouch ? event.touches[0].pageY : event.pageY;
}

function mouseup(event, isTouch) {
	endX = isTouch ? event.changedTouches[0].pageX : event.pageX;
	endY = isTouch ? event.changedTouches[0].pageY : event.pageY;

	var deltaX = endX - startX;
	var deltaY = endY - startY;

	if(Math.abs(deltaX) < 0.08 * documentWidth && Math.abs(deltaY) < 0.08 * documentWidth){
		return;
	}

	if(Math.abs(deltaX) >= Math.abs(deltaY)){
		if(deltaX > 0){
			//右
			if(moveRight()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
		}else{
			//左
			if(moveLeft()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
		}
	}else{
		if(deltaY > 0){
			//下
			if(moveDown()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
		}else{
			//上
			if(moveUp()){
				setTimeout(function(){
					generateOneNumber();
				},180);
				setTimeout(function(){
					 isGameOver();
				},250);
			}
		}
	}
}

document.addEventListener('touchstart', function(event){
	mousedown(event, true);
});

document.addEventListener('mousedown', function(event){
	mousedown(event);
});

document.addEventListener('touchmove', function(event){
	// event.preventDefault();
});

document.addEventListener('mousemove', function(event){
	event.preventDefault();
});

document.addEventListener('mouseup', function(event){
	mouseup(event);
});

document.addEventListener('touchend', function(event){
	mouseup(event, true);
});

function moveLeft(){
	if(!canMoveLeft(board)){//判断是否能移动
		return false;
	}else{

		for(var i = 0; i < 4; i++){
			for(var j = 1; j < 4; j++){
				if(board[i][j] != 0){
					for(var k = 0;k < j; k++){
						if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
							//无元素 并且无障碍物  move
							showMoveAnimation(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]){
							//move add
							showMoveAnimation(i, j, i, k);
							board[i][k] *= 2;
							board[i][j] = 0;
							score += board[i][k];
							if(highScore < score){
								highScore = score;
								setStorage();
							}
							updateScore(score);
							hasConflicted[i][k] = true;
							continue;
						}
					}
				}
			};
		}
		setTimeout(function(){
			updateBoardView()
		}, 150);
		return true;
	}
}

function moveUp(){
	if(!canMoveUp(board)){//判断是否能移动
		return false;
	}else{

		for(var i = 1; i < 4; i++){
			for(var j = 0; j < 4; j++){
				if(board[i][j] != 0){
					for(var k = 0;k < i; k++){
						if(board[k][j] == 0 && noBlockVertical(j, k, i, board)){
							//无元素 并且无障碍物  move
							showMoveAnimation(i, j, k, j);
							board[k][j] = board[i][j];
                        	board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]){
							//move add
							showMoveAnimation(i, j, k, j);
							board[k][j] *= 2;
                        	board[i][j] = 0;
							score += board[k][j];
							if(highScore < score){
								highScore = score;
								setStorage();
							}
							updateScore(score);
							hasConflicted[k][j] = true;
							continue;
						}
					}
				}

			};
		}
		setTimeout(function(){
			updateBoardView()
		}, 150);
		return true;
	}
}
function moveRight(){

	if(!canMoveRight(board)){//判断是否能移动
		return false;
	}else{
		for(var i = 0; i < 4; i++){
			for(var j = 2; j >= 0; j--){
				if(board[i][j] != 0){
					for(var k = 3;k > j; k--){
						if(board[i][k] == 0 && noBlockHorizontal(i, k, j, board)){
							//无元素 并且无障碍物  move
							showMoveAnimation(i, j, i, k);
							board[i][k] = board[i][j];
							board[i][j] = 0;
							continue;
						}else if(board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board)  && !hasConflicted[i][k]){
							//move add
							showMoveAnimation(i, j, i, k);
							board[i][k] *= 2;
							board[i][j] = 0;
							score += board[i][k];
							if(highScore < score){
								highScore = score;
								setStorage();
							}
							updateScore(score);
							hasConflicted[i][k] = true;
							continue;
						}
					}
				}

			};
		}
		setTimeout(function(){
			updateBoardView()
		}, 150);
		return true;
	}
}
function moveDown(){
	if(!canMoveDown(board)){//判断是否能移动
		return false;
	}else{

		for(var i = 2; i >= 0; i--){
			for(var j = 0; j < 4; j++){
				if(board[i][j] != 0){
					for(var k = 3;k > i; k--){
						if(board[k][j] == 0 && noBlockHorizontal(j, i, k, board)){
							//无元素 并且无障碍物  move
							showMoveAnimation(i, j, k, j);
							board[k][j] = board[i][j];
                        	board[i][j] = 0;
							continue;
						}else if(board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]){
							//move add
							showMoveAnimation(i, j, k, j);
							board[k][j] *= 2;
							board[i][j] = 0;
							score += board[k][j];
							if(highScore < score){
								highScore = score;
								setStorage();
							}
							updateScore(score);
							hasConflicted[k][j] = true;
							continue;
						}
					}
				}

			};
		}
		setTimeout(function(){
			updateBoardView()
		}, 150);
		return true;
	}
}

function isGameOver(){
	//没有空间
	if(nospace(board) && noMove(board)){
		gameOver();
	}
}

function gameOver(){
	setStorage();
	alert('Game Over');
}

function showNumberWithAnimation(i, j, number){
	var numberCell = $('#number-cell-' + i + '-' + j);
	numberCell.css('background-color', getNumberBackgroundColor(number));
	numberCell.text(number);

	numberCell.animate({
		'width' : cellSideLength,
		'height' : cellSideLength,
		'top' : getPosTop(i, j),
		'left' : getPosLeft(i, j)
	}, 50);
}

function showMoveAnimation(fromX, fromY, toX, toY){
	var numberCell = $('#number-cell-' + fromX + '-' + fromY);
	numberCell.animate({
		'top' : getPosTop(toX, toY),
		'left' : getPosLeft(toX, toY)
	}, 150);
}

function getPosTop(i, j){
	return cellSpace + i * (cellSideLength + cellSpace);
}
function getPosLeft(i, j){
	return cellSpace + j * (cellSideLength + cellSpace);
}

function getNumberBackgroundColor(number){
	switch(number){
		case 2 	  : return '#d55336'; break;
		case 4 	  : return '#30a7c2'; break;
		case 8 	  : return '#d55336'; break;
		case 16   : return '#30a7c2'; break;
		case 32   : return '#d55336'; break;
		case 64   : return '#30a7c2'; break;
		case 128  : return '#d55336'; break;
		case 256  : return '#30a7c2'; break;
		case 512  : return '#d55336'; break;
		case 1024 : return '#30a7c2'; break;
		case 2048 : return '#d55336'; break;
		case 4096 : return '#30a7c2'; break;
		case 8192 : return '#d55336'; break;
	}
	return '#000';
}

function nospace(board){
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(board[i][j] == 0){
				return false;
			}
		};
	}
	return true;
}

function canMoveLeft(board){
	for(var i = 0; i < 4; i++){
		for(var j = 1; j < 4; j++){
			if(board[i][j] != 0){
				//判断左侧是否有数字
				//判断左侧数字是否相等
				if(board[i][j-1] == 0 || board[i][j-1] == board[i][j]){
					return true;
				}
			}
		};
	}
	return false;
}

function canMoveRight(board){
	for(var i = 0; i < 4; i++){
		for(var j = 2; j >= 0; j--){
			if(board[i][j] != 0){
				//判断左侧是否有数字
				//判断左侧数字是否相等
				if(board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]){
					return true;
				}
			}
		};
	}
	return false;
}

function canMoveUp(board){
	for(var i = 1; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(board[i][j] != 0){
				//判断左侧是否有数字
				//判断左侧数字是否相等
				if(board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]){
					return true;
				}
			}
		};
	}
	return false;
}

function canMoveDown(board){
	for(var i = 2; i >= 0; i--){
		for(var j = 0; j < 4; j++){
			if(board[i][j] != 0){
				//判断左侧是否有数字
				//判断左侧数字是否相等
				if(board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]){
					return true;
				}
			}
		};
	}
	return false;
}

function noBlockHorizontal(row, col1, col2, board){
	for(var i = col1 + 1; i < col2; i++){
		if(board[row][i] != 0){
			return false;
		}
	}
	return true;
}

function noBlockVertical(col, row1, row2, board){
	for(var i = row1 + 1; i < row2; i++){
		if(board[i][col] != 0){
			return false;
		}
	}
	return true;
}

function noMove(board){
	if(canMoveDown(board) || canMoveUp(board) || canMoveRight(board) || canMoveLeft(board)){
		return false;
	}
	return true;
}

function updateScore(score){
	$('#score').text(score);
	$('#highScore').text(highScore);
}

//获取本地存储
function getStorage(){
	return localStorage.getItem('coolfishstudio_2048');
}
//添加本地存储
function setStorage(){
	localStorage.setItem('coolfishstudio_2048', highScore);
}
