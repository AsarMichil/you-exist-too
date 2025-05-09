<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let { children, class: className }: { children: Snippet; class: string } = $props();
</script>

<div transition:fade={{ duration: 300 }}>
	<div class={`mt-4 text-sm ${className}`} transition:slide={{ duration: 300 }}>
		{@render children()}
	</div>
</div>
