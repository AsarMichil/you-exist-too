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
		d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
	/>
</svg>
