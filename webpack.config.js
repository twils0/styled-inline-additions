const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const rootDir = path.resolve(__dirname);
const srcDir = path.resolve(__dirname, 'src');
const binDir = path.resolve(__dirname, 'bin');
const nodeModDir = path.resolve(__dirname, 'node_modules');

const config = {
  entry: {
    bundle: path.resolve(srcDir, 'inlineAdditions.js'),
  },
  output: {
    path: binDir,
    filename: 'styled-inline-additions.min.js',
    libraryTarget: 'umd',
    library: 'default',
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
    ],
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
        uglifyOptions: {
          compress: {
            warnings: false,
          },
        },
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin([binDir]),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new BundleAnalyzerPlugin(),
  ],
};

module.exports = config;
