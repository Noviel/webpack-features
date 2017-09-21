export const wrapLoaders = loaders => ({
  fallback: 'style-loader',
  use: loaders[0].loader === 'style-loader' ? loaders.slice(1) : loaders
});

const create = ExtractTextPlugin => ({ target, production }) =>
  production
  ? [new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      disable: !production,
      allChunks: true
    })] 
  : [];

export default create;
