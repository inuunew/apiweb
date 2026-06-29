export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "InuuTyzDev",
            "creator": "InuuTyzDev", 
            "visitors": "1352"
        },
        "tags": {
            "ai": [
                {
                    "name": "DeepSeek R1",
                    "endpoint": "/api/ai/deepseekr1",
                    "method": "GET",
                    "params": [
                        { "name": "prompt", "required": true, "description": "Tanyakan apa saja ke DeepSeek R1" },
                        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" },
                        { "name": "temperature", "required": false, "description": "Kreativitas (Contoh: 0.7)" }
                    ]
                },
                {
                    "name": "Gemini AI (Vision)",
                    "endpoint": "/api/ai/gemini",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Pesan untuk Gemini" },
                        { "name": "cookie", "required": false, "description": "Isi dengan: smart" },
                        { "name": "promptSystem", "required": false, "description": "Persona/Peran AI" },
                        { "name": "imageUrl", "required": false, "description": "URL Gambar / Upload Galeri" }
                    ]
                },
                {
                    "name": "Gita (Spiritual AI)",
                    "endpoint": "/api/ai/gita",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Ask about Karma/Spirituality" }]
                },
                {
                    "name": "QwQ 32B",
                    "endpoint": "/api/ai/qwq32b",
                    "method": "GET",
                    "params": [
                        { "name": "prompt", "required": true, "description": "Chat dengan model QWQ" },
                        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" },
                        { "name": "temperature", "required": false, "description": "Kreativitas (Contoh: 0.7)" }
                    ]
                },
                {
                    "name": "Phi-2",
                    "endpoint": "/api/ai/phi2",
                    "method": "GET",
                    "params": [
                        { "name": "prompt", "required": true, "description": "Pertanyaan untuk AI" },
                        { "name": "system", "required": false, "description": "Instruksi Sistem (Opsional)" },
                        { "name": "temperature", "required": false, "description": "Kreativitas (Contoh: 0.7)" }
                    ]
                },
                {
                    "name": "GLM 4.7 Flash",
                    "endpoint": "/api/ai/glm47flash",
                    "method": "GET",
                    "params": [
                        { "name": "prompt", "required": true, "description": "Pertanyaan untuk AI" },
                        { "name": "system", "required": false, "description": "Instruksi Sistem (Opsional)" },
                        { "name": "temperature", "required": false, "description": "Kreativitas (Contoh: 0.7)" }
                    ]
                },
                {
                    "name": "GPT-OSS 120B",
                    "endpoint": "/api/ai/gptoss120b",
                    "method": "GET",
                    "params": [
                        { "name": "prompt", "required": true, "description": "Model GPT open-source 120B" },
                        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" },
                        { "name": "temperature", "required": false, "description": "Kreativitas (Contoh: 0.7)" }
                    ]
                }, 
                {
    "name": "Gemini 3.1 Flash Lite",
    "endpoint": "/api/ai/gemini31",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Pertanyaan untuk Gemini 3.1" }
    ]
},
{
    "name": "DeepSeek V4 Flash (Thinking)",
    "endpoint": "/api/ai/deepseekv4",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Pertanyaan dengan mode deep thinking" }
    ]
},
{
    "name": "GPT-5 Nano (gpt-4o)",
    "endpoint": "/api/ai/gpt5nano",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Pertanyaan untuk GPT-5 Nano" },
        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" }
    ]
},
{
    "name": "Claude Haiku 4.5",
    "endpoint": "/api/ai/claudehaiku",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Pertanyaan untuk Claude Haiku" },
        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" }
    ]
},
{
    "name": "Qwen-3 (80B)",
    "endpoint": "/api/ai/qwen3",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Pertanyaan untuk Qwen-3" },
        { "name": "system", "required": false, "description": "Instruksi sistem (opsional)" }
    ]
},
{
    "name": "Olabiba AI",
    "endpoint": "/api/ai/olabiba",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Pertanyaan untuk Olabiba AI" }
    ]
}, 
{
    "name": "Unlimited AI",
    "endpoint": "/api/ai/unlimitedai",
    "method": "GET",
    "params": [{ "name": "prompt", "required": true, "description": "Pertanyaan untuk Unlimited AI" }]
},
{
    "name": "Feelbetter AI",
    "endpoint": "/api/ai/feelbetter",
    "method": "GET",
    "params": [
        { "name": "prompt", "required": true, "description": "Curhatan atau pertanyaan" },
        { "name": "system", "required": false, "description": "Custom system prompt (opsional)" }
    ]
},
{
    "name": "Chat GPT Online",
    "endpoint": "/api/ai/gptonline",
    "method": "GET",
    "params": [{ "name": "prompt", "required": true, "description": "Pertanyaan untuk GPT Online" }]
}
            ],
            "ai-image": [
        {
            "name": "To Realistic",
            "endpoint": "/api/ai-image/torealistic",
            "method": "GET",
            "params": [{ "name": "url", "required": true, "description": "URL gambar yang ingin diubah" }]
        },
        {
            "name": "To Cinematic",
            "endpoint": "/api/ai-image/tocinematic",
            "method": "GET",
            "params": [{ "name": "url", "required": true, "description": "URL gambar yang ingin diubah" }]
        },
        {
            "name": "To Figure",
            "endpoint": "/api/ai-image/tofigure",
            "method": "GET",
            "params": [{ "name": "url", "required": true, "description": "URL gambar yang ingin diubah" }]
        },
        {
            "name": "To Ghibli",
            "endpoint": "/api/ai-image/toghibli",
            "method": "GET",
            "params": [{ "name": "url", "required": true, "description": "URL gambar yang ingin diubah" }]
        },
        {
            "name": "To Anime",
            "endpoint": "/api/ai-image/toanime",
            "method": "GET",
            "params": [{ "name": "url", "required": true, "description": "URL gambar yang ingin diubah" }]
        },
        {
            "name": "AI Labs Generator",
            "endpoint": "/api/ai-image/ailabs",
            "method": "GET",
            "params": [{ "name": "prompt", "required": true, "description": "Deskripsi gambar" }]
        },
        {
            "name": "DeepAI Generator",
            "endpoint": "/api/ai-image/deepai",
            "method": "GET",
            "params": [{ "name": "prompt", "required": true, "description": "Deskripsi gambar" }]
        }, 
        {
    "name": "DeepAI Text to Image",
    "endpoint": "/api/ai-image/deepaitxt2img",
    "method": "GET",
    "params": [{ "name": "prompt", "required": true, "description": "Deskripsi gambar yang ingin dibuat" }]
}
    ],
            "maker": [
                {
                    "name": "E-KTP Maker",
                    "endpoint": "/api/maker/ektp",
                    "method": "POST",
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
                        // 👇 KUNCI PERUBAHAN: pas_photo diubah jadi image 👇
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
    "name": "Spotify Downloader V2",
    "endpoint": "/api/download/spotify-dl",
    "method": "GET",
    "params": [{ "name": "url", "required": true, "description": "URL track Spotify" }]
}, 
                {
            "name": "SnackVideo Downloader",
            "endpoint": "/api/download/snackvideo",
            "method": "GET",
            "params": [{ "name": "url", "required": true, "description": "Link video SnackVideo (No Watermark)" }]
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
                }, 
                {
    "name": "Instagram V2",
    "endpoint": "/api/download/ig_v2",
    "method": "GET",
    "params": [{ "name": "url", "required": true, "description": "Link post/reels Instagram" }]
},
{
    "name": "TikTok V3",
    "endpoint": "/api/download/tiktok_v3",
    "method": "GET",
    "params": [{ "name": "url", "required": true, "description": "Link video TikTok (dengan stats)" }]
},
{
    "name": "YouTube V2",
    "endpoint": "/api/download/youtube_v2",
    "method": "GET",
    "params": [{ "name": "url", "required": true, "description": "Link video YouTube" }]
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
        "name": "Lyrics Search",
        "endpoint": "/api/search/lyrics",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Judul lagu" }]
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
        "name": "Wikipedia Search",
        "endpoint": "/api/search/wikipedia",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Kata kunci informasi" }]
    },
    {
        "name": "English Dictionary",
        "endpoint": "/api/search/dictionary",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Kata dalam bahasa Inggris" }]
    },
    {
        "name": "Country Info",
        "endpoint": "/api/search/country",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Nama negara" }]
    },
    {
        "name": "NPM Search",
        "endpoint": "/api/search/npm",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Nama package NPM" }]
    },
    {
        "name": "University Search",
        "endpoint": "/api/search/univ",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Nama universitas" }]
    },
    {
        "name": "NIK Checker",
        "endpoint": "/api/search/nik",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "16 digit NIK KTP" }]
    },
    {
    "name": "YouTube Search",
    "endpoint": "/api/search/ytsearch",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Judul lagu / video YouTube" }]
}, 
{
    "name": "Pinterest Search",
    "endpoint": "/api/search/pinterest",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Keyword pencarian Pinterest" }]
}, 
    {
        "name": "Google Books",
        "endpoint": "/api/search/books",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Judul buku" }]
    }, 
    {
    "name": "Spotify Search",
    "endpoint": "/api/search/spotify-search",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Keyword lagu, artis, atau album" }]
},
{
    "name": "Spotify Track Detail",
    "endpoint": "/api/search/spotify-track",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Track ID Spotify" }]
},
{
    "name": "Spotify Artist Detail",
    "endpoint": "/api/search/spotify-artist",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Artist ID Spotify" }]
},
{
    "name": "Spotify Album Detail",
    "endpoint": "/api/search/spotify-album",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Album ID Spotify" }]
},
{
    "name": "Spotify Playlist Detail",
    "endpoint": "/api/search/spotify-playlist",
    "method": "GET",
    "params": [{ "name": "q", "required": true, "description": "Playlist ID Spotify" }]
}
], 
            "stalker": [
    {
        "name": "GitHub Stalk",
        "endpoint": "/api/stalker/github",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username GitHub" }]
    },
    {
        "name": "NPM Stalk",
        "endpoint": "/api/stalker/npm",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Nama package NPM" }]
    },
    {
        "name": "Reddit Stalk",
        "endpoint": "/api/stalker/reddit",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username Reddit" }]
    },
    {
        "name": "Roblox Stalk",
        "endpoint": "/api/stalker/roblox",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username Roblox" }]
    },
    {
        "name": "Steam Stalk",
        "endpoint": "/api/stalker/steam",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "SteamID atau Vanity URL" }]
    },
    {
        "name": "TikTok Stalk",
        "endpoint": "/api/stalker/tiktok",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username TikTok (tanpa @)" }]
    },
    {
        "name": "Threads Stalk",
        "endpoint": "/api/stalker/threads",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username Threads (tanpa @)" }]
    },
    {
        "name": "YouTube Stalk",
        "endpoint": "/api/stalker/youtube",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username atau handle channel YouTube" }]
    },
    {
        "name": "Twitter / X Stalk",
        "endpoint": "/api/stalker/twitter",
        "method": "GET",
        "params": [{ "name": "q", "required": true, "description": "Username Twitter/X (tanpa @)" }]
    }
],
  "tools": [
    {
      "name": "VCC Generator",
      "endpoint": "/api/tools/vccgen",
      "method": "GET",
      "description": "Generate nomor kartu kredit virtual untuk keperluan testing",
      "params": [
        { "name": "card", "required": false, "placeholder": "Jenis kartu (Visa/Mastercard)" },
        { "name": "count", "required": false, "placeholder": "Jumlah kartu (default: 1)" }
      ]
    },
    {
      "name": "Spam NGL",
      "endpoint": "/api/tools/spamngl",
      "method": "GET",
      "description": "Kirim pesan anonim bertubi-tubi ke username NGL melalui API Cuki",
      "params": [
        { "name": "link", "required": true, "placeholder": "Username atau link NGL target" },
        { "name": "message", "required": true, "placeholder": "Pesan yang ingin dikirim" },
        { "name": "jumlah", "required": false, "placeholder": "Jumlah pesan (default: 1)" }
      ]
    },
    {
      "name": "Short URL",
      "endpoint": "/api/tools/shorturl",
      "method": "GET",
      "description": "Memperpendek URL yang panjang menjadi lebih ringkas",
      "params": [
        { "name": "url", "required": true, "placeholder": "Masukkan URL panjang" }
      ]
    },
    {
      "name": "Screenshot Web",
      "endpoint": "/api/tools/ssweb",
      "method": "GET",
      "description": "Ambil tangkapan layar dari sebuah website",
      "params": [
        { "name": "url", "required": true, "placeholder": "URL website" },
        { "name": "device", "required": false, "placeholder": "desktop/mobile" }
      ]
    },
    {
      "name": "Subdomain Finder",
      "endpoint": "/api/tools/subdomain",
      "method": "GET",
      "description": "Mencari daftar subdomain dari sebuah domain utama",
      "params": [
        { "name": "domain", "required": true, "placeholder": "Contoh: google.com" }
      ]
    },
    {
      "name": "Cek Kode Pos",
      "endpoint": "/api/tools/kodepos",
      "method": "GET",
      "description": "Cari informasi kode pos berdasarkan wilayah",
      "params": [
        { "name": "query", "required": true, "placeholder": "Nama daerah/wilayah" }
      ]
    },
    {
      "name": "Country Info",
      "endpoint": "/api/tools/countryinfo",
      "method": "GET",
      "description": "Dapatkan informasi lengkap mengenai suatu negara",
      "params": [
        { "name": "country", "required": true, "placeholder": "Nama negara" }
      ]
    },
    {
      "name": "Get HTML Code",
      "endpoint": "/api/tools/getcode",
      "method": "GET",
      "description": "Mengambil kode sumber HTML dari sebuah URL",
      "params": [
        { "name": "url", "required": true, "placeholder": "URL target" }
      ]
    },
    {
      "name": "Encrypt HTML",
      "endpoint": "/api/tools/encrypthtml",
      "method": "POST",
      "description": "Enkripsi file atau teks HTML agar sulit dibaca",
      "params": [
        { "name": "html", "required": true, "placeholder": "Teks HTML atau upload file" }
      ]
    }
  ], 

