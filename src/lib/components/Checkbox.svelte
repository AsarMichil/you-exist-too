<script lang="ts">
	import { Checkbox, Label } from 'bits-ui';
	import { Check, Minus } from 'lucide-svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface CheckboxProps extends HTMLInputAttributes {
		label?: string;
		error?: string[] | undefined;
		checked?: boolean | undefined;
	}
	let {
		class: className,
		checked = $bindable(),
		name,
		label,
		error,
		...other
	}: CheckboxProps = $props();
</script>

<div class="flex items-center space-x-3">
	<Checkbox.Root
		id="terms"
		aria-labelledby="terms-label"
		class="border-muted bg-foreground data-[state=unchecked]:border-border-input data-[state=unchecked]:bg-background data-[state=unchecked]:hover:border-dark-40 peer inline-flex size-[25px] items-center justify-center rounded-md border transition-all duration-150 ease-in-out active:scale-[0.98]"
		{name}
		bind:checked
	>
		{#snippet children({ checked, indeterminate })}
			<div class="text-background inline-flex items-center justify-center">
				{#if indeterminate}
					<Minus class="size-[15px]" />
				{:else if checked}
					<Check class="size-[15px]" />
				{/if}
			</div>
		{/snippet}
	</Checkbox.Root>
	<Label.Root
		id="terms-label"
		for="terms"
		class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	>
		{label}
	</Label.Root>
</div>
