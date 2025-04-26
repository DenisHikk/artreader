const path = require("path");

module.exports = {
    target: "electron-renderer",
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "../src/main/main.ts"),
        preload: path.resolve(__dirname, "../src/main/preload.ts")
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {test: /\.ts$/, use: "ts-loader"},
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