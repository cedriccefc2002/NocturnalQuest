// <script rel="modulepreload" src="../../../../themes/config.js" type="module"></script>
// <script src="../../../../themes/mod.js" type="module"></script>

import { config as cfg, stat } from "./config.js";
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

function ChangeAlchemistBgInit() {
    let current = "";
    const timer_check = () => {
        if (current !== "") {
            //const em = document.querySelector("div.absolute.bg-center.bg-cover.bg-no-repeat.top-0.left-0.w-full.h-full.z-0.rounded-b-md");
            // "ng-star-inserted"
            const elements = Array.from(document.querySelectorAll('div.ng-star-inserted'));
            const match = elements.find(el => el.textContent.trim().startsWith("炼金术士"));
            const bg = match?.parentElement?.querySelector("div.absolute.bg-center.bg-cover.bg-no-repeat.top-0.left-0.w-full.h-full.z-0.rounded-b-md")
            // absolute bg-center bg-cover bg-no-repeat top-0 left-0 w-full h-full z-0 rounded-b-md
            if (bg) {
                // background-image: url(alchemist_bg.jpg);
                console.log(bg);
                const elem = bg as HTMLElement;
                if (elem.style.backgroundImage !== current) {
                    elem.style.backgroundImage = current;
                    elem.style.backgroundRepeat = "repeat-x";
                    elem.style.backgroundSize = "contain";
                    elem.style.backgroundAttachment = "fixed";
                    elem.style.backgroundPosition = "center";
                }
            }
        }
        setTimeout(timer_check, 1000);
    }
    const timer_change = async (i: number) => {
        i++;
        if (i >= cfg.alchemist_bg.count) { i = 0 };
        const url = await preloadImage(`../../../../themes/${cfg.theme}/alchemist_bg/${i}.webp`);
        current = `url(${await preloadImage(url)})`;
        setTimeout(timer_change, cfg.alchemist_bg.change_sec * 1000, i);
    }
    setTimeout(timer_check, 1000);
    const i = Math.floor(Math.random() * cfg.alchemist_bg.count);
    setTimeout(timer_change, 0, i);
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
    const url = await preloadImage(`../../../../themes/${cfg.theme}/town_bg/${i}.webp`);
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
        }
        if (cfg.alchemist_bg.enable && !stat.alchemist_bg_init) {
            ChangeAlchemistBgInit();
            stat.alchemist_bg_init = true
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