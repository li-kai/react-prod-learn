import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import { get } from 'lodash';

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

    const scripts = [
      { path: webpackAssets.manifest },
      { path: webpackAssets.vendor },
      ...asyncChunks
        .map(path => get(webpackAssets, ['modules', path]))
        .filter(f => f != null)
        .map(f => ({ path: f })),
      { path: webpackAssets.main },
    ];

    return (
      <html lang="en">
        <head>
          { helmet.title.toComponent() }
          { helmet.meta.toComponent() }
          { helmet.link.toComponent() }
          {/* <link rel="preload" href="/manifest.js" as="script" />
          <link rel="preload" href="/vendor.js" as="script" />
          <link rel="preload" href="/main.js" as="script" />*/}
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
