export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "InuuTyzDev",
            "description": "Vercel Native API Dashboard — Dynamic Route Architecture",
            "thumbnail": "https://c.termai.cc/i181/aGwK.png",
            "favicon": "https://c.termai.cc/i181/aGwK.png",
            "github": "https://github.com/inuunew/apiweb",
            "apiVersion": "3.0.0"
        },
        "tags": {
            "maker": [
                {
                    "name": "Brat Generator",
                    "endpoint": "/api/maker/brat",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Teks untuk stiker brat" }]
                },
                {
                    "name": "Ephoto360 Graffiti",
                    "endpoint": "/api/maker/ephoto360",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "URL template Ephoto360" },
                        { "name": "text1", "required": true, "description": "Teks pertama" },
                        { "name": "text2", "required": false, "description": "Teks kedua (opsional)" }
                    ]
                }
            ],
            "downloader": [
                {
                    "name": "TikTok Downloader",
                    "endpoint": "/api/download/tiktok",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link video TikTok" }]
                },
                {
                    "name": "Instagram Downloader",
                    "endpoint": "/api/download/ig",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link post/reels IG" }]
                },
                {
                    "name": "Facebook Downloader",
                    "endpoint": "/api/download/fb",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link video FB" }]
                },
                {
                    "name": "Mediafire Downloader",
                    "endpoint": "/api/download/mediafire",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link file Mediafire" }]
                }
            ],
            "search": [
                {
                    "name": "Pinterest Search",
                    "endpoint": "/api/search/pinterest",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Cari gambar" }]
                },
                {
                    "name": "TikTok Search",
                    "endpoint": "/api/search/tiktok",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Cari video" }]
                },
                {
                    "name": "YouTube Search",
                    "endpoint": "/api/search/yts",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Cari video YT" }]
                }
            ],
            "tools": [
                {
                    "name": "Subdomain Scanner",
                    "endpoint": "/api/tools/subdomain",
                    "method": "GET",
                    "params": [{ "name": "domain", "required": true, "description": "Target domain (contoh: siputzx.my.id)" }]
                },
                {
                    "name": "Short URL",
                    "endpoint": "/api/tools/shorturl",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link panjang" }]
                },
                {
                    "name": "SS Web",
                    "endpoint": "/api/tools/ssweb",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "URL website" },
                        { "name": "device", "required": false, "description": "mobile / windows" }
                    ]
                }
            ]
        }
    });
}
