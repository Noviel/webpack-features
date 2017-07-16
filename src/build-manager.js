import { isServer, isClient } from './target';
import EntryManager from './entry-manager';

const noop = () => {};

const createBuildManager = ({ BUILD_APPS, target, production }, { plugins }) => {
  const entryManager = new EntryManager({ plugins });

  const isEntryInBuildList = entry => BUILD_APPS.indexOf(entry.name) > -1;
  const isEntryHasCurrentEnv = entry => production ? entry.production : entry.development;
  const isNeedToAddEntry = entry => isEntryHasCurrentEnv(entry) && isEntryInBuildList(entry);

  const addEntry = checkTarget => {
    if (!checkTarget(target)) {
      return noop;
    }
    return entry => isNeedToAddEntry(entry) && entryManager.add(entry);
  };

  return {
    addClientEntry: addEntry(isClient),
    addServerEntry: addEntry(isServer),

    entries() { return entryManager.getEntries({ production }); },
    plugins() { return entryManager.getPlugins({ production }); }
  };
};

export default createBuildManager;
