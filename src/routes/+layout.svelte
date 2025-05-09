<script lang="ts">
	import { createTheme } from '$lib/stores/theme.svelte';
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();
	let _ = createTheme();
</script>

{@render children()}
