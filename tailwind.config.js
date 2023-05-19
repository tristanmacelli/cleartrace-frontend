module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js}"],
  media: false, // or 'darkMode' or 'class'
  theme: {
    extend: {
      width: {
        112: "28rem",
        160: "40rem",
        200: "50rem",
        300: "75rem",
      },
      screens: {
        xs: "460px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
