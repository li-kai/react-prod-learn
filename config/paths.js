const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const PATHS = {
  root: ROOT_DIR,
  src: path.join(ROOT_DIR, 'src'),
  styles: path.join(ROOT_DIR, 'src', 'styles'),
  dist: path.join(ROOT_DIR, 'dist'),
  public: path.join(ROOT_DIR, 'public'),
  node_modules: path.join(ROOT_DIR, 'node_modules'),
};
PATHS.assets = process.env.NODE_ENV === 'production' ? PATHS.dist : PATHS.public;

module.exports = PATHS;
