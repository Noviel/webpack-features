const isObject = val => typeof val === 'object' && val !== null;

export function createLoader(
  name, 
  options = {}, 
  { nameOverride = null } = {}
) {
  if (typeof name !== 'string') {
    throw new Error('name should be a string');
  }

  let loader = `${name}`;
  
  if (typeof nameOverride === 'string' ) {
    loader = nameOverride;
  } else if (typeof nameOverride === 'function') {
    loader = nameOverride(name, options);
  } 

  return { 
    loader,
    options: { ...options } 
  };
}

export function createRule(loaders, { 
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
