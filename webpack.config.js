const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "none",

  entry: [
    path.resolve(__dirname, "src/main.ts"),
    path.resolve(__dirname, "style/style.css"),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'style'
          },
        }],
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: "127.0.0.1",
    port: 9000
  },
};
