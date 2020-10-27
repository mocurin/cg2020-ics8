'use strict';

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");

function getRandomColor() {
	return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
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

		if (vert[hi].x != vert[lo].x) {
			let k = (vert[hi].y - vert[lo].y) / (vert[hi].x - vert[lo].x);
			for (let j = vert[lo].y; j < vert[hi].y; ++j) {
				if (typeof yarray[j] == "undefined") yarray[j] = [];
				yarray[j].push((j - vert[lo].y)/k + vert[lo].x);
			}
		} else {
			for (let j = vert[lo].y; j < vert[hi].y; ++j) {
				if (typeof yarray[j] == "undefined") yarray[j] = [];
				yarray[j].push(vert[lo].x);
			}
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


let diamond_v = [
	{x: 0.000000E+00, y: 0.000000E+00, z: 78.0000},
	{x: 45.0000, y: 45.0000, z: 0.000000E+00},
	{x: 45.0000, y: -45.0000, z: 0.000000E+00},
	{x: -45.0000, y: -45.0000, z: 0.000000E+00},
	{x: -45.0000, y: 45.0000, z: 0.000000E+00},
	{x: 0.000000E+00, y: 0.000000E+00, z: -78.0000}
]

for (let i = 0; i < diamond_v.length; ++i) {
	diamond_v[i].x += canvas.width / 2;
	diamond_v[i].y += canvas.height / 2;
}

let diamond_f = [
    [1, 2, 3],
    [1, 3, 4],
    [1, 4, 5],
    [1, 5, 2],
    [6, 5, 4],
    [6, 4, 3],
    [6, 3, 2],
    [6, 2, 1],
    [6, 1, 5]
]

for (let f = 0; f < diamond_f.length; ++f) {
	let points = []
	for (let i = 0; i < diamond_f[f].length; ++i) {
		points.push(diamond_v[diamond_f[f][i] - 1]);
	}
	ctx.fillStyle = getRandomColor();
	FillPolygon(ctx, points);
}


// let vertices = [];

// canvas.addEventListener("click", function(event){
// 	vertices.push(new Point(event.offsetX, event.offsetY));
// })

// canvas.addEventListener("keydown", function(event) {
// 	if (event.key == ' ') {
// 		console.log(vertices);
// 		FillPolygon(ctx, vertices);
// 		vertices = [];
// 	}
// })