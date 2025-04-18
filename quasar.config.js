const { configure } = require("@quasar/app-webpack");
const { IconSet } = require("quasar");
module.exports = configure(function (ctx) {
    console.log(ctx);
    return {
        electron: {
            bundler: "builder",
            chainWebpackMain(chain) {
                chain.plugins("define").use(require("webpack").DefinePlugin, [{
                    __VUE_OPTIONS_API__: true,
                    __VUE_PROD_DEVTOOLS__: false
                }])
            }
        },
        framework: {
            components: [
                'QLayout',
                'QPageContainer',
                'QPage',
                'QList',
                'QItem',
                'QItemSection',
                'QRating',
                'QImg'
            ],
            plugins: []
        },
        build: {
            vueLoaderOptions: {
                compilerOptions: {
                    isCustomElement: tag => tag.startWith("q-")
                }
            }
        },
        framework: {
            IconSet: "material-icons"
        },
        extras: [
            "material-icons"
        ]
    }
});