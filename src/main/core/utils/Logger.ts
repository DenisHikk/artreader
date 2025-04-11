import pino, { Logger } from "pino";

const logger: Logger = pino({
    level: "debug",
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid, hostname"
        }
    }
});

export default logger;