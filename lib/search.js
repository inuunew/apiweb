import axios from 'axios';
import * as cheerio from 'cheerio'; 

export async function handleSearch(req, res) {
    // POTONG URL SECARA MANUAL UNTUK MENDAPATKAN 'type'
    const type = req.url.split('?')[0].split('/').pop();
    
    // Trik Pro: Menangkap berbagai macam nama parameter (q, query, hero)
    const { q, query, hero } = req.query;


    // Menyatukan kata kunci ke dalam satu variabel agar codingan lebih bersih
    const keyword = q || query || hero;

    if (!keyword) return res.status(400).json({ status: false, message: "Parameter kata kunci pencarian wajib diisi!" });

    try {
        // --- SPOTIFY SEARCH ---
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
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
