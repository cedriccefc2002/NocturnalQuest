import { DOMParser } from "@b-fuze/deno-dom";
import { basename } from "node:path";
import { exists } from "@std/fs/exists";

// const resp = await fetch("https://e-hentai.org/?f_search=%E7%8A%AC%E5%A4%9C%E5%8F%89", {
//     "headers": {
//         "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//         "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
//         "cache-control": "max-age=0",
//         "priority": "u=0, i",
//         "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
//         "sec-ch-ua-mobile": "?0",
//         "sec-ch-ua-platform": "\"Linux\"",
//         "sec-fetch-dest": "document",
//         "sec-fetch-mode": "navigate",
//         "sec-fetch-site": "same-origin",
//         "sec-fetch-user": "?1",
//         "upgrade-insecure-requests": "1"
//     },
//     "referrer": "https://e-hentai.org/",
//     "body": null,
//     "method": "GET",
//     "mode": "cors",
//     "credentials": "include"
// });

// if (resp.ok) {
//     const html = await resp.text();
//     await Deno.writeTextFile("e-hentai.org.html", html);
// }
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
async function imageDownload(outpath: string, imageUrl: string) {
    try {
        await Deno.mkdir(outpath, { recursive: true });
        const url = new URL(imageUrl);
        const downloadname = basename(url.pathname);
        const save = `${outpath}/${downloadname}`;
        if (await exists(save)) {
            console.log("Exists", save);
        } else {
            const response = await fetch(url, {
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
                "credentials": "include"
            });
            if (response.ok) {
                console.log("ok", save);
                // Open (or create) the file for writing
                const file = await Deno.open(`${outpath}/${downloadname}`, { create: true, write: true });
                // Pipe the response body stream directly to the file
                await response.body?.pipeTo(file.writable);
                console.log("Success", save);
            } else {
                console.error(`Fail(1)`, response.statusText, imageUrl);
            }
        }
    } catch (error) {
        console.error(`Fail(0)`, error, imageUrl);
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
            "credentials": "include"
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

async function book(url: string) {
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
            "credentials": "include"
        });

        if (resp.ok) {
            console.log("ok", url);
            const html = await resp.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            const links = doc.querySelectorAll("a")!;
            const pages: string[] = [];
            const bookPages: string[] = [];
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/s/")) {
                    pages.push(href)
                }
                if (href?.startsWith(`${url}?`)) {
                    bookPages.push(href)
                }
            }
            return [pages, bookPages];
        } else {
            console.log(resp.statusText, url);
        }
    } catch (error) {
        console.error(error, url);
    }
    return [];
}

// const html = await Deno.readTextFile("e-hentai.org.html");

// const doc = new DOMParser().parseFromString(html, "text/html");
// const links = doc.querySelectorAll("a")!;
// const books: string[] = [];
// for (const element of links) {
//     const href = element.getAttribute("href");
//     if (href?.startsWith("https://e-hentai.org/g/")) {
//         books.push(href)
//     }
// }
// console.log(books[0]);

// https://e-hentai.org/g/3875959/7a3d9d9ee3/
async function readBoof(name: string, url: string) {
    await sleep(50);
    const [pages, bookPages] = await book(url);
    for (const element of pages) {
        console.log(element);
        const image = await page(element);
        await sleep(50);
        await imageDownload(`themes/private/e-hentai/${name}`, image);
    }
    for (const bookPage of bookPages) {
        console.log(bookPage);
        const [pages, _] = await book(bookPage);
        for (const element of pages) {
            console.log(element);
            const image = await page(element);
            await sleep(50);
            await imageDownload(`themes/private/e-hentai/${name}`, image);
        }
    }
}

await readBoof("[HYC]ai animated (webp) [AI Generated]","https://e-hentai.org/g/3957541/fe85fdff87/")
