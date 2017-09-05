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
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const AutoPrefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

function getVersion() {
  let version = require('./package').version
  let getCommitHash = require('child_process').spawnSync('git', ['rev-parse', 'HEAD'])
  let commit = getCommitHash.stdout.toString().replace(/[^0-9a-f]/g, '')

  let dirtyCheck = require('child_process').spawnSync('git', ['diff-index', '--quiet', 'HEAD', '--'])
  let isDirty = dirtyCheck.status !== 0

  if (isDirty) {
    commit += '-dirty'
  }
  return {commit, version}
}

// Entry

var entry = path.join(__dirname, 'src')

if (isDev) {
  entry = [
    'react-hot-loader/patch',
    entry,
  ]
}

// Rules

const rules = []

rules.push({
  test: /\.(jpe?g|png|gif|svg|eot|ttf|woff2?)$/,
  use: [
    {loader: 'url-loader', options: {
      limit: 10000,
      name: '[name].[hash:16].[ext]',
    }},
  ],
})

rules.push({
  test: /\.(js)$/,
  include: path.join(__dirname, 'src'),
  use: [
    {loader: 'babel-loader', options: {
      cacheDirectory: true,
    }},
    {loader: 'eslint-loader', options: {
      emitWarning: true,
    }},
  ],
})

const cssProcessors = [
  {loader: 'css-loader', options: {
    modules: true,
  }},
  {loader: 'postcss-loader', options: {
    plugins: [
      AutoPrefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'], // From create-ract-app
        cascade: true,
        remove: true,
      }),
    ],
  }},
]

if (isDev) {
  rules.push({
    test: /\.css$/,
    use: [
      {loader: 'style-loader'},
      ...cssProcessors,
    ],
    include: path.join(__dirname, 'src'),
  })
  rules.push({
    test: /\.css$/,
    use: [
      {loader: 'style-loader'},
      {loader: 'css-loader'},
    ],
    exclude: path.join(__dirname, 'src'),
  })
}

if (isProd) {
  rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract(cssProcessors),
    include: path.join(__dirname, 'src'),
  })
  rules.push({
    test: /\.css$/,
    use: ExtractTextPlugin.extract({loader: 'css-loader'}),
    exclude: path.join(__dirname, 'src'),
  })
}

// Plugins

const plugins = []

plugins.push(new webpack.NamedModulesPlugin())
plugins.push(new HtmlWebpackPlugin({title: 'Ericsson C3 Meet', hash: true}))
plugins.push(new webpack.DefinePlugin({'process.env.VERSION': JSON.stringify(getVersion())}))

if (isDev) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
}

if (isProd) {
  plugins.push(new ExtractTextPlugin('bundle.css'))
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      screw_ie8: true,
      warnings: false,
    },
    mangle: {
      screw_ie8: true,
    },
    output: {
      comments: false,
      screw_ie8: true,
    },
  }))
  plugins.push(new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.html|\.css|\.eot|\.svg|\.ttf$/, /* no point gzipping woff and woff2 */
    threshold: 1024,
    minRatio: 0.8,
  }))
}

module.exports = {
  devtool: isDev ? 'eval-cheap-module-source-map' : false,
  context: __dirname,
  entry,
  devServer: {
    hot: true,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '',
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      actions: path.resolve(__dirname, 'src/actions/'),
      components: path.resolve(__dirname, 'src/components/'),
      containers: path.resolve(__dirname, 'src/containers/'),
      images: path.resolve(__dirname, 'src/images/'),
      modules: path.resolve(__dirname, 'src/modules/'),
      reducers: path.resolve(__dirname, 'src/reducers/'),
      store: path.resolve(__dirname, 'src/store/'),
    },
  },
  module: {
    rules,
  },
  plugins,
}
