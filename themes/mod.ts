// app/dist/electron/browser/index.html 檔案中加入
// <script rel="modulepreload" src="../../../../themes/config.js" type="module"></script>
// <script src="../../../../themes/mod.js" type="module"></script>

import { config as cfg, stat } from "./config.js";

const imageArray = [
	"https://images.unsplash.com/photo-1508185159346-bb1c5e93ebb4?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=55cf14db6ed80a0410e229368963e9d8&auto=format&fit=crop&w=1900&q=80",
	"https://images.unsplash.com/photo-1495480393121-409eb65c7fbe?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=05ea43dbe96aba57d48b792c93752068&auto=format&fit=crop&w=1351&q=80",
	"https://images.unsplash.com/photo-1501611724492-c09bebdba1ac?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ebdb0480ffed49bd075fd85c54dd3317&auto=format&fit=crop&w=1491&q=80",
	"https://images.unsplash.com/photo-1417106338293-88a3c25ea0be?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d1565ecb73a2b38784db60c3b68ab3b8&auto=format&fit=crop&w=1352&q=80",
	"https://images.unsplash.com/photo-1500520198921-6d4704f98092?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ac4bc726064d0be43ba92476ccae1a75&auto=format&fit=crop&w=1225&q=80",
	"https://images.unsplash.com/photo-1504966981333-1ac8809be1ca?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9a1325446cbf9b56f6ee549623a50696&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1437075130536-230e17c888b5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ff573beba18e5bf45eb0cccaa2c862b3&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1515002246390-7bf7e8f87b54?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=1eac0f70640261e09152340f13b79144&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1506057278219-795838d4c2dd?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f68d8d7b0223cd906ea8cac13421881d&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1488402410361-05152fa654d3?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5266aadc96d5b5b23996e7120d3190a8&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1475598322381-f1b499717dda?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cb49f991ce8dd947b45ccd1bd905ec8c&auto=format&fit=crop&w=1355&q=80",
	"https://images.unsplash.com/photo-1501949997128-2fdb9f6428f1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=951ee200e732c9b8c4ea0a7372ca9d27&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1494783367193-149034c05e8f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a98c0f9a6c602e964e6533de413d59ba&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1476547362848-ed2a9f99cd29?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5b4647c9e25267c25866936c916e4aa8&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1506017669510-0bcbe8003d70?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=9403f5d4ac23a5726bfc3c8308b31c01&auto=format&fit=crop&w=1350&q=80",
	"https://images.unsplash.com/photo-1489447068241-b3490214e879?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a85cb0d68de38ae2aa00d8a9663a320a&auto=format&fit=crop&w=1350&q=80"
];

// const image = document.querySelector("img");
// const button = document.querySelector("button");

// window.onload = () => generateRandomPicture(imageArray);

// button.addEventListener("click", () => generateRandomPicture(imageArray));

function generateRandomPicture():string{
	let randomNum = Math.floor(Math.random() * imageArray.length); 
	return imageArray[randomNum]?? "";
}

/**
 * 預加載圖片以解決變更圖片切換時畫面閃爍的問題
 */
function preloadImage(url: string): Promise<string> {
    return new Promise((resolve, _) => {
        const img = new Image();
        img.src = url;
        // console.log(img);
        img.onload = () => resolve(url);
        img.onerror = () => {
            console.log("preloadImage fail", url)
            resolve(url)
        };
    });
}

function ClockInit(parent: Element) {
    const elem = document.createElement("div");
    elem.className = "absolute bottom-4 left-4";
    elem.style.padding = "10px";
    // elem.style.paddingLeft = "20px";
    elem.style.fontSize = "20px"
    elem.style.backgroundColor = "rgb(0, 0, 0)";
    parent.appendChild(elem);
    setTimeout(Clock, 1, elem);
}
function Clock(elem: Element) {
    const now = new Date();
    elem.textContent = `${now.toLocaleTimeString()}`;
    setTimeout(Clock, 1000, elem);
}

