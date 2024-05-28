import { onMount } from 'svelte';

export function createTheme() {
	let theme = $state('light');

	onMount(() => {
		if (sessionStorage.getItem('theme')) {
			theme = sessionStorage.getItem('theme') as string;
		} else {
			theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		}
		document.documentElement.classList.remove('light', 'dark');
		document.documentElement.classList.add(theme);
	});
	$effect(() => {
		sessionStorage.setItem('theme', theme);
	});

	// ? $state(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

	return {
		get current() {
			return theme;
		},

		setTheme(newTheme: string) {
			document.documentElement.classList.remove('light', 'dark');
			document.documentElement.classList.add(newTheme);
			theme = newTheme;
		}
	};
}
// toggleTheme() {

//     theme = theme === 'light' ? 'dark' : 'light';
//     $state.theme = theme;
// }
