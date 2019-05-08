module.exports = function override(config, env) {
  config.plugins = config.plugins.filter(plugin => {
    return plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin';
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
