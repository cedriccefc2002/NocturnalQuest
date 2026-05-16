# NocturnalQuest


## 原生 linux 支援

```sh
mkdir ~/.local/share/Steam/steamapps/common/NocturnalQuest-linux/
wget https://github.com/electron/electron/releases/download/v34.5.8/electron-v34.5.8-linux-x64.zip
unzip -d v34 electron-v34.5.8-linux-x64.zip
mv v34/resources v34/resources_bak
ln -s ~/.local/share/Steam/steamapps/common/NocturnalQuest/resources v34/resources
~/.local/share/Steam/steamapps/common/NocturnalQuest-linux/v34/electron --no-sandbox
```

目前 原本遊戲使用版本為 34.2.0 但是測試下列版本都可以使用

- electron-v34.5.8-linux-x64.zip
- electron-v35.7.5-linux-x64.zip
- electron-v36.9.5-linux-x64.zip
- electron-v39.8.10-linux-x64.zip
- electron-v42.1.0-linux-x64.zip


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
- [mines_map][鐵礦]
    - skeleton_warrior 01/: 73 
      ```js
      ",image:"skeleton_warrior.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/skeleton_warrior/0.jpg`,ranks:["

      ```js
      this.unit.unit.image="skeleton_warrior.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/skeleton_warrior/${Math.floor(Math.random() * 73)}.jpg`
      ```
    - skeleton_warlock 02/: 21
      ```js
      ",image:"skeleton_warlock.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/skeleton_warlock/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="skeleton_warlock.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/skeleton_warlock/${Math.floor(Math.random() * 21)}.jpg`
      ```
    - skeleton_ogre [骷髅食人魔] 18/: 21
    ```js
      ",image:"skeleton_ogre.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/skeleton_ogre/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="skeleton_ogre.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/skeleton_ogre/${Math.floor(Math.random() * 21)}.jpg`
      ```
    - skeleton_dragon [骷髅龙] 
    - skeleton_overlord [骷髅霸主] 

- [forest_map_2][黑暗森林]
    - elf_mutant 08/: 83
      ```js
      ",image:"elf_mutant.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/elf_mutant/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="elf_mutant.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/elf_mutant/${Math.floor(Math.random() * 83)}.jpg`
      ```
    - dark_druid 05/: 21
      ```js
      ",image:"dark_druid.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/dark_druid/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="dark_druid.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/dark_druid/${Math.floor(Math.random() * 21)}.jpg`
      ```
    - fel_ent [邪能古樹] 19/: 50
      ```js
      ",image:"fel_ent.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/fel_ent/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="fel_ent.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/fel_ent/${Math.floor(Math.random() * 50)}.jpg`
      ```
    - iron_trunk [鐵樹幹] 
    - ent_overlord 

- 冰封尖塔
    - ice_golem 23/: 63 
      ```js
      ",image:"ice_golem.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/ice_golem/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="ice_golem.jpg"
      ```

      ```js
      this.unit.unit.image=`themes/monster/ice_golem/${Math.floor(Math.random() * 63)}.jpg`
      ```
    - frost_wraith 22/: 18 
      ```js
      ",image:"frost_wraith.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/frost_wraith/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="frost_wraith.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/frost_wraith/${Math.floor(Math.random() * 18)}.jpg`
      ```
    - king_of_winter 21/: 51
      ```js
      ",image:"king_of_winter.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/king_of_winter/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="king_of_winter.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/king_of_winter/${Math.floor(Math.random() * 51)}.jpg`
      ```
    - ice_demon
    - frozen_abomination

- 沙丘 
    - living_sands 20/: 62
      ```js
      ",image:"living_sands.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/living_sands/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="living_sands.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/living_sands/${Math.floor(Math.random() * 62)}.jpg`
      ```
    - fire_elemental 09/: 19
      ```js
      ",image:"fire_elemental.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/fire_elemental/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="fire_elemental.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/fire_elemental/${Math.floor(Math.random() * 19)}.jpg`
      ```
    - mega_scorpion 
    - fel_sphinx 
    - sand_titan 

- 風暴堡壘 
    - iron_golem 10/: 55
      ```js
      ",image:"iron_golem.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/iron_golem/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="iron_golem.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/iron_golem/${Math.floor(Math.random() * 55)}.jpg`
      ```
    - acolyte 14/: 50
      ```js
      ",image:"acolyte.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/acolyte/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="acolyte.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/acolyte/${Math.floor(Math.random() * 50)}.jpg`
      ```
    - living_thunder 
    - thunderous_beast 
    - thunder_dragon 

- 堡壘 
    - knight 13/: 50
      ```js
      ",image:"knight.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/knight/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="knight.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/knight/${Math.floor(Math.random() * 50)}.jpg`
      ```
    - gargoyle 16/: 50
      ```js
      ",image:"gargoyle.jpg",ranks:["
      ```
      ```js
      ",image:`themes/monster/gargoyle/0.jpg`,ranks:["
      ```js
      this.unit.unit.image="gargoyle.jpg"
      ```
      ```js
      this.unit.unit.image=`themes/monster/gargoyle/${Math.floor(Math.random() * 50)}.jpg`
      ```
    - beast 
    - black_giant  
    - lord_of_chaos 

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

