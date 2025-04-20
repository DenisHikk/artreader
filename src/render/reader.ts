import { createApp } from "vue"
import log from "electron-log/renderer"
import quasarLang from 'quasar/lang/ru'
import { Quasar } from "quasar"
import * as quasarComponents from 'quasar';
import "@/render/core/style/quasar.variables.sass"
import "@/render/core/style/quasar.style.sass"
import "@quasar/extras/material-icons/material-icons.css"
import ReaderView from "./core/views/ReaderView.vue"
log.variables.label = "render";

const reader = createApp(ReaderView);
reader.use(Quasar, {
    lang: quasarLang,
    components: quasarComponents,
    plugins: {},
    config: {},
    framework: {
        IconSet: "material-icons",
    }
});
reader.mount("#q-reader");