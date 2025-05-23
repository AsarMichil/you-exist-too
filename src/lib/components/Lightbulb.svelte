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
	class="transition-transform hover:translate-y-[-5px] flex flex-col items-center justify-end cursor-pointer relative"
	onmouseenter={toggleDetails}
	onmouseleave={toggleDetails}
	style="--animation-delay: {animationDelay};"
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

	<div class="lightbulb">
		<div class="bulb">
			<div class="glass-reflection"></div>
			<div class="filament-container">
				<div class="filament filament-3"></div>
				<div class="filament filament-1"></div>
				<div class="filament filament-2"></div>
				<div class="filament filament-connect"></div>
			</div>
			<div class="warm-glow"></div>
		</div>
		<div class="screw-top"></div>
		<div class="screw-middle"></div>
		<div class="screw-bottom"></div>
	</div>
</button>

<style>
	.lightbulb {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.bulb {
		width: 30px;
		height: 40px;
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 50% 50% 15% 15%;
		position: relative;
		overflow: hidden;
		box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
		animation: throb 4s ease-in-out infinite;
		animation-delay: var(--animation-delay);
	}

	.glass-reflection {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.4) 0%,
			rgba(255, 255, 255, 0.1) 30%,
			rgba(255, 255, 255, 0) 60%
		);
		z-index: 9;
		pointer-events: none;
	}

	/* Filament container to create a unified light source */
	.filament-container {
		position: absolute;
		top: 20%;
		left: 25%;
		width: 50%;
		height: 50%;
	}

	/* Filaments (wires) inside the bulb */
	.filament {
		border-radius: 10px;
		position: absolute;
		width: 1px;
		animation: filament-color 4s ease-in-out infinite;
		animation-delay: var(--animation-delay);
	}

	.filament-1 {
		height: 15px;
		top: 2px;
		left: 4px;
		transform: rotate(-4deg);
	}

	.filament-2 {
		height: 15px;
		top: 2px;
		right: 4px;
		transform: rotate(4deg);
	}

	.filament-3 {
		height: 15px;
		top: 2px;
		right: 6px;
		transform: rotate(4deg);
	}

	.filament-connect {
		height: 1px;
		width: 5px;
		bottom: 2px;
		left: 4px;
	}

	/* Warm glow effect */
	.warm-glow {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: radial-gradient(
			circle at center 40%,
			rgba(255, 255, 200, 0.7) 5%,
			rgba(255, 200, 50, 0.4) 30%,
			transparent 70%
		);
		opacity: 0.5;
		animation: warmThrob 4s ease-in-out infinite;
		animation-delay: calc(var(--animation-delay) + 0.5s);
		pointer-events: none;
		z-index: 10;
	}

	.screw-top {
		width: 16px;
		height: 3px;
		background-color: #e7eaee;
		border-radius: 2px;
	}

	.screw-middle {
		width: 12px;
		height: 10px;
		background-color: #b3bbc8;
		border-radius: 2px;
	}

	.screw-bottom {
		width: 8px;
		height: 6px;
		background-color: #959eaf;
		border-radius: 0 0 2px 2px;
	}

	@keyframes throb {
		0%,
		100% {
			box-shadow: 0 0 8px rgba(255, 210, 50, 0.4);
		}
		50% {
			box-shadow: 0 0 20px rgba(255, 210, 50, 0.6);
		}
	}

	@keyframes warmThrob {
		0%,
		100% {
			opacity: 0.3;
		}
		50% {
			opacity: 0.7;
		}
	}

	@keyframes filament-glow {
		0%,
		100% {
			box-shadow: 0 0 8px rgba(255, 210, 50, 0.7);
		}
		50% {
			box-shadow: 0 0 15px rgba(255, 255, 200, 1);
		}
	}

	@keyframes filament-color {
		0%,
		100% {
			background-color: rgba(255, 230, 180, 1);
			box-shadow: 0 0 3px rgba(255, 230, 180, 0.8);
		}
		50% {
			background-color: rgba(255, 255, 240, 1);
			box-shadow: 0 0 6px rgba(255, 255, 240, 1);
		}
	}

	/* Dark mode adjustments */
	:global(.dark) .bulb {
		background-color: rgba(255, 255, 255, 0.05);
		box-shadow: 0 0 15px rgba(255, 210, 50, 0.5);
	}

	:global(.dark) .warm-glow {
		opacity: 0.6;
	}

	:global(.dark) .screw-bottom {
		background-color: #4b5563;
	}

	:global(.dark) .screw-middle {
		background-color: #707a88;
	}

	:global(.dark) .screw-top {
		background-color: #b3bdca;
	}

	
	
</style>
