const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production', // "production" | "development" | "none"
    entry  : './dashboard/src/js/index.js',
    output : {
        path: path.resolve(__dirname, './dashboard/dist/js/'),
        filename : 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', // translates CSS into CommonJS
                    'sass-loader' // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: './dashboard/src/images/', to: '../images/' },
            { from: './dashboard/src/css/', to: '../css/' },
            { from: './node_modules/@mozilla-protocol/core/protocol/', to: '../protocol/' }
        ]),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '../css/[name].css',
            chunkFilename: '../css/[id].css'
        })
    ]
};
