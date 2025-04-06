const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "../src/render/main.ts"),
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "render.js"
    },
    module: {
        rules: [
            {test: /\.vue$/, use: "vue-loader"},
            {
                test: /\.css$/, 
                use: [
                    "vue-style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            esModule: false
                        }
                    }
                ]
            },
            {
                test: /\.ts$/, 
                use: [{
                    loader: "ts-loader",
                    options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                }]
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
        })
    ],
    resolve: {
        extensions: ['.vue', '.ts', ".js", ".json"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
            "vue$": "vue/dist/vue.esm-bundler.js"
        },
        
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "../dist")
        },
        compress: true,
        port: 8080,
        hot: true,
        open: false,
        devMiddleware: {
            writeToDisk: false,
        },
        client: {
            logging: "info",
            progress: true
        }
    }
}