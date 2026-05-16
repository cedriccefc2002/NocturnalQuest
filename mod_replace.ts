import { extname } from "node:path";

const cfg = (await import("./mod_replace.config.ts")).config;
console.log("config:", cfg);

let mainjs = await Deno.readTextFile(cfg.替換.替換檔);
let hasModify = false;
console.log("mainjs", mainjs.length);

function _replaceIfFind(mainjs: string, searchString: string, replaceString: string) {
  if (mainjs.indexOf(searchString) > 0) {
    console.log("find", searchString);
    console.log("replace", replaceString);
    hasModify = true;
    return mainjs.replace(searchString, replaceString);
  } else {
    return mainjs;
  }
}

async function _dirCount(path: string, ext: string) {
  let count = 0;
  // console.log("_dirCount", path, ext);
  for await (const entry of Deno.readDir(path)) {
    if (entry.isFile && extname(entry.name) == ext) {
      count++;
    }
  }
  return count;
}

async function _dirSubCount(path: string, ext: string) {
  const results: [name: string, count: number][] = [];
  for await (const entry of Deno.readDir(path)) {
    if (entry.isDirectory) {
      // console.log("_dirSubCount", path, ext);
      results.push([entry.name, await _dirCount(`${path}/${entry.name}`, ext)])
    }
  }
  return results;
}

const bgCount = await _dirCount(`${cfg.模組.基礎路徑}/${cfg.模組.模組路徑}/${cfg.模組.背景動圖路徑}`, cfg.模組.動圖副檔名);
const bgPath = `${cfg.模組.模組路徑}/${cfg.模組.背景動圖路徑}`;
console.log("bgPath", bgPath);
console.log("bgCount", bgCount);

const classPath = `${cfg.模組.模組路徑}/${cfg.模組.職業路徑}`;
const classSettings = await _dirSubCount(`${cfg.模組.基礎路徑}/${cfg.模組.模組路徑}/${cfg.模組.職業路徑}`, cfg.模組.圖副檔名);
// let classCount = -1;
// for (const [_, c] of classSettings) {
//   if (classCount < 0) {
//     classCount = c;
//   } else {
//     if (classCount > c) {
//       classCount = c;
//     }
//   }
// }
console.log("classPath", classPath);
// console.log("classCount", classCount);
console.log("classSettings", classSettings);

const monsterPath = `${cfg.模組.模組路徑}/${cfg.模組.怪物路徑}`;
const monsterSettings = await _dirSubCount(`${cfg.模組.基礎路徑}/${cfg.模組.模組路徑}/${cfg.模組.怪物路徑}`, cfg.模組.圖副檔名);
console.log("monsterPath", monsterPath);
console.log("monsterSettings", monsterSettings);

const random = (count: number) => `\${Math.floor(Math.random() * ${count})}`
const randomByDate = (count: number, sec: number = 10) => `\${parseInt(Date.now()/1000/${sec})%${count}}`

if (cfg.替換.技能背景面板) {
  // background-image: url('`,n.mapBgImage,`');
  const searchString = `background-image: url('\`,e.classesDict[t.unit.class].talentsImage,\`');`;
  // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
  const replaceString = `background-image: url('${bgPath}/\`,\`${randomByDate(bgCount)}\`,\`.webp');`;
  mainjs = _replaceIfFind(mainjs, searchString, replaceString);
}

if (cfg.替換.戰鬥地圖.上方橫幅) {
  // background-image: url('`,n.mapBgImage,`');
  const searchString = `background-image: url('\`,n.mapBgImage,\`');`;
  // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
  const replaceString = `background-image: url('${bgPath}/\`,\`\${parseInt(Date.now()/1000/10)%${bgCount}}\`,\`.webp');`;
  mainjs = _replaceIfFind(mainjs, searchString, replaceString);
}

if (cfg.替換.戰鬥背景) {
  // r.nativeElement.style.backgroundImage=`url(${x.mapBgImage})`
  const searchString = `r.nativeElement.style.backgroundImage=\`url(\${x.mapBgImage})\``;
  // r.nativeElement.style.backgroundImage=`url(themes/bg/${Date.now()%835}.webp)`
  const replaceString = `r.nativeElement.style.backgroundImage=\`url(${bgPath}/${random(bgCount)}.webp)\``;
  mainjs = _replaceIfFind(mainjs, searchString, replaceString);
}

