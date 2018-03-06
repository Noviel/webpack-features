export const notContain = exclusion => `^(?:(?!${exclusion}).)*`;

export const includeExclude = (key, test, exclude) =>
  new RegExp(`${exclude ? notContain(key) : key}${test}$`, 'i');
