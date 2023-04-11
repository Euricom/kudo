/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'honeycomb': "url('../contents/images/HoneycombPatternEuricomGreen.png')",
      },
      backdropBlur: {
        xs: '2px',
      },
      // daisy-ui is handling the theme colors
      extend: {
        fontFamily: {
          poppins: ['Poppins', 'serif'],
        },
        fontSize: {
          xs: '0.675rem',
          sm: '0.7875rem',
          base: '0.9rem',
          lg: '1.0125rem',
          xl: '1.125rem',
          '2xl': '1.35rem',
          '3xl': '1.6875rem',
          '4xl': '2.025rem',
          '5xl': '2.7rem',
          '6xl': '3.375rem',
          '7xl': '4.05rem',
          '8xl': '4.374rem',
          '9xl': '7.2rem',
        },
        aspectRatio: {
          '3/2': '3 / 2',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        euricom: {
          primary: '#52abc7',
          'primary-focus': '#a3e0f2',
          'primary-content': '#062a30',
          secondary: '#50696e',
          'secondary-focus': '#72878b',
          'secondary-content': '#e6e9ea',
          accent: '#00ff00',
          'accent-focus': '#bffcb5',
          'accent-content': '#062a30',
          neutral: '#062a30',
          'neutral-focus': '#1e3f44',
          'neutral-content': '#e6e9ea',
          'base-content': '#062a30',
          'base-100': '#fff',
          info: '#a3e0f2',
          success: '#bffcb5',
          warning: '#ffe066',
          error: '#ffa8a8',
        },
      },
      {
        euricomDark: {
          primary: '#52abc7',
          'primary-focus': '#a3e0f2',
          'primary-content': '#062a30',
          secondary: '#50696e',
          'secondary-focus': '#72878b',
          'secondary-content': '#e6e9ea',
          accent: '#00ff00',
          'accent-focus': '#bffcb5',
          'accent-content': '#062a30',
          neutral: '#062a30',
          'neutral-focus': '#1e3f44',
          'neutral-content': '#e6e9ea',
          'base-content': '#e6e9ea',
          'base-100': '#062a30',
          info: '#a3e0f2',
          success: '#bffcb5',
          warning: '#ffe066',
          error: '#ffa8a8',
        },
      },
    ],
    darkTheme: "euricomDark",
  },
};
