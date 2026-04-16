/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        steel: '#1e293b',
        brass: '#c08a2d',
        moss: '#4b6b3c',
        sand: '#f4f1e8',
      },
      boxShadow: {
        panel: '0 18px 45px rgba(15, 23, 42, 0.18)',
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at top, rgba(192,138,45,0.18), transparent 45%), linear-gradient(180deg, rgba(15,23,42,1), rgba(30,41,59,1))',
      },
    },
  },
  plugins: [],
};
