import { DOMParser } from "@b-fuze/deno-dom";
import { basename, join as pathJoin } from "node:path";
import { exists } from "@std/fs/exists";
import { logger } from "./logger.ts";

import { getRandomPxoxy } from "./proxy.ts";

const basedir = "/media/cefc/Data/Data/e-hentai/";

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
// 每10分鐘檢查一次
setInterval(ChangeProxyUpdate, 1000 * 60 * 10);

type image = {
    imageUrl: string;
    isExists: boolean;
    isSuccess: boolean;
    outpath: string;
    save: string;
}
type imagePage = {
    pageIndex: number;
    url: string;
    isSuccess: boolean;
    imageUrl: string;
    image?: image;
}

type book = {
    dir: string;
    maxPage: number;
    startPageNo: number;
    title: string;
    url: string;
    pageurls: string[];
    pages: imagePage[];
    failbookpageurl: string[];
    isSuccess: boolean;
}

type bookList = {
    startIndex: number;
    url: string;
    bookurls: string[];
    books: book[];
    isSuccess: boolean;
}

async function BookList(url: string): Promise<bookList> {
    const result: bookList = {
        startIndex: 0,
        url,
        bookurls: [],
        books: [],
        isSuccess: false,
    }
    try {
        const resp = await fetch(encodeURI(url), {
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
            const html = await resp.text();
            // const html = await Deno.readTextFile("e-hentai.org.html");
            const doc = new DOMParser().parseFromString(html, "text/html");
            const links = doc.querySelectorAll("a")!;
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/g/")) {
                    result.bookurls.push(href)
                }
            }
            result.isSuccess = true;
            return result;
        } else {
            logger.log(`${resp.statusText},${url}`);
        }
    } catch (error) {
        logger.log(`${error},${url}`);
    }
    return result;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function imageDownload(outpath: string, imageUrl: string): Promise<image> {
    const result: image = {
        imageUrl,
        outpath,
        save: "",
        isSuccess: false,
        isExists: false,
    }
    try {
        await Deno.mkdir(outpath, { recursive: true });
        const url = new URL(imageUrl);
        const downloadname = basename(url.pathname);
        result.save = pathJoin(outpath, downloadname);
        if (await exists(result.save)) {
            logger.log(`exists,${result.save}`);
            result.isSuccess = true;
            result.isExists = true;
            return result;
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
                    logger.log(`retry, ${error},${imageUrl},${index}`);
                    await sleep(10000);
                    continue;
                } finally {
                    clearTimeout(id);
                }
            }
            if (response?.ok) {
                logger.log(`ok,${result.save}`);
                // Open (or create) the file for writing
                const saveTemp = `${result.save}.download`;
                const file = await Deno.open(saveTemp, { create: true, write: true });
                // Pipe the response body stream directly to the file
                try {
                    await response.body?.pipeTo(file.writable);
                } catch (error) {
                    logger.log(`傳輸中斷,${imageUrl},${error}`);
                    return result;
                }
                await Deno.rename(saveTemp, result.save)
                logger.log(`finish,${result.save}`);
                result.isSuccess = true;
                return result;
            } else {
                logger.log(`fail, ${response?.statusText},${imageUrl}`);
                return result;
            }
        }
    } catch (error) {
        logger.log(`fail, ${error},${imageUrl}`);
        return result;
    }
}
async function page(url: string, pageIndex: number): Promise<imagePage> {
    const result: imagePage = {
        pageIndex,
        url,
        imageUrl: "",
        isSuccess: false
    }
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
            logger.log(`ok, ${url}`);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            result.imageUrl = doc.querySelector("img#img")?.getAttribute("src") ?? "";
            result.isSuccess = result.imageUrl !== "";
        } else {
            logger.log(`fail, ${resp.statusText},${url}`);
        }
    } catch (error) {
        logger.error(`error, ${error},${url}`);
        await ChangeProxyUpdate(true);
    }
    return result;
}

async function book(url: string): Promise<book> {
    const result: book = {
        dir: "",
        maxPage: 0,
        startPageNo: 0,
        title: "",
        url,
        pages: [],
        failbookpageurl: [],
        pageurls: [],
        isSuccess: false,
    }
    try {
        let maxPage: number = 0
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
            logger.log(`ok, ${url}`);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const title = doc.querySelector("H1#gn")?.textContent ?? "";
            const links = doc.querySelectorAll("a")!;
            const pageurls: string[] = [];
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/s/")) {
                    pageurls.push(href)
                }
                // https://e-hentai.org/g/3694533/60a824aaa1/?p=1
                if (href?.startsWith(`${url}?p=`)) {
                    const p = new URL(href);
                    const m = parseInt(p.searchParams.get("p") ?? "0");
                    if (m > maxPage) {
                        maxPage = m;
                    }
                }
            }
            result.isSuccess = true;
            result.title = title;
            result.maxPage = maxPage
            result.pageurls = pageurls
            return result;
        } else {
            logger.log(`fail, ${resp.statusText},${url}`);
        }
    } catch (error) {
        await ChangeProxyUpdate(true);
        logger.error(`error, ${error},${url}`);
    }
    return result;
}



