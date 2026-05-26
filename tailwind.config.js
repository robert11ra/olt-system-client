export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6d8fc0",
        secondary: "#627ea6",
        shadowPrimary: "#334155",
        lightPrimary: "#cbd5e1",
        whitePrimary: "#e1e5ee",
      },
    },
  },
  presets: [require("./src/Sources/medusaPreset.js")],
  plugins: [],
};
