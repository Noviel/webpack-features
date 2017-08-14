export default function createLoader(
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
  
    return { loader, options };
  }
