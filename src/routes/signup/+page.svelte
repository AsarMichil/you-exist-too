<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	// Client API:
	import Input from '$lib/components/Input.svelte';
	import type { ActionData, PageData } from './$types';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { z } from 'zod';

	let { data } = $props();
	const {
		form,
		errors,
		message,
		enhance: superEnhance,
		constraints
	} = superForm(data.form, {
		resetForm: false,
		onResult: ({ result }) => {
			// Check if the result contains existingEmail flag
			if (result.type === 'failure' && result.data && 'existingEmail' in result.data) {
				return {
					existingEmail: true
				};
			}
			return {};
		}
	});

	let isSubmitting = $state(false);
	let existingEmail = $state(false);

	function handleResetPassword() {
		goto('/auth/reset-password?email=' + encodeURIComponent($form.email));
	}
</script>

<div class="flex flex-col w-full h-full">
	<h1 class="mx-auto text-center font-gar text-5xl my-6"><a href="/">You Exist.</a></h1>
	<BorderedBox>
		<h2 class="mx-auto text-center font-mont my-3">Create an Account</h2>
		{#if existingEmail}
			<div class="space-y-4">
				<p class="text-center">An account with this email already exists.</p>
				<Button on:click={() => handleResetPassword()}>Reset Password</Button>
				<Button on:click={() => (existingEmail = false)} class="bg-gray-200"
					>Try Different Email</Button
				>
			</div>
		{:else}
			<form method="POST" use:superEnhance class="space-y-4">
				<Input
					type="email"
					name="email"
					id="email"
					label="Email"
					autocomplete="email"
					placeholder=" "
					bind:value={$form.email}
				/>
				{#if $errors.email}
					<p class="text-sm text-red-500">{$errors.email}</p>
				{/if}

				<Input
					type="text"
					name="username"
					id="username"
					autocomplete="username"
					label="Username"
					placeholder=" "
					bind:value={$form.username}
				/>
				{#if $errors.username}
					<p class="text-sm text-red-500">{$errors.username}</p>
				{/if}

				{#if $message && !existingEmail}
					<p class="text-sm text-red-500">{$message}</p>
				{/if}

				<Button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}
						<span class="inline-block animate-spin mr-2">⟳</span>
						Signing Up...
					{:else}
						Sign Up
					{/if}
				</Button>
			</form>
		{/if}
	</BorderedBox>

	<div class="text-center my-5 max-w-96 mx-auto">Or</div>
	<BorderedBox>
		<div class="mx-auto text-center h-full">
			<a href="/login" class="font-bold hocus:text-forestgreen-400">I have an account.</a>
		</div>
	</BorderedBox>
</div>
