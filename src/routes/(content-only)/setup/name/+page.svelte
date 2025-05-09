<script lang="ts">
	import { goto, replaceState } from '$app/navigation';
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import ExpandableContent from '$lib/components/clean-form/ExpandableContent.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data, form: formData } = $props();
	const { form, message, errors, enhance, constraints } = superForm(data.form);

</script>

<main class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
	<BorderedBox>
		<h1 class=" font-mont text-lg font-semibold w-full">What should people call you?</h1>

		<form method="POST" use:enhance class="space-y-4">
			<div>
				<div class="flex gap-2 items-baseline">
					<div class="w-fit text-sm text-nowrap">My preferred name is:</div>
					<Input
						bottomBorderOnly
						massive
						type="text"
						name="preferred_name"
						id="preferred_name"
						bind:value={$form.preferred_name}
						autocomplete="given-name"
						placeholder="Asar"
					/>
				</div>
				{#if $errors.preferred_name}
					<p class="text-sm text-red-500">
						{$errors.preferred_name}
					</p>
				{/if}
			</div>
			{#if $form.preferred_name}
				<ExpandableContent class="h-28">
					<div>
						<div class=" text-sm">But people might also use these to find me:</div>
						<Input
							bottomBorderOnly
							massive
							type="text"
							name="given_name"
							id="given_name"
							bind:value={$form.given_name}
							autocomplete="given-name"
							placeholder="Asar-Michil"
						/>
						<Input
							bottomBorderOnly
							massive
							type="text"
							name="family_name"
							id="family_name"
							bind:value={$form.family_name}
							autocomplete="family-name"
							placeholder="Zuluev"
						/>
					</div>
				</ExpandableContent>
			{/if}
			<Button type="submit">Next</Button>
		</form>
	</BorderedBox>
</main>
