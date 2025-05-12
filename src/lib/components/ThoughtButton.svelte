<script lang="ts">
	import Checkbox from './Checkbox.svelte';
	import { Heart, LoaderCircle } from '@lucide/svelte';

	let { username, thoughtCount = 0 }: { username: string; thoughtCount: number } = $props();
	let isLoggedIn = $state(false);
	let isAnonymous = $state(false);
	let isSubmitting = $state(false);
	let ambitiousThoughtCount = $state(thoughtCount);

	// Check if user is logged in
	$effect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/status');
				const data = await response.json();
				isLoggedIn = data.isLoggedIn;
			} catch (error) {
				console.error('Error checking auth status:', error);
				isLoggedIn = false;
			}
		};

		checkAuth();
	});

	async function addThought() {
		try {
			// increment the thought count locally
			ambitiousThoughtCount += 1;

			const response = await fetch('/api/thoughts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username,
					isAnonymous
				})
			});

			const data = await response.json();

			if (response.ok) {
				console.log('Thought added successfully!');
			} else {
				console.error('Failed to add thought:', data.error);
			}
		} catch (error) {
			console.error('Error adding thought:', error);
		}
	}
</script>

<div class="thought-button-container flex flex-col items-center gap-2 my-4">
	<button
		onclick={addThought}
		disabled={isSubmitting}
		class="flex items-center gap-2 border-slate-800 border-2 rounded-md py-2 px-4 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
	>
		{#if isSubmitting}
			<LoaderCircle class="w-5 h-5 animate-spin" />
		{:else}
			<Heart class="w-5 h-5" fill={ambitiousThoughtCount > 0 ? 'currentColor' : 'none'} />
		{/if}
		<span>I Thought About You</span>
	</button>

	<div class="text-sm text-slate-600 dark:text-slate-300">
		{ambitiousThoughtCount}
		{ambitiousThoughtCount === 1 ? 'person has' : 'people have'} thought about {username}
	</div>

	{#if isLoggedIn}
		<Checkbox
			label="Make my thought anonymous"
			id="anonymous-thought"
			bind:checked={isAnonymous}
			class="rounded border-slate-800 dark:border-white focus:ring-forestgreen-700 text-forestgreen-700"
		/>
	{/if}
</div>
