const path = require('path')
const webpack = require('webpack')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
        main: './demo/client/index.js',
        styles: path.join(__dirname, 'src', 'styles.scss'),
    },
    output: {
        path: path.join(__dirname, 'demo', 'build'),
        filename: '[name].bundle.js',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,

                use: [
                    isDevelopment && {
                        loader: 'babel-loader',
                        options: { plugins: ['react-refresh/babel'] },
                    },
                    {
                        loader: 'ts-loader',
                        options: { transpileOnly: true },
                    },
                ].filter(Boolean),
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
                            implementation: require('sass'), // dart-sass
                        },
                    },
                ],
            },

        ],
    },
    plugins: [
        isDevelopment && new ReactRefreshPlugin(),
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './demo/index.html',
        }),
        new webpack.ProvidePlugin({
            // jQuery (for Mathquill)
            'window.jQuery': 'jquery',
        }),

    ].filter(Boolean),
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    devServer: {
        hot: true,
        port: 3008,
    }
}
