<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	let {
		class: className,
		fill = 'none',
		viewBox = '0 0 24 24',
		stroke = 'currentColor',
		xmlns = 'http://www.w3.org/2000/svg',
		...other
	}: SVGAttributes<SVGElement> = $props();
</script>

<svg {xmlns} {fill} {viewBox} {stroke} {...other} class={'size-6 ' + className}>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
	/>
</svg>
