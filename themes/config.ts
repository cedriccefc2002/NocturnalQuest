export const config = {
    theme: "aldult",
    clock: {
        enable: true,
    },
    town_bg: {
        enable: false,
        count: 201,
        change_sec: 6,
        icon_black_bg: false,
    },
    alchemist_bg: {
        enable: true,
        count: 158,
        change_sec: 6,
    },
    botanist_bg: {
        enable: true,
        count: 142,
        change_sec: 6,
    },
    shop_bg: {
        enable: true,
        count: 193,
        change_sec: 6,
    },
}
export const stat: { [key: string]: boolean } = {
    clock_init: false,
    town_bg_init: false,
    alchemist_bg_init: false,
    botanist_bg_init: false,
    shop_bg_init: false
}
