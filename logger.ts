import log4js from "log4js";
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        everything: {
            type: 'dateFile',
            filename: 'logs/app.log',      // Base filename
            pattern: 'yyyy-MM-dd-hh',         // Date format for rolling
            alwaysIncludePattern: true,    // Include date in the current log filename
            keepFileExt: true,              // Keep .log extension at the end (e.g., app.2024-05-27.log)
            numBackups: 168,
        }
    },
    categories: {
        default: { appenders: ['out', 'everything'], level: 'all' }
    }
});
export const logger = log4js.getLogger();