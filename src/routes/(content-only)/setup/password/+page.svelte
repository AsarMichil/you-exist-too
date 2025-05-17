<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import SetupNavigation from '$lib/components/SetupNavigation.svelte';
	import ExpandableContent from '$lib/components/clean-form/ExpandableContent.svelte';
	import { setTransitionDirection } from '$lib/stores/setup.svelte.js';
	import { fade, slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);

	// Define routes for navigation
	const forwardRoute = 'name';

	// Track password visibility
	let showPassword = $state(false);
	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};
</script>

<SetupNavigation {forwardRoute} canGoBackward={false} canGoForward={false}>
	<section class="flex flex-col w-full h-full justify-center items-center p-4">
		<BorderedBox>
			<h1 class="font-mont text-lg font-semibold w-full">Create a Password</h1>

			<form
				method="POST"
				use:enhance
				class="space-y-4"
				onsubmit={() => {
					setTransitionDirection('forward');
				}}
			>
				<div>
					<p class="text-zinc-600 dark:text-zinc-300 text-sm">
						Create a secure password for your account.
					</p>
					<div class="relative">
						<Input
							bottomBorderOnly
							massive
							type={showPassword ? 'text' : 'password'}
							name="password"
							id="password"
							placeholder="Your secure password"
							bind:value={$form.password}
							autocomplete="new-password"
						/>
						<button
							type="button"
							class="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-forestgreen-500"
							onclick={togglePasswordVisibility}
						>
							{showPassword ? 'Hide' : 'Show'}
						</button>
					</div>
					{#if $errors.password}
						<p class="text-sm text-red-500 mt-1">
							{$errors.password}
						</p>
					{/if}

					{#if $form.password}
						<ExpandableContent class="h-16">
							<p class="text-zinc-600 dark:text-zinc-300 text-sm">Password requirements:</p>
							<ul class="list-disc pl-5 mt-1 space-y-1">
								<li class={$form.password && $form.password.length >= 8 ? 'text-green-600' : ''}>
									At least 8 characters
								</li>
								<li class={$form.password && $form.password.length <= 64 ? 'text-green-600' : ''}>
									Maximum 64 characters
								</li>
							</ul>
						</ExpandableContent>
					{/if}
				</div>

				<Button type="submit">Next</Button>
			</form>
		</BorderedBox>
	</section>
</SetupNavigation>
