// @flow
export type Env = {|
  production: boolean,
  target: Object,
  rootPath: string,
  publicPath: string,
  distPath: string,
|};

export type Exact<T> = T & $Shape<T>;

export type Plugin = (Env, any) => any;

export type ExtendOption = {|
  plugins: Plugin[],
  next: (Env, Plugin[], any) => any,
|};