type ChangeBgInitTemplConfig = {
    titleQuerySelector: string;
    bgQuerySelector: string;
    title: string;
    change: {
        subdirname: string;
        enable: boolean;
        count: number;
        change_sec: number;
    }
}
function ChangeBgInitTempl(config: ChangeBgInitTemplConfig) {
    let current = "";
    let preLoad = true;
    const timer_check = () => {
        if (current !== "") {
            // ant-modal-header cdk-drag-handle ng-tns-c2116847144-8 ng-star-inserted // ng-tns-c2116847144-8 隨機生成
            const elements = Array.from(document.querySelectorAll(config.titleQuerySelector));
            const match = elements.find(el => el.textContent.trim().startsWith(config.title));
            const bg = match?.parentElement?.querySelector(config.bgQuerySelector)
            // class="absolute inset-0 bg-cover bg-center bg-no-repeat"
            if (bg) {
                preLoad = true;
                // background-image: url(alchemist_bg.jpg);
                // console.log(bg);
                const elem = bg as HTMLElement;
                if (elem.style.backgroundImage !== current) {
                    elem.style.backgroundImage = current;
                    elem.style.backgroundRepeat = "repeat-x";
                    elem.style.backgroundSize = "contain";
                    elem.style.backgroundAttachment = "fixed";
                    elem.style.backgroundPosition = "center";
                }
            } else {
                preLoad = false;
            }
        }
        setTimeout(timer_check, 1000);
    }
    const timer_change = async (i: number) => {
        i++;
        if (i >= config.change.count) { i = 0 };
        // const url = `../../../../themes/${cfg.theme}/${config.change.subdirname}/${i}.webp`;
        // const url = generateRandomPicture();
        const url = `http://127.0.0.1:8000/${Date.now()}.webp`;
        if (preLoad) {
            await preloadImage(url);
        }
        current = `url(${await preloadImage(url)})`;
        setTimeout(timer_change, config.change.change_sec * 1000, i);
    }
    setTimeout(timer_check, 1000);
    const i = Math.floor(Math.random() * config.change.count);
    setTimeout(timer_change, 0, i);
}

function ChangeAlchemistBgInit() {
    ChangeBgInitTempl({
        // ant-modal-header cdk-drag-handle ng-tns-c2116847144-8 ng-star-inserted // ng-tns-c2116847144-8 隨機生成
        titleQuerySelector: 'div.ant-modal-header.cdk-drag-handle.ng-star-inserted',
        title: "炼金术士",
        // class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        //        absolute bg-center bg-cover bg-no-repeat top-0 left-0 w-full h-full z-0 rounded-b-md
        bgQuerySelector: "div.absolute.bg-center.bg-cover.bg-no-repeat.top-0.left-0.w-full.h-full.z-0.rounded-b-md",
        change: { ...cfg.shop_bg }
    });
}

// 商店
function ChangeShopBgInit() {
    ChangeBgInitTempl({
        // ant-modal-header cdk-drag-handle ng-tns-c2116847144-8 ng-star-inserted // ng-tns-c2116847144-8 隨機生成
        titleQuerySelector: 'div.ant-modal-header.cdk-drag-handle.ng-star-inserted',
        title: "商店",
        // class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        bgQuerySelector: "div.absolute.inset-0.bg-cover.bg-center.bg-no-repeat",
        change: { ...cfg.shop_bg }
    });
}

function ChangeBotanistBgInit() {
    ChangeBgInitTempl({
        //const em = document.querySelector("div.absolute.bg-center.bg-cover.bg-no-repeat.top-0.left-0.w-full.h-full.z-0.rounded-b-md");
        // "ng-star-inserted"
        // const elements = Array.from(document.querySelectorAll('div.ng-star-inserted'));
        // ant-modal-header cdk-drag-handle ng-tns-c2116847144-8 ng-star-inserted // ng-tns-c2116847144-8 隨機生成
        titleQuerySelector: 'div.ant-modal-header.cdk-drag-handle.ng-star-inserted',
        title: "植物学家",
        // class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        bgQuerySelector: "div.absolute.bg-center.bg-cover.bg-no-repeat.top-0.left-0.w-full.h-full.z-0.rounded-b-md",
        change: { ...cfg.botanist_bg }
    });
}

/**
 * 城鎮背景 init 
 * @param {HTMLElement} elem
 */
function ChangeTownBgInit(elem: HTMLElement) {
    const i = Math.floor(Math.random() * cfg.town_bg.count);
    // elem.style.backgroundColor = "rgb(255, 255, 255, 0.6)";
    // elem.style.backgroundBlendMode = "darken";
    elem.style.backgroundRepeat = "repeat-x";
    elem.style.backgroundSize = "contain";
    elem.style.backgroundAttachment = "fixed";
    elem.style.backgroundPosition = "center";
    setTimeout(ChangeTownBg, 0, elem, i);
}
/**
 * 城鎮背景
 * @param {HTMLElement} elem 
 * @param {number} i -1 代表隨機
 */
