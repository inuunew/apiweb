export default function handler(req, res) {
    // Memastikan API bisa diakses oleh dashboard UI
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "InuuTyzDev",
            "description": "Vercel Native API Dashboard — Optimized for Hobby Plan",
            "thumbnail": "https://c.termai.cc/i181/aGwK.png",
            "favicon": "https://c.termai.cc/i181/aGwK.png",
            "github": "https://github.com/inuunew/apiweb",
            "apiVersion": "2.1.0"
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
            "            "downloader": [
                {
                    "name": "TikTok Downloader",
                    "endpoint": "/api/download?type=tiktok",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link video TikTok" }
                    ]
                },
                {
                    "name": "Instagram Downloader",
                    "endpoint": "/api/download?type=ig",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link post/reels IG" }
                    ]
                },
                {
                    "name": "Facebook Downloader",
                    "endpoint": "/api/download?type=fb",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link video FB" }
                    ]
                },
                {
                    "name": "Mediafire Downloader",
                    "endpoint": "/api/download?type=mediafire",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link file Mediafire" }
                    ]
                }
            ]
        }
    });
}
