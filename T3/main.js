'use strict';

// With || in loop condition line "overshoots" sometimes.
// E.g. when x0 = x1 - 1 and y0 = y1 and then both x0, y0 get +=1 within one iteration,
// line goes past y1 and loop never breaks. So we have to either check if x0/y0 are already == x1/y1
// before each increment, or recheck loop condition after each coordinate shift.
// Also later variant might be broken with 45 degree lines, as dots could not be shifted
// diagonally and are being drawn on every loop iteration.

function drawLine(context, x0, y0, x1, y1) {
	const deltaX = Math.abs(x1 - x0);
	const deltaY = Math.abs(y1 - y0);
	const signX = x1 < x0 ? -1 : 1;
	const signY = y1 < y0 ? -1 : 1;
	let eps = deltaX - deltaY;

	while (x0 != x1 || y0 != y1) {
		context.fillRect(x0, y0, 1, 1);

		if (eps << 1 > -deltaY) {
			eps -= deltaY;
			if (x0 != x1) x0 += signX;
		}
		if (eps << 1 < deltaX) {
			eps += deltaX;
			if (y0 != y1) y0 += signY;
		}
	}
}

let canvas = document.getElementById('canv');
let context = canvas.getContext('2d');

let x = Math.floor(canvas.width >> 1);
let y = Math.floor(canvas.height >> 1);

// This setup demonstrates seamless transitions along consequtive lines

context.fillStyle = '#421337';
canvas.addEventListener('click', function(event) {
	drawLine(context, x, y, event.offsetX, event.offsetY);
	x = event.offsetX;
	y = event.offsetY;
})
