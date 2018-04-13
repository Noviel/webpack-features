import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { includeExclude } from '../lib/regexp';

export const createTestRegExp = (preprocessor, cssModules) =>
  includeExclude(`\\.module`, `\\.${preprocessor || 'css'}`, !cssModules);

const createRule = (
  { production, target },
  { preprocessor, cssModules, extract, postcss, exclude }
) => {
  const options = {};

  if (exclude) {
    options.exclude = exclude;
  }

  const cssLoader = {
    loader: require.resolve(
      `css-loader${target.name === 'node' ? '/locals' : ''}`
    ),
    options: {
      sourceMap: !production,
      minimize: production,
      modules: cssModules,
      localIdentName: production
        ? '[hash:base64]'
        : '[path][name]__[local]--[hash:base64:5]',
    },
  };

  const styleLoader = {
    loader: require.resolve('style-loader'),
    options: {},
  };

  let loaders = [cssLoader];

  if (postcss) {
    loaders[0].options.importLoaders = 1;
    loaders = loaders.concat({
      loader: require.resolve('postcss-loader'),
      options: postcss,
    });
  }

  if (preprocessor === 'scss') {
    loaders[0].options.importLoaders++;
    loaders = loaders.concat({
      // we do not `require.resolve` because sass-loader
      // should be installed by user
      loader: 'sass-loader',
      options: {
        sourceMap: !production,
      },
    });
  } else if (preprocessor === 'less') {
    loaders[0].options.importLoaders++;
    loaders = loaders.concat({
      // we do not `require.resolve` because less-loader
      // should be installed by user
      loader: 'less-loader',
      options: {
        sourceMap: !production,
      },
    });
  }

  if (extract) {
    loaders.unshift(MiniCssExtractPlugin.loader);
  } else if (target.name === 'browsers') {
    loaders.unshift(styleLoader);
  }

  return {
    test: createTestRegExp(preprocessor, cssModules),
    use: loaders,
    ...options,
  };
};

export default (
  env,
  {
    preprocessors = [],
    cssModules = 'both',
    extract = env.target.name === 'browsers' && env.production,
    extractPlugin = extract,
    extractFilename = '[name].css',
    postcss = require('../lib/postcss.config.js'),
    exclude = false,
  },
  { plugins, next }
) => {
  const rules = [];
  const webpackPlugins = [];

  if (preprocessors.indexOf('css') < 0) {
    preprocessors.unshift('css');
  }

  if (postcss) {
    postcss = postcss(env);
  }

  const useCSSModules = cssModules === 'both' || cssModules === 'only';
  const useGlobalCSS =
    cssModules === 'both' || cssModules === 'exclude' || true;

  preprocessors.forEach(preprocessor => {
    const options = {
      preprocessor,
      extract,
      postcss,
      exclude,
    };

    if (useCSSModules) {
      options.cssModules = true;
      rules.push(createRule(env, options));
    }
    if (useGlobalCSS) {
      options.cssModules = false;
      rules.push(createRule(env, options));
    }
  });

  if (extractPlugin) {
    webpackPlugins.push(
      new MiniCssExtractPlugin({
        filename: extractFilename,
        chunkFilename: '[id].[chunkhash].css',
      })
    );
  }

  return next(env, plugins, {
    module: {
      rules,
    },
    plugins: webpackPlugins,
  });
};
