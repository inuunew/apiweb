export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "KuroNeko",
            "creator": "InuuTyzDev",
            "description": "Developer Modal AI — Masterpiece Vercel Native API Dashboard",
            "thumbnail": "https://files.catbox.moe/la9esc.png",
            "favicon": "https://files.catbox.moe/tv1rv6.jpeg",
            "websiteUrl": "https://social-information.inuu.my.id", 
            "whatsappUrl": "https://wa.me/6283160556330",
            "apiVersion": "4.5.0"
        },
        "tags": {
            "ai": [
                {
                    "name": "DeepSeek R1",
                    "endpoint": "/api/ai/deepseekr1",
                    "method": "GET",
                    "params": [
                        { "name": "prompt", "required": true, "description": "Tanyakan apa saja ke DeepSeek R1" },
                        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" }
                    ]
                },
                {
                    "name": "Gemini AI",
                    "endpoint": "/api/ai/gemini",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Pesan untuk Gemini" },
                        { "name": "promptSystem", "required": false, "description": "Persona/Peran AI" }
                    ]
                },
                {
                    "name": "Gita (Spiritual AI)",
                    "endpoint": "/api/ai/gita",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Ask about Karma/Spirituality" }]
                },
                {
                    "name": "QWQ 32B",
                    "endpoint": "/api/ai/qwq32b",
                    "method": "GET",
                    "params": [{ "name": "prompt", "required": true, "description": "Chat dengan model QWQ" }]
                },
                {
                    "name": "GPT-OSS 120B",
                    "endpoint": "/api/ai/gptoss120b",
                    "method": "GET",
                    "params": [{ "name": "prompt", "required": true, "description": "Model GPT open-source 120B" }]
                }
            ],
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
                        { "name": "pas_photo", "required": true, "description": "Link Foto (URL)" }
                    ]
                },
                {
                    "name": "FB Command Canvas",
                    "endpoint": "/api/maker/fbcommand",
                    "method": "GET",
                    "params": [
                        { "name": "name", "required": true, "description": "Nama Profil" },
                        { "name": "comment", "required": true, "description": "Isi Komentar" },
                        { "name": "ppurl", "required": true, "description": "Link Foto Profil" }
                    ]
                },
                {
                    "name": "Fake Group Chat",
                    "endpoint": "/api/maker/fakegroup",
                    "method": "GET",
                    "params": [
                        { "name": "title", "required": true, "description": "Nama Grup" },
                        { "name": "number", "required": true, "description": "Jumlah Peserta" },
                        { "name": "time", "required": true, "description": "Waktu (13.00)" },
                        { "name": "avatarUrl", "required": true, "description": "Link Foto Grup" }
                    ]
                },
                {
                    "name": "Roasting Meme",
                    "endpoint": "/api/maker/roasting",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Teks 1" },
                        { "name": "text2", "required": true, "description": "Teks 2" },
                        { "name": "text3", "required": true, "description": "Teks 3" }
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
                    "name": "Facebook",
                    "endpoint": "/api/download/fb",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link video FB" }]
                },
                {
                    "name": "Google Drive",
                    "endpoint": "/api/download/gdrive",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link file GDrive" }]
                },
                {
                    "name": "Mediafire",
                    "endpoint": "/api/download/mediafire",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link file Mediafire" }]
                },
                {
                    "name": "CapCut",
                    "endpoint": "/api/download/capcut",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link template CapCut" }]
                },
                {
                    "name": "Douyin",
                    "endpoint": "/api/download/douyin",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link video Douyin" }]
                },
                {
                    "name": "SaveFrom",
                    "endpoint": "/api/download/savefrom",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link video/audio" }]
                },
                {
                    "name": "FastDL",
                    "endpoint": "/api/download/fastdl",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link FastDL" }]
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
                    "name": "MLBB Detail",
                    "endpoint": "/api/search/mlbb",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Nama Hero" }]
                },
                {
                    "name": "App Search",
                    "endpoint": "/api/search/appsearch",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Nama aplikasi/game" }]
                },
                {
                    "name": "Lazada",
                    "endpoint": "/api/search/lazada",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Nama produk" }]
                },
                {
                    "name": "Pinterest",
                    "endpoint": "/api/search/pinterest",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Cari gambar" }]
                },
                {
                    "name": "YouTube Search",
                    "endpoint": "/api/search/yts",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Cari video YT" }]
                }
            ],
            "stalker": [
                {
                    "name": "Pinterest Stalk",
                    "endpoint": "/api/stalker/pinterest",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Username Pinterest" }]
                },
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
                },
                {
                    "name": "YouTube Stalk",
                    "endpoint": "/api/stalker/youtube",
                    "method": "GET",
                    "params": [{ "name": "username", "required": true, "description": "Username / ID Channel" }]
                },
                {
                    "name": "Threads Stalk",
                    "endpoint": "/api/stalker/threads",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Username Threads" }]
                }
            ],
            "tools": [
                {
                    "name": "SS Web (Full Page)",
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
                    "params": [{ "name": "domain", "required": true, "description": "Domain utama (google.com)" }]
                },
                {
                    "name": "Kode Pos",
                    "endpoint": "/api/tools/kodepos",
                    "method": "GET",
                    "params": [{ "name": "query", "required": true, "description": "Nama daerah/desa" }]
                },
                {
                    "name": "Country Info",
                    "endpoint": "/api/tools/countryinfo",
                    "method": "GET",
                    "params": [{ "name": "country", "required": true, "description": "Nama negara" }]
                },
                {
                    "name": "Short URL",
                    "endpoint": "/api/tools/shorturl",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "Link panjang" }]
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
                    "params": [{ "name": "q", "required": true, "description": "Nama lokasi" }]
                },
                {
                    "name": "Jadwal TV",
                    "endpoint": "/api/info/jadwaltv",
                    "method": "GET",
                    "params": [{ "name": "channel", "required": true, "description": "Channel (gtv, rcti, dll)" }]
                }
            ]
        }
    });
}
