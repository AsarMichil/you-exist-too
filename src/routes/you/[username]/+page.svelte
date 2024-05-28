<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { scale } from 'svelte/transition';

	let url = $page.url.pathname;
	console.log(url);
	let { data, form } = $props();
	let mock1 = {
		props: {
			person: {
				preferred_name: 'John',
				given_name: 'Doe',
				family_name: 'Smith',
				email: 'pacer@asarmichil.com'
			}
		}
	};
	let uploading = $state(false);
	let editing = $state(false);
	let profile_photo = $state(true);
	onMount(() => {
		let canvas = document.getElementById('lower-canvas') as HTMLCanvasElement;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Canvas not supported');
			}
			ctx.fillStyle = 'green';
			// Add a rectangle at (10, 10) with size 100x100 pixels
			ctx.fillRect(10, 10, 100, 100);
		}
		canvas = document.getElementById('upper-canvas') as HTMLCanvasElement;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Canvas not supported');
			}
			ctx.fillStyle = 'red';
			// Add a rectangle at (10, 10) with size 100x100 pixels
			ctx.fillRect(10, 10, 100, 100);
		}
	});
</script>

{#if editing}
	<div
		class="absolute w-screen h-screen bg-black bg-opacity-50 right-0 flex flex-row justify-center items-center"
	>
		<!-- Modal -->
		<div class="relative w-5/6 h-5/6 bg-cream-200 dark:bg-stone-900 border-2 rounded-lg px-6 py-4">
			<h2 class="text-3xl">Edit your profile</h2>
			<div></div>

			<button
				class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				onclick={() => {
					editing = false;
				}}>Close</button
			>
		</div>

		<!-- Modal End -->
	</div>
{/if}

{#if profile_photo}
	<div
		class="absolute w-screen h-screen bg-black bg-opacity-50 right-0 flex flex-row justify-center items-center"
	>
		<!-- Modal -->
		<div class="relative w-5/6 h-5/6 bg-cream-200 dark:bg-stone-900 border-2 rounded-lg px-6 py-4">
			<h2 class="text-3xl">Profile photo</h2>
			<div class="mx-auto w-full flex flex-col justify-center items-center">
				{#if form?.message}
					<p
						class="error bg-inherit text-rose-600 dark:bg-rose-600 dark:border-0 border-2 border-rose-600 rounded px-3 py-2 mb-2 transition-all ease-in-out dark:text-white"
					>
						{form.message}
					</p>
				{/if}
				<form
					action="?/setProfilePhoto"
					method="post"
					enctype="multipart/form-data"
					use:enhance={() => {
						uploading = true;

						return async ({ update }) => {
							await update();
							uploading = false;
						};
					}}
				>
					<input
						type="file"
						name="profile_photo"
						accept="image/png, image/jpeg"
						disabled={uploading}
						onchange={(e) => {
							console.log(e);
							console.log(e.currentTarget!.files![0]);
							const file = e.currentTarget!.files![0];
							// const file = e.target;
							if (!file) return;
							const reader = new FileReader();
							reader.addEventListener('loadend',(event) => {
								const img = new Image();
								console.log("reader event", event.currentTarget!)
								img.src = event.currentTarget!.result! as string;
								const canvas = document.getElementById('lower-canvas') as HTMLCanvasElement;
								if (!canvas) return;
								const ctx = canvas.getContext('2d');
								if (!ctx) return;
								img.onload = () => {
									// canvas.width = img.width;
									// canvas.height = img.height;
									// ctx.imageSmoothingEnabled = false;
									canvas.width = canvas.width * window.devicePixelRatio;
									canvas.height = canvas.height * window.devicePixelRatio;
									const scaledWidth = canvas.height / img.height * img.width;
									const centeredImage = (canvas.width - scaledWidth) / 2;
									ctx.imageSmoothingQuality = 'high';
									ctx.fillRect(0, 0, canvas.width, canvas.height);
									ctx.drawImage(img, centeredImage, 0, scaledWidth, canvas.height);
								};
							});
							reader.readAsDataURL(file);
						}}
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
					{/if}
				</form>
				<!-- Canvas Block -->
				<div class="w-5/6 mx-8">
					<canvas class="w-full absolute left-0" id="upper-canvas"></canvas>
					<canvas class="w-full absolute left-0" id="lower-canvas"></canvas>
				</div>
			</div>
			<button
				class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				onclick={() => {
					profile_photo = false;
				}}>Close</button
			>
		</div>
		<!-- Modal End -->
	</div>
{/if}

<div class="text-column">
	Your account {url.split('/')[2]}
	<!-- {JSON.stringify(data.props?.person)} -->
</div>

<div class="flex flex-col w-full h-full dark:text-white">
	<h1 class="mx-auto text-center font-gar text-5xl mt-20 mb-6">
		{mock1.props?.person.preferred_name || mock1.props?.person.given_name}
		{mock1.props?.person.family_name}
	</h1>
	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white px-4 pb-4 mb-5 max-w-96 mx-auto w-full"
	>
		<div>
			<img
				src={data.props?.profile_photo_uri}
				alt="avatar"
				class="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white"
			/>
		</div>

		<h2 class="mx-auto text-center font-mont mt-4 mb-2">Hehe</h2>
		<button
			class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
			onclick={() => {
				editing = true;
			}}
		>
			Edit Profile
		</button>
		<button
			class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
			onclick={() => {
				profile_photo = true;
			}}
		>
			Profile Photo
		</button>
	</div>

	<!-- <div class="text-center mb-5 max-w-96 mx-auto">Or</div>
	<div
		class="w-full border-0 xs:border xs:border-black dark:xs:border-white rounded p-3 mx-auto text-center max-w-96"
	>
		<div>Have an account? - <a href="/login" class="font-bold">Log in</a></div>
	</div> -->
</div>
