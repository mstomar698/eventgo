/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(223, 13%, 79%)',
        secondary: 'hsl(214, 5%, 31%)',
        tertiary: 'hsl(223, 18%, 39%)',
        active: 'hsl(204, 58%, 39%)',
      },
    },
    backgroundImage: {
      'hero-pattern': "url('/back.png')",
      'main-pattern': "url('/back2.png')",
    },
  },
  plugins: [],
};
