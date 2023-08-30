import * as defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
    screens: {
      'xs': '380px',
      'hover-hover': { 'raw': '(hover: hover)' },
      'hover-none': { 'raw': '(hover: none)' },
      'pointer-coarse': { 'raw': '(pointer: coarse)' },
      'pointer-fine': { 'raw': '(pointer: fine)' },
      'pointer-none': { 'raw': '(pointer: none)' },
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

