// Import semua library yang dibutuhkan di sini (axios, cheerio, dll)
import axios from 'axios';
import * as cheerio from 'cheerio';
import crypto from 'crypto';
import QRCode from 'qrcode-svg';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const entertainmentData = require('../../database/entertainment.json');
const animeData = require('../../database/anime.json'); // Sesuaikan path-nya


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
    if (colorDictionary[cleanInput]) {
        return colorDictionary[cleanInput];
    }
    return cleanInput.replace('#', '');
}


export default async function handler(req, res) {
    // FIX #1: Tambah variabel yang hilang: searchText, page, language
    const {
        kategori, type, q, text, color, bg, color1, color2,
        difficulty, view, seed, format, label, value, w, h,
        length, symbols, cookie, promptSystem, prompt, system,
        temperature, provinsi, kota, nik, nama, ttl, jenis_kelamin,
        golongan_darah, alamat, kecamatan, agama, status, pekerjaan,
        kewarganegaraan, masa_berlaku, terbuat, pas_photo, image,
        text1, text2, text3, name, comment, ppurl, number, title,
        time, avatarUrl, device, domain, query, country, url, user,
        username, hero, channel, surah, ayat,
        searchText,  // FIX: tambah ini
        page,        // FIX: tambah ini
        language     // FIX: tambah ini
    } = req.query;

    const apiKeyCuki = "cuki-x";

    // FIX #2: Semua blok else if kategori masuk ke dalam try utama
    try {
        // ==========================================
        // 1. KATEGORI: AI
        // ==========================================
        if (kategori === 'ai') {

            const standardAI = ['deepseekr1', 'qwq32b', 'phi2', 'glm47flash', 'gptoss120b'];

            if (standardAI.includes(type)) {
                if (!prompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

                let targetUrl = `https://api.siputzx.my.id/api/ai/${type}?prompt=${encodeURIComponent(prompt)}`;
                if (system) targetUrl += `&system=${encodeURIComponent(system)}`;
                if (temperature) targetUrl += `&temperature=${temperature}`;

                const response = await axios.get(targetUrl);

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

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'gemini') {
                if (!text) return res.status(400).json({ status: false, message: "Parameter 'text' wajib diisi!" });

                let targetUrl = `https://api.siputzx.my.id/api/ai/gemini?text=${encodeURIComponent(text)}`;
                if (cookie) targetUrl += `&cookie=${encodeURIComponent(cookie)}`;
                if (promptSystem) targetUrl += `&promptSystem=${encodeURIComponent(promptSystem)}`;

                const response = await axios.get(targetUrl);

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
        else if (kategori === 'maker') {
            if (type === 'ektp') {
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
            }

            else {
                return res.status(404).json({ error: `Endpoint '${type}' tidak ada` });
            }
        }

        // ==========================================
        // 3. KATEGORI: STALKER
        // ==========================================
        else if (kategori === 'stalker') {
            const target = q || user || username;

            if (!target) return res.status(400).json({ status: false, message: "Parameter username/target wajib diisi!" });

            const pixxxryTypes = ['tiktok', 'replit', 'steam', 'reddit', 'youtube', 'twitter', 'threads', 'npm', 'roblox'];
            const siputzxTypes = ['pinterest', 'github'];

            if (pixxxryTypes.includes(type)) {
                try {
                    let paramName = (type === 'youtube') ? 'q' : 'username';
                    const targetUrl = `https://api.pixxxry.eu.cc/stalk/${type}?${paramName}=${encodeURIComponent(target)}`;

                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: `Gagal stalk ${type}: ` + e.message });
                }
            }

            else if (siputzxTypes.includes(type)) {
                try {
                    let paramName = (type === 'pinterest') ? 'q' : 'user';
                    const targetUrl = `https://api.siputzx.my.id/api/stalk/${type}?${paramName}=${encodeURIComponent(target)}`;

                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: `Gagal stalk ${type}: ` + e.message });
                }
            }

            else {
                return res.status(400).json({ status: false, message: `Type stalker '${type}' tidak valid atau belum didukung` });
            }
        }

        // ==========================================
        // 4. KATEGORI: DOWNLOADER
        // ==========================================
        else if (kategori === 'download') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi untuk kategori Downloader!" });

            const siputzxTypes = [
                'twitter', 'douyin', 'fastdl', 'github',
                'tiktok', 'gdrive', 'savefrom', 'ummy', 'capcut'
            ];

            if (siputzxTypes.includes(type)) {
                const targetUrl = `https://api.siputzx.my.id/api/d/${type}?url=${encodeURIComponent(url)}`;
                const response = await axios.get(targetUrl);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'tiktok_v2') {
                const response = await axios.get(`https://api.siputzx.my.id/api/d/tiktok/v2?url=${encodeURIComponent(url)}`);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'spotify') {
                const response = await axios.get(`https://api.yupra.my.id/api/downloader/spotify?url=${encodeURIComponent(url)}`);

                let cleanData = response.data.data || response.data;
                if (cleanData && typeof cleanData === 'object') {
                    delete cleanData.creator;
                    delete cleanData.status;
                }

                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'fb') {
                const { data } = await axios.get('https://fdown.net');
                const $ = cheerio.load(data);
                const tokens = { v: $('input[name="token_v"]').val(), c: $('input[name="token_c"]').val(), h: $('input[name="token_h"]').val() };
                const postData = new URLSearchParams({ 'URLz': url, 'token_v': tokens.v, 'token_c': tokens.c, 'token_h': tokens.h });
                const resDl = await axios.post('https://fdown.net/download.php', postData.toString());
                const $$ = cheerio.load(resDl.data);
                return res.json({ status: true, creator: "InuuTyzDev", result: { sd: $$('#sdlink').attr('href'), hd: $$('#hdlink').attr('href') } });
            }

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

            else if (type === 'mediafire') {
                const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
                const $ = cheerio.load(data);
                const downloadLink = $('#downloadButton').attr('href');
                if (!downloadLink) throw new Error('Gagal menemukan link download.');
                return res.json({ status: true, creator: "InuuTyzDev", result: { dl: downloadLink } });
            }

            else if (type === 'snackvideo') {
                try {
                    const response = await axios.get(`https://api.tiklydown.eu.org/api/download/snack?url=${encodeURIComponent(url)}`);
                    const data = response.data;

                    if (!data || data.status !== 200) {
                        return res.status(404).json({
                            status: false,
                            creator: "InuuTyzDev",
                            message: "Video tidak ditemukan, pastikan link SnackVideo valid!"
                        });
                    }

                    const cleanData = {
                        title: data.result.title || "No Title",
                        thumbnail: data.result.thumbnail,
                        url: data.result.video || data.result.url,
                        author: data.result.author?.name || "Unknown"
                    };

                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: cleanData
                    });
                } catch (error) {
                    return res.status(500).json({
                        status: false,
                        creator: "InuuTyzDev",
                        message: "Gagal mengambil data: " + error.message
                    });
                }
            }

            else {
                return res.status(400).json({ status: false, message: `Type downloader '${type}' tidak valid` });
            }
        }

        // ==========================================
        // 5. KATEGORI: SEARCH
        // ==========================================
        else if (kategori === 'search') {
            const keyword = q || query || hero;

            if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci pencarian wajib diisi!" });

            if (type === 'spotify') {
                const response = await axios.get(`https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'lyrics') {
                const response = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(keyword)}`);
                const data = response.data;
                if (!data || data.length === 0) return res.status(404).json({ status: false, creator: "InuuTyzDev", message: "Lirik tidak ditemukan!" });

                const lagu = data[0];
                const cleanData = {
                    judul: lagu.trackName,
                    penyanyi: lagu.artistName,
                    album: lagu.albumName,
                    durasi: lagu.duration,
                    lirik: lagu.plainLyrics,
                    lirik_sinkron: lagu.syncedLyrics
                };
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'gsm') {
                const response = await axios.get(`https://www.neoapis.xyz/api/search/gsm?query=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'mlbb') {
                const response = await axios.get(`https://www.neoapis.xyz/api/search/mlbbdetail?hero=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'appsearch') {
                const response = await axios.get(`https://www.neoapis.xyz/api/search/appsearch?query=${encodeURIComponent(keyword)}`);
                const cleanData = response.data;
                delete cleanData.creator;
                delete cleanData.status;
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
            }

            else if (type === 'wikipedia') {
                const response = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(keyword)}`);
                return res.status(200).json({
                    status: true,
                    creator: "InuuTyzDev",
                    result: {
                        judul: response.data.title,
                        deskripsi: response.data.extract,
                        thumbnail: response.data.thumbnail ? response.data.thumbnail.source : null
                    }
                });
            }

            else if (type === 'dictionary') {
                const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
            }

            else if (type === 'country') {
                const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data[0] });
            }

            else if (type === 'npm') {
                const response = await axios.get(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.objects });
            }

            else if (type === 'univ') {
                const response = await axios.get(`http://universities.hipolabs.com/search?name=${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
            }

            else if (type === 'nik') {
                if (keyword.length !== 16) return res.status(400).json({ status: false, message: "NIK harus 16 digit!" });
                const data = {
                    provinsi: keyword.substring(0, 2),
                    kota: keyword.substring(2, 4),
                    kecamatan: keyword.substring(4, 6),
                    tgl_lahir: keyword.substring(6, 8),
                    bln_lahir: keyword.substring(8, 10),
                    thn_lahir: keyword.substring(10, 12),
                    unique_code: keyword.substring(12, 16)
                };
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: data });
            }

            else if (type === 'books') {
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}`);
                return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.items });
            }

            else {
                return res.status(400).json({ status: false, message: `Type search '${type}' tidak valid` });
            }
        }

        // ==========================================
        // 6. KATEGORI: INFO
        // ==========================================
        else if (kategori === 'info') {
            const keyword = q || query || searchText;

            try {
                if (type === 'bmkg') {
                    const response = await axios.get(`https://api.siputzx.my.id/api/info/bmkg`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                }

                else if (type === 'cuaca') {
                    if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci lokasi wajib diisi!" });
                    const response = await axios.get(`https://api.siputzx.my.id/api/info/cuaca?q=${encodeURIComponent(keyword)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                }

                else if (type === 'jadwaltv') {
                    const tvChannel = channel || keyword;
                    if (!tvChannel) return res.status(400).json({ status: false, message: "Nama channel TV wajib diisi! (gtv, rcti, antv, dll)" });

                    const response = await axios.get(`https://api.siputzx.my.id/api/info/jadwaltv?channel=${encodeURIComponent(tvChannel)}`);
                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                }

                else if (type === 'wikipedia') {
                    if (!keyword) return res.status(400).json({ status: false, message: "Apa yang ingin dicari di Wikipedia?" });
                    const searchRes = await axios.get(`https://id.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(keyword)}`);
                    const pageId = searchRes.data.query.search[0]?.pageid;
                    if (!pageId) return res.status(404).json({ status: false, message: "Artikel tidak ditemukan." });

                    const detailRes = await axios.get(`https://id.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&pageids=${pageId}`);
                    const result = detailRes.data.query.pages[pageId];
                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: { title: result.title, extract: result.extract, wiki_url: `https://id.wikipedia.org/?curid=${pageId}` }
                    });
                }

                else if (type === 'kbbi') {
                    if (!keyword) return res.status(400).json({ status: false, message: "Masukkan kata yang ingin dicari artinya!" });
                    const response = await axios.get(`https://kbbi-api-zhirrr.vercel.app/api/kbbi?text=${encodeURIComponent(keyword)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
                }

                else if (type === 'gempa') {
                    const response = await axios.get(`https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json`);
                    const gempa = response.data.Infogempa.gempa;
                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: {
                            waktu: `${gempa.Tanggal} | ${gempa.Jam}`,
                            magnitudo: gempa.Magnitude,
                            kedalaman: gempa.Kedalaman,
                            wilayah: gempa.Wilayah,
                            potensi: gempa.Potensi,
                            map: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`
                        }
                    });
                }

                else {
                    return res.status(404).json({ status: false, message: `Endpoint '${type}' tidak tersedia di kategori info.` });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Terjadi kesalahan pada server penyedia data." });
            }
        }

        // ==========================================
        // 7. KATEGORI: GENERATOR
        // ==========================================
        else if (kategori === 'generator') {

            if (type === 'qr') {
                const isiQR = text || q || 'https://api.inuutyz.web.id';
                const warnaQR = parseColor(color, '00f3ff');
                const backgroundQR = parseColor(bg, '0b0b0b');

                const qr = new QRCode({
                    content: isiQR,
                    padding: 4,
                    width: 256,
                    height: 256,
                    color: `#${warnaQR}`,
                    background: `#${backgroundQR}`,
                    join: true
                });

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                return res.status(200).send(qr.svg());
            }

            else if (type === 'captcha') {
                const diff = req.query.difficulty || 'medium';
                const colorCaptcha = parseColor(req.query.color, '8a2be2');

                let max = diff === 'hard' ? 100 : diff === 'easy' ? 10 : 50;
                let num1 = Math.floor(Math.random() * max) + 1;
                let num2 = Math.floor(Math.random() * max) + 1;
                let answer = num1 + num2;

                let noise = '';
                for (let i = 0; i < 7; i++) {
                    noise += `<line x1="${Math.random() * 200}" y1="${Math.random() * 80}" x2="${Math.random() * 200}" y2="${Math.random() * 80}" stroke="#${colorCaptcha}" stroke-width="2" opacity="0.6"/>`;
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

            else if (type === 'avatar') {
                const seedVal = req.query.seed || 'InuuTyzDev';
                const colorAvatar = parseColor(req.query.color, '00f3ff');

                const hash = crypto.createHash('md5').update(seedVal).digest('hex');

                let rects = '';
                for (let i = 0; i < 15; i++) {
                    const isSolid = parseInt(hash[i], 16) % 2 === 0;
                    if (isSolid) {
                        const col = i % 3;
                        const row = Math.floor(i / 3);
                        rects += `<rect x="${col * 20}" y="${row * 20}" width="20" height="20" fill="#${colorAvatar}"/>`;
                        if (col !== 2) {
                            rects += `<rect x="${(4 - col) * 20}" y="${row * 20}" width="20" height="20" fill="#${colorAvatar}"/>`;
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

            else if (type === 'license') {
                const fmt = req.query.format || 'XXXX-XXXX-XXXX-XXXX';
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

                let key = '';
                for (let i = 0; i < fmt.length; i++) {
                    if (fmt[i] === 'X' || fmt[i] === 'x') {
                        key += chars.charAt(Math.floor(Math.random() * chars.length));
                    } else {
                        key += fmt[i];
                    }
                }

                return res.status(200).json({
                    status: true,
                    creator: "InuuTyzDev",
                    result: { format_request: fmt, license_key: key }
                });
            }

            else if (type === 'statbar') {
                const labelVal = req.query.label || 'API HEALTH';
                const valueVal = Math.min(Math.max(parseInt(req.query.value) || 100, 0), 100);
                const colorBar = parseColor(req.query.color, '8a2be2');
                const bgBar = parseColor(req.query.bg, '111111');

                const svg = `
                <svg width="350" height="40" xmlns="http://www.w3.org/2000/svg">
                    <rect width="350" height="40" fill="#${bgBar}" rx="6" stroke="#333" stroke-width="1"/>
                    <rect x="5" y="5" width="${(valueVal / 100) * 340}" height="30" fill="#${colorBar}" rx="4" opacity="0.85"/>
                    <text x="15" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" letter-spacing="1">${labelVal.toUpperCase()}</text>
                    <text x="335" y="25" fill="#ffffff" font-family="Orbitron, Courier, sans-serif" font-size="14" font-weight="900" text-anchor="end">${valueVal}%</text>
                </svg>`;

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'no-cache');
                return res.status(200).send(svg);
            }

            else if (type === 'placeholder') {
                const wVal = parseInt(req.query.w) || 300;
                const hVal = parseInt(req.query.h) || 300;
                const bgPh = parseColor(req.query.bg, '1a1a2e');
                const colorPh = parseColor(req.query.color, '8a2be2');
                const textPh = req.query.text || `${wVal} x ${hVal}`;
                const fontSize = Math.max(12, Math.min(wVal, hVal) / 8);

                const svg = `
                <svg width="${wVal}" height="${hVal}" viewBox="0 0 ${wVal} ${hVal}" xmlns="http://www.w3.org/2000/svg">
                    <rect width="${wVal}" height="${hVal}" fill="#${bgPh}"/>
                    <text x="50%" y="50%" fill="#${colorPh}" font-family="Orbitron, Arial, sans-serif" font-size="${fontSize}" font-weight="bold" dominant-baseline="middle" text-anchor="middle">
                        ${textPh}
                    </text>
                </svg>`;

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'public, max-age=31536000');
                return res.status(200).send(svg);
            }

            else if (type === 'wave') {
                const c1 = parseColor(req.query.color1, '8a2be2');
                const c2 = parseColor(req.query.color2, '00f3ff');
                const bgWave = parseColor(req.query.bg, '050505');

                const svg = `
                <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#${c1}" />
                            <stop offset="100%" stop-color="#${c2}" />
                        </linearGradient>
                    </defs>
                    <rect width="1440" height="320" fill="#${bgWave}"/>
                    <path fill="url(#waveGrad)" fill-opacity="1" d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,80C960,64,1056,96,1152,112C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>`;

                res.setHeader('Content-Type', 'image/svg+xml');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                return res.status(200).send(svg);
            }

            else if (type === 'token') {
                const lenVal = parseInt(req.query.length) || 16;
                const useSymbols = req.query.symbols === 'true';
                const safeLength = Math.min(lenVal, 256);

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
        // 8. KATEGORI: STICKER
        // ==========================================
        else if (kategori === 'sticker') {
            const keyword = q || query;

            const axiosConfig = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
                },
                timeout: 30000
            };

            if (type === 'stickerly') {
                if (!keyword) return res.status(400).json({ status: false, message: "Query (q) wajib diisi!" });

                try {
                    const searchUrl = `https://sticker.ly/api/search/pack?keyword=${encodeURIComponent(keyword)}&size=20`;
                    const response = await axios.get(searchUrl, axiosConfig);

                    const packs = response.data.result?.stickerPackList || [];
                    const result = packs.map(pack => ({
                        name: pack.name,
                        author: pack.authorName,
                        trayImage: pack.trayImageUri,
                        stickers: pack.stickers.map(s => s.stickerUri)
                    }));

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: result });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal scraping Stickerly secara mandiri." });
                }
            }

            else if (type === 'emojimix') {
                const { emoji1, emoji2 } = req.query;
                if (!emoji1 || !emoji2) return res.status(400).json({ status: false, message: "Kirim emoji1 dan emoji2!" });

                try {
                    const targetUrl = `https://api.vany.my.id/api/maker/emojimix?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;
                    const response = await axios.get(targetUrl, { ...axiosConfig, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal membuat emojimix." });
                }
            }

            else if (type === 'qc') {
                if (!text || !name) return res.status(400).json({ status: false, message: "Teks dan Nama wajib!" });
                try {
                    const avatar = avatarUrl || "https://i.pravatar.cc/300";
                    const colorQc = bg ? (bg.startsWith('#') ? bg : `#${bg}`) : "#1f2c33";

                    const targetUrl = `https://api.paxsenix.biz.id/api/maker/qc?text=${encodeURIComponent(text)}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(avatar)}&hex=${encodeURIComponent(colorQc)}`;
                    const response = await axios.get(targetUrl, { ...axiosConfig, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal memproses QC." });
                }
            }

            else if (type === 'brat') {
                if (!text) return res.status(400).json({ status: false, message: "Teks wajib!" });
                try {
                    const targetUrl = `https://api.paxsenix.biz.id/api/maker/brat?text=${encodeURIComponent(text)}`;
                    const response = await axios.get(targetUrl, { ...axiosConfig, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal membuat Brat." });
                }
            }

            else {
                return res.status(404).json({ status: false, message: `Type sticker '${type}' tidak ditemukan!` });
            }
        }

        // ==========================================
        // 9. KATEGORI: EPHOTO
        // ==========================================
        else if (kategori === 'ephoto') {
            const textInput = q || text || query;

            const listEffect = [
                '1917style', 'advancedglow', 'blackpinklogo', 'blackpinkstyle', 'cartoonstyle',
                'deletingtext', 'dragonball', 'effectclouds', 'flag3dtext', 'flagtext',
                'freecreate', 'galaxy', 'galaxywallpaper', 'glitchtext', 'glowingtext',
                'gradienttext', 'lighteffects', 'logomaker', 'luxurygold', 'makingneon',
                'neonglitch', 'papercutstyle', 'pixelglitch', 'royaltext', 'sandsummer',
                'summerbeach', 'typographytext', 'underwatertext', 'watercolortext', 'writetext'
            ];

            if (!textInput) return res.status(400).json({ status: false, message: "Parameter teks wajib diisi!" });

            if (listEffect.includes(type)) {
                try {
                    const targetUrl = `https://api.cuki.biz.id/api/ephoto/${type}?apikey=${apiKeyCuki}&query=${encodeURIComponent(textInput)}`;

                    const response = await axios.get(targetUrl, {
                        headers: { 'x-api-key': apiKeyCuki },
                        responseType: 'arraybuffer'
                    });

                    res.setHeader('Content-Type', 'image/jpeg');
                    res.setHeader('Cache-Control', 'public, max-age=86400');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal memproses gambar: " + e.message });
                }
            } else {
                return res.status(404).json({ status: false, message: `Efek '${type}' tidak ditemukan.` });
            }
        }

        // ==========================================
        // 10. KATEGORI: KOMIK
        // ==========================================
        else if (kategori === 'komik') {

            if (type === 'search') {
                const keyword = q || query || text;
                if (!keyword) return res.status(400).json({ status: false, message: "Parameter 'query' (judul komik) wajib diisi!" });

                try {
                    const targetUrl = `https://api.cuki.biz.id/api/komik/komikindo-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}`;
                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal mencari komik: " + e.message });
                }
            }

            else if (type === 'detail') {
                if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' komik wajib diisi!" });

                try {
                    const targetUrl = `https://api.cuki.biz.id/api/komik/komikindo-detail?apikey=${apiKeyCuki}&url=${encodeURIComponent(url)}`;
                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal mengambil detail komik: " + e.message });
                }
            }

            else if (type === 'chapter') {
                if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' chapter wajib diisi!" });

                try {
                    const targetUrl = `https://api.cuki.biz.id/api/komik/komikindo-chapter?apikey=${apiKeyCuki}&url=${encodeURIComponent(url)}`;
                    const response = await axios.get(targetUrl);

                    let cleanData = response.data.data || response.data;
                    if (cleanData && typeof cleanData === 'object') {
                        delete cleanData.creator;
                        delete cleanData.status;
                    }

                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });
                } catch (e) {
                    return res.status(500).json({ status: false, message: "Gagal mengambil isi chapter: " + e.message });
                }
            }

            else {
                return res.status(404).json({ status: false, message: `Type komik '${type}' tidak ditemukan!` });
            }
        }

        // ==========================================
        // 11. KATEGORI: MEME
        // ==========================================
        else if (kategori === 'meme') {
            const listMeme = [
                'dogecheems', 'hotline', 'jarvis', 'majulu',
                'pelajaran', 'pilihan', 'squidwindow', 'twobuttons'
            ];

            if (listMeme.includes(type)) {
                if (!text1 && !text) {
                    return res.status(400).json({ status: false, message: "Minimal parameter 'text1' atau 'text' wajib diisi!" });
                }

                try {
                    let targetUrl = `https://api.cuki.biz.id/api/canvas/meme/${type}?apikey=${apiKeyCuki}`;

                    if (text) targetUrl += `&text=${encodeURIComponent(text)}`;
                    if (text1) targetUrl += `&text1=${encodeURIComponent(text1)}`;
                    if (text2) targetUrl += `&text2=${encodeURIComponent(text2)}`;
                    if (text3) targetUrl += `&text3=${encodeURIComponent(text3)}`;

                    const response = await axios.get(targetUrl, {
                        headers: { 'x-api-key': apiKeyCuki },
                        responseType: 'arraybuffer'
                    });

                    res.setHeader('Content-Type', 'image/png');
                    return res.status(200).send(response.data);
                } catch (e) {
                    return res.status(500).json({ status: false, message: `Gagal membuat meme ${type}: ` + e.message });
                }
            } else {
                return res.status(404).json({
                    status: false,
                    message: `Type meme '${type}' tidak ditemukan!`,
                    available_memes: listMeme
                });
            }
        }

        // ==========================================
        // 12. KATEGORI: AI-IMAGE
        // ==========================================
        else if (kategori === 'ai-image') {
            const imageUrl = url || q || query;
            const textPrompt = prompt || q || query;

            const axiosConfigAI = {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 45000
            };

            const directImageTypes = ['torealistic', 'tocinematic', 'tofigure', 'toghibli', 'toanime', 'deepai'];

            if (directImageTypes.includes(type)) {
                if (!imageUrl && !textPrompt) return res.status(400).json({ status: false, message: "Parameter input wajib diisi!" });

                try {
                    const param = directImageTypes.slice(0, 5).includes(type) ? `url=${encodeURIComponent(imageUrl)}` : `prompt=${encodeURIComponent(textPrompt)}`;
                    const targetUrl = `https://www.neoapis.xyz/api/ai-image/${type}?${param}`;

                    const response = await axios.get(targetUrl, { ...axiosConfigAI, responseType: 'arraybuffer' });

                    res.setHeader('Content-Type', 'image/jpeg');
                    return res.status(200).send(response.data);
                } catch (error) {
                    return res.status(500).json({ status: false, message: `Gagal memproses gambar ${type}` });
                }
            }

            else if (type === 'ailabs') {
                if (!textPrompt) return res.status(400).json({ status: false, message: "Parameter 'prompt' wajib diisi!" });

                try {
                    const targetUrl = `https://www.neoapis.xyz/api/ai-image/ailabs?prompt=${encodeURIComponent(textPrompt)}`;
                    const response = await axios.get(targetUrl, axiosConfigAI);
                    const data = response.data;
                    const finalImage = data.result?.url || data.result || data.url;

                    return res.status(200).json({
                        status: true,
                        creator: "InuuTyzDev",
                        result: { image_url: finalImage }
                    });
                } catch (error) {
                    return res.status(500).json({ status: false, message: "Gagal generate JSON ailabs" });
                }
            }

            else {
                return res.status(404).json({ status: false, message: `Type '${type}' tidak ditemukan.` });
            }
        }

        // ==========================================
        // 13. KATEGORI: FUN
        // ==========================================
        else if (kategori === 'fun') {
            const { name: funName, name1, name2, lang } = req.query;
            const inputTeks = text || q || query;

            const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
            const getPersen = () => Math.floor(Math.random() * 101);

            try {
                if (type === 'cekkhodam') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const khodamList = [
                        "Macan Putih", "Naga Sakti", "Genderuwo", "Tuyul Kesasar", "Batu Bata",
                        "Sapu Lidi", "Kuntilanak Merah", "Jin Qorin", "Panci Gosong", "Ular Kobra",
                        "Singa Paddle Pop", "Kipas Angin Cosmos", "Kosong (Tidak ada khodam)",
                        "Knalpot Racing", "Sendal Jepit", "Nyamuk DBD", "Kucing Oyen", "Buaya Darat",
                        "Harimau Sumatera", "Kuntilanak Disko", "Pocong Ngesot", "Kambing Hitam"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, khodam: getRandom(khodamList) } });
                }

                else if (type === 'teskecocokan') {
                    if (!name1 || !name2) return res.status(400).json({ status: false, message: "Parameter 'name1' & 'name2' wajib!" });
                    const persen = getPersen();
                    let pesan = persen > 80 ? "Sangat serasi! Jodoh dunia akhirat." :
                        persen > 50 ? "Lumayan cocok, tapi butuh banyak kompromi." :
                            persen > 20 ? "Banyak rintangan, sering beda pendapat." :
                                "Mending cari yang lain aja deh, agak susah ini mah.";
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama1: name1, nama2: name2, kecocokan: `${persen}%`, pesan } });
                }

                else if (type === 'apakah') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const jawaban = ["Iya", "Tidak", "Bisa jadi", "Mungkin saja", "Tentu saja tidak", "Coba tanya lagi besok", "Sudah pasti!", "Mustahil!", "Yakin 100% iya", "Jangan ngarep deh"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(jawaban) } });
                }

                else if (type === 'kapan') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const waktu = ["Besok", "Lusa", "Bulan depan", "Tahun depan", "5 tahun lagi", "Hari ini juga", "Tidak akan pernah", "Minggu depan", "Nanti sore", "Pas kiamat"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(waktu) } });
                }

                else if (type === 'bisakah') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const jawaban = ["Bisa banget!", "Wah, susah sih itu", "Tergantung amal ibadah", "Mimpi aja dulu", "Pasti bisa kalau usaha", "Mustahil!", "Coba aja sendiri", "Tanya bapakmu gih"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(jawaban) } });
                }

                else if (type === 'bagaimanakah') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const jawaban = ["Sangat buruk", "Biasa aja", "Luar biasa baik!", "Mengerikan...", "Lumayan lah", "Tidak bisa dijelaskan dengan kata-kata", "Bikin geleng-geleng kepala", "Sempurna!"];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { pertanyaan: inputTeks, jawaban: getRandom(jawaban) } });
                }

                else if (['cekganteng', 'cekcantik', 'cekbucin', 'cekstres', 'cekwibu', 'cekpelit', 'cekjomblo'].includes(type)) {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const persen = getPersen();
                    const kategoriNama = type.replace('cek', '');
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, kategori: kategoriNama.toUpperCase(), skor: `${persen}%` } });
                }

                else if (type === 'ceksifat') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const sifatList = [
                        "Suka ngambek tapi penyayang", "Caper tingkat dewa", "Dewasa dan pengertian", "Childish banget",
                        "Sering overthinking", "Santuy abis", "Pemarah tapi cepat reda", "Pendiam tapi asyik",
                        "Suka gibah", "Loyal ke teman", "Cemburuan parah", "Pemaaf banget"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, sifat: getRandom(sifatList) } });
                }

                else if (type === 'pekerjaan') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const kerjaList = [
                        "CEO Perusahaan Top", "Tukang Parkir Indomaret", "Programmer Handal", "Pawang Hujan",
                        "Presiden", "Penjual Seblak", "Atlet E-Sport", "Gamer Rebahan", "Anggota DPR",
                        "Kang Paket", "Youtuber Sukses", "Pengangguran Sukses"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, masa_depan: getRandom(kerjaList) } });
                }

                else if (type === 'jodohku') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const ciriJodoh = [
                        "Orang terdekat yang sering kamu abaikan", "Seseorang dari masa lalumu",
                        "Orang kaya raya dari negara tetangga", "Teman sekelas/sekerjamu sendiri",
                        "Ketemu di jalan pas lagi hujan", "Artis K-Pop terkenal", "Masih dirahasiakan semesta"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, prediksi_jodoh: getRandom(ciriJodoh) } });
                }

                else if (type === 'rate') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const nilai = getPersen();
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { hal_dinilai: inputTeks, nilai: `${nilai}/100` } });
                }

                else if (type === 'faktarandom') {
                    const faktaList = [
                        "Madu tidak akan pernah basi.",
                        "Sapi bisa tidur berdiri, tapi mereka hanya bisa bermimpi jika berbaring.",
                        "Jantung udang terletak di kepalanya.",
                        "Siput bisa tidur selama 3 tahun.",
                        "Sidik jari koala sangat mirip dengan sidik jari manusia.",
                        "Babi tidak bisa melihat ke langit karena bentuk lehernya.",
                        "Kecoa bisa hidup berminggu-minggu tanpa kepala.",
                        "Lidah jerapah panjangnya bisa mencapai 50 cm."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(faktaList) });
                }

                else if (type === 'gombalan') {
                    const gombalList = [
                        "Cita-citaku cuma satu, pengen jadi orang yang selalu ada di hati kamu.",
                        "Kamu tahu bedanya kamu sama Monas? Kalau Monas milik negara, kalau kamu milik aku.",
                        "Bapak kamu tukang kebun ya? Soalnya kamu telah menaburkan benih cinta di hatiku.",
                        "Aku rela ikut lomba lari keliling dunia, asalkan garis finishnya itu kamu.",
                        "Kalau aku jadi gubernur, aku bakal ubah ibu kota jadi nama kamu.",
                        "Selain ada garuda di dadaku, di dadaku juga selalu ada kamu.",
                        "Kamu itu kaya pelangi ya, indahnya cuma sesaat tapi bikin senyum terus."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(gombalList) });
                }

                else if (type === 'pantun') {
                    const pantunList = [
                        "Beli paku di pasar malam, Kamu ngaku sayang tapi diam-diam.",
                        "Jalan-jalan ke kota Paris, Lihat cewek manis eh ternyata berkumis.",
                        "Burung perkutut burung kutilang, Kamunya cemberut akunya hilang.",
                        "Buah duku buah manggis, Eh lu ngaku manis padahal bau amis.",
                        "Makan duku di atas papan, Mukamu lucu tapi kayak tampan."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(pantunList) });
                }

                else if (type === 'truth') {
                    const truthList = [
                        "Kapan terakhir kali kamu ngompol di celana?",
                        "Siapa orang yang paling sering kamu kepoin di sosmed?",
                        "Pernahkah kamu diam-diam menyukai teman sekelas?",
                        "Apa kebohongan terbesar yang pernah kamu katakan ke orang tuamu?",
                        "Siapa nama mantan yang paling susah kamu lupain?",
                        "Pernah gak mandi seharian pas hari libur?"
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(truthList) });
                }

                else if (type === 'dare') {
                    const dareList = [
                        "Kirim pesan 'Aku sayang kamu' ke mantanmu sekarang!",
                        "Buat instastory nyanyi lagu Balonku pakai nada sedih.",
                        "Pakai kaus kaki terbalik sampai besok pagi.",
                        "Chat random kontak nomor urutan ke-7 di HP kamu dan bilang 'Aku kangen'.",
                        "Komen 'Cantik/Ganteng banget' di postingan IG orang yang gak kamu kenal.",
                        "Telepon orang tuamu dan bilang 'Terima kasih sudah melahirkanku' tanpa ketawa."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(dareList) });
                }

                else if (type === 'quotes') {
                    const quotesList = [
                        "Lebih baik dibenci karena menjadi diri sendiri, daripada dicintai karena menjadi orang lain.",
                        "Kadang kita harus rela melepaskan untuk melihatnya bahagia bersama yang lain.",
                        "Hujan selalu kembali jatuh meskipun ia tahu rasanya sakit.",
                        "Mencintaimu adalah patah hati yang paling aku sengaja.",
                        "Kita adalah dua orang yang saling mendoakan, tapi tak pernah ditakdirkan bersama."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(quotesList) });
                }

                else if (type === 'katabijak') {
                    const bijakList = [
                        "Jangan menyerah, penderitaanmu hari ini adalah kekuatanmu esok hari.",
                        "Menyerah bukan berarti lemah, terkadang kamu sudah cukup kuat untuk melepaskan.",
                        "Masa depan adalah milik mereka yang percaya pada keindahan mimpi-mimpi mereka.",
                        "Kegagalan adalah bumbu yang memberikan kesuksesan rasanya.",
                        "Lakukan apa yang bisa kamu lakukan hari ini, jangan tunda sampai besok."
                    ];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: getRandom(bijakList) });
                }

                else if (type === 'tebakumur') {
                    if (!funName) return res.status(400).json({ status: false, message: "Parameter 'name' wajib!" });
                    const umur = Math.floor(Math.random() * (80 - 10 + 1)) + 10;
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: { nama: funName, tebakan_umur: `${umur} Tahun`, komentar: umur > 50 ? "Wah udah tuwir yak" : umur < 17 ? "Masih bocil rupanya" : "Lagi masa emasnya nih!" } });
                }

                else if (type === 'tts') {
                    if (!inputTeks) return res.status(400).json({ status: false, message: "Parameter 'text' wajib!" });
                    const bahasa = lang || 'id';
                    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(inputTeks)}&tl=${bahasa}&client=tw-ob`;

                    const response = await axios.get(googleTtsUrl, {
                        headers: { 'User-Agent': 'Mozilla/5.0' },
                        responseType: 'arraybuffer'
                    });

                    res.setHeader('Content-Type', 'audio/mpeg');
                    return res.status(200).send(response.data);
                }

                else {
                    return res.status(404).json({ status: false, message: `Endpoint fun '${type}' belum tersedia.` });
                }

            } catch (error) {
                return res.status(500).json({ status: false, message: "Server error", detail: error.message });
            }
        }

        // ==========================================
        // 14. KATEGORI: ISLAM
        // ==========================================
        else if (kategori === 'islam') {
            try {
                if (type === 'quran') {
                    if (!surah || !ayat) return res.status(400).json({ status: false, message: "Parameter 'surah' dan 'ayat' wajib diisi!" });
                    const response = await axios.get(`https://equran.id/api/v2/surat/${surah}`);
                    const dataAyat = response.data.data.ayat.find(a => a.nomorAyat == ayat);
                    if (!dataAyat) return res.status(404).json({ status: false, message: "Ayat tidak ditemukan." });
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: dataAyat });

                } else if (type === 'jadwalsholat') {
                    if (!q) return res.status(400).json({ status: false, message: "Masukkan nama kota pada parameter 'q'!" });
                    const searchKota = await axios.get(`https://api.myquran.com/v2/sholat/kota/cari/${q}`);
                    if (searchKota.data.data.length === 0) return res.status(404).json({ status: false, message: "Kota tidak ditemukan." });
                    const idKota = searchKota.data.data[0].id;
                    const date = new Date().toISOString().split('T')[0].replace(/-/g, '/');
                    const jadwal = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${date}`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: jadwal.data.data });

                } else if (type === 'tebak-nabi') {
                    const response = await axios.get(`https://raw.githubusercontent.com/Pandaid-Official/Pandaid-Lib/main/islam/kisahnabi.json`);
                    const data = response.data;
                    const nabiAcak = data[Math.floor(Math.random() * data.length)];
                    return res.status(200).json({
                        status: true, creator: "InuutyzDev",
                        result: {
                            pertanyaan: "Siapakah nabi yang memiliki mukjizat berikut?",
                            clue: nabiAcak.description.substring(0, 200) + "...",
                            jawaban: nabiAcak.name
                        }
                    });

                } else if (type === 'doa') {
                    const response = await axios.get(`https://doa-doa-harian-api.vercel.app/adsyatir73/all`);
                    const doaAcak = response.data.data[Math.floor(Math.random() * response.data.data.length)];
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: doaAcak });

                } else if (type === 'hadits') {
                    const kitab = q || 'bukhari';
                    const nomor = ayat || 1;
                    const response = await axios.get(`https://api.hadith.gading.dev/books/${kitab}/${nomor}`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'asmaulhusna') {
                    const response = await axios.get(`https://raw.githubusercontent.com/pajang/pajang-data/master/asmaul-husna.json`);
                    if (q) {
                        const husna = response.data.find(h => h.index == q);
                        if (!husna) return res.status(404).json({ status: false, message: "Nomor Asmaul Husna tidak ditemukan." });
                        return res.status(200).json({ status: true, creator: "InuutyzDev", result: husna });
                    }
                    const randomHusna = response.data[Math.floor(Math.random() * response.data.length)];
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: randomHusna });

                } else if (type === 'niatsholat') {
                    const response = await axios.get(`https://raw.githubusercontent.com/niat-sholat-api/niat-sholat-api/main/data/niat-sholat.json`);
                    if (q) {
                        const niat = response.data.find(n => n.name.toLowerCase().includes(q.toLowerCase()));
                        if (!niat) return res.status(404).json({ status: false, message: "Niat sholat tidak ditemukan." });
                        return res.status(200).json({ status: true, creator: "InuutyzDev", result: niat });
                    }
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data });

                } else if (type === 'ayatkursi') {
                    const response = await axios.get(`https://pencari-hadits-api.vercel.app/api/ayatkursi`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'tahlil') {
                    const response = await axios.get(`https://raw.githubusercontent.com/Zhirrr/islamic-rest-api-indonesian/refs/heads/main/data/tahlil.json`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'wirid') {
                    const response = await axios.get(`https://raw.githubusercontent.com/Zhirrr/islamic-rest-api-indonesian/refs/heads/main/data/wirid.json`);
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: response.data.data });

                } else if (type === 'doapahlawan') {
                    const response = await axios.get(`https://doa-doa-harian-api.vercel.app/adsyatir73/all`);
                    const pahlawan = response.data.data.find(d => d.doa.toLowerCase().includes('pahlawan') || d.doa.toLowerCase().includes('arwah'));
                    if (!pahlawan) return res.status(404).json({ status: false, message: "Doa spesifik pahlawan tidak ditemukan, silakan gunakan fitur 'doa' umum." });
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: pahlawan });

                } else if (type === 'daftarsurat') {
                    const response = await axios.get(`https://equran.id/api/v2/surat`);
                    let cleanData = response.data.data || response.data;
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });

                } else if (type === 'artisurat' || type === 'tafsir') {
                    if (!surah) return res.status(400).json({ status: false, message: "Parameter 'surah' (nomor surat) wajib diisi!" });
                    const response = await axios.get(`https://equran.id/api/v2/tafsir/${surah}`);
                    let cleanData = response.data.data || response.data;
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: cleanData });

                } else if (type === 'audiosurat') {
                    if (!surah) return res.status(400).json({ status: false, message: "Parameter 'surah' wajib diisi!" });
                    const response = await axios.get(`https://equran.id/api/v2/surat/${surah}`);
                    const data = response.data.data;
                    return res.status(200).json({
                        status: true, creator: "InuuTyzDev",
                        result: { nama_surat: data.namaLatin, audio_full: data.audioFull }
                    });

                } else if (type === 'zikir') {
                    const waktu = q === 'petang' ? 'petang' : 'pagi';
                    const response = await axios.get(`https://raw.githubusercontent.com/Zhirrr/islamic-rest-api-indonesian/refs/heads/main/data/zikir${waktu}.json`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.data });

                } else if (type === 'puasa') {
                    const listPuasa = [
                        { niat: "Ramadhan", bacaan: "Nawaitu shauma ghadin 'an ada'i fardhi syahri Ramadhana hadzihis sanati lillahi ta'ala." },
                        { niat: "Senin", bacaan: "Nawaitu shauma yaumil itsnaini sunnatan lillahi ta'ala." },
                        { niat: "Kamis", bacaan: "Nawaitu shauma yaumil khamisi sunnatan lillahi ta'ala." },
                        { niat: "Buka Puasa", bacaan: "Allahumma laka shumtu wa bika amantu wa 'ala rizqika afthartu birahmatika ya arhamar rahimin." }
                    ];
                    if (q) {
                        const hasil = listPuasa.find(p => p.niat.toLowerCase().includes(q.toLowerCase()));
                        if (hasil) return res.status(200).json({ status: true, creator: "InuuTyzDev", result: hasil });
                    }
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: listPuasa });

                } else if (type === 'kisahnabi') {
                    if (!q) return res.status(400).json({ status: false, message: "Masukkan nama nabi pada parameter 'q'!" });
                    const response = await axios.get(`https://raw.githubusercontent.com/Pandaid-Official/Pandaid-Lib/main/islam/kisahnabi.json`);
                    const kisah = response.data.find(n => n.name.toLowerCase() === q.toLowerCase());
                    if (!kisah) return res.status(404).json({ status: false, message: "Kisah nabi tidak ditemukan." });
                    return res.status(200).json({ status: true, creator: "InuutyzDev", result: kisah });

                } else {
                    return res.status(404).json({ status: false, message: `Type islam '${type}' tidak ditemukan!` });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Internal Server Error" });
            }
        }

        // ==========================================
        // 15. KATEGORI: BERITA
        // ==========================================
        else if (kategori === 'berita') {
            try {
                if (type === 'detik') {
                    const response = await axios.get(`https://api-berita-indonesia.vercel.app/detik/terbaru/`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.data.posts });

                } else if (type === 'cnbc') {
                    const response = await axios.get(`https://api-berita-indonesia.vercel.app/cnbc/terbaru/`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.data.posts });

                } else if (type === 'antara') {
                    const response = await axios.get(`https://api-berita-indonesia.vercel.app/antara/terbaru/`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.data.posts });

                } else if (type === 'kompas') {
                    const response = await axios.get(`https://api-berita-indonesia.vercel.app/kompas/terbaru/`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.data.posts });

                } else {
                    return res.status(404).json({ status: false, message: `Tipe berita '${type}' tidak tersedia!` });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Gagal mengambil data berita." });
            }
        }

