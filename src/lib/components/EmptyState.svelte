<script lang="ts">
	import { Flame } from '@lucide/svelte';

	let {
		title = 'No data available',
		message = "There's nothing to show here yet.",
		icon = 'flame',
		class: className = '',
		children
	}: {
		title?: string;
		message?: string;
		icon?: string;
		class?: string;
		children?: any;
	} = $props();

	// Choose icon based on icon prop
	const icons = {
		flame: Flame
	};

	const Icon = icons[icon as keyof typeof icons] || Flame;
</script>

<div class="empty-state flex flex-col items-center justify-center py-12 {className}">
	<div
		class="icon-container mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-brownish-200 dark:bg-brownish-900/30"
	>
		<Icon class="w-8 h-8 text-brownish-800 dark:text-brownish-200" />
	</div>

	<h3 class="text-xl font-medium mb-2">{title}</h3>
	<p class="text-slate-600 dark:text-slate-100 text-center max-w-sm">{message}</p>

	{#if children}
		<div class="mt-6">
			{@render children()}
		</div>
	{/if}
</div>
