import axios from 'axios';
// (cheerio disiapkan agar kalau kamu mau buat web scraper sendiri nanti, alatnya sudah ada)
import * as cheerio from 'cheerio'; 

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, q } = req.query;

    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (kata kunci) wajib diisi!" });

    try {
        // --- SPOTIFY SEARCH ---
        if (type === 'spotify') {
            const response = await axios.get(`https://api.yupra.my.id/api/search/spotify?q=${encodeURIComponent(q)}`);
            return res.status(200).json({ 
                status: true, 
                creator: "InuuTyzDev", 
                result: response.data 
            });
        }
        // --- PINTEREST (Masih Placeholder) ---
        else if (type === 'pinterest') {
            // TODO: Ganti dengan API asli jika sudah ada
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari pinterest: ${q}` });
        } 
        // --- TIKTOK SEARCH (Masih Placeholder) ---
        else if (type === 'tiktok') {
            // TODO: Ganti dengan API asli jika sudah ada
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari tiktok: ${q}` });
        } 
        // --- YOUTUBE SEARCH (Masih Placeholder) ---
        else if (type === 'yts') {
            // TODO: Ganti dengan API asli jika sudah ada
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari youtube: ${q}` });
        } 
        // --- ERROR HANDLING ---
        else {
            return res.status(400).json({ status: false, message: `Type search '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
