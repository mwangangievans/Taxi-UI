/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html, ts}",
    "./node_modules/flowbite/**/*.js"
  ],
 
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      
      colors: {
        'green_': '#017873',
        'green_lighter': '#50A29E',
        'green_lighter_2': '#DEEDED',
        'green_lighter_3': '#EBF9F1',
        'yellow_': '#FBBE4B',
        'yellow_lighter': '#F2EADB',
        'white_': '#FFFFFF',
        'gray_': '#F0F0F0',
        'text_gray': '#B2BEBE',
        'danger_': '#A30D11',




      },
      fontFamily: {
        sans: ['Public Sans', 'sans-serif'],
      },
      fontWeight: {
        'amy-extra-bold': 900
      },
      backgroundImage: {
        'track-bg': "url('src/assets/images/track.png')",
        'contact-bg': "url(src/assets/images/packaging.jpg)",
        'track-mobile-bg': "url(src/assets/images/track_mobile.png)",
        'landing-bg': "url(src/assets/img/landing.jpg)",
        'landing-dark-bg': "url(src/assets/img/landing_dark.jpg)",
        'wallet-bg': "url(src/assets/img/darkbg.png)",
      }
    },
  },
  plugins: [
        require('flowbite/plugin')
    ]
}
