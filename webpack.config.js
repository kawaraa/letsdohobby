module.exports = {
  entry: ["babel-polyfill", "./client/react/app.js"],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env", "@babel/preset-react"] },
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  output: { path: __dirname + "/client/public", filename: "bundle.js" },
  resolve: { extensions: ["*", ".js", ".jsx"] },

  // optimizing options to build miner bundled file for production
  /*
    plugins: [
      require("rollup-plugin-replace")({ "process.env.NODE_ENV": JSON.stringify("production") }),
      require("rollup-plugin-commonjs")(),
      require("rollup-plugin-terser")(),
    ],
    "rollup-plugin-commonjs": "^10.1.0",
    "rollup-plugin-replace": "^2.2.0",
    "rollup-plugin-terser": "^6.0.1",
   */
};
