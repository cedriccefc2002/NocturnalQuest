import { parse } from "@std/toml";
import { contentType } from "@std/media-types";
import { extname } from "node:path";

import { dirAllFiles } from "./common.ts"

const currentDir = Deno.cwd(); // 取得目前的工作目錄路徑
console.log("cwd", currentDir);
const ImageState: {
  Background: string[],
  Monster: Map<string, string[]>
} = {
  Background: [],
  Monster: new Map(),
};
const RouteMap = new Map<URLPattern, (req: Request, match: URLPatternResult) => Promise<Response>>();
const cfg = parse(Deno.readTextFileSync("server.toml")) as {
  Background: {
    sources: string[];
  },
  Monster: {
    Source: Array<{
      name: string,
      sources: string[]
    }>
  };
  exts: string[];
  Server: {
    port: number;
    hostname: string;
  }
};
async function LoadAllFiles() {
  ImageState.Background = await loadFrom(cfg.Background.sources);
  const monster: { [k: string]: number } = {};
  for (const element of cfg.Monster.Source) {
    const files = await loadFrom(element.sources);
    monster[element.name] = files.length;
    ImageState.Monster.set(element.name, files)
  }
  return {
    Background: ImageState.Background.length,
    Monster: monster
  }
}
async function loadFrom(dirs: string[]) {
  const set = new Set<string>();
  for (const dir of dirs) {
    for (const element of (await dirAllFiles(dir, cfg.exts))) {
      set.add(element);
    }
  }
  return [...set.values()];
}


RouteMap.set(new URLPattern({ pathname: "/" }), () => {
  return new Promise((resolve) => {
    const body = JSON.stringify([...RouteMap.keys().map(x => x.pathname)])
    resolve(new Response(body))
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/monster/thunderous_beast/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/monster/:type/:id" }), async (req, match) => {
  // Open the file for reading
  const type = match.pathname.groups.type;
  if (type !== undefined) {
    const images = ImageState.Monster.get(type);
    if (images !== undefined) {
      const randomNum = Math.floor(Math.random() * images.length);
      const filename = images[randomNum];
      const ext = contentType(extname(filename)) ?? "binary/octet-stream";
      console.log(`"${filename}","${ext}"`);
      const file = await Deno.open(filename, { read: true });
      return new Response(file.readable, {
        headers: {
          "content-type": ext,
          // Cache-Control: public, max-age=604800, immutable
          "cache-control": "public, max-age=60, immutable" // 讓遊戲可以預載資源後減少切換閃爍
        }
      });
    }
  }
  return new Response(`Not found ${req.url}`, {
    status: 404,
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/rand/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/rand/:id" }), async () => {
  // Open the file for reading
  const randomNum = Math.floor(Math.random() * ImageState.Background.length);
  const filename = ImageState.Background[randomNum];
  const ext = contentType(extname(filename)) ?? "binary/octet-stream";
  console.log(`"${filename}","${ext}"`);
  const file = await Deno.open(filename, { read: true });
  return new Response(file.readable, {
    headers: {
      "content-type": ext,
      // Cache-Control: public, max-age=604800, immutable
      "cache-control": "public, max-age=60, immutable" // 讓遊戲可以預載資源後減少切換閃爍
    }
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/refresh`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/refresh" }), async () => {
  const result = await LoadAllFiles();
  return new Response(`${JSON.stringify(result)}`);
});

console.log("RouteMap", RouteMap.size);
console.log("cfg", cfg);
const result = await LoadAllFiles();
console.log("init", result);
Deno.serve({ port: cfg.Server.port, hostname: cfg.Server.hostname }, async (req) => {
  for (const [k, v] of RouteMap.entries()) {
    const match = k.exec(req.url);
    if (match) {
      return await v(req, match);
    }
  }
  return new Response(`Not found ${req.url}`, {
    status: 404,
  });
});
