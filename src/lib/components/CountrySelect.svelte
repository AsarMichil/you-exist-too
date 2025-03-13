<script lang="ts">
	import Select from './Select.svelte';
	import { getCountries } from 'libphonenumber-js';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface CountrySelectProps extends Omit<HTMLSelectAttributes, 'options'> {
		label?: string;
		error?: string | string[] | undefined;
		class?: string;
	}

	let {
		class: className = '',
		value = $bindable(),
		name = 'country',
		label = 'Country',
		error,
		...other
	}: CountrySelectProps = $props();

	// Generate the list of countries
	const countries = getCountries().map((code) => ({
		value: code,
		label: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
	}));

	// Convert error to array format if it's a string
	const formattedError = error ? (Array.isArray(error) ? error : [error]) : undefined;
</script>

<Select
	class={className}
	name={name}
	id={name}
	{label}
	options={countries}
	bind:value={value}
	error={formattedError}
	{...other}
/> 