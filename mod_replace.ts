import { basename, join } from "node:path";
import { pressAnyKey, dirCount, dirSubCount, replaceIfFind, source, dirFiles } from "./common.ts";

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

  // 有子目錄且圖檔總數大於0
  if (settings.length > 0 && settings.reduce((p, c) => p + c[1], 0) > 0) {
    // background-image: url('`,e.classesDict[t.unit.class].talentsImage,`');
    // w("bgImg",e.classesDict[t.unit.class].talentsImage) beta
    const searchString = `background-image: url('\`,e.classesDict[t.unit.class].talentsImage,\`');`;
    const action = `
    ((t)=>{
  let ts = t.split(".")[0];
  let s = 0;
  ${settings.filter(x => x[1] > 0).map(x => `if(ts==="${x[0]}") s=${x[1]};`).join("\n")}
  return s<=0 ? t : "${bgPath}/"+ts+"/"+parseInt(Date.now()/1000/10)%s+".webp";
})(e.classesDict[t.unit.class].talentsImage)
    `;
    const replaceString = `background-image: url('\`,${action},\`');`;
    // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
    // const replaceString = `background-image: url('${bgPath}/\`,\`${randomByDate(bgCount)}\`,\`.webp');`;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.地下城選擇上方橫幅) {
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.地下城選擇上方橫幅}`;
  const settings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.地下城選擇上方橫幅}`, cfg.模組.圖片副檔名);
  console.log("地下城選擇上方橫幅 Path", bgPath);
  console.log("地下城選擇上方橫幅 Settings", settings);

  // 有子目錄且圖檔總數大於0
  if (settings.length > 0 && settings.reduce((p, c) => p + c[1], 0) > 0) {
    // background-image: url('`,n.mapBgImage,`');
    // nt("data-journey-progress-bar",o.name),g(),Lo("bgImg",o.iconImage) beta
    // we("background-color","#1f1f1f"),g(),Lo("bgImg",i.iconImage) beta
    const searchString = `background-image: url('\`,n.mapBgImage,\`');`;
    const action = `
    ((t)=>{
  let ts = t.split(".")[0];
  let s = 0;
  ${settings.filter(x => x[1] > 0).map(x => `if(ts==="${x[0]}") s=${x[1]};`).join("\n")}
  return s<=0 ? t : "${bgPath}/"+ts+"/"+parseInt(Date.now()/1000/10)%s+".webp";
})(n.mapBgImage)
    `;
    const replaceString = `background-image: url('\`,${action},\`');`;
    // background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
    // const replaceString = `background-image: url('${bgPath}/\`,\`\${parseInt(Date.now()/1000/10)%${bgCount}}\`,\`.webp');`;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.戰鬥時背景) {
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.戰鬥時背景}`;
  const settings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.戰鬥時背景}`, cfg.模組.圖片副檔名);
  console.log("戰鬥時背景 Path", bgPath);
  console.log("戰鬥時背景 Settings", settings);

  // 有子目錄且圖檔總數大於0
  if (settings.length > 0 && settings.reduce((p, c) => p + c[1], 0) > 0) {
    // r.nativeElement.style.backgroundImage=`url(${x.mapBgImage})`
    // a.nativeElement.style.backgroundImage=`url(${m.mapBgImage})` beta
    const searchString = `r.nativeElement.style.backgroundImage=\`url(\${x.mapBgImage})\``;
    const action = `
    ((t)=>{
  let ts = t.split(".")[0];
  let s = 0;
  ${settings.filter(x => x[1] > 0).map(x => `if(ts==="${x[0]}") s=${x[1]};`).join("\n")}
  return s<=0 ? t : "${bgPath}/"+ts+"/"+Math.floor(Math.random()*s)+".webp";
})(x.mapBgImage)
    `;
    const replaceString = `r.nativeElement.style.backgroundImage=\`url(\${${action}})\``;
    // r.nativeElement.style.backgroundImage=`url(themes/bg/${Date.now()%835}.webp)`
    // const replaceString = `r.nativeElement.style.backgroundImage=\`url(${bgPath}/${random(bgCount)}.webp)\``;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.職業卡片) {
  const classPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.職業卡片}`;
  const settings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.職業卡片}`, cfg.模組.圖片副檔名);
  console.log("職業卡片 Path", classPath);
  console.log("職業卡片 Settings", settings);

  // 有子目錄且圖檔總數大於0
  if (settings.length > 0 && settings.reduce((p, c) => p + c[1], 0) > 0) {
    // s=n.avatars[r];
    // u=e.avatars[a]; beta
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
  let ts = t.split(".")[0];
  let s = 0;
  ${settings.filter(x => x[1] > 0).map(x => `if(ts==="${x[0]}") s=${x[1]};`).join("\n")}
  return s<=0 ? t : "${classPath}/"+ts+"/"+Math.floor(Math.random()*s)+".webp";
})(${classKind});
  `;
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.怪物卡片) {
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.怪物卡片}`;
  const settings = await dirSubCount(`${basePath}/${cfg.模組.佈景主題各子目錄.怪物卡片}`, cfg.模組.圖片副檔名);
  console.log("怪物卡片 Path", bgPath);
  console.log("怪物卡片 Settings", settings);

  // 有子目錄且圖檔總數大於0
  if (settings.length > 0 && settings.reduce((p, c) => p + c[1], 0) > 0) {
    for (const [name, count] of settings) {
      console.log(name, count);
      if (count > 0) {
        // ",image:"skeleton_warrior.jpg",ranks:["
        const searchString1 = `",image:"${name}.jpg",ranks:["`;
        // ",image:`themes/monster/skeleton_warrior/0.webp`,ranks:["
        const replaceString1 = `",image:\`${bgPath}/${name}/0.webp\`,ranks:["`;
        replaceIfFind(mainjs, searchString1, replaceString1);
        // this.unit.unit.image="skeleton_warrior.jpg"
        // this.unit.unit.image="skeleton_warrior.jpg" beta
        const searchString2 = `this.unit.unit.image="${name}.jpg"`;
        // this.unit.unit.image=`themes/monster/skeleton_warrior/${Math.floor(Math.random() * 73)}.webp`
        const replaceString2 = `this.unit.unit.image=\`${bgPath}/${name}/${random(count)}.webp\``;
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
    // ["bgImg","tavern_bg.png",1,"h-[140px]","bg-cover","bg-no-repeat","shrink-0","flex","flex-col","items-end","justify-end"],[1,"my-2","mx-4"] beta
    replaceIfFind(mainjs, `"background-image","url(tavern.jpg)"`, globalbg(bgPath, bgCount));
  }
}

if (cfg.替換.城鎮背景音樂) {
  const bgFiles = await dirFiles(`${basePath}/${cfg.模組.佈景主題各子目錄.城鎮背景音樂}`, cfg.模組.音樂副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.城鎮背景音樂}`;
  console.log("城鎮背景音樂 Path", bgPath);
  console.log("城鎮背景音樂 Files", bgFiles);

  if (bgFiles.length > 0) {
    // 城鎮背景音樂
    // ["audio/Impact Lento.mp3","audio/Long Road Ahead B.mp3","audio/Arcadia.mp3","audio/bg_town_female_voices.mp3","audio/bg_town_very_slow_enchanting.mp3","audio/bg_town_harp_piano.mp3","audio/bg_town_harp_xylophone_1.mp3","audio/bg_town_harp_xylophone_2.mp3"]
    const searchString = `["audio/Impact Lento.mp3","audio/Long Road Ahead B.mp3","audio/Arcadia.mp3","audio/bg_town_female_voices.mp3","audio/bg_town_very_slow_enchanting.mp3","audio/bg_town_harp_piano.mp3","audio/bg_town_harp_xylophone_1.mp3","audio/bg_town_harp_xylophone_2.mp3"]`
    const replaceString = JSON.stringify(bgFiles.map(x => `${bgPath}/${encodeURIComponent(x)}`));
    replaceIfFind(mainjs, searchString, replaceString);
  }
}

if (cfg.替換.戰鬥背景音樂) {
  const bgFiles = await dirFiles(`${basePath}/${cfg.模組.佈景主題各子目錄.戰鬥背景音樂}`, cfg.模組.音樂副檔名);
  const bgPath = `${baseWebPath}/${cfg.模組.佈景主題各子目錄.戰鬥背景音樂}`;
  console.log("戰鬥背景音樂 Path", bgPath);
  console.log("戰鬥背景音樂 Files", bgFiles);

  if (bgFiles.length > 0) {
    // 戰鬥背景音樂
    // ["audio/Full On.mp3","audio/bg_combat_slow_start.mp3","audio/bg_combat_violin_drums.mp3"]
    const searchString = `["audio/Full On.mp3","audio/bg_combat_slow_start.mp3","audio/bg_combat_violin_drums.mp3"]`
    const replaceString = JSON.stringify(bgFiles.map(x => `${bgPath}/${encodeURIComponent(x)}`));
    replaceIfFind(mainjs, searchString, replaceString);
  }
}
// tavern:new xv(["audio/tavern_ambience.mp3"]),
// battle:new xv((0,gM.shuffle)(["audio/Full On.mp3","audio/bg_combat_slow_start.mp3","audio/bg_combat_violin_drums.mp3"]))

if (mainjs.hasModify) {
  if (cfg.存檔前先備份) {
    await Deno.rename(cfg.替換檔路徑, `${cfg.替換檔路徑}.${Date.now()}.bak`);
  }
  if (cfg.備份修改後的檔案到佈景主題目錄) {
    await Deno.writeTextFile(join(basePath, basename(cfg.替換檔路徑)), mainjs.content);
  }
  await Deno.writeTextFile(cfg.替換檔路徑, mainjs.content);
}


await pressAnyKey();