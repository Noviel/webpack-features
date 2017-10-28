import webpack from 'webpack';

export default ({ target, production }, { env = true, ...rest } = {}) => {
  const defines = {};

  if (env) {
    if (env === true) {
      env = production ? 'production' : 'development';
    }
    defines['process.env.NODE_ENV'] = JSON.stringify(env);
  }

  Object.keys(rest).forEach(key => {
    defines[key] = JSON.stringify(rest[key]);
  });

  return new webpack.DefinePlugin(defines);
};
