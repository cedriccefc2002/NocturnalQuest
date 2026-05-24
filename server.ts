import { parse } from "@std/toml";
import { contentType } from "@std/media-types";
import { extname } from "node:path";

import { dirAllFiles } from "./common.ts"

const ImageSet = new Set<string>();
let ImageArray: string[] = [];
const RouteMap = new Map<URLPattern, (req: Request, match: URLPatternResult) => Promise<Response>>();
const cfg = parse(Deno.readTextFileSync("./server.toml")) as {
  sources: string[];
  exts: string[];
  Server: {
    port: number;
    hostname: string;
  }
};
async function loadFrom(dirs: string[]) {
  for (const dir of dirs) {
    for (const element of (await dirAllFiles(dir, cfg.exts))) {
      ImageSet.add(element);
    }
  }
  ImageArray = [...ImageSet.values()];
  console.log("ImageSet", ImageArray.length)
}
RouteMap.set(new URLPattern({ pathname: "/" }), () => {
  return new Promise((resolve) => {
    const body = JSON.stringify([...RouteMap.keys().map(x => x.pathname)])
    resolve(new Response(body))
  });
})

/**
 * const url = `http://127.0.0.1:8000/image/rand/${Date.now()}`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/rand/:id" }), async () => {
  // Open the file for reading
  const randomNum = Math.floor(Math.random() * ImageArray.length);
  const filename = ImageArray[randomNum];
  console.log(filename);
  const file = await Deno.open(filename, { read: true });
  return new Response(file.readable, {
    headers: {
      "content-type": contentType(extname(filename)) ?? "binary/octet-stream",
      // Cache-Control: public, max-age=604800, immutable
      "cache-control": "public, max-age=604800, immutable" // 讓遊戲可以預載資源後減少切換閃爍
    }
  });
})

/**
 * const url = `http://127.0.0.1:8000/image/refresh`;
 */
RouteMap.set(new URLPattern({ pathname: "/image/refresh" }), async () => {
  await loadFrom(cfg.sources);
  return new Response(`${ImageArray.length}`);
})

console.log("RouteMap", RouteMap.size);
console.log("cfg", cfg);
await loadFrom(cfg.sources);
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

// http://127.0.0.1:8000/image/123456789.webp
// Deno.serve(async (req) => {
//   console.log("Method:", req.method);

//   const url = new URL(req.url);
//   console.log("Path:", url.pathname);
//   console.log("Query parameters:", url.searchParams);

//   console.log("Headers:", req.headers);

//   let timer: NodeJS.Timeout;
//   const body = new ReadableStream({
//     async start(controller) {
//       timer = setInterval(() => {
//         controller.enqueue("Hello, World!\n");
//       }, 1000);
//     },
//     cancel() {
//       clearInterval(timer);
//     },
//   });
//   return new Response(body.pipeThrough(new TextEncoderStream()), {
//     headers: {
//       "content-type": "text/plain; charset=utf-8",
//     },
//   });

//   // if (req.body) {
//   //   const body = await req.text();
//   //   console.log("Body:", body);
//   // }

//   // return new Response("Hello, World!");
// });

// const imageArray = await dirAllFiles("themes/aldult", ".webp");
// console.log("find imageArray", imageArray.length)

// Deno.serve({ port: 8000, hostname: "127.0.0.1" }, async () => {
//   try {
//     // Open the file for reading
//     const randomNum = Math.floor(Math.random() * imageArray.length);
//     const file = await Deno.open(imageArray[randomNum], { read: true });

//     // Return the readable stream as the body of the response
//     return new Response(file.readable, {
//       headers: { "content-type": "image/webp" },
//     });
//   } catch {
//     return new Response("File not found", { status: 404 });
//   }
// });


// console.log(data.int);
// console.log(data.bin.length);