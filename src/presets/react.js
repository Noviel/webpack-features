import fs from 'fs';
import webpack from 'webpack';
import initFeatures from '../config';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const noopFeature = () => ({});

module.exports = (
  {
    entry,
    production = process.env.NODE_ENV === 'production',
    node = false,
    browser = !node,
    hot = false,
    defines = {},
    template = './src/index.html',
    publicPath = '/',
    rootPath = fs.realpathSync(process.cwd()),
    distPath = browser ? 'static/dist' : 'server',
    cssPreprocessors = [],
    cssExclude = false,
    babelExclude = /node_modules/,
    emotion = false,
    library = false,
    legacy = false,
    externals = [],
    externalsWhitelist = undefined,
    modulesDir = 'node_modules',
    javascriptScopeHoisting = false,
    indexHtml = `${hot ? '' : '../'}index.html`,
  },
  extend = {},
  featuresOptions = {}
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
    namedModules,
    production: createProduction,
    node: createNode,
    externals: createExternals,
  } = initFeatures(env);

  const {
    entry: optsEntry = {},
    output: optsOutput = {},
    javascript: optsJavascript = {},
    styles: optsStyles = {},
    media: optsMedia = {},
    namedModules: optsNamedModules = {},
    define: optsDefine = {},
    production: optsProduction = {},
    externals: optsExternals = {},
    htmlWebpackPlugin: optsHtmlWebpackPlugin = {},
  } = featuresOptions;

  return createConfig(
    ...[
      createEntry({ entries: entry, hot, ...optsEntry }),
      javascript(
        {
          exclude: babelExclude,
          hot,
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
      namedModules(optsNamedModules),
      define({ ...defines, ...optsDefine }),
      createProduction({
        vendor: !library && browser && env.production,
        manifest: !library && browser && env.production,
        uglify: browser && env.production,
        concatenation: javascriptScopeHoisting,
        ...optsProduction,
      }),
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
      {
        plugins: []
          .concat(
            browser && !hot
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
        devtool: env.production ? 'source-map' : 'cheap-module-source-map',
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
