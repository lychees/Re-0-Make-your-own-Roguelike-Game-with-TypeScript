const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "none",

  entry: [
    path.resolve(__dirname, "src/main.ts"),
    path.resolve(__dirname, "style/style.css"),
    path.resolve(__dirname, "style/menu.css"),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  resolve: {
    extensions: [".ts", ".js"],
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
      },
      {
        test: /\.(gif|jpg|png|mp3|aac|ogg)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }      
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
    new CopyPlugin([{
      from: path.resolve(__dirname, "assets/**/*"),
      to: '[path][name].[ext]',
    }]),
  ],

  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    host: "127.0.0.1",
    port: 9000
  },
};
