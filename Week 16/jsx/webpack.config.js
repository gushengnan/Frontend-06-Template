module.exports = {
    entry: {
        main: './main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }], "@babel/plugin-proposal-class-properties"]
                    }
                }
            }
        ]
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
}