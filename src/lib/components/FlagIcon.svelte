<script lang="ts">
	import ICanada from '$lib/icons/I_Canada.svelte';
	import IUs from '$lib/icons/I_US.svelte';

	let { country }: { country?: 'US' | 'CA' } = $props();
	const size = 'w-10 h-5';
</script>

{#if country === 'CA'}
	<ICanada class={size} />
{:else if country === 'US'}
	<IUs class={size} />
{/if}
