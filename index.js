let c = document.getElementById('win-canvas');
let ctx = c.getContext('2d');

let load_img = (src, callback) => {
	let img = document.createElement('img');
	img.onload = () => callback(img);
	img.src = src;
};

let img_path = (anim, f_num) => {
	return 'images/' + anim + '/' + f_num + '.png';
};

anims_dict = {
	idle: [1, 2, 3, 4, 5, 6, 7, 8],
	kick: [1, 2, 3, 4, 5, 6, 7],
	punch: [1, 2, 3, 4, 5, 6, 7],
	backward: [1, 2, 3, 4, 5, 6],
	block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
	forward: [1, 2, 3, 4, 5, 6],
};

let load_frames = (callback) => {
	let frames = {
		idle: [],
		kick: [],
		punch: [],
		backward: [],
		block: [],
		forward: [],
	};
	let frames_to_load = 0;

	['idle', 'kick', 'punch', 'forward', 'block', 'backward'].forEach(
		(animation) => {
			let animatedFrames = anims_dict[animation];
			frames_to_load += animatedFrames.length;

			animatedFrames.forEach((frameNumber) => {
				let path = img_path(animation, frameNumber);
				load_img(path, (image) => {
					frames[animation][frameNumber - 1] = image;
					frames_to_load -= 1;

					if (frames_to_load === 0) {
						callback(frames);
					}
				});
			});
		}
	);
};

let animate = (ctx, images, animation, callback) => {
	images[animation].forEach((image, index) => {
		setTimeout(() => {
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.drawImage(image, 0, 0, c.width, c.height);
		}, index * 100);
	});
	setTimeout(callback, images[animation].length * 100);
};

load_frames((images) => {
	let animationQueue = [];
	let aux = () => {
		let selectedAnimation = '';
		if (animationQueue.length === 0) selectedAnimation = 'idle';
		else selectedAnimation = animationQueue.shift();
		animate(ctx, images, selectedAnimation, aux);
	};

	aux();

	document.getElementById('forward').addEventListener('click', () => {
		animationQueue.push('forward');
	});

	document.getElementById('backward').addEventListener('click', () => {
		animationQueue.push('backward');
	});

	document.getElementById('block').addEventListener('click', () => {
		animationQueue.push('block');
	});

	document.getElementById('kick').onclick = () => {
		animationQueue.push('kick');
	};

	document.getElementById('punch').onclick = () => {
		animationQueue.push('punch');
	};

	document.addEventListener('keydown', function (event) {
		if (event.key === 'd') animationQueue.push('forward');
		else if (event.key === 'a') animationQueue.push('backward');
		else if (event.key === 'w') animationQueue.push('punch');
		else if (event.key === 's') animationQueue.push('kick');
		else if (event.code === 'Space') animationQueue.push('block');
	});
});
