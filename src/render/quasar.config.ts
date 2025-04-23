import quasarLang from 'quasar/lang/ru'
import * as quasarComponents from 'quasar';
import { configure } from 'quasar/wrappers';
export const quasarConfig = {
    components: quasarComponents,
    framework: {
        lang: "ru",
        iconSet: "material-icons",
        components: [],
        plugins: []
    },
    extras: [
        "material-icons"
    ]
};