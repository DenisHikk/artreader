import log from "electron-log/main";
import { FormatParams }  from "electron-log"

export function settingLog() {
    log.transports.console.format = `[{h}:{i}:{s}] [{level}] {label}: {text}`;
    log.transports.console.level = "debug";
    log.variables.label = "electron"
}