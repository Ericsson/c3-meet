/* eslint-env node */
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    meet: './src/meet.js',
  },
  output: {
    path: './dist',
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.png$/,
        loader: 'url-loader?name=images/[name].[ext]',
      },
      {
        test: /\.ttf$/,
        loader: 'url-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: ['style', 'css', 'sass'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'meet',
      template: 'html!./src/index.html',
      inject: false,
    }),
  ],
}
