import axios from 'axios';

export default async function handler(req, res) {
    // 1. Mengatur CORS Headers (disesuaikan dengan gaya keamanan getcode-mu)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Ambil parameter dari URL
    const { type, url, device, domain, query, country } = req.query;

    try {
        if (type === 'shorturl') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });
            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: `URL berhasil dipendekkan: ${url}` });
        } 
        else if (type === 'ssweb') {
            if (!url) return res.status(400).json({ status: false, message: "Parameter 'url' wajib diisi!" });

            const payload = { 
                url: url,
                device: device || "desktop" 
            };

            const { data } = await axios.post('https://gcp.imagy.app/screenshot/createscreenshot', payload, {
                headers: {
                    'content-type': 'application/json',
                    'referer': 'https://imagy.app/full-page-screenshot-taker/'
                }
            });

            return res.status(200).json({ status: true, creator: "InuuTyzDev", result: data });
        } 
        else if (type === 'subdomain') {
            if (!domain) return res.status(400).json({ status: false, message: "Parameter 'domain' wajib diisi! (contoh: siputzx.my.id)" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/subdomains?domain=${domain}`);
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data.data
            });
        }
        else if (type === 'kodepos') {
            if (!query) return res.status(400).json({ status: false, message: "Parameter 'query' wajib diisi! (contoh: Lempuyang)" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/kodepos?form=${encodeURIComponent(query)}`);
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data.data || response.data 
            });
        }
        else if (type === 'countryinfo') {
            if (!country) return res.status(400).json({ status: false, message: "Parameter 'country' wajib diisi! (contoh: Indonesia)" });
            const response = await axios.get(`https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(country)}`);
            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: response.data.data || response.data
            });
        }
        // --- FITUR BARU: GET HTML CODE ---
        else if (type === 'getcode') {
            if (!url) return res.status(400).json({ status: false, message: "Harap sertakan parameter URL target!" });
            
            // Proses fetch ke website target dari sisi server menggunakan logikamu
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            });

            if (!response.ok) {
                throw new Error(`Website menolak akses. Status: ${response.status}`);
            }

            const html = await response.text();

            return res.status(200).json({
                status: true,
                creator: "InuuTyzDev",
                result: { html: html }
            });
        }
        else {
            return res.status(400).json({ status: false, message: `Type tools '${type}' tidak valid` });
        }
    } catch (e) {
        return res.status(500).json({ status: false, creator: "InuuTyzDev", message: e.message });
    }
}
