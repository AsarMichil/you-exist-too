<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);

	// Reactive variable to track client-side validation status
	const isValid = $derived(
		$form.username && $form.username.length >= 3 && /^[a-z0-9_-]+$/.test($form.username)
	);
</script>

<main class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
	<h1 class="font-mont text-2xl">Choose a Username</h1>

	<BorderedBox>
		<form method="POST" use:enhance class="space-y-4">
			<div>
				<p class="mb-4">This is how people will find you on the platform.</p>
				<Input
					type="text"
					name="username"
					id="username"
					label="Username"
					bind:value={$form.username}
					autocomplete="username"
				/>
				{#if $errors.username}
					<p class="text-sm text-red-500 mt-1">
						{$errors.username}
					</p>
				{/if}

				<div class="mt-4 text-sm">
					<p>Username requirements:</p>
					<ul class="list-disc pl-5 mt-1 space-y-1">
						<li class={$form.username && $form.username.length >= 3 ? 'text-green-600' : ''}>
							At least 3 characters
						</li>
						<li class={$form.username && $form.username.length <= 30 ? 'text-green-600' : ''}>
							Maximum 30 characters
						</li>
						<li
							class={$form.username && /^[a-z0-9_-]+$/.test($form.username) ? 'text-green-600' : ''}
						>
							Only lowercase letters, numbers, hyphens and underscores
						</li>
					</ul>
				</div>
			</div>

			<Button type="submit" disabled={!isValid}>Next</Button>
		</form>
	</BorderedBox>
</main>

<style>
	:global(input:disabled) {
		opacity: 0.7;
		cursor: not-allowed;
	}
</style>
