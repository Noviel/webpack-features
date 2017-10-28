import ExtractTextPlugin from 'extract-text-webpack-plugin';

const createRule = (
  { production, target },
  { preprocessor, cssModules, extract, postcss }
) => {
  const options = {
    exclude: [/node_modules/],
  };

  /* eslint-disable no-useless-escape */
  const extension =
    preprocessor === 'scss'
      ? `\.scss`
      : preprocessor === 'less' ? `\.less` : `\.css$`;

  const excludeModules = `^(?!.*\.module).*`;

  const test = cssModules.use
    ? new RegExp(`.module${extension}$`, 'i')
    : new RegExp(`${excludeModules}${extension}$`, 'i');
  /* eslint-enable no-useless-escape */

  const cssLoader = {
    loader: `css-loader${target.node ? '/locals' : ''}`,
    options: {
      sourceMap: !production,
      minimize: production,
      modules: cssModules.use,
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

  if (extract) {
    loaders = ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders,
    });
  } else if (target.browsers) {
    loaders.unshift(styleLoader);
  }

  return {
    test,
    use: loaders,
    ...options,
  };
};

export default (
  { target, production },
  {
    preprocessors = ['css'],
    cssModules: { usage = 'both', path } = {},
    extract = target.browsers && production,
    extractPlugin = extract,
    postcss = require('./postcss.config.js'),
  },
  state
) => {
  const rules = [];
  const plugins = [];

  if (postcss) {
    postcss = postcss({ target, production });
  }

  preprocessors.forEach(preprocessor => {
    const useCSSModules = usage === 'both' || usage === 'only';
    const useGlobalCSS = usage === 'both' || usage === 'exclude' || true;

    const options = {
      preprocessor,
      extract,
      cssModules: { use: true, path },
      postcss,
    };

    if (useCSSModules) {
      options.cssModules = { use: true, path };
      rules.push(createRule({ target, production }, options));
    }
    if (useGlobalCSS) {
      options.cssModules = { use: false, path };
      rules.push(createRule({ target, production }, options));
    }
  });

  if (extractPlugin) {
    plugins.push(
      new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
      })
    );
  }

  state.addRules(rules);
  state.addPlugins(plugins);
};
