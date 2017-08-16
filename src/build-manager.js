import { isServer, isClient } from './target';
import EntryManager from './entry-manager';

const isObject = o => typeof o === 'object' && o !== null;

const validateAppConfig = config => {
  if (!isObject(config)) {
    throw new Error(`config should be an object. Instead got ${typeof config}.`);
  }
  if (Object.keys(config).length < 1) {
    throw new Error(`config should not be empty`);
  }

  if (Object.keys(config).forEach(k => {
    if (!isObject(config[k])) {
      throw new Error(`Every key in config should be an object, but got key ${k} with type ${typeof config[k]} `);
    }
  }));

  return true;
};

const createBuildManager = (
  { BUILD_APPS = '*', target, production }, 
  { plugins = {}, pluginsOptionsCreators = {} } = {}
) => {
  const entryManager = new EntryManager({ target, production }, { plugins, pluginsOptionsCreators });
  const checkTarget = isServer(target) ? isServer : isClient;
  const appInList = app => BUILD_APPS === '*' || BUILD_APPS.indexOf(app) > -1;

  return {
    addEntries(config, replacers) {
      if (!validateAppConfig(config)) {
        return false;
      }

      Object.keys(config).forEach(key => {
        const entryConfig = config[key];
        if (checkTarget(entryConfig.target) && appInList(entryConfig.name)) {
          entryManager.add(entryConfig, replacers);
        }
      });
    },

    entries() { return entryManager.getEntries(); },
    plugins() { return entryManager.getPlugins(); }
  };
};

export default createBuildManager;
