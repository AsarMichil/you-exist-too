<script lang="ts">
	import { page } from '$app/state';
	import NotFound from './NotFound.svelte';

</script>

{#if page.status === 404}
	<NotFound />
{:else}
	<h1 class="dark:text-white">{page.status}: {page.error?.message}</h1>
{/if}

