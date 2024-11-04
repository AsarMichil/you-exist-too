<script lang="ts">
	import type { Snippet, SvelteComponent } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		error,
		class: className,
		prefixWith,
		icon,
		...other
	}: HTMLAttributes<HTMLDivElement> & {
		error?: string;
		prefixWith?: string;
		icon?: Snippet;
	} = $props();
	console.log(error);
</script>

{#if error}
	<div class={'text-red-500 inline-flex gap-1 items-center ' + className} {...other}>
		{#if icon}
			{@render icon()}
		{/if}
		{prefixWith ? prefixWith + error : error}
	</div>
{:else}
	<div class={className}></div>
{/if}
