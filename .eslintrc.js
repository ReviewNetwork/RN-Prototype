module.exports = {
  "extends": ["airbnb", "plugin:react/recommended"],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "es6": true
  },
  "plugins": [
    "react"
  ],
  "rules": {
      "linebreak-style": 0,
      "arrow-parens": 0,
      "global-require": 0,
      "no-alert": 0,
      "no-console": 0,
      "import/no-unresolved": 1,
      "react/forbid-prop-types" : 0,
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/react-in-jsx-scope": "off",
      "react/no-access-state-in-setstate": 'error',
      "react/display-name": "off",
      "react/jsx-max-props-per-line": ["error", { "maximum": 1, "when": "multiline" }],
      "import/no-extraneous-dependencies": 0,
      "react/prop-types": 1,
      "object-curly-newline": 0,
      "class-methods-use-this": 0,
      "react/prefer-stateless-function": 0,
      "react/prop-types": ["error", { "ignore": ["navigation"] }],

  }
}
