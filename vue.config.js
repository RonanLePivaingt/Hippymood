// vue.config.js
const ConfigWebpackPlugin = require("config-webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new ConfigWebpackPlugin()
    ],
    devServer: {
      https: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8087',
          secure: false
        }
      }
    }
  }
}
