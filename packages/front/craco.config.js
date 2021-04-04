const { whenTest } = require('@craco/craco');

module.exports = {
  babel: {
    plugins: whenTest(() => ['require-context-hook'], []),
  },
};
