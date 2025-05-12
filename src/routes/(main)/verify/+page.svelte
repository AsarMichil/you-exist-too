<script>
	import { page } from '$app/stores';
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import { Mail } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { user } = data;
</script>

<div class="flex flex-col w-full h-full items-center justify-center min-h-[calc(100vh-100px)]">
	<BorderedBox>
		<div class="flex flex-col items-center space-y-6 py-4">
			<Mail size={64} class="text-forestgreen-500" />
			<h1 class="text-3xl font-gar text-center">Verify your email</h1>
			<div class="space-y-2 text-center font-mont">
				<p>We've sent a verification link to your email address.</p>
				<p>Please check your inbox and click the link to verify your account.</p>
			</div>
		</div>
	</BorderedBox>
</div>
