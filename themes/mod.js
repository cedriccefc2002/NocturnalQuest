import { config as cfg } from "./config.js";

/**
 * <script rel="modulepreload" src="../../../../themes/config.js" type="module"></script>
 * <script src="../../../../themes/mod.js" type="module"></script>
*/
function ClockInit(parent) {
    const elem = document.createElement("div");
    elem.className = "absolute bottom-4 left-4";
    elem.style.padding = "10px";
    // elem.style.paddingLeft = "20px";
    elem.style.fontSize = "20px"
    elem.style.backgroundColor = "rgb(0, 0, 0)";
    parent.appendChild(elem);
    setTimeout(Clock, 1, elem);
}
function Clock(elem) {
    const now = new Date();
    elem.textContent = `${now.toLocaleTimeString()}`;
    setTimeout(Clock, 1000, elem);
}

/**
 * 城鎮背景 init 
 * @param {HTMLElement} elem
 */
function ChangeTownBgInit(elem) {
    const i = Math.floor(Math.random() * cfg.town_bg_count);
    elem.style.backgroundColor = "rgb(255, 255, 255, 0.6)";
    elem.style.backgroundBlendMode = "darken";
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
function ChangeTownBg(elem, i) {
    i++;
    if (i >= cfg.town_bg_count) { i = 0 };
    // elem.style.backgroundImage = `url(../../../../themes/${cfg.theme}/town_bg/${Math.floor(Math.random() * cfg.town_bg_count)}.webp)`;
    elem.style.backgroundImage = `url(../../../../themes/${cfg.theme}/town_bg/${i}.webp)`;
    setTimeout(ChangeTownBg, cfg.town_bg_change_sec * 1000, elem, i);
}

function WatchInit() {
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
    if (appGame && appGame.length > 0) {
        console.log(appGame[0]);
        ClockInit(appGame[0]);
        const townBg = appGame[0].getElementsByClassName("town bg-cover bg-center bg-no-repeat ng-tns-c4281862251-5");
        if (townBg && townBg.length > 0) {
            // console.log(townBg[0]);
            ChangeTownBgInit(townBg[0]);
            const icons = townBg[0].getElementsByClassName("building-icon-container ng-tns-c4281862251-5 ng-star-inserted");
            if (icons && icons.length > 0) {
                console.log(icons[0]);
                for (const elem of icons) {
                    elem.style.backgroundColor = "rgb(0, 0, 0)";
                }
            }
            return;
        }

    }
    setTimeout(WatchInit, 1000);
}
setTimeout(WatchInit, 1000);