/*eslint-disable */

var webpack = require('webpack'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  FlowWebpackPlugin = require('flow-webpack-plugin'),
  HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  TerserPlugin = require('terser-webpack-plugin'),
  
  WriteFilePlugin = require('write-file-webpack-plugin'),
  env = require('./utils/env'),
  fileSystem = require('fs'),
  path = require('path');

// [FS] IRAD-1005 2020-07-07
// Upgrade outdated packages.
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var isDev = env.NODE_ENV === 'developmeexnt' || 0;
// isDev = false;

var options = {
    mode: isDev ? 'development' : 'production' ,
    entry: {
        'perry-white': path.join(__dirname, 'src', 'index.ts'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // https://stackoverflow.com/questions/51860043/javascript-es6-typeerror-class-constructor-client-cannot-be-invoked-without-ne
                    // ES6 classes are supported in any recent Node version, they shouldn't be transpiled. es2015 should be excluded from Babel configuration, it's preferable to use env preset set to node target.
                    presets: [['@babel/preset-env', { 'targets': { 'node': true } }], '@babel/preset-react', '@babel/preset-flow'],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        '@babel/plugin-proposal-export-default-from',
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                helpers: true,
                                regenerator: true,
                            },
                        ],
                        'flow-react-proptypes',
                        '@babel/plugin-proposal-object-rest-spread',
                        '@babel/plugin-transform-flow-strip-types',
                        '@babel/plugin-syntax-dynamic-import',
                    ],
                },
            },
            {
                test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: (url, resourcePath, context) => {
                                const relativePath = path.relative(context, resourcePath);
                                const cleaned = relativePath.replace(/src\//, '') // .replace(/fonts\/.*/, 'fonts');
                                return cleaned
                            },
                            // name: '[name].[ext]',
                            //              outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],

        // alias: {
        //   fonts: path.resolve(__dirname, 'src', 'ui', 'fonts'),
        // },
    },
    plugins: [
        new webpack.ProvidePlugin({
            // jQuery (for Mathquill)
            'window.jQuery': 'jquery',
        }),
        // type checker
        // ... (env.NODE_ENV === 'development') ? [new FlowWebpackPlugin({flowArgs: ['--show-all-errors']})] : [],

        // expose and write the allowed env vars on the compiled bundle
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'demo', 'index.html'),
            filename: 'index.html',
            chunks: ['perry-white'],
            inlineSource: isDev ? '$^' : '.(js|css)$'
        }),
        new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
        new WriteFilePlugin()
    ]
};

if (env.NODE_ENV === 'development') {
    options.devtool = 'source-map';
    options.optimization = {
        minimize: false
    }
    
} else {
    // [FS] IRAD-1005 2020-07-10
    // Upgrade outdated packages.
    options.optimization =  {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
}

module.exports = options;
