<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	// Define the setup steps in order
	const setupSteps = [
		{ id: 'name', title: 'Your Name' },
		{ id: 'origin', title: 'Your Origin' },
		{ id: 'blurb', title: 'Your Bio' }
	];

	// Get the current step from the URL
	$: currentStepId = $page.url.pathname.split('/').pop();
	$: currentStepIndex = setupSteps.findIndex((step) => step.id === currentStepId);

	// Calculate progress percentage
	$: progress = ((currentStepIndex + 1) / setupSteps.length) * 100;
</script>

<div class="flex flex-col min-h-screen">
	<header class="p-4 border-b">
		<div class="container mx-auto">
			<h1 class="text-xl font-bold">Complete Your Profile</h1>

			<!-- Progress bar -->
			<div class="w-full bg-gray-200 rounded-full h-2.5 mt-4">
				<div class="bg-forestgreen-500 h-2.5 rounded-full" style="width: {progress}%"></div>
			</div>
		</div>
	</header>

	<main class="flex-grow">
		<slot />
	</main>
</div>
