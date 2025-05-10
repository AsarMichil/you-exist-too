<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { navigationDirection } from '$lib/stores/navigation';
	import { onMount } from 'svelte';
	import { swipe, type SwipeCustomEvent } from 'svelte-gestures';
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
	let showBackButton = $derived(currentStepIndex > 0);
	let backButtonStep = $derived(setupSteps[currentStepIndex - 1 > 0 ? currentStepIndex - 1 : 1]);
	let nextButtonStep = $derived(setupSteps[currentStepIndex + 1]);
	let canGoForward = $derived(currentStepIndex < setupSteps.length - 1);

	// Track navigation direction for transitions
	let direction = $state('forward');
	let isTransitioning = $state(false);

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

	// Total transition time in ms (delay + duration + safety margin)
	const TRANSITION_TIME = 1000;

	const goForward = () => {
		if (canGoForward && !isTransitioning) {
			isTransitioning = true;
			direction = 'forward';
			goto(nextButtonStep.id);

			// Reset the transitioning flag after transition completes
			setTimeout(() => {
				isTransitioning = false;
			}, TRANSITION_TIME);
		}
	};

	const goBack = () => {
		if (!showBackButton) {
			return;
		}
		if (showBackButton && !isTransitioning) {
			isTransitioning = true;
			direction = 'backward';
			goto(backButtonStep.id);

			// Reset the transitioning flag after transition completes
			setTimeout(() => {
				isTransitioning = false;
			}, TRANSITION_TIME);
		}
	};

	// For wheel/touchpad scrolling
	let wheelTimeout: NodeJS.Timeout | null = null;
	let isNavigating = false;
	const handleWheel = (event: WheelEvent) => {
		// Prevent default scrolling behavior
		event.preventDefault();

		// Only respond if we're not in the middle of a transition
		if (!isTransitioning) {
			// Track scroll direction
			if (event.deltaY > 0) {
				console.log('forward');
				console.log(nextButtonStep);
				goForward();
			} else if (event.deltaY < 0) {
				console.log('backward');
				console.log(backButtonStep);
				goBack();
			}
		}
	};

	onMount(() => {
		// const mainElement = document.querySelector('main');
		// if (mainElement) {
		// 	mainElement.addEventListener('wheel', handleWheel, { passive: false });
		// }

		// return () => {
		// 	if (mainElement) {
		// 		mainElement.removeEventListener('wheel', handleWheel);
		// 	}
		// };
	});
	function swipeHandler(event: SwipeCustomEvent) {
		console.log('swipe', event);
		if (!isTransitioning) {
			if (event.detail.direction === 'top') {
				goForward();
			} else if (event.detail.direction === 'bottom') {
				goBack();
			}
		}
	}
</script>

<div class="flex flex-col h-svh dark:text-white" data-page-id="setup">
	<header class="border-b">
		<!-- Progress bar -->
		<div class="w-full bg-gray-200 h-1">
			<div class="bg-forestgreen-500 h-1" style="width: {progress}%"></div>
		</div>
	</header>

	<main
		class="relative flex-grow overflow-hidden"
		use:swipe={() => ({ minSwipeDistance: 10 })}
		onswipe={swipeHandler}
		onwheel={handleWheel}
	>
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
					<button class="bg-forestgreen-500 text-white px-4 py-2 rounded-md" onclick={goBack}>
						Back
					</button>
				{/if}
				{#if canGoForward}
					<button class="bg-forestgreen-500 text-white px-4 py-2 rounded-md" onclick={goForward}>
						Next
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
