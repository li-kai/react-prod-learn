import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import get from 'lodash/get';

class HTMLDocument extends PureComponent {
  static propTypes = {
    markup: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    asyncChunks: PropTypes.array,
    webpackAssets: PropTypes.shape({
      css: PropTypes.array,
      js: PropTypes.array.isRequired,
    }),
  };

  static defaultProps = {
    asyncChunks: [],
    webpackAssets: {},
  };

  getApplicationScripts() {
    const { webpackAssets, asyncChunks } = this.props;
    const scripts = [
      { path: webpackAssets.js.manifest },
      { path: webpackAssets.js.vendor },
      ...asyncChunks
        .map(path => get(webpackAssets, ['modules', path]))
        .filter(f => f != null)
        .map(f => ({ path: f })),
      { path: webpackAssets.js.main },
    ];

    return scripts;
  }

  render() {
    const helmet = Helmet.renderStatic();
    const {
      markup,
      state,
      webpackAssets,
    } = this.props;

    return (
      <html lang="en">
        <head>
          { helmet.title.toComponent() }
          { helmet.meta.toComponent() }
          { helmet.link.toComponent() }
        </head>
        <body>
          { /* eslint-disable react/no-danger, max-len */ }
          <div id="root" dangerouslySetInnerHTML={{ __html: markup }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(state, { isJSON: true })};` }} />
          <script dangerouslySetInnerHTML={{ __html: `window.__webpackAssets=${serialize(webpackAssets, { isJSON: true })};` }} />
          { /* eslint-enable react/no-danger, max-len */ }
          { helmet.script.toComponent() }
          {
            this
              .getApplicationScripts()
              .map(script => <script key={script.path} async={script.async} src={script.path} />)
          }
        </body>
      </html>
    );
  }

}

export default HTMLDocument;
