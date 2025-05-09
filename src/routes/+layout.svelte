<script lang="ts">
	import { createTheme } from '$lib/stores/theme.svelte';
	import '../app.css';

	let { children } = $props();
	let _ = createTheme();
</script>

{@render children()}