"idol": [
    { 
        "name": "JKT48", 
        "endpoint": "/api/idol/jkt48", 
        "method": "GET", 
        "description": "Foto random member JKT48 (All Gen)",
        "params": [] 
    },
    { 
        "name": "Blackpink", 
        "endpoint": "/api/idol/blackpink", 
        "method": "GET", 
        "description": "Foto random member Blackpink",
        "params": [] 
    },
    { 
        "name": "NewJeans", 
        "endpoint": "/api/idol/newjeans", 
        "method": "GET", 
        "description": "Foto aesthetic member NewJeans",
        "params": [] 
    },
    { 
        "name": "IVE", 
        "endpoint": "/api/idol/ive", 
        "method": "GET", 
        "description": "Foto random member IVE",
        "params": [] 
    },
    { 
        "name": "Twice", 
        "endpoint": "/api/idol/twice", 
        "method": "GET", 
        "description": "Foto random member Twice",
        "params": [] 
    },
    { 
        "name": "Aespa", 
        "endpoint": "/api/idol/aespa", 
        "method": "GET", 
        "description": "Foto random member Aespa",
        "params": [] 
    },
    { 
        "name": "Lesserafim", 
        "endpoint": "/api/idol/lesserafim", 
        "method": "GET", 
        "description": "Foto random member Le Sserafim",
        "params": [] 
    },
    { 
        "name": "BabyMonster", 
        "endpoint": "/api/idol/babymonster", 
        "method": "GET", 
        "description": "Foto random member BabyMonster",
        "params": [] 
    },
    { 
        "name": "BTS", 
        "endpoint": "/api/idol/bts", 
        "method": "GET", 
        "description": "Foto random member BTS",
        "params": [] 
    },
    { 
        "name": "EXO", 
        "endpoint": "/api/idol/exo", 
        "method": "GET", 
        "description": "Foto random member EXO",
        "params": [] 
    }
], 
"anime": [
    { 
        "name": "Random Anime", 
        "endpoint": "/api/anime/random-anime", 
        "method": "GET", 
        "description": "Gambar karakter anime secara acak",
        "params": [] 
    },
    { 
        "name": "Quotes Anime", 
        "endpoint": "/api/anime/quotes-anime", 
        "method": "GET", 
        "description": "Kata-kata bijak dari berbagai serial anime (OtakOtaku)",
        "params": [] 
    },
    { 
        "name": "Genshin Impact", 
        "endpoint": "/api/anime/genshin", 
        "method": "GET", 
        "description": "Foto random karakter Genshin Impact (Fanart/Official)",
        "params": [] 
    },
    { 
        "name": "Blue Archive", 
        "endpoint": "/api/anime/bluearchive", 
        "method": "GET", 
        "description": "Foto random karakter Blue Archive (Sensei's favorite)",
        "params": [] 
    }, 
    { 
        "name": "Waifu Random", 
        "endpoint": "/api/anime/waifu", 
        "method": "GET", 
        "description": "Foto random waifu (kualitas HD)",
        "params": [] 
    },
    { 
        "name": "Husbu Random", 
        "endpoint": "/api/anime/husbu", 
        "method": "GET", 
        "description": "Foto random husbu (kualitas HD)",
        "params": [] 
    },
    { 
        "name": "Neko Girl", 
        "endpoint": "/api/anime/neko", 
        "method": "GET", 
        "description": "Foto gadis kucing anime",
        "params": [] 
    },
    { 
        "name": "Shinobu Kochou", 
        "endpoint": "/api/anime/shinobu", 
        "method": "GET", 
        "description": "Koleksi foto Shinobu (Demon Slayer)",
        "params": [] 
    },
    { 
        "name": "Megumin", 
        "endpoint": "/api/anime/megumin", 
        "method": "GET", 
        "description": "Koleksi foto Megumin (Konosuba)",
        "params": [] 
    },
    { 
        "name": "Rem", 
        "endpoint": "/api/anime/rem", 
        "method": "GET", 
        "description": "Koleksi foto Rem (Re:Zero)",
        "params": [] 
    },
    { 
        "name": "Emilia", 
        "endpoint": "/api/anime/emilia", 
        "method": "GET", 
        "description": "Koleksi foto Emilia (Re:Zero)",
        "params": [] 
    },
    { 
        "name": "Elaina", 
        "endpoint": "/api/anime/elaina", 
        "method": "GET", 
        "description": "Koleksi foto Elaina (Majo no Tabitabi)",
        "params": [] 
    },
    { 
        "name": "Miku Nakano", 
        "endpoint": "/api/anime/miku", 
        "method": "GET", 
        "description": "Koleksi foto Miku (Gotoubun)",
        "params": [] 
    },
    { 
        "name": "Wallpaper Anime", 
        "endpoint": "/api/anime/wallpaper", 
        "method": "GET", 
        "description": "Wallpaper anime aesthetic untuk HP",
        "params": [] 
    }
], 

