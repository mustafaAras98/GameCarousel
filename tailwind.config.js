const {Colors} = require('./src/Constants/Colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/App.{js,jsx,ts,tsx}',
    './src/Components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        //LightThemeColors
        lighttext: Colors.LightTheme.text,
        lightbackground: Colors.LightTheme.background,
        lightprimary: Colors.LightTheme.primary,
        lightsecondary: Colors.LightTheme.secondary,
        lightaccent: Colors.LightTheme.accent,

        //DarkThemeColors
        darktext: Colors.DarkTheme.text,
        darkbackground: Colors.DarkTheme.background,
        darkprimary: Colors.DarkTheme.primary,
        darksecondary: Colors.DarkTheme.secondary,
        darkaccent: Colors.DarkTheme.accent,
      },
    },
  },
  plugins: [],
};
