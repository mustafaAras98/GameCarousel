const {Colors} = require('./src/Constants/Colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/App.{js,jsx,ts,tsx}',
    './src/Components/**/*.{js,jsx,ts,tsx}',
    './src/Screens/**/*.{js,jsx,ts,tsx}',
    './src/Navigation/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        lighttext: Colors.LightTheme.Text,
        lightbg: Colors.LightTheme.Background,
        lightprimary: Colors.LightTheme.Primary,
        lightsecondary: Colors.LightTheme.Secondary,
        lightaccent: Colors.LightTheme.Accent,
        darktext: Colors.DarkTheme.Text,
        darkbg: Colors.DarkTheme.Background,
        darkprimary: Colors.DarkTheme.Primary,
        darksecondary: Colors.DarkTheme.Secondary,
        darkaccent: Colors.DarkTheme.Accent,
      },
    },
  },
  plugins: [],
};
