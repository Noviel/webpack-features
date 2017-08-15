const isObject = val => typeof val === 'object' && val !== null;

export default function createRule(loaders, { 
  exclude = /node_modules/,
  ...restOptions
} = {}) {
  if (!isObject(loaders)) {
    throw new Error('loaders should be an object');
  }

  return {
    use: loaders,
    exclude,
    ...restOptions
  };
}
