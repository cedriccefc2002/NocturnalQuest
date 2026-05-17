import { pressAnyKey, dirCount, dirSubCount, replaceIfFind, source } from "./common.ts";

const cfg = (await import("./mod_replace.config.ts")).config;
console.log("config:", cfg);

const mainjs: source =
{
  hasModify: false,
  content: await Deno.readTextFile(cfg.替換檔路徑),
}
console.log("mainjs", mainjs.content.length);

const basePath = `${cfg.模組.基礎路徑}/${cfg.模組.佈景主題}`;
const baseWebPath = `${cfg.模組.Web路徑}/${cfg.模組.佈景主題}`;

const random = (count: number) => `\${Math.floor(Math.random() * ${count})}`
// const randomByDate = (count: number, sec: number = 10) => `\${parseInt(Date.now()/1000/${sec})%${count}}`

if (cfg.替換.職業技能背景) {
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.職業技能背景}`;
  const settings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.職業技能背景}`, cfg.模組.圖片副檔名);
  console.log("職業技能背景 Path", bgPath);
  console.log("職業技能背景 Settings", settings);

  if (settings.length > 0) {
    // background-image: url('`,e.classesDict[t.unit.class].talentsImage,`');
    const searchString = `background-image: url('\`,e.classesDict[t.unit.class].talentsImage,\`');`;
    const action  =`
    ((t)=>{
  t = t.split(".")[0];
  let s = 0;
  ${settings.map(x => `if(t==="${x[0]}") s=${x[1]};`).join("\n")}
  return "${bgPath}/"+t+"/"+parseInt(Date.now()/1000/10)%s+".webp";
})(e.classesDict[t.unit.class].talentsImage)
    `;
    const replaceString =`background-image: url('\`,${action},\`');`;
    // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
    // const replaceString = `background-image: url('${bgPath}/\`,\`${randomByDate(bgCount)}\`,\`.webp');`;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.地下城選擇上方橫幅) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.地下城選擇上方橫幅}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.地下城選擇上方橫幅}`;
  console.log("地下城選擇上方橫幅 Path", bgPath);
  console.log("地下城選擇上方橫幅 Count", bgCount);

  if (bgCount > 0) {
    // background-image: url('`,n.mapBgImage,`');
    const searchString = `background-image: url('\`,n.mapBgImage,\`');`;
    // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
    const replaceString = `background-image: url('${bgPath}/\`,\`\${parseInt(Date.now()/1000/10)%${bgCount}}\`,\`.webp');`;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.戰鬥時背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.戰鬥時背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.戰鬥時背景}`;
  console.log("戰鬥時背景 Path", bgPath);
  console.log("戰鬥時背景 Count", bgCount);

  if (bgCount > 0) {
    // r.nativeElement.style.backgroundImage=`url(${x.mapBgImage})`
    const searchString = `r.nativeElement.style.backgroundImage=\`url(\${x.mapBgImage})\``;
    // r.nativeElement.style.backgroundImage=`url(themes/bg/${Date.now()%835}.webp)`
    const replaceString = `r.nativeElement.style.backgroundImage=\`url(${bgPath}/${random(bgCount)}.webp)\``;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.職業卡片) {
  const classPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.職業卡片}`;
  const classSettings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.職業卡片}`, cfg.模組.圖片副檔名);
  console.log("職業卡片 Path", classPath);
  console.log("職業卡片 Settings", classSettings);

  if (classSettings.length > 0) {
    // s=n.avatars[r];
    const searchString = `s=n.avatars[r];`;
    let classKind = `n.avatars[r]`;

    if (cfg.模組.職業模式 == 1) {
      // s=`themes/class/${n.avatars["default"].split(".")[0]}/${Math.floor(Math.random() * 30)}.webp`;
      classKind = `n.avatars["default"]`;
    } else {
      // s=`themes/class/${n.avatars[r].split(".")[0]}/${Math.floor(Math.random() * 40)}.webp`;
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
      return "themes/class/"+t+"/"+Math.floor(Math.random()*s)+".webp";
    })(n.avatars["default"]);
    */
    const replaceString =
      `
s=((t)=>{
  t = t.split(".")[0];
  let s = 0;
  ${classSettings.map(x => `if(t==="${x[0]}") s=${x[1]};`).join("\n")}
  return "${classPath}/"+t+"/"+Math.floor(Math.random()*s)+".webp";
})(${classKind});
  `;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.怪物卡片) {
  const monsterPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.怪物卡片}`;
  const monsterSettings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.怪物卡片}`, cfg.模組.圖片副檔名);
  console.log("怪物卡片 Path", monsterPath);
  console.log("怪物卡片 Settings", monsterSettings);

  if (monsterSettings.length > 0) {
    for (const [name, count] of monsterSettings) {
      console.log(name, count);
      if (count > 0) {
        // ",image:"skeleton_warrior.jpg",ranks:["
        const searchString1 = `",image:"${name}.jpg",ranks:["`;
        // ",image:`themes/monster/skeleton_warrior/0.webp`,ranks:["
        const replaceString1 = `",image:\`${monsterPath}/${name}/0.webp\`,ranks:["`;
        replaceIfFind(mainjs, searchString1, replaceString1);
        // this.unit.unit.image="skeleton_warrior.jpg"
        const searchString2 = `this.unit.unit.image="${name}.jpg"`;
        // this.unit.unit.image=`themes/monster/skeleton_warrior/${Math.floor(Math.random() * 73)}.webp`
        const replaceString2 = `this.unit.unit.image=\`${monsterPath}/${name}/${random(count)}.webp\``;
        replaceIfFind(mainjs, searchString2, replaceString2);
      }
    }
  }
}

