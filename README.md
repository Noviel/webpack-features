# Webpack Features

Feature-based webpack configurator with built-in `react` support.

## Installation

```sh
yarn add webpack-features --dev
```

or

```sh
npm install webpack-features --save-dev
```

## Usage

### Initializing

Package's default export is an initializing function.

`createFeatures(env)`

Parameters:

- **env**: object, required
  - **target**: object, required
    - **browsers**: 'modern'|'legacy'|string
    - **node**: string
  - **production**: boolean, required

Returns: object with features

`env` defines an environment for which the config should be created. `env.target` must be **either** `{ browsers: string }` or `{ node: string }`, not both simultaneously.

```javascript
// webpack.config.js
const createFeatures = require('webpack-features');

const env = {
  target: { browsers: 'modern' },
  production: process.env.NODE_ENV === 'production',
};

const features = createFeatures(env);
```

A common practice is destructuring result of initializing to get everything you need.

```javascript
const { createConfig, entry, javascript, styles } = createFeatures(env);
```

### createConfig

Main function that creates complete final webpack config. It merges all provided `features`. Can accept native Webpack's config object's parts.

`createConfig(...args)`

Parameters:

- **args**: list of features, objects to be merged

```javascript
const { createConfig, entry } = createFeatures(env);

module.exports = createConfig(
  // feature
  entry({ index: './src/index.js' }),
  // standard webpack config object
  {
    output: {
      path: DIST_PATH,
      filename: '[name].js',
    },
  }
);
```

### entry

Include entries to the config.

`entry(entries, options)`

Parameters:

- **entries**: object where keys are entries names and values are strings or arrays of strings with paths. required
- **options**: object
  - **polyfill**: boolean - should include `babel-polyfill` into every entry. **default**: `true` for 'legacy' browsers target, otherwise `false`
  - **hot**: boolean - should include hot reloading support. **default**: `true` if `development` and any browsers target
  - **react**: boolean - should include react-specific entries for hot reloading if the last is active. **default**: `true`

```javascript
entry({ index: './src/index.js' }, { polyfill: true, hot: true, react: true }),
```

### javascript

Includes in the config support of a modern javascript syntax. It uses `babel` and `babel-preset-env`. Preset's config depends on the provided `env.target`

Parameters:

- **options**: object
  - **plugins**: array of strings - additional `babel` plugins.
  - **syntaxEnhance**: boolean - should include non-standard language features. Includes `transform-object-rest-spread`, `transform-class-properties`, `syntax-dynamic-import`. **default**: true
  - **eslint** - should include `eslint` for linting before transpiling. **default**: true
  - **react** - should include `react` syntax support. **default**: true
  - **flow** - should include `flow` support. **default**: true
  - **modules** - transform modules to specific format. `false` - do not transpile. **default**: `false` for browsers, `commonjs` enforced for node

```javascript
javascript({
  // for exmaple: we do not want include every extended syntax plugin, but want this one
  plugins: ['transform-object-rest-spread'],
  syntaxEnhance: false,
})
```

### styles

Adds support for CSS, Scss and less files.

`styles(options)`

Parameters:

- **options**: object
  - **preprocessors** - array of preprocessors, can include `'css'`, `'scss'`, `'less'`. **default**: ['css']
  - **cssModules** - one of: `'both'` - use global CSS and CSS Modules, `'only'` - only CSS Modules, `'exclude'` - only global CSS. **default**: 'both'
  - **extract** - boolean, should extract styles to external file. **default**: true if `production` and browsers target
  - **extractPlugin** - boolean, should use `extract-text-webpack-plugin`. **default**: same as **extract**
  - **postcss** - `false` means do not use postcss. Otherwise it should be a callback that returns a postcss config. It will be called as `postcss({ target, production })`, so you can conditionally include/exclude postcss parts. **default**: config with `precss` and `autoprefixer` based on browsers target.

**Important note**: CSS Modules (if enabled) will be applied to files with extension `.module.{css|less|scss}` only.

```javascript
styles({
  preprocessors: ['css', 'scss'],
  cssModules: 'only',
  extract: false,

  postcss({ target, production }) {
    return {
      plugins: []
        .concat(production ? autoprefixer: [])
    };
  }
})
```

### images

Loads `.jpg`, `.png`, `.gif`, `.svg` files.

`images(options)`

Parameters:

- **limit**: integer, if the file is smaller then a limit, it will be encoded as a DataURL. **default**: 10000
- **name**: string, modifies name of the file. **default**: for `production` `'[name].[ext]'`, otherwise `'images/[hash].[ext]'`

See [url-loader](https://github.com/webpack-contrib/url-loader) for more info.

```javascript
images({ limit: 4096, name: 'assets/img/[hash].[ext]' })
```

### emotion

Adds `babel-plugin-emotion` to the config.

```javascript
emotion()
```

### production

Adds optimizations for production bundles.

`production(options)`

Parameters:

- **options**: object
  - **vendor**: boolean, extract `node_modules` to the separate bundle. **default**: true for browsers
  - **manifest**: boolean, extract Webpack's runtime to the separate bundle. **default**: **vendor**
  - **uglify**: boolean, should uglify code. **defualt**: true

### namedModules

Add readable consistent names for chunks and modules.

```javascript
namedModules()
```

### node

Should be included in the Webpack's config for node. It excludes `node_modules` from being bundled.

```javascript
node()
```

### browser

Should be included in the Webpack's config for browsers. It mocks some node modules that should not being used in browsers. See [here](https://github.com/facebookincubator/create-react-app/blob/aa322d0893dd0f789d4dbb7ff1878096c69edf1c/packages/react-scripts/config/webpack.config.prod.js#L357).

## Example

```javascript
// production browsers config

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const root = ROOT_PATH;
const dist = DIST_PATH;

const publicPath = 'dist/';

const env = {
  target: { browsers: 'legacy' },
  production: true,
  publicPath,
};

const createFeatures = require('webpack-features');

const {
  createConfig,
  entry,
  javascript,
  styles,
  production,
  namedModules,
  images,
  emotion,
} = createFeatures(env);

const cssModulesPath = client.components;

module.exports = createConfig(
  entry({ index: './src/client/index.js' }),
  javascript(),
  styles({
    preprocessors: ['css'],
    cssModules: 'both',
  }),
  emotion(),
  images(),
  {
    output: {
      path: dist,
      publicPath,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },
  },
  {
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"',
      }),

      new CleanWebpackPlugin(['static/dist'], {
        root,
      }),
    ],
  },
  production(),
  namedModules(),
  {
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/client/index.html',
        filename: '../index.html',
      }),
    ],
  }
);

```
