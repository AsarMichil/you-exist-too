<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import ProfilePhotoUpload from '$lib/components/ProfilePhotoUpload.svelte';
	import SetupNavigation from '$lib/components/SetupNavigation.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	// const { form, errors, enhance } = superForm(data.form);

	// Define routes for navigation
	const backwardRoute = 'blurb';

	// Variable to track if photo is uploaded
	let photoUploaded = $state(false);

	function handleSuccess() {
		console.log('success');
		photoUploaded = true;
		window.location.reload();
	}
</script>

<SetupNavigation {backwardRoute} canGoBackward={true} canGoForward={false}>
	<section class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
		<BorderedBox>
			<h1 class="font-mont text-lg font-semibold">Last Step, Upload a Profile Photo</h1>

			<div class="flex flex-col items-center justify-center">
				<ProfilePhotoUpload
					profile_photo_uri={data.profile_photo_uri}
					isOwnProfile={true}
					onSuccess={handleSuccess}
				/>
			</div>
			{#if data.profile_photo_uri !== undefined || photoUploaded}
				<div class="flex flex-col items-center justify-center">
					<a
						data-sveltekit-preload-data
						href="/you"
						class="text-center my-2 border-slate-800 border-2 rounded-md w-full py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
						>All done!</a
					>
				</div>
			{/if}
		</BorderedBox>
	</section>
</SetupNavigation>
