const {resolve} = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const webpackValidator = require('webpack-validator')
const {getIfUtils, removeEmpty} = require('webpack-config-utils')
const OfflinePlugin = require('offline-plugin')

module.exports = env => {
  const {ifProd, ifNotProd} = getIfUtils(env)
  return webpackValidator({
    context: resolve('src'),
    entry: {
      app: './bootstrap.js',
      vendor: ['todomvc-app-css/index.css'],
    },
    output: {
      filename: ifProd('bundle.[name].[chunkhash].js', 'bundle.[name].js'),
      path: resolve('dist'),
      pathinfo: ifNotProd(),
    },
    devtool: ifProd('source-map', 'eval'),
    module: {
      loaders: [
        {test: /\.js$/, loaders: ['babel'], exclude: /node_modules/},
        {test: /\.css$/, loaders: ['style', 'css']},
      ],
    },
    plugins: removeEmpty([
      new webpack.ProgressPlugin({
        profile: ifProd(),
      }),
      ifProd(new InlineManifestWebpackPlugin()),
      ifProd(new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
      })),
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'head',
      }),
      new OfflinePlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: ifProd('"production"', '"development"')
        }
      }),
    ]),
  })
}
