import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const { type, url, device } = req.query;

    if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });

    try {
        if (type === 'shorturl') {
            // Taruh logika pemendek URL di sini nanti
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
        } 
        else if (type === 'ssweb') {
            // Taruh logika Screenshot Web di sini nanti
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `Berhasil SS web: ${url} (Device: ${device || 'desktop'})` });
        } 
        else {
            return res.status(400).json({ status: false, message: "Type tools tidak valid" });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
