const path = require("path");

module.exports = {
    target: "electron-renderer",
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "../src/platform/main.ts"),
        mainPreload: path.resolve(__dirname, "../src/preload/mainPreload.ts")
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader" },
            { test: /\.node$/, use: "node-loader" }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@": path.resolve(__dirname, "../src"),
            "@common": "../src/common/"
        }
    },
    plugins: [

    ],
}