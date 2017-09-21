import { createCSSLoader } from '../loaders/style-chain-loader';

export const createStyleRule = ({ target, production }, { 
  preprocessor,
  postcss, 
  modules = false, 
  modulesPath 
}, restOptions = {}) => {
  const loader = createCSSLoader(
    { target, production, useStyleLoader: true },
    { modules, minimize: production },
    (props, { target, production }) => {
      return {
        ...props,
        options: {
          ...props.options,
          localIdentName: production ? '[hash:base64]' : '[path][name]__[local]--[hash:base64:5]' 
        }
      };
    }
  );

  if (postcss) {
    loader.add('postcss-loader', postcss);
  }

  if (preprocessor === 'scss') {
    loader.add('sass-loader');
  } else if (preprocessor === 'less') {
    loader.add('less-loader');
  }

  const test =  preprocessor === 'scss' ? /\.scss$/i :
                preprocessor === 'less' ? /\.less$/i :
                preprocessor === 'emotion' ? /emotion\.css$/ :
                /\.css$/i;

  const options = {};

  if (modules) {
    options.include = modulesPath;
    options.exclude = /emotion\.css$/;
  } else {
    if (preprocessor !== 'emotion') {
      options.exclude = modulesPath;
    }
  }
  
  return {
    test,
    use: loader.get(),
    ...options,
    ...restOptions
  };
};
