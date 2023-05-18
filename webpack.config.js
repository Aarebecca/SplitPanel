const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, './dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      },
      {
        test: /\.less$/i,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ]
      },
      // {
      //   test: /.wasm$/,
      //   use: ['file-loader'],
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    })
  ],
  // resolve: {
  //   alias: {
  //     'monaco-editor-core': require.resolve('@alipay/e2-editor-core/dist/monaco-compability.esm.js'),
  //   },
  // },
};