<script lang="ts">
	import { page } from '$app/stores';
	import ThoughtButton from '$lib/components/ThoughtButton.svelte';
	import type { PageData } from './$types';
	import ProfilePhotoUpload from '../../../lib/components/ProfilePhotoUpload.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title
		>{data.props?.person?.preferred_name ?? data.props?.person?.given_name} | You Exist Too</title
	>
</svelte:head>

<div class="flex flex-col items-center">
	<!-- Add the ThoughtButton component -->
	<ThoughtButton
		username={data.props?.person?.username ?? ''}
		thoughtCount={data.props?.thoughtCount ?? 0}
	/>
</div>
