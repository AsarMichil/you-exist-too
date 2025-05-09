<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ExpandableContent from '$lib/components/clean-form/ExpandableContent.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import { fade, slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);

	// Reactive variable to track client-side validation status
	const isValid = $derived(
		$form.username && $form.username.length >= 3 && /^[a-z0-9_-]+$/.test($form.username)
	);
</script>

<section class="flex flex-col w-full h-full justify-center items-center p-4">
	<BorderedBox>
		<h1 class="font-mont text-lg font-semibold w-full">Choose a Username</h1>

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<p class="text-zinc-600 dark:text-zinc-300 text-sm">
					This is how people will find you on the platform.
				</p>
				<Input
					bottomBorderOnly
					massive
					type="text"
					name="username"
					id="username"
					placeholder="awesome-username-here"
					bind:value={$form.username}
					autocomplete="username"
				/>
				{#if $errors.username}
					<p class="text-sm text-red-500 mt-1">
						{$errors.username}
					</p>
				{/if}

				{#if $form.username}
					<ExpandableContent class="h-24">
						<p class="text-zinc-600 dark:text-zinc-300 text-sm">Username requirements:</p>
						<ul class="list-disc pl-5 mt-1 space-y-1">
							<li class={$form.username && $form.username.length >= 3 ? 'text-green-600' : ''}>
								At least 3 characters
							</li>
							<li class={$form.username && $form.username.length <= 30 ? 'text-green-600' : ''}>
								Maximum 30 characters
							</li>
							<li
								class={$form.username && /^[a-z0-9_-]+$/.test($form.username)
									? 'text-green-600'
									: ''}
							>
								Only lowercase letters, numbers, hyphens and underscores
							</li>
						</ul>
					</ExpandableContent>
				{/if}
			</div>

			<Button type="submit" disabled={!isValid}>Next</Button>
		</form>
	</BorderedBox>
</section>

<style>
	:global(input:disabled) {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
