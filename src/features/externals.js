import nodeExternals from 'webpack-node-externals';

const reactExternals = [
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
];

export default ({ target, production }, { react = false, list = [] }) => {
  const builtInExternals = target.name === 'node' ? [nodeExternals()] : [];

  return {
    externals: builtInExternals
      .concat(react ? reactExternals : [])
      .concat(list),
  };
};