// https://e-hentai.org/g/3875959/7a3d9d9ee3/
// https://e-hentai.org/g/3958189/9b708ed588/
async function readBoof(url: string, startPageNo: number = 1): Promise<book> {
    await sleep(50);
    const bookData = await book(url);
    bookData.startPageNo = startPageNo;
    logger.log(`${bookData.title},${startPageNo}`);
    // Deno.exit();
    if (bookData.title === "") {
        logger.log(`no title ${bookData.url}`);
    } else {
        bookData.dir = pathJoin(basedir, (new URL(url)).pathname.replaceAll("/", "_"), bookData.title);
        // 跳過
        if (bookData.startPageNo <= 1) {
            for (const element of bookData.pageurls) {
                logger.log(`page, ${element}`);
                const imagePage = await page(element, 0);
                bookData.pages.push(imagePage);
                if (imagePage.isSuccess && imagePage.imageUrl !== "") {
                    await sleep(1000);
                    imagePage.image = await imageDownload(bookData.dir, imagePage.imageUrl)
                }
            }
        }
        for (let i = bookData.startPageNo; i <= bookData.maxPage; i++) {
            const bookPage = `${url}?p=${i}`
            logger.log(`bookPage, ${bookPage}`);
            const { pageurls, isSuccess } = await book(bookPage);
            if (isSuccess) {
                for (const element of pageurls) {
                    logger.log(element);
                    const imagePage = await page(element, i);
                    bookData.pages.push(imagePage);
                    if (imagePage.isSuccess && imagePage.imageUrl !== "") {
                        await sleep(1000);
                        imagePage.image = await imageDownload(bookData.dir, imagePage.imageUrl)
                    }
                }
            } else {
                bookData.failbookpageurl.push(bookPage);
            }
        }
    }
    return bookData;
}
logger.log(JSON.stringify(Deno.args));
if (Deno.args.length >= 1) {
    if (Deno.args[0].startsWith("https://e-hentai.org/g/")) {
        const bookData = await readBoof(Deno.args[0], Deno.args.length >= 2 ? parseInt(Deno.args[1]) : 1);
        for (const page of bookData.failbookpageurl) {
            logger.warn(`${page} , fail`);
        }
        for (const page of bookData.pages) {
            if (!(page.image?.isSuccess ?? false)) {
                logger.warn(`${page.url} , fail`);
            }
        }
        await Deno.writeTextFile(pathJoin(basedir, `bookData.${Date.now()}.json`), JSON.stringify(bookData, null, 4));
        // https://e-hentai.org/uploader/Coqiaku?prev=1
    } else if (Deno.args[0].startsWith("https://e-hentai.org/?f_search") || Deno.args[0].startsWith("https://e-hentai.org/uploader/")) {
        const bookListData = await BookList(Deno.args[0]);
        // 跳過
        let skip = Deno.args.length >= 2 ? parseInt(Deno.args[1]) : 0;
        bookListData.startIndex = skip;
        for (const element of bookListData.bookurls) {
            if (skip > 0) {
                skip--;
                logger.log(`skip, ${element}, ${skip}`);
            } else {
                logger.log(`read, ${element}`);
                bookListData.books.push(await readBoof(element));
            }
        }
        for (const bookData of bookListData.books) {
            logger.info(`${bookData.url} , ${bookData.title} , ${bookData.isSuccess}`);
            if (bookData.isSuccess) {
                for (const page of bookData.failbookpageurl) {
                    logger.warn(`${page} , fail`);
                }
                for (const page of bookData.pages) {
                    if (!(page.image?.isSuccess ?? false)) {
                        logger.warn(`${page.url} , fail`);
                    }
                }
            }
        }
        await Deno.writeTextFile(pathJoin(basedir, `bookListData.${Date.now()}.json`), JSON.stringify(bookListData, null, 4));
    }
}
logger.log("exit after 5 sec...");
setTimeout(() => {
    Deno.exit();
}, 5000);
// deno task hentai "https://e-hentai.org/g/3689578/aa71e08e7b/"
// deno task hentai "https://e-hentai.org/?f_search=DyDy_cos&prev=1"
// deno task hentai "https://e-hentai.org/?f_search=DyDy_cos&prev=3694414"
// 
// https://e-hentai.org/g/3957659/2de8979d61/