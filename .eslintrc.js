module.exports = {
  root: true,

  parser: "vue-eslint-parser",

  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    exclude: ["node_modules"],
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
