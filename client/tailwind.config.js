const { Heading } = require('lucide-react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
         sans: ['Inter', 'system-ui', 'sans-serif'],
         nav: ['manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        heading: ['Inter', 'sans-serif'],
        serif: ['Inter', 'sans-serif'],
        'serif-book': ['Inter', 'sans-serif'],
        'serif-cormorant': ['Inter', 'sans-serif'],
        handwritten: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '8xl': '6rem',
        '9xl': '8rem',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'wider': '0.1em',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },
  plugins: [],
}
