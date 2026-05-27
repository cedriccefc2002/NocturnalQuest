import { DOMParser } from "@b-fuze/deno-dom";
import { basename, join as pathJoin } from "node:path";
import { exists } from "@std/fs/exists";
import { getRandomPxoxy } from "./proxy.ts";

const basedir = "themes/private/e-hentai";
// https://proxylist.geonode.com/api/proxy-list?country=TW&limit=500&page=1&sort_by=lastChecked&sort_type=desc
let client = await getRandomPxoxy();

// 每5分鐘切換一次proxy
setInterval(async () => {
    client = await getRandomPxoxy();
}, 1000 * 60 * 5);
async function BookList(url: string) {
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
            const books: string[] = [];
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/g/")) {
                    books.push(href)
                }
            }
            return books;
        } else {
            console.log(resp.statusText, url);
        }
    } catch (error) {
        console.error(error, url);
    }
    return [];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function imageDownload(outpath: string, imageUrl: string): Promise<boolean> {
    try {
        await Deno.mkdir(outpath, { recursive: true });
        const url = new URL(imageUrl);
        const downloadname = basename(url.pathname);
        const save = pathJoin(outpath, downloadname);
        if (await exists(save)) {
            console.log("exists", save);
            return true;
        } else {
            let response: Response | undefined = undefined;
            for (let index = 0; index < 10; index++) {
                try {
                    const c = new AbortController();
                    const id = setTimeout(() => c.abort(), 10000);
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
                    clearTimeout(id);
                    break;
                } catch (error) {
                    console.error(`retry`, error, imageUrl, index);
                    client = await getRandomPxoxy();
                    await sleep(10000);
                    continue;
                }
            }
            if (response?.ok) {
                console.log("ok", save);
                // Open (or create) the file for writing
                const saveTemp = `${save}.download`;
                const file = await Deno.open(saveTemp, { create: true, write: true });
                // Pipe the response body stream directly to the file
                await response.body?.pipeTo(file.writable);
                await Deno.rename(saveTemp, save)
                console.log("finish", save);
                return true;
            } else {
                console.error(`fail(1)`, response?.statusText, imageUrl);
                return false;
            }
        }
    } catch (error) {
        console.error(`fail(0)`, error, imageUrl);
        return false;
    }
}
async function page(url: string) {
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
            console.log("ok", url);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.querySelector("img#img")?.getAttribute("src") ?? "";
        } else {
            console.log(resp.statusText, url);
        }
    } catch (error) {
        console.error(error, url);
    }
    return "";
}

async function book(url: string): Promise<[string[], maxPage: number, title: string | undefined]> {
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
            console.log("ok", url);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const title = doc.querySelector("H1#gn")?.textContent;
            const links = doc.querySelectorAll("a")!;
            const pages: string[] = [];
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/s/")) {
                    pages.push(href)
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
            return [pages, maxPage, title];
        } else {
            console.log(resp.statusText, url);
        }
    } catch (error) {
        console.error(error, url);
    }
    return [[], 0, undefined];
}



// https://e-hentai.org/g/3875959/7a3d9d9ee3/
async function readBoof(url: string, startPageNo: number = 1) {
    await sleep(50);
    const [pages, bookPages, title] = await book(url);
    const failimages: [dir: string, image: string][] = [];
    console.log(bookPages, startPageNo);
    // Deno.exit();
    if (title === undefined) {
        console.log("no title", url);
    } else {
        const dir = pathJoin(basedir, (new URL(url)).pathname, title);
        // 跳過
        if (startPageNo <= 1) {
            for (const element of pages) {
                console.log(element);
                const image = await page(element);
                await sleep(1000);
                if (!await imageDownload(dir, image)) {
                    failimages.push([dir, image])
                }
            }
        }
        for (let i = startPageNo; i <= bookPages; i++) {
            const bookPage = `${url}?p=${i}`
            console.log(bookPage);
            const [pages] = await book(bookPage);
            for (const element of pages) {
                console.log(element);
                const image = await page(element);
                await sleep(1000);
                if (!await imageDownload(dir, image)) {
                    failimages.push([dir, image])
                }
            }
        }
    }
    return failimages;
}
console.log(Deno.args);
const failimages: [dir: string, image: string][] = [];
if (Deno.args.length >= 1) {
    if (Deno.args[0].startsWith("https://e-hentai.org/g/")) {
        failimages.push(...await readBoof(Deno.args[0], Deno.args.length >= 2 ? parseInt(Deno.args[1]) : 1));
    } else if (Deno.args[0].startsWith("https://e-hentai.org/?f_search")) {
        const books = await BookList(Deno.args[0]);
        // 跳過
        let skip = Deno.args.length >= 2 ? parseInt(Deno.args[1]) : 0;
        for (const element of books) {
            if (skip > 0) {
                skip--;
                console.log("skip", element);
            } else {
                console.log("read", element);
                failimages.push(...await readBoof(element));
            }
        }
    }
}
if (failimages.length > 0) {
    const failimageFinal: [dir: string, image: string][] = [];
    for (const item of failimages) {
        if (!await imageDownload(item[0], item[1])) {
            failimageFinal.push(item)
        }
        console.time("fail retry");
        await sleep(5000);
    }
    console.log("failimageFinal", JSON.stringify(failimageFinal));
}

Deno.exit();
// deno task hentai "https://e-hentai.org/g/3689578/aa71e08e7b/"
// deno task hentai "https://e-hentai.org/?f_search=DyDy_cos&prev=1"
// deno task hentai "https://e-hentai.org/?f_search=DyDy_cos&prev=3694414"
// 
// https://e-hentai.org/g/3957659/2de8979d61/