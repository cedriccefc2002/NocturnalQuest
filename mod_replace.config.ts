export type 佈景主題各子目錄 = {
    [key: string]: string,
    "怪物卡片": string,
    "職業卡片": string,
    "職業技能背景": string,
    "地下城選擇上方橫幅": string,
    "戰鬥時背景": string,
    "鍊金術背景": string,
    "植物學家背景": string,
    "商店背景": string,
    "珠寶商上方橫幅": string,
    "城鎮背景": string,
    "鐵匠天賦背景": string,
    "自動法師小屋上方橫幅": string,
    "酒館上方橫幅": string,
    "總部背景": string,
    "職業天賦對應語音": string
}
export const 地圖 = [
    "bastion_of_storms",
    "citadel",
    "forest_map_2",
    "dunes_map",
    "frostbound_spire",
    "mines_map",
];
export const 職業技能背景 = [
    "lycan_talents",
    "priest_talents",
    "rogue_talents",
    "shaman_talents",
    "warlock_talents",
    "warrior_talents",
    "wizard_talents",
];
export const 職業 = [
    "lycan",
    "lycan_dark",
    "lycan_wild",
    "priest",
    "priest_holy",
    "priest_shadow",
    "rogue",
    "rogue_poison",
    "rogue_shadow",
    "shaman",
    "shaman_genie",
    "shaman_lightning",
    "warlock",
    "warlock_demon",
    "warlock_shadow",
    "warrior",
    "warrior_blood",
    "warrior_protection",
    "wizard",
    "wizard_fire",
    "wizard_frost",
];
export const 怪物 = [
    "acolyte",
    "beast",
    "black_giant",
    "dark_druid",
    "elf_mutant",
    "ent_overlord",
    "fel_ent",
    "fel_sphinx",
    "fire_elemental",
    "frost_wraith",
    "frozen_abomination",
    "gargoyle",
    "ice_demon",
    "ice_golem",
    "iron_golem",
    "iron_trunk",
    "king_of_winter",
    "knight",
    "living_sands",
    "living_thunder",
    "lord_of_chaos",
    "mega_scorpion",
    "sand_titan",
    "skeleton_dragon",
    "skeleton_ogre",
    "skeleton_overlord",
    "skeleton_warlock",
    "skeleton_warrior",
    "thunder_dragon",
    "thunderous_beast",
];
const 佈景主題各子目錄: 佈景主題各子目錄 = {
    "怪物卡片": "monster",
    "職業卡片": "class",
    "職業技能背景": "talentsImage",
    "地下城選擇上方橫幅": "mapBgImageTitle",
    "戰鬥時背景": "mapBgImage",
    "鍊金術背景": "alchemist_bg",
    "植物學家背景": "botanist_bg",
    "商店背景": "shop_bg",
    "珠寶商上方橫幅": "jeweler_bg",
    "城鎮背景": "town_bg",
    "鐵匠天賦背景": "blacksmith_talents_bg",
    "自動法師小屋上方橫幅": "automagus_bg",
    "酒館上方橫幅": "tavern",
    "總部背景": "dunes_map",
    "城鎮背景音樂": "town_bg_audio",
    "戰鬥背景音樂": "combat_bg_audio",
    "職業天賦對應語音": "class_speech"
}
export type 文字語音 = [文字: string, 語音名稱: string, 原本名稱: string];
export type 職業語音 = {
    left: 文字語音,
    right: 文字語音,
    default: 文字語音
};
export type 職業天賦對應語音 = {
    [key: string]: 職業語音,
}
export const 職業天賦對應語音: 職業天賦對應語音 = {
    Wizard: {
        left: ["wizard_left", "wizard_left", "wizard_play_cool"],
        right: ["wizard_right", "wizard_right", "wizard_heat"],
        default: ["wizard_balance", "wizard_balance", "wizard_ah_balance"],
    },
    Warrior: {
        left: ["warrior_left", "warrior_left", "warrior_there_will_be_blood"],
        right: ["warrior_right", "warrior_right", "warrior_you_have_my_shield"],
        default: ["warrior_default", "warrior_default", "warrior_best_of_both"],
    },
    Priest: {
        left: ["priest_left", "priest_left", "priest_holy"],
        right: ["priest_right", "priest_right", "priest_shadow"],
        default: ["priest_default", "priest_default", "priest_balance"],
    },
    Rogue: {
        left: ["rogue_left", "rogue_left", "rogue_cloak_and_dagger"],
        right: ["rogue_right", "rogue_right", "rogue_death_from_within"],
        default: ["rogue_default", "rogue_default", "rogue_restraint"],
    },
    Warlock: {
        left: [
            "warlock_left",
            "warlock_left",
            "warlock_i_shall_become_the_darkness"
        ],
        right: [
            "warlock_right",
            "warlock_right",
            "warlock_i_will_embrace_the_demonic_flame",
        ],
        default: ["warlock_default", "warlock_default", "warlock_shadow_and_flame"],
    },
    Lycan: {
        left: ["lycan_left", "lycan_left", "lycan_we_are_one"],
        right: ["lycan_right", "lycan_right", "lycan_the_earth_will_prevail"],
        default: ["lycan_default", "lycan_default", "lycan_balance_above_all"],
    },
    Shaman: {
        left: ["shaman_left", "shaman_left", ""],
        right: ["shaman_right", "shaman_right", ""],
        default: ["shaman_default", "shaman_default", ""],
    }
};
export const config = {
    loadfromserver:
    {
        enable: true,
        url: "http://127.0.0.1:8000/image/rand/${parseInt(Date.now()/1000/10)}",
        mosterurl_base: "http://127.0.0.1:8000/image/monster",
    },
    "模組": {
        "基礎路徑": "./themes",
        "Web路徑": "../../../../themes",
        /**
         * default, aldult, pokemon
         * */
        "佈景主題": "aldult",
        /**
         * 1:不分天賦
         * 2:分天賦 
         */
        "職業模式": 2,
        "圖片副檔名": ".webp",
        "音樂副檔名": ".mp3",
        佈景主題各子目錄,
        職業天賦對應語音
    },
    "存檔前先備份": false,
    "備份修改後的檔案到佈景主題目錄": true,
    "替換檔路徑": "./app/dist/electron/browser/main-S57572R2.js",
    "html替換檔路徑": "./app/dist/electron/browser/index.html",
    "替換": {
        "怪物卡片": true,
        "職業卡片": true,
        "職業技能背景": true,
        "地下城選擇上方橫幅": true,
        "戰鬥時背景": true,
        // "鍊金術背景": true,
        // "植物學家背景": true,
        // "商店背景": true,
        "珠寶商上方橫幅": true,
        // "城鎮背景": true,
        // "鐵匠天賦背景": true,
        "自動法師小屋上方橫幅": true,
        "酒館上方橫幅": true,
        "總部背景": true,
        "城鎮背景音樂": true,
        "戰鬥背景音樂": true,
        "職業天賦對應語音": true,
    }
};