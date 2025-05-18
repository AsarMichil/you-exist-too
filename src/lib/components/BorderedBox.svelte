<script lang="ts">
	const { children, class: className } = $props();
</script>

<div
	class="rounded xs:border xs:border-slate-700 dark:xs:border-white p-4 max-w-96 mx-auto w-full {className}"
>
	{@render children()}
</div>
