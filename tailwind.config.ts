import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				brownish: {
					100: '#F2EBE9',
					200: '#D6A89C',
					300: '#BA8273',
					400: '#9D6050',
					500: '#814433',
					600: '#652C1D',
					700: '#48190D',
					800: '#330E03',
					900: '#330B00'
				},
				forestgreen: {
					400: '#43917A',
					500: '#226C56',
					700: '#0D4837'
				},
				cream: {
					200: '#F3ECE9'
				}
			},
			screens: {
				xs: '450px'
			}
		},
		fontFamily: {
			sans: ['"Open Sans"'],
			mont: ['"Montserrat"'],
			gar: ["'EB Garamond'"]
		}
	},
	darkMode: 'class',
	plugins: [
		plugin(function ({ addVariant }) {
			addVariant('hocus', ['&:hover', '&:focus']);
		})
	]
} satisfies Config;
