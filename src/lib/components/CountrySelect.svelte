<script lang="ts">
	import Select from './Select.svelte';
	import { getCountries } from 'libphonenumber-js';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface CountrySelectProps extends Omit<HTMLSelectAttributes, 'options'> {
		label?: string;
		error?: string | string[] | undefined;
		class?: string;
		bottomBorderOnly?: boolean;
		massive?: boolean;
		value: string;
	}

	let {
		class: className = '',
		value = $bindable(),
		name = 'country',
		label = 'Country',
		error,
		bottomBorderOnly = false,
		massive = false,
		...other
	}: CountrySelectProps = $props();

	// Generate the list of countries
	const countries = getCountries().map((code) => ({
		value: code,
		label: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code
	}));
	// rearrange first countries
	// find US and Canada
	const us = countries.find((country) => country.value === 'US');
	const canada = countries.find((country) => country.value === 'CA');
	if (us && canada) {
		// remove them from the array
		countries.splice(countries.indexOf(us), 1);
		countries.splice(countries.indexOf(canada), 1);
		// add them to the beginning of the array
		countries.unshift(canada, us);
	}

	// Convert error to array format if it's a string
	const formattedError = error ? (Array.isArray(error) ? error : [error]) : undefined;
</script>

<Select
	class={className}
	{name}
	id={name}
	options={countries}
	bind:value
	error={formattedError}
	{bottomBorderOnly}
	{massive}
	{...other}
/>
