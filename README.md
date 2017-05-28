# React Production Learn

## Step 2: Essentials

With the addition of HtmlWebpackPlugin, we can finally have our first React app running through `yarn start`!

Let's add a few more tools, like linters and test frameworks. We'll be going with Jest here, along with Travis as our CI.

### New files

#### `.nvmrc`

Keep node versions consistent across workspaces.

#### `.eslintrc.js`

Keep styling consistent across workspaces. We're going with [Airbnb's styling](https://www.npmjs.com/package/eslint-config-airbnb).

#### `.editorconfig`

Keep editor configuration consistent across editors.

#### `jest.config.js`, `__mocks__`, `__tests__`

Write tests!

#### `.travis.yml`

CI for tests and deployment.

#### `.env` `.env.development`

Environment variables made easy!

### New libraries

- [dotenv](https://www.npmjs.com/package/dotenv): Manage environment variables easily
- [dotenv-webpack](https://www.npmjs.com/package/dotenv-webpack): Webpack is silly. Env variables aren't injected.
- [prop-type](https://www.npmjs.com/package/prop-types): It's essential to check to prevent silly mistakes.
- [jest](http://facebook.github.io/jest/): Test library
- [HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin): React needs to output a html file
