import ExtractTextPlugin from 'extract-text-webpack-plugin';

export const createTestRegExp = (preprocessor, cssModules) => {
  /* eslint-disable no-useless-escape */
  const extension = `\.${preprocessor || 'css'}`;

  return new RegExp(`${cssModules ? `\.module` : ''}${extension}$`, 'i');
  /* eslint-enable no-useless-escape */
};

const createRule = (
  { production, target },
  { preprocessor, cssModules, extract, postcss, exclude }
) => {
  const options = {};

  if (exclude) {
    options.exclude = exclude;
  }

  const cssLoader = {
    loader: `css-loader${target.name === 'node' ? '/locals' : ''}`,
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
    loader: 'style-loader',
    options: {},
  };

  let loaders = [cssLoader];

  if (postcss) {
    loaders[0].options.importLoaders = 1;
    loaders = loaders.concat({ loader: 'postcss-loader', options: postcss });
  }

  if (preprocessor === 'scss') {
    loaders[0].options.importLoaders++;
    loaders = loaders.concat({
      loader: 'sass-loader',
      options: {
        sourceMap: !production,
      },
    });
  } else if (preprocessor === 'less') {
    loaders[0].options.importLoaders++;
    loaders = loaders.concat({
      loader: 'less-loader',
      options: {
        sourceMap: !production,
      },
    });
  }

  if (extract) {
    loaders = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders,
    });
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
    extractFilename = '[name].[contenthash].css',
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
      new ExtractTextPlugin({
        filename: extractFilename,
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
