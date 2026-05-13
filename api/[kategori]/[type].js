// Import semua library yang dibutuhkan di sini (axios, cheerio, dll)
import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto'; // 👉 Tambahkan ini
import QRCode from 'qrcode-svg'; // 👉 Tambahkan ini (Pastikan sudah npm install qrcode-svg)

const colorDictionary = {
    "putih": "ffffff", "white": "ffffff",
    "hitam": "000000", "black": "000000",
    "merah": "ff0000", "red": "ff0000",
    "biru": "0000ff", "blue": "0000ff",
    "hijau": "00ff00", "green": "00ff00",
    "kuning": "ffff00", "yellow": "ffff00",
    "ungu": "8a2be2", "purple": "8a2be2",
    "abu": "808080", "gray": "808080", "grey": "808080",
    "pink": "ffc0cb", "merahmuda": "ffc0cb",
    "oren": "ffa500", "orange": "ffa500",
    "cyan": "00ffff", "magenta": "ff00ff"
};

function parseColor(input, defaultHex) {
    if (!input) return defaultHex;
    let cleanInput = input.toLowerCase().trim();
    
    // 1. Cek apakah user mengetik nama warna yang ada di kamus
    if (colorDictionary[cleanInput]) {
        return colorDictionary[cleanInput];
    }
    
    // 2. Jika tidak ada di kamus, asumsikan user mengetik kode Hex murni.
    // Hapus tanda '#' jika user tidak sengaja memasukkannya.
    return cleanInput.replace('#', '');
}


