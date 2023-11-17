const rules = {
  // "spaced-comment": "off",
  // "react/prop-types": "off",
  // "@typescript-eslint/no-explicit-any": "off", // disabled because it uses eslint 8
  // "@typescript-eslint/ban-ts-ignore": "off",


};

module.exports = {
  extends: [
    //   "airbnb-typescript",
    // "plugin:@typescript-eslint/recommended",
    // "prettier"
  ],
  rules,
  env: {
    browser: true,
    commonjs: true,
    node: false,
    jest: true,
    es6: true
  },
  parserOptions: {
    project: "./tsconfig.json"
  }
};
