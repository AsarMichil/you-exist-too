<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import ErrorTag from '$lib/components/ErrorTag.svelte';
	import Input from '$lib/components/Input.svelte';
	import ProfilePhotoUpload from '$lib/components/ProfilePhotoUpload.svelte';
	import { superForm } from 'sveltekit-superforms';

	let { data } = $props();
	// const { form, errors, enhance } = superForm(data.form);
</script>

<section class="flex flex-col w-full h-full justify-center items-center p-4 space-y-4">
	<BorderedBox>
		<h1 class="font-mont text-lg font-semibold">Last Step, Upload a Profile Photo</h1>

		<div class="flex flex-col items-center justify-center">
			<ProfilePhotoUpload
				profile_photo_uri={data.profile_photo_uri}
				isOwnProfile={true}
				onSuccess={() => {
					console.log('success');
					window.location.reload();
					// window.location.href = '/setup/blurb';
				}}
			/>
		</div>
	</BorderedBox>
</section>
