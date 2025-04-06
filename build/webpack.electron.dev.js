const path = require("path");

module.exports = {
    target: "electron-renderer",
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "../src/electron/index.ts"),
        preload: path.resolve(__dirname, "../src/electron/preload/preloder.ts")
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
        extensions: [".ts", ".js"]
    },
    plugins: [
        
    ]
}