# Webpack Features

Feature-based webpack configurator with built-in React support.

## Content

- [Installation](#installation)
- [Usage](#usage)
  - [Initializing](#initializing)
  - Features
    - [createConfig](#createconfig)
    - [entry](#entry)
    - [javascript](#javascript)
    - [styles](#styles)
    - [images](#images)
    - [emotion](#emotion)
    - [production](#production)
    - [namedModules](#namedmodules)
    - [node](#node)
    - [browser](#browser)
    - [define](#define)
  - Presets
    - [Base](#base)
  - [Example](#example)

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

- **env**: `object`, required
  - **target**: `object`, required
    - **browsers**: `'modern'|'legacy'|string`
    - **node**: `string`
  - **production**: `boolean`, required
  - **publicPath**: `string`. Used in some features to determine location for their output. Usually should be the same as `output.publicPath` in the webpack config. **default**: `'/'`

Returns: object with features

`env` defines an environment for which the config should be created. `env.target` must be **either** `{ browsers: string }` or `{ node: string }`, not both simultaneously.

```javascript
// webpack.config.js
const createFeatures = require('webpack-features');

const env = {
  target: { browsers: 'modern' },
  production: process.env.NODE_ENV === 'production',
  publicPath: '/',
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

- **args**: list of features and/or objects to be merged

```javascript
const { createConfig, entry } = createFeatures(env);

module.exports = createConfig(
  // feature
  entry({ index: './src/index.js' }),
  // object with the standard webpack config part
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

- **entries**: `object` where keys are entries names and values are strings or arrays of strings with paths. required
- **options**: `object`
  - **polyfill**: `boolean` - should include `babel-polyfill` into every entry. **default**: `true` for 'legacy' browsers target, otherwise `false`
  - **hot**: `boolean` - should include hot reloading support. **default**: `true` if `development` and any browsers target
  - **react**: `boolean` - should include react-specific entries for hot reloading if the last is active. **default**: `true`

```javascript
entry({ index: './src/index.js' }, { polyfill: true, hot: true, react: true }),
```

### javascript

Includes in the config support of a modern javascript syntax. It uses `babel` and `babel-preset-env`. Preset's config depends on the provided `env.target`

Parameters:

- **options**: `object`
  - **plugins**: `array of strings`, additional `babel` plugins.
  - **syntaxEnhance**: `boolean`, should include non-standard language features. Includes `transform-object-rest-spread`, `transform-class-properties`, `syntax-dynamic-import`. **default**: true
  - **eslint**: `boolean`, should include `eslint` for linting before transpiling. **default**: true
  - **react**: `boolean`, should include `react` syntax support. **default**: true
  - **flow**: `boolean`, should include `flow` support. **default**: true
  - **modules**: transform modules to specific format. `false` - do not transpile. **default**: `false` for browsers, `commonjs` for node
  - **hot**: `boolean`, should include support for hot reloading. **defaul**: true for non-production browsers target

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
  - **preprocessors** - `array of strings`, can include `'css'`, `'scss'`, `'less'`. **default**: ['css']
  - **cssModules** - one of: `'both'` - use global CSS and CSS Modules, `'only'` - only CSS Modules, `'exclude'` - only global CSS. **default**: 'both'
  - **extract** - `boolean`, should extract styles to external file. **default**: true if `production` and browsers target
  - **extractPlugin** - `boolean`, should use `extract-text-webpack-plugin`. **default**: same as **extract**
  - **postcss** - `false` means do not use postcss. Otherwise it should be a `callback` that returns a postcss config. It will be called as `postcss({ target, production })`, so you can conditionally include/exclude postcss parts. **default**: config with `precss` and `autoprefixer` based on browsers target.

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

### media

Loads media files.

`media(options)`

Parameters:

- **limit**: `integer`, if the file is smaller then a limit, it will be encoded as a DataURL. **default**: 10000
- **name**: `string`, modifies name of the file. **default**: for `production` `'[name].[ext]'`, otherwise `'media/[hash:8].[ext]'`

See [url-loader](https://github.com/webpack-contrib/url-loader) for more info.

```javascript
media({ limit: 4096, name: 'assets/media/[hash:8].[ext]' })
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

- **options**: `object`
  - **vendor**: `boolean`, extract `node_modules` to the separate bundle. **default**: true for browsers
  - **manifest**: `boolean`, extract Webpack's runtime to the separate bundle. **default**: **vendor**
  - **uglify**: `boolean`, should uglify code. **defualt**: true

### namedModules

Add readable consistent names for chunks and modules.

```javascript
namedModules(options)
```

Parameters:

- **options**: `object`
  - **chunkName**: `function(chunk)`, chunk naming function.

### node

Should be included in the Webpack's config for node. It excludes `node_modules` from being bundled.

```javascript
node()
```

### browser

Should be included in the Webpack's config for browsers. It mocks some node modules that should not being used in browsers. See [here](https://github.com/facebookincubator/create-react-app/blob/aa322d0893dd0f789d4dbb7ff1878096c69edf1c/packages/react-scripts/config/webpack.config.prod.js#L357).

### define

Compile-time code replacement. See [DefinePlugin](https://webpack.js.org/plugins/define-plugin/).

```javascript
define(options)
```

Parameters:

- **options**: `object`
  - **NODE_ENV**: `false|any`, defines `process.env.NODE_ENV`. `false` - `NODE_ENV` will not be defined, otherwise will set `NODE_ENV` to provided one. **default**: based on `env.production`, so if you need to define correct `NODE_ENV`, omit this key.
  - **...defines**: `values`. Every key will be defined as `process.env.key` to it's value.
  - **__prefix**: `string`, will be added to the every key as a prefix. It is not the best idea to override it, but it is possible. The prefix for **NODE_ENV** will still stay the default one. **default**: `'process.env.'`

```javascript
define({
  NODE_ENV: 'test',
  API_URL: 'http://api-provider.com/',
})
// in client code:
console.log(process.env.NODE_ENV)
// -> will be transpiled to console.log('test')
console.log(process.env.API_URL)
// -> console.log('http://api-provider.com/')
```

## Presets

Presets are the complete sets of features with defined default parameters, which made them usefull without much configuring.

### Base

Ready to use preset for React applications.

```javascript
// webpack.config.client.js
const { basePreset } = require('webpack-features');

module.exports = basePreset({
  entry: { index: './src/index.js' }
});
```

The only required parameter is `entry`. It should be an object where keys are entry names and values are entry paths.

All list of options with default values:

```javascript
basePreset({
  entry,
  production = process.env.NODE_ENV === 'production',

  // selects the target, one of these should be `true`
  node = false,
  browser = !node,

  // enables hot reloading
  hot = false,

  // list of the defines for `define` feature
  defines = {},

  // will be used in html-webpack-plugin as a template
  // set to falsy value to not use html-webpack-plugin
  template = './src/index.html',

  // absolute path of the project root directory
  rootPath = fs.realpathSync(process.cwd()),

  // webpack's publich path
  publicPath = '/',

  // path for built assets output
  distPath = path.resolve(rootPath, browser ? 'static/dist' : 'server'),
});
```

## Example

```javascript
// production browsers config

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const createFeatures = require('webpack-features');

const root = ROOT_PATH;
const dist = DIST_PATH;

const publicPath = 'dist/';

const env = {
  target: { browsers: 'legacy' },
  production: true,
  publicPath,
};


const {
  createConfig,
  entry,
  javascript,
  styles,
  production,
  namedModules,
  media,
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
  media(),
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
