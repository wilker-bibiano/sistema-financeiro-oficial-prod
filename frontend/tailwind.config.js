/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        mint: "#3b8b72",
        coral: "#d95f4f",
        paper: "#f8faf7"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 33, 31, 0.08)"
      }
    }
  },
  plugins: []
};
