module.exports = {
  root: true,

  env: {
    node: true,
  },

  parser: "vue-eslint-parser",

  parserOptions: {
    parser: "@typescript-eslint/parser",
    exclude: ["node_modules"],
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
  },

  plugins: ["prettier", "@typescript-eslint"],

  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/prettier",
    "plugin:prettier/recommended",
    "@vue/typescript",
  ],
};
