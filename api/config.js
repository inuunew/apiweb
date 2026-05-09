export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "InuuTyzDev",
            "description": "Developer Modal AI — Masterpiece Vercel Native API Dashboard",
            "thumbnail": "https://c.termai.cc/i181/aGwK.png",
            "favicon": "https://c.termai.cc/i181/aGwK.png",
            "github": "https://github.com/inuunew/apiweb",
            "apiVersion": "3.8.0"
        },
        "tags": {
            "maker": [
                {
                    "name": "Brat Generator",
                    "endpoint": "/api/maker/brat",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Teks stiker" }]
                },
                {
                    "name": "E-KTP Maker",
                    "endpoint": "/api/maker/ektp",
                    "method": "GET",
                    "params": [
                        { "name": "provinsi", "required": true, "description": "Contoh: JAWA BARAT" },
                        { "name": "kota", "required": true, "description": "Contoh: BANDUNG" },
                        { "name": "nik", "required": true, "description": "NIK (16 Digit)" },
                        { "name": "nama", "required": true, "description": "Nama Lengkap" },
                        { "name": "ttl", "required": true, "description": "Tempat, Tgl Lahir" },
                        { "name": "jenis_kelamin", "required": true, "description": "Laki-laki / Perempuan" },
                        { "name": "alamat", "required": true, "description": "Nama Jalan & No Rumah" },
                        { "name": "rt/rw", "required": true, "description": "RT/RW (Contoh: 001/002)" },
                        { "name": "kel/desa", "required": true, "description": "Kelurahan / Desa" },
                        { "name": "kecamatan", "required": true, "description": "Kecamatan" },
                        { "name": "agama", "required": true, "description": "Agama" },
                        { "name": "status", "required": true, "description": "Contoh: Belum Kawin" },
                        { "name": "pekerjaan", "required": true, "description": "Pekerjaan" },
                        { "name": "pas_photo", "required": true, "description": "Link Foto Wajah (URL)" }
                    ]
                },
                {
                    "name": "FB Command Canvas",
                    "endpoint": "/api/maker/fbcommand",
                    "method": "GET",
                    "params": [
                        { "name": "name", "required": true, "description": "Nama Pengguna" },
                        { "name": "comment", "required": true, "description": "Isi Komentar" },
                        { "name": "ppurl", "required": true, "description": "Link Foto Profil (URL)" }
                    ]
                },
                {
                    "name": "Roasting Meme",
                    "endpoint": "/api/maker/roasting",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Teks Atas" },
                        { "name": "text2", "required": true, "description": "Teks Tengah" },
                        { "name": "text3", "required": true, "description": "Teks Bawah" }
                    ]
                },
                {
                    "name": "Ephoto360 Graffiti",
                    "endpoint": "/api/maker/ephoto360",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Teks utama" },
                        { "name": "text2", "required": false, "description": "Teks tambahan (opsional)" }
                    ]
                }
            ],
            "downloader": [
                {
                    "name": "Spotify Downloader",
                    "endpoint": "/api/download/spotify",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link lagu Spotify" }]
                },
                {
                    "name": "TikTok V2",
                    "endpoint": "/api/download/tiktok_v2",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link video TikTok" }]
                },
                {
                    "name": "Instagram",
                    "endpoint": "/api/download/ig",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link post/reels IG" }]
                },
                {
                    "name": "Twitter / X",
                    "endpoint": "/api/download/twitter",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link tweet/video X" }]
                },
                {
                    "name": "Google Drive",
                    "endpoint": "/api/download/gdrive",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link file GDrive" }]
                }
            ],
            "search": [
                {
                    "name": "Spotify Search",
                    "endpoint": "/api/search/spotify",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Judul lagu atau artis" }]
                },
                {
                    "name": "GSM Arena",
                    "endpoint": "/api/search/gsm",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Nama HP" }]
                },
                {
                    "name": "MLBB Hero Detail",
                    "endpoint": "/api/search/mlbb",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Nama Hero" }]
                }
            ],
            "ai": [
                {
                    "name": "DeepSeek R1",
                    "endpoint": "/api/ai/deepseekr1",
                    "method": "GET",
                    "params": [{ "name": "prompt", "required": true, "description": "Tanyakan apa saja" }]
                },
                {
                    "name": "Gemini AI",
                    "endpoint": "/api/ai/gemini",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Pesan untuk Gemini" }]
                }
            ],
            "stalker": [
                {
                    "name": "GitHub Stalk",
                    "endpoint": "/api/stalker/github",
                    "method": "GET",
                    "params": [{ "name": "user", "required": true, "description": "Username GitHub" }]
                },
                {
                    "name": "Twitter Stalk",
                    "endpoint": "/api/stalker/twitter",
                    "method": "GET",
                    "params": [{ "name": "user", "required": true, "description": "Username Twitter" }]
                }
            ],
            "tools": [
                {
                    "name": "SS Web (Direct Image)",
                    "endpoint": "/api/tools/ssweb",
                    "method": "GET",
                    "params": [
                        { "name": "url", "required": true, "description": "URL website (https://...)" },
                        { "name": "device", "required": false, "description": "Pilihan: mobile / desktop / tablet" }
                    ]
                },
                {
                    "name": "Get HTML Source",
                    "endpoint": "/api/tools/getcode",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "URL website target" }]
                },
                {
                    "name": "Subdomain Scanner",
                    "endpoint": "/api/tools/subdomain",
                    "method": "GET",
                    "params": [{ "name": "domain", "required": true, "description": "Domain (google.com)" }]
                },
                {
                    "name": "Kode Pos",
                    "endpoint": "/api/tools/kodepos",
                    "method": "GET",
                    "params": [{ "name": "query", "required": true, "description": "Nama daerah" }]
                }
            ],
            "info": [
                {
                    "name": "Gempa BMKG",
                    "endpoint": "/api/info/bmkg",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Info Cuaca",
                    "endpoint": "/api/info/cuaca",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Nama daerah" }]
                }
            ]
        }
    });
}
