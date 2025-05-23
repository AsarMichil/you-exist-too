<script lang="ts">
	import { page } from '$app/state';
	import AnimatedCounter from './AnimatedCounter.svelte';
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
			// await callThoughtsApi();
		} catch (error) {
			console.error('Error adding thought:', error);
		}
	}
</script>

<div class="thought-button-container flex flex-col items-center gap-4 my-6">
	<div class="relative">
		<button
			onclick={addThought}
			class="thought-button relative overflow-hidden flex items-center justify-center gap-3 w-64 h-16 rounded-2xl font-semibold text-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-brownish-300/30 dark:focus:ring-brownish-200/30"
		>
			<!-- Outer raised border ring with glint effect -->
			<div class="absolute inset-0 rounded-xl border-ring-with-glint"></div>

			<!-- Inner button area -->
			<div class="absolute inset-1 rounded-2xl inner-button"></div>

			<!-- Content with engraved effect -->
			<div
				class="relative z-10 flex items-center gap-3 text-brownish-800 dark:text-brownish-150 engraved-content"
			>
				<Heart
					class="w-5 h-5 transition-all duration-200"
					fill={ambitiousThoughtCount > 0 ? 'currentColor' : 'none'}
				/>
				<span class="font-gar text-lg tracking-wide font-bold"> I Thought About You </span>
			</div>
		</button>
	</div>

	<div class="text-center text-brownish-700 dark:text-brownish-200 font-mont">
		<span class="text-lg">
			{username} has been thought about
		</span>
		<span class="text-2xl font-bold font-gar text-brownish-600 dark:text-brownish-200">
			<AnimatedCounter value={ambitiousThoughtCount}></AnimatedCounter>
			<span class="">
				{ambitiousThoughtCount === 1 ? 'time' : 'times'}
			</span>
		</span>
	</div>

	{#if isLoggedIn}
		<div class="dark:text-brownish-100">
			<Checkbox
				label="Make my thought anonymous"
				id="anonymous-thought"
				bind:checked={isAnonymous}
				class="rounded border-brownish-600 dark:border-brownish-400 hocus:ring-brownish-500 text-brownish-600 dark:text-brownish-100"
			/>
		</div>
	{/if}
</div>

<style>
	.thought-button {
		/* Remove all background from button itself */
		background: transparent;
		border: none;
		cursor: pointer;
		user-select: none;
	}

	/* Border ring with integrated glint effect */
	.border-ring-with-glint {
		background: linear-gradient(145deg, #f2ebe9 0%, #d6a89c 25%, #ba8273 75%, #9d6050 100%);
		box-shadow:
			0 4px 16px rgba(154, 100, 80, 0.25),
			0 2px 6px rgba(154, 100, 80, 0.15),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.6),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.2);
	}

	/* Glint effect using the playground technique */
	.border-ring-with-glint::before {
		content: '';
		position: absolute;
		left: -175%;
		top: -175%;
		width: 450%;
		height: 450%;
		rotate: -72deg;
		background: conic-gradient(
			transparent 0deg,
			transparent 280deg,
			rgba(255, 255, 255, 0.4) 320deg,
			rgba(255, 255, 255, 0.8) 360deg
		);
		border-radius: inherit;
		animation: glint-spin 6s linear infinite;
	}

	/* To animate on hover or focus... */
	/* .thought-button:hover .border-ring-with-glint::before {
		animation: glint-spin 6s linear infinite;
	}

	.thought-button:focus .border-ring-with-glint::before {
		animation: glint-spin 6s linear infinite;
	} */

	/* Inner button - raised/flush, not inset */
	.inner-button {
		background: linear-gradient(145deg, #d6a89c 0%, #ba8273 50%, #9d6050 100%);
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.08),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.4),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.15);
		border: 0.5px solid rgba(0, 0, 0, 0.08);
	}

	/* Engraved text effect - ONLY the text is inset */
	.engraved-content {
		text-shadow:
			0 1px 0 #f2ebe9,
			1px 0 0 rgba(255, 255, 255, 0.6),
			0 -1px 0 rgba(0, 0, 0, 0.3),
			-1px 0 0 rgba(0, 0, 0, 0.2);
		filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.3));
	}

	/* Hover state - enhance the physical appearance */
	.thought-button:hover .border-ring-with-glint {
		background: linear-gradient(145deg, #f8f1ef 0%, #e2b4a8 25%, #c68e7f 75%, #a86b5b 100%);
		box-shadow:
			0 6px 20px rgba(154, 100, 80, 0.3),
			0 3px 8px rgba(154, 100, 80, 0.2),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.7),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.25);
	}

	.thought-button:hover .inner-button {
		background: linear-gradient(145deg, #e2b4a8 0%, #c68e7f 50%, #a86b5b 100%);
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.12),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.5),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.2);
	}

	/* Active state - button gets pressed down */
	.thought-button:active .border-ring-with-glint {
		box-shadow:
			0 2px 8px rgba(154, 100, 80, 0.3),
			0 1px 4px rgba(154, 100, 80, 0.2),
			inset 0 1px 2px rgba(0, 0, 0, 0.15),
			inset 0 -0.5px 0 rgba(255, 255, 255, 0.3);
	}

	.thought-button:active .inner-button {
		background: linear-gradient(145deg, #ba8273 0%, #9d6050 50%, #814433 100%);
		box-shadow:
			0 0.5px 2px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(0, 0, 0, 0.2),
			inset 0 -0.5px 0 rgba(255, 255, 255, 0.1);
		transform: translateY(0.5px);
	}

	.thought-button:active .engraved-content {
		transform: translateY(0.5px);
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.1),
			0 -1px 0 rgba(0, 0, 0, 0.9),
			0 0 2px rgba(0, 0, 0, 0.5);
	}

	/* Dark mode styles */
	:global(.dark) .border-ring-with-glint {
		background: linear-gradient(145deg, #814433 0%, #652c1d 25%, #48190d 75%, #330e03 100%);
		box-shadow:
			0 4px 16px rgba(51, 14, 3, 0.4),
			0 2px 6px rgba(51, 14, 3, 0.25),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.15),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.4);
	}

	:global(.dark) .border-ring-with-glint::before {
		content: '';
		position: absolute;
		left: -175%;
		top: -175%;
		width: 450%;
		height: 450%;
		background: conic-gradient(
			transparent 0deg,
			transparent 280deg,
			rgba(255, 255, 255, 0.3) 320deg,
			rgba(255, 255, 255, 0.6) 360deg
		);
	}

	:global(.dark) .inner-button {
		background: linear-gradient(145deg, #652c1d 0%, #48190d 50%, #330e03 100%);
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.2),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.1),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.3);
	}

	:global(.dark) .engraved-content {
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.1),
			1px 0 0 rgba(255, 255, 255, 0.05),
			0 -1px 0 rgba(51, 11, 0, 0.6),
			-1px 0 0 rgba(51, 14, 3, 0.4),
			0 0 1px rgba(214, 168, 156, 0.3);
		filter: drop-shadow(0 0 2px rgba(214, 168, 156, 0.2));
	}

	:global(.dark) .thought-button:hover .border-ring-with-glint {
		background: linear-gradient(145deg, #8b4a38 0%, #754331 25%, #522015 75%, #3d1208 100%);
		box-shadow:
			0 6px 20px rgba(51, 14, 3, 0.5),
			0 3px 8px rgba(51, 14, 3, 0.3),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.2),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.5);
	}

	:global(.dark) .thought-button:hover .inner-button {
		background: linear-gradient(145deg, #754331 0%, #522015 50%, #3d1208 100%);
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.25),
			inset 0 0.5px 0 rgba(255, 255, 255, 0.15),
			inset 0 -0.5px 0 rgba(0, 0, 0, 0.4);
	}

	:global(.dark) .thought-button:active .engraved-content {
		text-shadow:
			0 1px 0 rgba(255, 255, 255, 0.08),
			1px 0 0 rgba(255, 255, 255, 0.04),
			0 -1px 0 rgba(51, 11, 0, 0.7),
			-1px 0 0 rgba(51, 14, 3, 0.5),
			0 0 1px rgba(214, 168, 156, 0.25);
	}

	/* Glint animation */
	@keyframes glint-spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	.thought-button-container {
		filter: drop-shadow(0 4px 8px rgba(154, 100, 80, 0.15));
	}
</style>
