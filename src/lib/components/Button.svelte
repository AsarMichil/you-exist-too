<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	// let { type }: { type: 'text' | 'number' } = $props();
	let { class: className, value, children, ...other }: HTMLButtonAttributes = $props();
	// console.log(type);
</script>

<div>
	<button class={'border-2 border-gray-300 p-2 rounded-md bg-inherit ' + className} {...other}>
		{#if children}
			{@render children()}
		{/if}
	</button>
</div>