"entertainment": [
    { 
        "name": "Fakta Unik", 
        "endpoint": "/api/entertainment/fakta", 
        "method": "GET", 
        "description": "Menampilkan fakta unik dan menarik dari seluruh dunia",
        "params": [] 
    },
    { 
        "name": "Quotes Bijak", 
        "endpoint": "/api/entertainment/quotes", 
        "method": "GET", 
        "description": "Koleksi kutipan bijak dari tokoh ternama",
        "params": [] 
    },
    { 
        "name": "Meme Random", 
        "endpoint": "/api/entertainment/meme", 
        "method": "GET", 
        "description": "Menampilkan gambar meme lucu secara acak",
        "params": [] 
    },
    { 
        "name": "Dark Joke", 
        "endpoint": "/api/entertainment/darkjoke", 
        "method": "GET", 
        "description": "Koleksi lelucon gelap (dark humor)",
        "params": [] 
    },
    { 
        "name": "Pantun", 
        "endpoint": "/api/entertainment/pantun", 
        "method": "GET", 
        "description": "Menampilkan pantun jenaka, cinta, atau nasihat secara acak",
        "params": [] 
    },
    { 
        "name": "Tebak Gambar", 
        "endpoint": "/api/entertainment/tebak-gambar", 
        "method": "GET", 
        "description": "Game menebak maksud dari kumpulan gambar",
        "params": [] 
    },
    { 
        "name": "Asah Otak", 
        "endpoint": "/api/entertainment/asahi", 
        "method": "GET", 
        "description": "Permainan logika untuk menguji kecerdasan",
        "params": [] 
    },
    { 
        "name": "Susun Kata", 
        "endpoint": "/api/entertainment/susunkata", 
        "method": "GET", 
        "description": "Game menyusun huruf menjadi kata yang benar",
        "params": [] 
    },
    { 
        "name": "Tebak Lirik", 
        "endpoint": "/api/entertainment/tebak-lirik", 
        "method": "GET", 
        "description": "Teka-teki menebak judul lagu berdasarkan potongan lirik",
        "params": [] 
    },
    { 
        "name": "Siapakah Aku?", 
        "endpoint": "/api/entertainment/siapakah-aku", 
        "method": "GET", 
        "description": "Teka-teki deskriptif tentang benda, hewan, atau profesi",
        "params": [] 
    },
    { 
        "name": "Gombalan", 
        "endpoint": "/api/entertainment/gombal", 
        "method": "GET", 
        "description": "Koleksi kata-kata gombal maut untuk pasangan",
        "params": [] 
    },
    { 
        "name": "Pick Up Lines", 
        "endpoint": "/api/entertainment/pickline", 
        "method": "GET", 
        "description": "Koleksi kalimat pembuka percakapan yang menarik",
        "params": [] 
    },
    { 
        "name": "Hilih Teks", 
        "endpoint": "/api/entertainment/hilih", 
        "method": "GET", 
        "description": "Mengubah semua huruf vokal menjadi 'i'",
        "params": [{ "name": "q", "required": true, "description": "Teks yang ingin diubah" }] 
    },
    { 
        "name": "Kata Lucu", 
        "endpoint": "/api/entertainment/kata-lucu", 
        "method": "GET", 
        "description": "Koleksi kalimat singkat yang menghibur",
        "params": [] 
    },
    { 
        "name": "Arti Nama", 
        "endpoint": "/api/entertainment/artinama", 
        "method": "GET", 
        "description": "Menganalisis arti dari sebuah nama",
        "params": [{ "name": "q", "required": true, "description": "Nama yang ingin dicari artinya" }] 
    }, 
    { 
        "name": "Tebak Kabupaten", 
        "endpoint": "/api/entertainment/tebak-kabupaten", 
        "method": "GET", 
        "description": "Game menebak nama kabupaten di Indonesia melalui gambar",
        "params": [] 
    },
    { 
        "name": "Tebak Bendera", 
        "endpoint": "/api/entertainment/tebak-bendera", 
        "method": "GET", 
        "description": "Game menebak bendera negara di dunia",
        "params": [] 
    },
    { 
        "name": "Tebak Kimia", 
        "endpoint": "/api/entertainment/tebak-kimia", 
        "method": "GET", 
        "description": "Game menebak unsur kimia berdasarkan simbol atau nama",
        "params": [] 
    },
    { 
        "name": "Cak Lontong", 
        "endpoint": "/api/entertainment/caklontong", 
        "method": "GET", 
        "description": "Teka-teki sulit dan jenaka khas Cak Lontong",
        "params": [] 
    },
    { 
        "name": "Tebak Kata", 
        "endpoint": "/api/entertainment/tebak-kata", 
        "method": "GET", 
        "description": "Permainan menebak kata berdasarkan petunjuk",
        "params": [] 
    },
    { 
        "name": "Tebak Jenaka", 
        "endpoint": "/api/entertainment/tebak-jenaka", 
        "method": "GET", 
        "description": "Teka-teki lucu dan menghibur",
        "params": [] 
    },
    { 
        "name": "Genshin Character", 
        "endpoint": "/api/entertainment/genshin", 
        "method": "GET", 
        "description": "Informasi random karakter dari game Genshin Impact",
        "params": [] 
    },
    { 
        "name": "Kata-kata Sad", 
        "endpoint": "/api/entertainment/kata-sad", 
        "method": "GET", 
        "description": "Koleksi kalimat galau dan sedih",
        "params": [] 
    },
    { 
        "name": "Motivasi", 
        "endpoint": "/api/entertainment/motivasi", 
        "method": "GET", 
        "description": "Kata-kata motivasi untuk membangkitkan semangat",
        "params": [] 
    },
    { 
        "name": "Teka-teki", 
        "endpoint": "/api/entertainment/tekateki", 
        "method": "GET", 
        "description": "Kumpulan teka-teki klasik beserta jawabannya",
        "params": [] 
    },
    { 
        "name": "Cerpen", 
        "endpoint": "/api/entertainment/cerpen", 
        "method": "GET", 
        "description": "Cerita pendek secara acak dengan berbagai genre",
        "params": [] 
    },
    { 
        "name": "Puisi", 
        "endpoint": "/api/entertainment/puisi", 
        "method": "GET", 
        "description": "Koleksi puisi indah dan bermakna",
        "params": [] 
    },
    { 
        "name": "Wallpaper Estetik", 
        "endpoint": "/api/entertainment/estetik", 
        "method": "GET", 
        "description": "Link gambar wallpaper dengan tema estetik",
        "params": [] 
    }
], 

