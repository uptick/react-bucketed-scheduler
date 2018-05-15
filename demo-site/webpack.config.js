var path = require('path');

module.exports = {
  entry: './demos.js',
  output: {
    path: __dirname + '/dist',
    filename: 'demos.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                'env',
                'react',
                'stage-0',
              ],
            },
          },
        ],
      },
    ],
  },
};
