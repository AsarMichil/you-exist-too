<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData, PageData } from './$types';
	let { form, data } = $props();

	$effect(() => {
		if (data.username) {
			(document.getElementById('username') as HTMLInputElement).value = data.username;
		}
	});
	let show_password = $state(false);
	let type = $derived(show_password ? 'text' : 'password');
</script>

{#if form?.success}
	<!-- {#if true} -->
	<div class="z-10" id="success-modal">
		<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center">
			<div
				class="bg-white dark:bg-forestgreen-700 rounded-lg p-5 border-2 border-black dark:border-white w-5/6 md:w-3/5 lg:w-1/3 h-fit mt-32"
			>
				<h2 class="text-center font-gar text-3xl">Success!</h2>
				<p class="text-center mt-3">You have successfully set your password.</p>
				<button
					class="w-full mt-5 hover:bg-forestgreen-500 active:bg-forestgreen-400 rounded-md py-2 border border-black dark:border-white"
					onclick={() => {
						goto('/');
					}}>Home</button
				>
			</div>
		</div>
	</div>
{/if}

<div class="flex flex-col w-full h-full dark:text-white">
	<h1 class="mx-auto text-center font-gar text-5xl mt-20 mb-6"><a href="/">You Exist.</a></h1>
	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white px-4 pb-4 mb-5 max-w-96 mx-auto w-full"
	>
		<h2 class="mx-auto text-center font-mont mt-4 mb-2">Set a new password</h2>
		<form method="POST" use:enhance>
			{#if form?.message}<p
					class="error bg-rose-300 dark:bg-rose-600 rounded px-3 py-2 mb-2 transition-all ease-in-out"
				>
					{form.message}
				</p>{/if}
			<div class="relative w-full mb-2 h-10 top-0">
				<input
					type="text"
					name="username"
					id="username"
					class=" text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
					readonly
				/><br />
				<label
					for="username"
					class="dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Username</label
				>
			</div>

			<div class="relative w-full mb-2">
				<input
					{type}
					name="password"
					id="password"
					class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
				/>
				<button
					class="absolute top-2 right-4"
					onclick={() => {
						show_password = !show_password;
					}}
					type="button"
				>
					{#if show_password}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-6 h-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
							/>
						</svg>
					{/if}
				</button>
				<br />
				<label
					for="password"
					class="dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Password</label
				>
			</div>
			<button
				class=" my-2 border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>Confirm</button
			>
		</form>
	</div>
</div>
