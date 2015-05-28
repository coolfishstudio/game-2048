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