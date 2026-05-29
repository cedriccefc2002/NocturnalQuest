import log4js from "log4js";
const logger = log4js.getLogger(import.meta.filename);
import { cfg, DB, fetchHtml } from "./common.ts";
import { DOMParser } from "@b-fuze/deno-dom";
export class Book {
    public static Key = "books";
    public static p = /Showing [\d]* - [\d]* of ([\d]+) images/;
    public constructor(public Url: string) { }
    public Path: string = "";
    public PageCount: number = 0;
    public title: string = "";
    public isSuccess: boolean = false;
    public ImagesCount: number = 0;
    public ExtendPageCount: number = 0;
    public Pageurls: string[] = [];
    public async refresh() {
        const [isSuccess, html] = await fetchHtml(this.Url, true, 30);
        if (isSuccess && html !== undefined) {
            this.ParseHtml(html);
        }
    }
    private ParseHtml(html: string) {
        if (html !== "") {
            const doc = new DOMParser().parseFromString(html, "text/html");
            this.title = doc.querySelector("H1#gn")?.textContent ?? "";
            const links = doc.querySelectorAll("a")!;
            const totalmsg = doc.querySelector(".gpc");
            if (totalmsg) {
                const match = totalmsg.textContent.match(Book.p);
                if (match) {
                    this.ImagesCount = parseInt(match[1]);
                }
            }
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/s/")) {
                    this.Pageurls.push(href)
                }
                // https://e-hentai.org/g/3694533/60a824aaa1/?p=1
                if (href?.startsWith(`${this.Url}?p=`)) {
                    const p = new URL(href);
                    const m = parseInt(p.searchParams.get("p") ?? "0");
                    if (m > this.ExtendPageCount) {
                        this.ExtendPageCount = m;
                    }
                }
            }
            this.isSuccess = true;
        }
    }
}
if (Deno.args.length >= 1) {
    const url = Deno.args[0];
    // https://e-hentai.org/g/3873133/720f538cb1/
    if (url.startsWith("https://e-hentai.org/g/")) {
        let book: Book | undefined;
        const item = await DB.get([Book.Key, url]);
        if (item.value == null) {
            logger.info(`${url},not exits renew`);
            book = new Book(url);
        } else {
            logger.info(`${url},exits`);
            book = item.value as Book;
        }
        await book.refresh();
        const result = await DB.set([Book.Key, url], book);
        logger.info(`save ${result.ok},${result.versionstamp}`);
        DB.close();
    }
}