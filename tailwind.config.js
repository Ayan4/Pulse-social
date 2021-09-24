module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#00A7F8",
        secondary: "#0A1429"
      },
      screens: {
        xs: "450px"
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
