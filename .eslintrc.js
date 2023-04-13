module.exports = {
    env: {
      browser: true,
      es6: true
    },
    extends: ["eslint:recommended", "prettier"],
    parserOptions: {
      sourceType: "module"
    },
    rules: {
        'prettier/prettier': 'error',
      "no-console": "off",
      semi: ["error", "always"],
      quotes: ["error", "single"]
    }
  };