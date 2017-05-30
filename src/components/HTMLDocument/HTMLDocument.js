import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import { get, mapValues } from 'lodash/fp';

const processWebpackAssets = mapValues((chunk) => {
  const types = { js: [], css: [] };
  chunk.forEach((asset) => {
    if (asset.endsWith('.js')) {
      types.js.push(asset);
    } else if (asset.endsWith('.css')) {
      types.css.push(asset);
    }
  });
  return types;
});

class HTMLDocument extends PureComponent {
  static propTypes = {
    markup: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    asyncChunks: PropTypes.array,
    webpackAssets: PropTypes.objectOf(PropTypes.string).isRequired,
  };

  static defaultProps = {
    asyncChunks: [],
  };
  render() {
    const helmet = Helmet.renderStatic();
    const {
      markup,
      state,
      webpackAssets,
      asyncChunks,
    } = this.props;

    const assetsByType = processWebpackAssets(webpackAssets);
    const scripts = [
      { path: assetsByType.manifest.js },
      { path: assetsByType.vendor.js },
      ...asyncChunks
        .map(fullPath => get(webpackAssets, ['modules', fullPath]))
        .filter(f => f != null)
        .map(f => ({ path: f })),
      { path: assetsByType.main.js },
    ];

    return (
      <html lang="en">
        <head>
          { helmet.title.toComponent() }
          { helmet.meta.toComponent() }
          { helmet.link.toComponent() }
          { assetsByType.main.css
            ? <link rel="stylesheet" type="text/css" href={assetsByType.main.css} />
            : null
          }
          <link rel="preload" href={assetsByType.manifest.js} as="script" />
          <link rel="preload" href={assetsByType.vendor.js} as="script" />
          <link rel="preload" href={assetsByType.main.js} as="script" />
        </head>
        <body>
          { /* eslint-disable react/no-danger, max-len */ }
          <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(state, { isJSON: true })};` }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__webpackAssets=${serialize(webpackAssets, { isJSON: true })};` }} />
          { /* eslint-enable react/no-danger, max-len */ }
          { helmet.script.toComponent() }
          {
            scripts.map(script => <script key={script.path} async={script.async} src={script.path} />)
          }
        </body>
      </html>
    );
  }

}

export default HTMLDocument;
