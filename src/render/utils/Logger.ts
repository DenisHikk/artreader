import pino, { Logger } from "pino";

const logger: Logger = pino({
    level: "debug",
    formatters: {
        bindings: (bindings) => {
            return {
                pid: bindings.pid, host: "Render"
            }
        }
    }
});

export default logger;