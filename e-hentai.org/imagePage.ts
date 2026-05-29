import log4js from "log4js";
import { basename } from "node:path";
const logger = log4js.getLogger(basename(import.meta.filename ?? ""));
import { cfg, DB, fetchHtml } from "./common.ts";
import { DOMParser } from "@b-fuze/deno-dom";
import { BookPage, BookPageRecord } from "./bookPage.ts";

export type ImagePageRecord = {
    BookUrl: string,
    BookPageUrl: string,
    ImagePageUrl: string,
    Url: string,
    Path: string;
    IsSuccess?: boolean;
    IsExist?: boolean;
    IsDownloadFinish?: boolean;
}

export class ImagePage {
    public static Key = "imagePages";
    public ImagePageUrl: string = "";
    public constructor(public BookUrl: string, public BookPageUrl: string, public Url: string, public Path: string) {
    }
    public IsSuccess: boolean = false;
    public async refresh() {
        const [isSuccess, html] = await fetchHtml(this.Url, true, 30);
        if (isSuccess && html !== undefined) {
            this.ParseHtml(html);
        }
    }
    private ParseHtml(html: string) {
        if (html !== "") {
            const doc = new DOMParser().parseFromString(html, "text/html");
            this.ImagePageUrl = doc.querySelector("img#img")?.getAttribute("src") ?? "";
            this.IsSuccess = this.Url !== "";
        }
    }
    public export(): ImagePageRecord {
        return {
            BookUrl: this.BookUrl,
            BookPageUrl: this.BookPageUrl,
            ImagePageUrl: this.ImagePageUrl,
            Url: this.Url,
            Path: this.Path,
            IsSuccess: this.IsSuccess,
        };
    };
    public static import(record: ImagePageRecord): ImagePage {
        // logger.info(JSON.stringify(record));
        const bookPage = new ImagePage(record.BookUrl, record.BookPageUrl, record.Url, record.Path);
        bookPage.ImagePageUrl = record.ImagePageUrl;
        if (record.IsSuccess !== undefined) {
            bookPage.IsSuccess = record.IsSuccess;
        }
        return bookPage;
    };
    public static createUrl(urlPath: string) { return `${cfg.baseUrl}${urlPath}`; }
    public static async createFromBookPage(bookPage: BookPage, urlPath: string) {
        const url = ImagePage.createUrl(urlPath);
        const imagePage = new ImagePage(bookPage.BookUrl, bookPage.Url, url, bookPage.Path);
        const [isSuccess, html] = await fetchHtml(imagePage.Url, true, 30);
        if (isSuccess && html !== undefined) {
            imagePage.ParseHtml(html);
        }
        return imagePage;
    };
}
async function SingleImagePage(bookPage: BookPage, urlPath: string) {
    const item = await DB.get([ImagePage.Key, bookPage.BookUrl, bookPage.Url, ImagePage.createUrl(urlPath)]);
    let image: ImagePage | undefined;
    if (item.value == null) {
        image = await ImagePage.createFromBookPage(bookPage, urlPath);
        const record = image.export();
        logger.info(JSON.stringify(record));
        const result = await DB.set([ImagePage.Key, bookPage.BookUrl, bookPage.Url, image.Url], record);
        logger.info(`save ${result.ok},${result.versionstamp}`);
    } else {
        image = ImagePage.import(item.value as ImagePageRecord);
        if (!image.IsSuccess || image.ImagePageUrl === "") {
            await image.refresh();
            const record = image.export();
            logger.info(JSON.stringify(record));
            const result = await DB.set([ImagePage.Key, bookPage.BookUrl, bookPage.Url, image.Url], record);
            logger.info(`save ${result.ok},${result.versionstamp}`);
        }
    }
}
if (import.meta.main) {
    if (Deno.args.length >= 1) {
        const url = Deno.args[0];
        // deno task e-hentai.imagePage https://e-hentai.org/g/3962355/69690a454f/
        if (url.startsWith("https://e-hentai.org/g/")) {
            const entries = DB.list({ prefix: [BookPage.Key, url] });
            for await (const entry of entries) {
                logger.info(`${entry.key}`);
                const bookPage = BookPage.import(entry.value as BookPageRecord);
                if (bookPage.IsSuccess) {
                    for (const urlPath of bookPage.Pages) {
                        const image = await ImagePage.createFromBookPage(bookPage, urlPath);
                        const record = image.export();
                        logger.info(JSON.stringify(record));
                        const result = await DB.set([ImagePage.Key, image.BookUrl, image.BookPageUrl, image.Url], record);
                        logger.info(`save ${result.ok},${result.versionstamp}`);
                    }
                }

            }
        } else if (url === "clear") {
            const entries = DB.list({ prefix: [ImagePage.Key] });
            for await (const entry of entries) {
                await DB.delete(entry.key);
            }
        }
    } else {
        const entries = DB.list({ prefix: [BookPage.Key] });
        const bookPageList: BookPage[] = [];
        for await (const entry of entries) {
            const record = entry.value as BookPageRecord;
            logger.info(`IsSuccess=${record.IsSuccess},${record.Url}`);
            if (record.IsSuccess) {
                bookPageList.push(BookPage.import(record));
            }
        }
        for (const bookPage of bookPageList) {
            for (const urlPath of bookPage.Pages) {
                await SingleImagePage(bookPage, urlPath);
            }
        }
    }
    DB.close();
}