const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(__dirname, 'app/src');
const binDir = path.resolve(__dirname, 'app/bin');
const nodeModDir = path.resolve(__dirname, 'node_modules');

const config = {
  entry: {
    bundle: ['babel-polyfill', path.resolve(srcDir, 'index.jsx')],
  },
  output: {
    path: binDir,
    filename: '[name].[hash].min.js',
    publicPath: '/',
  },
  resolve: {
    modules: [rootDir, nodeModDir],
    extensions: ['.js', '.jsx'],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(css)$/,
        use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  devServer: {
    hot: true,
    historyApiFallback: true,
  },
  optimization: {
    runtimeChunk: false,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          compress: {
            warnings: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['app/bin']),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      path: binDir,
      filename: 'styles.[hash].css',
      publicPath: '/',
    }),
    new HtmlWebpackPlugin({
      title: 'DynaLogic',
      template: path.resolve(srcDir, 'index.html'),
      favicon: path.resolve(srcDir, 'Images/favicon.ico'),
    }),
  ],
};

module.exports = config;
