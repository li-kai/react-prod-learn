# React Production Learn

## Step 1: Basics

Since this _is_ a React boilerplate, we need to start off by installing React!

We'll be using [yarn](https://yarnpkg.com/lang/en/docs/install/) as our package manager, because in deterministic builds we trust.

### New files

#### `package.json`

Installs React and React-dom. Also installs Babel and webpack for compiling `jsx`.

#### `src/index.jsx`

A basic react page.

#### `.babelrc`

A basic babel transform to make our React code work across browsers.

#### `webpack/webpack.config.js`

A simple webpack configuration to compile the file. `yarn start` will compile to the dist folder. You should see `Hello world!` text when you open `index.html` in the browser.

#### `.gitignore`

Copied from [github/gitignore](https://github.com/github/gitignore/blob/master/Node.gitignore). Most important take away here is to ignore `node_modules`!

#### `.gitattributes`

Copied from [alexkaratarakis/gitattributes](https://github.com/alexkaratarakis/gitattributes/blob/master/Web.gitattributes). Mostly to keep line-endings consistent.

#### `LICENSE.md`

Set up a license, so you can copy all you want without repercussions!
