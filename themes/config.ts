export const config = {
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
export const stat: {
    [key: string]: boolean,
    clock_init: boolean,
    town_bg_init: boolean,
    alchemist_bg_init: boolean,
    botanist_bg_init: boolean,
    shop_bg_init: boolean,
    blacksmith_talents_bg_init: boolean,
} = {
    clock_init: false,
    town_bg_init: false,
    alchemist_bg_init: false,
    botanist_bg_init: false,
    shop_bg_init: false,
    blacksmith_talents_bg_init: false,
}
