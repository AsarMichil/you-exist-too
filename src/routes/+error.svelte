<script lang="ts">
	import { page } from '$app/stores';
</script>

<h1 class="dark:text-white">{$page.status}: {$page.error?.message}</h1>

<div></div>
