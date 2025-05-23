<script lang="ts">
	let { value } = $props();

	let isTicking = $state(false);
	let previousValue = $state(value);
	// keep track of timeouts to reset it if spamming
	let timeout: NodeJS.Timeout | undefined = $state();

	$effect(() => {
		console.log('values', value, previousValue, isTicking);
		if (value !== previousValue && previousValue !== undefined) {
			if (timeout) {
				clearTimeout(timeout);
			}

			isTicking = true;
			timeout = setTimeout(() => (isTicking = false), 400);
		}
		previousValue = value;
	});
</script>

<span
	class={`transition-all duration-200 ease-in-out ${isTicking ? 'text-brownish-300 dark:text-brownish-100' : ''}`}
>
	{value}
</span>