// ==========================================
// 16. KATEGORI: ENTERTAINMENT
// ==========================================
// ==========================================
// 16. KATEGORI: ENTERTAINMENT
// ==========================================
else if (kategori === 'entertainment') {
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];
    const creator = "InuuTyzDev";

    const localTypes = [
        'fakta', 'darkjoke', 'pantun', 'gombal', 'kata-lucu', 'kata-sad',
        'pickline', 'tekateki', 'caklontong', 'tebak-jenaka', 'motivasi',
        'asahi', 'susunkata', 'siapakah-aku', 'tebak-kata', 'tebak-lirik',
        'cerpen', 'puisi', 'tebak-gambar', 'tebak-kabupaten', 'tebak-bendera',
        'tebak-kimia'
    ];

    try {
        if (localTypes.includes(type)) {
            const { createRequire } = await import('module');
            const require = createRequire(import.meta.url);
            const entertainmentData = require('../../database/entertainment.json');
            const data = entertainmentData[type];
            if (!data) return res.status(404).json({ status: false, creator, message: `Type '${type}' tidak ditemukan!` });
            return res.status(200).json({ status: true, creator, result: getRandom(data) });

        } else if (type === 'quotes') {
            const resData = await axios.get('https://zenquotes.io/api/random');
            return res.status(200).json({ status: true, creator, result: resData.data[0]?.q || "Tidak ada quotes." });

        } else if (type === 'meme') {
            const resData = await axios.get('https://meme-api.com/gimme');
            return res.status(200).json({ status: true, creator, result: { title: resData.data.title, url: resData.data.url } });

        } else if (type === 'hilih') {
            if (!q) return res.status(400).json({ status: false, creator, message: "Masukkan parameter q!" });
            const result = q.replace(/[aiueo]/gi, 'i');
            return res.status(200).json({ status: true, creator, result });

        } else if (type === 'genshin') {
            const response = await axios.get('https://genshin.jmp.blue/characters/all?lang=en');
            return res.status(200).json({ status: true, creator, result: getRandom(response.data) });

        } else if (type === 'estetik') {
            const list = [
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b"
            ];
            return res.status(200).json({ status: true, creator, result: getRandom(list) });

        } else {
            return res.status(404).json({ status: false, creator, message: `Type entertainment '${type}' tidak ditemukan!` });
        }

    } catch (e) {
        return res.status(500).json({ status: false, creator, message: "Error saat mengambil data hiburan: " + e.message });
    }
}

        // ==========================================
        // 17. KATEGORI: PRIMBON
        // ==========================================
        else if (kategori === 'primbon') {
            try {
                if (type === 'artinama') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/artinama?name=${encodeURIComponent(q)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'artimimpi') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (mimpi) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/artimimpi?query=${encodeURIComponent(q)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'jodoh') {
                    const { nama1, nama2 } = req.query;
                    if (!nama1 || !nama2) return res.status(400).json({ status: false, message: "Parameter 'nama1' & 'nama2' wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/jodoh?name1=${encodeURIComponent(nama1)}&name2=${encodeURIComponent(nama2)}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'watak') {
                    const { tgl, bln, thn } = req.query;
                    if (!tgl || !bln || !thn) return res.status(400).json({ status: false, message: "Parameter 'tgl', 'bln', 'thn' wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/tanggal_lahir?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'nasib') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/ramalan_nasib?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'zodiak') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama zodiak) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/zodiak?query=${q.toLowerCase()}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'shio') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nama shio) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/shio?query=${q.toLowerCase()}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'nomorhoki') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (nomor HP) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/nomor_hoki?number=${q}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'garistangan') {
                    const list = ["Garis hidupmu kuat, panjang umur.", "Garis cinta bercabang, hati-hati.", "Garis sukses terlihat jelas di usia 30-an."];
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: list[Math.floor(Math.random() * list.length)] });

                } else if (type === 'rezeki') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/rejeki_harian?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'haribaik') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/hari_baik?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'harilarangan') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/hari_larangan?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'arahrezeki') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/arah_rejeki?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'pekerjaan') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/pekerjaan_weton?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'usaha') {
                    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (tanggal lahir: 14-05-2026) wajib diisi!" });
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/sifat_usaha?date=${q}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else if (type === 'pranatamangsa') {
                    const { tgl, bln, thn } = req.query;
                    const response = await axios.get(`https://api.lolhuman.xyz/api/primbon/pranata_mangsa?tanggal=${tgl}&bulan=${bln}&tahun=${thn}`);
                    return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data.result });

                } else {
                    return res.status(404).json({ status: false, message: "Tipe primbon tidak ditemukan!" });
                }
            } catch (e) {
                return res.status(500).json({ status: false, message: "Gagal memproses data Primbon." });
            }
        }

        // ==========================================
        // 18. KATEGORI: IDOL
        // ==========================================
        else if (kategori === 'idol') {
    const creator = "InuuTyzDev";

    try {
        const queryMap = {
            jkt48: "JKT48 member",
            blackpink: "Blackpink aesthetic photo",
            newjeans: "NewJeans kpop hd",
            ive: "IVE kpop member",
            twice: "Twice kpop",
            aespa: "Aespa kpop icon",
            lesserafim: "Le Sserafim aesthetic",
            babymonster: "BabyMonster kpop",
            bts: "BTS member portrait",
            exo: "EXO kpop"
        };

        const targetSearch = queryMap[type.toLowerCase()] || `${type} kpop`;
        // Menggunakan keyword "pinterest" alih-alih filter site:pinterest.com agar hasil lebih banyak & tidak mudah diblokir Bing
        const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(targetSearch + " pinterest")}`;

        const response = await axios.get(searchUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        // 1. Ekstrak gambar langsung dari JSON murl milik Bing (Jauh lebih akurat dari sekadar regex biasa)
        const regex = /"murl":"(https:\/\/[^"]+?\.(?:jpg|jpeg|png))"/gi;
        let matches = [];
        let match;
        
        while ((match = regex.exec(response.data)) !== null) {
            matches.push(match[1]); // Mengambil URL asli yang berkualitas tinggi
        }

        if (matches.length === 0) {
            return res.status(404).json({ status: false, creator, message: `Gagal mendapatkan daftar foto untuk '${type}'.` });
        }

        // 2. Acak urutan puluhan link yang didapat agar hasil selalu berbeda
        const shuffledImages = matches.sort(() => 0.5 - Math.random());
        
        let validImageBuffer = null;
        let validContentType = '';

        // 3. VALIDATION LOOP: Coba download satu-satu sampai berhasil
        for (const imgUrl of shuffledImages) {
            // Abaikan link dari domain yang suka memblokir request bot
            if (imgUrl.includes('bing.net') || imgUrl.includes('fbcdn')) continue;

            try {
                const imgRes = await axios.get(imgUrl, { 
                    responseType: 'arraybuffer',
                    timeout: 4000, // Maksimal tunggu 4 detik per foto. Kalau lemot, langsung cari foto lain.
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });

                // 4. CEK KETAT: Pastikan yang didapat benar-benar gambar (Mencegah error HTML BabyMonster)
                const contentType = imgRes.headers['content-type'] || '';
                if (imgRes.status === 200 && contentType.startsWith('image/')) {
                    validImageBuffer = imgRes.data;
                    validContentType = contentType;
                    break; // FOTO VALID DITEMUKAN! Hentikan loop.
                }
            } catch (err) {
                // Jika error 404 (mati) atau 403 (terblokir), sistem diam saja dan lanjut ke foto berikutnya.
                continue; 
            }
        }

        // 5. Kirim gambar ke pengguna
        if (validImageBuffer) {
            res.setHeader('Content-Type', validContentType);
            return res.status(200).send(validImageBuffer);
        } else {
            return res.status(500).json({ 
                status: false, 
                creator, 
                message: "Sistem gagal mengekstrak atau mendownload gambar yang valid saat ini." 
            });
        }

    } catch (e) {
        console.error(e);
        return res.status(500).json({ status: false, creator, message: "Terjadi kesalahan server internal." });
    }
}




        // ==========================================
        // 19. KATEGORI: ANIME
        // ==========================================
        else if (kategori === 'anime') {
    const creator = "InuuTyzDev";
    const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

    const localAnimeTypes = [
        'waifu', 'neko', 'husbu', 'rem', 'emilia', 'elaina', 
        'miku', 'shinobu', 'megumin', 'bluearchive', 'genshin', 'wallpaper'
    ];

    try {
        // --- 1. PERBAIKAN SCRAPER QUOTES ANIME (OTAKOTAKU) ---
        if (type === 'quotes-anime') {
            const { data } = await axios.get('https://otakotaku.com/quote/feed', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
                }
            });
            const cheerio = require('cheerio');
            const $ = cheerio.load(data);
            const hasil = [];

            // Selector yang lebih spesifik untuk mengambil data quotes
            $('.quote-item').each((i, el) => {
                const quoteText = $(el).find('.quote-content').text().trim();
                const charName = $(el).find('.quote-author').text().trim();
                const animeTitle = $(el).find('.quote-anime').text().trim();

                if (quoteText) {
                    hasil.push({
                        quote: quoteText,
                        karakter: charName.replace('~ ', ''),
                        anime: animeTitle
                    });
                }
            });

            if (hasil.length === 0) return res.status(404).json({ status: false, creator, message: "Quotes tidak ditemukan atau sedang maintenance." });
            
            return res.status(200).json({ 
                status: true, 
                creator, 
                result: getRandom(hasil) 
            });
        }

        // --- 2. LOGIKA GAMBAR (DIRECT SEND - FIX ERROR 500) ---
        let imageUrl;
        if (type === 'random-anime') {
            const allKeys = Object.keys(animeData); // animeData dari require di atas
            const randomKey = getRandom(allKeys);
            imageUrl = getRandom(animeData[randomKey]);
        } else if (localAnimeTypes.includes(type)) {
            imageUrl = getRandom(animeData[type]);
        }

        if (imageUrl) {
            const response = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });

            // Gunakan setHeader agar sama dengan ai-image (anti res.set error)
            res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
            return res.status(200).send(response.data);
        } else {
            return res.status(404).json({ 
                status: false, 
                creator, 
                message: `Type '${type}' tidak terdaftar.` 
            });
        }

    } catch (e) {
        return res.status(500).json({ 
            status: false, 
            creator, 
            message: "Error: " + e.message 
        });
    }
}




        // ==========================================
        // 20. KATEGORI: MOVIE
        // ==========================================
        else if (kategori === 'movie') {
    const keyword = q || query || searchText;
    const baseUrl = "https://api.cuki.biz.id";

    try {
        let response;
        if (type === 'melolo-home') {
            response = await axios.get(`${baseUrl}/api/movie/melolo-home?apikey=${apiKeyCuki}`);
        } else if (type === 'melolo-search') {
            if (!keyword) return res.status(400).json({ status: false, message: "Masukkan query pencarian!" });
            response = await axios.get(`${baseUrl}/api/movie/melolo-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}`);
        } else if (type === 'melolo-detail' || type === 'melolo-download') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter URL wajib diisi!" });
            const endpoint = type === 'melolo-detail' ? 'melolo-detail' : 'melolo-download';
            response = await axios.get(`${baseUrl}/api/movie/${endpoint}?apikey=${apiKeyCuki}&url=${encodeURIComponent(url)}`);
        } else if (type === 'donghua-search') {
            response = await axios.get(`${baseUrl}/api/movie/donghua-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}&page=${page || 1}`);
        } else if (type === 'netflix-trending') {
            response = await axios.get(`${baseUrl}/api/movie/netflix-trending?apikey=${apiKeyCuki}&language=${language || 'id'}`);
        } else if (type === 'pusatfilm-search') {
            response = await axios.get(`${baseUrl}/api/movie/pusatfilm21-search?apikey=${apiKeyCuki}&query=${encodeURIComponent(keyword)}&type=search`);
        }
        // ... tambahkan else if untuk type movie lainnya sesuai kebutuhan

        if (!response) return res.status(404).json({ status: false, message: "Type movie tidak ditemukan." });

        // --- PROSES CLEANUP CREATOR ---
        let finalResult = response.data.result || response.data;
        if (typeof finalResult === 'object' && finalResult !== null) {
            delete finalResult.creator; // Menghapus creator "cuki digital"
        }

        return res.status(200).json({ 
            status: true, 
            creator: "InuuTyzDev", 
            result: finalResult 
        });

    } catch (e) {
        return res.status(500).json({ status: false, message: "Gagal menyambung ke server movie." });
    }
}



        // ==========================================
        // JIKA KATEGORI TIDAK DIKENAL
        // ==========================================
        else {
            return res.status(404).json({ status: false, message: `Kategori '${kategori}' tidak ditemukan!` });
        }

    } catch (e) {
        // CATCH GLOBAL - Tangkap semua error agar Vercel tidak crash
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: "Terjadi kesalahan sistem: " + e.message });
    }
}
