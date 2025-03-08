<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import Select from '$lib/components/Select.svelte';
	import { getCountries } from 'libphonenumber-js';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	const { form, errors, enhance } = superForm(data.form);

	const countries = getCountries().map((code) => ({
		value: code,
		label: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
	}));
</script>

<main class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
	<h1 class="font-mont text-2xl">Where are you from?</h1>

	<BorderedBox>
		<form method="POST" use:enhance class="space-y-4">
			<div>
				<div class="flex gap-2 items-baseline">
					<div>I'm from:</div>
					<Select
						class="grow"
						name="country"
						id="country"
						label="Country"
						options={countries}
						bind:value={$form.country}
					/>
				</div>
				{#if $errors?.country}
					<p class="text-sm text-red-500">{$errors.country}</p>
				{/if}
			</div>
			<div class="text-sm text-gray-500">Please select your country of origin.</div>
			<Button type="submit">Next</Button>
		</form>
	</BorderedBox>
</main>
