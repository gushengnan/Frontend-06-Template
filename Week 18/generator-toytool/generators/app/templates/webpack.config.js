// const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                },
            }
        ]
    },
    plugins: [
        // new HtmlWebpackPlugin({ template: './src/index.html' }),
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/*.html', to: '[name].[ext]' }
            ]
        })
    ]
}