const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const SUPPORTED_BROWSERS = require('../config/supportedBrowsers');

const cssConfig = isModules => ([
  {
    loader: 'css-loader',
    options: {
      modules: isModules,
      importLoaders: 2,
      localIdentName: '[name]__[local]___[hash:base64:5]',
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      plugins: () => [  // eslint-disable-next-line global-require
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: SUPPORTED_BROWSERS,
          // Drop ie 8 flexbox support
          // see: https://github.com/facebookincubator/create-react-app/pull/1771
          flexbox: 'no-2009',
        }),
      ],
    },
  },
  'sass-loader',
]);

/**
 * Enables importing CSS with Javascript. This is all in-memory.
 *
 * @see https://survivejs.com/webpack/styling/loading/
 */
exports.loadCSS = ({ include, exclude, isCSSModules = false } = {}) => ({
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        include,
        exclude,

        use: [].concat('style-loader', cssConfig(isCSSModules)),
      },
    ],
  },
});

/**
 * Extracts css into their own file.
 *
 * @see https://webpack.js.org/guides/code-splitting-css/
 * @see https://survivejs.com/webpack/styling/separating-css/
 */
exports.extractCSS = ({ include, exclude, isCSSModules = false } = {}) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin('[name].[chunkhash].css');

  return {
    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          include,
          exclude,

          use: plugin.extract({
            use: cssConfig(isCSSModules),
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [plugin],
  };
};

/**
 * Minifies CSS to make it super small.
 *
 * @see https://survivejs.com/webpack/optimizing/minifying/#minifying-css
 */
exports.minifyCSS = ({ options }) => ({
  plugins: [
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: options,
      canPrint: false,
    }),
  ],
});

/**
 * Some libraries import Node modules but don't use them in the browser.
 * Tell Webpack to provide empty mocks for them so importing them works.
 *
 * @see https://webpack.js.org/configuration/node/#node
 */
exports.mockNode = () => ({
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
});
