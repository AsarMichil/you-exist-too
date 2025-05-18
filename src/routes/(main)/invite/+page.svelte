<script lang="ts">
	import BorderedBox from '$lib/components/BorderedBox.svelte';
	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import HappyBearModal from '$lib/components/HappyBearModal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();

	const {
		form,
		errors,
		enhance: superEnhance,
		submitting,
		message
	} = superForm(data.form, {
		// onUpdate: ({ form }) => {
		// 	if (form.valid && form.data) {
		// 		// Show success message or redirect if needed
		// 	}
		// }
	});
	$inspect($errors);
</script>

<div class="flex flex-col mt-6">
	<BorderedBox>
		<h1 class="text-2xl font-mont mb-4">Invite Someone</h1>

		<form method="POST" use:superEnhance class="space-y-4">
			<Input
				label="Email or Phone Number"
				id="contactInfo"
				name="contactInfo"
				type="text"
				bind:value={$form.contactInfo}
				error={$errors.contactInfo}
			/>
			<Input
				label="Name"
				id="name"
				name="name"
				type="text"
				bind:value={$form.name}
				placeholder="Enter their name"
				error={$errors.name}
			/>

			<Checkbox
				type="checkbox"
				label="Send Invite Anonymously"
				id="sendAnonymously"
				name="sendAnonymously"
				bind:checked={$form.sendAnonymously}
			/>

			<Button type="submit" disabled={$submitting}>
				{$submitting ? 'Sending...' : 'Send Invite'}
			</Button>
		</form>
	</BorderedBox>
</div>

{#if $message}
	<HappyBearModal open={true} title="Invitation Sent">
		Your invitation has been sent successfully! They'll receive an email with a link to create an account.
	</HappyBearModal>
{/if}
