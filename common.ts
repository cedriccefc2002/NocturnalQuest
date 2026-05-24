import { extname, join as pathJoin } from "node:path";

export async function pressAnyKey(message = "Press any key to continue...") {
  console.log(message);

  // Set stdin to raw mode to capture single keypresses
  Deno.stdin.setRaw(true);

  const buffer = new Uint8Array(1);
  await Deno.stdin.read(buffer);

  // Return to normal mode
  Deno.stdin.setRaw(false);
}
export type source = {
  hasModify: boolean;
  content: string;
}
export function replaceIfFind(source: source, searchString: string, replaceString: string) {
  if (source.content.indexOf(searchString) > 0) {
    console.log("find", searchString);
    console.log("replace", replaceString);
    source.hasModify = true;
    source.content = source.content.replace(searchString, replaceString)
  }
}

export async function dirAllFiles(path: string, ext: string) {
  const dirFiles: string[] = [];
  for await (const entry of Deno.readDir(path)) {
    const fullname = pathJoin(path, entry.name);
    if (entry.isDirectory) {
      dirFiles.push(... await dirAllFiles(fullname, ext));
    } else if (entry.isFile && extname(entry.name) == ext) {
      dirFiles.push(fullname);
    }
  }
  return dirFiles;
}

export async function dirFiles(path: string, ext: string) {
  const dirFiles: string[] = [];
  // console.log("_dirCount", path, ext);
  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile && extname(entry.name) == ext) {
      dirFiles.push(entry.name);
    }
  }
  return dirFiles;
}

export async function dirCount(path: string, ext: string) {
  let count = 0;
  // console.log("_dirCount", path, ext);
  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile && extname(entry.name) == ext) {
      count++;
    }
  }
  return count;
}

export async function dirSubCount(path: string, ext: string) {
  const results: [name: string, count: number][] = [];
  for await (const entry of Deno.readDir(path)) {
    if (entry.isDirectory) {
      // console.log("_dirSubCount", path, ext);
      results.push([entry.name, await dirCount(`${path}/${entry.name}`, ext)])
    }
  }
  return results;
}