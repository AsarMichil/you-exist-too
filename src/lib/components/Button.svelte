<script lang="ts">
	import { Button } from 'bits-ui';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface ButtonProps extends HTMLButtonAttributes {}
	let { class: className, value, children, ...other }: ButtonProps = $props();
</script>

<div>
	<Button.Root
		class={'my-2 border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 ' +
			(className || '')}
		{...other}
	>
		{#if children}
			{@render children()}
		{/if}
	</Button.Root>
</div>
