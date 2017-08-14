# Webpack features

Feature-based high level webpack configure helper.

## bI?

Webpack features gives you tools for creating modular reusable webpack configurations.

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

### Create Build Manager

```javascript
// config.common.js
import { createBuildManager } from 'webpack-features';
import createBabelRule from './rules/babel';
import createCSSRule from './rules/css';

export default function(env) {

  const buildManager = createBuildManager(env, {
    plugins: { HtmlWebpackPlugin }
  });

  buildManager.addClientEntry({
    name: 'app',
    entry: 'src/client/index.js'
  });

  buildManager.addServerEntry({
    name: 'server',
    entry: 'src/server/index.js',
  });

  return {
    plugins: buildManager.plugins(),
    entry: buildManager.entries(),
    rules: [createBabelRule(env), createCSSRule(env)]
  };
}
```

### Use created common config

```javascript
// config.client.babel.js
import path from 'path';
import createConfig from './config.common.js';

const { plugins, entry, rules } = createConfig({
  target: 'client',
  production: true
});

const webpackConfig = {
  entry,
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
