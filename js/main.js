var board = [];//游戏数据
var score = 0;//游戏分数
var highScore = 0;//最高分
var hasConflicted = [];

var startX = 0;
var startY = 0;
var endX = 0;
var endY = 0;

//入口
$(document).ready(function(){
	prepareForMobile();
	newGame();
});

function prepareForMobile(){
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
				theNumberCell.css({
					'width' : cellSideLength,
					'height' : cellSideLength,
					'top' : getPosTop(i, j),
					'left' : getPosLeft(i, j),
					'background-color' : getNumberBackgroundColor(board[i][j])
				});
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j] = false;
		}
	}
	$('.number-cell').css({
		'line-height' : cellSideLength + 'px',
		'font-size' : 0.6 * cellSideLength + 'px'
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

// $(document).keydown(function(event){
// 	switch(event.keyCode){
// 		case 37 : //left
//			event.preventDefault();
// 			if(moveLeft()){
// 				setTimeout(function(){
// 					generateOneNumber();
// 				},180);
// 				setTimeout(function(){
// 					 isGameOver();
// 				},250);
// 			}
// 			break;
// 		case 38 : //up
//			event.preventDefault();
// 			if(moveUp()){
// 				setTimeout(function(){
// 					generateOneNumber();
// 				},180);
// 				setTimeout(function(){
// 					 isGameOver();
// 				},250);
// 			}
// 			break;
// 		case 39 : //right
//			event.preventDefault();
// 			if(moveRight()){
// 				setTimeout(function(){
// 					generateOneNumber();
// 				},180);
// 				setTimeout(function(){
// 					 isGameOver();
// 				},250);
// 			}
// 			break;
// 		case 40 : //down
//			event.preventDefault();
// 			if(moveDown()){
// 				setTimeout(function(){
// 					generateOneNumber();
// 				},180);
// 				setTimeout(function(){
// 					 isGameOver();
// 				},250);
// 			}
// 			break;
// 		default : //default
// 			break;
// 	}
// });

document.addEventListener('touchstart', function(event){
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event){
	event.preventDefault();
});

document.addEventListener('touchend', function(event){
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

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














