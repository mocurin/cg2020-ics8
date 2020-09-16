'use strict';

let canvas1 = document.getElementById('canv1');
let canvas2 = document.getElementById('canv2');
let button = document.getElementById('btn');
let context1 = canvas1.getContext('2d');
let context2 = canvas2.getContext('2d');

let image = new Image();
image.src = 'test.jpg';

image.onload = function() {
	context1.drawImage(image, 0, 0);
	let imageData = context1.getImageData(0, 0, canvas1.width, canvas1.height);
	let newImageData = context2.createImageData(canvas1.width, canvas1.height);
	for (let i = 0; i < canvas1.height; ++i) {
		for (let j = 0; j < canvas1.width; ++ j) {
			let sum = 0;
			for (let k = 0; k < 3; ++k) {
				sum += imageData.data[4 * (i * canvas1.width + j) + k];
			}
			sum /= 3;
			for (let k = 0; k < 3; ++k) {
				newImageData.data[4 * (i * canvas1.width + j) + k] = sum;	
			}
			newImageData.data[4 * (i * canvas1.width + j) + 3] =
				imageData.data[4 * (i * canvas1.width + j) + 3];
		}
	}
	context2.putImageData(newImageData, 0, 0);
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
