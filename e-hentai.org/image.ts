import log4js from "log4js";
import { basename, join as pathJoin } from "node:path";
import { DOMParser } from "@b-fuze/deno-dom";
import { exists } from "@std/fs/exists";
import { DB, fetchHtml, sleep } from "./common.ts";
import { ImagePage, ImagePageRecord } from "./imagePage.ts";

const logger = log4js.getLogger(basename(import.meta.filename ?? ""));

export type ImageRecord = ImagePageRecord & {
    IsExist?: boolean;
    IsDownloadFinish?: boolean;
}

function parseHtml(record: ImageRecord, html: string) {
    if (html !== "") {
        const doc = new DOMParser().parseFromString(html, "text/html");
        record.ImagePageUrl = doc.querySelector("img#img")?.getAttribute("src") ?? "";
    }
}

async function imageDownload(record: ImageRecord): Promise<ImageRecord> {
    try {
        const [isSuccess, html] = await fetchHtml(record.Url, true, 30);
        if (isSuccess && html !== undefined) {
            parseHtml(record, html);
            await Deno.mkdir(record.Path, { recursive: true });
            const url = new URL(record.ImagePageUrl);
            const downloadname = basename(url.pathname);
            const save = pathJoin(record.Path, downloadname);
            logger.info(`${record.Url} -> ${save}`)
            if (await exists(save)) {
                logger.log(`IsExist,${save}`);
                record.IsDownloadFinish = true;
                record.IsExist = true;
                return { ...record };
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
                        logger.log(`retry, ${error},${record.Url},${index}`);
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
                        logger.log(`傳輸中斷,${record.Url},${error}`);
                        return { ...record };
                    }
                    await Deno.rename(saveTemp, save)
                    logger.log(`finish,${save}`);
                    record.IsDownloadFinish = true;
                    return { ...record };
                } else {
                    logger.log(`fail, ${response?.statusText},${record.Url}`);
                    return { ...record };
                }
            }
        }
        return { ...record };
    } catch (error) {
        logger.log(`fail, ${error},${record.Url}`);
        return { ...record };
    }
}

if (import.meta.main) {
    if (Deno.args.length >= 1) {
        const url = Deno.args[0];
        const finish: ImageRecord[] = [];
        // deno task e-hentai.imagePage https://e-hentai.org/g/3962355/69690a454f/
        if (url.startsWith("https://e-hentai.org/g/")) {
            const entries = DB.list({ prefix: [ImagePage.Key, url] });
            for await (const entry of entries) {
                const record = entry.value as ImageRecord;
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
                    await DB.set([ImagePage.Key, image.BookUrl, image.BookPageUrl, image.Url], image);
                    // logger.info(`save ${result.ok},${result.versionstamp}`);
                }
            }

        }
    } else {
        try {
            let run = true;
            do {
                const entries = DB.list({ prefix: [ImagePage.Key] });
                const pull: ImageRecord[] = [];
                const finish: ImageRecord[] = [];
                let max = 100;
                let j = 0;
                for await (const entry of entries) {
                    const record = entry.value as ImageRecord;
                    if (record.IsDownloadFinish) {
                        j++;
                        continue;
                    } else {
                        pull.push(record);
                        max--;
                    }
                    if (max <= 0) {
                        break;
                    }
                }
                console.log(`finish ${j}`);
                if (pull.length > 0) {
                    let i = 0;
                    for (const record of pull) {
                        const newRecord = await imageDownload(record);
                        if (newRecord.IsDownloadFinish) {
                            await DB.set([ImagePage.Key, record.BookUrl, record.BookPageUrl, record.Url], record);
                        }
                        if (++i % 10 === 0) {
                            logger.info(`finish,${++i}/${finish.length}`);
                        }
                    }
                } else { run = false; }
            } while (run)
        } catch (error) {
            logger.error(`${error}`)
        }
    }
    DB.close();
}