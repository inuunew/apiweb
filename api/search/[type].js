import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, q } = req.query;

    if (!q) return res.status(400).json({ status: false, message: "Parameter 'q' (kata kunci) wajib diisi!" });

    try {
        if (type === 'pinterest') {
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari pinterest: ${q}` });
        } 
        else if (type === 'tiktok') {
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari tiktok: ${q}` });
        } 
        else if (type === 'yts') {
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil mencari youtube: ${q}` });
        } 
        else {
            return res.status(400).json({ status: false, message: `Type search '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
