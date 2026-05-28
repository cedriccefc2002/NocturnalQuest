import { parse } from "@std/toml";
import { contentType } from "@std/media-types";
import { extname } from "node:path";
import { ImageMagick, IMagickImage, initialize, MagickFormat } from "imagemagick";

import { dirAllFiles } from "./common.ts"

// ImageMagick initialize
await initialize();

function resizeImage(data: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
  // const data: Uint8Array = await Deno.readFile("image.jpg");
  let resp = data;
  ImageMagick.read(data, (img: IMagickImage) => {
    // 395x564
    img.resize(395, 564);
    // img.blur(20, 6);
    img.write(MagickFormat.Jpeg, (x) => { resp = x as Uint8Array<ArrayBuffer> });
  });
  return resp;
}

const currentDir = Deno.cwd(); // 取得目前的工作目錄路徑
console.log("cwd", currentDir);

interface IConfigItem {
  ResizeImage?: boolean;
  BaseSources: string[];
  Source: Array<{
    name: string,
    sources: string[]
  }>;
}
interface IStateItem {
  BaseSources: string[];
  ByType: Map<string, string[]>;
}
const ImageState: {
  Background: IStateItem,
  Monster: IStateItem;
  Class: IStateItem;
} = {
  Background: {
    BaseSources: [],
    ByType: new Map()
  },
  Monster: {
    BaseSources: [],
    ByType: new Map()
  },
  Class: {
    BaseSources: [],
    ByType: new Map()
  },
};

const RouteMap = new Map<URLPattern, (req: Request, match: URLPatternResult) => Promise<Response>>();
const cfg = parse(Deno.readTextFileSync("server.toml")) as {
  Background: IConfigItem,
  Monster: IConfigItem;
  Class: IConfigItem;
  exts: string[];
  Server: {
    port: number;
    hostname: string;
    img_cache_control_max_age: number;
  }
};
async function LoadAllFiles() {
  ImageState.Background.BaseSources = await loadFrom(cfg.Background.BaseSources);
  ImageState.Monster.BaseSources = await loadFrom(cfg.Monster.BaseSources);
  const background: { [k: string]: number } = {};
  for (const element of cfg.Background.Source) {
    console.log("scan", element);
    const files = [...ImageState.Background.BaseSources, ...await loadFrom(element.sources)];
    background[element.name] = files.length;
    ImageState.Background.ByType.set(element.name, files);
  }

  ImageState.Monster.BaseSources = await loadFrom(cfg.Monster.BaseSources);
  const monster: { [k: string]: number } = {};
  for (const element of cfg.Monster.Source) {
    console.log("scan", element);
    const files = [...ImageState.Monster.BaseSources, ...await loadFrom(element.sources)];
    monster[element.name] = files.length;
    ImageState.Monster.ByType.set(element.name, files);
  }

  ImageState.Class.BaseSources = await loadFrom(cfg.Class.BaseSources);
  const classResult: { [k: string]: number } = {};
  for (const element of cfg.Class.Source) {
    console.log("scan", element);
    const files = [...ImageState.Class.BaseSources, ...await loadFrom(element.sources)];
    classResult[element.name] = files.length;
    ImageState.Class.ByType.set(element.name, files)
  }

  return {
    Background: background,
    Monster: monster,
    Class: classResult
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

async function StreamRandImage(images: string[]) {
  const randomNum = Math.floor(Math.random() * images.length);
  const filename = images[randomNum];
  const ext = contentType(extname(filename)) ?? "binary/octet-stream";
  console.log(`"${filename}","${ext}"`);
  const file = await Deno.open(filename, { read: true });
  return new Response(file.readable, {
    headers: {
      "content-type": ext,
      "cache-control": `public, max-age=${cfg.Server.img_cache_control_max_age}, immutable` // 讓遊戲可以預載資源後減少切換閃爍
    }
  });
}

async function RandImageAndResize(images: string[]) {
  const randomNum = Math.floor(Math.random() * images.length);
  const filename = images[randomNum];
  console.log(`"${filename}"`);
  const data = await Deno.readFile(filename);
  return new Response(resizeImage(data), {
    headers: {
      "content-type": "image/Jpeg",
      "cache-control": `public, max-age=${cfg.Server.img_cache_control_max_age}, immutable` // 讓遊戲可以預載資源後減少切換閃爍
    }
  });
}


RouteMap.set(new URLPattern({ pathname: "/" }), () => {
  return new Promise((resolve) => {
    const body = JSON.stringify([...RouteMap.keys().map(x => x.pathname)])
    resolve(new Response(body))
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/bg/mines_map.jpg/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/bg/:type.:ext/:id" }), async (req, match) => {
  // Open the file for reading
  const type = match.pathname.groups.type;
  if (type !== undefined) {
    let images = ImageState.Background.ByType.get(type);
    if (images === undefined) {
      images = ImageState.Background.BaseSources;
    }
    return await StreamRandImage(images);
  }

  return new Response(`Not found ${req.url}`, {
    status: 404,
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/class/wizard_frost.jpg/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/class/:type.:ext/:id" }), async (req, match) => {
  // Open the file for reading
  const type = match.pathname.groups.type;
  if (type !== undefined) {
    let images = ImageState.Class.ByType.get(type);
    if (images === undefined) {
      images = ImageState.Class.BaseSources;
    }
    if (cfg.Class.ResizeImage) {
      return await RandImageAndResize(images);
    } else {
      return await StreamRandImage(images);
    }
  }

  return new Response(`Not found ${req.url}`, {
    status: 404,
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/monster/thunderous_beast/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/monster/:type/:id" }), async (req, match) => {
  // Open the file for reading
  const type = match.pathname.groups.type;
  if (type !== undefined) {
    let images = ImageState.Monster.ByType.get(type);
    if (images === undefined) {
      images = ImageState.Monster.BaseSources;
    }
    if (cfg.Monster.ResizeImage) {
      return await RandImageAndResize(images);
    } else {
      return await StreamRandImage(images);
    }
  }

  return new Response(`Not found ${req.url}`, {
    status: 404,
  });
});

/**
 * const url = `http://127.0.0.1:8000/image/rand/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/rand/:id" }), () => {
  return StreamRandImage(ImageState.Background.BaseSources);
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


