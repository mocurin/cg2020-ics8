'use strict';

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");

class Point{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function FillPolygon(context, vert) {
	let miny = vert[0].y, maxy = vert[0].y;
	for (let i = 0; i < vert.length; ++i) {
		if (vert[i].y < miny) miny = vert[i].y;
		if (vert[i].y > maxy) maxy = vert[i].y;
	}

	let yarray = [];
	for (let i = 0; i < vert.length; ++i) {
		let p = 0;
		if (i != vert.length - 1) p = i + 1;
		let hi = 0, lo = 0;
		if (vert[i].y > vert[p].y) {hi = i; lo = p;}
		else if (vert[i].y < vert[p].y) {hi = p; lo = i;}
		else continue;

		let k = (vert[hi].y - vert[lo].y) / (vert[hi].x - vert[lo].x);
		for (let j = vert[lo].y; j < vert[hi].y; ++j) {
			if (typeof yarray[j] == "undefined") yarray[j] = [];
			yarray[j].push((j - vert[lo].y)/k + vert[lo].x) 
		}
	}

	for (let y = miny; y < maxy; ++y) {
		let xarray = yarray[y].sort(function(a, b) { return a - b; });
		for (let j = 0; j < xarray.length / 2; ++j) {
			for (let x = xarray[j*2]; x < xarray[j*2+1]; ++x) {
					ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
			}
		}
	}
}

let vertices = [];

canvas.addEventListener("click", function(event){
	vertices.push(new Point(event.offsetX, event.offsetY));
})

canvas.addEventListener("keydown", function(event) {
	if (event.key == ' ') {
		console.log(vertices);
		FillPolygon(ctx, vertices);
		vertices = [];
	}
})