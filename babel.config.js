module.exports = {
    presets: [
        ['@babel/preset-env', {
            useBuiltIns: 'entry',
            corejs: 3,
            debug: false,
            targets: ['>1%', 'last 2 versions', 'not op_mini all', 'not ie > 0', 'safari >= 10', 'iOS > 8', 'not dead']
        }],
        '@babel/preset-react',
        '@babel/typescript'
    ],
    'plugins': [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-export-default-from',

        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-parameters',
        [
            '@babel/plugin-transform-runtime',
            {
                'helpers': false,
                'regenerator': true,
                'absoluteRuntime': 'babel-runtime'
            }
        ],
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-json-strings',
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true
            }
        ],
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions',
        '@babel/plugin-proposal-logical-assignment-operators',
        '@babel/plugin-proposal-optional-chaining',
        [
            '@babel/plugin-proposal-pipeline-operator',
            {
                'proposal': 'minimal'
            }
        ],
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-do-expressions'
    ],
    'env': {
        'development': {
            'plugins': [
                'react-refresh/babel'
            ]
        }
    }
}
