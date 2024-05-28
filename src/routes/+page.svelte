<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	let { data, form } = $props() as { data: PageData; form: ActionData };

	$effect(() => {
		if (data.results.size > 0) {
			document.documentElement.style.scrollBehavior = 'smooth';
			document.getElementById('results')?.scrollIntoView();
		}
	});
	// beforeUpdate(() => {
	// });
	// let theme = createTheme();
	let { user, session } = data;
</script>

<!-- F3ECE9 -->
<div class="h-[calc(100vh-53px)] flex flex-col mx-6 dark:text-white">
	<div class="flex flex-col h-5/6 items-center justify-center">
		<!-- Center column -->
		<div class="flex flex-col gap-3 mx-4">
			{#if data.user}
				<h1>Logged in!</h1>
			{/if}

			<!-- Search card -->
			<form use:enhance method="post" action="?/search">
				<div class="relative h-0 -top-12">
					{#if form?.status}
						<p
							class="error bg-inherit text-rose-600 dark:bg-rose-600 dark:border-0 border-2 border-rose-600 rounded px-3 py-2 mb-2 transition-all ease-in-out dark:text-white"
						>
							{form.message}
						</p>
					{/if}
				</div>
				<div
					class="font-mont border-slate-800 dark:border-white border-2 rounded-md dark:bg-neutral-900 py-2 px-4"
				>
					<div class="px-1 mb-3 my-4 border-b border-neutral-500 pb-1">
						<h1 class="inline text-l mr-1">(Hey!)</h1>
						<h1 class="inline text-3xl">Who did you think about?</h1>
					</div>

					<div class="mb-4">
						<!-- svelte-ignore a11y-autofocus -->
						<input
							aria-label="Search who did you think about?"
							autofocus
							type="text"
							name="search"
							id="search"
							placeholder="Search for someone you thought about"
							class="w-full rounded border bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
						/>

						<!-- TODO: Add a form here, with a text input and a submit button -->
					</div>
				</div>
			</form>

			<div class="w-100 mx-auto">- Or -</div>
			<div class="flex flex-row gap-2">
				<!-- TODO REIMPLEMENT THIS -->
				{#if !data.user}
					<button
						aria-label="Sign up for an account"
						class="border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
						onclick={() => {
							goto('/signup');
						}}
					>
						<div class="px-auto">Sign Up</div>
					</button>
					<button
						aria-label="Login to your account"
						class="border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
						onclick={(event) => {
							goto('/login');
						}}
					>
						<div class="px-auto">Login</div>
					</button>
				{:else}
					<button
						aria-label="View your profile"
						class="border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
						onclick={() => {
							goto('/you/' + data.username);
						}}
					>
						<div class="px-auto">Your Profile</div>
					</button>
					<form method="post" action="?/signout" class="w-full" use:enhance>
						<button
							class="border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 text-center"
							aria-label="Sign out of your account"
						>
							Sign Out
						</button>
					</form>
				{/if}
			</div>
		</div>
	</div>
</div>

{#if data.results.size > 0}
	<div class="h-screen flex flex-col mx-6 dark:text-white" id="results">
		<div>
			<h1 class="text-3xl font-mont">Results</h1>
			{#each data.results as result}
				<!-- {JSON.stringify(result)} -->
				{#each result[1] as p}
					{JSON.stringify(p)}
					<button
						onclick={() => {
							goto('/you/' + p.username);
						}}
					>
						<div>
							<h2>{p.given_name} {p.family_name}</h2>
							<p>{p.username}</p>
						</div>
					</button>
				{/each}
			{/each}
		</div>
	</div>
{/if}
