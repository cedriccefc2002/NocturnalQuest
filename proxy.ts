// import { parse } from "@std/jsonc";
// https://github.com/iplocate/free-proxy-list
import { logger } from "./logger.ts";

type proxy = {
    "proxy": string,
    "protocol": "socks4" | "http" | "socks5",
    "ip": string,
    "port": number,
    "https": boolean,
    "anonymity": string,
    "score": number,
    "geolocation": {
        "country": string,
        "city": string
    }
};
// Unavailable For Legal Reasons
const bypass: string[] = []
function IsPass(x: proxy) {
    if (bypass.indexOf(x.proxy) >= 0) return false;
    // Unavailable For Legal Reasons
    if(x.proxy.startsWith("http://23.106")) return false;
    if(x.proxy.startsWith("http://45.56")) return false;
    if(x.proxy.startsWith("http://84.17")) return false;
    if(x.proxy.startsWith("http://37.120")) return false;
    // http://37.120.233.34:9443
    // http://84.17.50.193:9443
    // http://45.56.228.8:443 
    // http://23.106.56.54:6157
    // http://23.106.56.43:19881
    if (x.protocol == "socks4" || x.protocol == "socks5") return false;
    return true;
}

let lastUpdate = 0;
let proxys: {
    "proxy": string,
    "protocol": "socks4" | "http" | "socks5",
    "ip": string,
    "port": number,
    "https": boolean,
    "anonymity": string,
    "score": number,
    "geolocation": {
        "country": string,
        "city": string
    }
}[] = [];
async function _loadConfig() {
    // 超過10分鐘重新刷新
    if ((Date.now() - lastUpdate) > 1000 * 60 * 10) {
        // https://github.com/proxifly/free-proxy-list
        // https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/http/data.json
        const response = await fetch("https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.json");
        // const proxys = parse(await Deno.readTextFile("proxy.jsonc")) as {
        proxys = (await response.json() as []).filter(IsPass);
        lastUpdate = Date.now();
        logger.log(`load pxoxy ${proxys.length}`);
    }
}

export async function getRandomPxoxy() {
    await _loadConfig();
    const random = Math.floor(Math.random() * proxys.length);
    const urlproxy = proxys[random];
    logger.log(`getRandomPxoxy pxoxy ${urlproxy.proxy}`);
    // const transport: "https" | "socks5" | "http" =
    //     proxys[random].protocol == "socks5" ? "socks5" : (
    //         proxys[random].protocol == "http" ? (
    //             proxys[random].https ? "https" : "http"
    //         ) : "http");
    return Deno.createHttpClient({
        proxy: {
            url: proxys[random].https ? `https://${urlproxy.ip}:${urlproxy.port}` : urlproxy.proxy,
            // transport,
        }
    });
} 