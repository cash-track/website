// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

// Stylistic rules live under `eslint.config.stylistic` in nuxt.config.ts.
export default withNuxt({
    rules: {
        'no-console': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-v-html': 'off'
    }
})
