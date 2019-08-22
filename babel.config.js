module.exports = {
  env: {
    test: {
      presets: ["@babel/env", "@babel/preset-react", "@babel/typescript"],
    },
  },
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
      },
    ],
    "@babel/preset-react",
    "@babel/typescript",
  ],
};
