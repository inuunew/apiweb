import axios from 'axios';
import * as cheerio from 'cheerio'; 

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Trik Pro: Menangkap berbagai macam nama parameter (q, query, hero)
    const { type, q, query, hero } = req.query;

    // Menyatukan kata kunci ke dalam satu variabel agar codingan lebih bersih
    const keyword = q || query || hero;

    if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci pencarian wajib diisi!" });

    try {
        // --- SPOTIFY SEARCH ---
        if (type === 'spotify') {
            const response = await axios.get(`https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(keyword)}`);
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
        }
        // --- FITUR BARU: GSM ARENA SEARCH ---
        else if (type === 'gsm') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/gsm?query=${encodeURIComponent(keyword)}`);
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
        }
        // --- FITUR BARU: MLBB HERO DETAIL ---
        else if (type === 'mlbb') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/mlbbdetail?hero=${encodeURIComponent(keyword)}`);
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
        }
        // --- FITUR BARU: APP SEARCH ---
        else if (type === 'appsearch') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/appsearch?query=${encodeURIComponent(keyword)}`);
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
        }
        // --- FITUR BARU: LAZADA SEARCH ---
        else if (type === 'lazada') {
            const response = await axios.get(`https://www.neoapis.xyz/api/search/lazada?query=${encodeURIComponent(keyword)}`);
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: response.data });
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
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
