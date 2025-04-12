import log, { FormatParams } from "electron-log";
import util from "node:util"

// interface FormatParams {
//     data: any[];
//     level: LogLevel;
//     logger: Logger;
//     message: LogMessage;
//     transport: Transport;
// }

log.transports.console.format = ({data, level, message}) => {
    const text = util.format(...data);
    const timestapm = `${message.date.getHours()}:${message.date.getMinutes()}:${message.date.getSeconds()}`;
    return [
        timestapm,
        `[${level.toUpperCase()}]`,
        `Render: ${text}`,
    ];
};


export default log;