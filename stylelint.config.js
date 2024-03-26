module.exports = {
  extends: "stylelint-config-standard-scss",
  rules: {
    "value-keyword-case": ["lower", { camelCaseSvgKeywords: true }],
    "font-family-name-quotes": "always-where-required",
    "selector-type-case": "lower",
    "font-family-name-quotes": "always-where-recommended",
  },
};
