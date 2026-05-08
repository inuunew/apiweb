import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Ambil parameter type dan q (query pencarian) dari URL
    const { type, q } = req.query;

    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (kata kunci) wajib diisi!" });

    try {
        if (type === 'pinterest') {
            // Taruh logika scraper Pinterest di sini nanti
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari pinterest: ${q}` });
        } 
        else if (type === 'tiktok') {
            // Taruh logika scraper TikTok Search di sini nanti
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari tiktok: ${q}` });
        } 
        else if (type === 'yts') {
            // Taruh logika scraper YouTube Search di sini nanti
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari youtube: ${q}` });
        } 
        else {
            return res.status(400).json({ status: false, message: "Type search tidak valid" });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
