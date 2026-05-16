export const config = {
    "模組": {
        "基礎路徑": "app/dist/electron/browser",
        "模組路徑": "themes",
        "背景動圖路徑": "bg",
        "動圖副檔名": ".webp",
        "職業模式": 2, // 1 不分天賦
        "職業路徑": "class",
        "怪物路徑": "monster",
        "職業子目錄": ["lycan", "priest", "rogue", "shaman", "warlock", "warrior", "wizard"],
        "圖副檔名": ".webp",
    },
    "替換": {
        "替換檔": "app/dist/electron/browser/main-S57572R2.js",
        "怪物": true,
        "職業": true,
        "技能背景面板": true,
        "戰鬥地圖": {
            "上方橫幅": false
        },
        "戰鬥背景": true,
        "鍊金術": true,
        "植物學家": true,
        "商店": true,
        // "珠寶商": true,
        "城鎮": false,
        "鐵匠": true,
        // "自動法師小屋": true,
        // "酒館": true,
        "總部": true
    }
};