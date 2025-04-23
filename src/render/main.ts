import App from "./App.vue"
import { createApp } from "vue"
import log from "electron-log/renderer"
import { Quasar } from "quasar"

import "@/render/core/style/quasar.variables.sass"
import "@/render/core/style/quasar.style.sass"
import "@quasar/extras/material-icons/material-icons.css"
import { quasarConfig } from "./quasar.config"

log.variables.label = "render";

const app = createApp(App);
app.use(Quasar, quasarConfig)
app.mount("#q-app");
