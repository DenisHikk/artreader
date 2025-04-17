import App from "./App.vue"
import { createApp } from "vue"
import log from "electron-log/renderer"
import quasarLang from 'quasar/lang/ru'
import { Quasar } from "quasar"
import * as quasarComponents from 'quasar';
log.variables.label = "render";

// import "@/render/style/quasar.variables.sass"
import "@/render/style/quasar.style.sass"

const app = createApp(App);
app.use(Quasar, {
    lang: quasarLang,
    components: quasarComponents,
    plugins: {},
    config: {}
  })
app.mount("#q-app");