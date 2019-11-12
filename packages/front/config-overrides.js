const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

module.exports = function override(config, env) {
  config.plugins = config.plugins.filter(plugin => {
    const isIgnoringPlugin =
      plugin.constructor.name === 'ForkTsCheckerWebpackPlugin' ||
      plugin instanceof ModuleScopePlugin;
    return !isIgnoringPlugin;
  });
  config.module.rules.some(rule => {
    if (Array.isArray(rule.use)) {
      const eslintUse = rule.use.find(item =>
        Object.keys(item.options).find(key => key === 'useEslintrc'),
      );
      const eslintOptions = eslintUse && eslintUse.options;
      if (eslintOptions) {
        eslintOptions.useEslintrc = true;
        return true;
      }
    }
    return false;
  });

  return config;
};
