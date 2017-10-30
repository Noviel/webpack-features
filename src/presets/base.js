import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import initFeatures from '../config';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const noopFeature = () => ({});

module.exports = ({
  entry,
  production = process.env.NODE_ENV === 'production',
  node = false,
  browser = !node,
  hot = false,
  defines = {},
  template = './src/index.html',
  publicPath = '/',
  rootPath = fs.realpathSync(process.cwd()),
  distPath = path.resolve(rootPath, browser ? 'static/dist' : 'server'),
}) => {
  const env = {
    publicPath,
    distPath,
    rootPath,
    production,
  };

  if (node) {
    env.target = { node: 'current' };
  } else if (browser) {
    env.target = production ? { browsers: 'legacy' } : { browsers: 'modern' };
  } else {
    throw new Error(
      `Target is not defined. Either 'browser' or 'node' should be true.`
    );
  }

  const {
    createConfig,
    entry: createEntry,
    javascript,
    styles,
    media,
    emotion,
    define,
    namedModules,
    production: createProduction,
    node: createNode,
  } = initFeatures(env);

  return createConfig(
    ...[
      createEntry(entry, { hot }),
      javascript(),
      styles(),
      emotion(),
      media(),
      namedModules(),
      define(defines),
      createProduction({ uglify: browser && env.production }),
      node ? createNode() : noopFeature(),
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
        output: {
          // https://reactjs.org/docs/cross-origin-errors.html
          crossOriginLoading: env.production ? false : 'anonymous',
          path: env.distPath,
          publicPath: browser ? env.publicPath : '/',
          filename:
            env.production && browser ? '[name].[chunkhash].js' : '[name].js',
          chunkFilename: env.production
            ? '[name].[chunkhash].chunk.js'
            : '[name].chunk.js',
        },
        stats: {
          children: false,
          modules: false,
        },
      },
    ]
  );
};
