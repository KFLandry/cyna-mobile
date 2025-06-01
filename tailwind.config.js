/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}", // Inclure tous les fichiers dans le dossier app
    "./components/**/*.{js,jsx,ts,tsx}", // Inclure tous les fichiers dans le dossier components
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
