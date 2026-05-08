export default function handler(req, res) {
    // Memastikan API bisa diakses oleh dashboard UI
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "InuuTyzDev",
            "description": "Vercel Native API Dashboard — Optimized for Hobby Plan",
            "thumbnail": "https://files.catbox.moe/la9esc.png",
            "favicon": "https://files.catbox.moe/tv1rv6.jpeg",
            "github": "https://github.com/inuunew/apiweb",
            "apiVersion": "1.1.0"
        },
        "tags": {
            "maker": [
                {
                    "name": "Brat Generator",
                    "endpoint": "/api/maker/brat",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Teks untuk stiker brat" }]
                }
            ],
            "downloader": [
                {
                    "name": "TikTok Downloader",
                    "endpoint": "/api/download",
                    "method": "GET",
                    "params": [
                        { "name": "type", "required": true, "description": "isi dengan: tiktok" },
                        { "name": "url", "required": true, "description": "Link video TikTok" }
                    ]
                },
                {
                    "name": "Instagram Downloader",
                    "endpoint": "/api/download",
                    "method": "GET",
                    "params": [
                        { "name": "type", "required": true, "description": "isi dengan: ig" },
                        { "name": "url", "required": true, "description": "Link post/reels IG" }
                    ]
                },
                {
                    "name": "Facebook Downloader",
                    "endpoint": "/api/download",
                    "method": "GET",
                    "params": [
                        { "name": "type", "required": true, "description": "isi dengan: fb" },
                        { "name": "url", "required": true, "description": "Link video FB" }
                    ]
                },
                {
                    "name": "Mediafire Downloader",
                    "endpoint": "/api/download",
                    "method": "GET",
                    "params": [
                        { "name": "type", "required": true, "description": "isi dengan: mediafire" },
                        { "name": "url", "required": true, "description": "Link file Mediafire" }
                    ]
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
                        { "name": "type", "required": false, "description": "mobile / windows" }
                    ]
                }
            ]
        }
    });
}
