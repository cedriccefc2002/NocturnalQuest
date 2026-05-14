# NocturnalQuest

## 職業技能背景面板 隨機播放面板(每十秒刷新)

https://e-hentai.org/g/3935085/341fa9175e/

[DyDy_cos] Hiyuki (Animated WEBP) [AI Generated]

./resources/app/dist/electron/browser/main-S57572R2.js

```js
`
background-image: url('`,e.classesDict[t.unit.class].talentsImage,`');
`
```
每十秒刷新 talentsImage 目錄中 0.webp 1.webp ... 9.webp 圖片
```js
`
background-image: url('cefc/talentsImage/`,`${parseInt(Date.now()/1000/10)%10}`,`.webp');
`
```


## 戰鬥地圖 (每十秒刷新)

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
`
r.nativeElement.style.backgroundImage=`url(${x.mapBgImage})`
`
```

```js
`
r.nativeElement.style.backgroundImage=`url(cefc/map/${parseInt(Date.now()/1000/10)%10}.webp)`
`
```


## 地圖 每次啟動刷新

[DyDy_cos] Belfast & Enterprise (Animated WEBP) [AI Generated]

```js
"background-image","url(map.png)"
```

淡化背景

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```

```js
"background-image","url(town_bg.jpg)"
```

```js
"background-image",`url(cefc/map/${Date.now()%10}.webp)`,"background-color","rgba(255, 255, 255, 0.6)","background-blend-mode","darken"
```
