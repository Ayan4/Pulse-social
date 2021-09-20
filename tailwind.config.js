module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#EB5A60"
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