// "background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
const globalbg = (bgPath: string, bgCount: number) => `"background-image",\`url(${bgPath}/${random(bgCount)}.webp)\`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"`;
if (cfg.替換.鍊金術背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.鍊金術背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.鍊金術背景}`;
  console.log("鍊金術背景 Path", bgPath);
  console.log("鍊金術背景 Count", bgCount);

  if (bgCount > 0) {
    // "background-image","url(alchemist_bg.jpg)"
    replaceIfFind(mainjs, `"background-image","url(alchemist_bg.jpg)"`, globalbg(bgPath, bgCount));
  }
}
if (cfg.替換.植物學家背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.植物學家背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.植物學家背景}`;
  console.log("植物學家背景 Path", bgPath);
  console.log("植物學家背景 Count", bgCount);

  if (bgCount > 0) {
    // "background-image","url(botanist_bg.jpg)"
    replaceIfFind(mainjs, `"background-image","url(botanist_bg.jpg)"`, globalbg(bgPath, bgCount));
  }
}

if (cfg.替換.商店背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.商店背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.商店背景}`;
  console.log("商店背景 Path", bgPath);
  console.log("商店背景 Count", bgCount);

  if (bgCount > 0) {
    // "background-image","url(shop_bg.jpg)"
    replaceIfFind(mainjs, `"background-image","url(shop_bg.jpg)"`, globalbg(bgPath, bgCount));
  }
}

if (cfg.替換.城鎮背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.城鎮背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.城鎮背景}`;
  console.log("城鎮背景 Path", bgPath);
  console.log("城鎮背景 Count", bgCount);

  if (bgCount > 0) {
    // "background-image","url(town_bg.jpg)"
    replaceIfFind(mainjs, `"background-image","url(town_bg.jpg)"`, globalbg(bgPath, bgCount));
  }
}

if (cfg.替換.總部背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.總部背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.總部背景}`;
  console.log("總部背景 Path", bgPath);
  console.log("總部背景 Count", bgCount);

  if (bgCount > 0) {
    // "background","linear-gradient(to top, #000000c7, #00000052), url(dunes_map.jpg)"
    const searchString = `"background","linear-gradient(to top, #000000c7, #00000052), url(dunes_map.jpg)"`;
    // "background",`linear-gradient(to top, #000000c7, #00000052), url(cefc/map/${Date.now()%10}.webp)`
    const replaceString = `"background",\`linear-gradient(to top, #000000c7, #00000052), url(${bgPath}/\${Date.now()%${bgCount}}.webp)\``;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.鐵匠天賦背景) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.鐵匠天賦背景}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.鐵匠天賦背景}`;
  console.log("鐵匠天賦背景 Path", bgPath);
  console.log("鐵匠天賦背景 Count", bgCount);

  if (bgCount > 0) {
    // 天賦背景
    // "background-image",'url("blacksmith_talents_bg.jpg")'
    replaceIfFind(mainjs, `"background-image",'url("blacksmith_talents_bg.jpg")'`, globalbg(bgPath, bgCount));
  }
}


if (cfg.替換.珠寶商上方橫幅) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.珠寶商上方橫幅}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.珠寶商上方橫幅}`;
  console.log("珠寶商上方橫幅 Path", bgPath);
  console.log("珠寶商上方橫幅 Count", bgCount);

  if (bgCount > 0) {
    // 珠寶商上方橫幅
    // "background-image","url(jeweler_bg.jpg)"
    replaceIfFind(mainjs, `"background-image","url(jeweler_bg.jpg)"`, globalbg(bgPath, bgCount));
  }
}

if (cfg.替換.自動法師小屋上方橫幅) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.自動法師小屋上方橫幅}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.自動法師小屋上方橫幅}`;
  console.log("自動法師小屋上方橫幅 Path", bgPath);
  console.log("自動法師小屋上方橫幅 Count", bgCount);

  if (bgCount > 0) {
    // 自動法師小屋上方橫幅
    // "background-image","url(automagus_bg.png)"
    replaceIfFind(mainjs, `"background-image","url(automagus_bg.png)"`, globalbg(bgPath, bgCount));
  }
}

if (cfg.替換.酒館上方橫幅) {
  const bgCount = await dirCount(`${basePath}/${cfg.模組.佈景主題各子目錄.酒館上方橫幅}`, cfg.模組.圖片副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.酒館上方橫幅}`;
  console.log("酒館上方橫幅 Path", bgPath);
  console.log("酒館上方橫幅 Count", bgCount);

  if (bgCount > 0) {
    // 酒館上方橫幅
    // "background-image","url(tavern.jpg)"
    replaceIfFind(mainjs, `"background-image","url(tavern.jpg)"`, globalbg(bgPath, bgCount));
  }
}

if (mainjs.hasModify) {
  if (cfg.存檔前先備份) {
    await Deno.rename(cfg.替換檔路徑, `${cfg.替換檔路徑}.${Date.now()}.bak`);
  }
  await Deno.writeTextFile(cfg.替換檔路徑, mainjs.content);
}


await pressAnyKey();