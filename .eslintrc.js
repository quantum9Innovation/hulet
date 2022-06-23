module.exports = {
    extends: ['plugin:prettier/recommended', 'eslint:recommended'],
    plugins: ['prettier'],
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
    },
}
