const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const { DefinePlugin } = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const sass = require("sass");

module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "../src/render/main.ts"),
        reader: path.resolve(__dirname, "../src/render/reader.ts")
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "script/[name].js"
    },
    module: {
        rules: [
            { 
                test: /\.vue$/, 
                use: "vue-loader",
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    "style-loader",
                    "css-loader",
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: sass,
                            sassOptions: {
                                indentedSyntax: true,
                            },
                        },
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
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/static"},
                // { from: "./node_modules/pdfjs-dist/web/pdf_viewer.css"}
            ]
        }),
    ],
    resolve: {
        extensions: ['.vue', '.ts', ".js", ".json"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
            "vue$": "vue/dist/vue.esm-bundler.js",
            "@common": "../src/common/"
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