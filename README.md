# Webpack Features

Make Webpack configuration process quick and painless.

## Content

- [Installation](#installation)
  - Presets
    - [Base](#base)
    - [React](#react)
    - [Examples](#examples)
  - [Features](#features)
    - [Initializing](#initializing)
    - [createConfig](#createconfig)
    - [entry](#entry)
    - [output](#output)
    - [javascript](#javascript)
      - [TypeScript](#typescript)
      - Plugins  
        - [emotion](#emotion)
    - [webAssembly](#webassembly)
    - [styles](#styles)
    - [images](#images)
    - [namedModules](#namedmodules)
    - [node](#node)
    - [browser](#browser)
    - [define](#define)
    - [externals](#externals)
    - [optimization](#optimization)

## Installation

```sh
yarn add webpack-features --dev
```

or

```sh
npm install webpack-features --save-dev
```

## Presets

Presets provide complete configuration that can be used directly by Webpack.

### Base

Preset suitable for most applications with following features: ESNext syntax, CSS and media files loading, production/development environment, browsers/node.js targets and other (see options). Preset makes following assumption about structure of the project:

- `src/index.js` - entry point of an application
- `src/index.html` - html-template
- `static` - output directory, `index.html` will be placed here 
- `static/dist` - bundled assets directory

Notes:

- for `node` target default output directory is `server`
- CSS modules is enabled for `*.module.css` files (based on `styles` feature design decisions)

Despite the fact that preset does not need any options, there are many parameters to customize behavior.

Basic usage: 

```javascript
// webpack.config.js
const { base } = require('webpack-features');

module.exports = base({
  entry: { index: './src/main.js' },
  publicPath: './public/',
});
```

Complete list of options with default values:

```javascript
base(
  {
    // for multiple entries use object
    // entry = {
    //  index: './src/index.js',
    //  other: './src/other.js',
    // }
    entry = './src/index.js',

    // array with strings of frameworks
    // 'react' - for React support
    // other frameworks are coming soon..
    frameworks = [],

    production = process.env.NODE_ENV === 'production',

    // selects the target, one of `node` or `browser` should be truthy
    // 
    // node: if 'true' target will be set to 'current` node 
    node = false,
    // browser: allowed values: 'legacy', 'modern' or [string]
    // [string] - is a browserlist format, see https://github.com/browserslist/browserslist
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
    publicPath = !production || node || hot ? '/' : '/dist/',

    // relative path for a built assets output
    distPath = browser ? 'static/dist/' : 'server',

    // which type syntax should be used
    // can be:
    //  - flow
    //  - typescript
    types = 'none',

    // CSS preprocessors
    // should be an array of strings
    // empty array - vanilla CSS
    // can contain 'scss' and 'less'
    cssPreprocessors = [],

    // patterns to exclude from style loaders
    cssExclude = false,

    // patterns to exclude from babel transformations
    babelExclude = /node_modules/,

    // add polyfill for features unsupported by environment
    babelPolyfill = true,

    // support for WebWorkers
    webWorkers = true,

    // should build library instead of application
    // string will be used as a library name,
    library = false,

    // list of external imports that should not be bundled
    // for example: `node_modules` for node target will be added to externals automatically
    externals = [],

    // for build for node target
    // array of strings or regular expressions which will be bundled
    // usefull if you are using workspaces and include one package from another
    externalsWhitelist = undefined,

    // path to `node_modules` to exclude them if needed
    modulesDir = 'node_modules',

    // output html filename
    // by default we want it to be at the root of the public folder
    // and because of default `distPath` the root is one level higher
    // but for `hot` reloading we should point to the virtual `index.html`
    indexHtml: `${hot || !production ? '' : '../'}index.html`,

    // true - add support for WebAssembly
    // `inline` - do not output *.wasm files, embed code in JavaScript
    wasm = false,

    // add debug information output on bundling stage
    debug = false
  },
  featuresOptionsOverrides = {},
  webpackConfigOverrides = {},
);
```

Second and third parameters are objects with optional config extensions.

`featuresOptionsOverrides` can be used in case preset is not providing needed options for features. Every option is an object named exactly like corresponding feature. These options will be flat merged with overrides to the features options generated by the preset.

```javascript
base(
  {/* features options */},
  {
    // this will remove eslint-loader from resulting config
    javascript: {
      eslint: false
    }
  }
);
```

`webpackConfigOverrides` is a last resort! It can be used to add something to the config not provided by features. Should look like entries of the standard webpack config. Will be flat merged and therefore entries will completely override top-level options (e.g. entry, output, module) generated by features.

```javascript
base(
  {/* features options */},
  {/* featuresOptionsOverrides must be here even is empty */},
  {
    // this will completely override `output` field!
    output: {
      chunkFilename: '[name].chunk.js',
      filename: '[name].js',
      path: 'my-crazy-path',
      publicPath: '/',
    },
  }
);
```

### React

Preset with React support. It accepts same options as `base` preset. Usage:

```javascript
// webpack.config.js
const { react } = require('webpack-features');

module.exports = react({
  entry: { index: './src/main.js' },
  publicPath: './public/',
});
```

### Examples

- [webpack-features/examples](https://github.com/Noviel/webpack-features/tree/master/examples)
- [modern-frontend-starter](https://github.com/Noviel/modern-frontend-starter)

## Features

If the above presets do not provide the necessary functionality or you want to create your own preset, you can use `features` that are the building blocks and the core of `webpack-features`.

### Initializing

Package's default export is an initializing function that returns object with features.

`createFeatures(env)`

Parameters:

- **env**: `object`, required
  - **target**: `object`, required
    - **name**: `'browser'|'node'`
    - **value**: `'modern'|'legacy'|'string'|undefined`
  - **production**: `boolean`, required
  - **rootPath**: `string`, absolute path to the project's root, **default**: `process.cwd()`
  - **publicPath**: `string`, **default**: `'/'`
  - **distPath**: `string`, relative path for output assets, **default**: `'dist'`
  - **debug**: `boolean`, output debug information on bundling stage, **default**: `false`

`env` defines an environment for which the config should be created. if `env.target.value` is undefined, will be used browserlist sources for `browser` target.

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

Then you can destructure result of initializing to get features.

```javascript
const { createConfig, entry, javascript, styles } = createFeatures(env);
```

### createConfig

Main function that creates complete final webpack config from features. Can accept native Webpack's config object's parts.

`createConfig(...args)`

Parameters:

- **args**: list of features and/or objects to be merged

```javascript
const { createConfig, entry, javascript, styles } = createFeatures(env);

module.exports = createConfig(
  // feature
  entry({ index: './src/index.js' }),
  javascript(),
  styles(),
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

`entry(options)`

Parameters:

- **options**: `object`
  - **entries**: `object` where keys are entries names and values are strings or arrays of strings with paths. required
  - **options**: `object`
    - **polyfill**: `boolean` - should include `babel-polyfill` into every entry. **default**: `true` for 'legacy' browsers target, otherwise `false`
    - **hotMiddleware**: `boolean` - should include express middleware for hot reloading. **default**: `false`

```javascript
entry({ 
  entries: { index: './src/index.js' },
  polyfill: true,
  hotMiddleware: true,
}),
```

### output

Define where to output the resulting bundle.

`output(options)`

Parameters:

- **options**: `object`
  - **filename**: `string` name of the output file. **default**: for production `'[name].[chunkhash:8].js'`, otherwise `'[name].js'`.
  - **chunkFilename**: `string`, name of chunks. **default**: for production `'[name].[chunkhash:8].js'`, otherwise `'[name].js'`.
  - **library**: `string | boolean`. Used for building libraries, not applications. **default**: `false`. 
  - **libraryTarget**: `string`, type of the library module system. Used if `library` is not false. **default**: `'umd'`

```javascript
output({ 
  filename: '[name]-[chunkhash].js',
}),
```

### javascript

Includes in the config support of a modern javascript syntax. It uses `babel` and `babel-preset-env`. Preset's config depends on the provided `env.target`

Parameters:

- **options**: `object`
  - **babelPlugins**: `array of strings`, additional `babel` plugins.
  - **polyfill**: `'usage'|'entry'|false`, apply `@babel/preset-env` for `@babel/polyfill`. **default**: `'entry'` for legacy browsers.
  - **syntaxEnhance**: `boolean`, should include non-standard language features. Includes `object rest spread`, `decorators`, `class properties`, `dynamic import`. **default**: `true`
  - **eslint**: `boolean`, should include `eslint` for linting before transpiling. **default**: `true`
  - **react**: `boolean`, should include `react` syntax support. **default**: true
  - **flow**: `boolean`, should include `flow` support. **default**: true
  - **typescript**: `'strict'|'migration'|false`, add support for `TypeScript`. `true` value is treated as `'strict'` **default**: `false`
  - **tsOptions**: `object`, `ts-loader` options. **default**: `{}`
  - **modules**: transform modules to specific format. `false` - do not transpile. **default**: `false` for browsers, `commonjs` for node
  - **hot**: `boolean`, should include support for hot reloading. **defaul**: true for non-production browsers target
  - **exclude**: items to exclude from loading. **default**: `/node_modules/`
  - **workers**: `boolean`, add support for WebWorkers. **default**: `true`

```javascript
javascript({
  // for example: we do not want to include every extended syntax plugin, but want specific one
  babelPlugins: ['transform-object-rest-spread'],
  syntaxEnhance: false,
})
```

##### TypeScript

You should `yarn add typescript --dev` in order to use TypeScript. There are two default modes for TypeScript: `migration` and `strict`. One of built-in `tsconfig.json` files will be used depending on mode by default. Or you can use your own `tsconfig.json` pointing to this file in `javascript` feature options:

```javascript
javascript({
  typescript: true,
  tsOptions: {
    configFile: require.resolve(`../tsconfig.json`),
  },
})
```

##### Plugins
###### emotion

Adds `babel-plugin-emotion` to the config.

```javascript
const { emotion } = require('webpack-features');
/* ... */
javacript(config, [emotion(options)])
```

Parameters:

- **options**: `object`
  - **hoist**: `boolean`, **default**: `production`
  - **sourceMap**: `boolean`, **default**: `!production`
  - **autoLabel**: `boolean`, **default**: `!production`

### webAssembly

Add support for WebAssembly.

`webAssembly(options)`

Parameters:

- **options**: `object`
  - **inline**: `boolean` - embed WebAssembly code into JavaScript. Multiple entries of the same code will be embedded for every entry. **default**: `false`
  - **experimental**: `boolean` - enable Webpack 4 WebAssembly module type. **default**: `false`

`experimental` flag is off by default, because of current Webpack's WebAssembly module type stage. There are problems with `.wasm` files larger than 4Kb and usage inside WebWorker.

```javascript
webAssembly({ inline: true, experimental: true )
```

### styles

Adds support for styles.

`styles(options)`

Parameters:

- **options**: object
  - **preprocessors** - `array of strings`, can include `'scss'`, `'less'`. **default**: []
  - **cssModules** - one of: `'both'` - use global CSS and CSS Modules, `'only'` - only CSS Modules, `'exclude'` - only global CSS. **default**: 'both'
  - **extract** - `boolean`, should extract styles to external file. **default**: true if `production` and browsers target
  - **extractPlugin** - `boolean`, should add extract plugin to plugins list. **default**: same as **extract**
  - **extractFilename** - `string`, name of the file for extraction. **default**: `'[name].css'`
  - **postcss** - `false` means do not use postcss. Otherwise it should be a `callback` that returns a postcss config. It will be called as `postcss({ target, production })`, so you can conditionally include/exclude postcss parts. **default**: config with `precss` and `autoprefixer` based on browsers target.
  - **exclude** - items to exclude from processing. **default**: `[/node_modules/]`

Supports Sass/less preprocessors, but you should manually add corresponding packages if you want to use them.

Sass:

```sh
yarn add node-sass sass-loader --dev
```

less:
```sh
yarn add less less-loader --dev
```

**Important note**: CSS Modules (if enabled) will be applied to files with extension `.module.{css|less|scss}` only.

```javascript
styles({
  preprocessors: ['scss'],
  cssModules: 'only',
  extract: false,

  postcss({ target, production }) {
    return {
      plugins: []
        .concat(production ? autoprefixer: [])
    };
  },

  exclude: false,
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

### namedModules

Add readable consistent names for chunks and modules.

```javascript
namedModules(options)
```

Parameters:

- **options**: `object`
  - **chunkName**: `function(chunk)`, chunk naming function.

### node

Set Webpack's target to `node`.

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
  - **$prefix**: `string`, will be added to the every key as a prefix. It is not the best idea to override it, but it is possible. The prefix for **NODE_ENV** will still stay the default one. **default**: `'process.env.'`

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

### externals

Add externals. Should be added to config for node to exclude `node_modules` from being bundled.

```javascript
externals(options)
```

Parameters:

- **options**: `object`
  - **react**: `boolean`, add react to externals. Usefull for libraries. **default**: `false`
  - **list**: `array`, additional list of externals. **default**: `[]`
  - **whitelist**: `array`, these entries will be bundled. **default**: `[/\.(?!(?:jsx?|json)$).{1,5}$/i]` to bundle any non-JS files from `node_modules`
  - **modulesDir**: `string`, path to `node_modules`. **default**: `node_modules`

```javascript
externals({
  react: true
  list: [
    {
      lodash : {
        commonjs: "lodash",
        amd: "lodash",
        root: "_" // indicates global variable
      }
    }
  ]
})
```

### optimization

Add optimizations for bundles: minimizing, code splitting.

```javascript
optimization(options)
```

Parameters:

- **options**: `object`
  - **minimize**: `boolean`, minimize bundle code. **default**: `production`.
  - **split**: `boolean`, should split code to `runtime`, `vendors`, `main` bundles. **default**: `true` for `browsers` target in `production` mode.

```javascript
optimizatione({
  minimize: false,
  split: true,
})
```
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
      chunkFilename: '[name].[chunkhash].js',
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
