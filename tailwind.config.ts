import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    "bg-stone-300",
    "bg-cyan-800",
    "bg-amber-400",
    "bg-pink-500",
    "bg-amber-600",
    "bg-orange-600",
    "bg-lime-400",
    "bg-yellow-300",
    "bg-gray-400",
    "bg-purple-400",
    "bg-sky-500"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      changa: ["Changa", "sans-serif"],
      rye:["Rye", "sans-serif"],
      josefin:["'Josefin Sans'", "sans-sefif"],
    }
  },
  plugins: [],
}
export default config
