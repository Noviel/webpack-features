import fs from 'fs';
import webpack from 'webpack';
import initFeatures from '../config';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const noopFeature = () => ({});

module.exports = (
  {
    entry = './src/index.js',
    production = process.env.NODE_ENV === 'production',
    node = false,
    browser = !node,
    hot = false,
    defines = {},
    template = './src/index.html',
    rootPath = fs.realpathSync(process.cwd()),
    publicPath = !production || node || hot ? '/' : './dist/',
    distPath = browser ? 'static/dist' : 'server',
    types = 'none',
    cssPreprocessors = [],
    cssExclude = false,
    babelExclude = /node_modules/,
    emotion = false,
    webWorkers = true,
    library = false,
    legacy = false,
    externals = [],
    externalsWhitelist = undefined,
    modulesDir = 'node_modules',
    indexHtml = `${hot || !production ? '' : '../'}index.html`,
  },
  featuresOptions = {},
  extend = {}
) => {
  const env = {
    publicPath,
    distPath,
    rootPath,
    production,
  };

  if (node) {
    if (library) {
      throw new Error(`'library' should be used only for browsers target`);
    }
    env.target = { name: 'node', value: 'current' };
  } else if (browser) {
    env.target = {
      name: 'browsers',
      value: legacy ? 'legacy' : 'modern',
    };
  } else {
    throw new Error(
      `Target is not defined. Either 'browser' or 'node' should be true.`
    );
  }

  const {
    createConfig,
    output,
    entry: createEntry,
    javascript,
    styles,
    media,
    define,
    node: createNode,
    externals: createExternals,
    optimization,
  } = initFeatures(env);

  const {
    entry: optsEntry = {},
    output: optsOutput = {},
    javascript: optsJavascript = {},
    styles: optsStyles = {},
    media: optsMedia = {},
    define: optsDefine = {},
    externals: optsExternals = {},
    htmlWebpackPlugin: optsHtmlWebpackPlugin = {},
    optimization: optsOptimization = {},
  } = featuresOptions;

  const tsType =
    types && types.indexOf('typescript') > -1
      ? types.indexOf('strict') > -1 ? 'strict' : 'migration'
      : false;

  return createConfig(
    ...[
      { mode: production ? 'production' : 'development' },
      createEntry({
        entries: entry,
        ...optsEntry,
      }),
      javascript(
        {
          flow: types === 'flow',
          typescript: tsType,
          exclude: babelExclude,
          hot,
          webWorkers,
          ...optsJavascript,
        },
        [].concat(emotion ? require('../plugins/emotion').default() : [])
      ),
      styles({
        preprocessors: cssPreprocessors,
        extractFilename: library ? '[name].css' : undefined,
        exclude: cssExclude,
        ...optsStyles,
      }),
      media({
        limit: library ? undefined : 10000,
        ...optsMedia,
      }),
      define({ ...defines, ...optsDefine }),
      node ? createNode() : noopFeature(),
      createExternals({
        react: library,
        list: externals,
        modulesDir,
        whitelist: externalsWhitelist,
        ...optsExternals,
      }),
      output({
        library,
        filename: library ? '[name].js' : undefined,
        ...optsOutput,
      }),
      optimization({
        minimize: production && browser,
        split: production && browser,
        ...optsOptimization,
      }),
      {
        plugins: []
          .concat(
            production
              ? new CleanWebpackPlugin([env.distPath], {
                  root: env.rootPath,
                })
              : []
          )
          .concat(hot ? new webpack.HotModuleReplacementPlugin() : [])
          .concat(
            browser && template
              ? new HtmlWebpackPlugin({
                  template,
                  filename: indexHtml,
                  ...optsHtmlWebpackPlugin,
                })
              : []
          ),
      },
      {
        stats: {
          children: false,
          modules: false,
        },
      },
      {
        ...extend,
      },
    ]
  );
};
