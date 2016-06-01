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
        loader: 'url-loader?name=dist/images/[namel.[ext]&imit=8192',
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader?name=dist/fonts/[name].[ext]',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'meet',
      template: 'html!./src/index.html',
    }),
  ],
}
