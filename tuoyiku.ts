import { basename, join as pathJoin } from "node:path";
import { exists } from "@std/fs/exists";

const cfg = {
    saveDir: "/media/cefc/Data/Data/tuoyiku",
    dataDir: "tuoyiku",
    now: "20260601",
    before: "20260526",
    subs: [
        {
            name: "all",
            save: "i2v",
        },
        {
            name: "video",
            save: "video",
        },
        {
            name: "vface",
            save: "vface",
        },
        {
            name: "udress",
            save: "udress",
        },
        {
            name: "mdress",
            save: "mdress",
        },
        {
            name: "image",
            save: "image",
        },
        {
            name: "iface",
            save: "iface",
        },
        {
            name: "i2v",
            save: "i2v",
        },
        {
            name: "cdress",
            save: "cdress",
        }
    ]
};

for (const sub of cfg.subs) {
    const dataBeforeFilePath = pathJoin(cfg.dataDir, cfg.before, `${sub.name}.json`);
    const dataNowFilePath = pathJoin(cfg.dataDir, cfg.now, `${sub.name}.json`);
    console.log(dataBeforeFilePath);
    console.log(dataNowFilePath);
    const dataBefore = JSON.parse(await Deno.readTextFile(dataBeforeFilePath));
    const dataNow = JSON.parse(await Deno.readTextFile(dataNowFilePath));
    const [add, remove] = delta(dataNow, dataBefore);
    console.log(sub.name, add.length, remove.length);
    const outpath = pathJoin(cfg.saveDir, sub.save);
    console.log("create dir", outpath);
    await Deno.mkdir(outpath, { recursive: true });
    const total = add.length;
    let i = 0;
    for (const f of add) {
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
}

function delta(nowDatas: string[], beforeDatas: string[]): [add: string[], remove: string[]] {
    const add: string[] = [];
    const remove: string[] = [];
    for (const nowData of nowDatas) {
        if (beforeDatas.indexOf(nowData) < 0) {
            add.push(nowData);
        }
    }
    for (const beforeData of beforeDatas) {
        if (nowDatas.indexOf(beforeData) < 0) {
            remove.push(beforeData);
        }
    }
    return [add, remove]
}


