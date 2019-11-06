const webpack = require("webpack");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({ CONFIG: JSON.stringify(require("config")) })
    ]
  },
  devServer: {
    disableHostCheck: true
  }
}
