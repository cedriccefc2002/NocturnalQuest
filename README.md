# NocturnalQuest

## 工具
而比較保險的作法是建立一個垃圾桶目錄，將這些重複的檔案移到這個目錄中，等確認無誤後再把它們刪除：

```sh
mkdir trash_can
fdupes -f ./themes/bg | xargs -I '{}' mv '{}' trash_can
```

修改檔案：

./resources/app/dist/electron/browser/main-S57572R2.js

依照順序重新命名

```sh
cd ./themes/bg
# 命名成暫時名稱
i=0; for f in *.webp; do mv -vn "$f" "temp.$((i++)).webp"; done
# 命名成正式名稱
i=0; for f in temp.*.webp; do mv -vn "$f" "$((i++)).webp"; done
```

reindex and resize

```sh
#!/bin/bash
for d in */; do
  echo $d
  for f in ./$d*.{jpg,png,webp}; do
    # echo resize $f
    convert "$f" -resize 395x564 "$f.resize.jpg"
  done
  i=0; for f in ./$d*.resize.jpg; do mv "$f" "./$d$((i++)).jpg"; done
done
```

## 圖庫

https://e-hentai.org/g/3673116/377b49e7b1/
https://e-hentai.org/g/3935085/341fa9175e/
https://e-hentai.org/s/2d15ebc1f6/3876902-4

[DyDy_cos] Hiyuki (Animated WEBP) [AI Generated]
[DyDy_cos] Belfast & Enterprise (Animated WEBP) [AI Generated]



## 職業

### 技能背景面板 隨機播放面板(每十秒刷新)

835

搜尋

```js
background-image: url('`,e.classesDict[t.unit.class].talentsImage,`');
```
替換成 
```js
background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
```

每十秒刷新 talentsImage 目錄中 **職業名稱** 目錄 0.webp 1.webp ... 9.webp 圖片


### 職業名稱

- Warrior
- Wizard
- Priest
- Rogue
- Warlock
- Lycan
- Shaman

### 頭像定義

```json
avatars:{right:"lycan_wild.jpg",left:"lycan_dark.jpg",default:"lycan.jpg"}
```
```js
updateHeroAvatarFromTalents(t){let e=this.heroes().get(t);if(!e)return null;let n=wr[e.class];if(!n)return null;let a=0,o=0;for(let l of Object.values(n.talents))for(let c of Object.values(l)){let m=c,b=e.effects.find(x=>x.name===m.def.name)?.parameters?.ranks||0;m.side==="left"?a+=b:o+=b}let r=a>o?"left":o>a?"right":"default",s=n.avatars[r];
```

每次點變更天賦時更新頭像

```js
updateHeroAvatarFromTalents(t) 
{
    let e = this.heroes().get(t); 
    if (!e) return null; 
    let n = wr[e.class]; // n =  職業資料
    if (!n) return null;
    let a = 0, o = 0;
    for (let l of Object.values(n.talents))
        for (let c of Object.values(l)) {
            let m = c,
                b = e.effects.find(x => x.name === m.def.name)?.parameters?.ranks || 0; m.side === "left" ? a += b : o += b
        }
    let r = a > o ? "left" : o > a ? "right" : "default", s = n.avatars[r]; // s = 選擇的頭像
    //...
}
```

```js
s=n.avatars[r];
```
```js
s=`themes/themes.${Math.floor(Math.random() * 418)}.webp`;
```

依照職業隨機

```js
s=`themes/class/${n.avatars[r].split(".")[0]}/${Math.floor(Math.random() * 40)}.jpg`;
```


```js
s=`themes/class/${n.avatars["default"].split(".")[0]}/${Math.floor(Math.random() * 30)}.jpg`;
```

## 戰鬥地圖 (每次刷新)

### title
```js
background-image: url('`,n.mapBgImage,`');
```

```js
background-image: url('themes/bg/`,`${parseInt(Date.now()/1000/10)%835}`,`.webp');
```

### bg

```js
r.nativeElement.style.backgroundImage=`url(${x.mapBgImage})`
```

x.name =
- BastionOfStorms
- DarkCitadel
- DarkForest
- Dunes
- FrostboundSpire
- IronMines

```js
r.nativeElement.style.backgroundImage=`url(themes/bg/${Date.now()%835}.webp)`
```

## 怪物

