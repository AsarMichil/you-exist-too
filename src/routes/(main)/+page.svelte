<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Input from '$lib/components/Input.svelte';
	import type { PageData } from './$types';
	import { ArrowBigDown, ArrowDown } from '@lucide/svelte';
	import { tick } from 'svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let { data, url } = $props() as { data: PageData; url: URL };
	const { form, errors } = superForm(data.form);

	function handleSearch() {
		if ($form.search) {
			goto(`/?q=${encodeURIComponent($form.search)}`, { keepFocus: true });
		}
	}
	let resultView: HTMLDivElement | null = $state(null);
	$effect(() => {
		if (data.results) {
			const autoscroll =
				resultView && resultView.offsetHeight + resultView.scrollTop > resultView.scrollHeight - 50;
			if (autoscroll) {
				tick().then(() => {
					if (!resultView) return;
					window?.scrollTo({ top: resultView.scrollHeight, behavior: 'smooth' });
				});
			}
		}
	});
	// if query params exist, show the results div
</script>

<!-- F3ECE9 -->
<section class="h-[calc(100vh-53px)] flex flex-col mx-6 dark:text-white relative">
	<div class="flex flex-col h-5/6 items-center justify-center">
		<!-- Center column -->
		<div class="flex flex-col gap-3 mx-4">
			{#if data.user}
				<!-- <h1>Logged in!</h1> -->
			{/if}

			<!-- Search card -->
			<div class="relative h-0 -top-12">
				{#if $errors.search}
					<p
						class="error bg-inherit text-rose-600 dark:bg-rose-600 dark:border-0 border-2 border-rose-600 rounded px-3 py-2 mb-2 transition-all ease-in-out dark:text-white"
					>
						{$errors.search}
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
					<Input
						name="search"
						bind:value={$form.search}
						error={$errors.search}
						placeholder="Search for someone you thought about"
						autofocus
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								handleSearch();
							}
						}}
					/>
					<button
						class="mt-4 w-full border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
						onclick={handleSearch}
					>
						Search
					</button>
				</div>
			</div>

			<div class="w-100 mx-auto">- Or -</div>
			<div class="flex flex-row gap-2">
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
					<form method="post" action="?/signout" class="w-full">
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
	{#if data.results.length > 0}
		<div
			class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent flex items-center justify-center pb-8"
		>
			<button
				onclick={() => {
					window?.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
				}}
			>
				<ArrowDown class="w-10 h-10 text-slate-800 dark:text-white" />
			</button>
		</div>
	{/if}
</section>

{#if page.url.searchParams.get('q')}
	<div
		class="h-screen flex flex-col mx-6 dark:text-white space-y-2 pt-6"
		id="results"
		bind:this={resultView}
	>
		{#if data.results.length === 0}
			<h1 class="text-3xl font-mont">No results found :(</h1>
		{:else}
			<h1 class="text-3xl font-mont">Results</h1>
			{#each data.results as p}
				<button
					class="w-full text-left p-4 border border-slate-800 dark:border-white rounded-md mb-2 hover:bg-forestgreen-400 active:bg-forestgreen-700"
					onclick={() => {
						goto('/you/' + p.username);
					}}
				>
					<div>
						<h2 class="text-2xl">{p.given_name} {p.family_name}</h2>
						<p class=" text-slate-700 dark:text-slate-200">@{p.username}</p>
					</div>
				</button>
			{/each}
		{/if}
		<button
			class="w-full text-left p-4 border border-slate-800 dark:border-white rounded-md mb-2 hover:bg-forestgreen-400 active:bg-forestgreen-700"
			onclick={() => {
				goto('/invite?q=' + encodeURIComponent($form.search));
			}}
		>
			<div>
				<h2 class="text-2xl">Thinking about someone else?</h2>
				<p class="text-slate-700 dark:text-slate-200">
					If you know the email or phone number of the person you're looking for, we can send them
					an invite.
				</p>
			</div>
		</button>
	</div>
{/if}
