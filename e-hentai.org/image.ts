import log4js from "log4js";
import { basename, join as pathJoin } from "node:path";
import { DOMParser } from "@b-fuze/deno-dom";
import { exists } from "@std/fs/exists";
import { OpenDB, fetchHtml, sleep } from "./common.ts";
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

// async function connect(url: URL) {
//     if (url.protocol === "https:") {
//         return await Deno.connectTls({
//             hostname: url.hostname,
//             port: parseInt(url.port),
//             unsafelyDisableHostnameVerification: true,
//             alpnProtocols: ["h2", "http/1.1"]
//         });
//     } else {
//         return await Deno.connect({
//             hostname: url.hostname,
//             port: parseInt(url.port),
//         });
//     }
// }

const WatchDogCheckTimeout = 1000 * 60 * 5;
let WatchDogCheckUpdate = 0;
let WatchDogCheckTimeoutID: NodeJS.Timeout | undefined;
function ResetWatchDogCheck() {
    if (WatchDogCheckTimeoutID) {
        clearTimeout(WatchDogCheckTimeoutID);
    }
    WatchDogCheckUpdate = Date.now();
    WatchDogCheckTimeoutID = setTimeout(WatchDogCheck, WatchDogCheckTimeout);
}
function WatchDogCheck() {
    if (WatchDogCheckTimeoutID) {
        clearTimeout(WatchDogCheckTimeoutID);
    }
    if ((Date.now() - WatchDogCheckUpdate) > WatchDogCheckTimeout) {
        logger.error(`WatchDog TIMEOUT !!! ${WatchDogCheckTimeout / 1000} SEC`)
    } else {
        WatchDogCheckTimeoutID = setTimeout(WatchDogCheck, WatchDogCheckTimeout);
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
            // logger.info(`${record.Url} -> ${save}`)
            if (await exists(save)) {
                logger.log(`IsExist,${record.Url}`);
                record.IsDownloadFinish = true;
                record.IsExist = true;
                return { ...record };
            } else {
                let response: Response | undefined = undefined;
                for (let index = 0; index < 3; index++) {
                    const c = new AbortController();
                    const id = setTimeout(() => c.abort(), 10000);
                    try {
                        // const client = Deno.createHttpClient({ })
                        /*
                        fetch("https://pncjvjv.xrfkbwxztgmu.hath.network:4443/h/e3b3700d302626129b5c9e131acc73f851796bb4-226058-1280-1280-wbp/keystamp=1780155600-2d4b3c5286;fileindex=204827399;xres=1280/ComfyUI_temp_haiak_00001_.webp", {
                          "headers": {
                            "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Linux\""
                          },
                          "referrer": "https://e-hentai.org/",
                          "body": null,
                          "method": "GET",
                          "mode": "cors",
                          "credentials": "omit"
                        });
                        */
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
    const DB = await OpenDB();
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

        } else if (url === "count") {
            const entries = DB.list({ prefix: [ImagePage.Key] });
            let i = 0, j = 0;
            for await (const entry of entries) {
                const record = entry.value as ImageRecord;
                if (record.IsDownloadFinish) {
                    j++;
                } else {
                    i++
                }
                if ((i + j) % 10000 === 0) {
                    logger.log(`read ${i + j}`);
                }
            }
            logger.log(`total ${i + j}, ${i} for process , ${j} IsDownloadFinish`);
        } else if (url === "list" && Deno.args.length >= 2) {
            const entries = DB.list({ prefix: [ImagePage.Key, Deno.args[1]] });
            for await (const entry of entries) {
                logger.log(`${JSON.stringify(entry.key)},${entry.versionstamp},${JSON.stringify(entry.value)}`);
            }
        } else if (url === "set_finish" && Deno.args.length >= 4) {
            const entry = await DB.get([ImagePage.Key, Deno.args[1], Deno.args[2], Deno.args[3]]);
            if (entry) {
                const image = entry.value as ImageRecord;
                image.IsDownloadFinish = true;
                await DB.set([ImagePage.Key, image.BookUrl, image.BookPageUrl, image.Url], image);
                logger.info(`update finish`);
            } else {
                logger.info(`not find`);
            }
        }
    } else {
        try {
            let run = true;
            do {
                const entries = DB.list({ prefix: [ImagePage.Key] });
                const pull: ImageRecord[] = [];
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
                logger.log(`has finished=${j},process ${pull.length}`);
                if (pull.length > 0) {
                    let i = 0;
                    const tasks: Promise<undefined>[] = [];
                    for (const record of pull) {
                        tasks.push((async () => {
                            try {
                                const newRecord = await imageDownload(record);
                                if (newRecord.IsDownloadFinish) {
                                    await DB.set([ImagePage.Key, newRecord.BookUrl, newRecord.BookPageUrl, newRecord.Url], newRecord);
                                }
                                if (++i % 10 === 0) {
                                    logger.info(`finish,${i}/${pull.length}`);
                                }
                            } catch (error) {
                                logger.error(`${error}`)
                            }
                        })());
                        if (tasks.length > 1) {
                            ResetWatchDogCheck();
                            await Promise.allSettled(tasks);
                            tasks.length = 0;
                        }
                    }
                    if (tasks.length > 0) {
                        await Promise.allSettled(tasks);
                    }
                } else { run = false; }
            } while (run)
        } catch (error) {
            logger.error(`${error}`)
        }
    }
    DB.close();
    clearTimeout(WatchDogCheckTimeoutID);
}