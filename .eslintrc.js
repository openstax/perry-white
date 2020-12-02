module.exports = {
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'sourceType': 'module',
        'allowImportExportEverywhere': false,

        'codeFrame': true,
        'ecmaFeatures': {
            'jsx': true
        },
    },
    'plugins': [
        'react',
        '@typescript-eslint'
    ],
    'rules': {
        'react/jsx-sort-props': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'consistent-return': 'error',
        'no-debugger': 'error',
        'no-invalid-regexp': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-undef': 'error',
        'no-unused-expressions': 'off',
        'no-unused-vars': ['error', { 'vars': 'all', 'args': 'none', 'ignoreRestSiblings': false }],
        'no-var': 'error',
        'prefer-const': 'error',
        'quotes': [2, 'single', { 'avoidEscape': true }],
        'semi': ['error', 'never'],
        'indent': ['error', 4, {  'SwitchCase': 1 }],
        'strict': 0
    },
    'globals': {
        '__dirname': false,
        '$ReadOnlyArray': false,
        'Blob': false,
        'Class': false,
        'Component': false,
        'Document': true,
        'Element': false,
        'Event': false,
        'Image': false,
        'Map': false,
        'MouseEvent': false,
        'MutationObserver': false,
        'Promise': false,
        'Set': false,
        'SyntheticEvent': false,
        'SyntheticInputEvent': false,
        'SyntheticMouseEvent': false,
        'cancelAnimationFrame': false,
        'clearTimeout': false,
        'console': false,
        'document': false,
        'module': false,
        'process': false,
        'require': false,
        'requestAnimationFrame': false,
        'setTimeout': false,
        HTMLElement: false,
        HTMLDivElement: false,
        HTMLButtonElement: false,
        HTMLInputElement: false,
        'window': false
    }
}
