<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		getCanTransition,
		setBackwardRoute,
		setForwardRoute,
		setTransitionDirection,
		setTransitionTimeout
	} from '../stores/setup.svelte';
	import { swipe, type SwipeCustomEvent } from 'svelte-gestures';

	const {
		forwardRoute = '',
		backwardRoute = '',
		canGoForward = true,
		canGoBackward = true,
		children
	} = $props();

	$effect(() => {
		if (canGoForward) {
			setForwardRoute(forwardRoute);
		}
		if (canGoBackward) {
			setBackwardRoute(backwardRoute);
		}
	});

	// Total transition time in ms (delay + duration + safety margin)

	const goForward = () => {
		if (canGoForward && getCanTransition() && forwardRoute) {
			setTransitionTimeout();
			setTransitionDirection('forward');
			goto(forwardRoute);
		}
	};

	const goBack = () => {
		if (canGoBackward && backwardRoute) {
			setTransitionDirection('backward');
			goto(backwardRoute);
			setTransitionTimeout();
		}
	};

	// For wheel/touchpad scrolling
	const handleWheel = (event: WheelEvent) => {
		// Prevent default scrolling behavior
		event.preventDefault();

		// Only respond if we're not in the middle of a transition
		if (getCanTransition()) {
			console.log('yay', getCanTransition());
			// Track scroll direction
			if (event.deltaY > 0) {
				console.log('forward');
				goForward();
			} else if (event.deltaY < 0) {
				goBack();
			}
		}
	};

	function swipeHandler(event: SwipeCustomEvent) {
		if (getCanTransition()) {
			if (event.detail.direction === 'top') {
				goForward();
			} else if (event.detail.direction === 'bottom') {
				goBack();
			}
		}
	}
</script>

<div class="flex flex-col h-full dark:text-white">
	<main
		class="relative flex-grow overflow-hidden"
		use:swipe={() => ({ minSwipeDistance: 10 })}
		onswipe={swipeHandler}
		onwheel={handleWheel}
	>
		{@render children()}
	</main>
</div>
