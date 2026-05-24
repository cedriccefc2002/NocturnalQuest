export const config = {
    loadfromserver:
    {
        enable: true,
        url: () => `http://127.0.0.1:8000/image/rand/${Date.now()}`
    },
    theme: "aldult",
    clock: {
        enable: true,
    },
    town_bg: {
        enable: true,
        count: 201,
        change_sec: 6,
        icon_black_bg: false,
        subdirname: "town_bg",
    },
    alchemist_bg: {
        enable: true,
        count: 158,
        change_sec: 6,
        subdirname: "alchemist_bg",
    },
    botanist_bg: {
        enable: true,
        count: 142,
        change_sec: 6,
        subdirname: "botanist_bg",
    },
    shop_bg: {
        enable: true,
        count: 193,
        change_sec: 6,
        subdirname: "shop_bg",
    },
    blacksmith_talents_bg: {
        enable: true,
        count: 159,
        change_sec: 6,
        subdirname: "blacksmith_talents_bg",
    },
}
