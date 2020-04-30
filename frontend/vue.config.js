const webpack = require('webpack')
const config = require('config')
const frontendApiProxy = config.frontend.apiProxy
const musicProxy = config.frontend.musicProxy

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({ CONFIG: JSON.stringify(require('config')) })
    ],
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    proxy: {
      '/api': frontendApiProxy,
      '/music': musicProxy
    }
  }
}
