<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import ProfilePhotoUpload from './ProfilePhotoUpload.svelte';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title
		>{data.props?.person?.preferred_name ?? data.props?.person?.given_name} | You Exist Too</title
	>
</svelte:head>
