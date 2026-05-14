# NocturnalQuest

修改檔案：

./resources/app/dist/electron/browser/main-S57572R2.js

## 職業技能背景面板 隨機播放面板(每十秒刷新)

https://e-hentai.org/g/3673116/377b49e7b1/

### 職業名稱

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
替換成
```js
background-image: url('themes/talentsImage/`,`${t.unit.class}/${parseInt(Date.now()/1000/10)%10}`,`.webp');
```

每十秒刷新 talentsImage 目錄中 **職業名稱** 目錄 0.webp 1.webp ... 9.webp 圖片


https://e-hentai.org/g/3935085/341fa9175e/

[DyDy_cos] Hiyuki (Animated WEBP) [AI Generated]

## 戰鬥地圖 (每次刷新)

[DyDy_cos] Belfast & Enterprise (Animated WEBP) [AI Generated]
https://e-hentai.org/s/2d15ebc1f6/3876902-4

```js
`
background-image: url('`,n.mapBgImage,`');
`
```

```js
`
background-image: url('cefc/map/`,`${parseInt(Date.now()/1000/10)%10}`,`.webp');
`
```

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
r.nativeElement.style.backgroundImage=`url(cefc/mapBgImage/${x.name}/${Date.now()%2}.webp)`
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