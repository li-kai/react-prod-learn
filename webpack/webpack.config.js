const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PATHS = {
  src: path.join(ROOT_DIR, 'src'),
  dist: path.join(ROOT_DIR, 'dist'),
  node_modules: path.join(ROOT_DIR, 'node_modules'),
};

module.exports = {
  entry: path.join(PATHS.src, 'index.js'),
  output: {
    path: PATHS.dist,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: PATHS.src,
      },
    ],
  },
};
