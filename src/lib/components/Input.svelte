<script lang="ts">
	import { Label } from 'bits-ui';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface InputProps extends HTMLInputAttributes {
		label?: string;
		error?: string[] | undefined;
		bottomBorderOnly?: boolean;
		massive?: boolean;
	}

	let {
		class: className,
		value = $bindable(),
		children,
		name,
		label,
		error,
		bottomBorderOnly = false,
		placeholder,
		massive = false,
		...other
	}: InputProps = $props();
</script>

<div class={className}>
	<div class="relative w-full">
		<input
			{name}
			{...other}
			aria-invalid={error ? 'true' : undefined}
			class={` pt-3 pb-1 px-3   w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700  peer ${
				bottomBorderOnly ? 'border-b-2' : 'rounded border focus:ring-2 focus:ring-forestgreen-700'
			} ${massive ? 'text-2xl' : 'text-sm'}`}
			placeholder={placeholder}
			bind:value
		/><br />
		{#if label}
			<Label.Root
				id={name + '-label'}
				for={name}
				class="dark:peer-autofill:text-black font-mont absolute transform -translate-y-10 scale-75 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-7 peer-placeholder-shown:pl-3 px-1"
			>
				{label}
			</Label.Root>
		{/if}
	</div>
</div>
