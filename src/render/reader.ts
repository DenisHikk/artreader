import { createApp } from "vue"
import log from "electron-log/renderer"
import { Quasar } from "quasar"
import { quasarConfig } from "./quasar.config"
import ReaderView from "./core/views/ReaderView.vue"

import "@/render/core/style/quasar.variables.sass"
import "@/render/core/style/quasar.style.sass"
import "@quasar/extras/material-icons/material-icons.css"

log.variables.label = "render";

const reader = createApp(ReaderView);
reader.use(Quasar, quasarConfig);
reader.mount("#q-reader");