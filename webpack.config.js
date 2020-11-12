/*eslint-disable */

const webpack = require('webpack'),
      CopyWebpackPlugin = require('copy-webpack-plugin'),
      HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      TerserPlugin = require('terser-webpack-plugin'),
      ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'),
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
        'styles': path.join(__dirname, 'src', 'styles.scss'),
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
                            }
                            // name: '[name].[ext]',
                            //              outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            // Prefer `dart-sass`
                            implementation: require('sass'),
                        },
                    },
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

        // expose and write the allowed env vars on the compiled bundle
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'demo', 'index.html'),
            filename: 'index.html',

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
    options.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
    )
    options.plugins.push(
        new ReactRefreshWebpackPlugin(),
    )
} else {
    // [FS] IRAD-1005 2020-07-10
    // Upgrade outdated packages.
    options.optimization =  {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
}

module.exports = options;
