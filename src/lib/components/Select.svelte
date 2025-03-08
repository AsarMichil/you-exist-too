<script lang="ts">
	import { Label } from 'bits-ui';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface SelectProps extends HTMLSelectAttributes {
		label: string;
		error?: string[] | undefined;
		options: { value: string; label: string }[];
	}

	let {
		class: className,
		value = $bindable(),
		name,
		label,
		error,
		options,
		...other
	}: SelectProps = $props();
</script>

<div class={className}>
	<div class="relative w-full">
		<select
			{name}
			{...other}
			aria-invalid={error ? 'true' : undefined}
			class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer"
			bind:value={value}
		>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
		<Label.Root
			id={name + '-label'}
			for={name}
			class="dark:peer-autofill:text-black font-mont absolute transform -translate-y-10 scale-75 px-1"
		>
			{label}</Label.Root>
	</div>
</div> 