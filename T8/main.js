"use strict";

let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");

function getRandomColor() {
	return "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

function FillPolygon(context, vert, ax0=0, ax1=1) {
	let miny = vert[0][ax1], maxy = vert[0][ax1];
	for (let i = 0; i < vert.length; ++i) {
		if (vert[i][ax1] < miny) miny = vert[i][ax1];
		if (vert[i][ax1] > maxy) maxy = vert[i][ax1];
	}

	let yarray = [];
	for (let i = 0; i < vert.length; ++i) {
		let p = 0;
		if (i != vert.length - 1) p = i + 1;
		let hi = 0, lo = 0;
		if (vert[i][ax1] > vert[p][ax1]) {hi = i; lo = p;}
		else if (vert[i][ax1] < vert[p][ax1]) {hi = p; lo = i;}
		else continue;

		if (vert[hi][ax0] != vert[lo][ax0]) {
			let k = (vert[hi][ax1] - vert[lo][ax1]) / (vert[hi][ax0] - vert[lo][ax0]);
			for (let j = vert[lo][ax1]; j < vert[hi][ax1]; ++j) {
				if (typeof yarray[j] == "undefined") yarray[j] = [];
				yarray[j].push((j - vert[lo][ax1])/k + vert[lo][ax0]);
			}
		} else {
			for (let j = vert[lo][ax1]; j < vert[hi][ax1]; ++j) {
				if (typeof yarray[j] == "undefined") yarray[j] = [];
				yarray[j].push(vert[lo][ax0]);
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

function shiftPos(vertices, delta=[1, 1, 1], axis=[0, 1, 2]) {
	for (let i = 0; i < vertices.length; ++i) {
		for (let j = 0; j < axis.length; ++j) {
			vertices[i][axis[j]] += delta[j];
		}
	}
}

function scalePos(vertices, scale=[1, 1, 1], axis=[0, 1, 2]) {
	for (let i = 0; i < vertices.length; ++i) {
		for (let j = 0; j < axis.length; ++j) {
			vertices[i][axis[j]] *= scale[j];
		}
	}
}


function drawFig(ctx, fig_faces, fig_vertices, ax0=0, ax1=1) {
	for (let i = 0; i < fig_faces.length; ++i) {
		let points = [];
		for (let j = 0; j < fig_faces[i].length; ++j) {
			points.push(fig_vertices[fig_faces[i][j] - 1]);
		}
		ctx.fillStyle = getRandomColor();
		FillPolygon(ctx, points, ax0, ax1);
	}
}

const fs = document.getElementById("file-selector");

fs.addEventListener("change", function(event) {
	ctx.fillStyle = "#0xFFFFFF";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const fr = new FileReader();
	fr.onload = function(event) {
		let data = JSON.parse(fr.result);
		let vertices = data.v;
		let faces = data.f;
		console.log(data);

		scalePos(vertices, [-2, -2, -2], [0, 1, 2]);
		shiftPos(vertices, [canvas.width / 2, canvas.width / 2, canvas.width / 2], [0, 1, 2]);
		drawFig(ctx, faces, vertices, 0, 1);
	};
	fr.readAsText(event.target.files[0]);
});

let btn = document.getElementById("btn");

btn.addEventListener("click", function(event) {
	let dataUrl = canvas.toDataURL("image/png");
	btn.href = dataUrl;
	btn.download = "test.png";
});