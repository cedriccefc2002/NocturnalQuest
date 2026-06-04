import log4js from "log4js";
export const getLogger = (category?: string) => log4js.getLogger(category);
export const configure = (filename: string) => log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        everything: {
            type: 'dateFile',
            filename: filename,      // Base filename
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