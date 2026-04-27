/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Avoid conflicts with MUI — Tailwind applies to utility classes only
  corePlugins: {
    preflight: false,
  },
}
