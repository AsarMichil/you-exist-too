<script lang="ts">
	import { Button } from 'bits-ui';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	interface ButtonProps extends HTMLButtonAttributes {
		colour?: 'forestgreen' | 'red' | 'brownish';
	}
	let { class: className, value, children, colour = 'brownish', ...other }: ButtonProps = $props();
	const colours = {
		forestgreen:
			'hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700  dark:focus:border-forestgreen-700 focus:border-forestgreen-700 focus:ring-forestgreen-700 ',
		red: 'text-red-500 hover:text-red-700 border-red-500 dark:border-red-500 hover:border-red-700 dark:hover:border-red-700 dark:focus:border-red-700 focus:border-red-700 focus:ring-red-700',
		brownish:
			'hover:bg-brownish-400 active:bg-brownish-700 dark:hover:bg-brownish-400 dark:active:bg-brownish-700  dark:focus:border-brownish-700 focus:border-brownish-700 focus:ring-brownish-700 '
	};
</script>

<div>
	<Button.Root
		class={twMerge(
			'my-2 border-2 rounded-md w-full py-2 px-3 focus:ring-2  outline-none border-slate-800 dark:border-white',
			colours[colour],
			String(className)
		)}
		{...other}
	>
		{#if children}
			{@render children()}
		{/if}
	</Button.Root>
</div>
