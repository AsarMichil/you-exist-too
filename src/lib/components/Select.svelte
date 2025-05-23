<script lang="ts">
	import { Check, ChevronDown, ChevronUp } from '@lucide/svelte';
	import { createCombobox, type ComboboxOptionProps } from '@melt-ui/svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	interface SelectProps extends HTMLSelectAttributes {
		error?: string[] | undefined;
		options: { value: string; label: string }[];
		bottomBorderOnly?: boolean;
		massive?: boolean;
		labelName?: string;
		value: string;
	}

	let {
		class: className,
		value = $bindable(),
		name,
		error,
		options,
		bottomBorderOnly = false,
		massive = false,
		labelName,
		...other
	}: SelectProps = $props();

	interface Option {
		value: string;
		label: string;
	}

	const toOption = (option: Option): ComboboxOptionProps<string> => ({
		value: option.value,
		label: option.label,
		disabled: false
	});

	const {
		elements: { menu, input, option, arrow, label },
		states: { open, inputValue, selected },
		helpers: { isSelected }
	} = createCombobox({
		defaultSelected: options.find((opt) => opt.value === value) || options[0],
		onSelectedChange: ({ next }) => {
			if (next) {
				console.log('bro', next);
				value = next.value;
				console.log('bro2', value);
			}
			return next;
		}
	});

	$effect(() => {
		if (!$open) {
			$inputValue = $selected?.label ?? '';
		}
	});

	// Filter options based on input value when autocomplete is enabled
	let filteredOptions = $derived(
		$inputValue && $open
			? options.filter((opt) => opt.label.toLowerCase().includes($inputValue.toLowerCase()))
			: options
	);
</script>

<div class="flex flex-col gap-1 dark:text-white dark:bg-stone-900 h-10">
	<label {...$label} use:label>
		<span class="text-sm font-medium">{labelName}</span>
	</label>
	<input type="hidden" {name} bind:value />
	<div class="relative">
		<input
			{...$input}
			use:input
			class={`flex h-10 w-full items-center justify-between rounded-lg px-3 pr-12 dark:text-white dark:bg-stone-900 border border-slate-300 dark:border-slate-600 ${className} ${massive ? 'text-2xl' : ''}`}
			placeholder="Your Country"
		/>
		<div class="absolute right-2 top-1/2 z-10 -translate-y-1/2">
			{#if $open}
				<ChevronUp class="size-4" />
			{:else}
				<ChevronDown class="size-4" />
			{/if}
		</div>
	</div>

	{#if $open}
		<div class="relative z-50">
			<ul
				class="z-50 absolute left-0 right-0 mt-1 flex max-h-[300px] flex-col rounded-lg border border-slate-300 dark:border-slate-600 shadow-md overflow-y-auto dark:text-white bg-white dark:bg-stone-900"
				{...$menu}
				use:menu
				transition:fly={{ duration: 150, y: -5 }}
			>
				{#each filteredOptions as thingy, index (index)}
					<li
						{...$option(toOption(thingy))}
						use:option
						class="relative cursor-pointer scroll-my-2 py-2 pl-4 pr-4 hover:bg-slate-100 dark:hover:bg-slate-800"
					>
						{#if $isSelected(thingy)}
							<div class="check absolute left-2 top-1/2 z-50 -translate-y-1/2">
								<Check class="size-4" />
							</div>
						{/if}
						<div class="pl-4">
							<span class="font-medium">{thingy.label}</span>
						</div>
					</li>
				{:else}
					<li
						class="relative cursor-pointer rounded-md py-3 pl-8 pr-4 text-center text-slate-500 dark:text-slate-400"
					>
						No results found
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
