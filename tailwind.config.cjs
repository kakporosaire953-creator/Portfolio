/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        accentBlue: '#0066ff',
        warmOrange: '#ff8800',
        foreground: '#eaeaea',
        glass: 'rgba(255, 255, 255, 0.08)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  plugins: [
    // No extra plugins needed for now; custom utilities can be added via @layer utilities in CSS
  ],
};
