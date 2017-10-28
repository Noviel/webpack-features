import webpack from 'webpack';

export default (
  { target, production },
  {
    __prefix = 'process.env.',
    NODE_ENV = production ? 'production' : 'development',
    ...rest
  } = {}
) => {
  const defines = {};

  if (NODE_ENV) {
    defines['process.env.NODE_ENV'] = JSON.stringify(NODE_ENV);
  }

  Object.keys(rest).forEach(key => {
    defines[`${__prefix}${key}`] = JSON.stringify(rest[key]);
  });

  return new webpack.DefinePlugin(defines);
};
