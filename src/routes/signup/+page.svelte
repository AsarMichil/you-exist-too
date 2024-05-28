<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { ActionData, PageData } from './$types';
	let { form, data } = $props();
</script>

{#if form?.success}
	<!-- {#if true} -->
	<div class="z-10" id="success-modal">
		<div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
			<div
				class="bg-white dark:bg-forestgreen-700 rounded-lg p-5 border-2 border-black dark:border-white w-5/6 md:w-3/5 lg:w-1/3 h-fit mt-32"
			>
				<h2 class="text-center font-gar text-3xl">Success!</h2>
				<p class="text-center mt-3">
					You have successfully created an account. Please check your email to verify your account.
				</p>
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
		<h2 class="mx-auto text-center font-mont mt-4 mb-2">Create an Account</h2>
		<form method="POST" use:enhance>
			{#if form?.message}<p
					class="error bg-rose-300 dark:bg-rose-600 rounded px-3 py-2 mb-2 transition-all ease-in-out"
				>
					{form.message}
				</p>{/if}

			<div class="relative w-full mb-2 h-10">
				<input
					type="email"
					name="email"
					id="email"
					class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
				/><br />
				<label
					for="email"
					class="dark:peer-autofill:text-black font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
				>
					Email</label
				>
			</div>
			<div class="relative w-full mb-2 h-10 top-0">
				<input
					type="text"
					name="username"
					id="username"
					class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
				/><br />
				<label
					for="username"
					class="dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Username</label
				>
			</div>

			<!-- <div class="relative w-full mb-2">
				<input
					type="password"
					name="password"
					id="password"
					class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
				/><br />
				<label
					for="password"
					class="dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Password</label
				>
			</div> -->

			<p class="relative w-full mb-3">
				By signing up, you agree to our <a class="underline" href="/terms">Terms of Service</a> and
				<a href="/privacy" class="underline">Privacy Policy</a>.
			</p>
			<button
				class=" my-2 border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>Sign up</button
			>
		</form>
	</div>

	<div class="text-center mb-5 max-w-96 mx-auto">Or</div>
	<div
		class="w-full border-0 xs:border xs:border-black dark:xs:border-white rounded p-3 mx-auto text-center max-w-96"
	>
		<div>Have an account? - <a href="/login" class="font-bold">Log in</a></div>
	</div>
</div>
