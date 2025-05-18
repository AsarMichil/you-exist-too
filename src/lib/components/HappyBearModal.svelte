<script lang="ts">
	import BearHappy from '$lib/icons/BearHappy.svelte';
	import SuccessModal from './SuccessModal.svelte';
	import type { ComponentProps } from 'svelte';

	let { open, title, onInteractOutside, children }: ComponentProps<typeof SuccessModal> = $props();
</script>

<SuccessModal {open} {title} {onInteractOutside}>
	<div class="flex flex-col">
		<div class="w-full dark:stroke-white dark:fill-white flex justify-center items-center">
			<div class="w-48">
				<BearHappy />
			</div>
		</div>
		<div class="w-full font-gar">
			<p class="text-xl">
				{@render children()}
			</p>
		</div>
	</div>
</SuccessModal>
