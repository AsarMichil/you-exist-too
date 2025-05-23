<script lang="ts">
	import { goto } from '$app/navigation';
	import { CircleUserRound, User, LogOut } from '@lucide/svelte';
	import { createDropdownMenu, melt } from '@melt-ui/svelte';
	import { twMerge } from 'tailwind-merge';

	interface DropdownItem {
		label: string;
		value: string;
		icon?: 'user' | 'signout';
		href?: string;
		invalidateAll?: boolean;
		onClick?: () => void;
	}

	interface Props {
		items: DropdownItem[];
		class?: string;
	}

	let { items, class: className = '' }: Props = $props();

	const {
		elements: { trigger, menu, item, separator, arrow, overlay },
		states: { open }
	} = createDropdownMenu({
		positioning: {
			placement: 'bottom-end',
			gutter: 8
		}
	});

	const handleItemClick = async (itemValue: string, onClick?: () => void) => {
		if (onClick) {
			onClick();
		}
		// Navigation items will be handled by anchor tags directly
	};

	const getIcon = (iconType?: string) => {
		switch (iconType) {
			case 'user':
				return User;
			case 'signout':
				return LogOut;
			default:
				return null;
		}
	};
</script>

<!-- Trigger Button -->
<button
	type="button"
	{...$trigger}
	use:trigger
	class={twMerge(
		'flex items-center justify-center p-2 rounded-full transition-all duration-200 ease-in-out',
		'hover:bg-brownish-100 dark:hover:bg-brownish-300',
		'focus:outline-none focus:ring-2 focus:ring-brownish-400 dark:focus:ring-brownish-300',
		'active:scale-95',
		$open ? 'bg-brownish-200 dark:bg-brownish-300 ' : '',
		className
	)}
	aria-label="User menu"
>
	<CircleUserRound
		class="w-6 h-6 text-brownish-700 dark:text-white transition-colors duration-200"
	/>
</button>

<!-- Overlay for modal behavior -->
{#if $open}
	<div {...$overlay} use:overlay class="fixed inset-0 z-40"></div>
{/if}

<!-- Dropdown Menu -->
{#if $open}
	<div
		{...$menu}
		use:menu
		class="z-50 min-w-[200px] bg-white dark:bg-stone-900 border border-brownish-200 dark:border-white rounded-lg shadow-lg px-1 py-1.5"
	>
		<!-- Arrow pointing to trigger -->
		<div class="border-t border-l border-brownish-200 dark:border-white" {...$arrow} use:arrow></div>

		{#each items as menuItem, index}
			{#if index > 0}
				<div class="h-px bg-brownish-200 dark:bg-stone-300 my-1"></div>
			{/if}

			{#if menuItem.href}
				<!-- Navigation item - use anchor tag with preload -->
				<a
					data-sveltekit-reload={!!menuItem.invalidateAll}
					{...$item}
					use:item
					href={menuItem.href}
					data-sveltekit-preload-data="hover"
					class="w-full flex items-center gap-3 px-3 py-2 text-left text-brownish-800 dark:text-white rounded-md transition-all duration-150 ease-in-out hover:bg-brownish-100 dark:hover:bg-brownish-300 focus:outline-none focus:bg-brownish-100 dark:focus:bg-brownish-300 no-underline"
				>
					{#if menuItem.icon}
						{@const IconComponent = getIcon(menuItem.icon)}
						{#if IconComponent}
							<IconComponent class="w-4 h-4" />
						{/if}
					{/if}
					<span class="font-medium">{menuItem.label}</span>
				</a>
			{:else}
				<!-- Action item - use button -->
				<!-- svelte-ignore event_directive_deprecated -->
				<button
					{...$item}
					use:item
					class="w-full flex items-center gap-3 px-3 py-2 text-left text-brownish-800 dark:text-white rounded-md transition-all duration-150 ease-in-out hover:bg-brownish-100 dark:hover:bg-brownish-300 focus:outline-none focus:bg-brownish-100 dark:focus:bg-brownish-800"
					on:m-click={() => handleItemClick(menuItem.value, menuItem.onClick)}
				>
					{#if menuItem.icon}
						{@const IconComponent = getIcon(menuItem.icon)}
						{#if IconComponent}
							<IconComponent class="w-4 h-4" />
						{/if}
					{/if}
					<span class="font-medium">{menuItem.label}</span>
				</button>
			{/if}
		{/each}
	</div>
{/if}