export default async function handler(req, res) {
    // VERCEL OTOMATIS MENANGKAP NAMA FOLDER & ENDPOINT DARI URL!
    // Contoh URL: /api/ai/gemini  -> kategori = "ai", type = "gemini"
    // Contoh URL: /api/maker/ektp -> kategori = "maker", type = "ektp"
    const { kategori, type, q, text, color, bg, color1, color2, difficulty, view, seed, format, label, value, w, h, length, symbols, cookie, promptSystem, prompt, system, temperature, provinsi, kota, nik, nama, ttl, jenis_kelamin, golongan_darah, alamat, kecamatan, agama, status, pekerjaan, kewarganegaraan, masa_berlaku, terbuat, pas_photo, image, text1, text2, text3, name, comment, ppurl, number, title, time, avatarUrl, device, domain, query, country, url, user, username, hero, channel } = req.query;





const apiKeyCuki = "cuki-x"; 




    try {
    // 1. KATEGORI: AI
    // ==========================================
    if (kategori === 'ai') {
        
        // --- KELOMPOK MODEL AI STANDAR ---
        const standardAI = ['deepseekr1', 'qwq32b', 'phi2', 'glm47flash', 'gptoss120b'];

        if (standardAI.includes(type)) {
            if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });
            
            // Membangun URL dengan parameter opsional system & temperature
            let targetUrl = `https://api.siputzx.my.id/api/ai/${type}?prompt=${encodeURIComponent(prompt)}`;
            if (system) targetUrl += `&system=${encodeURIComponent(system)}`;
            if (temperature) targetUrl += `&temperature=${temperature}`;

            const response = await axios.get(targetUrl);

            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }

            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }


        
       else if (type === 'gita') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (pertanyaan) wajib diisi!" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/ai/gita?q=${encodeURIComponent(q)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }

            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }

        // --- MODEL AI KHUSUS: GEMINI ---
        else if (type === 'gemini') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });
            
            let targetUrl = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
            if (cookie) targetUrl += `&cookie=${encodeURIComponent(cookie)}`;
            if (promptSystem) targetUrl += `&promptSystem=${encodeURIComponent(promptSystem)}`;
            
            const response = await axios.get(targetUrl);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }

            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        
        else {
            return res.status(404).json({ error: `Endpoint AI '${type}' tidak ada` });
        }
    }

    // ==========================================
    // 2. KATEGORI: MAKER
    // ==========================================
        // ==========================================
    // 2. KATEGORI: MAKER
    // ==========================================
    else if (kategori === 'maker') {
        
        // --- FITUR BRAT GENERATOR ---
        if (type === 'brat') {
            if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi" });
            const targetUrl = `https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`;
            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
        }

        // --- 2. E-KTP MAKER ---
        else if (type === 'ektp') {
            const required = ['provinsi', 'kota', 'nik', 'nama', 'ttl', 'jenis_kelamin', 'alamat', 'kecamatan', 'agama', 'status', 'pekerjaan', 'pas_photo'];
            for (const field of required) {
                if (!req.query[field]) return res.status(400).json({ status: false, message: `Parameter '${field}' wajib diisi!` });
            }

            const rt_rw = req.query['rt/rw'] || "000/000";
            const kel_desa = req.query['kel/desa'] || "Desa";

            const targetUrl = `https://api.siputzx.my.id/api/canvas/ektp?provinsi=${encodeURIComponent(provinsi)}&kota=${encodeURIComponent(kota)}&nik=${encodeURIComponent(nik)}&nama=${encodeURIComponent(nama)}&ttl=${encodeURIComponent(ttl)}&jenis_kelamin=${encodeURIComponent(jenis_kelamin)}&golongan_darah=${encodeURIComponent(golongan_darah || '-')}&alamat=${encodeURIComponent(alamat)}&rt%2Frw=${encodeURIComponent(rt_rw)}&kel%2Fdesa=${encodeURIComponent(kel_desa)}&kecamatan=${encodeURIComponent(kecamatan)}&agama=${encodeURIComponent(agama)}&status=${encodeURIComponent(status)}&pekerjaan=${encodeURIComponent(pekerjaan)}&kewarganegaraan=${encodeURIComponent(kewarganegaraan || 'WNI')}&masa_berlaku=${encodeURIComponent(masa_berlaku || 'Seumur Hidup')}&terbuat=${encodeURIComponent(terbuat || '01-01-2024')}&pas_photo=${encodeURIComponent(pas_photo)}`;

            const response = await axios.get(targetUrl, { responseType: 'arraybuffer' });
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        }

        // --- 3. EPHOTO360 GRAFFITI ---
        else if (type === 'ephoto360') {
            if (!text1) return res.status(400).json({ status: false, message: "Parameter 'text1' wajib diisi!" });
            const template_url = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";
            const payload = { url: template_url, text1, text2: text2 || "" };
            const response = await axios.post("https://api.siputzx.my.id/api/m/ephoto360", payload, {
                headers: { "Content-Type": "application/json" },
                responseType: 'arraybuffer'
            });
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        }

        // --- 4. FB COMMAND (CANVAS) ---
        else if (type === 'fbcommand') {
            if (!name || !comment || !ppurl) {
                return res.status(400).json({ status: false, message: "Parameter 'name', 'comment', dan 'ppurl' (Link Foto) wajib diisi!" });
            }
            const targetUrl = `https://api.cuki.biz.id/api/canvas/fbcommand?apikey=${apiKeyCuki}&name=${encodeURIComponent(name)}&comment=${encodeURIComponent(comment)}&ppurl=${encodeURIComponent(ppurl)}`;
            const response = await axios.get(targetUrl, { 
                headers: { 'x-api-key': apiKeyCuki },
                responseType: 'arraybuffer' 
            });
            res.setHeader('Content-Type', 'image/png');
            return res.status(200).send(response.data);
        }

        // --- 5. FAKE GROUP MAKER ---
        else if (type === 'fakegroup') {
            if (!number || !title || !time || !avatarUrl) {
                return res.status(400).json({ status: false, message: "Parameter 'number', 'title', 'time', dan 'avatarUrl' wajib diisi!" });
            }
            const targetUrl = `https://api.cuki.biz.id/api/maker/fakegroup?apikey=${apiKeyCuki}&number=${number}&title=${encodeURIComponent(title)}&time=${time}&avatarUrl=${encodeURIComponent(avatarUrl)}`;
            const response = await axios.get(targetUrl, { 
                headers: { 'x-api-key': apiKeyCuki },
                responseType: 'arraybuffer' 
            });
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        }

        // --- 6. ROASTING MAKER ---
        else if (type === 'roasting') {
            if (!text1 || !text2 || !text3) {
                return res.status(400).json({ status: false, message: "Parameter 'teks1', 'teks2', dan 'teks3' wajib diisi!" });
            }
            const targetUrl = `https://api.cuki.biz.id/api/maker/roasting?apikey=${apiKeyCuki}&teks1=${encodeURIComponent(text1)}&teks2=${encodeURIComponent(text2)}&teks3=${encodeURIComponent(text3)}`;
            const response = await axios.get(targetUrl, { 
                headers: { 'x-api-key': apiKeyCuki },
                responseType: 'arraybuffer' 
            });
            res.setHeader('Content-Type', 'image/jpeg');
            return res.status(200).send(response.data);
        } else {
            return res.status(404).json({ error: `Endpoint '${type}' tidak ada` });
        }
      }
     
     else if (kategori === 'stalker') {
    // Trik target Anda yang cerdas tadi taruh di sini
    const target = q || user || username;

    if (!target) return res.status(400).json({ status: false, message: "Parameter username/target wajib diisi!" });

   const validTypes = ['pinterest', 'twitter', 'github', 'youtube', 'threads'];

        if (validTypes.includes(type)) {
            // Menyesuaikan nama parameter (q, user, username) sesuai permintaan server Siputzx
            let paramName = 'q';
            if (type === 'twitter' || type === 'github') paramName = 'user';
            if (type === 'youtube') paramName = 'username';

            // Membangun URL target secara dinamis
            const targetUrl = `https://api.siputzx.my.id/api/stalk/${type}?${paramName}=${encodeURIComponent(target)}`;
            
            // Eksekusi penarikan data
            const response = await axios.get(targetUrl);
            
            // --- TRIK SAPU BERSIH WATERMARK ---
            let cleanData = response.data.data || response.data;
            
            // Kita pastikan formatnya adalah objek sebelum menghapus datanya
            if (cleanData && typeof cleanData === 'object') {
                delete cleanData.creator;
                delete cleanData.status;
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
            });
        } else {
            return res.status(400).json({ status: false, message: `Type stalker '${type}' tidak valid` });
        }
}

    // ==========================================
    // 5. KATEGORI: DOWNLOADER
    // ==========================================
    else if (kategori === 'downloader') {
        // Validasi awal: Semua fitur downloader butuh URL
        if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi untuk kategori Downloader!" });

      const siputzxTypes = [
            'twitter', 'douyin', 'fastdl', 'github', 
            'tiktok', 'gdrive', 'snackvideo', 
            'savefrom', 'ummy', 'capcut'
        ];

        if (siputzxTypes.includes(type)) {
            const targetUrl = `https://api.siputzx.my.id/api/d/${type}?url=${encodeURIComponent(url)}`;
            const response = await axios.get(targetUrl);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- TIKTOK V2 (Endpoint Khusus Siputzx) ---
        else if (type === 'tiktok_v2') {
            const response = await axios.get(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- SPOTIFY DOWNLOADER ---
        else if (type === 'spotify') {
            const response = await axios.get(`https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- FACEBOOK (FDOWN) - AMAN DARI WATERMARK ---
        else if (type === 'fb') {
            const { data } = await axios.get('https://fdown.net');
            const $ = cheerio.load(data);
            const tokens = { v: $('input[name="token_v"]').val(), c: $('input[name="token_c"]').val(), h: $('input[name="token_h"]').val() };
            const postData = new URLSearchParams({ 'URLz': url, 'token_v': tokens.v, 'token_c': tokens.c, 'token_h': tokens.h });
            const resDl = await axios.post('https://fdown.net/download.php', postData.toString());
            const $$ = cheerio.load(resDl.data);
            return res.json({ status: true, creator: "InuuTyzDev", result: { sd: $$('#sdlink').attr('href'), hd: $$('#hdlink').attr('href') }});
        } 
        // --- INSTAGRAM (DOWNLOADGRAM) - AMAN DARI WATERMARK ---
        else if (type === 'ig') {
            const data = new URLSearchParams({ url, v: '3', lang: 'en' });
            const response = await axios.post('https://api.downloadgram.org/media', data.toString());
            const $ = cheerio.load(response.data);
            let result = {};
            if ($('video').length) {
                result.type = 'video';
                result.url = $('video source').attr('src');
                result.download_url = $('a[download]').attr('href');
                result.thumbnail = $('video').attr('poster');
            } else if ($('img').length) {
                result.type = 'image';
                result.url = $('img').attr('src');
                result.download_url = $('a[download]').attr('href');
            } else {
                throw new Error("Media tidak ditemukan.");
            }
            return res.json({ status: true, creator: "InuuTyzDev", result });
        }
        // --- MEDIAFIRE - AMAN DARI WATERMARK ---
        else if (type === 'mediafire') {
            const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }});
            const $ = cheerio.load(data);
            const downloadLink = $('#downloadButton').attr('href');
            if (!downloadLink) throw new Error('Gagal menemukan link download.');
            return res.json({ status: true, creator: "InuuTyzDev", result: { dl: downloadLink }});
        }
        // --- ERROR HANDLING ---
        else {
            return res.status(400).json({ status: false, message: `Type downloader '${type}' tidak valid` });
        }
    }
    // ==========================================
// 6. KATEGORI: SEARCH
// ==========================================
else if (kategori === 'search') {
    // Masukkan trik penyatuan variabel keyword Anda di sini
    const keyword = q || query || hero;

    if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci pencarian wajib diisi!" });

    if (type === 'spotify') {
            const response = await axios.get(`https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(keyword)}`);
            
            // TRIK SAPU BERSIH: Menghilangkan watermark dari API target
            const cleanData = response.data;
            delete cleanData.creator; // Melenyapkan "YP INC."
            delete cleanData.status;  // Melenyapkan status ganda

            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- GSM ARENA SEARCH ---
        else if (type === 'gsm') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/gsm?query=${encodeURIComponent(keyword)}`);
            const cleanData = response.data;
            delete cleanData.creator;
            delete cleanData.status;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- MLBB HERO DETAIL ---
        else if (type === 'mlbb') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/mlbbdetail?hero=${encodeURIComponent(keyword)}`);
            const cleanData = response.data;
            delete cleanData.creator;
            delete cleanData.status;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- APP SEARCH ---
        else if (type === 'appsearch') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/appsearch?query=${encodeURIComponent(keyword)}`);
            const cleanData = response.data;
            delete cleanData.creator;
            delete cleanData.status;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- LAZADA SEARCH ---
        else if (type === 'lazada') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/lazada?query=${encodeURIComponent(keyword)}`);
            const cleanData = response.data;
            delete cleanData.creator;
            delete cleanData.status;
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
        }
        // --- PINTEREST (Placeholder) ---
        else if (type === 'pinterest') {
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari pinterest: ${keyword}` });
        } 
        // --- TIKTOK SEARCH (Placeholder) ---
        else if (type === 'tiktok') {
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari tiktok: ${keyword}` });
        } 
        // --- YOUTUBE SEARCH (Placeholder) ---
        else if (type === 'yts') {
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari youtube: ${keyword}` });
        } 
        // --- ERROR HANDLING ---
        else {
            return res.status(400).json({ status: false, message: `Type search '${type}' tidak valid` });
        }
}

    // ==========================================
    // 7. KATEGORI: INFO
    // ==========================================
    else if (kategori === 'info') {
        
        if (type === 'bmkg') {
            const response = await axios.get(`https://api.siputzx.my.id/api/info/bmkg`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
            });
        }
        // --- 2. INFO CUACA DAERAH ---
        else if (type === 'cuaca') {
            if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama lokasi) wajib diisi! (contoh: pasiran jaya)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(q)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
            });
        }
        // --- 3. JADWAL ACARA TV ---
        else if (type === 'jadwaltv') {
            if (!channel) return res.status(400).json({ status: false, message: "Parameter 'channel' wajib diisi! (contoh: gtv, rcti, antv)" });
            
            const response = await axios.get(`https://api.siputzx.my.id/api/info/jadwaltv?channel=${encodeURIComponent(channel)}`);
            
            // --- TRIK SAPU BERSIH ---
            let cleanData = response.data.data || response.data;
            if (cleanData && typeof cleanData === 'object') { 
                delete cleanData.creator; 
                delete cleanData.status; 
            }
            
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: cleanData 
            });
        }
        else {
            return res.status(404).json({ status: false, message: `Endpoint info '${type}' tidak ditemukan!` });
        }
    }
    // ==========================================
    // 8. KATEGORI: GENERATOR
    // ==========================================
    else if (kategori === 'generator') {
        
        // --- 1. QR CODE ---
          if (type === 'qr') {
            const text = req.query.text || 'https://api.inuutyz.web.id';
            // Gunakan parseColor di sini
            const color = parseColor(req.query.color, '00f3ff'); 
            const bg = parseColor(req.query.bg, '0b0b0b');

            const qr = new QRCode({ 
                content: text, 
                padding: 4, 
                width: 256, 
                height: 256, 
                color: `#${color}`, 
                background: `#${bg}`, 
                join: true 
            });

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400'); 
            return res.status(200).send(qr.svg());
        }
        
        // ==========================================
        // 2. CAPTCHA GENERATOR (JSON + Base64 SVG / Direct Image)
        // ==========================================
        else if (type === 'captcha') {
            const diff = req.query.difficulty || 'medium';
            const color = parseColor(req.query.color, '8a2be2'); 
            
            let max = diff === 'hard' ? 100 : diff === 'easy' ? 10 : 50;
            let num1 = Math.floor(Math.random() * max) + 1;
            let num2 = Math.floor(Math.random() * max) + 1;
            let answer = num1 + num2;

            let noise = '';
            for(let i = 0; i < 7; i++){
                noise += `<line x1="${Math.random() * 200}" y1="${Math.random() * 80}" x2="${Math.random() * 200}" y2="${Math.random() * 80}" stroke="#${color}" stroke-width="2" opacity="0.6"/>`;
            }

            const rawSvg = `
            <svg width="200" height="80" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="80" fill="#14141E" rx="8"/>
                ${noise}
                <text x="50%" y="50" font-family="Courier, monospace" font-size="32" font-weight="900" fill="#ffffff" text-anchor="middle" transform="rotate(${Math.random() * 14 - 7}, 100, 40)">
                    ${num1} + ${num2}
                </text>
            </svg>`;

            if (req.query.view === 'image') {
                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'no-cache');
                return res.status(200).send(rawSvg);
            }

            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: { 
                    answer: answer.toString(),
                    svg_base64: `data:image/svg+xml;base64,${Buffer.from(rawSvg).toString('base64')}`,
                    svg_raw: rawSvg
                } 
            });
        }

        // ==========================================
        // 3. IDENTICON / AVATAR GENERATOR (SVG)
        // ==========================================
        else if (type === 'avatar') {
            const seed = req.query.seed || 'InuuTyzDev';
            const color = parseColor(req.query.color, '00f3ff');
            
            const hash = crypto.createHash('md5').update(seed).digest('hex');
            
            let rects = '';
            for(let i = 0; i < 15; i++) {
                const isSolid = parseInt(hash[i], 16) % 2 === 0;
                if(isSolid) {
                    const col = i % 3;
                    const row = Math.floor(i / 3);
                    rects += `<rect x="${col * 20}" y="${row * 20}" width="20" height="20" fill="#${color}"/>`;
                    if(col !== 2) { 
                        rects += `<rect x="${(4 - col) * 20}" y="${row * 20}" width="20" height="20" fill="#${color}"/>`;
                    }
                }
            }

            const svg = `
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="#1a1a2e"/>
                ${rects}
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.status(200).send(svg);
        }

        // ==========================================
        // 4. LICENSE KEY GENERATOR (JSON)
        // ==========================================
        else if (type === 'license') {
            const format = req.query.format || 'XXXX-XXXX-XXXX-XXXX';
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let key = '';
            
            for(let i = 0; i < format.length; i++) {
                if(format[i] === 'X' || format[i] === 'x') {
                    key += chars.charAt(Math.floor(Math.random() * chars.length));
                } else {
                    key += format[i];
                }
            }

            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: { format_request: format, license_key: key } 
            });
        }

        // ==========================================
        // 5. CYBERPUNK STAT BAR GENERATOR (SVG)
        // ==========================================
        else if (type === 'statbar') {
            const label = req.query.label || 'API HEALTH';
            const value = Math.min(Math.max(parseInt(req.query.value) || 100, 0), 100); 
            const color = parseColor(req.query.color, '8a2be2'); 
            const bg = parseColor(req.query.bg, '111111');

            const svg = `
            <svg width="350" height="40" xmlns="http://www.w3.org/2000/svg">
                <rect width="350" height="40" fill="#${bg}" rx="6" stroke="#333" stroke-width="1"/>
                <rect x="5" y="5" width="${(value / 100) * 340}" height="30" fill="#${color}" rx="4" opacity="0.85"/>
                <text x="15" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" letter-spacing="1">${label.toUpperCase()}</text>
                <text x="335" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" text-anchor="end">${value}%</text>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'no-cache');
            return res.status(200).send(svg);
        }  

        // ==========================================
        // 6. PLACEHOLDER IMAGE GENERATOR (SVG)
        // ==========================================
        else if (type === 'placeholder') {
            const w = parseInt(req.query.w) || 300;
            const h = parseInt(req.query.h) || 300;
            const bg = parseColor(req.query.bg, '1a1a2e');
            const color = parseColor(req.query.color, '8a2be2');
            const text = req.query.text || `${w} x ${h}`;

            const fontSize = Math.max(12, Math.min(w, h) / 8);

            const svg = `
            <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
                <rect width="${w}" height="${h}" fill="#${bg}"/>
                <text x="50%" y="50%" fill="#${color}" font-family="Orbitron, Arial, sans-serif" font-size="${fontSize}" font-weight="bold" dominant-baseline="middle" text-anchor="middle">
                    ${text}
                </text>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.status(200).send(svg);
        }

        // ==========================================
        // 7. AESTHETIC WAVE BACKGROUND (SVG)
        // ==========================================
        else if (type === 'wave') {
            const color1 = parseColor(req.query.color1, '8a2be2'); 
            const color2 = parseColor(req.query.color2, '00f3ff'); 
            const bg = parseColor(req.query.bg, '050505');

            const svg = `
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#${color1}" />
                        <stop offset="100%" stop-color="#${color2}" />
                    </linearGradient>
                </defs>
                <rect width="1440" height="320" fill="#${bg}"/>
                <path fill="url(#waveGrad)" fill-opacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,80C960,64,1056,96,1152,112C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return res.status(200).send(svg);
        }

        // ==========================================
        // 8. SECURE TOKEN / PASSWORD GENERATOR
        // ==========================================
        else if (type === 'token') {
            const length = parseInt(req.query.length) || 16;
            const useSymbols = req.query.symbols === 'true'; 

            const safeLength = Math.min(length, 256); 

            let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            if (useSymbols) {
                chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
            }

            let token = '';
            for (let i = 0; i < safeLength; i++) {
                token += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: { length: safeLength, includes_symbols: useSymbols, token: token } 
            });
        }
        else {
            return res.status(404).json({ status: false, message: `Type generator '${type}' tidak ditemukan!` });
        }
    }

    // ==========================================
    // JIKA KATEGORI TIDAK DIKENAL
    // ==========================================
    else {
            return res.status(404).json({ status: false, message: `Kategori '${kategori}' tidak ditemukan!` });
        }

    } catch (e) {
        // 3. JIKA ADA ERROR AXIOS, TANGKAP DI SINI BIAR VERCEL GAK CRASH
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Terjadi kesalahan sistem: " + e.message });
    }
}
