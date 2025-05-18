<script lang="ts">
	import type { Theme } from '$lib/stores/theme.svelte';

	let { theme }: { theme: Theme } = $props();
</script>

<div class="flex items-center">
	<div class="">
		{#if theme.current === 'dark'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="white"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="black"
				class="w-6 h-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
				/>
			</svg>
		{/if}
	</div>
	<label for="theme-toggle" class="ml-1 relative inline-flex items-center cursor-pointer">
		<input
			checked={theme.current === 'dark'}
			onclick={() => {
				theme.setTheme(theme.current === 'dark' ? 'light' : 'dark');
			}}
			aria-label="Toggle dark mode"
			type="checkbox"
			id="theme-toggle"
			class="sr-only peer"
			value=""
		/>
		<div
			class="w-11 h-6 bg-brownish-700 peer-focus:outline-none peer-focus:ring-brownish-300 peer-focus:ring-4
               rounded-full peer
             dark:bg-brownish-200 peer-checked:after:translate-x-full
             rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-['']
              after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300
              after:border after:rounded-full after:h-5 after:w-5 after:transition-all
               peer-checked:bg-brownish-200"
		></div>
	</label>
</div>
