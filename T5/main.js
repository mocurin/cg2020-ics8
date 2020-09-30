'use strict';
function Line(ctx, x0, y0, x1, y1) {
	var dy = Math.abs(y1-y0);
	var dx = Math.abs(x1-x0);
	var dmax = Math.max(dx, dy);
	var dmin = Math.min(dx, dy);
	var xdir = 1;
	if (x1<x0) xdir = -1;	
	var ydir = 1;
	if (y1<y0) ydir = -1;
	var eps = 0;
	var s = 1;
	var k=2*dmin;
	if (dy<=dx) {
		var y = y0;
		for (var x=x0; x*xdir<=x1*xdir; x+=xdir) {
			ctx.fillRect(x*s, y*s, 1*s, 1*s);
			eps = eps+k;
			if (eps>dmax) {
				y+=ydir;
				eps = eps - 2*dmax;
			}	
		} 
	} else {
		var x = x0;
		for (var y=y0; y*ydir<=y1*ydir; y+=ydir) {
			ctx.fillRect(x*s, y*s, 1*s, 1*s);
			eps = eps+k;
			if (eps>dmax) {
				x+=xdir;
				eps = eps - 2*dmax;
			}	
		} 
	}		
}

var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");

var state = 0;
var ax, ay;
var bx, by;
var p1x, p1y;
var p2x, p2y;

canvas.addEventListener("click", function(event){
		if (state == 0) {
			ax = event.offsetX;
			ay = event.offsetY;
			state = 1;
		} else if (state == 1) {
			bx = event.offsetX;
			by = event.offsetY;
			Line(ctx, ax, ay, bx, by);
			state = 2;
		} else if (state == 2) {
			p1x = event.offsetX;
			p1y = event.offsetY;
			state = 3;
		} else if (state == 3) {
			p2x = event.offsetX;
			p2y = event.offsetY;
			Line(ctx, p1x, p1y, p2x, p2y);

			var t = ( (p1y-p2y)*(ax-p1x)+(p2x-p1x)*(ay-p1y) ) / ( (bx-ax)*(p2y-p1y)+(by-ay)*(p1x-p2x) );
			if (t<=1 && t>=0) {
				var ex = (bx-ax)*t+ax;
				var ey = (by-ay)*t+ay;
				ctx.fillStyle = "#00ff00";
				Line(ctx, ex, ey, bx, by); 
				ctx.fillStyle = "#000000";
			}
			state = 0;
		}	
	});
