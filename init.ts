import { pressAnyKey } from "./common.ts";
import { config as cfg, 職業, 怪物, 職業技能背景, 地圖 } from "./mod_replace.config.ts";

console.log("佈景主題", cfg.模組.佈景主題);
const basePath = `${cfg.模組.基礎路徑}/${cfg.模組.佈景主題}`;

for (const element in cfg.模組.佈景主題各子目錄) {
  await Deno.mkdir(`${basePath}/${cfg.模組.佈景主題各子目錄[element]}`, { recursive: true });
}
for (const element of 職業) {
  await Deno.mkdir(`${basePath}/${cfg.模組.佈景主題各子目錄.職業卡片}/${element}`, { recursive: true });
}
for (const element of 職業技能背景) {
  await Deno.mkdir(`${basePath}/${cfg.模組.佈景主題各子目錄.職業技能背景}/${element}`, { recursive: true });
}
for (const element of 怪物) {
  await Deno.mkdir(`${basePath}/${cfg.模組.佈景主題各子目錄.怪物卡片}/${element}`, { recursive: true });
}
for (const element of 地圖) {
  await Deno.mkdir(`${basePath}/${cfg.模組.佈景主題各子目錄.戰鬥時背景}/${element}`, { recursive: true });
  await Deno.mkdir(`${basePath}/${cfg.模組.佈景主題各子目錄.地下城選擇上方橫幅}/${element}`, { recursive: true });
}
await pressAnyKey();