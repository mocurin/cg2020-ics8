'use strict';

function drawLine(context, x0, y0, x1, y1) {
	if (x0 > x1) {
		[x0, x1] = [x1, x0]
	}
	if (y0 > y1) {
		[y0, y1] = [y1, y0]
	}

	let delta = 2 * (y1 - y0);
	let eps = 0;
	let y = y0;

	for (let x = x0; x <= x1; ++x) {
		eps += delta;
		if (eps > (x1 - x0)) {
			eps -= 2 * (x1 - x0);
			++y;
		}
		context.fillRect(x, y, 1, 1);
	}
}
	

let canvas = document.getElementById('canv');
let context = canvas.getContext('2d');

let flag = false;
let x = 0;
let y = 0;

canvas.addEventListener('click', function(event) {
	if (!flag) {
		x = event.offsetX;
		y = event.offsetY;
		flag = true;
		return;
	}
	flag = false;
	drawLine(context, x, y, event.offsetX, event.offsetY);
})