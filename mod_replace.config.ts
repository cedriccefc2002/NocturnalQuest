export const config = {
    "模組": {
        "基礎路徑": "app/dist/electron/browser",
        "模組路徑": "themes",
        "背景動圖路徑": "bg",
        "動圖副檔名": ".webp",
        "職業模式": 1, // 1 不分天賦
        "職業路徑": "class",
        "職業子目錄": ["lycan", "priest", "rogue", "shaman", "warlock", "warrior", "wizard"],
        "圖副檔名": ".jpg",
    },
    "替換": {
        "替換檔": "app/dist/electron/browser/main-S57572R2.js",
        "職業": true,
        "技能背景面板": true,
        "戰鬥地圖": {
            "上方橫幅": true
        },
        "戰鬥背景": true
    }
};