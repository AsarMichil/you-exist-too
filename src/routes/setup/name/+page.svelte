<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, message, errors, enhance, constraints } = superForm(data.form);
	console.log('form', $form.preferred_name, $form.given_name, $form.family_name);
</script>

<main class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
	<h1 class=" font-mont text-2xl">What should people call you?</h1>

	<BorderedBox>
		<form method="POST" use:enhance class="space-y-4">
			<div>
				<div class="flex gap-2 items-baseline">
					<div>My name is:</div>
					<Input
						class="grow"
						type="text"
						name="preferred_name"
						id="preferred_name"
						label="Name"
						bind:value={$form.preferred_name}
					/>
				</div>
				{#if $errors.preferred_name}
					<p class="text-sm text-red-500">
						{$errors.preferred_name}
					</p>
				{/if}
			</div>
			<div>But people might also use these to find me:</div>
			<Input
				type="text"
				name="given_name"
				id="given_name"
				label="Given Name"
				bind:value={$form.given_name}
			/>
			<Input
				type="text"
				name="family_name"
				id="family_name"
				label="Family Name"
				bind:value={$form.family_name}
			/>
			<Button type="submit">Next</Button>
		</form>
	</BorderedBox>
</main>
