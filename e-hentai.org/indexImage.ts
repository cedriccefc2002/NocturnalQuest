import log4js from "log4js";
import { basename, join as pathJoin } from "node:path";
import { exists } from "@std/fs/exists";
import { cfg, OpenDB, client, sleep } from "./common.ts";
import { Book, BookRecord } from "./book.ts";
const logger = log4js.getLogger(basename(import.meta.filename ?? ""));
async function indexImageDownload(record: BookRecord) {
    try {
        if (record.IsSuccess && record.IndexImgUrl !== undefined && record.IndexImgUrl !== "") {
            const url = new URL(record.IndexImgUrl);
            const downloadname = basename(url.pathname);
            const saveDir = cfg.indexImagebasedir;
            const save = pathJoin(saveDir, downloadname);
            logger.debug(save);
            // await Deno.mkdir(saveDir, { recursive: true });
            if (await exists(save)) {
                logger.log(`IsExist,${record.Url},${save}`);
            } else {
                let response: Response | undefined = undefined;
                for (let index = 0; index < 3; index++) {
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
                            "signal": c.signal,
                            client,
                        });
                        break;
                    } catch (error) {
                        logger.log(`Fecth Header Error,${record.Url},${error},retry ${index}`);
                        await sleep(10000);
                        continue;
                    } finally {
                        clearTimeout(id);
                    }
                }
                if (response?.ok) {
                    logger.log(`ok,${record.Url}`);
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
                    logger.log(`finish,${record.Url}`);
                } else {
                    logger.log(`fail, ${response?.statusText},${record.Url}`);
                }
            }
        }
    } catch (error) {
        logger.log(`fail, ${error},${record.Url}`);
    }
}

if (import.meta.main) {
    const DB = await OpenDB();
    const entries = DB.list({ prefix: [Book.Key] });
    let i = 0;
    for await (const entry of entries) {
        const record = entry.value as BookRecord;
        if (record.IsSuccess && record.IndexImgUrl && record.IndexImgUrl !== "") {
            await indexImageDownload(record);
            i++;
        }
    }
    logger.info(i);
    DB.close();
}