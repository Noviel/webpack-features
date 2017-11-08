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

  const test = cssModules
    ? new RegExp(`.module${extension}$`, 'i')
    : new RegExp(`${excludeModules}${extension}$`, 'i');
  /* eslint-enable no-useless-escape */

  const cssLoader = {
    loader: `css-loader${target.node ? '/locals' : ''}`,
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
    cssModules = 'both',
    extract = target.browsers && production,
    extractPlugin = extract,
    extractFilename = '[name].[contenthash].css',
    postcss = require('./postcss.config.js'),
  } = {},
  state
) => {
  const rules = [];
  const plugins = [];

  if (postcss) {
    postcss = postcss({ target, production });
  }

  const useCSSModules = cssModules === 'both' || cssModules === 'only';
  const useGlobalCSS =
    cssModules === 'both' || cssModules === 'exclude' || true;

  preprocessors.forEach(preprocessor => {
    const options = {
      preprocessor,
      extract,
      postcss,
    };

    if (useCSSModules) {
      options.cssModules = true;
      rules.push(createRule({ target, production }, options));
    }
    if (useGlobalCSS) {
      options.cssModules = false;
      rules.push(createRule({ target, production }, options));
    }
  });

  if (extractPlugin) {
    plugins.push(
      new ExtractTextPlugin({
        filename: extractFilename,
      })
    );
  }

  state.addRules(rules);
  state.addPlugins(plugins);
};
