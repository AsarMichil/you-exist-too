<script lang="ts">
	import { Label } from 'bits-ui';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface TextareaProps extends HTMLTextareaAttributes {
		label: string;
		error?: string[] | undefined;
	}

	let {
		class: className,
		value = $bindable(),
		name,
		label,
		error,
		...other
	}: TextareaProps = $props();
</script>

<div class={className}>
	<div class="relative w-full pt-5">
		<textarea
			{name}
			{...other}
			aria-invalid={error ? 'true' : undefined}
			class="text-sm pt-3 pb-1 px-3 rounded border w-full bg-inherit border-slate-800 p-2 focus:outline-none dark:border-white dark:focus:border-forestgreen-700 outline-none focus:border-forestgreen-700 focus:ring-2 focus:ring-forestgreen-700 peer resize-none"
			placeholder=" "
			bind:value
		>
		</textarea><br />
		<Label.Root
			id={name + '-label'}
			for={name}
			class="dark:peer-autofill:text-black font-mont absolute -top-2 left-0"
		>
			{label}</Label.Root
		>
	</div>
</div>
