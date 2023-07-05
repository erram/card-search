/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			keyframes: {
				fadeIn: {
					'0%': { scale: '0', opacity: '0' },
					'100%': { scale: '1', opacity: '1' }
				}
			},
			animation: {
				fadeIn: '0.5s fadeIn forwards'
			},
			fontFamily: {
				roboto: ['Roboto', 'sans-serif']
			}
		}
	},
	plugins: []
};

