// import { parse } from "@std/jsonc";
// https://github.com/iplocate/free-proxy-list
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
    if ((Date.now() - lastUpdate) > 1000 * 60 * 5) {
        const response = await fetch("https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/countries/TW/data.json");
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
        }[]).filter(x => x.protocol != "socks4" && !x.https);
        lastUpdate = Date.now();
        console.log(`load pxoxy`, proxys.length);
    }
}

export async function getRandomPxoxy() {
    await _loadConfig();
    const random = Math.floor(Math.random() * proxys.length);
    const url = proxys[random].proxy;
    console.log(`getRandomPxoxy pxoxy`, url);
    // const transport: "https" | "socks5" | "http" =
    //     proxys[random].protocol == "socks5" ? "socks5" : (
    //         proxys[random].protocol == "http" ? (
    //             proxys[random].https ? "https" : "http"
    //         ) : "http");
    return Deno.createHttpClient({
        proxy: {
            url: url,
            // transport,
        }
    });
} 