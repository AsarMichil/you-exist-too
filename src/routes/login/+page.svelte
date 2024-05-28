<script lang="ts">
	import { enhance } from '$app/forms';
	let { form, data } = $props();
</script>

<div class="flex flex-col h-full w-full dark:text-white">
	<h1 class="mx-auto text-center font-gar text-5xl mt-20 mb-6"><a href="/">You Exist.</a></h1>

	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white px-4 pb-4 mb-5 max-w-96 mx-auto w-full"
	>
		<h2 class="mx-auto text-center font-mont mt-4 mb-2">Log in to your account</h2>
		<form method="post" use:enhance>
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
				/><br />
				<label
					for="username"
					class="dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Username</label
				>
			</div>

			<div class="relative w-full mb-2">
				<input
					type="password"
					name="password"
					id="password"
					class=" text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
				/><br />
				<label
					for="password"
					class=" dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Password</label
				>
			</div>

			<button
				class=" my-2 border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>Log in</button
			>
		</form>
		<p class="mt-3 mb-2 text-center text-forestgreen-700 dark:text-slate-200 font-bold font-gar">
			<a href="login/forgot-password" class="text-center hocus:text-forestgreen-500"
				>Forgot your password?</a
			>
		</p>
	</div>

	<div class="text-center mb-5 max-w-96 mx-auto">Or</div>
	<div
		class="w-full border-0 xs:border xs:border-black dark:xs:border-white rounded p-3 mx-auto text-center max-w-96"
	>
		<div>
			Don't have an account? - <a href="/signup" class="font-bold hocus:text-forestgreen-500">
				Sign up</a
			>
		</div>
	</div>
</div>
