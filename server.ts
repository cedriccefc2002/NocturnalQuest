import { dirAllFiles } from "./common.ts"

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

const imageArray = await dirAllFiles("themes/aldult", ".webp");
console.log("find imageArray", imageArray.length)

Deno.serve(async () => {
  try {
    // Open the file for reading
    const randomNum = Math.floor(Math.random() * imageArray.length); 
    const file = await Deno.open(imageArray[randomNum], { read: true });

    // Return the readable stream as the body of the response
    return new Response(file.readable, {
      headers: { "content-type": "image/webp" },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
});

