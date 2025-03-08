<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import FlagIcon from '$lib/components/FlagIcon.svelte';
	import { flagEmoji } from '$lib/icons/FlagIcon';
	import ICanada from '$lib/icons/I_Canada.svelte';
	import IUs from '$lib/icons/I_US.svelte';
	import type { PageData } from './$types';
	import ProfileModal from './ProfileModal.svelte';
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

	let url = $page.url.pathname;
	let { data, form }: { data: PageData; form: FormData } = $props();
	// let userId = $derived(data.props.user.id);
	// console.log(userId);
	let person = $derived(data.props?.person);
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

<ProfileModal bind:toggled={profile_photo} {form}></ProfileModal>

<div class="text-column">
	<!-- Your account {url.split('/')[2]} -->
	<!-- {JSON.stringify(person?)} -->
</div>
<div class="flex flex-col w-full h-full dark:text-white">
	<h1 class="inline-flex gap-2 items-center mx-auto text-center font-gar text-5xl mt-20 mb-6">
		{person?.preferred_name ?? person?.given_name}
		{#if person?.family_name}
			{person?.family_name}
		{/if}
		<!-- <FlagIcon country={person?.country} /> -->
		{#if person?.country}
			{flagEmoji(person?.country)}
		{/if}
	</h1>
	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white p-6 mb-5 max-w-lg mx-auto xs:w-9/12"
	>
		<div>
			<img
				src={data.props?.profile_photo_uri}
				alt="avatar"
				class="rounded-full w-32 h-32 mx-auto mb-4 border-4 border-white"
			/>
		</div>

		<h2 class="mx-auto font-mont mt-4 mb-2 w-9/12">
			{person?.blurb}
		</h2>
		<div></div>
		{#if data.props?.own}
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
		{/if}
	</div>

	<!-- <div class="text-center mb-5 max-w-96 mx-auto">Or</div>
	<div
		class="w-full border-0 xs:border xs:border-black dark:xs:border-white rounded p-3 mx-auto text-center max-w-96"
	>
		<div>Have an account? - <a href="/login" class="font-bold">Log in</a></div>
	</div> -->
</div>
