/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EE",
        ink: "#14161F",
        indigo: {
          DEFAULT: "#3634E0",
          dark: "#211FA8",
        },
        amber: "#F2A93B",
        sage: "#0E9E8E",
        line: "#E4E0D6",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}

