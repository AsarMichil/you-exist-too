<script lang="ts">
	import { Slider, useId } from 'bits-ui';
	import { LoaderCircle, Pencil, RotateCw } from '@lucide/svelte';

	let {
		profile_photo_uri,
		isOwnProfile,
		onSuccess
	}: { profile_photo_uri: string | undefined; isOwnProfile: boolean; onSuccess?: () => void } =
		$props();

	let uploading = $state(false);
	let fileInput = $state<HTMLInputElement | undefined>();
	let canvas: HTMLCanvasElement | undefined = $state();
	let ctx: CanvasRenderingContext2D | undefined | null = $derived(canvas?.getContext('2d'));
	let image = $state<HTMLImageElement | undefined>();
	let scaleFactor = $state(1);
	let scale = $derived(1 / scaleFactor);
	let rotation = $state(0);
	let cropX = $state(0);
	let cropY = $state(0);
	let previewLoading = $state(false);
	let isDragging = $state(false);
	let dragStartX = 0;
	let dragStartY = 0;
	let initialCropX = 0;
	let initialCropY = 0;
	let canvasRect: DOMRect | undefined;
	const progressLabelId = useId();

	let rendered = $state();

	function renderImage() {
		const img = new Image();
		rendered = canvas?.toDataURL();
	}

	function handleFileUpload(event: Event) {
		previewLoading = true;
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				image = new Image();
				image.onload = () => {
					previewLoading = false;
					// Set canvas dimensions based on image
					if (canvas) {
						canvas.width = 300;
						canvas.height = 300;
					}
					drawImage();
				};
				image.src = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function drawImage() {
		if (!ctx || !canvas || !image) return;

		// Clear the canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Save the current context state
		ctx.save();

		// Translate to center of canvas
		ctx.translate(canvas.width / 2, canvas.height / 2);

		// Rotate the canvas
		ctx.rotate((rotation * Math.PI) / 180);

		const aspectRatio = image.width / image.height;
		let drawWidth, drawHeight;

		if (aspectRatio > 1) {
			// Landscape
			drawHeight = canvas.height / scale;
			drawWidth = drawHeight * aspectRatio;
		} else {
			// Portrait or square
			drawWidth = canvas.width / scale;
			drawHeight = drawWidth / aspectRatio;
		}

		// Draw the image with translation for panning
		ctx.drawImage(image, -drawWidth / 2 + cropX, -drawHeight / 2 + cropY, drawWidth, drawHeight);

		// Restore the context state
		ctx.restore();

		renderImage();
	}

	function handleMouseDown(event: MouseEvent) {
		if (!canvas) return;

		isDragging = true;
		canvasRect = canvas.getBoundingClientRect();
		dragStartX = event.clientX;
		dragStartY = event.clientY;
		initialCropX = cropX;
		initialCropY = cropY;

		// Prevent default behavior to avoid text selection
		event.preventDefault();
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging || !canvas) return;

		// Calculate the movement delta
		const dx = (event.clientX - dragStartX) / 2;
		const dy = (event.clientY - dragStartY) / 2;

		// Update crop position
		cropX = initialCropX + dx;
		cropY = initialCropY + dy;

		// Redraw the image
		drawImage();
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleTouchStart(event: TouchEvent) {
		if (!canvas || event.touches.length !== 1) return;

		isDragging = true;
		canvasRect = canvas.getBoundingClientRect();
		dragStartX = event.touches[0].clientX;
		dragStartY = event.touches[0].clientY;
		initialCropX = cropX;
		initialCropY = cropY;

		// Prevent default behavior to avoid scrolling
		event.preventDefault();
	}

	function handleTouchMove(event: TouchEvent) {
		if (!isDragging || !canvas || event.touches.length !== 1) return;

		// Calculate the movement delta
		const dx = (event.touches[0].clientX - dragStartX) / 2;
		const dy = (event.touches[0].clientY - dragStartY) / 2;

		// Update crop position
		cropX = initialCropX + dx;
		cropY = initialCropY + dy;

		// Redraw the image
		drawImage();

		// Prevent default behavior to avoid scrolling
		event.preventDefault();
	}

	function handleTouchEnd() {
		isDragging = false;
	}

	async function uploadImage() {
		if (!canvas) return;

		uploading = true;

		try {
			// Convert canvas to blob
			const blob = await new Promise<Blob>((resolve) => {
				if (canvas) {
					canvas.toBlob(
						(blob) => {
							resolve(blob!);
						},
						'image/jpeg',
						0.9
					);
				}
			});

			// Simple fetch request without progress tracking
			const response = await fetch('/api/profile/photos', {
				method: 'POST',
				body: blob,
				headers: {
					'Content-Type': 'image/jpeg'
				}
			});


			if (response.ok) {
				// Successful upload
				onSuccess?.();
			} else {
				console.error('Error uploading profile photo:', response.statusText);
				uploading = false;
			}
		} catch (error) {
			console.error('Error uploading profile photo:', error);
			uploading = false;
		}
	}

	// Update the image when scale or rotation changes
	$effect(() => {
		if (scale || rotation !== undefined) {
			drawImage();
		}
	});

	// Initialize canvas size when component mounts
	$effect(() => {
		if (canvas) {
			canvas.width = 300;
			canvas.height = 300;
		}
	});
</script>

<div class="w-full">
	{#if image}
		<div class="mb-4">
			<div
				id="az-canvas-container"
				class="relative mx-auto mb-4 border-2 border-slate-800 dark:border-white rounded-lg overflow-hidden"
			>
				<canvas
					bind:this={canvas}
					class="mx-auto cursor-grab touch-none select-none"
					class:cursor-grabbing={isDragging}
					onmousedown={handleMouseDown}
					onmousemove={handleMouseMove}
					onmouseup={handleMouseUp}
					onmouseleave={handleMouseUp}
					ontouchstart={handleTouchStart}
					ontouchmove={handleTouchMove}
					ontouchend={handleTouchEnd}
					ontouchcancel={handleTouchEnd}
				></canvas>
			</div>

			<div class="flex flex-col gap-4 mb-4">
				<!-- Zoom Slider -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between text-sm font-medium">
						<span>Zoom</span>
					</div>
					<Slider.Root
						type="single"
						bind:value={scaleFactor}
						min={1}
						max={4}
						step={0.1}
						class="relative flex w-full touch-none select-none items-center"
					>
						{#snippet children()}
							<span
								class="bg-slate-600 dark:bg-white relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
							>
								<Slider.Range class="bg-forestgreen-400 absolute h-full" />
							</span>
							<Slider.Thumb
								index={0}
								class="border-slate-800 bg-white dark:bg-forestgreen-400 block size-[20px] cursor-pointer rounded-full border-2 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-forestgreen-700 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
							/>
						{/snippet}
					</Slider.Root>
				</div>

				<!-- Rotation Slider -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between text-sm font-medium">
						<span class="flex items-center gap-1">
							<span>Rotation</span>
						</span>
						<span>{rotation}°</span>
					</div>
					<Slider.Root
						type="single"
						bind:value={rotation}
						min={-180}
						max={180}
						step={1}
						class="relative flex w-full touch-none select-none items-center"
					>
						{#snippet children()}
							<span
								class="bg-slate-600 dark:bg-white relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full"
							>
								<Slider.Range class="bg-forestgreen-400 absolute h-full" />
							</span>
							<Slider.Thumb
								index={0}
								class="border-slate-800 bg-white dark:bg-forestgreen-400 block size-[20px] cursor-pointer rounded-full border-2 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-forestgreen-700 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
							/>
						{/snippet}
					</Slider.Root>
				</div>
			</div>

			{#if uploading}
				<div class="flex flex-col gap-2 mb-4">
					<LoaderCircle class="w-4 h-4 animate-spin" />
				</div>
			{:else}
				<button
					onclick={uploadImage}
					class="w-full border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>
					Save Profile Photo
				</button>
			{/if}
		</div>
	{:else}
		<div class="flex justify-center w-full rounded-lg p-4">
			<img
				src={profile_photo_uri ?? '/bear/Wave.png'}
				alt="avatar"
				class="rounded-full w-56 h-56 mx-auto mb-4 border-4 border-slate-800 dark:border-white"
			/>
		</div>
	{/if}

	{#if isOwnProfile}
		<div class="mb-4">
			<input
				type="file"
				accept="image/*"
				bind:this={fileInput}
				onchange={handleFileUpload}
				class="hidden"
				id="profile-photo-input"
			/>
			<label
				for="profile-photo-input"
				class="flex w-fit items-center gap-2 cursor-pointer border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
			>
				{#if previewLoading}
					<LoaderCircle class="w-4 h-4 animate-spin" />
				{:else}
					<Pencil class="w-4 h-4" />
				{/if}
				Select Profile Photo
			</label>
		</div>
	{/if}
</div>
