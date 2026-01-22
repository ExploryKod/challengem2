/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  darkMode: 'class',
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: {
            primary: '#1E1E2E',
            secondary: '#1A1A2E',
            card: '#252538',
          },
          gold: {
            DEFAULT: '#D4AF37',
            muted: 'rgba(212, 175, 55, 0.7)',
            border: 'rgba(212, 175, 55, 0.3)',
            glow: 'rgba(212, 175, 55, 0.2)',
          },
          text: {
            primary: '#FAF3E0',
            secondary: 'rgba(250, 243, 224, 0.7)',
          },
          rose: {
            DEFAULT: '#8B3A4A',
            hover: '#9B4A5A',
          },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
        display: ['var(--font-oswald)']
      },
      screens: {
        'xs': '375px',
        // sm: 640px (default Tailwind)
        // md: 768px (default Tailwind)
        // lg: 1024px (default Tailwind)
        // xl: 1280px (default Tailwind)
        // 2xl: 1536px (default Tailwind)
      },
      spaces: {
        
      },
      keyframes: {
        'fade-in-down': {
          '0%': {
            opacity: '0.3',
            transform: 'translateY(-30px)'},
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'}
          },
      },
      animation: {
        'fade-in-down': 'fade-in-down 1s ease-out 1'
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
};

// module.exports = {
//   purge: {
//     enabled: process.env.NODE_ENV === 'production',
//     content: [
//       './src/**/*.{js,ts,jsx,tsx}',
//     ],
//     options: {
//       safelist: [],
//     },
//   },

//   darkMode: `class`
// };