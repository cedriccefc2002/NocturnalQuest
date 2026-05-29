import log4js from "log4js";
const logger = log4js.getLogger(import.meta.filename);
import { basename, join as pathJoin } from "node:path";
import { exists } from "@std/fs/exists";
import { DB, sleep } from "./common.ts";
import { ImagePage, ImagePageRecord } from "./imagePage.ts";


async function imageDownload(img: ImagePageRecord): Promise<ImagePageRecord> {
    try {
        await Deno.mkdir(img.Path, { recursive: true });
        const url = new URL(img.ImagePageUrl);
        const downloadname = basename(url.pathname);
        const save = pathJoin(img.Path, downloadname);
        if (await exists(save)) {
            logger.log(`IsExist,${save}`);
            img.IsDownloadFinish = true;
            img.IsExist = true;
            return { ...img };
        } else {
            let response: Response | undefined = undefined;
            for (let index = 0; index < 5; index++) {
                const c = new AbortController();
                const id = setTimeout(() => c.abort(), 10000);
                try {
                    response = await fetch(url, {
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
                        "signal": c.signal
                    });
                    break;
                } catch (error) {
                    logger.log(`retry, ${error},${img.Url},${index}`);
                    await sleep(10000);
                    continue;
                } finally {
                    clearTimeout(id);
                }
            }
            if (response?.ok) {
                logger.log(`ok,${save}`);
                // Open (or create) the file for writing
                const saveTemp = `${save}.download`;
                const file = await Deno.open(saveTemp, { create: true, write: true });
                // Pipe the response body stream directly to the file
                try {
                    await response.body?.pipeTo(file.writable);
                } catch (error) {
                    logger.log(`傳輸中斷,${img.Url},${error}`);
                    return { ...img };
                }
                await Deno.rename(saveTemp, save)
                logger.log(`finish,${save}`);
                img.IsDownloadFinish = true;
                return { ...img };
            } else {
                logger.log(`fail, ${response?.statusText},${img.Url}`);
                return { ...img };
            }
        }
    } catch (error) {
        logger.log(`fail, ${error},${img.Url}`);
        return { ...img };
    }
}

if (import.meta.main) {
    if (Deno.args.length >= 1) {
        const url = Deno.args[0];
        const finish: ImagePageRecord[] = [];
        // deno task e-hentai.imagePage https://e-hentai.org/g/3962355/69690a454f/
        if (url.startsWith("https://e-hentai.org/g/")) {
            const entries = DB.list({ prefix: [ImagePage.Key, url] });
            for await (const entry of entries) {
                const record = entry.value as ImagePageRecord;
                logger.info(`IsDownloadFinish=${record.IsDownloadFinish},${record.Url}`);
                if (record.IsDownloadFinish) {
                    logger.info(`${record.Url} IsDownloadFinish`);
                } else {
                    const newRecord = await imageDownload(record);
                    logger.info(`${newRecord.IsDownloadFinish},${record.Url}`);
                    if (newRecord.IsDownloadFinish) {
                        finish.push(newRecord);
                    }
                }
            }
            if (finish.length) {
                for (const image of finish) {
                    logger.info(JSON.stringify(image));
                    const result = await DB.set([ImagePage.Key, image.BookUrl, image.BookPageUrl, image.Url], image);
                    logger.info(`save ${result.ok},${result.versionstamp}`);
                }
            }
            DB.close();
        }
    }
}