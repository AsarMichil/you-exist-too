<script lang="ts">
	import lb from '$lib/assets/LightBulbNoBg.png';
	import SingleStringLight from './SingleStringLight.svelte';
	import { fly } from 'svelte/transition';

	let {
		username = '',
		givenName = '',
		preferredName = '',
		date = new Date(),
		showDetails = false,
		animationDelay = '0s',
		position = 0, // Position in the string for connecting line effects
		total = 1 // Total number of lights
	} = $props();

	// Format date nicely
	const formattedDate = $derived(
		new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		}).format(date)
	);

	let show = $state(showDetails);

	function toggleDetails() {
		show = !show;
	}
</script>

<div class="string-light-wrapper" style="--animation-delay: {animationDelay};">
	<!-- The actual light bulb -->
	<button
		class="translate-y-[-10px] transition-transform hover:translate-y-[-15px] flex flex-col items-center justify-center cursor-pointer relative"
		onmouseenter={toggleDetails}
		onmouseleave={toggleDetails}
	>
		{#if show}
			<div
				class="z-100 absolute bottom-full mb-2 p-3 rounded-md bg-white dark:bg-neutral-800 border border-slate-300 dark:border-slate-600 shadow-lg min-w-48"
				transition:fly={{ y: 10, duration: 200 }}
			>
				<div class="flex flex-col gap-1">
					<a
						href="/you/{username}"
						class="user-link text-lg font-medium hover:text-forestgreen-600 dark:hover:text-forestgreen-400 transition-colors"
					>
						{preferredName || givenName}
					</a>
					<span class="text-sm text-slate-600 dark:text-slate-300">@{username}</span>
					<span class="text-xs text-slate-500 dark:text-slate-400 mt-1">{formattedDate}</span>
				</div>
			</div>
		{/if}

		<div class="light-bulb">
			<div class="bulb-glow"></div>
			<div class="dark:text-white text-black translate-y-[25px]"><SingleStringLight /></div>
		</div>
	</button>
</div>

<style>
	.string-light-wrapper {
		display: flex;
		align-items: center;
		position: relative;
		height: 40px;
	}

	.light-bulb {
		width: 40px;
		height: 60px;
		position: relative;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.bulb-svg {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 10;
	}

	.bulb-glow {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 40%;
		left: 0;
		z-index: 5;
		border-radius: 50%;
		background: radial-gradient(
			circle at center,
			rgba(255, 237, 160, 0.9) 0%,
			rgba(255, 200, 100, 0.6) 30%,
			rgba(255, 200, 100, 0) 70%
		);
		filter: blur(5px);
		animation: glow 4s ease-in-out infinite;
		animation-delay: var(--animation-delay);
		transform-origin: center 30%;
		pointer-events: none;
	}

	@keyframes glow {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(0.8);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.1);
		}
	}

	/* Dark mode adjustments */
	:global(.dark) .bulb-glow {
		background: radial-gradient(
			circle at center,
			rgba(255, 237, 160, 1) 0%,
			rgba(255, 200, 100, 0.8) 30%,
			rgba(255, 200, 100, 0) 70%
		);
		filter: blur(8px);
	}

	:global(.dark) .connecting-wire {
		background-color: #666;
	}
</style>
