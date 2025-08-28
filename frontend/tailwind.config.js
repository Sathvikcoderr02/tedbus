/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./projects/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#d84e55',
          dark: '#e57373',
        },
        background: {
          light: '#ffffff',
          dark: '#121212',
        },
        surface: {
          light: '#f8f9fa',
          dark: '#1e1e1e',
        },
        text: {
          light: '#333333',
          dark: '#e0e0e0',
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/assets/hero-img.png')",
      },
    },
  },
  plugins: [],
}