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
    },
    alchemist_bg: {
        enable: true,
        count: 157,
        change_sec: 6,
    }
}
export const stat: { [key: string]: boolean } = {
    clock_init: false,
    town_bg_init: false,
    alchemist_bg_init: false
}
