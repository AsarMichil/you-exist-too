<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		getForwardRoute,
		getBackwardRoute,
		getTransitionDirection,
		setTransitionDirection
	} from '$lib/stores/setup.svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let { children } = $props();
	let setupSteps = [
		{ id: 'username', label: 'Username' },
		{ id: 'password', label: 'Password' },
		{ id: 'name', label: 'Name' },
		{ id: 'origin', label: 'Origin' },
		{ id: 'blurb', label: 'Blurb' },
		{ id: 'profile-photo', label: 'Profile Photo' },
		{ id: 'confirm', label: 'Confirm' }
	];

	// Define transition parameters based on direction
	let inTransition = $derived(
		getTransitionDirection() === 'forward'
			? { y: '50vh', delay: 300, duration: 300, opacity: 0, easing: cubicOut }
			: { y: '-50vh', delay: 300, duration: 300, opacity: 0, easing: cubicOut }
	);

	let outTransition = $derived({
		y: getTransitionDirection() === 'forward' ? '-50vh' : '50vh',
		duration: 300,
		opacity: 0,
		easing: cubicOut
	});
	$inspect('transitions', inTransition, outTransition);
	// 	// Get the current step from the URL
	let currentStepId = $derived(page.url.pathname.split('/').pop());
	let currentStepIndex = $derived(setupSteps.findIndex((step) => step.id === currentStepId));
	console.log('page pathname', page.url.pathname);
	// Calculate progress percentage
	let progress = $derived(((currentStepIndex + 1) / setupSteps.length) * 100);
</script>

<div class="flex flex-col h-svh dark:text-white overflow-hidden" data-page-id="setup">
	<header class="border-b">
		<!-- Progress bar -->
		<div class="w-full bg-gray-200 h-1">
			<div class="bg-forestgreen-500 h-1" style="width: {progress}%"></div>
		</div>
	</header>

	{#key page.url.pathname}
		<div class="w-full h-full" in:fly={inTransition} out:fly={outTransition}>
			{@render children()}
		</div>
	{/key}

	<div class="absolute bottom-4 right-4">
		<div class="flex justify-between">
			<div class="flex gap-2">
				<!-- {#if canGoBackward && backwardRoute}
				  -->
				{#if !!getBackwardRoute()}
					<button
						class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
						onclick={() => {
							const where = getBackwardRoute();
							if (where !== null) {
								setTransitionDirection('backward');
								goto(where);
							}
						}}
					>
						Back
					</button>
				{/if}
				<!-- {#if canGoForward && forwardRoute} -->
				{#if !!getForwardRoute()}
					<button
						class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
						onclick={() => {
							const where = getForwardRoute();
							if (where !== null) {
								setTransitionDirection('forward');
								goto(where);
							}
						}}
					>
						Next
					</button>
				{/if}
				{#if page.url.pathname === '/setup/profile-photo'}
					<button
						class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
						onclick={() => {
							goto('/you');
						}}
					>
						Done!
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
