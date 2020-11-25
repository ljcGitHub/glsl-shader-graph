'use strict'
const path = require('path')
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  css: {
    extract: { ignoreOrder: true },
  },
  devServer: {
    port: 8888
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'cheap-module-eval-source-map'
    }
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'base': resolve('src/base'),
        'common': resolve('src/common'),
        'components': resolve('src/components'),
      },
      plugins: [
        new DirectoryNamedWebpackPlugin()
      ]
    }
  }
}
