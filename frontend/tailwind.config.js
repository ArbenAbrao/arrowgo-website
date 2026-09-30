/** Colors sampled from the Arrowgo logo. Swap in the official brand values if they differ. */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1a3594",  // wordmark blue
          blue: "#2350d0",  // logo gradient blue
          green: "#3f9a24", // "moving excellence!" green
          mist: "#eef3ff",  // light tint for backgrounds
          ink: "#1c2540",   // body text
        },
      },
      fontFamily: {
        sans: ["Questrial", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};