if (cfg.替換.職業) {
  // s=n.avatars[r];
  const searchString = `s=n.avatars[r];`;
  let classKind = `n.avatars[r]`;

  if (cfg.模組.職業模式 == 1) {
    // s=`themes/class/${n.avatars["default"].split(".")[0]}/${Math.floor(Math.random() * 30)}.jpg`;
    classKind = `n.avatars["default"]`;
  } else {
    // s=`themes/class/${n.avatars[r].split(".")[0]}/${Math.floor(Math.random() * 40)}.jpg`;
    classKind = `n.avatars[r]`;
  }
/*
s=((t)=>{
  t = t.split(".")[0];
  let s = 0;
  if(t==="lycan") s=31;
if(t==="priest") s=50;
if(t==="rogue") s=50;
if(t==="shaman") s=30;
if(t==="warlock") s=50;
if(t==="warrior") s=46;
if(t==="wizard") s=48;
  return "themes/class/"+t+"/"+Math.floor(Math.random()*s)+".jpg";
})(n.avatars["default"]);
*/
  const replaceString =
    `
s=((t)=>{
  t = t.split(".")[0];
  let s = 0;
  ${classSettings.map(x => `if(t==="${x[0]}") s=${x[1]};`).join("\n")}
  return "${classPath}/"+t+"/"+Math.floor(Math.random()*s)+".jpg";
})(${classKind});
  `;
  mainjs = _replaceIfFind(mainjs, searchString, replaceString);
}

if (cfg.替換.怪物) {
  for (const [name, count] of monsterSettings) {
    console.log(name, count);
    // ",image:"skeleton_warrior.jpg",ranks:["
    const searchString1 = `",image:"${name}.jpg",ranks:["`;
    // ",image:`themes/monster/skeleton_warrior/0.jpg`,ranks:["
    const replaceString1 = `",image:\`${monsterPath}/${name}/0.jpg\`,ranks:["`;
    mainjs = _replaceIfFind(mainjs, searchString1, replaceString1);
    // this.unit.unit.image="skeleton_warrior.jpg"
    const searchString2 = `this.unit.unit.image="${name}.jpg"`;
    // this.unit.unit.image=`themes/monster/skeleton_warrior/${Math.floor(Math.random() * 73)}.jpg`
    const replaceString2 = `this.unit.unit.image=\`${monsterPath}/${name}/${random(count)}.jpg\``;
    mainjs = _replaceIfFind(mainjs, searchString2, replaceString2);
  }
}

// "background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
const globalbg = `"background-image",\`url(${bgPath}/${random(bgCount)}.webp)\`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"`;
if (cfg.替換.鍊金術) {
  // "background-image","url(alchemist_bg.jpg)"
  mainjs = _replaceIfFind(mainjs, `"background-image","url(alchemist_bg.jpg)"`, globalbg);
}
if (cfg.替換.植物學家) {
  // "background-image","url(botanist_bg.jpg)"
  mainjs = _replaceIfFind(mainjs, `"background-image","url(botanist_bg.jpg)"`, globalbg);
}

if (cfg.替換.商店) {
  // "background-image","url(shop_bg.jpg)"
  mainjs = _replaceIfFind(mainjs, `"background-image","url(shop_bg.jpg)"`, globalbg);
}

if (cfg.替換.城鎮) {
  // "background-image","url(town_bg.jpg)"
  mainjs = _replaceIfFind(mainjs, `"background-image","url(town_bg.jpg)"`, globalbg);
}

if (cfg.替換.總部) {
  // "background","linear-gradient(to top, #000000c7, #00000052), url(dunes_map.jpg)"
  const searchString = `"background","linear-gradient(to top, #000000c7, #00000052), url(dunes_map.jpg)"`;
  // "background",`linear-gradient(to top, #000000c7, #00000052), url(cefc/map/${Date.now()%10}.webp)`
  const replaceString = `"background",\`linear-gradient(to top, #000000c7, #00000052), url(${bgPath}/\${Date.now()%${bgCount}}.webp)\``;
  mainjs = _replaceIfFind(mainjs, searchString, replaceString);
}

if (cfg.替換.鐵匠) {
  // 天賦背景
  // "background-image",'url("blacksmith_talents_bg.jpg")'
  mainjs = _replaceIfFind(mainjs, `"background-image",'url("blacksmith_talents_bg.jpg")'`, globalbg);
}

if (hasModify) {
  // await Deno.rename(cfg.替換.替換檔, `${cfg.替換.替換檔}.${Date.now()}.bak`);
  await Deno.writeTextFile(cfg.替換.替換檔, mainjs);
}


async function pressAnyKey(message = "Press any key to continue...") {
  console.log(message);

  // Set stdin to raw mode to capture single keypresses
  Deno.stdin.setRaw(true);

  const buffer = new Uint8Array(1);
  await Deno.stdin.read(buffer);

  // Return to normal mode
  Deno.stdin.setRaw(false);
}

await pressAnyKey();