async function ChangeTownBg(elem: HTMLElement, i: number) {
    i++;
    if (i >= cfg.town_bg.count) { i = 0 };
    // elem.style.backgroundImage = `url(../../../../themes/${cfg.theme}/town_bg/${Math.floor(Math.random() * cfg.town_bg_count)}.webp)`;
    const url = await preloadImage(`../../../../themes/${cfg.theme}/${cfg.town_bg.subdirname}/${i}.webp`);
    elem.style.backgroundImage = `url(${await preloadImage(url)})`;
    setTimeout(ChangeTownBg, cfg.town_bg.change_sec * 1000, elem, i);
}

function WatchInit() {
    console.log("WatchInit checking");
    // const tuiRoot = document.getElementsByTagName("tui-root");
    // if (tuiRoot) {
    //     // console.log(tuiRoot[0]);
    //     const rootContent = tuiRoot[0].getElementsByClassName("t-root-content");
    //     if (rootContent) {
    //         // console.log(rootContent[0]);
    //         const version = rootContent[0].getElementsByClassName("absolute bottom-4 left-4");
    //         if (version) {
    //             // console.log(version[0]);
    //             // version[0].textContent = `${new Date()}`;
    //             // return;
    //         }
    //     }
    // }

    const appGame = document.getElementsByTagName("app-game");
    if (appGame && appGame.length > 0 && appGame[0] !== undefined) {
        // console.log(appGame[0]);
        if (cfg.clock.enable && !stat.clock_init) {
            ClockInit(appGame[0]);
            stat.clock_init = true;
        } else {
            stat.clock_init = true;
        }
        if (cfg.town_bg.enable && !stat.town_bg_init) {
            const townBg = appGame[0].getElementsByClassName("town bg-cover bg-center bg-no-repeat ng-tns-c4281862251-5");
            if (townBg && townBg.length > 0 && townBg[0] !== undefined) {
                // console.log(townBg[0]);
                ChangeTownBgInit(townBg[0] as HTMLElement);
                if (cfg.town_bg.icon_black_bg) {
                    const icons = townBg[0].getElementsByClassName("building-icon-container ng-tns-c4281862251-5 ng-star-inserted");
                    if (icons && icons.length > 0) {
                        console.log(icons[0]);
                        for (const elem of icons) {
                            (elem as HTMLElement).style.backgroundColor = "rgb(0, 0, 0)";
                        }
                    }
                }
                stat.town_bg_init = true;
                console.log("town_bg_init");
            }
        } else {
            stat.town_bg_init = true;
        }
        if (cfg.alchemist_bg.enable && !stat.alchemist_bg_init) {
            ChangeAlchemistBgInit();
            stat.alchemist_bg_init = true
        } else {
            stat.alchemist_bg_init = true;
        }
        if (cfg.botanist_bg.enable && !stat.botanist_bg_init) {
            ChangeBotanistBgInit();
            stat.botanist_bg_init = true
        } else {
            stat.botanist_bg_init = true;
        }
        if (cfg.shop_bg.enable && !stat.shop_bg_init) {
            ChangeShopBgInit();
            stat.shop_bg_init = true
        } else {
            stat.shop_bg_init = true;
        }
        if (cfg.blacksmith_talents_bg.enable && !stat.blacksmith_talents_bg_init) {
            ChangeBgInitTempl({
                // ant-modal-header cdk-drag-handle ng-tns-c2116847144-8 ng-star-inserted // ng-tns-c2116847144-8 隨機生成
                titleQuerySelector: 'div.ant-modal-header.cdk-drag-handle.ng-star-inserted',
                title: "铁匠",
                // rounded bg-center bg-cover w-full flex-grow flex flex-col gap-3 items-center justify-center ng-tns-c2312799977-7
                bgQuerySelector: "div.rounded.bg-center.bg-cover.w-full.flex-grow.flex.flex-col.gap-3.items-center.justify-center",
                change: { ...cfg.blacksmith_talents_bg }
            });
            stat.blacksmith_talents_bg_init = true
        } else {
            stat.blacksmith_talents_bg_init = true;
        }
    }
    for (const initState in stat) {
        if (!stat[initState]) {
            console.log("WatchInit retry");
            setTimeout(WatchInit, 5000);
            return;
        }
    }
    console.log("WatchInit finish");
}
setTimeout(WatchInit, 5000);