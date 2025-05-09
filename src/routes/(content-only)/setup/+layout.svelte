<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

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
</script>

<div class="flex flex-col h-svh dark:text-white" data-page-id="setup">
	<header class="border-b">
		<!-- Progress bar -->
		<div class="w-full bg-gray-200 h-1">
			<div class="bg-forestgreen-500 h-1" style="width: {progress}%"></div>
		</div>
	</header>

	<main class="relative flex-grow">
		{@render children()}
	</main>

	<div class="absolute bottom-4 right-4">
		<div class="flex justify-between">
			<div class="flex gap-2">
				{#if showBackButton}
					<button
						class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
						onclick={() => {
							goto(backButtonStep.id);
						}}
					>
						Back
					</button>
				{/if}
				<button
					class="bg-forestgreen-500 text-white px-4 py-2 rounded-md"
					onclick={() => {
						goto(nextButtonStep.id);
					}}
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div>
