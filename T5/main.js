'use strict';
class Line {
	constructor(x0, y0, x1, y1) {
		this.x0 = x0
		this.x1 = x1
		this.y0 = y0
		this.y1 = y1
	}

	draw(ctx) {
		var dy = Math.abs(this.y1 - this.y0);
		var dx = Math.abs(this.x1 - this.x0);
		var dmax = Math.max(dx, dy);
		var dmin = Math.min(dx, dy);
		var xdir = 1;
		var ydir = 1;
		if (this.x1 < this.x0) xdir = -1;	
		if (this.y1 < this.y0) ydir = -1;
		var eps = 0;
		var s = 1;
		var k = 2 * dmin;
		if (dy <= dx) {
			var y = this.y0;
			for (var x = this.x0; x * xdir <= this.x1 * xdir; x += xdir) {
				ctx.fillRect(x * s, y * s, 1 * s, 1 * s);
				eps += k;
				if (eps > dmax) {
					y += ydir;
					eps -= 2 * dmax;
				}
			} 
		} else {
			var x = this.x0;
			for (var y = this.y0; y * ydir <= this.y1 * ydir; y += ydir) {
				ctx.fillRect(x * s, y * s, 1 * s, 1 * s);
				eps += k;
				if (eps > dmax) {
					x += xdir;
					eps -= 2 * dmax;
				}	
			} 
		}
	}

	cyrus_beck(line) {
		var t = ((this.y0 - this.y1) * (line.x0 - this.x0) + (this.x1 - this.x0) * (line.y0 - this.y0) ) /
			((line.x1 - line.x0) * (this.y1 - this.y0) + (line.y1 - line.y0) * (this.x0 - this.x1));
		if (t <= 1 && t >= 0) {
			var ex = (line.x1 - line.x0) * t + line.x0;
			var ey = (line.y1 - line.y0) * t + line.y0;
			return new Line(ex, ey, line.x1, line.y1); 
		}
	}
}

var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");


var fx, fy;
var cx, cy;
var unset = true;
var lines = [];

var state = 0;

// var state = 0;
// var ax, ay;
// var bx, by;
// var p1x, p1y;
// var p2x, p2y;

 
canvas.addEventListener("click", function(event) {
		if (unset && state == 0) {
			unset = false;
			fx = event.offsetX;
			fy = event.offsetY;
			cx = fx;
			cy = fy;
		} else if (state == 0) {
			var line = new Line(cx, cy, event.offsetX, event.offsetY);
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
			var line = new Line(cx, cy, event.offsetX, event.offsetY);
			// line.draw(ctx);
			for (var i = 0; i < lines.length; ++i) {
				line = line.cyrus_beck(lines[i]);
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

		// 	var t = ( (p1y - p2y) * (ax - p1x) + (p2x-p1x)*(ay-p1y) ) / ( (bx-ax)*(p2y-p1y)+(by-ay)*(p1x-p2x) );
		// 	if (t<=1 && t>=0) {
		// 		var ex = (bx-ax)*t+ax;
		// 		var ey = (by-ay)*t+ay;
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
		var line = new Line(fx, fy, event.offsetX, event.offsetY);
		line.draw(ctx);
		lines.push(line);
})
