const path = require("path");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.config.js");

module.exports = () =>
  merge(commonConfig(), {
    mode: "production",
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.[hash].js",
    },
  });
