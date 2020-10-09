'use strict';

class Vector2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}

	subtract(vec) {
		return new Vector2D(this.x - vec.x, this.y - vec.y);
	}


}

class Line {
	constructor(x0, y0, x1, y1) {
		this.first = new Vector2D(x0, y0);
		this.second = new Vector2D(x1, y1);
	}

	draw(ctx) {
		let dx = Math.abs(this.second.x  - this.first.x);
		let dy = Math.abs(this.second.y - this.first.y);
		let dmax = Math.max(dx, dy);
		let dmin = Math.min(dx, dy);
		let xdir = this.second.x < this.first.x ? -1 : 1;
		let ydir = this.second.y < this.first.y ? -1 : 1;
		let eps = 0;
		let s = 1;
		let k = 2 * dmin;
		if (dy <= dx) {
			let y = this.first.y;
			for (let x = this.first.x; x * xdir <= this.second.x * xdir; x += xdir) {
				ctx.fillRect(x * s, y * s, 1 * s, 1 * s);
				eps += k;
				if (eps > dmax) {
					y += ydir;
					eps -= 2 * dmax;
				}
			} 
		} else {
			let x = this.first.x;
			for (let y = this.first.y; y * ydir <= this.second.y * ydir; y += ydir) {
				ctx.fillRect(x * s, y * s, 1 * s, 1 * s);
				eps += k;
				if (eps > dmax) {
					x += xdir;
					eps -= 2 * dmax;
				}	
			} 
		}
	}

	normal() {
		return new Vector2D(this.first.y - this.second.y, this.second.x - this.first.x);
	}

	vector() {
		return this.second.subtract(this.first);
	}
}

function cyrus_beck(line, polygon) {
	let normals = [];
	for (let i = 0; i < polygon.length; ++i) {
		normals.push(polygon[i].normal());
	}
	let vec = line.vector();
	let vecs = [];
	for (let i = 0; i < polygon.length; ++i) {
		vecs.push(polygon[i].first.subtract(line.first))
	}
	let t;
	let tE = [0];
	let tL = [1];
	for (let i = 0; i < polygon.length; ++i) {
		t = normals[i].dot(vecs[i]) / normals[i].dot(vec);
		normals[i].dot(vec) < 0 ? tE.push(t) : tL.push(t);
	}
	console.log(tE, tL);
	tE = Math.max(...tE);
	tL = Math.min(...tL);
	console.log(tE, tL);
	if (tE > tL) return; // completely outside of polygon
	return new Line(line.first.x + vec.x * tE,
					line.first.y + vec.y * tE,
					line.first.x + vec.x * tL,
					line.first.y + vec.y * tL);
}

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");


let fx, fy;
let cx, cy;
let unset = true;
let lines = [];
let state = 0;
 
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
		let line = new Line(cx, cy, event.offsetX, event.offsetY);
		line = cyrus_beck(line, lines);
		if (line) {
			ctx.fillStyle = "#00FF00";
			line.draw(ctx);
			ctx.fillStyle = "#000000";
		}
		lines = [];
	}
});

canvas.addEventListener("keydown", function(event) {
	if (event.key == " " && state == 0) {
		unset = true;
		state = 1
		let line = new Line(cx, cy, fx, fy);
		line.draw(ctx);
		lines.push(line);
		console.log("Polygon edges: " + lines.length);
	}
})
