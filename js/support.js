var documentWidth = window.screen.availWidth;
var gridContainerWidth = 0.92 * documentWidth;
var cellSideLength = 0.18 * documentWidth;
var cellSpace = 0.04 * documentWidth;

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