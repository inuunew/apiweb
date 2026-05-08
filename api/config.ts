import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "Danzz",
            "description": "Vercel Native API Dashboard",
            "thumbnail": "https://c.termai.cc/i181/aGwK.png",
            "favicon": "",
            "github": "https://github.com/DanzzAraAra",
            "channelUrl": "#"
        },
        "tags": {
            "maker": [
                {
                    "name": "Brat Generator",
                    "endpoint": "/api/maker/brat",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Teks untuk brat" }
                    ]
                }
            ]
        }
    });
}
