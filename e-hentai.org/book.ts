import log4js from "log4js";
import { basename } from "node:path";
import { OpenDB, fetchHtml } from "./common.ts";
import { DOMParser } from "@b-fuze/deno-dom";
const logger = log4js.getLogger(basename(import.meta.filename ?? ""));
export type BookRecord = {
    Url: string,
    Path?: string;
    Title?: string;
    IsSuccess?: boolean;
    ImagesCount?: number;
    ExtendPageCount?: number;
    BasePages?: string[];
    IndexImgUrl?: string;
}

async function BookList(url: string): Promise<string[]> {
    const result: string[] = [];
    try {
        const [isSuccess, html] = await fetchHtml(url, true, 30);
        if (isSuccess && html !== undefined) {
            const doc = new DOMParser().parseFromString(html, "text/html");
            const links = doc.querySelectorAll("a")!;
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/g/")) {
                    result.push(href)
                }
            }
            return result;
        }
    } catch (error) {
        logger.log(`${error},${url}`);
    }
    return result;
}

export class Book {
    public static Key = "books";
    public static p = /Showing [\d]* - [\d]* of ([\d]+) images/;
    public constructor(public Url: string) {
        this.Path = new URL(Url).pathname.replaceAll("/", "_")
    }
    public Path: string = "";
    public Title: string = "";
    public IndexImgUrl: string = "";
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
    private static indexImgP = /https[\w:/.-]+.webp/g;
    private ParseHtml(html: string) {
        if (html !== "") {
            this.BasePages = [];
            const doc = new DOMParser().parseFromString(html, "text/html");
            this.Title = doc.querySelector("H1#gn")?.textContent ?? "";
            const indexImg = doc.querySelector("#gd1")?.querySelector("div");
            if (indexImg) {
                // logger.debug(`${indexImg.outerHTML}`);
                // logger.debug(`${indexImg.getAttribute("style")}`);
                const style = indexImg.getAttribute("style");
                const match = style?.match(Book.indexImgP);
                if (match !== null && match !== undefined) {
                    this.IndexImgUrl = match[0]
                    // logger.debug(`${this.IndexImgUrl}`);
                }
            }
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
    public export(): BookRecord {
        return {
            Url: this.Url,
            Path: this.Path,
            Title: this.Title,
            IsSuccess: this.IsSuccess,
            ImagesCount: this.ImagesCount,
            ExtendPageCount: this.ExtendPageCount,
            BasePages: this.BasePages,
            IndexImgUrl: this.IndexImgUrl,
        };
    };
    public static import(record: BookRecord): Book {
        // logger.info(JSON.stringify(record));
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
        if (record.IndexImgUrl !== undefined) {
            book.IndexImgUrl = record.IndexImgUrl;
        }
        return book;
    };
}
async function SingleBook(url: string, DB: Deno.Kv) {
    let book: Book | undefined;
    let needSave = false;
    const item = await DB.get([Book.Key, url]);
    if (item.value == null) {
        logger.info(`${url},not exits create`);
        book = new Book(url);
        await book.refresh();
        needSave = true;
    } else {
        book = Book.import(item.value as BookRecord);
        if (!book.IsSuccess) {
            logger.info(`${url},refresh`);
            await book.refresh();
            needSave = true;
        }
    }
    if (needSave) {
        const record = book.export();
        // logger.info(JSON.stringify(record));
        const result = await DB.set([Book.Key, url], record);
        logger.info(`save ${result.ok},${result.versionstamp}`);
    }
}
if (import.meta.main) {
    if (Deno.args.length >= 1) {
        const DB = await OpenDB();
        const arg0 = Deno.args[0];
        // deno task e-hentai.book https://e-hentai.org/g/3962355/69690a454f/
        if (arg0.startsWith("https://e-hentai.org/g/")) {
            await SingleBook(arg0, DB);
        } else if (
            Deno.args[0].startsWith("https://e-hentai.org/?f_search") ||
            Deno.args[0].startsWith("https://e-hentai.org/uploader/") ||
            Deno.args[0].startsWith("https://e-hentai.org/?f_cats")
        ) {
            const bookLists = await BookList(Deno.args[0]);
            logger.info(bookLists.length);
            for (const url of bookLists) {
                await SingleBook(url, DB);
            }
        } else if (arg0 === "uploader") {
            for (const element of Deno.args.slice(1)) {
                const bookList = `https://e-hentai.org/uploader/${element}`;
                logger.info(`read ${bookList}`);
                const bookLists = await BookList(bookList);
                logger.info(bookLists.length);
                for (const url of bookLists) {
                    await SingleBook(url, DB);
                }
            }
        } else if (arg0 === "indexImg") {
            const entries = DB.list({ prefix: [Book.Key] });
            const bookList: Book[] = [];
            for await (const entry of entries) {
                const record = entry.value as BookRecord;
                if (record.IndexImgUrl === undefined || record.IndexImgUrl === "") {
                    bookList.push(Book.import(record));
                }
            }
            logger.info(`read ${bookList.length}`);
            let i = 0;
            for (const book of bookList) {
                logger.info(`${book.Url},${++i}/${bookList.length}`);
                await book.refresh();
                const record = book.export();
                const result = await DB.set([Book.Key, book.Url], record);
                logger.info(`save ${result.ok},${result.versionstamp}`);
            }
        } else if (arg0 === "search" && Deno.args.length >= 2) {
            // https://e-hentai.org/?f_search=%E6%B2%88%E5%A8%87%E5%A8%87+-censorship+-non-nude+-gender&prev=1
            const search = Deno.args[1];
            const excludes = [
                "non-nude",
                "censorship",
                "gender"
            ];
            const prefix = "https://e-hentai.org/?f_search="
            let prev = 1;
            let continueRun = false;
            do {
                const url = `${prefix}${encodeURIComponent(search)}+${excludes.map(x => `-${x}`).join("+")}&prev=${prev}`;
                logger.trace(url);
                const bookLists = await BookList(url);
                logger.info(bookLists.length);
                for (const url of bookLists) {
                    await SingleBook(url, DB);
                }
                if (bookLists.length == 25) {
                    try {
                        const d = new URL(bookLists[0]).pathname.match(/\d+/);
                        if (d != null) {
                            // logger.warn(`${JSON.stringify(d)}}`);
                            prev = parseInt(d[0]);
                            continueRun = true;
                        } else {
                            continueRun = false;
                        }
                    } catch (error) {
                        logger.warn(`${bookLists[0]}, ${error}`)
                    }
                } else {
                    continueRun = false;
                }
            } while (continueRun);
        }
        DB.close();
    }
}