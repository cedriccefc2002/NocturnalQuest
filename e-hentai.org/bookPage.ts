import log4js from "log4js";
import { join as pathJoin } from "node:path";
const logger = log4js.getLogger(import.meta.filename);
import { cfg, DB, fetchHtml } from "./common.ts";
import { DOMParser } from "@b-fuze/deno-dom";
import { Book } from "./book.ts";

export type BookPageRecord = {
    BookUrl: string,
    Url: string,
    Path: string;
    IsSuccess?: boolean;
    Pages?: string[];
}

export class BookPage {
    public static Key = "bookpages";
    public constructor(public BookUrl: string, public Url: string, public Path: string) {
    }
    public IsSuccess: boolean = false;
    public Pages: string[] = [];
    public async refresh() {
        const [isSuccess, html] = await fetchHtml(this.Url, true, 30);
        if (isSuccess && html !== undefined) {
            this.ParseHtml(html);
        }
    }
    private ParseHtml(html: string) {
        if (html !== "") {
            this.Pages = [];
            const doc = new DOMParser().parseFromString(html, "text/html");
            const links = doc.querySelectorAll("a")!;
            for (const element of links) {
                const href = element.getAttribute("href");
                if (href?.startsWith("https://e-hentai.org/s/")) {
                    this.Pages.push(new URL(href).pathname)
                }
            }
            this.IsSuccess = true;
        }
    }
    public export(): BookPageRecord {
        return {
            BookUrl: this.BookUrl,
            Url: this.Url,
            Path: this.Path,
            IsSuccess: this.IsSuccess,
            Pages: this.Pages,
        };
    };
    public static import(record: BookPageRecord): BookPage {
        logger.info(JSON.stringify(record));
        const bookPage = new BookPage(record.BookUrl, record.Url, record.Path);
        if (record.IsSuccess !== undefined) {
            bookPage.IsSuccess = record.IsSuccess;
        }
        if (record.Pages !== undefined) {
            bookPage.Pages = record.Pages;
        }
        return bookPage;
    };
    public static async createFromBook(book: Book, index: number = 0) {
        const url = `${book.Url}?p=${index}`;
        const bookPage = new BookPage(book.Url, url, pathJoin(cfg.basedir, book.Path, book.Title));
        if (index <= 0) {
            bookPage.Pages = book.BasePages;
            bookPage.IsSuccess = true;
        } else {
            const [isSuccess, html] = await fetchHtml(bookPage.Url, true, 30);
            if (isSuccess && html !== undefined) {
                bookPage.ParseHtml(html);
            }
        }
        return bookPage;
    };
}
if (import.meta.main) {
    if (Deno.args.length >= 1) {
        const url = Deno.args[0];
        // deno task e-hentai.bookPage https://e-hentai.org/g/3962355/69690a454f/
        if (url.startsWith("https://e-hentai.org/g/")) {
            let book: Book | undefined;
            const item = await DB.get([Book.Key, url]);
            if (item.value == null) {
                logger.info(`${url},not exits renew`);
                book = new Book(url);
                await book.refresh();
            } else {
                logger.info(`${url},exits`);
                book = Book.import(item.value as BookPageRecord);
            }
            const bookPage = await BookPage.createFromBook(book);
            const record = bookPage.export();
            logger.info(JSON.stringify(record));
            const result = await DB.set([BookPage.Key, book.Url, bookPage.Url], record);
            logger.info(`save ${result.ok},${result.versionstamp}`);
            for (let index = 0; index < book.ExtendPageCount; index++) {
                const bookPage = await BookPage.createFromBook(book, index + 1);
                const record = bookPage.export();
                logger.info(JSON.stringify(record));
                const result = await DB.set([BookPage.Key, book.Url, bookPage.Url], record);
                logger.info(`save ${result.ok},${result.versionstamp}`);
            }
            DB.close();
        }
    }
}