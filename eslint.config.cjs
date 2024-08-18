'use strict'

// @ts-expect-error missing types
const shuunen = require('eslint-plugin-shuunen')

module.exports = [
  ...shuunen.configs.base,
  ...shuunen.configs.browser,
  // ...shuunen.configs.node,
  // ...shuunen.configs.typescript,
  shuunen.configs.vue,
  {
    name: 'project-overrides',
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'vue/order-in-components': 'off',
    },
  },
]
