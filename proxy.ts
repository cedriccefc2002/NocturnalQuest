// import { parse } from "@std/jsonc";
// https://github.com/iplocate/free-proxy-list
import { logger } from "./logger.ts";
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
    if ((Date.now() - lastUpdate) > 1000 * 60 * 10) {
        // https://github.com/proxifly/free-proxy-list
        // https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/http/data.json
        const response = await fetch("https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.json");
        // const proxys = parse(await Deno.readTextFile("proxy.jsonc")) as {
        proxys = (await response.json() as {
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
        }[]).filter(x => x.protocol != "socks4" && x.protocol != "socks5");
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