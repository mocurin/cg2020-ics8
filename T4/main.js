'use strict';

function bell(source_cnv, source_ctx, target_cnv, target_ctx) {
	let source_img_data = source_ctx.getImageData(0, 0, source_cnv.width, source_cnv.height);
	let target_img_data = target_ctx.getImageData(0, 0, source_cnv.width, source_cnv.height);

	for (let i = 0; i < source_cnv.height; ++i) {
        for (let j = 0; j < source_cnv.width; ++j) {
            for (let k = 0; k < 3; ++k) {
                let p = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                p[0] = source_img_data.data[4 * ((i - 1) * source_cnv.width + j - 1) + k];
                p[1] = source_img_data.data[4 * ((i - 1) * source_cnv.width + j) + k];
                p[2] = source_img_data.data[4 * ((i - 1) * source_cnv.width + j + 1) + k];

                p[3] = source_img_data.data[4 * (i * source_cnv.width + j - 1) + k];
                p[4] = source_img_data.data[4 * (i * source_cnv.width + j) + k];
                p[5] = source_img_data.data[4 * (i * source_cnv.width + j + 1) + k];

                p[6] = source_img_data.data[4 * ((i + 1) * source_cnv.width + j - 1) + k];
                p[7] = source_img_data.data[4 * ((i + 1) * source_cnv.width + j) + k];
                p[8] = source_img_data.data[4 * ((i + 1) * source_cnv.width + j + 1) + k];

                target_img_data.data[4 * (i * source_cnv.width + j) + k] =
                 (p[0] + p[2] + p[6] + p[8] + 2 * (p[1] + p[3] + p[5] + p[7]) + 4 * p[4]) / 16; // S;
            }
            target_img_data.data[4 * (i * source_cnv.width + j) + 3] = 255;
        }
    }
    target_ctx.putImageData(target_img_data, 0, 0);
}

function sobel(source_cnv, source_ctx, target_cnv, target_ctx) {
	let source_img_data = source_ctx.getImageData(0, 0, source_cnv.width, source_cnv.height);
	let target_img_data = target_ctx.getImageData(0, 0, source_cnv.width, source_cnv.height);

	for (let i = 0; i < source_cnv.height; ++i) {
        for (let j = 0; j < source_cnv.width; ++j) {
            for (let k = 0; k < 3; ++k) {
                let p = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                p[0] = source_img_data.data[4 * ((i - 1) * source_cnv.width + j - 1) + k];
                p[1] = source_img_data.data[4 * ((i - 1) * source_cnv.width + j) + k];
                p[2] = source_img_data.data[4 * ((i - 1) * source_cnv.width + j + 1) + k];

                p[3] = source_img_data.data[4 * (i * source_cnv.width + j - 1) + k];
                p[4] = source_img_data.data[4 * (i * source_cnv.width + j) + k];
                p[5] = source_img_data.data[4 * (i * source_cnv.width + j + 1) + k];

                p[6] = source_img_data.data[4 * ((i + 1) * source_cnv.width + j - 1) + k];
                p[7] = source_img_data.data[4 * ((i + 1) * source_cnv.width + j) + k];
                p[8] = source_img_data.data[4 * ((i + 1) * source_cnv.width + j + 1) + k];

                let Sx = (-1) * p[0] + (0) * p[1] + (1) * p[2] + (-2) * p[3] + (0) * p[4]
                	+ 2 * p[5] + (-1) * p[6] + (0) * p[7] + 2 * p[8];

                let Sy = (-1) * p[0] + (-2) * p[1] + (-1) * p[2] + (0) * p[3] + (0) * p[4]
                	+ (0) * p[5] + (1) * p[6] + (2) * p[7] + (1) * p[8];

                let S = Math.sqrt(Sx * Sx + Sy * Sy);
                S < 128 ? S = 0 : S = S;

                target_img_data.data[4 * (i * source_cnv.width + j) + k] = S;
            }
            target_img_data.data[4 * (i * source_cnv.width + j) + 3] = 255;
        }
    }
    target_ctx.putImageData(target_img_data, 0, 0);
}

let cnv1 = document.getElementById('canv1');
let ctx1 = cnv1.getContext('2d');

let cnv2 = document.getElementById('canv2');
let ctx2 = cnv2.getContext('2d');

let cnv3 = document.getElementById('canv3');
let ctx3 = cnv3.getContext('2d');

let cnv4 = document.getElementById('canv4');
let ctx4 = cnv4.getContext('2d');

let img = new Image();
img.src = 'test.jpg';

img.onload = function () {
    ctx1.drawImage(img, 0, 0);

    bell(cnv1, ctx1, cnv2, ctx2);
    sobel(cnv1, ctx1, cnv3, ctx3);
    bell(cnv3, ctx3, cnv4, ctx4);
}

let btn1 = document.getElementById('btn1');
btn1.addEventListener('click', function (event) {
    btn1.href = cnv2.toDataURL('image/png');
    btn1.download = 'Bell.png';
});

let btn2 = document.getElementById('btn2');
btn2.addEventListener('click', function (event) {
    btn2.href = cnv3.toDataURL('image/png');
    btn2.download = 'Sobel.png';
});

let btn3 = document.getElementById('btn3');
btn3.addEventListener('click', function (event) {
    btn3.href = cnv4.toDataURL('image/png');
    btn3.download = 'Sobel-Bell.png';
});
