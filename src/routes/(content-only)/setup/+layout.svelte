<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { navigationDirection } from '$lib/stores/navigation';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';

	// Define the setup steps in order
	const setupSteps = [
		{ id: 'username', title: 'Your Username' },
		{ id: 'name', title: 'Your Name' },
		{ id: 'origin', title: 'Your Origin' },
		{ id: 'blurb', title: 'Your Bio' },
		{ id: 'profile-photo', title: 'Profile Photo' }
	];

	let { children } = $props();
	// Get the current step from the URL
	let currentStepId = $derived(page.url.pathname.split('/').pop());
	let currentStepIndex = $derived(setupSteps.findIndex((step) => step.id === currentStepId));

	// Calculate progress percentage
	let progress = $derived(((currentStepIndex + 1) / setupSteps.length) * 100);
	let showBackButton = $derived(currentStepIndex > 1);
	let backButtonStep = $derived(setupSteps[currentStepIndex - 1 > 0 ? currentStepIndex - 1 : 0]);
	let nextButtonStep = $derived(setupSteps[currentStepIndex + 1]);

	// Track navigation direction for transitions
	let direction = $state('forward');

	// Define transition parameters based on direction
	let inTransition = $derived(
		direction === 'forward'
			? { y: '50vh', delay: 300, duration: 300, opacity: 0, easing: cubicOut }
			: { y: '-50vh', delay: 300, duration: 300, opacity: 0, easing: cubicOut }
	);

	let outTransition = $derived({
		y: direction === 'forward' ? '-50vh' : '50vh',
		duration: 300,
		opacity: 0,
		easing: cubicOut
	});

	const goForward = () => {
		direction = 'forward';
		goto(nextButtonStep.id);
	};

	const goBack = () => {
		direction = 'backward';
		goto(backButtonStep.id);
	};

</script>

<div
	class="flex flex-col h-svh dark:text-white"
	data-page-id="setup"
>
	<header class="border-b">
		<!-- Progress bar -->
		<div class="w-full bg-gray-200 h-1">
			<div class="bg-forestgreen-500 h-1" style="width: {progress}%"></div>
		</div>
	</header>

	<main class="relative flex-grow" >
		{#key page.url.pathname}
			<div class="w-full h-full" in:fly={inTransition} out:fly={outTransition}>
				{@render children()}
			</div>
		{/key}
	</main>

	<div class="absolute bottom-4 right-4">
		<div class="flex justify-between">
			<div class="flex gap-2">
				{#if showBackButton}
					<button
						class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
						onclick={goBack}
					>
						Back
					</button>
				{/if}
				<button
					class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
					onclick={goForward}
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div>