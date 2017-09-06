# Webpack features

Feature-based high level webpack configure helper.

## bI?

Webpack features gives you a tool for creating modular reusable webpack configurations.

## Install

```sh
yarn add webpack-features --dev
```

or

```sh
npm install webpack-features --save-dev
```

## Usage

### Create Babel Rule

```javascript
// rules/babel.js
import { createBabelLoader } from 'webpack-features';

export default function({ target, production }) {
  const loader = createBabelLoader({ target, production });

  return [{
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [...loader.get()]
  }];
}
```

### Create CSS Rule

```javascript
// rules/css.js
import { createCSSLoader } from 'webpack-features';

export default function({ target, production }) {
  const envOptions = { target, production, useStyleLoader: true };
  const cssOptions = {
    minimize: production,
    modules: false
  };

  const loader = createCSSLoader(envOptions, cssOptions);

  const cssRule = {
    test: /\.css$/i,
    use: [...loader.get()]
  };
}
```

### Create application config

```javascript
// config.apps.js
const app = {
  name: 'app',
  target: 'client',
  entry: 'src/client/index.js',
  pre: ['babel-polyfill', '!dev?hot-reload', 'bootstrap'],
  plugins: {
    HtmlWebpackPlugin: {
      template: 'index.html',
      filename: 'index.html'
    }
  }
};

export default app;
```

There can be multiple application config objects - which of its will be used for creation of the webpack entry.

### Create common webpack config with Build Manager

Build manager is responsible for managment of entry points and their plugins.
Webpack features has a built-in helper for configuring `HtmlWebpackPlugin`, so you can provide to it only non-standard properties.

```javascript
// config.common.js
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { createBuildManager } from 'webpack-features';
import createBabelRule from './rules/babel';
import createCSSRule from './rules/css';
import apps from './config.apps';

export default function({ BUILD_APPS, target, production, root }) {
  const env = { target, production };
  const buildManager = createBuildManager({
    BUILD_APPS,
    target,
    production,
    root
  }, {
    plugins: { HtmlWebpackPlugin }
  });

  buildManager.addEntries(apps);

  return {
    plugins: buildManager.plugins(),
    entries: buildManager.entries(),
    rules: [createBabelRule(env), createCSSRule(env)]
  };
}
```

Build Manager won't include entries that are not meet the criteria - it should be included in `BUILD_APPS` and have the same `target` as the one provided to the manager.

### Use created common config

```javascript
// config.client.babel.js
import path from 'path';
import createConfig from './config.common.js';

const { plugins, entries, rules } = createConfig({
  BUILD_APPS: 'app',
  target: 'client',
  production: true
});

const webpackConfig = {
  entry: entries,
  output: {
    filename: '[name].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules
  },
  plugins: {
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    ...plugins
  }
}

export default webpackConfig;
```

Change `target` to 'server' in server config:

```javascript
const { plugins, entry, rules } = createConfig({
  target: 'server',
  production: true
});
```
