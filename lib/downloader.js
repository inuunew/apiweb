import axios from 'axios';
import * as cheerio from 'cheerio';

export async function handleDownloader(req, res) {
    // Potong URL secara manual untuk mendapatkan 'type'
    const type = req.url.split('?')[0].split('/').pop();
    const { url } = req.query;


    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi" });

    try {
        // --- KELOMPOK API SIPUTZX ---
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
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
