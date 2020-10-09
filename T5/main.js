'use strict';
class Line {
	constructor(x0, y0, x1, y1) {
		this.x0 = x0
		this.x1 = x1
		this.y0 = y0
		this.y1 = y1
	}

	// draw(ctx) {
	// 	let dy = Math.abs(this.y1 - this.y0);
	// 	let dx = Math.abs(this.x1 - this.x0);
	// 	let dmax = Math.max(dx, dy);
	// 	let dmin = Math.min(dx, dy);
	// 	let xdir = 1;
	// 	let ydir = 1;
	// 	if (this.x1 < this.x0) xdir = -1;	
	// 	if (this.y1 < this.y0) ydir = -1;
	// 	let eps = 0;
	// 	let s = 1;
	// 	let k = 2 * dmin;
	// 	if (dy <= dx) {
	// 		let y = this.y0;
	// 		for (let x = this.x0; x * xdir <= this.x1 * xdir; x += xdir) {
	// 			ctx.fillRect(x * s, y * s, 1 * s, 1 * s);
	// 			eps += k;
	// 			if (eps > dmax) {
	// 				y += ydir;
	// 				eps -= 2 * dmax;
	// 			}
	// 		} 
	// 	} else {
	// 		let x = this.x0;
	// 		for (let y = this.y0; y * ydir <= this.y1 * ydir; y += ydir) {
	// 			ctx.fillRect(x * s, y * s, 1 * s, 1 * s);
	// 			eps += k;
	// 			if (eps > dmax) {
	// 				x += xdir;
	// 				eps -= 2 * dmax;
	// 			}	
	// 		} 
	// 	}
	// }

	draw(ctx) {
		const deltaX = Math.abs(this.x1 - this.x0);
		const deltaY = Math.abs(this.y1 - this.y0);
		const signX = this.x1 < this.x0 ? -1 : 1;
		const signY = this.y1 < this.y0 ? -1 : 1;
		let eps = deltaX - deltaY;
		let x = this.x0;
		let y = this.y0;

		while (x != this.x1 || y != this.y1) {
			ctx.fillRect(x, y, 1, 1);

			if (eps << 1 > -deltaY) {
				eps -= deltaY;
				if (x != this.x1) x += signX;
			}
			if (eps << 1 < deltaX) {
				eps += deltaX;
				if (y != this.y1) y += signY;
			}
		}
	}
}

function cyrus_beck(line0, line1) {
	let t = ((line1.y0 - line1.y1) * (line0.x0 - line1.x0) + (line1.x1 - line1.x0) * (line0.y0 - line1.y0))
		/ ((line0.x1 - line0.x0) * (line1.y1 - line1.y0) + (line0.y1 - line0.y0) * (line1.x0 - line1.x1));
	if (t <= 1 && t >= 0) {
		let ex = (line0.x1 - line0.x0) * t + line0.x0;
		let ey = (line0.y1 - line0.y0) * t + line0.y0;
		return new Line(ex, ey, line0.x1, line0.y1);
	}
	return line1;
}

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");


let fx, fy;
let cx, cy;
let unset = true;
let lines = [];

let state = 0;

// let state = 0;
// let ax, ay;
// let bx, by;
// let p1x, p1y;
// let p2x, p2y;

 
canvas.addEventListener("click", function(event) {
		if (unset && state == 0) {
			unset = false;
			fx = event.offsetX;
			fy = event.offsetY;
			cx = fx;
			cy = fy;
		} else if (state == 0) {
			let line = new Line(cx, cy, event.offsetX, event.offsetY);
			line.draw(ctx);
			lines.push(line);
			cx = event.offsetX;
			cy = event.offsetY;
		} else if (unset && state == 1) {
			unset = false;
			cx = event.offsetX;
			cy = event.offsetY;
		} else if (state == 1) {
			unset = true;
			state = 0;
			console.log(lines.length)
			let line = new Line(cx, cy, event.offsetX, event.offsetY);
			// line.draw(ctx);
			for (let i = 0; i < lines.length; ++i) {
				line = cyrus_beck(line, lines[i]);
			}
			ctx.fillStyle = "#00FF00";
			line.draw(ctx);
			ctx.fillStyle = "#000000";
		}
		// if (state == 0) {
		// 	ax = event.offsetX;
		// 	ay = event.offsetY;
		// 	state = 1;
		// } else if (state == 1) {
		// 	bx = event.offsetX;
		// 	by = event.offsetY;
		// 	Line(ctx, ax, ay, bx, by);
		// 	state = 2;
		// } else if (state == 2) {
		// 	p1x = event.offsetX;
		// 	p1y = event.offsetY;
		// 	state = 3;
		// } else if (state == 3) {
		// 	p2x = event.offsetX;
		// 	p2y = event.offsetY;
		// 	Line(ctx, p1x, p1y, p2x, p2y);

		// 	let t = ( (p1y - p2y) * (ax - p1x) + (p2x-p1x)*(ay-p1y) ) / ( (bx-ax)*(p2y-p1y)+(by-ay)*(p1x-p2x) );
		// 	if (t<=1 && t>=0) {
		// 		let ex = (bx-ax)*t+ax;
		// 		let ey = (by-ay)*t+ay;
		// 		ctx.fillStyle = "#00ff00";
		// 		Line(ctx, ex, ey, bx, by); 
		// 		ctx.fillStyle = "#000000";
		// 	}
		// 	state = 0;
		// }
});

canvas.addEventListener("dblclick", function(event) {
		unset = true;
		state = 1
		let line = new Line(fx, fy, event.offsetX, event.offsetY);
		line.draw(ctx);
		lines.push(line);
})
