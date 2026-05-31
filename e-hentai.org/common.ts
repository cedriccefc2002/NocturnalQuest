import { join as pathJoin, basename } from "node:path";
import log4js from "log4js";
import { getRandomPxoxy } from "../proxy.ts";
log4js.configure({
    appenders: {
        out: { type: 'stdout' },
        everything: {
            type: 'dateFile',
            filename: 'logs/hentai.log',      // Base filename
            pattern: 'yyyy-MM-dd-hh',         // Date format for rolling
            alwaysIncludePattern: true,    // Include date in the current log filename
            keepFileExt: true,              // Keep .log extension at the end (e.g., app.2024-05-27.log)
            daysToKeep: 7,
        }
    },
    categories: {
        default: { appenders: ['out', 'everything'], level: 'all' }
    }
});
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const logger = log4js.getLogger(basename(import.meta.filename ?? ""));
export const cfg = {
    baseUrl: "https://e-hentai.org",
    basedir: "/media/cefc/Data/Data/e-hentai",
    exts: [".webp", ".jpg", ".png", ".gif"]
}
const dbPath = pathJoin(cfg.basedir, "index.db");
logger.info(`OpenDB`);
export const DB = await Deno.openKv(dbPath);


let client = await getRandomPxoxy();
let lastChangeProxyUpdate = 0;
async function ChangeProxyUpdate(force: boolean = false) {
    // 強制或是超過30分鐘
    if (force || (Date.now() - lastChangeProxyUpdate) > 1000 * 60 * 30) {
        client = await getRandomPxoxy();
        logger.log(`切換proxy`);
        lastChangeProxyUpdate = Date.now();
    }
}

export async function fetchHtml(url: string, useProxy: boolean, timeoutSec: number): Promise<[isSuccess: boolean, result: string | undefined]> {
    const c = new AbortController();
    const id = setTimeout(() => c.abort(), timeoutSec * 1000);
    try {
        const resp = await fetch(url, {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "max-age=0",
                "priority": "u=0, i",
                "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1"
            },
            "referrer": "https://e-hentai.org/",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include",
            "signal": c.signal,
            client: useProxy ? client : undefined,
        });
        if (resp.ok) {
            const html = await resp.text();
            return [true, html];
        } else {
            logger.log(`retry, ${resp.statusText},${url}`);
            return [false, undefined];
        }
    } catch (error) {
        logger.log(`retry, ${error},${url}`);
        return [false, undefined];
    } finally {
        clearTimeout(id);
    }
}
