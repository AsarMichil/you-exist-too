<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components';
	import CountrySelect from '$lib/components/CountrySelect.svelte';
	import Input from '$lib/components/Input.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import type { PageData } from './$types';
	import { X } from '@lucide/svelte';
	import { Dialog, Label, Separator } from 'bits-ui';
	import { superForm } from 'sveltekit-superforms/client';

	let { data }: { data: PageData } = $props();
	const {
		form,
		errors,
		enhance: superEnhance,
		submitting
	} = superForm(data.form, {
		onSubmit: () => {
			return ({ formData, cancel }: { formData: FormData; cancel: () => void }) => {
				// Validation can be done here if needed
				return;
			};
		},
		onResult: ({ result }) => {
			if (result.type === 'redirect') {
				// The form was successful and the server issued a redirect
				// We'll let the browser handle it
			}
		}
	});
	let open = $state(true);
	let deleteConfirmation = $state(false);
	async function deleteProfile() {
		const response = await fetch('/api/profile/delete', {
			method: 'POST',
			body: JSON.stringify({})
		});
		if (response.ok) {
			goto(`/`, { invalidateAll: true });
		}
	}
	function closeDialog(e: Event) {
		e.preventDefault();
		open = false;
		goto(`/you/${page.params.username}`);
	}
</script>

<svelte:head>
	<title>Edit Profile | You Exist Too</title>
</svelte:head>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			onEscapeKeydown={(e) => {
				closeDialog(e);
			}}
			onInteractOutside={(e) => {
				closeDialog(e);
			}}
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[80vw] translate-x-[-50%] translate-y-[-50%] border p-5 sm:max-w-lg md:w-full rounded-lg shadow bg-inherit dark:text-white"
		>
			<Dialog.Title class="text-lg font-mont">Edit Your Profile</Dialog.Title>
			<Separator.Root class="bg-slate-800 dark:bg-white -mx-5 mb-6 mt-5 block h-px" />

			<form method="POST" use:superEnhance class="">
				<div class="mb-4">
					<label for="given_name" class="block mb-2 font-medium">First Name *</label>
					<Input id="given_name" name="given_name" bind:value={$form.given_name} required />
					{#if $errors.given_name}
						<p class="text-red-500 mt-1">{$errors.given_name}</p>
					{/if}
				</div>

				<div class="mb-4">
					<label for="family_name" class="block mb-2 font-medium">Last Name</label>
					<Input id="family_name" name="family_name" bind:value={$form.family_name} />
					{#if $errors.family_name}
						<p class="text-red-500 mt-1">{$errors.family_name}</p>
					{/if}
				</div>

				<div class="mb-4">
					<label for="preferred_name" class="block mb-2 font-medium">Preferred Name</label>
					<Input id="preferred_name" name="preferred_name" bind:value={$form.preferred_name} />
					{#if $errors.preferred_name}
						<p class="text-red-500 mt-1">{$errors.preferred_name}</p>
					{/if}
				</div>

				<div class="mb-4">
					<label for="blurb" class="block font-medium">Bio (max 200 characters)</label>
					<Textarea id="blurb" name="blurb" bind:value={$form.blurb} rows={4} maxlength={200} />
					{#if $errors.blurb}
						<p class="text-red-500 mt-1">{$errors.blurb}</p>
					{/if}
					<p class="text-sm text-gray-500 mt-1">{$form.blurb?.length || 0}/200</p>
				</div>

				<div class="mb-6">
					<label for="country" class="block mb-2 font-medium">Country</label>
					<CountrySelect
						id="country"
						name="country"
						bind:value={$form.country!}
						class="w-full"
						error={$errors.country ? $errors.country : undefined}
					/>
					{#if $errors.country}
						<p class="text-red-500 mt-1">{$errors.country}</p>
					{/if}
				</div>

				<div class="flex gap-4">
					<button
						type="submit"
						disabled={$submitting}
						class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 disabled:opacity-50"
					>
						{$submitting ? 'Saving...' : 'Save Changes'}
					</button>

					<a
						href={`/you/${page.params.username}`}
						class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-red-400 active:bg-red-700 dark:hover:bg-red-400 dark:active:bg-red-700 dark:border-white dark:focus:border-red-700 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700"
					>
						Cancel
					</a>
				</div>
			</form>
			<hr class="my-4 border-slate-800 dark:border-white" />
			<div class="w-fit">
				<Button colour="red" onclick={() => (deleteConfirmation = true)}>Delete Profile?</Button>
			</div>
			<button
				onclick={(e) => {
					e.preventDefault();
					open = false;
					setTimeout(() => {
						goto(`/you/${page.params.username}`);
					}, 50);
				}}
				class="focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden absolute right-6 top-6 rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
			>
				<div>
					<X class="text-foreground size-5" />
					<span class="sr-only">Close</span>
				</div>
			</button>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<Dialog.Root open={deleteConfirmation}>
	<Dialog.Portal>
		<Dialog.Overlay class="fixed inset-0 z-50 bg-black/80" />
		<Dialog.Content
			class="fixed left-[50%] top-[50%] z-50 w-full max-w-[80vw] translate-x-[-50%] translate-y-[-50%] border p-5 sm:max-w-lg md:w-full rounded-lg shadow bg-inherit dark:text-white"
		>
			<Dialog.Title class="text-lg font-mont">Delete Profile</Dialog.Title>
			<Separator.Root class="bg-slate-800 dark:bg-white -mx-5 mb-6 mt-5 block h-px" />
			<p>Are you sure you want to delete your profile? This action is irreversible.</p>
			<div class="flex gap-4">
				<Button colour="red" onclick={deleteProfile}>Yes, delete my profile</Button>
				<Button onclick={() => (deleteConfirmation = false)}>Cancel</Button>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
