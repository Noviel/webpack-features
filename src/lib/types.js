// @flow
export type TargetInput = true | string;
export type TargetValue = ?(string[] | string);

export type BrowsersTarget = { name: 'browsers', value: TargetInput };
export type NodeTarget = { name: 'node', value: TargetInput };

export type Target = NodeTarget | BrowsersTarget;

export type Env = {|
  production: boolean,
  target: Target,
  rootPath?: string,
  publicPath?: string,
  distPath?: string,
|};

export type Exact<T> = T & $Shape<T>;

export type Plugin = (Env, any) => any;

export type PluginExtendOptions = {|
  plugins: Plugin[],
  next: (Env, Plugin[], any) => any,
|};
