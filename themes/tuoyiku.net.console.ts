const demo = {
    "success": true,
    "items": [
        {
            "id": 360489,
            "type": "image",
            "category": "custom-i2v",
            "title": "自定义动态化",
            "categoryName": "自定义动态化",
            "job_type": "custom-i2v",
            "optimized_src": "https://u7lieg0gpifi.xyz/261x0qvjnnok/custom-i2v/optimized/261x0qvjnnok-custom-i2v-2026-05-23-18-03-40.webm",
            "original_src": "https://u7lieg0gpifi.xyz/261x0qvjnnok/custom-i2v/original/261x0qvjnnok-custom-i2v-2026-05-23-18-03-40.mp4",
            "aspect_ratio": "1:1",
            "created_at": "2026-05-23T10:09:15.000000Z",
            "user_name": "johnny",
            "user_id": 16539,
            "user_profile_image": "/assets/img/avatar/avatar1.webp",
            "user_is_vip": true,
            "user_vip_level": "gold",
            "user_vip_level_name": "黄金",
            "user_level": 43,
            "reaction_counts": {
                "like": 441,
                "love": 193,
                "laugh": 160,
                "sad": 75
            },
            "user_reactions": [
                "like"
            ],
            "donation_total": 0,
            "image_generation_details": null,
            "i2v_template_name": null
        }
    ],
    "hasMore": true,
    "currentPage": 1,
    "total": 50
};

const demo2 = {
    "success": true,
    "items": [
        {
            "id": 367594,
            "type": "image",
            "category": "image",
            "title": "\u56fe\u7247",
            "categoryName": "\u56fe\u7247",
            "job_type": "image",
            "optimized_src": "https:\/\/u7lieg0gpifi.xyz\/7e4h1ktkk6os\/image\/optimized\/7e4h1ktkk6os-image-05-26-2026-14-44-04-output.webp",
            "original_src": "https:\/\/u7lieg0gpifi.xyz\/7e4h1ktkk6os\/image\/original\/7e4h1ktkk6os-image-05-26-2026-14-44-04-output.png",
            "aspect_ratio": "9:16",
            "created_at": "2026-05-26T06:51:15.000000Z",
            "user_name": "moyin",
            "user_id": 213730,
            "user_profile_image": "\/assets\/img\/avatar\/avatar21.webp",
            "user_is_vip": false,
            "user_vip_level": "free",
            "user_vip_level_name": "\u514d\u8d39\u4f1a\u5458",
            "user_level": 9,
            "reaction_counts": [],
            "user_reactions": [],
            "donation_total": 0,
            "image_generation_details": {
                "category": "realistic-female",
                "image_size": "portrait",
                "description": ""
            },
            "i2v_template_name": null
        }
    ],
    "hasMore": true,
    "currentPage": 1,
    "total": 3000
}
// fetch("https://tuki88.xyz/dashboard/filter-by-category", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
//     "content-type": "application/json",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Linux\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-csrf-token": "K68rp2nshxsr5gb2wvPIcucP1uDWoLIus5aNRXJ2"
//   },
//   "referrer": "https://tuki88.xyz/dashboard",
//   "body": "{\"category\":\"image\",\"page\":1,\"per_page\":50,\"username\":null}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });
type category = "image" | "video" | "i2v" | "mdress" | "iface" | "vface" | "udress" | "cdress"
//              3000       622      5839    29         610       824       396         4
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function loadBycategory(category: category, page: number = 1): Promise<[hasMore: boolean, resps: string[], total: number]> {
    const resps: string[] = [];
    try {
        // 使用 chrome 複製為 fetch模式抓取 headers x-csrf-token 每次登入都不一樣
        // js 貼到 chrome 執行
        const d = await fetch("https://tuki88.xyz/dashboard/filter-by-category", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token": "K68rp2nshxsr5gb2wvPIcucP1uDWoLIus5aNRXJ2"
            },
            "referrer": "https://tuki88.xyz/dashboard",
            "body": "{\"category\":\"" + category + "\",\"page\":" + page + ",\"per_page\":50,\"username\":null}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });;
        const e = await d.json() as typeof demo2;
        // console.log(e);
        if (e.success) {
            for (const element of e.items) {
                resps.push(element.original_src);
            }
            return [e.hasMore, resps, e.total]
        }
        return [false, resps, 0]
    } catch (error) {
        console.error(error);
        return [false, resps, 0]
    }
}

// fetch("https://tuki88.xyz/dashboard/load-more", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
//     "content-type": "application/json",
//     "priority": "u=1, i",
//     "sec-ch-ua": "\"Google Chrome\";v=\"149\", \"Chromium\";v=\"149\", \"Not)A;Brand\";v=\"24\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Linux\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//     "x-csrf-token": "K68rp2nshxsr5gb2wvPIcucP1uDWoLIus5aNRXJ2"
//   },
//   "referrer": "https://tuki88.xyz/dashboard",
//   "body": "{\"page\":2,\"username\":null}",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "include"
// });

async function load(page: number = 1): Promise<[hasMore: boolean, resps: string[]]> {
    const resps: string[] = [];
    try {
        // 使用 chrome 複製為 fetch模式抓取 headers x-csrf-token 每次登入都不一樣
        // js 貼到 chrome 執行
        const d = await fetch("https://tuki88.xyz/dashboard/load-more", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"148\", \"Google Chrome\";v=\"148\", \"Not/A)Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-csrf-token": "K68rp2nshxsr5gb2wvPIcucP1uDWoLIus5aNRXJ2"
            },
            "referrer": "https://tuki88.xyz/dashboard",
            "body": "{\"page\":" + page + ",\"username\":null}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        const e = await d.json() as typeof demo;
        // console.log(e);
        if (e.success) {
            for (const element of e.items) {
                resps.push(element.original_src);
            }
            return [e.hasMore, resps]
        }
        return [false, resps]
    } catch (error) {
        console.error(error);
        return [false, resps]
    }
}

async function loadAll(page: number = 1) {
    const resps: string[] = [];
    let constinue = false;
    do {
        const [hasMore, r] = await load(page);
        resps.push(...r);
        if (hasMore) {
            page++;
            constinue = true;
            console.log("load", page);
            await sleep(5000);
        } else {
            constinue = false;
        }
    } while (constinue)
    return resps;
}

async function loadAllByCategory(category: category, page: number = 1) {
    const resps: string[] = [];
    let constinue = false;
    do {
        const [hasMore, r, total] = await loadBycategory(category, page);
        resps.push(...r);
        if (hasMore) {
            page++;
            constinue = true;
            console.log("load", page, total);
            await sleep(5000);
        } else {
            constinue = false;
        }
    } while (constinue)
    return resps;
}

// console.log(JSON.stringify(await loadAll()));

console.log(JSON.stringify(await loadAllByCategory("cdress")));

console.log(JSON.stringify(await loadAllByCategory("udress")));

console.log(JSON.stringify(await loadAllByCategory("vface")));

console.log(JSON.stringify(await loadAllByCategory("iface")));

console.log(JSON.stringify(await loadAllByCategory("mdress")));

console.log(JSON.stringify(await loadAllByCategory("i2v")));

console.log(JSON.stringify(await loadAllByCategory("video")));

console.log(JSON.stringify(await loadAllByCategory("image")));