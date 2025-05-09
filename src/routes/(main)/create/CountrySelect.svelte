<script lang="ts">
	import type { SupportedCountries } from '$lib/types/person';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	// let { type }: { type: 'text' | 'number' } = $props();
	let {
		class: className,
		value,
		label,
		labelClass,
		...other
	}: HTMLSelectAttributes & { label?: string; labelClass?: string } = $props();
	// console.log(type);

	const countries: SupportedCountries[] = ['US', 'CA'];
</script>

<label class={'flex flex-col space-y-1 ' + labelClass}>
	<div>{label}</div>
	<select
		class={'border-2 border-gray-300 p-2 rounded-md bg-inherit ' + className}
		bind:value
		{...other}
		style="-webkit-appearance: none"
	>
		{#each countries as c}
			<option value={c}>{c}</option>
		{/each}
	</select>
</label>
