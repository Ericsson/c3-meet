/*
Copyright 2016 Ericsson AB.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/* eslint-env node */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')
const webpack = require('webpack')

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
    new webpack.BannerPlugin(fs.readFileSync('./LICENSE', 'utf-8')),
  ],
}
