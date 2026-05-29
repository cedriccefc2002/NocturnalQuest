import { logger } from "./logger.ts";
import { DOMParser } from "@b-fuze/deno-dom";
import { join as pathJoin } from "node:path";
import { dirAllFileCounts } from "./common.ts"
import { getRandomPxoxy } from "./proxy.ts";

const basedir = "/media/cefc/Data/Data/e-hentai/";
const baseUrl = "https://e-hentai.org"
const exts = [".webp", ".jpg", ".png", ".gif"]

const checkList: [dir: string, url: string, count: number][] = [];
for await (const entry of Deno.readDir(basedir)) {
    if (entry.isDirectory && entry.name.startsWith("_g_")) {
        const totalFiles = await dirAllFileCounts(pathJoin(basedir, entry.name), exts);
        const url = `${baseUrl}${entry.name.replaceAll("_", "/")}`
        logger.log(`${entry.name} ${totalFiles} ${url}`);
        checkList.push([entry.name, url, totalFiles])
    }
}
if (checkList.length > 0) {
    const p = /Showing [\d]* - [\d]* of ([\d]+) images/;
    const client = await getRandomPxoxy();
    for (const [dir, url, count] of checkList) {
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
                client,
            });
            if (resp.ok) {
                // logger.log(`ok, ${url}`);
                const html = await resp.text();
                const doc = new DOMParser().parseFromString(html, "text/html");
                const totalmsg = doc.querySelector(".gpc");
                if (totalmsg) {
                    const match = totalmsg.textContent.match(p);
                    if (match) {
                        const totalImages = parseInt(match[1]);
                        if (totalImages !== count) {
                            logger.error(`fail,${url},${dir},${count},${totalImages}`);
                        }
                    }
                }
            }
        } catch (error) {
            logger.error(`error, ${error},${url},${dir}`);
        }
    }
}