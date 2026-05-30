import log4js from "log4js";
import { join as pathJoin, basename } from "node:path";
const logger = log4js.getLogger(basename(import.meta.filename ?? ""));
import { cfg, DB, fetchHtml } from "./common.ts";
import { DOMParser } from "@b-fuze/deno-dom";
import { Book, BookRecord } from "./book.ts";

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
        // logger.info(JSON.stringify(record));
        const bookPage = new BookPage(record.BookUrl, record.Url, record.Path);
        if (record.IsSuccess !== undefined) {
            bookPage.IsSuccess = record.IsSuccess;
        }
        if (record.Pages !== undefined) {
            bookPage.Pages = record.Pages;
        }
        return bookPage;
    };
    public static createUrl(book: Book, index: number) { return `${book.Url}?p=${index}`; }
    public static async createFromBook(book: Book, index: number = 0) {
        const url = BookPage.createUrl(book, index);
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
async function SingleBookPage(book: Book, index: number = 0) {
    const item = await DB.get([BookPage.Key, book.Url, BookPage.createUrl(book, index)]);
    let bookPage: BookPage | undefined;
    if (item.value == null) {
        bookPage = await BookPage.createFromBook(book, index);
        const record = bookPage.export();
        // logger.info(JSON.stringify(record));
        const result = await DB.set([BookPage.Key, book.Url, bookPage.Url], record);
        logger.info(`save ${result.ok},${result.versionstamp}`);
    } else {
        bookPage = BookPage.import(item.value as BookPageRecord);
        if (!bookPage.IsSuccess || bookPage.Pages.length === 0) {
            await bookPage.refresh();
            const record = bookPage.export();
            // logger.info(JSON.stringify(record));
            const result = await DB.set([BookPage.Key, book.Url, bookPage.Url], record);
            logger.info(`save ${result.ok},${result.versionstamp}`);
        }
    }
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
                book = Book.import(item.value as BookRecord);
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
        } else if (url === "clear") {
            const entries = DB.list({ prefix: [BookPage.Key] });
            for await (const entry of entries) {
                await DB.delete(entry.key);
            }
        }
    } else {
        const entries = DB.list({ prefix: [Book.Key] });
        const bookList: Book[] = [];
        for await (const entry of entries) {
            const record = entry.value as BookRecord;
            logger.info(`IsSuccess=${record.IsSuccess},${record.Url}`);
            if (record.IsSuccess) {
                bookList.push(Book.import(record));
            }
        }
        let i = 0;
        for (const book of bookList) {
            logger.info(`bookList,${++i}/${bookList.length}`);
            await SingleBookPage(book, 0);
            for (let index = 0; index < book.ExtendPageCount; index++) {
                await SingleBookPage(book, index + 1);
            }
        }
    }
    DB.close();
}
