const _ = require('lodash');

function isWebpackLocal(path) {
  return path.indexOf('./') === 0 && path.indexOf('./~/') === -1;
}
function selectLocalModules(stats) {
  return stats.modules.filter(module => isWebpackLocal(module.name));
}
// check if has nested modules
const reg = /\+ \d{0,3} modules/g;
function hasMore(m) {
  return m.name && reg.test(m.name);
}
function insertModules(full, modules) {
  _.forEach(modules, (module, idx) => {
    const exist = _.some(full, m => m.name === module.name);
    if (!exist) {
      if (hasMore(module)) {
        insertModules(full, module.modules);
      } else {
        full.push(module);
      }
    }
  });
}

function flattenModules(modules) {
  const full = [];
  insertModules(full, modules);
  return full;
}
function getLocalModules(stats) {
  return flattenModules(selectLocalModules(stats));
}
function getLocalModuleNames(stats) {
  // console.log('getLocalModuleNames: ', stats.modules);
  const localModules = getLocalModules(stats);
  // console.log('localModules: ', localModules);
  const localModuleNames = localModules.map(m => m.name);
  return localModuleNames;
}
module.exports.getLocalModules = getLocalModules;
module.exports.getLocalModuleNames = getLocalModuleNames;
