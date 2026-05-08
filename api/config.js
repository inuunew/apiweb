export default function handler(req, res) {
    // Memastikan API boleh diakses oleh frontend (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "InuuTyzDev",
            "description": "Vercel Native API Dashboard — Lightweight & Powerful",
            "thumbnail": "https://c.termai.cc/i181/aGwK.png",
            "favicon": "https://c.termai.cc/i181/aGwK.png",
            "github": "https://github.com/DanzzAraAra",
            "channelUrl": "#",
            "apiVersion": "2.0.0"
        },
        "tags": {
            "maker": [
                {
                    "name": "Brat Generator",
                    "endpoint": "/api/maker/brat",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Teks untuk dijadikan sticker brat" }
                    ]
                }
            ],
            "downloader": [
                {
                    "name": "TikTok Downloader",
                    "endpoint": "/api/downloader/tiktok",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link video TikTok" }
                    ]
                },
                {
                    "name": "Instagram Downloader",
                    "endpoint": "/api/downloader/instagram",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link Reels/Post/IGTV" }
                    ]
                },
                {
                    "name": "Facebook Downloader",
                    "endpoint": "/api/downloader/facebook",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link video Facebook" }
                    ]
                },
                {
                    "name": "Mediafire Downloader",
                    "endpoint": "/api/downloader/mediafire",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link file Mediafire" }
                    ]
                }
            ],
            "search": [
                {
                    "name": "Pinterest Search",
                    "endpoint": "/api/search/pinterest",
                    "method": "GET",
                    "params": [
                        { "name": "q", "required": true, "description": "Kata kunci gambar" }
                    ]
                },
                {
                    "name": "TikTok Search",
                    "endpoint": "/api/search/tiktok",
                    "method": "GET",
                    "params": [
                        { "name": "q", "required": true, "description": "Kata kunci video TikTok" }
                    ]
                },
                {
                    "name": "YouTube Search",
                    "endpoint": "/api/search/yts",
                    "method": "GET",
                    "params": [
                        { "name": "q", "required": true, "description": "Kata kunci video YouTube" }
                    ]
                }
            ],
            "tools": [
                {
                    "name": "Short URL (TinyURL)",
                    "endpoint": "/api/tools/shorturl",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link panjang yang ingin dipendekkan" },
                        { "name": "alias", "required": false, "description": "Custom nama link (opsional)" }
                    ]
                },
                {
                    "name": "SS Web (Screenshot)",
                    "endpoint": "/api/tools/ssweb",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link website" },
                        { "name": "type", "required": false, "description": "pilih: mobile / windows" }
                    ]
                }
            ]
        }
    });
}
