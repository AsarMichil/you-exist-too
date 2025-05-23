<script lang="ts">
	import { fly } from 'svelte/transition';

	let {
		username = '',
		givenName = '',
		preferredName = '',
		date = new Date(),
		showDetails = false,
		animationDelay = '0s'
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

<button
	class="candle-container flex flex-col items-center justify-end cursor-pointer relative"
	onmouseenter={toggleDetails}
	onmouseleave={toggleDetails}
	style="--animation-delay: {animationDelay};"
>
	{#if show}
		<div
			class="z-[12] absolute bottom-full mb-2 p-3 rounded-md bg-white dark:bg-neutral-800 border border-slate-300 dark:border-slate-600 shadow-lg min-w-48"
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

	<div class="candle-flame z-[10]">
		<div class="flame-outer"></div>
		<div class="flame-inner"></div>
	</div>
	<div class="candle-body"></div>
</button>

<style>
	.candle-container {
		height: 120px;
		width: 40px;
		margin: 0 8px;
		transition: transform 0.3s ease;
		z-index: 10;
	}

	.candle-container:hover {
		transform: translateY(-5px);
	}

	.candle-body {
		width: 30px;
		height: 70px;
		background: linear-gradient(to right, #f9f4e8, #fff8e8, #f9f4e8);
		border-radius: 4px;
		box-shadow: 0 0 5px rgba(117, 107, 107, 0.1);
		position: relative;
	}

	.candle-flame {
		position: relative;
		width: 15px;
		height: 30px;
		margin-bottom: -5px;
		z-index: 11;
	}

	.flame-outer {
		position: absolute;
		width: 100%;
		height: 100%;
		background: radial-gradient(ellipse at center, #ffbf00 0%, #ff8000 70%);
		border-radius: 50% 50% 20% 20%;
		box-shadow:
			0 0 15px #ff6a00,
			0 0 25px rgba(255, 106, 0, 0.5);
		animation: flicker 3s infinite alternate;
		animation-delay: var(--animation-delay);
	}

	.flame-inner {
		position: absolute;
		top: 30%;
		left: 25%;
		width: 50%;
		height: 40%;
		background: rgba(255, 255, 255, 0.9);
		border-radius: 50% 50% 20% 20%;
		animation: flicker 1s infinite alternate;
		animation-delay: var(--animation-delay);
	}

	@keyframes flicker {
		0%,
		100% {
			transform: scaleY(1) scaleX(1);
			opacity: 1;
		}
		25% {
			transform: scaleY(1.1) scaleX(0.95);
			opacity: 0.9;
		}
		50% {
			transform: scaleY(0.95) scaleX(1.05);
			opacity: 1;
		}
		75% {
			transform: scaleY(1.05) scaleX(1);
			opacity: 0.9;
		}
	}
</style>