"primbon": [
    { 
        "name": "Arti Nama", 
        "endpoint": "/api/primbon/artinama", 
        "method": "GET", 
        "description": "Mengetahui arti dan karakter berdasarkan nama seseorang",
        "params": [{ "name": "q", "required": true, "description": "Nama yang ingin dicari" }] 
    },
    { 
        "name": "Arti Mimpi", 
        "endpoint": "/api/primbon/artimimpi", 
        "method": "GET", 
        "description": "Tafsir mimpi berdasarkan buku primbon jawa",
        "params": [{ "name": "q", "required": true, "description": "Mimpi yang dialami" }] 
    },
    { 
        "name": "Cek Jodoh", 
        "endpoint": "/api/primbon/jodoh", 
        "method": "GET", 
        "description": "Menghitung tingkat kecocokan antara dua nama",
        "params": [
            { "name": "nama1", "required": true, "description": "Nama orang pertama" },
            { "name": "nama2", "required": true, "description": "Nama orang kedua" }
        ] 
    },
    { 
        "name": "Watak Weton", 
        "endpoint": "/api/primbon/watak", 
        "method": "GET", 
        "description": "Mengetahui sifat dan karakter berdasarkan weton kelahiran",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal (1-31)" },
            { "name": "bln", "required": true, "description": "Bulan (1-12)" },
            { "name": "thn", "required": true, "description": "Tahun (Contoh: 1995)" }
        ] 
    },
    { 
        "name": "Ramalan Nasib", 
        "endpoint": "/api/primbon/nasib", 
        "method": "GET", 
        "description": "Melihat ramalan nasib di masa depan berdasarkan tanggal lahir",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    },
    { 
        "name": "Zodiak", 
        "endpoint": "/api/primbon/zodiak", 
        "method": "GET", 
        "description": "Ramalan mingguan berdasarkan zodiak",
        "params": [{ "name": "q", "required": true, "description": "Nama zodiak (Contoh: Leo)" }] 
    },
    { 
        "name": "Shio", 
        "endpoint": "/api/primbon/shio", 
        "method": "GET", 
        "description": "Melihat karakter dan ramalan berdasarkan shio",
        "params": [{ "name": "q", "required": true, "description": "Nama shio (Contoh: Naga)" }] 
    },
    { 
        "name": "Nomor Hoki", 
        "endpoint": "/api/primbon/nomorhoki", 
        "method": "GET", 
        "description": "Mengecek keberuntungan berdasarkan nomor telepon atau angka",
        "params": [{ "name": "q", "required": true, "description": "Nomor yang ingin dicek" }] 
    },
    { 
        "name": "Garis Tangan", 
        "endpoint": "/api/primbon/garistangan", 
        "method": "GET", 
        "description": "Membaca karakter melalui bentuk garis tangan secara umum",
        "params": [] 
    },
    { 
        "name": "Rezeki Harian", 
        "endpoint": "/api/primbon/rezeki", 
        "method": "GET", 
        "description": "Ramalan keberuntungan finansial hari ini",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    },
    { 
        "name": "Hari Baik", 
        "endpoint": "/api/primbon/haribaik", 
        "method": "GET", 
        "description": "Mencari hari baik untuk memulai hajat atau kegiatan",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    },
    { 
        "name": "Hari Larangan", 
        "endpoint": "/api/primbon/harilarangan", 
        "method": "GET", 
        "description": "Mengecek hari-hari yang sebaiknya dihindari",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    },
    { 
        "name": "Arah Rezeki", 
        "endpoint": "/api/primbon/arahrezeki", 
        "method": "GET", 
        "description": "Menentukan arah keberuntungan berdasarkan weton",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    },
    { 
        "name": "Pekerjaan Weton", 
        "endpoint": "/api/primbon/pekerjaan", 
        "method": "GET", 
        "description": "Rekomendasi jenis pekerjaan yang cocok berdasarkan hari lahir",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    },
    { 
        "name": "Sifat Usaha", 
        "endpoint": "/api/primbon/usaha", 
        "method": "GET", 
        "description": "Melihat kecocokan bidang usaha berdasarkan nama",
        "params": [{ "name": "q", "required": true, "description": "Nama atau bidang usaha" }] 
    },
    { 
        "name": "Pranata Mangsa", 
        "endpoint": "/api/primbon/pranatamangsa", 
        "method": "GET", 
        "description": "Penanggalan musim tradisional jawa untuk pertanian dan alam",
        "params": [
            { "name": "tgl", "required": true, "description": "Tanggal" },
            { "name": "bln", "required": true, "description": "Bulan" },
            { "name": "thn", "required": true, "description": "Tahun" }
        ] 
    }
], 

