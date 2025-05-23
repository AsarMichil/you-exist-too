<script>
	import { page } from '$app/stores';
	import { Mail, CheckCircle, RefreshCw } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { user } = data;

	// Get user's email from URL params or user data
	const email = $page.url.searchParams.get('email') || user?.email || 'your email';
</script>

<svelte:head>
	<title>Verify Your Email - You Exist</title>
</svelte:head>

<div class="flex flex-col h-full w-full dark:text-white">
	<!-- Header -->
	<h1
		class="mx-auto text-center font-gar text-5xl mt-12 mb-8 hover:text-brownish-500 dark:hover:text-brownish-200 transition-colors duration-200"
	>
		<a href="/">You Exist.</a>
	</h1>

	<!-- Main content card -->
	<div
		class="rounded xs:border xs:border-slate-700 dark:xs:border-white px-6 py-8 mb-5 max-w-lg mx-auto w-full"
	>
		<!-- Icon and title -->
		<div class="flex flex-col items-center mb-6">
			<div class="relative mb-4">
				<Mail size={64} class="text-brownish-800 dark:text-white" />
				<CheckCircle
					size={24}
					class="absolute -bottom-1 -right-1 text-brownish-600 dark:text-brownish-300 bg-white dark:bg-brownish-900 rounded-full"
				/>
			</div>
			<h2 class="text-3xl font-gar text-center mb-2">Check Your Email</h2>
			<p class="text-sm text-brownish-600 dark:text-slate-100 text-center">
				We've sent a verification link to your inbox
			</p>
		</div>

		<!-- Main message -->
		<div class="space-y-4 text-center font-mont mb-6">
			<div
				class="bg-forestgreen-400/10 dark:bg-forestgreen-400/20 rounded-lg p-4 border border-forestgreen-400/20"
			>
				<p class="text-forestgreen-700 dark:text-white font-medium mb-2">Email sent to:</p>
				<p class="text-lg font-semibold text-forestgreen-800 dark:text-forestgreen-200 break-all">
					{email}
				</p>
			</div>

			<div class="text-left space-y-3 text-brownish-800 dark:text-slate-100">
				<div class="flex items-start gap-3">
					<p><strong>Check your inbox</strong> for an email from You Exist</p>
				</div>
				<div class="flex items-start gap-3">
					<p><strong>Click the verification link</strong> in the email</p>
				</div>
			</div>
		</div>

		<!-- Help section -->
		<div class="border-t border-brownish-200 dark:border-slate-100 pt-4">
			<p class="text-sm text-brownish-600 dark:text-slate-100 mb-3">Don't see the email?</p>
			<div class="text-xs text-brownish-500 dark:text-brownish-100 space-y-1">
				<p>• Check your spam or junk folder</p>
				<p>• Make sure you entered the correct email address</p>
				<p>• The email may take a few minutes to arrive</p>
			</div>
		</div>
	</div>

	<!-- Footer message -->
	<div class="text-center mb-8 max-w-lg mx-auto">
		<p class="text-brownish-600 dark:text-brownish-400 font-mont text-sm">
			Need help? Email Asar at
			<a
				href="mailto:asar@michils.com"
				class="text-forestgreen-700 dark:text-forestgreen-400 underline hocus:text-forestgreen-500"
			>
				asar@michils.com
			</a>
			for help.
		</p>
	</div>
</div>
