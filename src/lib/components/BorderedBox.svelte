<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children, class: className }: { children: Snippet; class?: string } = $props();
</script>

<div
	class="rounded xs:border xs:border-slate-700 dark:xs:border-white p-4 max-w-96 mx-auto w-full {className}"
>
	{@render children()}
</div>
