<script lang="ts">
	import { page } from '$app/state';
	import Checkbox from './Checkbox.svelte';
	import { Heart, LoaderCircle } from '@lucide/svelte';
	import { fly, scale } from 'svelte/transition';

	let { username, thoughtCount = 0 }: { username: string; thoughtCount: number } = $props();
	let isLoggedIn = $state(false);
	let loggedInUsername = $state(null);
	let isAnonymous = $state(false);
	let ambitiousThoughtCount = $state(thoughtCount);
	const introspectiveAlerts = [
		'Feeling introspective? We get it.',
		'Self-reflection is healthy!',
		'Thinking about yourself? Profound.',
		"Sorry, you can't send yourself a thought. Your brain might explode!",
		'Plot twist: You were the one you were thinking about all along.',
		"Congratulations! You've discovered self-awareness!",
		'You already think about yourself plenty. Trust us!',
		"You're already living rent-free in your own head!",
		"Whoops! You can't think about yourself. That's just called thinking.",
		'Nice try! But thinking about yourself is just called consciousness.',
		"Hold up! You can't think about yourself. That's just regular thinking with extra steps.",
		"Congratulations, you've discovered thinking.",
		"You don't need a button for that. Trust us."
	];
	let currentAlertIdx = $state(0);
	// Check if user is logged in
	$effect(() => {
		const checkAuth = async () => {
			try {
				const response = await fetch('/api/auth/status');
				const data = await response.json();
				isLoggedIn = data.isLoggedIn;
				loggedInUsername = data.username;
			} catch (error) {
				console.error('Error checking auth status:', error);
				isLoggedIn = false;
			}
		};

		checkAuth();
	});
	let isThemselves = $derived(username === loggedInUsername);

	async function callThoughtsApi() {
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
			throw new Error(data.error);
		}
		return data;
	}

	async function addThought() {
		if (isThemselves) {
			alert(introspectiveAlerts[currentAlertIdx]);
			currentAlertIdx = (currentAlertIdx + 1) % introspectiveAlerts.length;
			return;
		}
		try {
			// increment the thought count locally
			ambitiousThoughtCount += 1;
			await callThoughtsApi();
		} catch (error) {
			console.error('Error adding thought:', error);
		}
	}
</script>

<div class="thought-button-container flex flex-col items-center gap-2 my-4">
	<button
		onclick={addThought}
		class="flex items-center gap-2 border-slate-800 border-2 rounded-md py-2 px-4 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
	>
		<!-- {#if isSubmitting}
			<LoaderCircle class="w-5 h-5 animate-spin" />
		{:else} -->
			<Heart class="w-5 h-5" fill={ambitiousThoughtCount > 0 ? 'currentColor' : 'none'} />
		<!-- {/if} -->
		<span>I Thought About You</span>
	</button>

	<div class="text-sm text-slate-600 dark:text-slate-200">
		{username} has been thought about
		<span class="text-brownish-500 dark:text-brownish-200" transition:fly={{ duration: 200 }}>
			{ambitiousThoughtCount}
		</span>
		{ambitiousThoughtCount === 1 ? 'time' : 'times'}
	</div>

	{#if isLoggedIn}
		<Checkbox
			label="Make my thought anonymous"
			id="anonymous-thought"
			bind:checked={isAnonymous}
			class="rounded border-slate-800 dark:border-white hocus:ring-forestgreen-700 text-forestgreen-700 dark:text-white"
		/>
	{/if}
</div>