- [mines_map][鐵礦] -> [百炼成神]
    - skeleton_warrior [骷髅战士] 宁雨蝶 https://e-hentai.org/s/b804178d88/3928757-36
    - skeleton_warlock [骷髅术士] 朱绾 https://e-hentai.org/s/164d8a0d87/3928745-26
    - skeleton_ogre [骷髅食人魔] 溪幼琴 https://e-hentai.org/s/8af9f14b24/3894419-51
    - skeleton_dragon [骷髅龙] 天穹 https://e-hentai.org/s/ae35197ac1/3837294-24
    - skeleton_overlord [骷髅霸主] 青萝 https://e-hentai.org/s/901e3f3c5d/3837285-21

- [forest_map_2][黑暗森林] -> [神墓]
    - elf_mutant [精灵变种人] 梦可儿 https://e-hentai.org/s/76a0d5d60c/3894409-1
    - dark_druid [黑暗德鲁伊] 楚月 https://e-hentai.org/s/f0326142f1/3916242-13
    - fel_ent [邪能古樹] 南宫仙儿 https://e-hentai.org/s/9de8eaee05/3884347-26
    - iron_trunk [鐵樹幹] 楚钰-尸王雨馨 https://e-hentai.org/s/2da6ab6c23/3797387-16
    - ent_overlord 楚钰 https://e-hentai.org/s/a82ff6f1ea/3884356-20

### 冰封尖塔
   
#### ice_golem 23

圖鑑

```js
",image:"ice_golem.jpg",ranks:["
```
```js
",image:`themes/monster/ice_golem/0.jpg`,ranks:["

戰鬥畫面

```js
this.unit.unit.image="ice_golem.jpg"
```

```js
this.unit.unit.image=`themes/monster/ice_golem/${Math.floor(Math.random() * 63)}.jpg`
```


```

    - frost_wraith 22
    - king_of_winter 董白 https://e-hentai.org/s/d5efbe8c86/2835907-22
    - ice_demon 孙尚香 https://e-hentai.org/s/9df610a65f/2219208-7
    - frozen_abomination 吕玲绮 https://e-hentai.org/s/b4748264a7/2157089-21

- 沙丘 -> 绝世唐门
    - living_sands 唐舞桐 https://e-hentai.org/s/d523913f9e/3928935-41
    - fire_elemental 唐雅 https://e-hentai.org/s/e960df44d4/3928809-4
    - mega_scorpion 梦红 https://e-hentai.org/s/d3f1601277/3928806-2
    - fel_sphinx 江楠楠 https://e-hentai.org/s/b2727ca932/3928804-19
    - sand_titan 南秋秋 https://e-hentai.org/s/4edfce6983/3916101-1

- 風暴堡壘 -> 绝世唐门
    - iron_golem 小医仙 https://e-hentai.org/s/9d2c55d8a9/3928937-42
    - acolyte 青仙子 https://e-hentai.org/s/7416c2abaf/3928931-33
    - living_thunder 萧潇 https://e-hentai.org/s/fee9781696/3928938-1
    - thunderous_beast 青鳞 https://e-hentai.org/s/7b124fec06/3928823-21
    - thunder_dragon 萧薰儿 https://e-hentai.org/s/cc5df3a258/3928746-44

- 堡壘 -> 斗罗大陆
    - knight 千仞雪 https://e-hentai.org/s/aa3197cd3c/3928807-10
    - gargoyle 小舞 https://e-hentai.org/s/f190086fd1/3894399-48
    - beast 胡列娜 https://e-hentai.org/s/8cd94c7e5a/3894693-18
    - black_giant 水月儿 https://e-hentai.org/s/6ccede1eed/3863723-66
    - lord_of_chaos 独孤雁 https://e-hentai.org/s/011da97485/3865237-14




## 地圖 每次啟動刷新

[DyDy_cos] Belfast & Enterprise (Animated WEBP) [AI Generated]

### 地圖
```js
"background-image","url(map.png)"
```

淡化背景

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 總部

```
"background","linear-gradient(to top, #000000c7, #00000052), url(dunes_map.jpg)"
```

```
"background",`linear-gradient(to top, #000000c7, #00000052), url(cefc/map/${Date.now()%10}.webp)`
```

### 酒館

```js
"background-image","url(tavern.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```




### 自動法師小屋

```js
"background-image","url(automagus_bg.png)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 鐵匠

```js
"background-image","url(blacksmith_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"

天賦背景

```js
"background-image",'url("blacksmith_talents_bg.jpg")'
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 城鎮

```js
"background-image","url(town_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 珠寶商

```js
"background-image","url(jeweler_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 商店

```js
"background-image","url(shop_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 植物學家

```js
"background-image","url(botanist_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

### 鍊金術


```js
"background-image","url(alchemist_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

