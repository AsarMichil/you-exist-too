<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { NavDropdown } from '$lib/components';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { createTheme } from '$lib/stores/theme.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);
	let theme = createTheme();

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<div class="min-h-screen flex flex-col mx-6 dark:text-white">
	<div class="w-full flex justify-between mt-3 items-center mb-2">
		<div>
			<h1 class="font-gar text-2xl hover:text-brownish-500 dark:hover:text-brownish-300">
				<a href="/">You Exist.</a>
			</h1>
		</div>
		<div class="flex justify-end items-center">
			{#if session}
				<div class="mr-2">
					<NavDropdown
						items={[
							{ label: 'Profile', value: 'profile', icon: 'user', href: '/you' },
							{
								label: 'Sign Out',
								value: 'signout',
								icon: 'signout',
								href: '/signout',
								invalidateAll: true
							}
						]}
					/>
					<!-- <h1 class="text-xl font-gar px-2">
						<a
							data-sveltekit-reload
							href="/signout"
							class="focus:outline-brownish-500 dark:focus:outline-brownish-100 focus:outline focus:rounded"
						>
							Sign Out
						</a>
					</h1> -->
				</div>
			{/if}
			<div class="mr-2">
				<h1 class="text-xl font-gar px-2">
					<a
						href="/about"
						class="hover:text-brownish-500 dark:hover:text-brownish-300 focus:outline-brownish-500 dark:focus:outline-brownish-100 focus:outline focus:rounded"
					>
						About
					</a>
				</h1>
			</div>
			<ThemeToggle {theme} />
		</div>
	</div>
	<hr class="border-t-black dark:border-t-white" />
	{@render children()}
</div>
