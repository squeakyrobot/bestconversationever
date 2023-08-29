import * as defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    screens: {
      'xs': '380px',
      ...defaultTheme.screens,
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ['dracula'],
  },
}

