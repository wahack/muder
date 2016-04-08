var webpack = require('webpack');

module.exports = {
  entry: {
    muder: './index.js',
    'test': './test/index.js'
  },
  output: {
    filename: '[name].min.js',
    path: './dist',
    library: 'muder',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['','.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};
