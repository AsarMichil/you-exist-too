<script lang="ts">
	import { goto } from '$app/navigation';
	import HappyBearModal from '$lib/components/HappyBearModal.svelte';
	import SuccessModal from '$lib/components/SuccessModal.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	const { data, form } = $props();
	const { form: formData, errors, enhance, message } = superForm(data.form);
</script>

<div class="flex flex-col h-full w-full dark:text-white">
	<h1 class="mx-auto text-center font-gar text-5xl mt-20 mb-6"><a href="/">You Exist.</a></h1>

	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white px-4 pb-4 mb-5 max-w-96 mx-auto w-full"
	>
		<h2 class="mx-auto text-center font-mont mt-4 mb-2">Trouble logging in?</h2>
		<p class="text-sm text-gray-700 dark:text-gray-400 my-4 text-center">
			Enter your email or username and we'll send you a link to get into your account.
		</p>
		<form method="post" use:enhance>
			{#if form?.message}
				<p
					class="error bg-amber-300 dark:bg-amber-600 rounded px-3 py-2 mb-2 transition-all ease-in-out"
				>
					{form?.message}
				</p>
			{/if}

			<div class="relative w-full mb-2 h-10 top-0">
				<input
					type="text"
					name="username_or_email"
					id="username_or_email"
					bind:value={$formData.username_or_email}
					class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
					placeholder=" "
				/><br />
				<label
					for="username_or_email"
					class="dark:peer-autofill:text-black peer-placeholder-shown:translate-x-1 -left-1 top-10 font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
					>Username or email</label
				>
				{#if $errors.username_or_email}
					<span class="text-red-500 text-sm">{$errors.username_or_email}</span>
				{/if}
			</div>
			<button
				class="my-2 border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>Send Magic Link</button
			>
		</form>
	</div>

	<div class="text-center mb-5 max-w-96 mx-auto">Or</div>
	<div
		class="w-full border-0 xs:border xs:border-black dark:xs:border-white rounded p-3 mx-auto text-center max-w-96"
	>
		<div>
			Don't have an account? - <a href="/signup" class="font-bold hocus:text-forestgreen-500"
				>Sign up</a
			>
		</div>
	</div>
</div>
{#if form?.success}
	<HappyBearModal open={true} title="Email sent! Check your inbox!">
		Check your email for a link to reset your password. If you don't see it, check your spam or junk
		folder.
	</HappyBearModal>
{/if}
