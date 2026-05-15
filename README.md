# NocturnalQuest

修改檔案：

./resources/app/dist/electron/browser/main-S57572R2.js

依照順序重新命名

```sh
# 命名成暫時名稱
i=0; for f in *.webp; do mv -vn "$f" "temp.$((i++)).webp"; done
# 命名成正式名稱
i=0; for f in temp.*.webp; do mv -vn "$f" "themes.$((i++)).webp"; done
```

reindex.sh

```sh
#!/bin/bash
for d in */; do
  # 命名成暫時名稱
  i=0; for f in ./$d/*.{jpg,png,webp}; do mv -vn "$f" "./$d/temp.$((i++)).jpg"; done
  # 命名成正式名稱
  i=0; for f in ./$d/temp.*.jpg; do mv -vn "$f" "./$d/$((i++)).jpg"; done
done
```

## 圖庫

https://e-hentai.org/g/3673116/377b49e7b1/
https://e-hentai.org/g/3935085/341fa9175e/
https://e-hentai.org/s/2d15ebc1f6/3876902-4

[DyDy_cos] Hiyuki (Animated WEBP) [AI Generated]
[DyDy_cos] Belfast & Enterprise (Animated WEBP) [AI Generated]

## 職業技能背景面板 隨機播放面板(每十秒刷新)


### 職業名稱

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
s=`themes/class/${n.avatars[r].split(".")[0]}/${Math.floor(Math.random() * 20)}.jpg`;
```

- Warrior
- Wizard
- Priest
- Rogue
- Warlock
- Lycan
- Shaman

搜尋

```js
background-image: url('`,e.classesDict[t.unit.class].talentsImage,`');
```
替換成（37=0-36）
```js
background-image: url('themes/bg/themes.`,`${parseInt(Date.now()/1000/10)%418}`,`.webp');
```

每十秒刷新 talentsImage 目錄中 **職業名稱** 目錄 0.webp 1.webp ... 9.webp 圖片


## 戰鬥地圖 (每次刷新)

### title
```js
background-image: url('`,n.mapBgImage,`');
```

```js
background-image: url('themes/bg/themes.`,`${parseInt(Date.now()/1000/10)%418}`,`.webp');
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
r.nativeElement.style.backgroundImage=`url(themes/bg/themes.${Date.now()%418}.webp)`
```


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