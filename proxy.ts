// import { parse } from "@std/jsonc";
// https://github.com/iplocate/free-proxy-list
const response = await fetch("https://raw.githubusercontent.com/proxifly/free-proxy-list/refs/heads/main/proxies/countries/TW/data.json");
// const proxys = parse(await Deno.readTextFile("proxy.jsonc")) as {
const proxys = (await response.json() as {
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
console.log(`load pxoxy`, proxys.length);
export function getRandomPxoxy() {
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