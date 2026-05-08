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
                    "endpoint": "/api/downloader/ig",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link post/reels IG" }
                    ]
                },
                {
                    "name": "Facebook Downloader",
                    "endpoint": "/api/downloader/fb",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "Link video FB" }
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
