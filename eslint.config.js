// @ts-expect-error missing types
import shuunen from 'eslint-plugin-shuunen'

export default [
  ...shuunen.configs.base,
  ...shuunen.configs.browser,
  // ...shuunen.configs.node,
  // ...shuunen.configs.typescript,
  ...shuunen.configs.vue,
  {
    name: 'project-overrides',
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'vue/order-in-components': 'off',
    },
  },
]
