import { extname } from "node:path";

const cfg = (await import("./mod_replace.config.ts")).config;
console.log("config:", cfg);

let mainjs = await Deno.readTextFile(cfg.替換.替換檔);
let hasModify = false;
console.log("mainjs", mainjs.length);

async function _dirCount(path: string, ext: string) {
  let count = 0;
  console.log("_dirCount", path, ext);
  for await (const entry of Deno.readDir(path)) {
    if (extname(entry.name) == ext) {
      count++;
    }
  }
  return count;
}

const bgCount = await _dirCount(`${cfg.模組.基礎路徑}/${cfg.模組.模組路徑}/${cfg.模組.背景動圖路徑}`, cfg.模組.動圖副檔名);
const bgPath = `${cfg.模組.模組路徑}/${cfg.模組.背景動圖路徑}`;
console.log("bgPath", bgPath);
console.log("bgCount", bgCount);

let classCount = -1;
const classPath = `${cfg.模組.模組路徑}/${cfg.模組.職業路徑}`;

for (const element of cfg.模組.職業子目錄) {
  const c = await _dirCount(`${cfg.模組.基礎路徑}/${cfg.模組.模組路徑}/${cfg.模組.職業路徑}/${element}`, cfg.模組.圖副檔名);
  if (classCount < 0) {
    classCount = c;
  } else {
    if (classCount > c) {
      classCount = c;
    }
  }
}
console.log("classPath", classPath);
console.log("classCount", classCount);

if (cfg.替換.技能背景面板) {
  // background-image: url('`,n.mapBgImage,`');
  const searchString = `background-image: url('\`,e.classesDict[t.unit.class].talentsImage,\`');`;
  // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
  const replaceString = `background-image: url('${bgPath}/\`,\`\${parseInt(Date.now()/1000/10)%${bgCount}}\`,\`.webp');`;
  if (mainjs.indexOf(searchString) > 0) {
    console.log("find", searchString);
    console.log("replace", replaceString);
    mainjs = mainjs.replace(searchString, replaceString);
    hasModify = true;
  }
}

if (cfg.替換.戰鬥地圖.上方橫幅) {
  // background-image: url('`,n.mapBgImage,`');
  const searchString = `background-image: url('\`,n.mapBgImage,\`');`;
  // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
  const replaceString = `background-image: url('${bgPath}/\`,\`\${parseInt(Date.now()/1000/10)%${bgCount}}\`,\`.webp');`;
  if (mainjs.indexOf(searchString) > 0) {
    console.log("find", searchString);
    console.log("replace", replaceString);
    mainjs = mainjs.replace(searchString, replaceString);
    hasModify = true;
  }
}

if (cfg.替換.戰鬥背景) {
  // r.nativeElement.style.backgroundImage=`url(${x.mapBgImage})`
  const searchString = `r.nativeElement.style.backgroundImage=\`url(\${x.mapBgImage})\``;
  // r.nativeElement.style.backgroundImage=`url(themes/bg/${Date.now()%835}.webp)`
  const replaceString = `r.nativeElement.style.backgroundImage=\`url(${bgPath}/\${Date.now()%${bgCount}}.webp)\``;
  if (mainjs.indexOf(searchString) > 0) {
    console.log("find", searchString);
    console.log("replace", replaceString);
    mainjs = mainjs.replace(searchString, replaceString);
    hasModify = true;
  }
}

if (cfg.替換.職業) {
  // s=n.avatars[r];
  const searchString = `s=n.avatars[r];`;
  let replaceString = searchString;

  if (cfg.模組.職業模式 == 1) {
    // s=`themes/class/${n.avatars["default"].split(".")[0]}/${Math.floor(Math.random() * 30)}.jpg`;
    replaceString = `s=\`${classPath}/\${n.avatars["default"].split(".")[0]}/\${Math.floor(Math.random() * ${classCount})}.jpg\`;`;
  } else {
    // s=`themes/class/${n.avatars[r].split(".")[0]}/${Math.floor(Math.random() * 40)}.jpg`;
    replaceString = `s=\`${classPath}/\${n.avatars[r].split(".")[0]}/\${Math.floor(Math.random() * ${classCount})}.jpg\`;`;
  }

  if (mainjs.indexOf(searchString) > 0) {
    console.log("find", searchString);
    console.log("replace", replaceString);
    mainjs = mainjs.replace(searchString, replaceString);
    hasModify = true;
  }
}

if (hasModify) {
  await Deno.rename(cfg.替換.替換檔, `${cfg.替換.替換檔}.${Date.now()}.bak`);
  await Deno.writeTextFile(cfg.替換.替換檔, mainjs);
}
