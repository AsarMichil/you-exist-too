<script lang="ts">
	import ProfilePhotoUpload from '$lib/components/ProfilePhotoUpload.svelte';
	import { flagEmoji } from '$lib/icons/FlagIcon';
	import { Dialog, Separator } from 'bits-ui';
	import { X } from 'lucide-svelte';

	let { data, children } = $props();
	let person = $derived(data.props?.person);
	let profile_photo_uri = $derived(data.props?.profile_photo_uri);
	let isOwnProfile = $derived(!!data.props?.own);
	let openProfilePhotoUpload = $state(false);
</script>

<div class="flex flex-col w-full h-full dark:text-white">
	<h1 class="inline-flex gap-2 items-center mx-auto text-center font-gar text-5xl mt-20 mb-6">
		{person?.preferred_name ?? person?.given_name}
		{#if person?.family_name}
			{person?.family_name}
		{/if}
		{#if person?.country}
			{flagEmoji(person?.country)}
		{/if}
	</h1>
	<div
		class="space-y-4 rounded xs:border xs:border-slate-700 dark:xs:border-white p-6 mb-5 max-w-lg mx-auto xs:w-9/12"
	>
		<button onclick={() => (openProfilePhotoUpload = true)}>
			<img
				src={profile_photo_uri}
				alt="avatar"
				class="rounded-full w-32 h-32 mx-auto border-4 border-slate-800 dark:border-white cursor-pointer"
			/>
		</button>

		<h2 class="font-mont">
			{person?.blurb}
		</h2>

		{#if isOwnProfile}
			<div>
				<a
					data-sveltekit-preload-data="hover"
					href="/you/{person?.username}/edit"
					class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				>
					Edit Profile
				</a>
			</div>
		{/if}
	</div>
</div>
{@render children()}

<!-- Profile photo upload component for the modal -->
<Dialog.Root bind:open={openProfilePhotoUpload}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 bg-black/80" />
		<Dialog.Content
			onInteractOutside={(e) => {
				e.preventDefault();
				openProfilePhotoUpload = false;
			}}
			class="fixed left-[50%] top-[45%] w-full max-w-[80vw] min-h-[40vh] translate-x-[-50%] translate-y-[-50%] border border-slate-800 dark:border-white p-5 sm:max-w-lg md:w-full rounded-lg shadow bg-inherit dark:text-white"
		>
			<Dialog.Title class="text-lg font-mont">
				{#if isOwnProfile}
					Upload Profile Photo
				{:else}
					{person?.preferred_name ?? person?.given_name}
				{/if}
			</Dialog.Title>
			<Separator.Root class="bg-slate-800 dark:bg-white -mx-5 mb-6 mt-5 block h-px" />
			<ProfilePhotoUpload
				{profile_photo_uri}
				{isOwnProfile}
				onSuccess={() => {
					window.location.reload();
				}}
			/>
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
