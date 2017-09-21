export const wrapLoaders = loaders => ({
  fallback: 'style-loader',
  use: loaders[0].loader === 'style-loader' ? loaders.slice(1) : loaders
});

const create = ExtractTextPlugin => ({ target, production, ...rest }) =>
  production
  ? [new ExtractTextPlugin({
      disable: !production,
      allChunks: true,
      ...rest
    })] 
  : [];

export default create;
