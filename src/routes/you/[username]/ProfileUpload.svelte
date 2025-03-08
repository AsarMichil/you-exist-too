<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { toggled = $bindable(), form } = $props();

	let uploading = $state(false);
	let fileInput;
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let image = new Image();
	let scale = $state(1);
	let cropX = $state(0);
	let cropY = $state(0);
	let cropWidth = 500;
	let cropHeight = 500;
	let canvasContainer: HTMLElement;

	onMount(() => {
		ctx = canvas.getContext('2d');
		canvasContainer = document.getElementById('az-canvas-container')!;
		resizeCanvas();
	});
	let rendered = $state();
	function renderImage() {
		const img = new Image();
		rendered = canvas.toDataURL();
	}

	function handleFileUpload(event: Event) {
		const fileInput = event.target as HTMLInputElement;
		const file = fileInput.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				image.onload = () => {
					adjustImageToCanvas();
				};
				image.src = reader.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
	function adjustImageToCanvas() {
		const canvasAspect = canvas.width / canvas.height;
		const imageAspect = image.width / image.height;

		if (imageAspect > canvasAspect) {
			cropWidth = canvas.width;
			cropHeight = canvas.width / imageAspect;
		} else {
			cropHeight = canvas.height;
			cropWidth = canvas.height * imageAspect;
		}

		cropX = (canvas.width - cropWidth * scale) / 2;
		cropY = (canvas.height - cropHeight * scale) / 2;

		drawImage();
	}

	function drawImage() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			image,
			0,
			0,
			image.width,
			image.height,
			cropX,
			cropY,
			cropWidth * scale,
			cropHeight * scale
		);
		log();
	}
	window.addEventListener('resize', resizeCanvasDebounced);
	let resizeTimeoutId: number;
	function resizeCanvasDebounced() {
		window.clearTimeout(resizeTimeoutId);
		resizeTimeoutId = window.setTimeout(resizeCanvas, 125);
	}
	function resizeCanvas() {
		if (!canvas.width || !canvas.height) {
			return;
		}
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
		adjustImageToCanvas();
	}

	// function drawImage() {
	// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 	ctx.drawImage(
	// 		image,
	// 		0,
	// 		0,
	// 		image.width,
	// 		image.height,
	// 		cropX,
	// 		cropY,
	// 		cropWidth * scale,
	// 		cropHeight * scale
	// 	);
	// }

	function zoomIn() {
		scale *= 1.2;
		cropX = (canvas.width - cropWidth * scale) / 2;
		cropY = (canvas.height - cropHeight * scale) / 2;
		drawImage();
	}

	function zoomOut() {
		scale /= 1.2;
		cropX = (canvas.width - cropWidth * scale) / 2;
		cropY = (canvas.height - cropHeight * scale) / 2;
		drawImage();
	}

	function zoomScale(event: Event) {
		scale = event.target.value / 50;
		cropX = (canvas.width - cropWidth * scale) / 2;
		cropY = (canvas.height - cropHeight * scale) / 2;
		drawImage();
	}

	function startDragging(event: MouseEvent) {
		const startX = event.clientX;
		const startY = event.clientY;
		const initialCropX = cropX;
		const initialCropY = cropY;
		const onMouseMove = (moveEvent: MouseEvent) => {
			cropX = initialCropX + (moveEvent.clientX - startX);
			cropY = initialCropY + (moveEvent.clientY - startY);
			console.log(cropX, cropY);
			drawImage();
		};
		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	}

	function log() {
		console.log(
			'cropx',
			cropX,
			'cropy',
			cropY,
			'cropwidth',
			cropWidth,
			'cropheight',
			cropHeight,
			'scale',
			scale
		);
	}
</script>

<div class="mx-auto w-full flex flex-col justify-center items-center h-3/4">
	<form
		action="?/setProfilePhoto"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {}}
	>
		<h2 class="text-3xl">Profile Photo</h2>
		{#if form?.message}
			<p
				class="error bg-inherit text-rose-600 dark:bg-rose-600 dark:border-0 border-2 border-rose-600 rounded px-3 py-2 mb-2 transition-all ease-in-out dark:text-white"
			>
				{form.message}
			</p>
		{/if}
		<input
			type="file"
			name="profile_photo"
			accept="image/png, image/jpeg"
			class="font-mont file:dark:text-white flex h-10 w-full rounded-md border border-input bg-inherit px-3 py-2 text-sm ring-offset-4 file:border-0 file:bg-transparent file:text-sm file:font-bold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			bind:this={fileInput}
			onchange={handleFileUpload}
		/>
		{#if uploading}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 animate-spin"
			>
				<path
					fill-rule="evenodd"
					d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else}
			<button
				class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>Upload</button
			>
			<button
				class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				type="button"
				onclick={renderImage}
			>
				Render Image</button
			>
		{/if}
	</form>
	<div class=" w-9/12 flex-grow object-contain" id="az-canvas-container">
		<canvas id="crop" bind:this={canvas} onresize={zoomIn} class="border-2 border-gray-400"
		></canvas>
		<div class="absolute inset-0 cursor-move" onmousedown={startDragging}></div>
		<button
			class="absolute top-0 left-0 p-2 border border-gray-300 rounded-md hover:bg-gray-200"
			onclick={zoomIn}>+</button
		>
		<button
			class="absolute top-0 left-10 p-2 border border-gray-300 rounded-md hover:bg-gray-200"
			onclick={zoomOut}>-</button
		>
	</div>
	<input type="range" id="scale" name="scale" min="1" max="99" oninput={zoomScale} />
	<label for="scale">Scale</label>
	<img src={rendered} />
</div>
