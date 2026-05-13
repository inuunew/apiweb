Export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200).json({
        "settings": {
            "apiName": "InuuTyzDev",
            "creator": "InuuTyzDev",
            "description": "Developer Modal AI\nMasterpiece provider-api" ,
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
                        { "name": "image", "required": true, "description": "Link Foto (URL) / Upload Galeri" }
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
                }, 
                {
                    "name": "HTML Encryptor",
                    "endpoint": "/api/tools/encrypthtml",
                    "method": "POST",
                    "params": [
                        { "name": "html", "required": true, "description": "Source Code HTML lengkap (Mendukung teks sangat panjang)" }
                    ]
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