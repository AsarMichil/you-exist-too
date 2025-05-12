<script lang="ts">
	import { Dialog, Separator, type DialogContentProps, type DialogPortalProps } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface SuccessModalProps extends DialogContentProps {
		open: boolean;
		title: string;
		children: Snippet;
	}
	let { open, title, onInteractOutside, children }: SuccessModalProps = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/80" />
		<Dialog.Content
			{onInteractOutside}
			class="fixed left-[50%] top-[45%] w-full max-w-[80vw] min-h-[40vh] translate-x-[-50%] translate-y-[-50%] border border-slate-800 dark:border-white p-5 sm:max-w-lg md:w-full rounded-lg shadow bg-inherit dark:text-white"
		>
			<Dialog.Title class="text-lg font-mont">
				{title}
			</Dialog.Title>
			<Separator.Root class="bg-slate-800 dark:bg-white -mx-5 mb-6 mt-5 block h-px" />
			<div class="text-slate-600 dark:text-slate-300">
				{@render children?.()}
			</div>
			<Dialog.Close
				class="focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden absolute right-6 top-6 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
			>
				<div>
					<X class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
