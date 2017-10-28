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

```javascript
// webpack.config.js
const initFeatures = require('webpack-features');

const env = {
  target: { browsers: 'modern' },
  production: process.env.NODE_ENV === 'production',
};

const features = initFeatures(env);
```

Parameters:

- **env**: object, required
  - **target**: object, required
    - **browsers**: 'modern'|'legacy'|string
    - **node**: string
  - **production**: boolean, required

`env` defines an environment for which the config should be created. `env.target` must be **either** `{ browsers: string }` or `{ node: string }`, not both simultaneously.

A common practice is destructuring result of initializing to get everything you need.

```javascript
const { createConfig, entry, javascript, styles } = initFeatures(env);
```

### createConfig(features)

Main function that creates complete final webpack config. It merges all provided `features`. Can accept native Webpack's config object's parts.

```javascript
const { createConfig, entry } = initFeatures(env);

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

### entry(entries, options)

Include entries to the config.

Parameters:

- **entries**: object where keys are entries names and values are strings or arrays of strings with paths. required
- **options**: object
  - **polyfill**: boolean - should include `babel-polyfill` into every entry. **default**: `true` for 'legacy' browsers target, otherwise `false`
  - **hot**: boolean - should include hot reloading support. **default**: `true` if `development` and any browsers target
  - **react**: boolean - should include react-specific entries for hot reloading if the last is active. **default**: `true`

```javascript

const { createConfig, entry } = initFeatures(env);

const config = createConfig(
  entry({ index: './src/index.js' }, { polyfill: true, hot: true, react: true }),
)
```

### javascript(options)

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
const { createConfig, javascript } = initFeatures(env);

const config = createConfig(
  javascript({
    // for exmaple: we do not want include every extended syntax plugin, but want this one
    plugins: ['transform-object-rest-spread'],
    syntaxEnhance: false,
  }),
)
```

### styles

```javascript

```
