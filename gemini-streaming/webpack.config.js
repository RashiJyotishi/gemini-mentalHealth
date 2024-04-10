const path = require('path');

module.exports = {
  mode: 'development',
  entry: './your_entry_file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@google/generative-ai": path.resolve(__dirname, 'gemini-streaming/node_modules/@google/generative-ai')
    },
  },
};
