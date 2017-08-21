/**
 * Created by lichuanjing on 2017/6/28.
 */
var path = require('path');
var webpack = require('webpack');
module.exports = {
  //devtool: '#source-map',
  entry: "./src/index",
  output: {
    path: __dirname,
    filename: "./dist/dj-core.js"
  },
  externals: {
    'Promise': 'Promise'
  },
  module: {
    loaders: [
      {
        test: path.join(__dirname, './src/'),    //配置文件目录下的es6文件夹作为js源代码文件夹，所有源代码一定要放在该文件夹下
        loader: 'babel-loader' ,
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      //sourceMap: true
    })
  ]
};