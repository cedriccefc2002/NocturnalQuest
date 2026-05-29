import log4js from "log4js";
const logger = log4js.getLogger(import.meta.filename);
import { DB, fetchHtml } from "./common.ts";
import { DOMParser } from "@b-fuze/deno-dom";

type Record = {
    Url: string,
    Path?: string;
    Title?: string;
    IsSuccess?: boolean;
    ImagesCount?: number;
    ExtendPageCount?: number;
    BasePages?: string[];
}

export class Book {
    public static Key = "books";
    public static p = /Showing [\d]* - [\d]* of ([\d]+) images/;
    public constructor(public Url: string) {
        this.Path = new URL(Url).pathname.replaceAll("/", "_")
    }
    public Path: string = "";
    public Title: string = "";
    public IsSuccess: boolean = false;
    public ImagesCount: number = 0;
    public ExtendPageCount: number = 0;
    public BasePages: string[] = [];
    public async refresh() {
        const [isSuccess, html] = await fetchHtml(this.Url, true, 30);
        if (isSuccess && html !== undefined) {
            this.ParseHtml(html);
        }
    }
    private ParseHtml(html: string) {
        if (html !== "") {
            this.BasePages = [];
            const doc = new DOMParser().parseFromString(html, "text/html");
            this.Title = doc.querySelector("H1#gn")?.textContent ?? "";
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
                    this.BasePages.push(new URL(href).pathname)
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
            this.IsSuccess = true;
        }
    }
    public export(): Record {
        return {
            Url: this.Url,
            Path: this.Path,
            Title: this.Title,
            IsSuccess: this.IsSuccess,
            ImagesCount: this.ImagesCount,
            ExtendPageCount: this.ExtendPageCount,
            BasePages: this.BasePages,
        };
    };
    public static import(record: Record): Book {
        logger.info(JSON.stringify(record));
        const book = new Book(record.Url);
        if (record.Path !== undefined) {
            book.Path = record.Path;
        }
        if (record.Title !== undefined) {
            book.Title = record.Title;
        }
        if (record.IsSuccess !== undefined) {
            book.IsSuccess = record.IsSuccess;
        }
        if (record.ImagesCount !== undefined) {
            book.ImagesCount = record.ImagesCount;
        }
        if (record.ExtendPageCount !== undefined) {
            book.ExtendPageCount = record.ExtendPageCount;
        }
        if (record.BasePages !== undefined) {
            book.BasePages = record.BasePages;
        }
        return book;
    };
}
if (import.meta.main) {
    if (Deno.args.length >= 1) {
        const url = Deno.args[0];
        // deno task e-hentai.book https://e-hentai.org/g/3962355/69690a454f/
        if (url.startsWith("https://e-hentai.org/g/")) {
            let book: Book | undefined;
            const item = await DB.get([Book.Key, url]);
            if (item.value == null) {
                logger.info(`${url},not exits renew`);
                book = new Book(url);
            } else {
                logger.info(`${url},exits`);
                book = Book.import(item.value as Record);
            }
            await book.refresh();
            const record = book.export();
            logger.info(JSON.stringify(record));
            const result = await DB.set([Book.Key, url], record);
            logger.info(`save ${result.ok},${result.versionstamp}`);
            DB.close();
        }
    }
}