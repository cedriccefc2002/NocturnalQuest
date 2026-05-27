import { basename, join as pathJoin } from "node:path";
import { exists } from "@std/fs/exists";

// import files from "./tuoyiku_20260526_cdress.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/cdress";

// import files from "./tuoyiku_20260526_i2v.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/i2v";

// import files from "./tuoyiku_20260526_iface.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/iface";

// import files from "./tuoyiku_20260526_image.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/image";

// import files from "./tuoyiku_20260526_mdress.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/mdress";

// import files from "./tuoyiku_20260526_udress.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/udress";

// import files from "./tuoyiku_20260526_vface.json" with { type: "json" }
// const outpath = "/media/cefc/Data/Data/tuoyiku/vface";

import files from "./tuoyiku_20260526_video.json" with { type: "json" }
const outpath = "/media/cefc/Data/Data/tuoyiku/video";

// const outpath = "/media/cefc/Data/Data/tuoyiku/all";
// const outpath = "/media/cefc/Data/Data/tuoyiku/vface";

console.log("create dir", outpath);
await Deno.mkdir(outpath, { recursive: true });
const total = files.length;
let i = 0;
for (const f of files) {
    i++;
    try {
        const url = new URL(f);
        const downloadname = basename(url.pathname);
        const save = pathJoin(outpath, downloadname);
        if (await exists(save)) {
            console.log("Exists", save, total, i);
        } else {
            const response = await fetch(url);
            if (response.ok) {
                const saveTemp = `${save}.download`;
                const file = await Deno.open(saveTemp, { create: true, write: true });
                // Pipe the response body stream directly to the file
                await response.body?.pipeTo(file.writable);
                await Deno.rename(saveTemp, save)
                console.log("Success", save, total, i);
            } else {
                console.error(`Fail(1)`, response.statusText, f, total, i);
            }
        }
    } catch (error) {
        console.error(`Fail(0)`, f, error, total, i);
    }
}