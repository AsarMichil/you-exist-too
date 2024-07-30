<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { scale } from 'svelte/transition';
	import ProfileModal from './ProfileModal.svelte';
	let url = $page.url.pathname;
	console.log(url);
	let { data, form } = $props();
	let mock1 = {
		props: {
			person: {
				preferred_name: 'John',
				given_name: 'Doe',
				family_name: 'Smith',
				email: 'pacer@asarmichil.com'
			}
		}
	};
	let uploading = $state(false);
	let editing = $state(false);
	let profile_photo = $state(false);
</script>

{#if editing}
	<div
		class="absolute w-screen h-screen bg-black bg-opacity-50 right-0 flex flex-row justify-center items-center"
	>
		<!-- Modal -->
		<div class="relative w-5/6 h-5/6 bg-cream-200 dark:bg-stone-900 border-2 rounded-lg px-6 py-4">
			<h2 class="text-3xl">Edit your profile</h2>
			<div></div>

			<button
				class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
				onclick={() => {
					editing = false;
				}}>Close</button
			>
		</div>

		<!-- Modal End -->
	</div>
{/if}

<ProfileModal bind:toggled={profile_photo} form={form}></ProfileModal>

<div class="text-column">
	Your account {url.split('/')[2]}
	<!-- {JSON.stringify(data.props?.person)} -->
</div>

<div class="flex flex-col w-full h-full dark:text-white">
	<h1 class="mx-auto text-center font-gar text-5xl mt-20 mb-6">
		{mock1.props?.person.preferred_name || mock1.props?.person.given_name}
		{mock1.props?.person.family_name}
	</h1>
	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white px-4 pb-4 mb-5 max-w-96 mx-auto w-full"
	>
		<div>
			<img
				src={data.props?.profile_photo_uri}
				alt="avatar"
				class="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white"
			/>
		</div>

		<h2 class="mx-auto text-center font-mont mt-4 mb-2">Hehe</h2>
		<button
			class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
			onclick={() => {
				editing = true;
			}}
		>
			Edit Profile
		</button>
		<button
			class="border-slate-800 border-2 rounded-md py-2 px-3 hover:bg-forestgreen-400 active:bg-forestgreen-700 dark:hover:bg-forestgreen-400 dark:active:bg-forestgreen-700 dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700"
			onclick={() => {
				profile_photo = true;
			}}
		>
			Profile Photo
		</button>
	</div>

	<!-- <div class="text-center mb-5 max-w-96 mx-auto">Or</div>
	<div
		class="w-full border-0 xs:border xs:border-black dark:xs:border-white rounded p-3 mx-auto text-center max-w-96"
	>
		<div>Have an account? - <a href="/login" class="font-bold">Log in</a></div>
	</div> -->
</div>