"info": [
    { "name": "BMKG Info", "endpoint": "/api/info/bmkg", "method": "GET", "params": [] },
    { "name": "Cuaca Daerah", "endpoint": "/api/info/cuaca", "method": "GET", "params": [{ "name": "q", "required": true }] },
    { "name": "Jadwal TV", "endpoint": "/api/info/jadwaltv", "method": "GET", "params": [{ "name": "q", "required": true, "description": "Nama channel" }] },
    { "name": "Wikipedia", "endpoint": "/api/info/wikipedia", "method": "GET", "params": [{ "name": "q", "required": true }] },
    { "name": "KBBI", "endpoint": "/api/info/kbbi", "method": "GET", "params": [{ "name": "q", "required": true }] },
    { "name": "Gempa Terkini", "endpoint": "/api/info/gempa", "method": "GET", "params": [] }
], 
            "generator": [
                {
                    "name": "QR Code SVG",
                    "endpoint": "/api/generator/qr",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Teks / URL tujuan" },
                        { "name": "color", "required": false, "description": "Hex warna (contoh: putih atau fff)" }
                    ]
                },
                {
                    "name": "Captcha Solver",
                    "endpoint": "/api/generator/captcha",
                    "method": "GET",
                    "params": [
                        { "name": "difficulty", "required": false, "description": "easy / medium / hard (Opsional)" },
                        { "name": "color", "required": false, "description": "Warna garis noise (Opsional)" },
                        { "name": "view", "required": false, "description": "Pilih format output (Opsional)" }
                    ]
                },
                {
                    "name": "Identicon Avatar",
                    "endpoint": "/api/generator/avatar",
                    "method": "GET",
                    "params": [
                        { "name": "seed", "required": true, "description": "Username / Teks unik" }
                    ]
                },
                {
                    "name": "License Key",
                    "endpoint": "/api/generator/license",
                    "method": "GET",
                    "params": [
                        { "name": "format", "required": true, "description": "Contoh: INUU-XXXX-XXXX" }
                    ]
                },
                {
                    "name": "Cyberpunk Stat Bar",
                    "endpoint": "/api/generator/statbar",
                    "method": "GET",
                    "params": [
                        { "name": "label", "required": true, "description": "Nama Status" },
                        { "name": "value", "required": true, "description": "Angka 0 - 100" }
                    ]
                }, 
                {
                    "name": "Placeholder Image",
                    "endpoint": "/api/generator/placeholder",
                    "method": "GET",
                    "params": [
                        { "name": "w", "required": false, "description": "Lebar gambar (Contoh: 800)" },
                        { "name": "h", "required": false, "description": "Tinggi gambar (Contoh: 400)" },
                        { "name": "text", "required": false, "description": "Teks di tengah gambar" },
                        { "name": "bg", "required": false, "description": "Warna background (contoh: putih atau fff)" },
                        { "name": "color", "required": false, "description": "Warna teks (contoh: putih atau fff)" }
                    ]
                },
                {
                    "name": "Aesthetic Wave BG",
                    "endpoint": "/api/generator/wave",
                    "method": "GET",
                    "params": [
                        { "name": "color1", "required": false, "description": "Warna gradasi 1 contoh: putih atau fff" },
                        { "name": "color2", "required": false, "description": "Warna gradasi 2 (contoh: putih atau fff)" },
                        { "name": "bg", "required": false, "description": "Warna background (contoh: putih atau fff)" }
                    ]
                },
                {
                    "name": "Secure Token",
                    "endpoint": "/api/generator/token",
                    "method": "GET",
                    "params": [
                        { "name": "length", "required": false, "description": "Panjang token (Max 256)" },
                        { "name": "symbols", "required": false, "description": "Gunakan true untuk menyertakan simbol" }
                    ]
                }
            ],
            "komik": [
                {
                    "name": "Komikindo Search",
                    "endpoint": "/api/komik/search",
                    "method": "GET",
                    "params": [{ "name": "query", "required": true, "description": "Judul komik (Contoh: One Piece)" }]
                },
                {
                    "name": "Komikindo Detail",
                    "endpoint": "/api/komik/detail",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "URL dari hasil search" }]
                },
                {
                    "name": "Komikindo Chapter",
                    "endpoint": "/api/komik/chapter",
                    "method": "GET",
                    "params": [{ "name": "url", "required": true, "description": "URL chapter untuk baca" }]
                }
            ],
            "meme": [
                {
                    "name": "Doge vs Cheems",
                    "endpoint": "/api/meme/dogecheems",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Teks untuk si Doge (Kiri)" },
                        { "name": "text2", "required": true, "description": "Teks untuk si Cheems (Kanan)" }
                    ]
                },
                {
                    "name": "Drake Hotline Bling",
                    "endpoint": "/api/meme/hotline",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Sesuatu yang ditolak/tidak suka" },
                        { "name": "text2", "required": true, "description": "Sesuatu yang diterima/disukai" }
                    ]
                },
                {
                    "name": "Jarvis Assistant",
                    "endpoint": "/api/meme/jarvis",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Perintah atau kata-kata untuk Jarvis" }
                    ]
                },
                {
                    "name": "Maju Lu (Drama)",
                    "endpoint": "/api/meme/majulu",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Teks tantangan pertama" },
                        { "name": "text2", "required": true, "description": "Teks jawaban/kenyataan" }
                    ]
                },
                {
                    "name": "Pelajaran Hidup",
                    "endpoint": "/api/meme/pelajaran",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Pelajaran hidup yang berat" },
                        { "name": "text2", "required": true, "description": "Pelajaran sekolah yang sepele" }
                    ]
                },
                {
                    "name": "Pilihan Dilema (Dua Tombol)",
                    "endpoint": "/api/meme/pilihan",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Pertanyaan utama" },
                        { "name": "text2", "required": true, "description": "Pilihan tombol kiri" },
                        { "name": "text3", "required": true, "description": "Pilihan tombol kanan" }
                    ]
                },
                {
                    "name": "Squidward Window",
                    "endpoint": "/api/meme/squidwindow",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Teks Squidward di dalam rumah" },
                        { "name": "text2", "required": true, "description": "Teks Patrick/Spongebob di luar" }
                    ]
                },
                {
                    "name": "Two Buttons (Daily)",
                    "endpoint": "/api/meme/twobuttons",
                    "method": "GET",
                    "params": [
                        { "name": "text1", "required": true, "description": "Opsi tombol 1" },
                        { "name": "text2", "required": true, "description": "Opsi tombol 2" }
                    ]
                }
            ],
    "islam": [
        {
            "name": "Al-Qur'an (Per Ayat)",
            "endpoint": "/api/islam/quran",
            "method": "GET",
            "params": [
                { "name": "surah", "required": true, "description": "Nomor Surat (1-114)" },
                { "name": "ayat", "required": true, "description": "Nomor Ayat" }
            ]
        },
        {
            "name": "Daftar Surat",
            "endpoint": "/api/islam/daftarsurat",
            "method": "GET",
            "params": []
        },
        {
            "name": "Tafsir / Arti Surat",
            "endpoint": "/api/islam/tafsir",
            "method": "GET",
            "params": [
                { "name": "surah", "required": true, "description": "Nomor Surat" }
            ]
        },
        {
            "name": "Audio Murottal",
            "endpoint": "/api/islam/audiosurat",
            "method": "GET",
            "params": [
                { "name": "surah", "required": true, "description": "Nomor Surat" }
            ]
        },
        {
            "name": "Hadits",
            "endpoint": "/api/islam/hadits",
            "method": "GET",
            "params": [
                { "name": "q", "required": true, "description": "Nama Perawi (bukhari, muslim, dll)" },
                { "name": "ayat", "required": true, "description": "Nomor Hadits" }
            ]
        },
        {
            "name": "Jadwal Sholat",
            "endpoint": "/api/islam/jadwalsholat",
            "method": "GET",
            "params": [
                { "name": "q", "required": true, "description": "Nama Kota" }
            ]
        },
        {
            "name": "Tebak Kisah Nabi",
            "endpoint": "/api/islam/tebak-nabi",
            "method": "GET",
            "params": []
        },
        {
            "name": "Kisah Nabi",
            "endpoint": "/api/islam/kisahnabi",
            "method": "GET",
            "params": [
                { "name": "q", "required": true, "description": "Nama Nabi" }
            ]
        },
        {
            "name": "Zikir Pagi & Petang",
            "endpoint": "/api/islam/zikir",
            "method": "GET",
            "params": [
                { "name": "q", "required": true, "description": "Pilihan: 'pagi' atau 'petang'" }
            ]
        },
        {
            "name": "Niat Puasa",
            "endpoint": "/api/islam/puasa",
            "method": "GET",
            "params": [
                { "name": "q", "required": false, "description": "Jenis Puasa (ramadhan, senin, kamis)" }
            ]
        },
        {
            "name": "Asmaul Husna",
            "endpoint": "/api/islam/asmaulhusna",
            "method": "GET",
            "params": [
                { "name": "q", "required": false, "description": "Nomor indeks (1-99)" }
            ]
        },
        {
            "name": "Doa Tahlil",
            "endpoint": "/api/islam/tahlil",
            "method": "GET",
            "params": []
        },
        {
            "name": "Ayat Kursi",
            "endpoint": "/api/islam/ayatkursi",
            "method": "GET",
            "params": []
        }
    ], 

                        "sticker": [
                {
                    "name": "Stickerly Search",
                    "endpoint": "/api/sticker/stickerly",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Keyword sticker (Contoh: Pentol)" }]
                },
                {
                    "name": "Emojimix",
                    "endpoint": "/api/sticker/emojimix",
                    "method": "GET",
                    "params": [
                        { "name": "emoji1", "required": true, "description": "Emoji pertama" },
                        { "name": "emoji2", "required": true, "description": "Emoji kedua" }
                    ]
                },
                {
                    "name": "Quotely (QC)",
                    "endpoint": "/api/sticker/qc",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Isi pesan chat" },
                        { "name": "name", "required": true, "description": "Nama pengirim" },
                        { "name": "avatarUrl", "required": false, "description": "Link foto profil (Opsional)" }
                    ]
                },
                {
                    "name": "Brat Generator",
                    "endpoint": "/api/sticker/brat",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Teks untuk sticker brat" }]
                }
            ],
            "fun": [
                {
                    "name": "Cek Khodam",
                    "endpoint": "/api/fun/cekkhodam",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama untuk cek khodam" }]
                },
                {
                    "name": "Tes Kecocokan",
                    "endpoint": "/api/fun/teskecocokan",
                    "method": "GET",
                    "params": [
                        { "name": "name1", "required": true, "description": "Nama orang pertama" },
                        { "name": "name2", "required": true, "description": "Nama orang kedua" }
                    ]
                },
                {
                    "name": "Apakah (8Ball)",
                    "endpoint": "/api/fun/apakah",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Pertanyaan iya/tidak" }]
                },
                {
                    "name": "Kapan",
                    "endpoint": "/api/fun/kapan",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Pertanyaan waktu" }]
                },
                {
                    "name": "Bisakah",
                    "endpoint": "/api/fun/bisakah",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Pertanyaan kemampuan" }]
                },
                {
                    "name": "Bagaimanakah",
                    "endpoint": "/api/fun/bagaimanakah",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Pertanyaan kondisi" }]
                },
                {
                    "name": "Cek Ganteng",
                    "endpoint": "/api/fun/cekganteng",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Cantik",
                    "endpoint": "/api/fun/cekcantik",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Bucin",
                    "endpoint": "/api/fun/cekbucin",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Stres",
                    "endpoint": "/api/fun/cekstres",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Wibu",
                    "endpoint": "/api/fun/cekwibu",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Pelit",
                    "endpoint": "/api/fun/cekpelit",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Jomblo",
                    "endpoint": "/api/fun/cekjomblo",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Nama yang dicek" }]
                },
                {
                    "name": "Cek Sifat",
                    "endpoint": "/api/fun/ceksifat",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Analisis sifat nama" }]
                },
                {
                    "name": "Ramal Pekerjaan",
                    "endpoint": "/api/fun/pekerjaan",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Cek masa depan kerja" }]
                },
                {
                    "name": "Prediksi Jodoh",
                    "endpoint": "/api/fun/jodohku",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Ciri-ciri jodohmu" }]
                },
                {
                    "name": "Rate Hal",
                    "endpoint": "/api/fun/rate",
                    "method": "GET",
                    "params": [{ "name": "text", "required": true, "description": "Hal yang ingin dinilai" }]
                },
                {
                    "name": "Fakta Random",
                    "endpoint": "/api/fun/faktarandom",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Gombalan",
                    "endpoint": "/api/fun/gombalan",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Pantun Lucu",
                    "endpoint": "/api/fun/pantun",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Truth",
                    "endpoint": "/api/fun/truth",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Dare",
                    "endpoint": "/api/fun/dare",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Quotes Galau",
                    "endpoint": "/api/fun/quotes",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Kata Bijak",
                    "endpoint": "/api/fun/katabijak",
                    "method": "GET",
                    "params": []
                },
                {
                    "name": "Tebak Umur",
                    "endpoint": "/api/fun/tebakumur",
                    "method": "GET",
                    "params": [{ "name": "name", "required": true, "description": "Tebak umur lewat nama" }]
                },
                {
                    "name": "Text to Speech",
                    "endpoint": "/api/fun/tts",
                    "method": "GET",
                    "params": [
                        { "name": "text", "required": true, "description": "Teks untuk jadi suara" },
                        { "name": "lang", "required": false, "description": "Kode bahasa (id, en, ja)" }
                    ]
                }
            ],
            
  "movie": [
    {
      "name": "Melolo Home",
      "endpoint": "/api/movie/melolo-home",
      "method": "GET",
      "description": "Konten homepage dari platform streaming Melolo",
      "params": []
    },
    {
      "name": "Melolo Search",
      "endpoint": "/api/movie/melolo-search",
      "method": "GET",
      "description": "Pencarian drama dari platform Melolo",
      "params": [
        { "name": "query", "required": true, "placeholder": "Masukkan judul drama (cth: ceo)" }
      ]
    },
    {
      "name": "Melolo Detail",
      "endpoint": "/api/movie/melolo-detail",
      "method": "GET",
      "description": "Detail lengkap drama Melolo",
      "params": [
        { "name": "url", "required": true, "placeholder": "URL drama dari Melolo" }
      ]
    },
    {
      "name": "Melolo Download",
      "endpoint": "/api/movie/melolo-download",
      "method": "GET",
      "description": "Link download episode drama Melolo",
      "params": [
        { "name": "url", "required": true, "placeholder": "URL episode drama" }
      ]
    },
    {
      "name": "Melolo Category",
      "endpoint": "/api/movie/melolo-category",
      "method": "GET",
      "description": "Jelajahi drama berdasarkan kategori Melolo",
      "params": [
        { "name": "url", "required": true, "placeholder": "URL kategori (cth: romance)" }
      ]
    },
    {
      "name": "Donghua Search",
      "endpoint": "/api/movie/donghua-search",
      "method": "GET",
      "description": "Pencarian donghua",
      "params": [
        { "name": "query", "required": true, "placeholder": "Judul donghua" },
        { "name": "page", "required": false, "placeholder": "Halaman" }
      ]
    },
    {
      "name": "Donghua Detail",
      "endpoint": "/api/movie/donghua-detail",
      "method": "GET",
      "description": "Detail lengkap Donghua",
      "params": [
        { "name": "url", "required": true, "placeholder": "URL detail donghua" }
      ]
    },
    {
      "name": "Drakor Search",
      "endpoint": "/api/movie/drakor-search",
      "method": "GET",
      "description": "Pencarian drama Korea",
      "params": [
        { "name": "query", "required": true, "placeholder": "Judul drakor" }
      ]
    },
    {
      "name": "iQiyi Search",
      "endpoint": "/api/movie/iq-search",
      "method": "GET",
      "description": "Pencarian film dari iQiyi",
      "params": [
        { "name": "query", "required": true, "placeholder": "Judul film" }
      ]
    },
    {
      "name": "iQiyi Detail",
      "endpoint": "/api/movie/iq-detail",
      "method": "GET",
      "description": "Detail film dari iQiyi",
      "params": [
        { "name": "query", "required": true, "placeholder": "ID/Judul film" }
      ]
    },
    {
      "name": "DramaBos Search",
      "endpoint": "/api/movie/dramabos-search",
      "method": "GET",
      "description": "Pencarian DramaBos",
      "params": [
        { "name": "query", "required": true, "placeholder": "Masukkan judul" }
      ]
    },
    {
      "name": "Netflix Trending",
      "endpoint": "/api/movie/netflix-trending",
      "method": "GET",
      "description": "Film trending di Netflix",
      "params": [
        { "name": "language", "required": false, "placeholder": "Bahasa (cth: id)" }
      ]
    },
    {
      "name": "PusatFilm21 Search",
      "endpoint": "/api/movie/pusatfilm-search",
      "method": "GET",
      "description": "Pencarian film di PusatFilm21",
      "params": [
        { "name": "query", "required": true, "placeholder": "Judul film" }
      ]
    }, 
    {
    "name": "Filem21 Search",
    "endpoint": "/api/movie/filem21-search",
    "method": "GET",
    "description": "Pencarian film/serial di Filem21",
    "params": [
        { "name": "q", "required": true, "description": "Judul film yang dicari" }
    ]
},
{
    "name": "Filem21 TV Series",
    "endpoint": "/api/movie/filem21-tv",
    "method": "GET",
    "description": "Daftar serial TV di Filem21",
    "params": [
        { "name": "page", "required": false, "description": "Nomor halaman (default: 1)" }
    ]
},
{
    "name": "Filem21 Genre List",
    "endpoint": "/api/movie/filem21-genre-list",
    "method": "GET",
    "description": "Daftar semua genre yang tersedia di Filem21",
    "params": []
},
{
    "name": "Filem21 By Genre",
    "endpoint": "/api/movie/filem21-genre",
    "method": "GET",
    "description": "Film berdasarkan genre di Filem21",
    "params": [
        { "name": "q", "required": true, "description": "Slug genre (contoh: action)" },
        { "name": "page", "required": false, "description": "Nomor halaman (default: 1)" }
    ]
},
{
    "name": "Filem21 Country List",
    "endpoint": "/api/movie/filem21-country-list",
    "method": "GET",
    "description": "Daftar semua negara asal film di Filem21",
    "params": []
},
{
    "name": "Filem21 By Country",
    "endpoint": "/api/movie/filem21-country",
    "method": "GET",
    "description": "Film berdasarkan negara di Filem21",
    "params": [
        { "name": "q", "required": true, "description": "Slug negara (contoh: japan)" },
        { "name": "page", "required": false, "description": "Nomor halaman (default: 1)" }
    ]
},
{
    "name": "Filem21 Detail",
    "endpoint": "/api/movie/filem21-detail",
    "method": "GET",
    "description": "Detail lengkap film termasuk metadata, episode, dan link download",
    "params": [
        { "name": "url", "required": true, "description": "URL lengkap film (contoh: https://tv13.filem21.net/the-avengers-2012/)" }
    ]
}
  ], 

    "berita": [
        {
            "name": "Detik News",
            "endpoint": "/api/berita/detik",
            "method": "GET",
            "params": [],
            "description": "Berita terbaru dari portal Detik.com"
        },
        {
            "name": "CNBC Indonesia",
            "endpoint": "/api/berita/cnbc",
            "method": "GET",
            "params": [],
            "description": "Berita ekonomi, bisnis, dan teknologi"
        },
        {
            "name": "Kompas News",
            "endpoint": "/api/berita/kompas",
            "method": "GET",
            "params": [],
            "description": "Berita nasional terpercaya dari Kompas"
        },
        {
            "name": "Antara News",
            "endpoint": "/api/berita/antara",
            "method": "GET",
            "params": [],
            "description": "Berita terkini dari kantor berita Antara"
        },
        {
            "name": "Suara News",
            "endpoint": "/api/berita/suara",
            "method": "GET",
            "params": [],
            "description": "Berita terkini dari Suara.com"
        }
    ], 

            "ephoto": [
                {
                    "name": "1917 Style",
                    "endpoint": "/api/ephoto/1917style",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks untuk efek 1917" }]
                },
                {
                    "name": "Advanced Glow",
                    "endpoint": "/api/ephoto/advancedglow",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks efek cahaya glow" }]
                },
                {
                    "name": "Blackpink Logo",
                    "endpoint": "/api/ephoto/blackpinklogo",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks logo Blackpink" }]
                },
                {
                    "name": "Blackpink Style",
                    "endpoint": "/api/ephoto/blackpinkstyle",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks gaya Blackpink" }]
                },
                {
                    "name": "Cartoon Style",
                    "endpoint": "/api/ephoto/cartoonstyle",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks gaya kartun" }]
                },
                {
                    "name": "Deleting Text",
                    "endpoint": "/api/ephoto/deletingtext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Efek teks terhapus" }]
                },
                {
                    "name": "Dragon Ball",
                    "endpoint": "/api/ephoto/dragonball",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks tema Dragon Ball" }]
                },
                {
                    "name": "Cloud Effect",
                    "endpoint": "/api/ephoto/effectclouds",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks di atas awan" }]
                },
                {
                    "name": "Flag 3D Text",
                    "endpoint": "/api/ephoto/flag3dtext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks bendera 3D" }]
                },
                {
                    "name": "Flag Text",
                    "endpoint": "/api/ephoto/flagtext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks tema bendera" }]
                },
                {
                    "name": "Free Create",
                    "endpoint": "/api/ephoto/freecreate",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Bebas buat teks" }]
                },
                {
                    "name": "Galaxy Style",
                    "endpoint": "/api/ephoto/galaxy",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks tema galaksi" }]
                },
                {
                    "name": "Galaxy Wallpaper",
                    "endpoint": "/api/ephoto/galaxywallpaper",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Buat wallpaper galaksi" }]
                },
                {
                    "name": "Glitch Text",
                    "endpoint": "/api/ephoto/glitchtext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Efek teks glitch" }]
                },
                {
                    "name": "Glowing Text",
                    "endpoint": "/api/ephoto/glowingtext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks bercahaya neon" }]
                },
                {
                    "name": "Gradient Text",
                    "endpoint": "/api/ephoto/gradienttext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks warna gradasi" }]
                },
                {
                    "name": "Light Effects",
                    "endpoint": "/api/ephoto/lighteffects",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks efek lampu" }]
                },
                {
                    "name": "Logo Maker",
                    "endpoint": "/api/ephoto/logomaker",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Buat logo simpel" }]
                },
                {
                    "name": "Luxury Gold",
                    "endpoint": "/api/ephoto/luxurygold",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks emas mewah" }]
                },
                {
                    "name": "Making Neon",
                    "endpoint": "/api/ephoto/makingneon",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Efek lampu neon" }]
                },
                {
                    "name": "Neon Glitch",
                    "endpoint": "/api/ephoto/neonglitch",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Perpaduan neon & glitch" }]
                },
                {
                    "name": "Paper Cut Style",
                    "endpoint": "/api/ephoto/papercutstyle",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Gaya potongan kertas" }]
                },
                {
                    "name": "Pixel Glitch",
                    "endpoint": "/api/ephoto/pixelglitch",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Efek glitch kotak pixel" }]
                },
                {
                    "name": "Royal Text",
                    "endpoint": "/api/ephoto/royaltext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks gaya kerajaan" }]
                },
                {
                    "name": "Sand Summer",
                    "endpoint": "/api/ephoto/sandsummer",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks di atas pasir pantai" }]
                },
                {
                    "name": "Summer Beach",
                    "endpoint": "/api/ephoto/summerbeach",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks tema pantai" }]
                },
                {
                    "name": "Typography Text",
                    "endpoint": "/api/ephoto/typographytext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Seni tipografi" }]
                },
                {
                    "name": "Underwater Text",
                    "endpoint": "/api/ephoto/underwatertext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks di dalam air" }]
                },
                {
                    "name": "Watercolor Text",
                    "endpoint": "/api/ephoto/watercolortext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks cat air" }]
                },
                {
                    "name": "Write Text",
                    "endpoint": "/api/ephoto/writetext",
                    "method": "GET",
                    "params": [{ "name": "q", "required": true, "description": "Teks tulis tangan" }]
                }
            ],
            "canvas": [
                {
                    "name": "Circle Avatar",
                    "endpoint": "/api/canvas/circle",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Beautiful Frame",
                    "endpoint": "/api/canvas/beautiful",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Delete Trash",
                    "endpoint": "/api/canvas/delete",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Facepalm",
                    "endpoint": "/api/canvas/facepalm",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Blur Filter",
                    "endpoint": "/api/canvas/blur",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Invert Color",
                    "endpoint": "/api/canvas/invert",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Greyscale",
                    "endpoint": "/api/canvas/greyscale",
                    "method": "POST",
                    "params": [{ "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" }]
                },
                {
                    "name": "Darkness",
                    "endpoint": "/api/canvas/darkness",
                    "method": "POST",
                    "params": [
                        { "name": "image", "required": true, "description": "URL Gambar / Upload Galeri" },
                        { "name": "amount", "required": true, "description": "Intensitas Gelap (1-100)" }
                    ]
                },
                {
                    "name": "Batslap",
                    "endpoint": "/api/canvas/batslap",
                    "method": "POST",
                    "params": [
                        { "name": "image1", "required": true, "description": "Gambar Penampar" },
                        { "name": "image2", "required": true, "description": "Gambar Ditampar" }
                    ]
                },
                {
                    "name": "Kiss",
                    "endpoint": "/api/canvas/kiss",
                    "method": "POST",
                    "params": [
                        { "name": "image1", "required": true, "description": "URL Gambar 1" },
                        { "name": "image2", "required": true, "description": "URL Gambar 2" }
                    ]
                },
                {
                    "name": "Sertifikat Tolol",
                    "endpoint": "/api/canvas/sertifikat-tolol",
                    "method": "POST",
                    "params": [{ "name": "text", "required": true, "description": "Nama di sertifikat" }]
                },
                {
                    "name": "Gay Frame",
                    "endpoint": "/api/canvas/gay",
                    "method": "POST",
                    "params": [
                        { "name": "nama", "required": true, "description": "Nama User" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "num", "required": true, "description": "Persentase (contoh: 87)" }
                    ]
                },
                {
                    "name": "Level Up RPG",
                    "endpoint": "/api/canvas/level-up",
                    "method": "POST",
                    "params": [
                        { "name": "backgroundURL", "required": true, "description": "URL Background / Upload" },
                        { "name": "avatarURL", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "fromLevel", "required": true, "description": "Level Sebelumnya (Angka)" },
                        { "name": "toLevel", "required": true, "description": "Level Baru (Angka)" },
                        { "name": "name", "required": true, "description": "Nama Player" }
                    ]
                },
                {
                    "name": "Profile RPG",
                    "endpoint": "/api/canvas/profile",
                    "method": "POST",
                    "params": [
                        { "name": "backgroundURL", "required": true, "description": "URL Background / Upload" },
                        { "name": "avatarURL", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "rankName", "required": true, "description": "Nama Rank (Contoh: Epik)" },
                        { "name": "rankId", "required": true, "description": "ID Rank (Angka)" },
                        { "name": "exp", "required": true, "description": "EXP saat ini (Angka)" },
                        { "name": "requireExp", "required": true, "description": "EXP yang dibutuhkan (Angka)" },
                        { "name": "level", "required": true, "description": "Level saat ini (Angka)" },
                        { "name": "name", "required": true, "description": "Nama Player" }
                    ]
                },
                {
                    "name": "Ship Match",
                    "endpoint": "/api/canvas/ship",
                    "method": "POST",
                    "params": [
                        { "name": "avatar1", "required": true, "description": "URL Avatar 1" },
                        { "name": "avatar2", "required": true, "description": "URL Avatar 2" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "persen", "required": true, "description": "Persentase Kecocokan (1-100)" }
                    ]
                },
                {
                    "name": "Twitter Card",
                    "endpoint": "/api/canvas/tweet",
                    "method": "POST",
                    "params": [
                        { "name": "displayName", "required": true, "description": "Nama Tampilan" },
                        { "name": "username", "required": true, "description": "Username (Tanpa @)" },
                        { "name": "comment", "required": true, "description": "Isi Tweet" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "verified", "required": false, "description": "true / false (Opsional)" },
                        { "name": "theme", "required": false, "description": "dark / light (Opsional)" }
                    ]
                },
                {
                    "name": "Spotify Player",
                    "endpoint": "/api/canvas/spotify",
                    "method": "POST",
                    "params": [
                        { "name": "title", "required": true, "description": "Judul Lagu" },
                        { "name": "artist", "required": true, "description": "Nama Artis" },
                        { "name": "start", "required": true, "description": "Waktu Mulai dalam ms (Contoh: 100000)" },
                        { "name": "end", "required": true, "description": "Total Waktu dalam ms (Contoh: 200000)" },
                        { "name": "image", "required": true, "description": "URL Cover Album / Upload" },
                        { "name": "border", "required": true, "description": "Warna Border (Hex: %231DB954)" }
                    ]
                },
                {
    "name": "Spotify Card",
    "endpoint": "/api/canvas/spotify-card",
    "method": "GET",
    "params": [
        { "name": "cover", "required": true, "description": "URL cover album" },
        { "name": "title", "required": true, "description": "Judul lagu" },
        { "name": "artist", "required": true, "description": "Nama artis" },
        { "name": "bg", "required": false, "description": "URL background (opsional)" }
    ]
}, 
                {
                    "name": "Security Report",
                    "endpoint": "/api/canvas/security",
                    "method": "POST",
                    "params": [
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "createdTimestamp", "required": true, "description": "Timestamp Dibuat (ms)" },
                        { "name": "suspectTimestamp", "required": true, "description": "Timestamp Suspect (ms)" },
                        { "name": "locale", "required": true, "description": "Kode Bahasa (en / id)" }
                    ]
                },
                {
                    "name": "Welcome V1",
                    "endpoint": "/api/canvas/welcomev1",
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "guildName", "required": true, "description": "Nama Grup/Server" },
                        { "name": "guildIcon", "required": true, "description": "URL Ikon Grup / Upload" },
                        { "name": "memberCount", "required": true, "description": "Jumlah Member" },
                        { "name": "avatar", "required": true, "description": "URL Avatar User / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "quality", "required": false, "description": "Kualitas Gambar (Opsional: 80)" }
                    ]
                },
                {
                    "name": "Welcome V2",
                    "endpoint": "/api/canvas/welcomev2",
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "guildName", "required": true, "description": "Nama Grup/Server" },
                        { "name": "memberCount", "required": true, "description": "Jumlah Member" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" }
                    ]
                },
                {
                    "name": "Welcome V3",
                    "endpoint": "/api/canvas/welcomev3",
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" }
                    ]
                },
                {
                    "name": "Welcome V4",
                    "endpoint": "/api/canvas/welcomev4",
                    "method": "POST",
                    "params": [
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "description", "required": true, "description": "Pesan Sambutan" }
                    ]
                },
                {
                    "name": "Welcome V5",
                    "endpoint": "/api/canvas/welcomev5",
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "guildName", "required": true, "description": "Nama Grup/Server" },
                        { "name": "memberCount", "required": true, "description": "Jumlah Member" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "quality", "required": false, "description": "Kualitas Gambar (Opsional: 90)" }
                    ]
                },
                {
                    "name": "Goodbye V1",
                    "endpoint": "/api/canvas/goodbyev1",
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "guildName", "required": true, "description": "Nama Grup/Server" },
                        { "name": "guildIcon", "required": true, "description": "URL Ikon Grup / Upload" },
                        { "name": "memberCount", "required": true, "description": "Jumlah Member" },
                        { "name": "avatar", "required": true, "description": "URL Avatar User / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "quality", "required": false, "description": "Kualitas Gambar (Opsional: 80)" }
                    ]
                },
                {
                    "name": "Goodbye V2",
                    "endpoint": "/api/canvas/goodbyev2",
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "guildName", "required": true, "description": "Nama Grup/Server" },
                        { "name": "memberCount", "required": true, "description": "Jumlah Member" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" }
                    ]
                },
                {
                    "name": "Goodbye V3", 
                    "endpoint": "/api/canvas/goodbyev3", 
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" }
                    ]
                },
                {
                    "name": "Goodbye V4",
                    "endpoint": "/api/canvas/goodbyev4",
                    "method": "POST",
                    "params": [
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "title", "required": true, "description": "Judul (Contoh: Goodbye)" },
                        { "name": "description", "required": true, "description": "Pesan Perpisahan" },
                        { "name": "border", "required": true, "description": "Warna Border" },
                        { "name": "avatarBorder", "required": true, "description": "Warna Border Avatar" },
                        { "name": "overlayOpacity", "required": true, "description": "Opasitas (0.1 - 1.0)" }
                    ]
                },
                {
                    "name": "Goodbye V5",
                    "endpoint": "/api/canvas/goodbyev5", 
                    "method": "POST",
                    "params": [
                        { "name": "username", "required": true, "description": "Nama User" },
                        { "name": "guildName", "required": true, "description": "Nama Grup/Server" },
                        { "name": "memberCount", "required": true, "description": "Jumlah Member" },
                        { "name": "avatar", "required": true, "description": "URL Avatar / Upload" },
                        { "name": "background", "required": true, "description": "URL Background / Upload" },
                        { "name": "quality", "required": false, "description": "Kualitas Gambar (Opsional: 90)" }
                    ]
                }
                
            ]
        }
    });
}