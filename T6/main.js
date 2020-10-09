'use strict';

let canvas1 = document.getElementById('canv1');
let canvas2 = document.getElementById('canv2');
let button = document.getElementById('btn');
let context1 = canvas1.getContext('2d');
let context2 = canvas2.getContext('2d');

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

let image = new Image();
image.src = 'test.png';

let points = [];

image.onload = function() {
	context1.drawImage(image, 0, 0);
	let imageData = context1.getImageData(0, 0, canvas1.width, canvas1.height);
	console.log(imageData);
    let newImageData = context2.createImageData(canvas1.width, canvas1.height);
	for (let i = 0; i < canvas1.height; ++i) {
		for (let j = 0; j < canvas1.width; ++j) {
            if (imageData.data[4 * (i * canvas1.height + j) + 0] < 50 &&
                imageData.data[4 * (i * canvas1.height + j) + 1] < 50 &&
                imageData.data[4 * (i * canvas1.height + j) + 2] < 50 &&
                imageData.data[4 * (i * canvas1.height + j) + 3] >= 10) {
                for (let k = 0; k < 3; ++k) {
                    newImageData.data[4 * (i * canvas1.height + j) + k] = 255; 
                }
                points.push({x: j, y: i});
            }
            else {
                for (let k = 0; k < 3; ++k) {
                    newImageData.data[4 * (i * canvas1.height + j) + k] = 0;
                }
            }
            newImageData.data[4 * (i * canvas1.height + j) + 3] = 255;
		}
	}
	context2.putImageData(newImageData, 0, 0);

    console.log(points);
    const part = 48;
    const threshold = 600;
    let k_array = [];
    let param_2d = [];
    for (let i = 0; i < part; ++i) {
        k_array.push(Math.tan((i + 0.01) * Math.PI / part));
        param_2d.push([]);
    }

    for (let i = 0; i < points.length; ++i) {
        for (let j = 0; j < part; ++j) {
            param_2d[j].push(points[i].y - points[i].x * k_array[j]);
        }
    }
    console.log(param_2d);

    let d = 2;
    for (let i = 0; i < part; ++i) {
        param_2d[i].sort();
        let j = 1;
        while (j < param_2d[i].length) {
            let count = 0;
            let base = param_2d[i][j];
            while ((param_2d[i][j] < base + d) && j < param_2d[i].length) {
                ++count;
                ++j;
            }
            context2.fillStyle = "#00FF00";
            if (count > threshold) {
                let l = function(x) {
                    return k_array[i] * x + base;
                };
                Line(context2, 0, l(0), canvas2.width, l(canvas2.width));
            }
        }
    }
};

// context.fillStyle = '#FF0000';
// for (let i = 0; i < canvas.width; ++i) {
// 	for (let j = 0; j < canvas.height; ++j) {
// 		if (i & 1 ^ j & 1) context.fillRect(i, j, 1, 1);
// 	}
// }

// btn.addEventListener('click', function(event) {
// 	let dataUrl = canvas.toDataURL('image/png');
// 	btn.href = dataUrl;
// 	btn.download = 'test.png';
// });
