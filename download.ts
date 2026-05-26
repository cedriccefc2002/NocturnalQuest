import { basename } from "node:path";
import { exists } from "jsr:@std/fs/exists";

import files from "./tuoyiku_20260526_vface.json" with { type: "json" }

const outpath = "./themes/private/tuoyiku_vface";
for (const f of files) {
    const url = new URL(f);

    const downloadname = basename(url.pathname);
    const save = `${outpath}/${downloadname}`;
    if (await exists(save)) {
        console.log("File exists", save);
    } else {
        const response = await fetch(url);

        if (response.ok) {
            // Open (or create) the file for writing
            const file = await Deno.open(`${outpath}/${downloadname}`, { create: true, write: true });

            // Pipe the response body stream directly to the file
            await response.body?.pipeTo(file.writable);
            console.log("File downloaded successfully!", save);
        } else {
            console.error(`Failed to fetch: ${response.statusText}`, f);
        }
    }
}