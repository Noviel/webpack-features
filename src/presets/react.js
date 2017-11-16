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
    cssPreprocessor = null,
    emotion = false,
    library = false,
    legacy = false,
  },
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
    env.target = { node: 'current' };
  } else if (browser) {
    env.target = legacy ? { browsers: 'legacy' } : { browsers: 'modern' };
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
  } = initFeatures(env);

  return createConfig(
    ...[
      createEntry(entry, { hot }),
      javascript(
        {},
        [].concat(emotion ? require('../plugins/emotion').default() : [])
      ),
      styles({
        preprocessors: ['css'].concat(cssPreprocessor || []),
        extractFilename: library ? '[name].css' : undefined,
      }),
      media(),
      namedModules(),
      define(defines),
      createProduction({
        vendor: !library && browser && env.production,
        manifest: !library && browser && env.production,
        uglify: browser && env.production,
      }),
      node ? createNode() : noopFeature(),
      library
        ? {
            externals: [
              {
                react: {
                  root: 'React',
                  commonjs2: 'react',
                  commonjs: 'react',
                  amd: 'react',
                },
                'react-dom': {
                  root: 'ReactDOM',
                  commonjs2: 'react-dom',
                  commonjs: 'react-dom',
                  amd: 'react-dom',
                },
              },
            ],
          }
        : noopFeature(),
      output({
        library,
        filename: library ? '[name].js' : undefined,
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
                  filename: `${hot ? '' : '../'}index.html`,
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
