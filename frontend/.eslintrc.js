const rules = {
  "spaced-comment": "off",
  "react/prop-types": "off"
};

module.exports = {
  extends: ["airbnb-typescript", "plugin:@typescript-eslint/recommended", "prettier"],
  rules,
  env: {
    browser: true,
    commonjs: true,
    node: false,
    jest: true,
    es6: true
  },
  plugins: [
    "@blueprintjs"
  ],
  parserOptions: {
    project: "./tsconfig.json"
  }
};
