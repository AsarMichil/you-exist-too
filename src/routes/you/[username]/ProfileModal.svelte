<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import ProfileUpload from './ProfileUpload.svelte';

	function onProfileModal(node: HTMLCanvasElement) {
		const ctx = node.getContext('2d');
	}
	let { toggled = $bindable(), form } = $props();
	let uploading = $state(false);
</script>

{#if toggled}
	<div
		class="absolute w-screen h-screen bg-black bg-opacity-50 right-0 flex flex-row justify-center items-center dark:text-white"
	>
		<!-- Modal -->
		<div class="relative w-5/6 h-5/6 bg-cream-200 dark:bg-stone-900 border-2 rounded-lg px-6 py-4">
			<ProfileUpload {form} />
			<button
				class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				onclick={() => {
					// profile_photo = false;
					toggled = false;
				}}>Close</button
			>

			<!-- Modal End -->
		</div>
	</div>
{/if}
