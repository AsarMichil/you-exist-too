<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	// let { type }: { type: 'text' | 'number' } = $props();
	let {
		class: className,
		value,
		label,
		labelClass,
		...other
	}: HTMLInputAttributes & { label?: string; labelClass?: string } = $props();
	// console.log(type);
</script>

<label class={'flex flex-col space-y-1 ' + labelClass}>
	<div>{label}</div>
	<input
		class={'border-2 border-gray-300 p-2 rounded-md bg-inherit ' + className}
		bind:value
		{...other}
	/>
</label>
