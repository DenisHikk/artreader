import App from "./App.vue"
import { createApp } from "vue"
import log from "electron-log/renderer"
log.variables.label = "render";

const app = createApp(App).mount("#app");