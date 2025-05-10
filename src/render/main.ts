import App from "./App.vue"
import { createApp } from "vue"
import log from "electron-log/renderer"
import { Quasar } from "quasar"

import "@/render/core/style/quasar.variables.scss"
import "@/render/core/style/quasar.style.scss"
import "@quasar/extras/material-icons/material-icons.css"
import { quasarConfig } from "./quasar.config"
import { PluginsManagerRender } from "./core/models/plugins/PluginsManagerRender"
import { PDFReader } from "./core/models/plugins/PDFReader"
import { EPUBReader } from "./core/models/plugins/EPUBReader"

log.variables.label = "render";

PluginsManagerRender.getInstance().registryReader(new PDFReader());
PluginsManagerRender.getInstance().registryReader(new EPUBReader());

const app = createApp(App);
app.use(Quasar, quasarConfig)
app.mount("#q-app");
